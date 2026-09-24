import Link from "next/link";

import AmbientBackground from "@/components/AmbientBackground";
import Reveal from "@/components/Reveal";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

type NewsEntry = {
    id: number;
    documentId?: string;
    slug?: string;
    NewsTitle?: string;
    Description?: string | null;
    Date?: string | null;
};

/* =========================================================
   HELPERS
========================================================= */

function excerpt(value: string | null | undefined, max = 200): string {
    if (!value) {
        return "";
    }

    const text = value.replace(/\s+/g, " ").trim();

    if (text.length <= max) {
        return text;
    }

    return `${text.slice(0, max).trimEnd()}…`;
}

/* =========================================================
   DATA
========================================================= */

async function fetchNews(): Promise<NewsEntry[] | null> {
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/news?sort=Date:desc`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.error(
                "Strapi News Error:",
                await response.text()
            );

            return null;
        }

        const result = await response.json();

        return Array.isArray(result?.data) ? result.data : [];
    } catch (error) {
        console.error("Failed to fetch news:", error);

        return null;
    }
}

/* =========================================================
   NEWS LISTING PAGE
========================================================= */

export default async function NewsPage() {
    const news = await fetchNews();

    return (
        <main className="min-h-screen bg-white text-[#111827]">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-white">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-8 lg:py-16">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
                            Updates
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-[#0b1f3a] sm:text-5xl">
                            News & Events
                        </h1>

                        <div className="mx-auto mt-4 h-1 w-14 bg-orange-500" />

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                            The latest announcements, milestones, and updates from Marsol Technologies.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* =================================================
                LISTING
            ================================================= */}

            <section className="bg-gray-50 px-6 py-16 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-7xl">

                    {news === null ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-lg font-semibold text-gray-900">
                                News is temporarily unavailable
                            </p>
                            <p className="mt-2 text-gray-500">
                                We could not connect to the news feed. Please try again shortly.
                            </p>
                        </div>
                    ) : news.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-gray-500">
                                No news or events have been published yet. Please check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

                            {news.map((item, index) => {
                                if (!item.slug) {
                                    return null;
                                }

                                return (
                                    <Reveal
                                        key={item.documentId || item.id}
                                        delay={Math.min(index, 5) * 70}
                                    >
                                        <Link
                                            href={`/news-events/${item.slug}`}
                                            className="
                                                group
                                                flex
                                                h-full
                                                flex-col
                                                rounded-2xl
                                                border
                                                border-gray-200
                                                bg-white
                                                p-8
                                                shadow-sm
                                                transition-all
                                                duration-500
                                                hover:-translate-y-2
                                                hover:shadow-2xl
                                            "
                                        >
                                            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                                                News & Events
                                            </p>

                                            {item.Date && (
                                                <p className="mt-3 text-xs font-medium text-gray-400">
                                                    {new Date(
                                                        item.Date
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            )}

                                            <h2
                                                className="
                                                    mt-3
                                                    text-xl
                                                    font-bold
                                                    leading-tight
                                                    tracking-tight
                                                    text-[#0b1f3a]
                                                    transition-colors
                                                    duration-300
                                                    group-hover:text-orange-600
                                                "
                                            >
                                                {item.NewsTitle}
                                            </h2>

                                            <div className="mt-5 h-px w-full bg-gray-100" />

                                            <p className="mt-5 flex-1 text-sm leading-7 text-gray-600">
                                                {excerpt(item.Description)}
                                            </p>

                                            <span
                                                className="
                                                    mt-6
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-bold
                                                    uppercase
                                                    tracking-wide
                                                    text-gray-900
                                                    transition-colors
                                                    group-hover:text-orange-500
                                                "
                                            >
                                                Read More

                                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </span>
                                        </Link>
                                    </Reveal>
                                );
                            })}

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}
