import Link from "next/link";

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
   RICH TEXT RENDERER
========================================================= */

function renderBlocks(blocks: any[]) {
    if (!Array.isArray(blocks)) {
        return null;
    }

    return blocks.map((block: any, index: number) => {
        if (!block) {
            return null;
        }

        const children = Array.isArray(block.children)
            ? block.children
            : [];

        const text = children
            .map((child: any) => child?.text || "")
            .join("");

        if (!text.trim()) {
            return null;
        }

        switch (block.type) {
            case "heading":
                return (
                    <h3
                        key={index}
                        className="mb-4 mt-6 text-xl font-bold text-gray-900"
                    >
                        {text}
                    </h3>
                );

            case "list":
                return (
                    <ul
                        key={index}
                        className="mb-4 list-disc space-y-2 pl-6 text-base leading-8 text-gray-600"
                    >
                        {children.map(
                            (
                                item: any,
                                itemIndex: number
                            ) => (
                                <li key={itemIndex}>
                                    {item?.children
                                        ?.map(
                                            (child: any) =>
                                                child?.text ||
                                                ""
                                        )
                                        .join("") || ""}
                                </li>
                            )
                        )}
                    </ul>
                );

            case "quote":
                return (
                    <blockquote
                        key={index}
                        className="my-6 border-l-4 border-orange-500 pl-5 italic text-gray-600"
                    >
                        {text}
                    </blockquote>
                );

            default:
                return (
                    <p
                        key={index}
                        className="mb-4 text-base leading-8 text-gray-600 last:mb-0"
                    >
                        {text}
                    </p>
                );
        }
    });
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
                    We could not connect to the product
                    catalogue. Please try again shortly.
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

    /* =====================================================
       MAIN PRODUCT IMAGE
    ===================================================== */

    const imageUrl =
        getImageUrl(product.Image);

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
       RENDER
    ===================================================== */

    return (
        <main className="min-h-screen bg-white">

            {/* =================================================
                HERO / MAIN PRODUCT
            ================================================= */}

            <section className="bg-white px-6 py-14 lg:px-8 lg:py-20">

                <div className="mx-auto max-w-7xl">

                    {/* BACK */}

                    <Link
                        href="/product"
                        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                    >
                        ← Back to Products
                    </Link>

                    <div className="mt-10 grid gap-16 lg:grid-cols-2 lg:items-center">

                        {/* =================================================
                            LEFT - PRODUCT IMAGE
                            
                            COMPLETELY BORDERLESS
                        ================================================= */}

                        <div className="bg-white">

                            <div className="flex min-h-[450px] items-center justify-center bg-white p-6 lg:p-10">

                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={getMediaAlt(
                                            product.Image,
                                            product.Name
                                        )}
                                        className="max-h-[450px] w-full object-contain"
                                    />
                                ) : (
                                    <p className="text-gray-400">
                                        No image available
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                                MAIN CERTIFICATIONS

                                NO BORDER
                                NO CARD
                                NO SHADOW
                            ================================================= */}

                            {certificationLogoUrls.length >
                                0 && (
                                <div className="bg-white px-6 py-6">

                                    <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                                        Certifications
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center justify-center gap-5">

                                        {certificationLogoUrls.map(
                                            (
                                                logoUrl,
                                                index
                                            ) => (
                                                <div
                                                    key={`${logoUrl}-${index}`}
                                                    className="flex h-20 w-28 items-center justify-center bg-white p-3"
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

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product
                            </p>

                            <h1 className="mt-4 text-4xl font-bold uppercase leading-tight text-gray-900 sm:text-5xl">
                                {product.Name}
                            </h1>

                            <div className="mt-6 h-1 w-16 bg-orange-500" />

                            {product.description && (
                                <div className="mt-8">

                                    <h2 className="text-xl font-bold text-gray-900">
                                        Description
                                    </h2>

                                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                                        {
                                            product.description
                                        }
                                    </p>

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
                <section className="bg-white px-6 py-20 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        {/* SECTION HEADER */}

                        <div className="mb-14">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Foam Tank Skid
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                                Foam Skid Series
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-500">
                                Marsol has developed different
                                foam skid series to meet various
                                project and installation
                                requirements.
                            </p>

                        </div>

                        {/* SERIES */}

                        <div className="space-y-24">

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
                                                className={`grid items-center gap-12 lg:grid-cols-2 ${
                                                    isReversed
                                                        ? "lg:[&>div:first-child]:order-2"
                                                        : ""
                                                }`}
                                            >

                                                {/* =================================================
                                                    SERIES IMAGE
                                                    COMPLETELY BORDERLESS
                                                ================================================= */}

                                                <div className="bg-white">

                                                    <div className="flex min-h-[380px] items-center justify-center bg-white p-6 lg:p-10">

                                                        {seriesImageUrl ? (
                                                            <img
                                                                src={
                                                                    seriesImageUrl
                                                                }
                                                                alt={
                                                                    seriesName
                                                                }
                                                                className="max-h-[390px] w-full object-contain transition duration-500 hover:scale-[1.02]"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <p className="text-sm text-gray-400">
                                                                    No series image available
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* SERIES CERTIFICATIONS */}

                                                    {seriesCertificationLogoUrls.length >
                                                        0 && (
                                                        <div className="bg-white px-4 py-4">

                                                            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                                                Certifications
                                                            </p>

                                                            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">

                                                                {seriesCertificationLogoUrls.map(
                                                                    (
                                                                        logoUrl,
                                                                        logoIndex
                                                                    ) => (
                                                                        <div
                                                                            key={`${logoUrl}-${logoIndex}`}
                                                                            className="flex h-20 w-28 items-center justify-center bg-white p-3"
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

                                                {/* =================================================
                                                    SERIES DESCRIPTION
                                                ================================================= */}

                                                <div className="flex flex-col justify-center px-2 py-8 lg:px-8 lg:py-12">

                                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                                                        Foam Skid Series
                                                    </p>

                                                    <h3 className="mt-3 text-2xl font-bold uppercase leading-tight text-[#0b1f3a] sm:text-3xl">
                                                        {
                                                            seriesName
                                                        }
                                                    </h3>

                                                    <div className="mt-5 h-1 w-12 bg-orange-500" />

                                                    {Array.isArray(
                                                        series.SeriesDescription
                                                    ) ? (
                                                        <div className="mt-7">
                                                            {renderBlocks(
                                                                series.SeriesDescription
                                                            )}
                                                        </div>
                                                    ) : series.SeriesDescription ? (
                                                        <p className="mt-7 whitespace-pre-line text-base leading-8 text-gray-600">
                                                            {
                                                                series.SeriesDescription
                                                            }
                                                        </p>
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
                    <section className="px-6 py-16 lg:px-8">

                        <div className="mx-auto max-w-7xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product Details
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900">
                                Features
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                                {renderBlocks(
                                    product.Features
                                )}
                            </div>

                        </div>

                    </section>
                )}

            {/* =========================================================
                APPLICATIONS
            ========================================================= */}

            {Array.isArray(product.Applications) &&
                product.Applications.length > 0 && (
                    <section className="bg-gray-50 px-6 py-16 lg:px-8">

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
                                    product.Applications
                                )}
                            </div>

                        </div>

                    </section>
                )}

            {/* =========================================================
                TECHNICAL SPECIFICATIONS
            ========================================================= */}

            {technicalSpecifications.length > 0 && (
                <section className="px-6 py-16 lg:px-8">

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
                RELATED PRODUCTS
            ========================================================= */}

            {relatedProductsWithImages.length > 0 && (
                <section className="bg-gray-50 px-6 py-20 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-10">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Explore More
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                                Related Products
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                                Explore products related to{" "}
                                <span className="font-semibold text-gray-700">
                                    {product.Name}
                                </span>
                                .
                            </p>

                        </div>

                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

                            {relatedProductsWithImages.map(
                                (
                                    related: any
                                ) => {

                                    const relatedImageUrl =
                                        getImageUrl(
                                            related.Image
                                        );

                                    return (
                                        <article
                                            key={
                                                related.documentId ||
                                                related.id
                                            }
                                            className="group bg-white"
                                        >

                                            {/* =================================================
                                                RELATED PRODUCT IMAGE

                                                NO BORDER
                                                NO SHADOW
                                                NO CARD
                                                NO GRAY BACKGROUND
                                                NO ORANGE TOP BAR
                                            ================================================= */}

                                            <div className="flex h-64 items-center justify-center bg-white p-8">

                                                {relatedImageUrl ? (
                                                    <img
                                                        src={
                                                            relatedImageUrl
                                                        }
                                                        alt={getMediaAlt(
                                                            related.Image,
                                                            related.Name
                                                        )}
                                                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="text-sm text-gray-400">
                                                        Product image unavailable
                                                    </div>
                                                )}

                                            </div>

                                            {/* =================================================
                                                RELATED PRODUCT CONTENT
                                            ================================================= */}

                                            <div className="px-2 pb-4 pt-4">

                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                                                    Related Product
                                                </p>

                                                <h3 className="mt-3 min-h-[56px] text-lg font-bold uppercase leading-7 text-[#0b1f3a]">
                                                    {
                                                        related.Name
                                                    }
                                                </h3>

                                                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                                                    {
                                                        related.description ||
                                                        "Explore this related fire protection solution."
                                                    }
                                                </p>

                                                {related.slug && (
                                                    <Link
                                                        href={`/product/${related.slug}`}
                                                        className="mt-6 flex items-center justify-between border border-gray-200 px-5 py-3 text-sm font-semibold text-[#0b1f3a] transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                                                    >
                                                        <span>
                                                            View Product
                                                        </span>

                                                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                                            →
                                                        </span>
                                                    </Link>
                                                )}

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
                VIDEO
            ========================================================= */}

            {videoEmbedUrl && (
                <section className="bg-gray-50 px-6 py-20 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="text-center">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Product Demonstration
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                                {
                                    product.VideoTitle ||
                                    "Product Video"
                                }
                            </h2>

                            <div className="mx-auto mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-500">
                                Watch the product demonstration
                                to learn more about its
                                features, operation and
                                capabilities.
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

            {/* =========================================================
                CONTACT
            ========================================================= */}

            <section className="bg-gray-900 px-6 py-16 lg:px-8">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                            Need More Information?
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white">
                            Contact our team
                        </h2>

                        <p className="mt-3 text-gray-400">
                            Get in touch with us for
                            product specifications,
                            pricing and technical
                            information.
                        </p>

                    </div>

                    <Link
                        href="/contact"
                        className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600"
                    >
                        Contact Us
                    </Link>

                </div>

            </section>

        </main>
    );
}