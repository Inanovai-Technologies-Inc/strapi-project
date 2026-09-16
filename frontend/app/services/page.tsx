import Link from "next/link";

import AmbientBackground from "@/components/AmbientBackground";
import Reveal from "@/components/Reveal";
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
    heroImage?: any;
};

/* =========================================================
   DISPLAY ORDER

   The services collection has no manual ordering field, so
   the listing order is pinned here by slug to match the
   approved design. Any service not listed falls after the
   pinned ones, in their normal fetch order.
========================================================= */

const DISPLAY_ORDER = [
    "pfas-free-firefighting-foam",
    "pfas-filtration-system",
    "advanced-oxidation-system",
    "fire-safety-engineering-services",
    "project-management",
];

function sortByDisplayOrder(services: ServiceEntry[]): ServiceEntry[] {
    return [...services].sort((a, b) => {
        const aIndex = DISPLAY_ORDER.indexOf(a.slug || "");
        const bIndex = DISPLAY_ORDER.indexOf(b.slug || "");

        const aRank = aIndex === -1 ? DISPLAY_ORDER.length : aIndex;
        const bRank = bIndex === -1 ? DISPLAY_ORDER.length : bIndex;

        return aRank - bRank;
    });
}

/* =========================================================
   HELPERS
========================================================= */

function excerpt(value: string | null | undefined, max = 160): string {
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
        `?sort[0]=createdAt:asc` +
        `&populate[heroImage]=true` +
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

   A quiet, editorial portfolio list rather than an image
   grid: each service is a numbered row — index, title,
   description, "View Service" — separated by hairlines, with
   a scroll reveal and a hover accent. No service imagery is
   fetched or shown here; the detail page carries the visuals.
========================================================= */

export default async function ServicesPage() {
    const services = await fetchServices();

    return (
        <main className="min-h-screen bg-white text-[#111827]">

            {/* =================================================
                HERO — label, heading, description only. No image.
            ================================================= */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-white">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-8 lg:py-16">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 sm:text-sm">
                            What We Offer
                        </p>

                        <h1 className="mt-3 text-4xl font-bold text-[#0b1f3a] sm:text-5xl">
                            Services
                        </h1>

                        <div className="mx-auto mt-4 h-1 w-14 bg-orange-500" />

                        <p className="mx-auto mt-4 text-sm leading-7 text-gray-500 sm:text-base lg:whitespace-nowrap">
                            Explore the specialised environmental and fire-protection services Marsol delivers alongside its product range.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* =================================================
                LISTING — an image-led service card grid
            ================================================= */}

            <section className="bg-gray-50 px-6 py-16 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-7xl">

                    {services === null ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-lg font-semibold text-gray-900">
                                Services are temporarily unavailable
                            </p>
                            <p className="mt-2 text-gray-500">
                                We could not connect to the services catalogue. Please try again shortly.
                            </p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-gray-500">
                                Services are being updated. Please check back soon.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                            {sortByDisplayOrder(services).map(
                                (service, index) => {
                                    const summary = excerpt(
                                        service.description ||
                                            service.introductionContent
                                    );

                                    if (!service.slug) {
                                        return null;
                                    }

                                    const imageUrl = getImageUrl(
                                        service.heroImage
                                    );

                                    const imageAlt = getMediaAlt(
                                        service.heroImage,
                                        service.title || "Service"
                                    );

                                    return (
                                        <Reveal
                                            key={
                                                service.documentId ||
                                                service.id
                                            }
                                            delay={Math.min(index, 5) * 70}
                                        >
                                            <Link
                                                href={`/services/${service.slug}`}
                                                className="
                                                    group
                                                    flex
                                                    h-full
                                                    flex-col
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-gray-200
                                                    bg-white
                                                    shadow-sm
                                                    transition-all
                                                    duration-500
                                                    hover:-translate-y-2
                                                    hover:shadow-2xl
                                                "
                                            >
                                                {/* IMAGE — fixed aspect ratio, always full-bleed */}

                                                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={imageAlt}
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                                transition-transform
                                                                duration-700
                                                                ease-out
                                                                group-hover:scale-105
                                                            "
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                                            Image unavailable
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CONTENT */}

                                                <div className="flex flex-1 flex-col p-6">
                                                    <p
                                                        className="
                                                            text-[11px]
                                                            font-bold
                                                            uppercase
                                                            tracking-[0.2em]
                                                            text-orange-500
                                                        "
                                                    >
                                                        Service
                                                    </p>

                                                    <h2
                                                        className="
                                                            mt-3
                                                            text-lg
                                                            font-bold
                                                            uppercase
                                                            leading-tight
                                                            text-[#0b1f3a]
                                                            transition-colors
                                                            duration-300
                                                            group-hover:text-orange-600
                                                        "
                                                    >
                                                        {service.title}
                                                    </h2>

                                                    {summary && (
                                                        <p className="mt-3 line-clamp-3 text-justify text-sm leading-6 text-gray-500">
                                                            {summary}
                                                        </p>
                                                    )}

                                                    <span
                                                        className="
                                                            mt-6
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            font-semibold
                                                            uppercase
                                                            tracking-wide
                                                            text-[#0b1f3a]
                                                            transition-colors
                                                            duration-300
                                                            group-hover:text-orange-500
                                                        "
                                                    >
                                                        View Service

                                                        <span
                                                            className="
                                                                text-lg
                                                                transition-transform
                                                                duration-300
                                                                group-hover:translate-x-1.5
                                                            "
                                                        >
                                                            →
                                                        </span>
                                                    </span>
                                                </div>
                                            </Link>
                                        </Reveal>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}
