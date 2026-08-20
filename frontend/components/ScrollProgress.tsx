"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (documentHeight <= 0) {
                setProgress(0);
                return;
            }

            const percentage = (scrollTop / documentHeight) * 100;

            setProgress(Math.min(100, Math.max(0, percentage)));
        };

        window.addEventListener("scroll", updateProgress);

        updateProgress();

        return () => {
            window.removeEventListener("scroll", updateProgress);
        };
    }, []);

    return (
        <div className="fixed left-0 right-0 top-0 z-[100] h-[3px] bg-white/10">
            <div
                className="h-full bg-orange-500 transition-[width] duration-100"
                style={{
                    width: `${progress}%`,
                }}
            />
        </div>
    );
}