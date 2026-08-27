"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";

import en from "@/messages/en.json";
import kn from "@/messages/kn.json";
import hi from "@/messages/hi.json";

/* =========================================================
   LOCALES
========================================================= */

export type Locale = "en" | "kn" | "hi";

export const LOCALES: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "hi", label: "हिन्दी" },
];

const STORAGE_KEY = "marsol-lang";
const DEFAULT_LOCALE: Locale = "en";

/* =========================================================
   DICTIONARIES
========================================================= */

type Messages = Record<string, unknown>;

const dictionaries: Record<Locale, Messages> = {
    en: en as Messages,
    kn: kn as Messages,
    hi: hi as Messages,
};

function isLocale(value: string | null): value is Locale {
    return value === "en" || value === "kn" || value === "hi";
}

/**
 * Resolve a dot-separated key ("nav.home") against a dictionary.
 * Returns the string if found, otherwise undefined.
 */
function resolvePath(source: Messages | undefined, path: string): unknown {
    if (!source) return undefined;

    return path.split(".").reduce<unknown>((acc, part) => {
        if (
            acc &&
            typeof acc === "object" &&
            part in (acc as Record<string, unknown>)
        ) {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, source);
}

/* =========================================================
   CONTEXT
========================================================= */

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    // Always start at the default so server render and first client render
    // match; the persisted choice is applied after mount.
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (isLocale(stored)) {
                setLocaleState((current) =>
                    stored === current ? current : stored
                );
            }
        } catch {
            /* localStorage unavailable — keep default */
        }
    }, []);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* ignore persistence errors */
        }
    }, []);

    const t = useCallback(
        (key: string): string => {
            const active = resolvePath(dictionaries[locale], key);
            if (typeof active === "string") return active;

            // Fall back to English before ever returning undefined.
            const fallback = resolvePath(dictionaries.en, key);
            if (typeof fallback === "string") return fallback;

            // Last resort: show the key itself, never "undefined".
            return key;
        },
        [locale]
    );

    const value = useMemo<I18nContextValue>(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t]
    );

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

/* =========================================================
   HOOKS
========================================================= */

export function useI18n(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return ctx;
}

/** Convenience alias: `const { t } = useTranslation();` */
export function useTranslation(): I18nContextValue {
    return useI18n();
}
