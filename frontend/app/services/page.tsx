import Link from "next/link";

import { T } from "@/components/T";
import { getImageUrl, getMediaAlt } from "@/components/strapiMedia";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

type ServiceEntry = {
    id: number;
    documentId?: string;
    title?: string;
    slug?: string;
    description?: string | null;
    introductionContent?: string | null;
    images?: any;
};

/* =========================================================
   HELPERS
========================================================= */

function excerpt(value: string | null | undefined, max = 180): string {
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

async function fetchServices(): Promise<ServiceEntry[] | null> {
    const url =
        `${STRAPI_URL}/api/services` +
        `?populate[images]=true` +
        `&sort[0]=createdAt:asc` +
        `&pagination[pageSize]=100`;

    try {
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            console.error(
                "Strapi Services Error:",
                await response.text()
            );

            return null;
        }

        const result = await response.json();

        return Array.isArray(result?.data) ? result.data : [];
    } catch (error) {
        console.error("Failed to fetch services:", error);

        return null;
    }
}

/* =========================================================
   SERVICES LISTING PAGE
========================================================= */

export default async function ServicesPage() {
    const services = await fetchServices();

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111827]">

            {/* =================================================
                LISTING
            ================================================= */}

            <section className="border-t border-gray-200 px-6 py-16 lg:px-8 lg:py-20">

                <div className="mx-auto max-w-7xl">

                    {/* SECTION HEADING */}

                    <div className="mb-14 max-w-3xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            <T k="servicesPage.eyebrow" />
                        </p>

                        <h1 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                            <T k="servicesPage.title" />
                        </h1>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <p className="mt-5 text-base leading-7 text-gray-500">
                            <T k="servicesPage.description" />
                        </p>

                    </div>

                    {services === null ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-lg font-semibold text-gray-900">
                                <T k="servicesPage.errorTitle" />
                            </p>
                            <p className="mt-2 text-gray-500">
                                <T k="servicesPage.errorDescription" />
                            </p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-gray-500">
                                <T k="servicesPage.empty" />
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

                            {services.map((service) => {
                                const imageUrl = getImageUrl(
                                    service.images
                                );

                                const summary = excerpt(
                                    service.description ||
                                        service.introductionContent
                                );

                                return (
                                    <article
                                        key={
                                            service.documentId ||
                                            service.id
                                        }
                                        className="group bg-white"
                                    >

                                        {/* IMAGE */}

                                        <div className="flex h-64 items-center justify-center bg-white p-8">
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={getMediaAlt(
                                                        service.images,
                                                        service.title ||
                                                            "Service"
                                                    )}
                                                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#f7f7f5] text-sm text-gray-400">
                                                    <T k="serviceDetail.imagesHeading" />
                                                </div>
                                            )}
                                        </div>

                                        {/* CONTENT */}

                                        <div className="px-2 pb-4 pt-4">

                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                                                <T k="serviceDetail.eyebrow" />
                                            </p>

                                            <h2 className="mt-3 min-h-[56px] text-lg font-bold uppercase leading-7 text-[#0b1f3a]">
                                                {service.title}
                                            </h2>

                                            {summary && (
                                                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                                                    {summary}
                                                </p>
                                            )}

                                            {service.slug && (
                                                <Link
                                                    href={`/services/${service.slug}`}
                                                    className="mt-6 flex items-center justify-between border border-gray-200 px-5 py-3 text-sm font-semibold text-[#0b1f3a] transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                                                >
                                                    <span>
                                                        <T k="servicesPage.viewService" />
                                                    </span>

                                                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                                        →
                                                    </span>
                                                </Link>
                                            )}

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </div>

            </section>

            {/* =================================================
                CONTACT
            ================================================= */}

            <section className="bg-gray-900 px-6 py-16 lg:px-8">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                            <T k="cta.needMoreInfo" />
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white">
                            <T k="cta.contactOurTeam" />
                        </h2>

                        <p className="mt-3 text-gray-400">
                            <T k="cta.moreInfo" />
                        </p>

                    </div>

                    <Link
                        href="/contact"
                        className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600"
                    >
                        <T k="cta.contactUs" />
                    </Link>

                </div>

            </section>

        </main>
    );
}
