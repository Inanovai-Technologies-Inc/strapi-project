import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

function renderBlocks(blocks: any[]) {
    if (!blocks || !Array.isArray(blocks)) {
        return null;
    }

    return blocks.map((block: any, index: number) => {
        const text = block.children
            ?.map((child: any) => child.text || "")
            .join("");

        if (!text) {
            return null;
        }

        switch (block.type) {
            case "paragraph":
                return (
                    <p
                        key={index}
                        className="mb-5 text-base leading-8 text-gray-600"
                    >
                        {text}
                    </p>
                );

            case "heading":
                return (
                    <h3
                        key={index}
                        className="mb-5 text-xl font-bold text-gray-900"
                    >
                        {text}
                    </h3>
                );

            case "list":
                return (
                    <ul
                        key={index}
                        className="mb-5 list-disc space-y-2 pl-6 text-gray-600"
                    >
                        {block.children?.map(
                            (item: any, itemIndex: number) => (
                                <li key={itemIndex}>
                                    {item.children
                                        ?.map(
                                            (child: any) =>
                                                child.text || ""
                                        )
                                        .join("")}
                                </li>
                            )
                        )}
                    </ul>
                );

            default:
                return (
                    <p
                        key={index}
                        className="mb-5 text-base leading-8 text-gray-600"
                    >
                        {text}
                    </p>
                );
        }
    });
}

/* =====================================================
   YOUTUBE URL HELPER
===================================================== */

function getYouTubeEmbedUrl(url: string) {
    if (!url) {
        return null;
    }

    try {
        const parsedUrl = new URL(url);

        // youtube.com/watch?v=VIDEO_ID
        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.searchParams.get("v")
        ) {
            const videoId = parsedUrl.searchParams.get("v");

            return `https://www.youtube.com/embed/${videoId}`;
        }

        // youtu.be/VIDEO_ID
        if (parsedUrl.hostname === "youtu.be") {
            const videoId = parsedUrl.pathname.replace("/", "");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }

        // Already an embed URL
        if (
            parsedUrl.hostname.includes("youtube.com") &&
            parsedUrl.pathname.startsWith("/embed/")
        ) {
            return url;
        }

        return null;
    } catch {
        return null;
    }
}

export default async function ProductDetailPage({
    params,
}: ProductPageProps) {
    const { slug } = await params;

    const response = await fetch(
        `${STRAPI_URL}/api/products?filters[slug][$eq]=${encodeURIComponent(
            slug
        )}&populate=*`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    const result = await response.json();

    const product = result.data?.[0];

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

    const imageUrl = product.Image?.url
        ? `${STRAPI_URL}${product.Image.url}`
        : null;

    /* =====================================================
       VIDEO
    ===================================================== */

    const videoEmbedUrl = product.VideoURL
        ? getYouTubeEmbedUrl(product.VideoURL)
        : null;

    /* =====================================================
       TECHNICAL SPECIFICATIONS
    ===================================================== */

    const technicalSpecifications =
        product.TechnicalSpecification || [];

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

                        {/* Product Image */}
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

                        {/* Product Name + Description */}
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
            {product.Features?.length > 0 && (
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
            {product.Applications?.length > 0 && (
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
===================================================== */}
{technicalSpecifications.length > 0 && (
    <section className="px-6 py-16 lg:px-8">

        <div className="mx-auto max-w-7xl">

            {/* Section Heading */}
            <div className="mb-8">

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                    Product Information
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                    Technical Specifications
                </h2>

                <div className="mt-4 h-1 w-12 bg-orange-500" />

                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                    Detailed technical information and specifications for
                    this product.
                </p>

            </div>


            {/* Specifications Table */}
            <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* Table Header */}
                <div className="grid grid-cols-1 border-b border-gray-200 bg-gray-900 text-white sm:grid-cols-[220px_1fr]">

                    <div className="px-5 py-3 text-sm font-bold uppercase tracking-wider">
                        Specification
                    </div>

                    <div className="px-5 py-3 text-sm font-bold uppercase tracking-wider">
                        Value
                    </div>

                </div>


                {/* Specification Rows */}
                {technicalSpecifications.map(
                    (spec: any, index: number) => {

                        if (!spec.Label && !spec.Value) {
                            return null;
                        }

                        return (
                            <div
                                key={index}
                                className={`grid grid-cols-1 sm:grid-cols-[220px_1fr] ${
                                    index !==
                                    technicalSpecifications.length - 1
                                        ? "border-b border-gray-200"
                                        : ""
                                } transition hover:bg-orange-50`}
                            >

                                {/* Label */}
                                <div className="bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-800 sm:border-r sm:border-gray-200">
                                    {spec.Label || "—"}
                                </div>

                                {/* Value */}
                                <div className="px-5 py-4 text-sm leading-6 text-gray-600">
                                    {spec.Value || "—"}
                                </div>

                            </div>
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

                        {/* Section Heading */}
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


                        {/* Video */}
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