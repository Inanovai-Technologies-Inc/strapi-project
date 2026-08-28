"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/I18nProvider";

const sections = [
    { id: "home" },
    { id: "about" },
    { id: "products" },
    { id: "industries" },
    { id: "contact" },
];

export default function SectionNavigation() {
    const { t } = useI18n();
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sections.forEach((section) => {
            const element = document.getElementById(section.id);

            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(section.id);
                    }
                },
                {
                    threshold: 0.35,
                }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
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

                        {/* Dot */}
                        <span
                            className={`
                                block
                                rounded-full
                                border
                                transition-all
                                duration-300
                                ${
                                    activeSection === section.id
                                        ? "h-3 w-3 border-orange-500 bg-orange-500"
                                        : "h-2 w-2 border-white/50 bg-white/30 hover:bg-orange-400"
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