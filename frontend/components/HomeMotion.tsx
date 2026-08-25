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

export function FlowingLines() {
    return (
        <svg
            className="flowing-lines"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
        >
            <path d="M-80 440C180 270 298 548 545 365S960 120 1520 264" />
            <path d="M-110 522C160 360 350 600 682 438S1155 231 1540 348" />
        </svg>
    );
}

/** A denser, low-contrast engineering field for the DiFFS feature section. */
export function DiffsMotion() {
    return (
        <div className="diffs-motion" aria-hidden="true">
            <svg viewBox="0 0 1440 720" preserveAspectRatio="none" fill="none">
                <path d="M-60 528C166 375 270 556 496 420S836 164 1034 288s266 38 476-130" />
                <path d="M-85 624C131 506 297 663 585 513S962 292 1172 432s202 85 355 3" />
                <path d="M75 167C304 108 372 248 611 199s381-128 698-21" />
                <path d="M213 42V216M213 216H352M352 216V350M1111 421V561M1022 561H1111M1022 561V656" />
                <circle cx="496" cy="420" r="5" />
                <circle cx="1034" cy="288" r="5" />
                <circle cx="611" cy="199" r="4" />
                <circle cx="1111" cy="561" r="4" />
            </svg>
        </div>
    );
}
