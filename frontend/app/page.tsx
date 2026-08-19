import Image from "next/image";
import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

const marketSegments = [
    "OFFSHORE",
    "MARITIME",
    "AVIATION",
    "YACHT",
    "RENEWABLE",
    "ONSHORE",
];

const news = [
    {
        title: "Up to What Battery Capacity Battery Fire Ionex-EA Can Be Used?",
        description:
            "The widespread adoption of lithium-ion batteries continues to accelerate, driven by the growing reliance on electric mobility and compact personal appliances.",
    },
    {
        title: "Indiana Convention Centre, Stand 4858",
        description:
            "Come join us at FDIC International Expo and be part of the biggest fire, safety & security show in the United States.",
    },
];

export default async function Home() {

    // =====================================================
    // FETCH PRODUCTS FROM STRAPI
    // =====================================================

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
        <main className="bg-white text-gray-900">

            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="relative min-h-[650px] overflow-hidden bg-gray-900">

                {/* Background Image */}
                <Image
                    src="/images/hero.jpg"
                    alt="Marsol Technologies"
                    fill
                    priority
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 lg:px-8">
                    <div className="max-w-3xl text-white">

                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
                            Marsol Technologies
                        </p>

                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                            Fire Protection
                            <br />
                            <span className="text-orange-400">
                                Engineered for Excellence
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">
                            More than 30 years of experience serving the Oil & Gas
                            and Offshore industries with advanced fire suppression
                            and safety solutions.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">

                            <Link
                                href="/about"
                                className="rounded-md bg-orange-500 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-orange-600"
                            >
                                Learn More
                            </Link>

                            <Link
                                href="/product"
                                className="rounded-md border border-white px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-white hover:text-gray-900"
                            >
                                Our Products
                            </Link>

                        </div>
                    </div>
                </div>
            </section>


            {/* =====================================================
                INTRODUCTION
            ===================================================== */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">

                    <div>
                        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                            Marsol Technologies
                        </p>

                        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                            Welcome to Marsol Technologies
                        </h2>

                        <div className="mt-6 h-1 w-16 bg-orange-500" />

                        <p className="mt-7 text-base leading-8 text-gray-600">
                            Comes with more than 30 years of experience working
                            with Oil & Gas and Offshore Industries. Specialized
                            in helideck fire suppression, we are expanding our
                            reach across industries and regions.
                        </p>

                        <Link
                            href="/about"
                            className="mt-8 inline-flex rounded-md bg-gray-900 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-orange-500"
                        >
                            Learn More
                        </Link>
                    </div>

                    <div className="relative h-[400px] overflow-hidden rounded-2xl">
                        <Image
                            src="/images/about.jpg"
                            alt="Marsol Technologies"
                            fill
                            className="object-cover"
                        />
                    </div>

                </div>
            </section>


            {/* =====================================================
                DIFFS
            ===================================================== */}
            <section className="bg-gray-100 px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">

                    <div className="relative order-2 h-[420px] overflow-hidden rounded-2xl lg:order-1">
                        <Image
                            src="/images/diffs.jpg"
                            alt="Marsol DiFFS"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="order-1 lg:order-2">

                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                            Innovation
                        </p>

                        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                            Marsol DiFFS
                        </h2>

                        <div className="mt-5 h-1 w-16 bg-orange-500" />

                        <p className="mt-7 text-base leading-8 text-gray-600">
                            Our DiFFS (Deck Integrated Fire Fighting Systems)
                            removes the issues and concerns of mechanical
                            failure. Fully certified and recognized by the likes
                            of UL, ABS, CAA and USCG.
                        </p>

                        <Link
                            href="/diff-system"
                            className="mt-8 inline-flex rounded-md bg-orange-500 px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-orange-600"
                        >
                            Learn More
                        </Link>

                    </div>
                </div>
            </section>


            {/* =====================================================
                MARKET SEGMENTS
            ===================================================== */}
            <section className="bg-gray-900 px-6 py-20 lg:px-8 lg:py-24">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
                            Industries
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                            Market Segments We Serve
                        </h2>
                    </div>

                    <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

                        {marketSegments.map((segment) => (
                            <div
                                key={segment}
                                className="group flex h-36 items-center justify-center border border-gray-700 bg-gray-800 px-4 transition hover:border-orange-500 hover:bg-orange-500"
                            >
                                <h3 className="text-center text-sm font-bold tracking-widest text-white">
                                    {segment}
                                </h3>
                            </div>
                        ))}

                    </div>
                </div>
            </section>


            {/* =====================================================
                PRODUCTS
            ===================================================== */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                            Our Products
                        </p>

                        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                            Product Portfolio
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-gray-600">
                            Here is a sneak peek of our top-notch products
                            that are widely used across the industry.
                        </p>

                    </div>


                    {/* Products from Strapi */}
                    {products.length === 0 ? (

                        <div className="mt-14 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                            <p className="text-gray-500">
                                No products available.
                            </p>
                        </div>

                    ) : (

                        <div className="mt-14 grid gap-8 md:grid-cols-3">

                            {products.slice(0, 3).map((product: any) => {

                                const imageUrl = product.Image?.url
                                    ? `${STRAPI_URL}${product.Image.url}`
                                    : null;

                                return (
                                    <div
                                        key={product.documentId}
                                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        {/* Product Image */}
                                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100 p-8">

                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        product.Image
                                                            ?.alternativeText ||
                                                        product.Name
                                                    }
                                                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-400">
                                                    Product image unavailable
                                                </div>
                                            )}

                                        </div>


                                        {/* Product Content */}
                                        <div className="p-7">

                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                                                Fire Protection
                                            </p>

                                            <h3 className="mt-3 min-h-[56px] text-xl font-bold uppercase leading-7">
                                                {product.Name}
                                            </h3>

                                            <div className="mt-3 h-1 w-10 bg-orange-500" />

                                            <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-600">
                                                {product.description ||
                                                    "Engineered fire protection equipment designed for reliable performance and demanding safety applications."}
                                            </p>

                                            <Link
                                                href={`/product/${product.slug}`}
                                                className="mt-6 inline-block text-sm font-bold uppercase tracking-wide text-orange-500 hover:text-orange-600"
                                            >
                                                View Product →
                                            </Link>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    )}


                    {/* View All Products */}
                    <div className="mt-12 flex justify-center">

                        <Link
                            href="/product"
                            className="rounded-md bg-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-500"
                        >
                            View All Products →
                        </Link>

                    </div>


                    {/* Video */}
                    <div className="mt-16 flex justify-center">

                        <a
                            href="https://www.youtube.com/watch?v=c-ktvarTRUg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-md bg-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-500"
                        >

                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs">
                                ▶
                            </span>

                            Play Product Video

                        </a>

                    </div>

                </div>
            </section>


            {/* =====================================================
                CERTIFICATIONS
            ===================================================== */}
            <section className="border-y border-gray-200 bg-gray-50 px-6 py-20 lg:px-8">

                <div className="mx-auto max-w-7xl text-center">

                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                        Quality & Compliance
                    </p>

                    <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                        Certifications
                    </h2>

                    <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">

                        {[
                            "UL",
                            "ABS",
                            "CAA",
                            "USCG",
                            "ISO",
                            "DNV",
                        ].map((certification) => (
                            <div
                                key={certification}
                                className="flex h-28 items-center justify-center rounded-lg border border-gray-200 bg-white text-xl font-bold text-gray-500 shadow-sm"
                            >
                                {certification}
                            </div>
                        ))}

                    </div>
                </div>
            </section>


            {/* =====================================================
                BRANDS / LOCATIONS
            ===================================================== */}
            <section className="px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                            Global Presence
                        </p>

                        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                            Our Brands
                        </h2>

                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-3">

                        <div className="rounded-xl border border-gray-200 p-8">

                            <h3 className="text-xl font-bold">
                                Marsol Technologies, Inc.
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-gray-600">
                                14331 Spencer Road (FM-529),
                                <br />
                                Houston, Texas-77095, USA
                                <br />
                                <br />
                                Phone: +1-346-701-8268
                                <br />
                                Fax: +1-346-701-8261
                            </p>

                        </div>


                        <div className="rounded-xl border border-gray-200 p-8">

                            <h3 className="text-xl font-bold">
                                Marsol Technologies, FZE.
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-gray-600">
                                P.O Box 50481,
                                <br />
                                Hamriyah Free Zone, Sharjah, UAE
                                <br />
                                <br />
                                Phone: +971-6-5269350
                                <br />
                                Fax: +971-6-5269340
                            </p>

                        </div>


                        <div className="rounded-xl border border-gray-200 p-8">

                            <h3 className="text-xl font-bold">
                                Marsol Engineering (India) Pvt. Ltd.
                            </h3>

                            <p className="mt-5 text-sm leading-7 text-gray-600">
                                Akshatha Enclave, Kuvempunagar,
                                <br />
                                Mysore, 570023
                                <br />
                                Karnataka, India
                                <br />
                                <br />
                                Email: info@marsoltech.com
                            </p>

                        </div>

                    </div>
                </div>
            </section>


            {/* =====================================================
                LATEST NEWS
            ===================================================== */}
            <section className="bg-gray-100 px-6 py-20 lg:px-8 lg:py-28">

                <div className="mx-auto max-w-7xl">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                                Updates
                            </p>

                            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                                Latest News
                            </h2>

                        </div>

                        <Link
                            href="/news-events"
                            className="text-sm font-bold uppercase tracking-wide text-orange-500"
                        >
                            More News →
                        </Link>

                    </div>


                    <div className="mt-12 grid gap-8 md:grid-cols-2">

                        {news.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg"
                            >

                                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                                    News & Events
                                </p>

                                <h3 className="mt-4 text-2xl font-bold leading-tight">
                                    {item.title}
                                </h3>

                                <p className="mt-5 text-sm leading-7 text-gray-600">
                                    {item.description}
                                </p>

                                <Link
                                    href="/news-events"
                                    className="mt-6 inline-block text-sm font-bold uppercase tracking-wide text-gray-900 hover:text-orange-500"
                                >
                                    Read More →
                                </Link>

                            </article>
                        ))}

                    </div>
                </div>
            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}
            <footer className="bg-gray-950 px-6 py-12 text-gray-400 lg:px-8">

                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">

                    <div>

                        <h2 className="text-xl font-bold text-white">
                            MARSOL TECHNOLOGIES
                        </h2>

                        <p className="mt-2 text-sm">
                            Advanced Fire Protection & Safety Solutions
                        </p>

                    </div>


                    <div className="flex flex-wrap gap-6 text-sm">

                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>

                        <Link href="/about" className="hover:text-white">
                            About
                        </Link>

                        <Link href="/products" className="hover:text-white">
                            Products
                        </Link>

                        <Link href="/services" className="hover:text-white">
                            Services
                        </Link>

                        <Link href="/contact" className="hover:text-white">
                            Contact
                        </Link>

                    </div>

                </div>


                <div className="mx-auto mt-10 max-w-7xl border-t border-gray-800 pt-6 text-center text-xs">
                    © 2026 Marsol Technologies. All rights reserved.
                </div>

            </footer>

        </main>
    );
}