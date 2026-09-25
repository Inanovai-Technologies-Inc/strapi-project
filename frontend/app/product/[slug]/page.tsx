import Link from "next/link";
import ProductContext from "@/components/ProductContext";
import FeatureTabs from "@/components/FeatureTabs";
import ProductTechnicalDocuments from "@/components/ProductTechnicalDocuments";
import { renderBlocks, renderBulletedText } from "@/components/richText";
import { isPhotographicImage } from "@/lib/imageTransparency";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

/* =========================================================
   MEDIA HELPERS
========================================================= */

function normalizeMedia(media: any): any[] {
    if (!media) {
        return [];
    }

    if (Array.isArray(media)) {
        return media.flatMap((item) =>
            normalizeMedia(item)
        );
    }

    if (media?.data) {
        return normalizeMedia(media.data);
    }

    if (media?.attributes) {
        return normalizeMedia(media.attributes);
    }

    if (media?.url) {
        return [media];
    }

    return [];
}

/* =========================================================
   SINGLE IMAGE URL
========================================================= */

function getImageUrl(image: any): string | null {
    const mediaItems = normalizeMedia(image);

    if (mediaItems.length === 0) {
        return null;
    }

    const url = mediaItems[0]?.url;

    if (!url) {
        return null;
    }

    if (
        url.startsWith("http://") ||
        url.startsWith("https://")
    ) {
        return url;
    }

    return `${STRAPI_URL}${url}`;
}

/* =========================================================
   MULTIPLE MEDIA URLS
========================================================= */

function getMediaUrls(media: any): string[] {
    const mediaItems = normalizeMedia(media);

    return mediaItems
        .map((item) => item?.url)
        .filter(Boolean)
        .map((url: string) => {
            if (
                url.startsWith("http://") ||
                url.startsWith("https://")
            ) {
                return url;
            }

            return `${STRAPI_URL}${url}`;
        });
}

/* =========================================================
   MEDIA ALT TEXT
========================================================= */

function getMediaAlt(
    media: any,
    fallback: string
): string {
    const mediaItems = normalizeMedia(media);

    return (
        mediaItems[0]?.alternativeText ||
        mediaItems[0]?.name ||
        fallback
    );
}

/* =========================================================
   SERIES NAME SPLIT

   Strapi's SeriesName field sometimes combines the display
   title with a trailing list of model codes, e.g.
   "Inergex Inert Gas System IG01 | IG55 | IG100 | IG541".
   Splits that trailing "CODE | CODE | ..." run onto its own
   line so it can render as a subtitle under the title.
========================================================= */

function splitSeriesName(
    name: string
): { title: string; codes: string | null } {
    if (!name) {
        return { title: name, codes: null };
    }

    const match = name.match(
        /^(.*?)\s+((?:[A-Za-z0-9]+\s*\|\s*)+[A-Za-z0-9]+)\s*$/
    );

    if (!match) {
        return { title: name, codes: null };
    }

    return {
        title: match[1].trim(),
        codes: match[2]
            .replace(/\s*\|\s*/g, " | ")
            .trim(),
    };
}

/* =========================================================
   YOUTUBE
========================================================= */

function getYouTubeEmbedUrl(url: string) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtu.be")) {
            const videoId =
                parsedUrl.pathname.substring(1);

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (parsedUrl.hostname.includes("youtube.com")) {
            const videoId =
                parsedUrl.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (
                parsedUrl.pathname.startsWith("/embed/")
            ) {
                return url;
            }
        }

        return null;
    } catch {
        return null;
    }
}

/* =========================================================
   PRODUCT LOAD ERROR
========================================================= */

function ProductLoadError() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
            <div className="max-w-lg text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                    Products are temporarily unavailable
                </h1>

                <p className="mt-3 text-gray-500">
                    We could not connect to the product catalogue. Please try again shortly.
                </p>

                <Link
                    href="/product"
                    className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                >
                    Back to Products
                </Link>
            </div>
        </main>
    );
}

