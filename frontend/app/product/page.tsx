import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

export default async function ProductPage() {
    const response = await fetch(
        `${STRAPI_URL}/api/products?populate=*`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result.data || [];

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111827]">

            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="relative overflow-hidden bg-white border-b border-gray-200">

                {/* Decorative background */}
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-100 opacity-50 blur-3xl" />
                <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-gray-100 opacity-70 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">

                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_360px]">

                        {/* Hero Content */}
                        <div>

                            <div className="mb-6 flex items-center gap-3">
                                <span className="h-[2px] w-10 bg-orange-500" />

                                <p className="text-sm font-bold uppercase tracking-[0.28em] text-orange-500">
                                    Our Products
                                </p>
                            </div>

                            <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight text-[#0b1f3a] md:text-6xl">
                                Fire Protection
                                <br />
                                <span className="text-orange-500">
                                    Built for Safety.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
                                Explore our comprehensive range of engineered
                                fire protection and safety solutions designed
                                to protect people, infrastructure and critical
                                assets in demanding environments.
                            </p>

                            <div className="mt-9 flex flex-wrap gap-4">

                                <a
                                    href="#products"
                                    className="rounded-lg bg-[#0b1f3a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500"
                                >
                                    Explore Products
                                </a>

                                <Link
                                    href="/contact"
                                    className="rounded-lg border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-[#0b1f3a] transition hover:border-orange-500 hover:text-orange-500"
                                >
                                    Contact Our Team
                                </Link>

                            </div>

                        </div>

                        {/* Hero Stats */}
                        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-[#f9fafb] shadow-sm">

                            <div className="border-b border-r border-gray-200 p-7">
                                <p className="text-3xl font-bold text-[#0b1f3a]">
                                    {products.length}+
                                </p>

                                <p className="mt-2 text-sm leading-5 text-gray-500">
                                    Safety Products
                                </p>
                            </div>

                            <div className="border-b border-gray-200 p-7">
                                <p className="text-3xl font-bold text-[#0b1f3a]">
                                    24/7
                                </p>

                                <p className="mt-2 text-sm leading-5 text-gray-500">
                                    Protection Focus
                                </p>
                            </div>

                            <div className="border-r border-gray-200 p-7">
                                <p className="text-3xl font-bold text-orange-500">
                                    100%
                                </p>

                                <p className="mt-2 text-sm leading-5 text-gray-500">
                                    Safety Driven
                                </p>
                            </div>

                            <div className="p-7">
                                <p className="text-3xl font-bold text-[#0b1f3a]">
                                    ✓
                                </p>

                                <p className="mt-2 text-sm leading-5 text-gray-500">
                                    Quality Focused
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* =========================================================
                INTRO / CATEGORY STRIP
            ========================================================= */}
            <section className="border-b border-gray-200 bg-[#0b1f3a]">
                <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

                    <div className="grid gap-8 md:grid-cols-3">

                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg text-white">
                                ✓
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    Reliable Protection
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-300">
                                    Solutions engineered for dependable
                                    fire protection performance.
                                </p>
                            </div>
                        </div>


                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg text-white">
                                ◆
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    Industrial Applications
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-300">
                                    Designed for commercial, industrial and
                                    critical infrastructure environments.
                                </p>
                            </div>
                        </div>


                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-lg text-white">
                                +
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    Complete Solutions
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-gray-300">
                                    A broad portfolio covering multiple
                                    fire safety requirements.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


            {/* =========================================================
                PRODUCTS
            ========================================================= */}
            <section
                id="products"
                className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
            >

                {/* Section Heading */}
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                    <div>

                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-orange-500" />

                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                                Product Range
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[#0b1f3a] md:text-4xl">
                            Explore Our Solutions
                        </h2>

                        <p className="mt-3 max-w-2xl text-gray-500">
                            Discover carefully engineered fire protection
                            products developed for safety, reliability and
                            demanding operating conditions.
                        </p>

                    </div>

                    <div className="text-sm font-medium text-gray-500">
                        Showing{" "}
                        <span className="font-bold text-[#0b1f3a]">
                            {products.length}
                        </span>{" "}
                        products
                    </div>

                </div>


                {products.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            +
                        </div>

                        <h3 className="mt-5 text-xl font-semibold text-gray-800">
                            No products available
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Product information will appear here once products
                            are added to the catalogue.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {products.map((product: any) => {

                            const imageUrl = product.Image?.url
                                ? `${STRAPI_URL}${product.Image.url}`
                                : null;

                            return (
                                <article
                                    key={product.documentId}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                                >

                                    {/* Image */}
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


                                    {/* Content */}
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

                                        <Link
                                            href={`/product/${product.slug}`}
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
                        })}

                    </div>

                )}

            </section>


            {/* =========================================================
                WHY CHOOSE US
            ========================================================= */}
            <section className="border-y border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        <div>

                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-[2px] w-8 bg-orange-500" />

                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                                    Why Choose Us
                                </p>
                            </div>

                            <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
                                Protection engineered around
                                <span className="text-orange-500">
                                    {" "}your safety.
                                </span>
                            </h2>

                            <p className="mt-5 max-w-xl leading-7 text-gray-600">
                                We provide dependable fire protection
                                solutions designed to meet the challenges
                                of modern industrial and commercial
                                environments.
                            </p>

                        </div>


                        <div className="grid gap-4 sm:grid-cols-2">

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <div className="text-2xl font-bold text-orange-500">
                                    01
                                </div>

                                <h3 className="mt-4 font-bold text-[#0b1f3a]">
                                    Quality Engineering
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Products selected and engineered with
                                    performance and durability in mind.
                                </p>
                            </div>


                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <div className="text-2xl font-bold text-orange-500">
                                    02
                                </div>

                                <h3 className="mt-4 font-bold text-[#0b1f3a]">
                                    Safety First
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Solutions focused on protecting people,
                                    assets and critical infrastructure.
                                </p>
                            </div>


                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <div className="text-2xl font-bold text-orange-500">
                                    03
                                </div>

                                <h3 className="mt-4 font-bold text-[#0b1f3a]">
                                    Industry Ready
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Built for demanding commercial and
                                    industrial applications.
                                </p>
                            </div>


                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <div className="text-2xl font-bold text-orange-500">
                                    04
                                </div>

                                <h3 className="mt-4 font-bold text-[#0b1f3a]">
                                    Trusted Support
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Professional support throughout your
                                    product selection journey.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                CTA
            ========================================================= */}
            <section className="bg-[#0b1f3a]">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                                Need the right solution?
                            </p>

                            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white">
                                Talk to our team about your fire protection
                                requirements.
                            </h2>

                            <p className="mt-3 max-w-xl text-gray-300">
                                Our team can help you identify the right
                                products for your application.
                            </p>

                        </div>

                        <Link
                            href="/contact"
                            className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Get in Touch →
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}