"use client";

import { Languages } from "lucide-react";

import { LOCALES, useI18n, type Locale } from "@/components/I18nProvider";

/**
 * Language selector for the navbar.
 * Changing the value updates UI text in place — it never navigates
 * or touches the URL.
 */
export default function LanguageSelector() {
    const { locale, setLocale } = useI18n();

    return (
        <label className="relative flex items-center">
            <span className="sr-only">Select language</span>

            <Languages
                size={16}
                strokeWidth={2}
                className="
                    pointer-events-none
                    absolute
                    left-2.5
                    text-gray-500

                    dark:text-gray-400
                "
            />

            <select
                value={locale}
                onChange={(event) =>
                    setLocale(event.target.value as Locale)
                }
                aria-label="Select language"
                className="
                    h-10
                    cursor-pointer
                    appearance-none
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    py-0
                    pl-8
                    pr-3
                    text-[15px]
                    font-medium
                    text-gray-700
                    shadow-sm
                    outline-none
                    transition-all
                    duration-300

                    hover:-translate-y-0.5
                    hover:border-orange-400
                    hover:text-orange-500
                    hover:shadow-md

                    focus:border-orange-400

                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-gray-300
                    dark:hover:border-orange-400
                    dark:hover:text-orange-400
                "
            >
                {LOCALES.map((option) => (
                    <option
                        key={option.code}
                        value={option.code}
                        className="text-gray-900"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