/* =========================================================
   FETCH PRODUCT
========================================================= */

async function fetchProduct(slug: string) {
    const url =
        `${STRAPI_URL}/api/products` +
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&populate[Image]=true` +
        `&populate[SecondaryImage]=true` +
        `&populate[certificationLogos]=true` +
        `&populate[relatedProducts][populate][Image]=true` +
        `&populate[FoamSkidSeries][populate][SeriesImage]=true` +
        `&populate[FoamSkidSeries][populate][SeriesCertificationLogos]=true` +
        `&populate[TechnicalSpecification]=true`;

    console.log("Fetching product:", url);

    try {
        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText =
                await response.text();

            console.error(
                "Strapi Product Error:",
                errorText
            );

            return null;
        }

        const result = await response.json();

        console.log(
            "STRAPI PRODUCT RESPONSE:",
            JSON.stringify(result, null, 2)
        );

        return result?.data?.[0] || null;
    } catch (error) {
        console.error(
            "Failed to fetch product:",
            error
        );

        return null;
    }
}

/* =========================================================
   FETCH RELATED PRODUCT
========================================================= */

async function fetchRelatedProduct(
    slug: string
) {
    const url =
        `${STRAPI_URL}/api/products` +
        `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
        `&populate[Image]=true`;

    try {
        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(
                `Failed to fetch related product ${slug}:`,
                await response.text()
            );

            return null;
        }

        const result = await response.json();

        return result?.data?.[0] || null;
    } catch (error) {
        console.error(
            `Failed to fetch related product ${slug}:`,
            error
        );

        return null;
    }
}

/* =========================================================
   PRODUCT DETAIL PAGE
========================================================= */

