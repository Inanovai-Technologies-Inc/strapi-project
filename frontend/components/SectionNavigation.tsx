"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

/* Order must mirror the rendered section order in app/page.tsx.
   Disabled sections (global-presence, news) are intentionally
   omitted so no dead dot is shown. */
const sections = [
    { id: "home" },
    { id: "about" },
    { id: "diffs" },
    { id: "industries" },
    { id: "products" },
    { id: "certifications" },
    { id: "request-quote" },
];

export default function SectionNavigation() {
    const { t } = useI18n();
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const elements = sections
            .map((section) => document.getElementById(section.id))
            .filter((element): element is HTMLElement => Boolean(element));

        if (elements.length === 0) return;

        const visibleIds = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleIds.add(entry.target.id);
                    } else {
                        visibleIds.delete(entry.target.id);
                    }
                });

                // The active section is the first one (in page order)
                // currently crossing the vertical centre of the viewport,
                // so there is always exactly one active dot.
                const current = sections.find((section) =>
                    visibleIds.has(section.id)
                );

                if (current) {
                    setActiveSection(current.id);
                }
            },
            {
                rootMargin: "-45% 0px -45% 0px",
                threshold: 0,
            }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);

        if (!element) return;

        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 md:block">

            <div className="flex flex-col items-center gap-4">

                {sections.map((section) => {
                    const label = t(`sectionNav.${section.id}`);

                    return (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        aria-label={`${t("sectionNav.goTo")} ${label}`}
                        className="group relative flex items-center"
                    >

                        {/* Tooltip */}
                        <span
                            className="
                                pointer-events-none
                                absolute
                                right-7
                                whitespace-nowrap
                                rounded-md
                                bg-gray-900/90
                                px-3
                                py-1.5
                                text-xs
                                text-white
                                opacity-0
                                transition
                                group-hover:opacity-100
                            "
                        >
                            {label}
                        </span>

                        {/* Dot — double outline (light border + dark ring)
                            so it stays visible on both dark and white
                            section backgrounds */}
                        <span
                            className={`
                                block
                                rounded-full
                                border
                                transition-all
                                duration-300
                                ${
                                    activeSection === section.id
                                        ? "h-3 w-3 border-orange-500 bg-orange-500 shadow-[0_0_0_1.5px_rgba(255,255,255,0.6)]"
                                        : "h-2.5 w-2.5 border-gray-300 bg-white/70 shadow-[0_0_0_1.5px_rgba(2,9,20,0.25)] hover:border-orange-400 hover:bg-orange-400"
                                }
                            `}
                        />

                    </button>
                    );
                })}

            </div>

        </div>
    );
}