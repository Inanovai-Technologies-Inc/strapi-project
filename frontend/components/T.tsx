"use client";

import { useI18n } from "@/components/I18nProvider";

/**
 * Renders a single translated static string by key.
 *
 * Safe to use inside Server Components: only this leaf is a Client
 * Component, so pages keep their existing server-side data fetching.
 * Falls back to English, then to the key itself (never "undefined").
 *
 * Example: <T k="home.hero.description" />
 */
export function T({ k }: { k: string }) {
    const { t } = useI18n();
    return <>{t(k)}</>;
}

export default T;