export default async function ProductDetailPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    /* =====================================================
       FETCH PRODUCT
    ===================================================== */

    const product = await fetchProduct(slug);

    if (!product) {
        return <ProductLoadError />;
    }
    const chatbotProductContext = {
    id: product.id,
    documentId: product.documentId,

    Name: product.Name || "",

    description:
        product.description || "",

    Features:
        product.Features || [],

    Applications:
        product.Applications || [],

    TechnicalSpecification:
        Array.isArray(product.TechnicalSpecification)
            ? product.TechnicalSpecification
            : [],

    VideoTitle:
        product.VideoTitle || "",

    VideoURL:
        product.VideoURL || "",

    FoamSkidSeries:
        Array.isArray(product.FoamSkidSeries)
            ? product.FoamSkidSeries.map((series: any) => ({
                  SeriesName:
                      series.SeriesName || "",

                  SeriesDescription:
                      series.SeriesDescription || "",
              }))
            : [],

    relatedProducts:
        Array.isArray(product.relatedProducts)
            ? product.relatedProducts.map(
                  (related: any) => ({
                      Name:
                          related.Name || "",

                      slug:
                          related.slug || "",

                      description:
                          related.description || "",
                  })
              )
            : [],
};

    /* =====================================================
       MAIN PRODUCT IMAGE
    ===================================================== */

    const imageUrl =
        getImageUrl(product.Image);

    /* =====================================================
       SECONDARY IMAGE

       Optional — when Strapi has a SecondaryImage set, it
       replaces the Image field in the detail page's hero
       spot. The /product listing page's cards always use
       the Image field regardless, so they are unaffected.
    ===================================================== */

    const secondaryImageUrl =
        getImageUrl(product.SecondaryImage);

    const heroImageUrl = secondaryImageUrl || imageUrl;

    const heroImageAlt = secondaryImageUrl
        ? getMediaAlt(product.SecondaryImage, product.Name)
        : getMediaAlt(product.Image, product.Name);

    const heroImageIsPhoto = await isPhotographicImage(
        heroImageUrl
    );

    /* =====================================================
       MAIN PRODUCT CERTIFICATION LOGOS
    ===================================================== */

    const certificationLogoUrls =
        getMediaUrls(
            product.certificationLogos
        );

    /* =====================================================
       VIDEO
    ===================================================== */

    const videoEmbedUrl =
        product.VideoURL
            ? getYouTubeEmbedUrl(
                  product.VideoURL
              )
            : null;

    /* =====================================================
       TECHNICAL SPECIFICATIONS
    ===================================================== */

    const technicalSpecifications =
        Array.isArray(
            product.TechnicalSpecification
        )
            ? product.TechnicalSpecification.filter(
                  (spec: any) =>
                      spec &&
                      (
                          spec.Label
                              ?.toString()
                              .trim() ||
                          spec.Value
                              ?.toString()
                              .trim()
                      )
              )
            : [];

    /* =====================================================
       FOAM SKID SERIES
    ===================================================== */

    const foamSkidSeries =
        Array.isArray(
            product.FoamSkidSeries
        )
            ? product.FoamSkidSeries
            : [];

    /* =====================================================
       RELATED PRODUCTS
    ===================================================== */

    const relatedProducts =
        Array.isArray(
            product.relatedProducts
        )
            ? product.relatedProducts
            : [];

    const relatedProductsWithImages =
        await Promise.all(
            relatedProducts.map(
                async (related: any) => {
                    if (!related?.slug) {
                        return related;
                    }

                    const fullRelatedProduct =
                        await fetchRelatedProduct(
                            related.slug
                        );

                    return (
                        fullRelatedProduct ||
                        related
                    );
                }
            )
        );

    /* =====================================================
       RELATED PRODUCT IMAGE TYPE

       Resolved up front (in parallel) since the JSX below
       maps synchronously and can't await per item.
    ===================================================== */

    const relatedProductsWithImageInfo = await Promise.all(
        relatedProductsWithImages.map(async (related: any) => {
            const relatedImageUrl = getImageUrl(related.Image);

            return {
                related,
                relatedImageUrl,
                relatedImageIsPhoto: await isPhotographicImage(
                    relatedImageUrl
                ),
            };
        })
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <main className="min-h-screen bg-white">

            <ProductContext
            product={chatbotProductContext}
        />

            {/* =================================================
                HERO / MAIN PRODUCT
            ================================================= */}

            <section className="bg-white px-6 py-10 lg:px-8 lg:py-12">

                <div className="mx-auto max-w-7xl">

                    {/* BACK */}

                    <Link
                        href="/product"
                        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                    >
                        ← Back to Products
                    </Link>

                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                        Product
                    </p>

                    <div className="mt-4 grid gap-16 lg:grid-cols-2 lg:items-start">

                        {/* =================================================
                            LEFT - PRODUCT IMAGE

                            COMPLETELY BORDERLESS
                        ================================================= */}

                        <div className="bg-white">

                            {/* Normal photos (JPEG, e.g. DIFF System) fill
                                this area edge-to-edge like the Services
                                page. Transparent-render products (PNG,
                                e.g. ROTO Spray Deluge Nozzles) keep the
                                original boxed/contain treatment. */}

                            {heroImageUrl && heroImageIsPhoto ? (
                                <div className="h-[450px] w-full overflow-hidden rounded-2xl">
                                    <img
                                        src={heroImageUrl}
                                        alt={heroImageAlt}
                                        className="h-full w-full rounded-2xl object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex min-h-[450px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 lg:p-10">

                                    {heroImageUrl ? (
                                        <img
                                            src={heroImageUrl}
                                            alt={heroImageAlt}
                                            className="max-h-[450px] w-full rounded-2xl object-contain"
                                        />
                                    ) : (
                                        <p className="text-gray-400">
                                            No image available
                                        </p>
                                    )}

                                </div>
                            )}

                            {/* =================================================
                                MAIN CERTIFICATIONS

                                NO BORDER
                                NO CARD
                                NO SHADOW

                                Inert Gas System only: its certification
                                logos render on the right, below the
                                description, instead of here — see the
                                block below the Description section.
                            ================================================= */}

                            {certificationLogoUrls.length > 0 &&
                                product.slug !== "inert-gas-system" && (
                                <div className="bg-white px-6 py-6">

                                    <div className="mt-5 flex flex-wrap items-center justify-center gap-5">

                                        {certificationLogoUrls.map(
                                            (
                                                logoUrl,
                                                index
                                            ) => (
                                                <div
                                                    key={`${logoUrl}-${index}`}
                                                    className="flex h-40 w-56 items-center justify-center bg-white p-3"
                                                >
                                                    <img
                                                        src={
                                                            logoUrl
                                                        }
                                                        alt={`Certification logo ${
                                                            index +
                                                            1
                                                        }`}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* =================================================
                            RIGHT - PRODUCT INFORMATION
                        ================================================= */}

                        <div>

                            <h1 className="-mt-2 text-4xl font-bold uppercase leading-none text-gray-900 sm:text-5xl">
                                {product.Name}
                            </h1>

                            <div className="mt-6 h-1 w-16 bg-orange-500" />

                            {product.description && (
                                <div className="mt-8">

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Description
                                    </h2>

                                    <div className="mt-4 text-justify text-base leading-8 text-gray-600">
                                        {renderBulletedText(
                                            product.description
                                        )}
                                    </div>

                                </div>
                            )}

                            {/* =================================================
                                CERTIFICATIONS — INERT GAS SYSTEM ONLY

                                Placed on the right, below the description,
                                instead of the usual spot below the product
                                image on the left. Every other product keeps
                                its certification logos where they were.
                            ================================================= */}

                            {product.slug === "inert-gas-system" &&
                                certificationLogoUrls.length > 0 && (
                                    <div className="mt-8">

                                        <div className="flex flex-wrap items-center gap-5">

                                            {certificationLogoUrls.map(
                                                (logoUrl, index) => (
                                                    <div
                                                        key={`${logoUrl}-${index}`}
                                                        className="flex h-40 w-56 items-center justify-center bg-white p-3"
                                                    >
                                                        <img
                                                            src={logoUrl}
                                                            alt={`Certification logo ${
                                                                index + 1
                                                            }`}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                            {/* REQUEST MORE INFO */}

                            <div className="mt-9">

                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-3 rounded-lg bg-orange-500 px-7 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg"
                                >
                                    <span>
                                        Request More Info
                                    </span>

                                    <span className="text-lg">
                                        →
                                    </span>
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================================
                FOAM SKID SERIES
            ========================================================= */}

            {foamSkidSeries.length > 0 && (
                <section className="bg-white px-6 py-10 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="space-y-14">

                            {foamSkidSeries.map(
                                (
                                    series: any,
                                    index: number
                                ) => {

                                    const seriesName =
                                        series.SeriesName ||
                                        `Series ${
                                            index + 1
                                        }`;

                                    const {
                                        title: seriesTitle,
                                        codes: seriesCodes,
                                    } = splitSeriesName(
                                        seriesName
                                    );

                                    const seriesImageUrl =
                                        getImageUrl(
                                            series.SeriesImage
                                        );

                                    const seriesCertificationLogoUrls =
                                        getMediaUrls(
                                            series.SeriesCertificationLogos
                                        );

                                    const isReversed =
                                        index % 2 === 1;

                                    return (
                                        <article
                                            key={
                                                series.id ||
                                                index
                                            }
                                            className="bg-white"
                                        >

                                            <div
                                                className={`grid items-start gap-12 lg:grid-cols-2 ${
                                                    isReversed
                                                        ? "lg:[&>div:first-child]:order-2"
                                                        : ""
                                                }`}
                                            >

                                                <div className="bg-white">

                                                    <div className="flex min-h-[380px] items-center justify-center overflow-hidden rounded-2xl bg-white p-6 lg:p-10">

                                                        {seriesImageUrl ? (
                                                            <img
                                                                src={
                                                                    seriesImageUrl
                                                                }
                                                                alt={
                                                                    seriesName
                                                                }
                                                                className="max-h-[390px] w-full rounded-2xl object-contain transition duration-500 hover:scale-[1.02]"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <p className="text-sm text-gray-400">
                                                                    No series image available
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>

                                                    {seriesCertificationLogoUrls.length >
                                                        0 && (
                                                        <div className="bg-white px-4 py-4">

                                                            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">

                                                                {seriesCertificationLogoUrls.map(
                                                                    (
                                                                        logoUrl,
                                                                        logoIndex
                                                                    ) => (
                                                                        <div
                                                                            key={`${logoUrl}-${logoIndex}`}
                                                                            className="flex h-40 w-56 items-center justify-center bg-white p-3"
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    logoUrl
                                                                                }
                                                                                alt={`${seriesName} certification logo ${
                                                                                    logoIndex +
                                                                                    1
                                                                                }`}
                                                                                className="max-h-full max-w-full object-contain"
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}

                                                            </div>

                                                        </div>
                                                    )}

                                                </div>

                                                <div className="flex flex-col justify-center px-2 py-8 lg:px-8 lg:py-12">

                                                    <h3 className="mt-0 text-2xl font-bold uppercase leading-tight text-[#0b1f3a] sm:text-3xl">
                                                        {
                                                            seriesTitle
                                                        }
                                                    </h3>

                                                    {seriesCodes && (
                                                        <p className="mt-1 text-2xl font-bold leading-tight text-black sm:text-3xl">
                                                            {
                                                                seriesCodes
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-5 h-1 w-12 bg-orange-500" />

                                                    {Array.isArray(
                                                        series.SeriesDescription
                                                    ) ? (
                                                        <div className="mt-7">
                                                            {renderBlocks(
                                                                series.SeriesDescription,
                                                                { justify: true }
                                                            )}
                                                        </div>
                                                    ) : series.SeriesDescription ? (
                                                        <div className="mt-7 text-justify text-base leading-8 text-gray-600">
                                                            {renderBulletedText(
                                                                series.SeriesDescription
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="mt-7 text-base text-gray-400">
                                                            No description available.
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </section>
            )}

            {/* =========================================================
                FEATURES
            ========================================================= */}

            {Array.isArray(product.Features) &&
                product.Features.length > 0 && (
                    <section className="px-6 py-10 lg:px-8">

                        <div className="mx-auto max-w-7xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product Details
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900">
                                Features
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <FeatureTabs blocks={product.Features} />

                        </div>

                    </section>
                )}

            {/* =========================================================
                APPLICATIONS
            ========================================================= */}

            {Array.isArray(product.Applications) &&
                product.Applications.length > 0 && (
                    <section className="bg-gray-50 px-6 py-10 lg:px-8">

                        <div className="mx-auto max-w-7xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Industries
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900">
                                Applications
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                                {renderBlocks(
                                    product.Applications,
                                    { justify: true }
                                )}
                            </div>

                        </div>

                    </section>
                )}

            {/* =========================================================
                TECHNICAL SPECIFICATIONS
            ========================================================= */}

            {technicalSpecifications.length > 0 && (
                <section className="px-6 py-10 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-8">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product Information
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900">
                                Technical Specifications
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                        </div>

                        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                            <div className="grid grid-cols-1 border-b border-gray-200 bg-gray-900 text-white sm:grid-cols-[220px_1fr]">

                                <div className="px-5 py-3 text-sm font-bold uppercase tracking-wider">
                                    Specification
                                </div>

                                <div className="px-5 py-3 text-sm font-bold uppercase tracking-wider">
                                    Value
                                </div>

                            </div>

                            {technicalSpecifications.map(
                                (
                                    spec: any,
                                    index: number
                                ) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 border-b border-gray-200 last:border-b-0 sm:grid-cols-[220px_1fr]"
                                    >

                                        <div className="bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-800 sm:border-r sm:border-gray-200">
                                            {
                                                spec.Label
                                            }
                                        </div>

                                        <div className="px-5 py-4 text-sm leading-6 text-gray-600">
                                            {
                                                spec.Value
                                            }
                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </section>
            )}

            {/* =========================================================
                TECHNICAL DOCUMENTS
            ========================================================= */}

            <ProductTechnicalDocuments />

            {/* =========================================================
                RELATED PRODUCTS
            ========================================================= */}

            {relatedProductsWithImages.length > 0 && (
                <section className="bg-gray-50 px-6 py-10 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-10">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Explore More
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                                Related Products
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-4 max-w-2xl text-justify text-base leading-7 text-gray-500">
                                Explore products related to
                                <span className="font-semibold text-gray-700">
                                    {product.Name}
                                </span>
                                .
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                            {relatedProductsWithImageInfo.map(
                                ({
                                    related,
                                    relatedImageUrl,
                                    relatedImageIsPhoto,
                                }) => {

                                    const href = related.slug
                                        ? `/product/${related.slug}`
                                        : "/product";

                                    return (
                                        <Link
                                            key={
                                                related.documentId ||
                                                related.id
                                            }
                                            href={href}
                                            aria-label={related.Name}
                                            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                        >

                                            {/* =================================================
                                                RELATED PRODUCT IMAGE
                                            ================================================= */}

                                            <div className="relative h-56 w-full overflow-hidden bg-gray-100">

                                                <span className="absolute left-0 top-0 z-10 h-0.5 w-12 bg-orange-500 transition-all duration-300 group-hover:w-20" />

                                                {relatedImageUrl ? (
                                                    <img
                                                        src={
                                                            relatedImageUrl
                                                        }
                                                        alt={getMediaAlt(
                                                            related.Image,
                                                            related.Name
                                                        )}
                                                        loading="lazy"
                                                        className={`h-full w-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                                                            relatedImageIsPhoto
                                                                ? "object-cover"
                                                                : "object-contain"
                                                        }`}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-gray-400">
                                                        Product image unavailable
                                                    </div>
                                                )}

                                            </div>

                                            {/* =================================================
                                                RELATED PRODUCT CONTENT
                                            ================================================= */}

                                            <div className="flex flex-1 flex-col p-6">

                                                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                                                    Related Product
                                                </p>

                                                <h3 className="mt-3 text-lg font-bold uppercase leading-tight text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-600">
                                                    {
                                                        related.Name
                                                    }
                                                </h3>

                                                <p className="mt-3 line-clamp-3 text-justify text-sm leading-6 text-gray-500">
                                                    {related.description ||
                                                        "Explore this related fire protection solution."}
                                                </p>

                                                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-500">
                                                    View Product
                                                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                                                        →
                                                    </span>
                                                </span>

                                            </div>

                                        </Link>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </section>
            )}

            {/* =========================================================
                VIDEO
            ========================================================= */}

            {videoEmbedUrl && (
                <section className="bg-gray-50 px-6 py-10 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="text-center">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product Demonstration
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                                {product.VideoTitle || "Product Video"}
                            </h2>

                            <div className="mx-auto mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500">
                                Watch the product demonstration to learn more about its features, operation and capabilities.
                            </p>

                        </div>

                        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl">

                            <div className="relative aspect-video">

                                <iframe
                                    src={
                                        videoEmbedUrl
                                    }
                                    title={
                                        product.VideoTitle ||
                                        `${product.Name} Product Video`
                                    }
                                    className="absolute inset-0 h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />

                            </div>

                        </div>

                    </div>

                </section>
            )}

        </main>
    );
}