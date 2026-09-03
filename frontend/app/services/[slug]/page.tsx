import Link from "next/link";

import { T } from "@/components/T";
import { renderBlocks } from "@/components/richText";
import {
    getImageUrl,
    getMediaAlt,
    getMediaUrls,
} from "@/components/strapiMedia";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

type ServicePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

/* =========================================================
   RICH TEXT / PLAIN TEXT

   `introductionContent`, `description` and `partnerDescription`
   are Strapi `richtext` (plain string). Section content is
   `blocks` (array). Render whichever shape comes back.
========================================================= */

function RichText({ value }: { value: any }) {
    if (Array.isArray(value)) {
        return <>{renderBlocks(value)}</>;
    }

    if (typeof value === "string" && value.trim()) {
        return (
            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                {value}
            </p>
        );
    }

    return null;
}

function hasContent(value: any): boolean {
    if (Array.isArray(value)) {
        return value.length > 0;
    }

    return typeof value === "string" && value.trim().length > 0;
}

/* =========================================================
   DATA
========================================================= */

async function fetchService(slug: string) {
    const url =
        `${STRAPI_URL}/api/services` +
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&populate[images]=true` +
        `&populate[sections][populate][image]=true`;

    try {
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            console.error(
                "Strapi Service Error:",
                await response.text()
            );

            return { error: true as const, service: null };
        }

        const result = await response.json();

        return {
            error: false as const,
            service: result?.data?.[0] || null,
        };
    } catch (error) {
        console.error("Failed to fetch service:", error);

        return { error: true as const, service: null };
    }
}

/* =========================================================
   STATES
========================================================= */

function ServiceMessage({
    titleKey,
    descriptionKey,
}: {
    titleKey: string;
    descriptionKey: string;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    <T k={titleKey} />
                </h1>

                <p className="mt-3 text-gray-500">
                    <T k={descriptionKey} />
                </p>

                <Link
                    href="/services"
                    className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                    <T k="serviceDetail.backToServices" />
                </Link>
            </div>
        </main>
    );
}

/* =========================================================
   SERVICE DETAIL PAGE
========================================================= */

export default async function ServiceDetailPage({
    params,
}: ServicePageProps) {
    const { slug } = await params;

    const { error, service } = await fetchService(slug);

    if (error) {
        return (
            <ServiceMessage
                titleKey="serviceDetail.errorTitle"
                descriptionKey="serviceDetail.errorDescription"
            />
        );
    }

    if (!service) {
        return (
            <ServiceMessage
                titleKey="serviceDetail.notFoundTitle"
                descriptionKey="serviceDetail.notFoundDescription"
            />
        );
    }

    const imageUrls = getMediaUrls(service.images);

    const sections = Array.isArray(service.sections)
        ? service.sections
        : [];

    const requestMoreInfoHref =
        typeof service.buttonLink === "string" && service.buttonLink.trim()
            ? service.buttonLink
            : "/contact";

    return (
        <main className="min-h-screen bg-white">

            {/* =================================================
                HERO / INTRODUCTION
            ================================================= */}

            <section className="bg-white px-6 py-14 lg:px-8 lg:py-20">

                <div className="mx-auto max-w-5xl">

                    {/* BACK */}

                    <Link
                        href="/services"
                        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                    >
                        ← <T k="serviceDetail.backToServices" />
                    </Link>

                    <div className="mt-10">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            <T k="serviceDetail.eyebrow" />
                        </p>

                        <h1 className="mt-4 text-4xl font-bold uppercase leading-tight text-gray-900 sm:text-5xl">
                            {service.title}
                        </h1>

                        <div className="mt-6 h-1 w-16 bg-orange-500" />

                        {(service.introductionTitle ||
                            hasContent(service.introductionContent)) && (
                            <div className="mt-8">

                                <h2 className="text-xl font-bold text-gray-900">
                                    {service.introductionTitle || (
                                        <T k="serviceDetail.introHeading" />
                                    )}
                                </h2>

                                <div className="mt-4">
                                    <RichText
                                        value={service.introductionContent}
                                    />
                                </div>

                            </div>
                        )}

                        {/* REQUEST MORE INFO */}

                        <div className="mt-9">
                            <Link
                                href={requestMoreInfoHref}
                                className="inline-flex items-center gap-3 rounded-lg bg-orange-500 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
                            >
                                <span>
                                    {service.buttonText || (
                                        <T k="serviceDetail.requestMoreInfo" />
                                    )}
                                </span>

                                <span className="text-lg">→</span>
                            </Link>
                        </div>

                    </div>

                </div>

            </section>

            {/* =================================================
                PARTNER DESCRIPTION
            ================================================= */}

            {hasContent(service.partnerDescription) && (
                <section className="bg-gray-50 px-6 py-16 lg:px-8">

                    <div className="mx-auto max-w-5xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            <T k="serviceDetail.partnerHeading" />
                        </p>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
                            <RichText value={service.partnerDescription} />
                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                SERVICE IMAGES
            ================================================= */}

            {/* {imageUrls.length > 0 && (
                <section className="px-6 py-16 lg:px-8">

                    <div className="mx-auto max-w-5xl">

                        <h2 className="text-3xl font-bold text-gray-900">
                            <T k="serviceDetail.imagesHeading" />
                        </h2>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {imageUrls.map((url, index) => (
                                <div
                                    key={`${url}-${index}`}
                                    className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6"
                                >
                                    <img
                                        src={url}
                                        alt={`${service.title || "Service"} image ${
                                            index + 1
                                        }`}
                                        className="max-h-[420px] w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>

                    </div>

                </section>
            )} */}

            {/* =================================================
                ADDITIONAL SECTIONS (shared.sections component)
            ================================================= */}

            {sections.length > 0 && (
                <section className="px-6 py-16 lg:px-8">

                    <div className="mx-auto max-w-6xl space-y-20">

                        {sections.map((section: any, index: number) => {
                            const sectionImages = getMediaUrls(
                                section?.image
                            );

                            const hasImages = sectionImages.length > 0;

                            const imageOnRight = section?.imagePosition
                                ? section.imagePosition === "right"
                                : index % 2 === 1;

                            return (
                                <article key={section?.id || index}>

                                    <div
                                        className={`grid items-center gap-12 ${
                                            hasImages
                                                ? "lg:grid-cols-2"
                                                : "lg:grid-cols-1"
                                        } ${
                                            hasImages && imageOnRight
                                                ? "lg:[&>div:first-child]:order-2"
                                                : ""
                                        }`}
                                    >

                                        {/* IMAGE(S) */}

                                        {hasImages && (
                                            <div className="space-y-6">
                                                {sectionImages.map(
                                                    (url, imageIndex) => (
                                                        <div
                                                            key={`${url}-${imageIndex}`}
                                                            className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6"
                                                        >
                                                            <img
                                                                src={url}
                                                                alt={`${
                                                                    section?.heading ||
                                                                    service.title ||
                                                                    "Section"
                                                                } image ${
                                                                    imageIndex + 1
                                                                }`}
                                                                className="max-h-[420px] w-full object-contain"
                                                            />
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {/* HEADING + RICH TEXT */}

                                        <div>
                                            {section?.heading && (
                                                <>
                                                    <h3 className="text-2xl font-bold uppercase leading-tight text-[#0b1f3a] sm:text-3xl">
                                                        {section.heading}
                                                    </h3>

                                                    <div className="mt-5 h-1 w-12 bg-orange-500" />
                                                </>
                                            )}

                                            <div className="mt-7">
                                                {renderBlocks(section?.content)}
                                            </div>
                                        </div>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                </section>
            )}

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
                        href={requestMoreInfoHref}
                        className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600"
                    >
                        {service.buttonText || (
                            <T k="serviceDetail.requestMoreInfo" />
                        )}
                    </Link>

                </div>

            </section>

        </main>
    );
}
