"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useI18n } from "@/components/I18nProvider";
import { useSyncExternalStore } from "react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { t } = useI18n();

    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    if (!mounted) {
        return (
            <button
                aria-label={t("theme.toggle")}
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                "
            >
                <Sun size={18} />
            </button>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            aria-label={
                isDark
                    ? t("theme.switchToLight")
                    : t("theme.switchToDark")
            }
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="
                group
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-full
                border
                border-gray-200
                bg-white
                text-gray-700
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-orange-400
                hover:text-orange-500
                hover:shadow-md
                dark:border-white/10
                dark:bg-white/5
                dark:text-gray-300
                dark:hover:border-orange-400
                dark:hover:text-orange-400
            "
        >
            {/* Sun */}

            <Sun
                size={18}
                strokeWidth={2}
                className={`
                    absolute
                    transition-all
                    duration-500
                    ${
                        isDark
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                    }
                `}
            />

            {/* Moon */}

            <Moon
                size={18}
                strokeWidth={2}
                className={`
                    absolute
                    transition-all
                    duration-500
                    ${
                        isDark
                            ? "rotate-0 scale-100 opacity-100"
                            : "-rotate-90 scale-0 opacity-0"
                    }
                `}
            />

            <span className="sr-only">
                {t("theme.toggleLabel")}
            </span>
        </button>
    );
}
