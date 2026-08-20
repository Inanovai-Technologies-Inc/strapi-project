import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

type ProductPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

/* =========================================================
   RENDER STRAPI RICH TEXT
========================================================= */

function renderBlocks(blocks: any[]) {
    if (!Array.isArray(blocks)) {
        return null;
    }

    return blocks.map((block: any, index: number) => {
        if (!block) {
            return null;
        }

        const children = block.children || [];

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
                        {children.map((item: any, itemIndex: number) => (
                            <li key={itemIndex}>
                                {item?.children
                                    ?.map((child: any) => child?.text || "")
                                    .join("") || ""}
                            </li>
                        ))}
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
   YOUTUBE EMBED URL
========================================================= */

function getYouTubeEmbedUrl(url: string) {
    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("youtu.be")) {
            const videoId = parsedUrl.pathname.substring(1);

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        if (parsedUrl.hostname.includes("youtube.com")) {
            const videoId = parsedUrl.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (parsedUrl.pathname.startsWith("/embed/")) {
                return url;
            }
        }

        return null;
    } catch {
        return null;
    }
}


/* =========================================================
   IMAGE URL HELPER
========================================================= */

function getImageUrl(image: any) {
    if (!image) {
        return null;
    }

    const imageData =
        image?.data?.attributes ||
        image?.data ||
        image;

    if (!imageData?.url) {
        return null;
    }

    if (imageData.url.startsWith("http")) {
        return imageData.url;
    }

    return `${STRAPI_URL}${imageData.url}`;
}


/* =========================================================
   PRODUCT DETAIL PAGE
========================================================= */

export default async function ProductDetailPage({
    params,
}: ProductPageProps) {

    const { slug } = await params;


    /* =========================================================
       FETCH MAIN PRODUCT

       IMPORTANT:
       Keep populate=*.
       Do NOT use:
       populate[relatedProducts][populate]=*
    ========================================================= */

    const response = await fetch(
        `${STRAPI_URL}/api/products?filters[slug][$eq]=${encodeURIComponent(
            slug
        )}&populate=*`,
        {
            cache: "no-store",
        }
    );


    /* =========================================================
       API ERROR
    ========================================================= */

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch product: ${response.status} ${errorText}`
        );
    }


    const result = await response.json();

    const product = result.data?.[0];


    /* =========================================================
       PRODUCT NOT FOUND
    ========================================================= */

    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

                <div className="text-center">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Product Not Found
                    </h1>

                    <p className="mt-3 text-gray-500">
                        The product you are looking for does not exist.
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
       MAIN PRODUCT IMAGE
    ========================================================= */

    const imageUrl = getImageUrl(product.Image);


    /* =========================================================
       VIDEO
    ========================================================= */

    const videoEmbedUrl = product.VideoURL
        ? getYouTubeEmbedUrl(product.VideoURL)
        : null;


    /* =========================================================
       TECHNICAL SPECIFICATIONS

       Only keep rows that actually contain data.
    ========================================================= */

    const technicalSpecifications = Array.isArray(
        product.TechnicalSpecification
    )
        ? product.TechnicalSpecification.filter(
              (spec: any) =>
                  spec &&
                  (
                      spec.Label?.toString().trim() ||
                      spec.Value?.toString().trim()
                  )
          )
        : [];


    /* =========================================================
       RELATED PRODUCTS

       Strapi's populate=* on the main product gives us the
       related product information, but their Image relation
       may not be populated.

       Therefore, fetch each related product separately.
    ========================================================= */

    const relatedProducts = Array.isArray(product.relatedProducts)
        ? product.relatedProducts
        : [];


    const relatedProductsWithImages = await Promise.all(
        relatedProducts.map(async (related: any) => {

            if (!related?.slug) {
                return related;
            }

            try {

                const relatedResponse = await fetch(
                    `${STRAPI_URL}/api/products?filters[slug][$eq]=${encodeURIComponent(
                        related.slug
                    )}&populate=*`,
                    {
                        cache: "no-store",
                    }
                );


                if (!relatedResponse.ok) {
                    return related;
                }


                const relatedResult =
                    await relatedResponse.json();


                return relatedResult.data?.[0] || related;

            } catch {
                return related;
            }
        })
    );


    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                PRODUCT HERO
            ===================================================== */}

            <section className="bg-gray-50 px-6 py-14 lg:px-8 lg:py-20">

                <div className="mx-auto max-w-7xl">

                    <Link
                        href="/product"
                        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                    >
                        ← Back to Products
                    </Link>


                    <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:items-center">

                        {/* PRODUCT IMAGE */}

                        <div className="flex min-h-[450px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">

                            {imageUrl ? (

                                <img
                                    src={imageUrl}
                                    alt={
                                        product.Image?.alternativeText ||
                                        product.Name
                                    }
                                    className="max-h-[420px] w-full object-contain"
                                />

                            ) : (

                                <p className="text-gray-400">
                                    No image available
                                </p>

                            )}

                        </div>


                        {/* PRODUCT INFORMATION */}

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

                                    <p className="mt-4 text-base leading-8 text-gray-600">
                                        {product.description}
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FEATURES
            ===================================================== */}

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

                                {renderBlocks(product.Features)}

                            </div>

                        </div>

                    </section>

                )}


            {/* =====================================================
                APPLICATIONS
            ===================================================== */}

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

                                {renderBlocks(product.Applications)}

                            </div>

                        </div>

                    </section>

                )}


            {/* =====================================================
                TECHNICAL SPECIFICATIONS

                ENTIRE SECTION IS HIDDEN WHEN EMPTY
            ===================================================== */}

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

                            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                                Detailed technical information and
                                specifications for this product.
                            </p>

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
                                (spec: any, index: number) => (

                                    <div
                                        key={index}
                                        className="grid grid-cols-1 border-b border-gray-200 last:border-b-0 sm:grid-cols-[220px_1fr]"
                                    >

                                        <div className="bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-800 sm:border-r sm:border-gray-200">
                                            {spec.Label}
                                        </div>

                                        <div className="px-5 py-4 text-sm leading-6 text-gray-600">
                                            {spec.Value}
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </section>

            )}


            {/* =====================================================
                RELATED PRODUCTS
            ===================================================== */}

            {relatedProductsWithImages.length > 0 && (

                <section className="bg-gray-50 px-6 py-20 lg:px-8">

                    <div className="mx-auto max-w-7xl">

                        {/* HEADING */}

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


                        {/* RELATED PRODUCT GRID */}

                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                            {relatedProductsWithImages.map(
                                (related: any) => {

                                    const relatedImageUrl =
                                        getImageUrl(related.Image);


                                    return (

                                        <article
                                            key={related.documentId}
                                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                                        >

                                            {/* IMAGE */}

                                            <div className="relative flex h-60 items-center justify-center overflow-hidden bg-[#f5f6f7] p-8">

                                                <div className="absolute left-0 top-0 h-1 w-16 bg-orange-500 transition-all duration-300 group-hover:w-24" />

                                                {relatedImageUrl ? (

                                                    <img
                                                        src={relatedImageUrl}
                                                        alt={
                                                            related.Image
                                                                ?.alternativeText ||
                                                            related.Name
                                                        }
                                                        className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                                                    />

                                                ) : (

                                                    <div className="text-sm text-gray-400">
                                                        Product image unavailable
                                                    </div>

                                                )}

                                            </div>


                                            {/* CONTENT */}

                                            <div className="p-6">

                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                                                    Related Product
                                                </p>


                                                <h3 className="mt-3 min-h-[56px] text-lg font-bold uppercase leading-7 text-[#0b1f3a]">
                                                    {related.Name}
                                                </h3>


                                                <div className="mt-4 h-px w-full bg-gray-100" />


                                                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                                                    {related.description ||
                                                        "Explore this related fire protection solution."}
                                                </p>


                                                <Link
                                                    href={`/product/${related.slug}`}
                                                    className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-[#0b1f3a] transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                                                >

                                                    <span>
                                                        View Product
                                                    </span>

                                                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                                        →
                                                    </span>

                                                </Link>

                                            </div>

                                        </article>

                                    );
                                }
                            )}

                        </div>

                    </div>

                </section>

            )}


            {/* =====================================================
                PRODUCT VIDEO
            ===================================================== */}

            {videoEmbedUrl && (

                <section className="bg-gray-50 px-6 py-20 lg:px-8">

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
                                Watch the product demonstration to learn more
                                about its features, operation and capabilities.
                            </p>

                        </div>


                        <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl">

                            <div className="relative aspect-video">

                                <iframe
                                    src={videoEmbedUrl}
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


            {/* =====================================================
                CONTACT
            ===================================================== */}

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
                            Get in touch with us for product specifications,
                            pricing and technical information.
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