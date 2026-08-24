"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right" | "scale";
}

export default function Reveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -60px 0px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const hiddenTransform = {
        up: "translate-y-14",
        left: "-translate-x-14",
        right: "translate-x-14",
        scale: "scale-[0.94]",
    }[direction];

    return (
        <div
            ref={ref}
            style={{
                transitionDelay: `${delay}ms`,
            }}
            className={`
                transform
                transition-all
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                ${
                    visible
                        ? "translate-x-0 translate-y-0 scale-100 opacity-100"
                        : `${hiddenTransform} opacity-0`
                }
                ${className}
            `}
        >
            {children}
        </div>
    );
}