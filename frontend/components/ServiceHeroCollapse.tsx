
"use client";

import { useEffect, useRef } from "react";

/* =========================================================
   SERVICE DETAIL HERO — SCROLL COLLAPSE

   The hero's real box height is driven straight off
   `window.scrollY` on every frame (no CSS transition, no
   keyframes, no separate animation timeline) so it shrinks
   in lockstep with the scroll gesture and reverses exactly
   the same way on scroll-up. Because the section is a normal
   block element, the content that follows it in the DOM
   always sits directly underneath — there is no spacer, so
   there is never a gap to close.

   `min` height is measured from the actual back-link /
   eyebrow / title / underline block (`coreRef`), not a
   hardcoded number, so the title is never clipped — only the
   breathing room below it collapses away.

   Scoped to this component only — the Services listing page
   has its own, unrelated hero design.
========================================================= */

type ServiceHeroCollapseProps = {
    imageUrl: string;
    imageAlt: string;
    children: React.ReactNode;
};

export default function ServiceHeroCollapse({
    imageUrl,
    imageAlt,
    children,
}: ServiceHeroCollapseProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const coreRef = useRef<HTMLDivElement>(null);
    const boundsRef = useRef({ max: 0, min: 0, docTop: 0 });

    useEffect(() => {
        const section = sectionRef.current;
        const core = coreRef.current;

        if (!section || !core) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        function applyScroll() {
            const { max, min, docTop } = boundsRef.current;
            const range = max - min;

            const progress =
                range > 0
                    ? Math.min(
                          Math.max(
                              (window.scrollY - docTop) / range,
                              0
                          ),
                          1
                      )
                    : 0;

            section!.style.height = `${max - progress * range}px`;
        }

        function measure() {
            section!.style.height = "auto";

            const naturalHeight = section!.offsetHeight;
            const rectTop = section!.getBoundingClientRect().top;
            const coreBottom = core!.getBoundingClientRect().bottom;
            const buffer = 40;

            // `rect.top + scrollY` is the section's absolute position in
            // the document — invariant regardless of current scroll
            // offset, so this stays correct even when re-measured on
            // resize mid-scroll. It's what lets the collapse start
            // exactly when the hero reaches the top of the viewport
            // (below the sticky navbar) instead of the moment the page
            // starts scrolling.
            const docTop = rectTop + window.scrollY;

            const minHeight = Math.min(
                Math.max(coreBottom - rectTop + buffer, 120),
                naturalHeight
            );

            boundsRef.current = { max: naturalHeight, min: minHeight, docTop };

            if (prefersReducedMotion) {
                section!.style.height = `${naturalHeight}px`;
            } else {
                applyScroll();
            }
        }

        let ticking = false;

        function onScroll() {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                applyScroll();
                ticking = false;
            });
        }

        measure();

        if (!prefersReducedMotion) {
            window.addEventListener("scroll", onScroll, { passive: true });
        }

        window.addEventListener("resize", measure);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", measure);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="service-detail-hero relative isolate overflow-hidden"
        >
            <img
                src={imageUrl}
                alt={imageAlt}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
            />

            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#04121f]/70 via-[#04121f]/25 to-transparent" />

            <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 lg:py-32">
                <div ref={coreRef}>{children}</div>
            </div>
        </section>
    );
}
