import Image from "next/image";
import Link from "next/link";

import OfficeMap from "@/components/OfficeMap";
import ScrollProgress from "@/components/ScrollProgress";
import SectionNavigation from "@/components/SectionNavigation";
import Reveal from "@/components/Reveal";
import HomeMotion, { DiffsMotion, FlowingLines } from "@/components/HomeMotion";
import AmbientBackground from "@/components/AmbientBackground";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/* =========================================================
   MARKET SEGMENTS

   Rendered as two rows of five. Logos live in /public/images
   under lowercase, hyphenated filenames (no spaces or "&") so
   they resolve identically on case-sensitive production hosts
   as they do in local dev on a case-insensitive filesystem.
========================================================= */

const marketSegments = [
    { name: "aviation", label: "Aviation", logo: "/images/aviation1.png" },
    { name: "commercial", label: "Commercial", logo: "/images/commercial1.png" },
    {
        name: "marine-offshore",
        label: "Marine & Offshore",
        logo: "/images/marine1.png",
    },
    {
        name: "manufacturing",
        label: "Manufacturing",
        logo: "/images/manufacturing1.png",
    },
    { name: "military", label: "Military", logo: "/images/military1.png" },
    {
        name: "power-generation",
        label: "Power Generation",
        logo: "/images/power1.png",
    },
    {
        name: "petrochemical",
        label: "Petrochemical",
        logo: "/images/petrochemical1.png",
    },
    { name: "renewable", label: "Renewable", logo: "/images/renewable1.png" },
    {
        name: "transportation",
        label: "Transportation",
        logo: "/images/transportation1.png",
    },
    {
        name: "waste-recycling",
        label: "Waste Recycling",
        logo: "/images/waste-recycle1.png",
    },
];

/* =========================================================
   HOME PAGE
========================================================= */

