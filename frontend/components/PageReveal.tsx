"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageRevealProps {
    children: ReactNode;
}

/**
 * Adds the standard reveal animation to each top-level section on every route.
 * Individual Reveal components can still be used inside a section for staggered
 * content, as on the home page.
 */
export default function PageReveal({ children }: PageRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const container = ref.current;

        if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const sections = Array.from(
            container.querySelectorAll<HTMLElement>("main > section")
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("page-reveal--visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px",
            }
        );

        sections.forEach((section) => {
            section.classList.add("page-reveal");
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, [pathname]);

    return <div ref={ref}>{children}</div>;
}
