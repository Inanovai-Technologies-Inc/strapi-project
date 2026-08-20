import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

export default async function ProductPage() {
    // =========================================================
    // FETCH PRODUCTS FROM STRAPI
    // =========================================================

    const response = await fetch(
        `${STRAPI_URL}/api/products?populate=*`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Failed to fetch products: ${response.status} ${errorText}`
        );
    }

    const result = await response.json();

    const allProducts = result.data || [];

    // =========================================================
    // FIND PRODUCTS THAT ARE USED AS RELATED PRODUCTS
    // =========================================================

    const relatedProductIds = new Set<string>();

    allProducts.forEach((product: any) => {
        product.relatedProducts?.forEach((related: any) => {
            if (related.documentId) {
                relatedProductIds.add(related.documentId);
            }
        });
    });

    // =========================================================
    // ONLY SHOW MAIN / PARENT PRODUCTS
    //
    // Example:
    //
    // DIFF SYSTEM
    //   ├── FOAM TANK SKID
    //   ├── SELF-CONTAINED SKID
    //   └── DIFF NOZZLES
    //
    // Only DIFF SYSTEM appears on /product.
    // =========================================================

    const products = allProducts.filter(
        (product: any) => !relatedProductIds.has(product.documentId)
    );

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111827]">

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="relative overflow-hidden border-b border-gray-200 bg-white">

                {/* Decorative background */}
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100 opacity-50 blur-3xl" />

                <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-gray-100 opacity-70 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">

                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_360px]">

                        {/* Left */}
                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                                Our Products
                            </p>

                            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-[#0b1f3a] sm:text-5xl lg:text-6xl">
                                Engineered Fire Protection Solutions
                            </h1>

                            <div className="mt-6 h-1 w-16 bg-orange-500" />

                            <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                                Explore our range of engineered fire protection
                                systems and equipment designed to provide
                                reliable performance, safety and protection
                                across demanding applications.
                            </p>

                        </div>

                        {/* Right */}
                        <div className="relative">

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-8">

                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                                    Marsol Technologies
                                </p>

                                <h2 className="mt-4 text-2xl font-bold leading-tight text-[#0b1f3a]">
                                    Advanced Fire Protection Technology
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-gray-500">
                                    Innovative systems and equipment engineered
                                    for demanding fire protection applications.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                PRODUCTS
            ========================================================= */}

            <section className="px-6 py-20 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    {/* Section Heading */}

                    <div className="mb-12">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            Product Range
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                            Our Products
                        </h2>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <p className="mt-5 max-w-3xl text-base leading-7 text-gray-500">
                            Discover our range of fire protection systems and
                            engineered equipment developed to meet demanding
                            industry requirements.
                        </p>

                    </div>


                    {/* =====================================================
                        PRODUCT GRID
                    ===================================================== */}

                    {products.length === 0 ? (

                        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">

                            <p className="text-gray-500">
                                No products available.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {products.map((product: any) => {

                                const imageUrl = product.Image?.url
                                    ? `${STRAPI_URL}${product.Image.url}`
                                    : null;

                                const hasRelatedProducts =
                                    product.relatedProducts?.length > 0;

                                return (

                                    <article
                                        key={product.documentId}
                                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                                    >

                                        {/* =====================================================
                                            IMAGE
                                        ===================================================== */}

                                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f5f6f7] p-8">

                                            {/* Orange corner accent */}

                                            <div className="absolute left-0 top-0 h-1 w-16 bg-orange-500 transition-all duration-300 group-hover:w-24" />

                                            {imageUrl ? (

                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        product.Image
                                                            ?.alternativeText ||
                                                        product.Name
                                                    }
                                                    className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                                                />

                                            ) : (

                                                <div className="text-sm text-gray-400">
                                                    Product image unavailable
                                                </div>

                                            )}

                                        </div>


                                        {/* =====================================================
                                            CONTENT
                                        ===================================================== */}

                                        <div className="p-6">

                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                                                Fire Protection
                                            </p>


                                            <h2 className="mt-3 min-h-[58px] text-lg font-bold uppercase leading-7 text-[#0b1f3a]">
                                                {product.Name}
                                            </h2>


                                            <div className="mt-4 h-px w-full bg-gray-100" />


                                            <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                                                {product.description ||
                                                    "Engineered fire protection equipment designed for reliable performance and demanding safety applications."}
                                            </p>


                                            {/* =================================================
                                                VIEW PRODUCT / VIEW PRODUCTS
                                            ================================================= */}

                                            <Link
                                                href={`/product/${product.slug}`}
                                                className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-[#0b1f3a] transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                                            >

                                                <span>
                                                    {hasRelatedProducts
                                                        ? "View Products"
                                                        : "View Product"}
                                                </span>

                                                <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                                    →
                                                </span>

                                            </Link>

                                        </div>

                                    </article>

                                );
                            })}

                        </div>

                    )}

                </div>

            </section>


            {/* =========================================================
                WHY CHOOSE US
            ========================================================= */}

            <section className="bg-white px-6 py-20 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                Why Choose Us
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                                Reliable Fire Protection Engineering
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-6 text-base leading-8 text-gray-600">
                                Our fire protection solutions are engineered to
                                meet demanding operational requirements while
                                delivering dependable performance and long-term
                                reliability.
                            </p>

                        </div>


                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Engineered Solutions
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Systems designed around specific project
                                    and application requirements.
                                </p>

                            </div>


                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Proven Performance
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Reliable equipment designed for demanding
                                    fire protection applications.
                                </p>

                            </div>


                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Industry Standards
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Solutions developed to meet applicable
                                    industry standards and requirements.
                                </p>

                            </div>


                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Technical Support
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Technical expertise and support throughout
                                    the project lifecycle.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


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