export default async function Home() {
    /* =====================================================
       FETCH PRODUCTS FROM STRAPI
    ===================================================== */

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

    /* =====================================================
       FETCH NEWS FROM STRAPI
    ===================================================== */

    const news_response = await fetch(
        `${STRAPI_URL}/api/news?sort=Date:desc`,
        {
            cache: "no-store",
        }
    );

    if (!news_response.ok) {
        throw new Error("Failed to fetch news");
    }

    const newsResult = await news_response.json();
    const news = newsResult.data || [];

    /* =====================================================
       FETCH OFFICES FROM STRAPI
    ===================================================== */

    const offices_response = await fetch(
        `${STRAPI_URL}/api/offices?sort=displayOrder:asc`,
        {
            cache: "no-store",
        }
    );

    if (!offices_response.ok) {
        throw new Error("Failed to fetch offices");
    }

    const officesResult = await offices_response.json();
    const offices = officesResult.data || [];

    /* =====================================================
       PAGE
    ===================================================== */

    return (
        <main className="homepage-motion overflow-hidden bg-white text-gray-900 dark:bg-[#050b12] dark:text-white">

            {/* =====================================================
                SCROLL PROGRESS
            ===================================================== */}

            <ScrollProgress />

            {/* =====================================================
                SECTION NAVIGATION
            ===================================================== */}

            <SectionNavigation />

            {/* =====================================================
                HERO
            ===================================================== */}

            <section
                id="home"
                className="
                    relative
                    h-[100vh]
                    min-h-[600px]
                    overflow-hidden
                    bg-[#04121f]
                    lg:h-screen
                    lg:min-h-screen
                "
            >

                {/* HERO VIDEO — full-width, full frame. The video sits
                    in normal flow so its native 16:9 ratio drives the
                    hero height with no cropping; the copy, gradients
                    and scroll cue are layered over it. */}

                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="
                        block
                        h-full
                        w-full
                        object-cover
                    "
                >
                    <source
                        src="/videos/new_hero.mp4"
                        type="video/mp4"
                    />
                </video>




                {/* DARK OVERLAY */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-black/15
                    "
                />

                <HomeMotion />


                {/* LEFT DARK GRADIENT */}

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-[#020914]/72
                        via-[#071525]/42
                        via-55%
                        to-transparent
                    "
                />


                {/* BOTTOM GRADIENT */}

                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-56
                        bg-gradient-to-t
                        from-black/35
                        to-transparent
                    "
                />


                {/* =================================================
                    HERO CONTENT
                ================================================= */}

                <div
                    className="
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                    "
                >
                    <div
                        className="
                            ml-[4vw]
                            w-full
                            max-w-[640px]
                            origin-left
                            -translate-y-28
                            scale-[0.9]
                            px-5

                            sm:ml-[5vw]
                            sm:px-0

                            lg:ml-[9vw]
                            lg:-translate-y-32
                            lg:scale-95

                            xl:ml-[10vw]
                        "
                    >

                        {/* =================================================
                            EYEBROW
                        ================================================= */}

                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                gap-3
                            "
                        >
                            <span
                                className="
                                    h-px
                                    w-8
                                    bg-orange-500
                                "
                            />

                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.35em]
                                    text-orange-400

                                    sm:text-xs
                                "
                            >
                                Marsol Technologies
                            </p>
                        </div>


                        {/* =================================================
                            MAIN HEADING
                        ================================================= */}

                        <h1
                            className="
                                max-w-[680px]
                                text-[2.15rem]
                                font-semibold
                                leading-[1.02]
                                tracking-[-0.045em]
                                text-white
                                drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]

                                sm:text-[2.6rem]
                                md:text-[3rem]
                                lg:text-[3.3rem]
                                xl:text-[3.6rem]
                            "
                        >
                            Engineering Excellence

                            <br />

                            <span className="text-orange-500">
                                in Fire Protection
                            </span>

                            <br />

                            {/* <span className="text-orange-500">
                                <T k="home.hero.titleLine3" />
                            </span> */}
                        </h1>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <p
                            className="
                                mt-7
                                max-w-[610px]
                                text-[14px]
                                font-normal
                                leading-7
                                text-white/90

                                sm:text-base
                                sm:leading-8

                                lg:text-[17px]
                            "
                        >
                            Over 30 years of proven expertise in delivering advanced fire suppression and life safety solutions, protecting people, property, and business continuity across diverse industries.
                        </p>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                gap-3
                            "
                        >

                            {/* Learn More */}

                            <Link
                                href="/about"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-orange-500
                                    px-7
                                    py-3.5
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-white
                                    shadow-lg
                                    shadow-orange-500/20
                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
                                    hover:bg-orange-400
                                    hover:shadow-xl
                                "
                            >
                                Learn More

                                <span
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </Link>


                            {/* Our Products */}

                            <Link
                                href="/product"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    border
                                    border-white/40
                                    bg-white/10
                                    px-7
                                    py-3.5
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-white
                                    backdrop-blur-md
                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
                                    hover:border-white/70
                                    hover:bg-white/20
                                "
                            >
                                Our Products

                                <span
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </Link>

                        </div>

                    </div>
                </div>


                {/* =================================================
                    SCROLL INDICATOR
                ================================================= */}

                <div
                    className="
                        absolute
                        bottom-8
                        left-1/2
                        z-20
                        hidden
                        -translate-x-1/2
                        flex-col
                        items-center
                        gap-2

                        md:flex
                    "
                >
                    <span
                        className="
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[0.35em]
                            text-white/60
                        "
                    >
                        Scroll
                    </span>

                    <span
                        className="
                            h-8
                            w-px
                            animate-pulse
                            bg-gradient-to-b
                            from-orange-400
                            to-transparent
                        "
                    />
                </div>

            </section>

            {/* =====================================================
                ABOUT
            ===================================================== */}

            <section
                id="about"
                className="
                    relative
                    overflow-hidden
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <FlowingLines />
                {/* Ambient decoration */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-40
                        -top-40
                        h-96
                        w-96
                        rounded-full
                        bg-orange-500/5
                        blur-3xl
                    "
                />

                <div
                    className="
                        mx-auto
                        grid
                        max-w-[1400px]
                        gap-12
                        lg:grid-cols-2
                        lg:items-start
                        lg:gap-20
                    "
                >
                    {/* Text */}

                    <Reveal direction="left">
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-500
                                "
                            >
                                Marsol Technologies
                            </p>

                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    leading-tight
                                    tracking-tight
                                    text-gray-900
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Welcome to Marsol Technologies
                            </h2>

                            <div className="mt-4 h-1 w-16 rounded-full bg-orange-500" />

                            <p
                                className="
                                    mt-4
                                    max-w-xl
                                    text-justify
                                    text-sm
                                    leading-7
                                    text-gray-600
                                    sm:text-base
                                    sm:leading-8
                                "
                            >
                                Marsol Technologies, Inc. is a global leader in firefighting and safety solutions, delivering innovative fire protection systems that safeguard people, assets, and critical operations. With operations across the USA, UAE, and India, we combine engineering excellence, quality, and reliability to serve customers worldwide. Our ISO 9001, ISO 14001, and ISO 45001 certifications reflect our unwavering commitment to safety, quality, and environmental responsibility.
                            </p>

                            <Link
                                href="/about"
                                className="
                                    group
                                    mt-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-gray-900
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-orange-500
                                "
                            >
                                Learn More

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </Reveal>

                    {/* Image */}

                    <Reveal direction="right" delay={150}>
                        <div
                            className="
                                group
                                home-media-float
                                relative
                                h-[360px]
                                overflow-hidden
                                rounded-3xl
                                bg-gray-100
                                shadow-2xl
                                sm:h-[420px]
                                lg:h-[480px]
                            "
                        >
                            <Image
                                src="/images/new_about.png"
                                alt="Marsol Technologies"
                                fill
                                className="
                                    object-cover
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-105
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/20
                                    to-transparent
                                    opacity-60
                                "
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* =====================================================
                DIFFS
            ===================================================== */}

            <section
                id="diffs"
                className="
                    relative
                    overflow-hidden
                    bg-gray-50
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <FlowingLines />
                <DiffsMotion />
                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-40
                        top-20
                        h-96
                        w-96
                        rounded-full
                        bg-orange-500/5
                        blur-3xl
                    "
                />

                <div
                    className="
                        mx-auto
                        grid
                        max-w-[1400px]
                        gap-12
                        lg:grid-cols-2
                        lg:items-stretch
                        lg:gap-20
                    "
                >
                    {/* Image */}

                    <Reveal direction="left">
                        <div
                            className="
                                group
                                home-media-float
                                relative
                                order-2
                                h-[360px]
                                overflow-hidden
                                rounded-3xl
                                bg-gray-200
                                shadow-2xl
                                lg:order-1
                                lg:h-[480px]
                            "
                        >
                            <Image
                                src="/images/diff1.webp"
                                alt="Marsol DiFFS"
                                fill
                                className="
                                    object-cover
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-105
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/25
                                    to-transparent
                                "
                            />
                        </div>
                    </Reveal>

                    {/* Text */}

                    <Reveal direction="right" delay={150} className="lg:h-full">
                        <div className="order-1 lg:order-2 lg:flex lg:h-full lg:flex-col">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-500
                                "
                            >
                                Innovation
                            </p>

                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Marsol DiFFS
                            </h2>

                            <div className="mt-4 h-1 w-16 rounded-full bg-orange-500" />

                            <p
                                className="
                                    mt-4
                                    max-w-xl
                                    text-justify
                                    text-sm
                                    leading-7
                                    text-gray-600
                                    sm:text-base
                                    sm:leading-8
                                "
                            >
                                Marsol's Deck Integrated Firefighting System (DiFFS) provides rapid, reliable fire protection for helipads and helidecks. Designed for automatic or manual operation, the system delivers effective foam-water suppression across the entire deck surface. Tested, certified, and engineered to meet leading international standards, DiFFS ensures superior safety and dependable performance in critical operations.
                            </p>

                            <Link
                                href="product/diff-system"
                                className="
                                    group
                                    mt-7
                                    inline-flex
                                    items-center
                                    gap-2
                                    self-start
                                    rounded-lg
                                    bg-orange-500
                                    px-7
                                    py-3.5
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-orange-600
                                    hover:shadow-xl
                                    hover:shadow-orange-500/20

                                    lg:mt-auto
                                "
                            >
                                Learn More

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* =====================================================
                MARKET SEGMENTS
            ===================================================== */}

            <section
                id="industries"
                className="
                    relative
                    overflow-hidden
                    bg-[#071525]
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <FlowingLines />
                <AmbientBackground tone="navy" density="soft" />
                {/* Background decoration */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-[500px]
                        w-[700px]
                        -translate-x-1/2
                        rounded-full
                        bg-orange-500/5
                        blur-3xl
                    "
                />

                <div className="relative mx-auto max-w-[1400px]">
                    <Reveal direction="up">
                        <div className="text-center">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-400
                                "
                            >
                                Industries
                            </p>

                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Market Segments We Serve
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    text-gray-400
                                    sm:text-base
                                "
                            >
                                Advanced fire protection and safety solutions designed for demanding environments.
                            </p>
                        </div>
                    </Reveal>

                    {/* Industry cards — two rows of five */}

                    <div
                        className="
                            mt-14
                            grid
                            grid-cols-2
                            gap-4
                            sm:grid-cols-3
                            sm:gap-5
                            lg:grid-cols-5
                        "
                    >
                        {marketSegments.map((segment, index) => (
                            <Reveal
                                key={segment.name}
                                delay={index * 60}
                                direction="up"
                            >
                                <div
                                    className="
                                        group
                                        flex
                                        h-full
                                        flex-col
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/[0.04]
                                        p-3
                                        transition-all
                                        duration-500

                                        hover:-translate-y-1
                                        hover:border-orange-400/40
                                        hover:bg-white/[0.07]
                                        hover:shadow-xl
                                        hover:shadow-orange-500/5
                                    "
                                >
                                    {/* Logo plate */}

                                    <div
                                        className="
                                            flex
                                            h-28
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-white
                                            p-4
                                            sm:h-32
                                        "
                                    >
                                        <Image
                                            src={segment.logo}
                                            alt={segment.label}
                                            width={180}
                                            height={140}
                                            className="
                                                max-h-20
                                                w-auto
                                                max-w-[150px]
                                                object-contain
                                                transition-transform
                                                duration-500

                                                group-hover:scale-110
                                            "
                                        />
                                    </div>

                                    {/* Label */}

                                    <div
                                        className="
                                            mt-3
                                            pb-1
                                            text-center
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-[0.15em]
                                            text-orange-400
                                            sm:text-xs
                                        "
                                    >
                                        {segment.label}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* =====================================================
                PRODUCTS
            ===================================================== */}

            <section
                id="products"
                className="
                    relative
                    overflow-hidden
                    bg-white
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <FlowingLines />
                <AmbientBackground density="soft" />
                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-40
                        top-20
                        h-96
                        w-96
                        rounded-full
                        bg-orange-500/5
                        blur-3xl
                    "
                />

                <div className="relative mx-auto max-w-[1400px]">
                    {/* Heading */}

                    <Reveal direction="up">
                        <div className="text-center">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-500
                                "
                            >
                                Our Products
                            </p>

                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Product Portfolio
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    text-gray-600
                                    sm:text-base
                                "
                            >
                                Here is a sneak peek of our top-notch products that are widely used across the industry.
                            </p>
                        </div>
                    </Reveal>

                    {/* Product cards */}

                    {products.length === 0 ? (
                        <div
                            className="
                                mt-14
                                rounded-2xl
                                border
                                border-dashed
                                border-gray-300
                                bg-gray-50
                                p-12
                                text-center
                            "
                        >
                            <p className="text-gray-500">
                                No products available.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                mt-14
                                grid
                                gap-7
                                md:grid-cols-2
                                lg:grid-cols-3
                            "
                        >
                            {products
                                .slice(0, 3)
                                .map((product: any, index: number) => {
                                    const imageUrl =
                                        product.Image?.url
                                            ? `${STRAPI_URL}${product.Image.url}`
                                            : null;

                                    return (
                                        <Reveal
                                            key={product.documentId}
                                            delay={index * 120}
                                            direction="up"
                                        >
                                            <div
                                                className="
                                                    group
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-gray-200
                                                    bg-white
                                                    shadow-sm
                                                    transition-all
                                                    duration-500
                                                    hover:-translate-y-3
                                                    hover:shadow-2xl
                                                "
                                            >
                                                {/* Product image */}

                                                <div
                                                    className="
                                                        relative
                                                        flex
                                                        h-64
                                                        items-center
                                                        justify-center
                                                        overflow-hidden
                                                        bg-gradient-to-br
                                                        from-gray-50
                                                        to-gray-100
                                                        p-8
                                                    "
                                                >
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={
                                                                product.Image
                                                                    ?.alternativeText ||
                                                                product.Name
                                                            }
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-contain
                                                                transition-transform
                                                                duration-700
                                                                ease-out
                                                                group-hover:scale-110
                                                            "
                                                        />
                                                    ) : (
                                                        <div className="text-sm text-gray-400">
                                                            Product image unavailable
                                                        </div>
                                                    )}

                                                    {/* Image overlay */}

                                                    <div
                                                        className="
                                                            pointer-events-none
                                                            absolute
                                                            inset-0
                                                            bg-gradient-to-t
                                                            from-black/5
                                                            to-transparent
                                                        "
                                                    />
                                                </div>

                                                {/* Content */}

                                                <div className="p-7">
                                                    <p
                                                        className="
                                                            text-[11px]
                                                            font-bold
                                                            uppercase
                                                            tracking-[0.2em]
                                                            text-orange-500
                                                        "
                                                    >
                                                        Fire Protection
                                                    </p>

                                                    <h3
                                                        className="
                                                            mt-3
                                                            min-h-[56px]
                                                            text-xl
                                                            font-bold
                                                            uppercase
                                                            leading-7
                                                            tracking-tight
                                                            text-gray-900
                                                        "
                                                    >
                                                        {product.Name}
                                                    </h3>

                                                    <div className="mt-4 h-1 w-10 rounded-full bg-orange-500 transition-all duration-300 group-hover:w-16" />

                                                    <p
                                                        className="
                                                            mt-5
                                                            line-clamp-3
                                                            text-sm
                                                            leading-7
                                                            text-gray-600
                                                        "
                                                    >
                                                        {product.description ||
                                                            "Engineered fire protection equipment designed for reliable performance and demanding safety applications."}
                                                    </p>

                                                    <Link
                                                        href={`/product/${product.slug}`}
                                                        className="
                                                            group/link
                                                            mt-6
                                                            inline-flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            font-bold
                                                            uppercase
                                                            tracking-wide
                                                            text-orange-500
                                                            transition-colors
                                                            hover:text-orange-600
                                                        "
                                                    >
                                                        View Product

                                                        <span
                                                            className="
                                                                transition-transform
                                                                duration-300
                                                                group-hover/link:translate-x-1
                                                            "
                                                        >
                                                            →
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                        </div>
                    )}

                    {/* View all */}

                    <Reveal direction="up" delay={200}>
                        <div className="mt-12 flex justify-center">
                            <Link
                                href="/product"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-lg
                                    bg-gray-900
                                    px-8
                                    py-4
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-orange-500
                                "
                            >
                                View All Products

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </Reveal>

                    {/* Product video */}

                    <Reveal direction="up" delay={300}>
                        <div className="mt-20 flex justify-center">
                            <a
                                href="https://www.youtube.com/watch?v=c-ktvarTRUg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-full
                                    border
                                    border-gray-200
                                    bg-white
                                    px-6
                                    py-3
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-gray-900
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-orange-300
                                    hover:shadow-xl
                                "
                            >
                                <span
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-orange-500
                                        text-xs
                                        text-white
                                        transition-transform
                                        duration-300
                                        group-hover:scale-110
                                    "
                                >
                                    ▶
                                </span>

                                Play Product Video
                            </a>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* =====================================================
                CERTIFICATIONS
            ===================================================== */}

            <section
                id="certifications"
                className="
                    relative
                    overflow-hidden
                    border-y
                    border-gray-200
                    bg-gray-50
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-24
                "
            >
                <FlowingLines />
                <AmbientBackground density="soft" />
                <div className="mx-auto max-w-[1400px]">
                    <Reveal direction="up">
                        <div className="text-center">
                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-500
                                "
                            >
                                Quality & Compliance
                            </p>

                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Certifications
                            </h2>
                        </div>
                    </Reveal>

                    <Reveal direction="scale">
                        <div
                            className="
                                mt-12
                                overflow-hidden
                                rounded-2xl
                                border
                                border-gray-200
                                bg-white
                                p-4
                                shadow-sm
                                sm:p-6
                            "
                        >
                            <Image
                                src="/images/certifications_black.png"
                                alt="Marsol Technologies certifications and approvals"
                                width={1460}
                                height={630}
                                sizes="(max-width: 1200px) 92vw, 1360px"
                                className="h-auto w-full object-contain"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* =====================================================
                GLOBAL PRESENCE + LATEST NEWS

                Temporarily disabled — not required for now. Flip
                the `false` below back to `true` (or remove the
                wrapper) to restore both sections as-is.
            ===================================================== */}

            {false && (
            <>
            <section
                id="global-presence"
                className="
                    relative
                    overflow-hidden
                    bg-white
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <div className="mx-auto max-w-[1400px]">
                    <Reveal direction="up">
                        <div className="mb-12 text-center">
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.3em]
                                    text-orange-500
                                "
                            >
                                Marsol Technologies
                            </p>

                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                Global Presence
                            </h2>

                            <p
                                className="
                                    mx-auto
                                    mt-5
                                    max-w-2xl
                                    text-sm
                                    leading-7
                                    text-gray-600
                                    sm:text-base
                                "
                            >
                                Our operations across the USA, UAE and India provide customers with local sales, engineering and support.
                            </p>
                        </div>
                    </Reveal>

                    <Reveal direction="up" delay={150}>
                        {offices.length === 0 ? (
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-gray-300
                                    bg-gray-50
                                    p-12
                                    text-center
                                "
                            >
                                <p className="text-gray-500">
                                    No office locations available.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-xl">
                                <OfficeMap offices={offices} />
                            </div>
                        )}
                    </Reveal>
                </div>
            </section>

            {/* =====================================================
                LATEST NEWS
            ===================================================== */}

            <section
                id="news"
                className="
                    relative
                    overflow-hidden
                    bg-gray-50
                    px-6
                    py-20
                    sm:px-8
                    lg:px-12
                    lg:py-28
                "
            >
                <FlowingLines />
                <AmbientBackground density="soft" />
                <div
                    className="
                        pointer-events-none
                        absolute
                        -left-40
                        bottom-0
                        h-96
                        w-96
                        rounded-full
                        bg-orange-500/5
                        blur-3xl
                    "
                />

                <div className="relative mx-auto max-w-[1400px]">
                    {/* Heading */}

                    <Reveal direction="up">
                        <div
                            className="
                                flex
                                flex-col
                                justify-between
                                gap-5
                                md:flex-row
                                md:items-end
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.3em]
                                        text-orange-500
                                    "
                                >
                                    Updates
                                </p>

                                <h2
                                    className="
                                        mt-4
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-gray-900
                                        sm:text-4xl
                                        lg:text-5xl
                                    "
                                >
                                    Latest News
                                </h2>
                            </div>

                            <Link
                                href="/news-events"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-orange-500
                                    transition-colors
                                    hover:text-orange-600
                                "
                            >
                                More News

                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </Link>
                        </div>
                    </Reveal>

                    {/* News */}

                    <div
                        className="
                            mt-12
                            grid
                            gap-7
                            md:grid-cols-2
                        "
                    >
                        {news.map((item: any, index: number) => (
                            <Reveal
                                key={item.id}
                                delay={index * 120}
                                direction="up"
                            >
                                <article
                                    className="
                                        group
                                        h-full
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-8
                                        shadow-sm
                                        transition-all
                                        duration-500
                                        hover:-translate-y-2
                                        hover:shadow-2xl
                                    "
                                >
                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-[0.2em]
                                            text-orange-500
                                        "
                                    >
                                        News & Events
                                    </p>

                                    <h3
                                        className="
                                            mt-4
                                            text-2xl
                                            font-bold
                                            leading-tight
                                            tracking-tight
                                            text-gray-900
                                            transition-colors
                                            duration-300
                                            group-hover:text-orange-500
                                        "
                                    >
                                        {item.NewsTitle}
                                    </h3>

                                    <div className="mt-5 h-px w-full bg-gray-100" />

                                    <p
                                        className="
                                            mt-5
                                            whitespace-pre-line
                                            text-sm
                                            leading-7
                                            text-gray-600
                                        "
                                    >
                                        {item.Description}
                                    </p>

                                    <Link
                                        href={`/news-events/${item.slug}`}
                                        className="
                                            group/link
                                            mt-6
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            text-gray-900
                                            transition-colors
                                            hover:text-orange-500
                                        "
                                    >
                                        Read More

                                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                                            →
                                        </span>
                                    </Link>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
            </>
            )}

            {/* =====================================================
                FOOTER
            ===================================================== */}


        </main>
    );
}
