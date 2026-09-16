import Link from "next/link";

import { renderBlocks } from "@/components/richText";
import ServiceExpandable from "@/components/ServiceExpandable";
import ServiceHeroCollapse from "@/components/ServiceHeroCollapse";
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
        return <>{renderBlocks(value, { justify: true })}</>;
    }

    if (typeof value === "string" && value.trim()) {
        return (
            <p className="whitespace-pre-line text-justify text-base leading-8 text-gray-600">
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
   SINGLE SECTION (shared.sections component)

   Same markup the page has always used for a section — image
   column + heading/rich-text column, alternating sides.
========================================================= */

function ServiceSection({
    section,
    index,
    serviceTitle,
}: {
    section: any;
    index: number;
    serviceTitle?: string;
}) {
    const sectionImages = getMediaUrls(section?.image);
    const hasImages = sectionImages.length > 0;

    const imageOnRight = section?.imagePosition
        ? section.imagePosition === "right"
        : index % 2 === 1;

    return (
        <article>
            <div
                className={`grid items-center gap-12 ${
                    hasImages ? "lg:grid-cols-2" : "lg:grid-cols-1"
                } ${
                    hasImages && imageOnRight
                        ? "lg:[&>div:first-child]:order-2"
                        : ""
                }`}
            >

                {/* IMAGE(S) */}

                {hasImages && (
                    <div className="space-y-6">
                        {sectionImages.map((url, imageIndex) => (
                            <div
                                key={`${url}-${imageIndex}`}
                                className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <img
                                    src={url}
                                    alt={`${
                                        section?.heading ||
                                        serviceTitle ||
                                        "Section"
                                    } image ${imageIndex + 1}`}
                                    className="max-h-[420px] w-full object-contain"
                                />
                            </div>
                        ))}
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
                        {renderBlocks(section?.content, { justify: true })}
                    </div>
                </div>

            </div>
        </article>
    );
}

/* =========================================================
   DATA
========================================================= */

async function fetchService(slug: string) {
    const url =
        `${STRAPI_URL}/api/services` +
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&populate[heroImage]=true` +
        `&populate[images]=true` +
        `&populate[sections][populate][image]=true` +
        `&populate[ExpandableItem]=true` +
        `&populate[ExpandableItemImage]=true`;

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
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    {title}
                </h1>

                <p className="mt-3 text-gray-500">
                    {description}
                </p>

                <Link
                    href="/services"
                    className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                    Back to Services
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
                title="Services are temporarily unavailable"
                description="We could not connect to the services catalogue. Please try again shortly."
            />
        );
    }

    if (!service) {
        return (
            <ServiceMessage
                title="Service not found"
                description="We could not find the service you are looking for."
            />
        );
    }

    const sections = Array.isArray(service.sections)
        ? service.sections
        : [];

    const expandableItems = Array.isArray(service.ExpandableItem)
        ? service.ExpandableItem
        : [];

    const heroImageUrl = getImageUrl(service.heroImage);
    const heroImageAlt = getMediaAlt(
        service.heroImage,
        service.title || "Service"
    );

    const expandableImageUrl = getImageUrl(service.ExpandableItemImage);
    const expandableImageAlt = getMediaAlt(
        service.ExpandableItemImage,
        service.ExpandableItemtitle || service.title || "Service"
    );

    const requestMoreInfoHref =
        typeof service.buttonLink === "string" && service.buttonLink.trim()
            ? service.buttonLink
            : "/contact";

    const expandableBlock =
        expandableItems.length > 0 ? (
            <ServiceExpandable
                title={service.ExpandableItemtitle}
                imageUrl={expandableImageUrl}
                imageAlt={expandableImageAlt}
                items={expandableItems}
            />
        ) : null;

    return (
        <main className="min-h-screen bg-white">

            {/* =================================================
                1. HERO — heroImage banner with the title over it
            ================================================= */}

            {heroImageUrl ? (
                <ServiceHeroCollapse
                    imageUrl={heroImageUrl}
                    imageAlt={heroImageAlt}
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center text-sm font-medium text-white/75 transition hover:text-orange-400"
                    >
                        ← Back to Services
                    </Link>

                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 sm:text-sm">
                        Service
                    </p>

                    <h1 className="mt-4 max-w-3xl text-2xl font-bold uppercase leading-tight text-white sm:text-3xl lg:text-4xl">
                        {service.title}
                    </h1>

                    <div className="mt-6 h-1 w-16 bg-orange-500" />
                </ServiceHeroCollapse>
            ) : (
                <section className="bg-white px-6 pt-14 lg:px-8 lg:pt-20">

                    <div className="mx-auto max-w-5xl">

                        <Link
                            href="/services"
                            className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                        >
                            ← Back to Services
                        </Link>

                        <div className="mt-10">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Service
                            </p>

                            <h1 className="mt-4 text-4xl font-bold uppercase leading-tight text-gray-900 sm:text-5xl">
                                {service.title}
                            </h1>

                            <div className="mt-6 h-1 w-16 bg-orange-500" />

                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                2. INTRODUCTION — introductionContent below the hero
            ================================================= */}

            {(service.introductionTitle ||
                hasContent(service.introductionContent) ||
                service.buttonText) && (
                <section className="bg-white px-6 py-14 lg:px-8 lg:py-16">

                    <div className="mx-auto max-w-5xl">

                        {service.introductionTitle && (
                            <h2 className="text-xl font-bold text-gray-900">
                                {service.introductionTitle}
                            </h2>
                        )}

                        {hasContent(service.introductionContent) && (
                            <div className="mt-4">
                                <RichText
                                    value={service.introductionContent}
                                />
                            </div>
                        )}

                        <div className="mt-9">
                            <Link
                                href={requestMoreInfoHref}
                                className="inline-flex items-center gap-3 rounded-lg bg-orange-500 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
                            >
                                <span>
                                    {service.buttonText || "Request More Info"}
                                </span>

                                <span className="text-lg">→</span>
                            </Link>
                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                3-5. SECTIONS + EXPANDABLE ITEMS

                One section  → section, then the expandable items.
                Many sections → Section 1 → expandable items →
                Section 2 → Section 3 …
                With no expandable items the sections render as a
                single continuous block (unchanged layout).
            ================================================= */}

            {expandableBlock ? (
                <>
                    {sections.length > 0 && (
                        <section className="px-6 py-16 lg:px-8">
                            <div className="mx-auto max-w-6xl">
                                <ServiceSection
                                    section={sections[0]}
                                    index={0}
                                    serviceTitle={service.title}
                                />
                            </div>
                        </section>
                    )}

                    {expandableBlock}

                    {sections.length > 1 && (
                        <section className="px-6 py-16 lg:px-8">
                            <div className="mx-auto max-w-6xl space-y-20">
                                {sections
                                    .slice(1)
                                    .map((section: any, i: number) => (
                                        <ServiceSection
                                            key={section?.id || i + 1}
                                            section={section}
                                            index={i + 1}
                                            serviceTitle={service.title}
                                        />
                                    ))}
                            </div>
                        </section>
                    )}
                </>
            ) : (
                sections.length > 0 && (
                    <section className="px-6 py-16 lg:px-8">
                        <div className="mx-auto max-w-6xl space-y-20">
                            {sections.map(
                                (section: any, index: number) => (
                                    <ServiceSection
                                        key={section?.id || index}
                                        section={section}
                                        index={index}
                                        serviceTitle={service.title}
                                    />
                                )
                            )}
                        </div>
                    </section>
                )
            )}

        </main>
    );
}
