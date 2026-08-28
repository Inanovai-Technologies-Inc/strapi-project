"use client";

import { useId } from "react";
import type { CSSProperties } from "react";

/* =========================================================
   AMBIENT BACKGROUND

   A purely decorative, GPU-friendly background layer shared
   across the site so every page reads as one system:

     • drifting glowing gradient orbs (fire + a cool tech tint)
     • an animated engineering blueprint grid
     • abstract dashed "route" paths with beacons and an
       energy pulse
     • a travelling light trail / navigation marker
     • rising embers (fire-protection theme)
     • a slow diagonal light sweep

   Everything is transform/opacity only, sits at z-index 0
   behind lifted content, ignores pointer events, is hidden
   from assistive tech, and collapses on small screens and
   for `prefers-reduced-motion`. All timing/appearance lives
   in globals.css (`.ambient-fx*`).
========================================================= */

type Tone = "auto" | "navy" | "dark";
type Density = "full" | "soft";

const EMBERS = Array.from({ length: 16 }, (_, index) => index);

interface AmbientBackgroundProps {
    /** Palette tuning for the surface it sits on. */
    tone?: Tone;
    /** `soft` drops the sweep and thins the embers for content-dense areas. */
    density?: Density;
    /** Extra classes (e.g. opacity or positioning overrides). */
    className?: string;
}

export default function AmbientBackground({
    tone = "auto",
    density = "full",
    className = "",
}: AmbientBackgroundProps) {
    /* Unique per instance so multiple layers on one page don't collide.
       Strip any characters React's useId may include that aren't valid in a
       CSS/SVG fragment reference. */
    const uid = `afx${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const arc1 = `${uid}-arc1`;
    const arc2 = `${uid}-arc2`;
    const streakGrad = `${uid}-streak`;

    const classes = [
        "ambient-fx",
        "pointer-events-none",
        `ambient-fx--${density}`,
        tone !== "auto" ? `ambient-fx--${tone}` : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} aria-hidden="true">

            {/* Glowing gradient orbs */}
            <span className="ambient-fx__orb ambient-fx__orb--a" />
            <span className="ambient-fx__orb ambient-fx__orb--b" />
            <span className="ambient-fx__orb ambient-fx__orb--c" />

            {/* Engineering blueprint grid */}
            <div className="ambient-fx__grid" />

            {/* Abstract routes / circuitry with a travelling light trail */}
            <svg
                className="ambient-fx__lines"
                viewBox="0 0 1440 600"
                preserveAspectRatio="none"
                fill="none"
            >
                <defs>
                    <linearGradient
                        id={streakGrad}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                    >
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
                        <stop
                            offset="55%"
                            stopColor="#fb923c"
                            stopOpacity="0.55"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffedd5"
                            stopOpacity="0.9"
                        />
                    </linearGradient>
                </defs>

                <path
                    id={arc1}
                    className="ambient-fx__path"
                    d="M-60 420C260 300 520 470 780 350S1240 150 1520 300"
                />
                <path
                    id={arc2}
                    className="ambient-fx__path"
                    d="M-60 520C220 400 360 560 640 430S1080 220 1520 380"
                />

                <circle className="ambient-fx__node" cx="780" cy="350" r="3.4" />
                <circle className="ambient-fx__node" cx="640" cy="430" r="3" />
                <circle className="ambient-fx__pulse" cx="780" cy="350" r="14" />

                {/* Aircraft-style light trail */}
                <g className="ambient-fx__traveler">
                    <line
                        className="ambient-fx__streak"
                        x1="-14"
                        y1="0"
                        x2="10"
                        y2="0"
                        stroke={`url(#${streakGrad})`}
                    />
                    <animateMotion
                        dur="26s"
                        repeatCount="indefinite"
                        rotate="auto"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.3 0 0.2 1"
                    >
                        <mpath href={`#${arc1}`} />
                    </animateMotion>
                </g>

                {/* Navigation marker */}
                <g className="ambient-fx__traveler">
                    <circle className="ambient-fx__marker" r="2.8" />
                    <animateMotion
                        dur="34s"
                        begin="-12s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.42 0 0.58 1"
                    >
                        <mpath href={`#${arc2}`} />
                    </animateMotion>
                </g>
            </svg>

            {/* Diagonal light sweep */}
            <span className="ambient-fx__sweep" />

            {/* Rising embers */}
            <div className="ambient-fx__embers">
                {EMBERS.map((ember) => (
                    <span
                        key={ember}
                        className="ambient-fx__ember"
                        style={
                            {
                                "--x": `${(ember * 61) % 100}%`,
                                "--d": `${9 + (ember % 6) * 2.4}s`,
                                "--delay": `${(ember % 8) * -2.1}s`,
                                "--s": `${
                                    ember % 5 === 0
                                        ? 5
                                        : ember % 3 === 0
                                          ? 4
                                          : 3
                                }px`,
                                "--drift": `${((ember % 5) - 2) * 22}px`,
                            } as CSSProperties
                        }
                    />
                ))}
            </div>
        </div>
    );
}
