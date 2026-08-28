import type { CSSProperties } from "react";

const PARTICLES = Array.from({ length: 18 }, (_, index) => index);

/** Lightweight decorative engineering motion for the homepage hero. */
export default function HomeMotion() {
    return (
        <div className="home-motion" aria-hidden="true">
            <div className="home-motion__particles">
                {PARTICLES.map((particle) => (
                    <span
                        key={particle}
                        className="home-motion__particle"
                        style={{
                            "--particle-x": `${(particle * 37) % 96}%`,
                            "--particle-y": `${(particle * 53) % 82}%`,
                            "--particle-delay": `${(particle % 7) * -0.85}s`,
                            "--particle-size": `${particle % 4 === 0 ? 4 : 2}px`,
                        } as CSSProperties}
                    />
                ))}
            </div>

            <svg className="home-motion__paths" viewBox="0 0 700 560" fill="none">
                <path d="M-45 446C128 305 255 511 408 330S581 92 755 172" />
                <path d="M-20 522C155 386 286 588 510 416S626 261 732 302" />
                <path d="M218 543C326 424 446 456 560 280S646 102 726 70" />
                <circle cx="560" cy="280" r="4" />
                <circle cx="408" cy="330" r="3" />
            </svg>
        </div>
    );
}

/**
 * Continuous offshore-engineering network that runs BEHIND section content.
 *
 * Curved dotted routes span the full width of the section. Small abstract
 * "traffic" travels along them with gentle acceleration/deceleration:
 * glowing navigation markers, a streamlined vessel silhouette and an
 * aircraft-style light streak. Because the whole SVG sits at z-index 0 and
 * section content is lifted to z-index 1, every route and traveller slips
 * under the opaque cards and re-emerges on the far side.
 */
export function FlowingLines() {
    return (
        <svg
            className="flowing-lines"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <linearGradient
                    id="fl-streak-grad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                >
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
                    <stop offset="55%" stopColor="#fb923c" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.9" />
                </linearGradient>
            </defs>

            {/* Routes */}
            <path
                id="fl-route-1"
                className="fl-path"
                d="M-80 300C240 190 520 360 770 250S1200 70 1540 190"
            />
            <path
                id="fl-route-2"
                className="fl-path"
                d="M-80 440C180 270 298 548 545 365S960 120 1520 264"
            />
            <path
                id="fl-route-3"
                className="fl-path"
                d="M-110 524C160 360 350 600 682 438S1155 231 1540 348"
            />

            {/* Junction beacons */}
            <circle className="fl-node" cx="545" cy="365" r="3.4" />
            <circle className="fl-node" cx="770" cy="250" r="3" />
            <circle className="fl-node" cx="1155" cy="231" r="2.8" />

            {/* Renewable-style energy pulse at a junction */}
            <circle className="fl-pulse" cx="545" cy="365" r="14" />

            {/* Navigation markers */}
            <g className="fl-traveler">
                <circle className="fl-marker" r="3.2" />
                <animateMotion
                    dur="30s"
                    begin="-4s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.42 0 0.58 1"
                >
                    <mpath href="#fl-route-1" />
                </animateMotion>
            </g>
            <g className="fl-traveler">
                <circle className="fl-marker" r="2.6" />
                <animateMotion
                    dur="38s"
                    begin="-15s"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.42 0 0.58 1"
                >
                    <mpath href="#fl-route-3" />
                </animateMotion>
            </g>

            {/* Streamlined vessel silhouette */}
            <g className="fl-traveler">
                <path className="fl-vessel" d="M-8 0L4 -3.4L10 0L4 3.4Z" />
                <animateMotion
                    dur="46s"
                    begin="-22s"
                    repeatCount="indefinite"
                    rotate="auto"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.4 0 0.6 1"
                >
                    <mpath href="#fl-route-2" />
                </animateMotion>
            </g>

            {/* Aircraft-style light streak */}
            <g className="fl-traveler">
                <line className="fl-streak" x1="-10" y1="0" x2="8" y2="0" />
                <animateMotion
                    dur="24s"
                    begin="-6s"
                    repeatCount="indefinite"
                    rotate="auto"
                    calcMode="spline"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    keySplines="0.3 0 0.2 1"
                >
                    <mpath href="#fl-route-1" />
                </animateMotion>
            </g>
        </svg>
    );
}

/** A denser, low-contrast engineering field for the DiFFS feature section. */
export function DiffsMotion() {
    return (
        <div className="diffs-motion" aria-hidden="true">
            <svg viewBox="0 0 1440 720" preserveAspectRatio="none" fill="none">
                <defs>
                    <linearGradient
                        id="dm-streak-grad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                    >
                        <stop
                            offset="0%"
                            stopColor="#f97316"
                            stopOpacity="0"
                        />
                        <stop
                            offset="60%"
                            stopColor="#f97316"
                            stopOpacity="0.5"
                        />
                        <stop
                            offset="100%"
                            stopColor="#ffedd5"
                            stopOpacity="0.85"
                        />
                    </linearGradient>
                </defs>

                <path
                    id="dm-route-1"
                    className="dm-path"
                    d="M-60 528C166 375 270 556 496 420S836 164 1034 288s266 38 476-130"
                />
                <path
                    id="dm-route-2"
                    className="dm-path"
                    d="M-85 624C131 506 297 663 585 513S962 292 1172 432s202 85 355 3"
                />
                <path
                    id="dm-route-3"
                    className="dm-path"
                    d="M75 167C304 108 372 248 611 199s381-128 698-21"
                />

                {/* Onshore circuit / infrastructure runs */}
                <path
                    className="dm-line"
                    d="M213 42V216M213 216H352M352 216V350M1111 421V561M1022 561H1111M1022 561V656"
                />

                <circle className="dm-node" cx="496" cy="420" r="5" />
                <circle className="dm-node" cx="1034" cy="288" r="5" />
                <circle className="dm-node" cx="611" cy="199" r="4" />
                <circle className="dm-node" cx="1111" cy="561" r="4" />

                <circle className="dm-pulse" cx="496" cy="420" r="18" />
                <circle
                    className="dm-pulse dm-pulse--2"
                    cx="1034"
                    cy="288"
                    r="16"
                />

                {/* Navigation marker */}
                <g className="dm-traveler">
                    <circle className="dm-marker" r="3.4" />
                    <animateMotion
                        dur="34s"
                        begin="-6s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.42 0 0.58 1"
                    >
                        <mpath href="#dm-route-1" />
                    </animateMotion>
                </g>

                {/* Vessel silhouette */}
                <g className="dm-traveler">
                    <path className="dm-vessel" d="M-9 0L5 -4L12 0L5 4Z" />
                    <animateMotion
                        dur="52s"
                        begin="-20s"
                        repeatCount="indefinite"
                        rotate="auto"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.4 0 0.6 1"
                    >
                        <mpath href="#dm-route-2" />
                    </animateMotion>
                </g>

                {/* Aircraft-style light streak */}
                <g className="dm-traveler">
                    <line className="dm-streak" x1="-11" y1="0" x2="9" y2="0" />
                    <animateMotion
                        dur="28s"
                        begin="-9s"
                        repeatCount="indefinite"
                        rotate="auto"
                        calcMode="spline"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        keySplines="0.3 0 0.2 1"
                    >
                        <mpath href="#dm-route-3" />
                    </animateMotion>
                </g>
            </svg>
        </div>
    );
}
