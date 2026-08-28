"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import SiteSearch from "./SiteSearch";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { useI18n } from "@/components/I18nProvider";

export default function Navbar() {
    const pathname = usePathname();
    const { t } = useI18n();

    const navItems = [
        {
            name: t("nav.home"),
            href: "/",
            active: pathname === "/",
        },
        {
            name: t("nav.about"),
            href: "/about",
            active: pathname.startsWith("/about"),
        },
        {
            name: t("nav.products"),
            href: "/product",
            active: pathname.startsWith("/product"),
        },
        {
            name: t("nav.careers"),
            href: "/careers",
            active: pathname.startsWith("/careers"),
        },
        {
            name: t("nav.technicalDocuments"),
            href: "/technical-documents",
            active: pathname.startsWith("/technical-documents"),
        },
        {
            name: t("nav.contact"),
            href: "/contact",
            active: pathname.startsWith("/contact"),
        },
    ];

    /* =====================================================
       On the Products listing page we swap the full nav for
       a compact "[Logo] Fire-Fighting Products  [☰]" bar.
       The existing destinations move into the menu — nothing
       is removed, and there is still only one <nav>.

       Scoped to /product exactly so product detail and
       compare pages keep their existing navigation.
    ===================================================== */

    const isProductsPage =
        pathname === "/product" || pathname === "/product/";

    return (
        <nav
            className="
                sticky
                top-0
                z-50
                w-full
                border-b
                border-gray-200/80
                bg-white/95
                shadow-sm
                backdrop-blur-xl
                transition-all
                duration-500

                dark:border-white/10
                dark:bg-[#07111d]/95
                dark:shadow-black/20
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-[68px]
                    w-full
                    max-w-[1500px]
                    items-center
                    px-5
                    sm:px-7
                    lg:px-10
                    xl:px-12
                "
            >

                {/* =====================================================
                    LOGO (unchanged behaviour on every route)
                ===================================================== */}

                <Link
                    href="/"
                    className="
                        flex
                        shrink-0
                        items-center
                        transition-transform
                        duration-300
                        hover:scale-[1.02]
                    "
                >
                    <Image
                        src="/images/marsol-logo.jpg"
                        alt="Marsol Technologies"
                        width={160}
                        height={55}
                        priority
                        className="
                            h-auto
                            w-[150px]
                            object-contain

                            dark:brightness-110
                        "
                    />
                </Link>

                {isProductsPage ? (
                    <ProductsNav navItems={navItems} pathname={pathname} t={t} />
                ) : (
                    <DefaultNav navItems={navItems} />
                )}

            </div>
        </nav>
    );
}

/* =========================================================
   DEFAULT NAVIGATION (all non-Products routes) — unchanged
========================================================= */

function DefaultNav({
    navItems,
}: {
    navItems: { name: string; href: string; active: boolean }[];
}) {
    return (
        <div
            className="
                ml-auto
                flex
                items-center
                gap-3
                lg:gap-5
                xl:gap-6
            "
        >

            {/* SEARCH */}

            <div className="hidden md:block">
                <SiteSearch />
            </div>

            {/* NAVIGATION */}

            <ul
                className="
                    hidden
                    items-center
                    gap-1
                    lg:flex
                    xl:gap-2
                "
            >
                {navItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`
                                relative
                                inline-flex
                                items-center
                                whitespace-nowrap
                                rounded-lg
                                px-3
                                py-2.5
                                text-[15px]
                                font-medium
                                transition-all
                                duration-300

                                ${
                                    item.active
                                        ? `
                                            bg-black
                                            text-white
                                            shadow-sm

                                            dark:bg-white
                                            dark:text-black
                                        `
                                        : `
                                            text-gray-600

                                            hover:bg-gray-100
                                            hover:text-gray-950

                                            dark:text-gray-400
                                            dark:hover:bg-white/5
                                            dark:hover:text-white
                                        `
                                }
                            `}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* THEME + LANGUAGE */}

            <div
                className="
                    ml-1
                    flex
                    shrink-0
                    items-center
                    gap-2
                    border-l
                    border-gray-200
                    pl-3

                    dark:border-white/10

                    sm:pl-4
                "
            >
                <LanguageSelector />
                <ThemeToggle />
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCTS NAVIGATION — compact bar + animated menu
========================================================= */

function ProductsNav({
    navItems,
    pathname,
    t,
}: {
    navItems: { name: string; href: string; active: boolean }[];
    pathname: string;
    t: (key: string) => string;
}) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    // Close when the route changes.
    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close on outside click / Escape while the menu is open.
    React.useEffect(() => {
        if (!open) {
            return;
        }

        function onPointerDown(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <>
            {/* CURRENT SECTION TITLE */}

            <div
                className="
                    ml-4
                    flex
                    min-w-0
                    items-center
                    border-l
                    border-gray-200
                    pl-4

                    dark:border-white/10

                    sm:ml-6
                    sm:pl-6
                "
            >
                <span
                    className="
                        truncate
                        text-[13px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#0b1f3a]

                        dark:text-white

                        sm:text-sm
                        sm:tracking-[0.24em]
                    "
                >
                    {t("nav.fireFightingProducts")}
                </span>
            </div>

            {/* MENU TRIGGER + PANEL */}

            <div
                ref={containerRef}
                className="relative ml-auto flex items-center"
            >
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    aria-expanded={open}
                    aria-controls="products-nav-menu"
                    aria-label={
                        open ? t("nav.closeMenu") : t("nav.openMenu")
                    }
                    className="
                        group
                        relative
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        transition-colors
                        duration-300

                        hover:border-gray-300
                        hover:bg-gray-50

                        dark:border-white/10
                        dark:bg-white/5
                        dark:hover:bg-white/10
                    "
                >
                    <span className="sr-only">
                        {open ? t("nav.closeMenu") : t("nav.openMenu")}
                    </span>

                    <span className="relative block h-4 w-5">
                        <span
                            className={`
                                absolute
                                left-0
                                block
                                h-0.5
                                w-full
                                rounded-full
                                bg-[#0b1f3a]
                                transition-all
                                duration-300
                                ease-out

                                dark:bg-white

                                ${
                                    open
                                        ? "top-1/2 -translate-y-1/2 rotate-45"
                                        : "top-0"
                                }
                            `}
                        />
                        <span
                            className={`
                                absolute
                                left-0
                                top-1/2
                                block
                                h-0.5
                                w-full
                                -translate-y-1/2
                                rounded-full
                                bg-[#0b1f3a]
                                transition-all
                                duration-200
                                ease-out

                                dark:bg-white

                                ${open ? "opacity-0" : "opacity-100"}
                            `}
                        />
                        <span
                            className={`
                                absolute
                                left-0
                                block
                                h-0.5
                                w-full
                                rounded-full
                                bg-[#0b1f3a]
                                transition-all
                                duration-300
                                ease-out

                                dark:bg-white

                                ${
                                    open
                                        ? "top-1/2 -translate-y-1/2 -rotate-45"
                                        : "bottom-0"
                                }
                            `}
                        />
                    </span>
                </button>

                {/* PANEL */}

                <div
                    id="products-nav-menu"
                    className={`
                        absolute
                        right-0
                        top-[calc(100%+0.75rem)]
                        w-[min(88vw,320px)]
                        origin-top-right
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-xl
                        shadow-black/5
                        transition-all
                        duration-200
                        ease-out

                        dark:border-white/10
                        dark:bg-[#0b1622]
                        dark:shadow-black/40

                        ${
                            open
                                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                                : "pointer-events-none -translate-y-2 scale-95 opacity-0"
                        }
                    `}
                >
                    <div className="border-b border-gray-100 p-3 dark:border-white/10">
                        <SiteSearch />
                    </div>

                    <ul className="p-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`
                                        flex
                                        items-center
                                        justify-between
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-[15px]
                                        font-medium
                                        transition-colors
                                        duration-200

                                        ${
                                            item.active
                                                ? `
                                                    bg-black
                                                    text-white

                                                    dark:bg-white
                                                    dark:text-black
                                                `
                                                : `
                                                    text-gray-600

                                                    hover:bg-gray-100
                                                    hover:text-gray-950

                                                    dark:text-gray-300
                                                    dark:hover:bg-white/5
                                                    dark:hover:text-white
                                                `
                                        }
                                    `}
                                >
                                    {item.name}
                                    {item.active && (
                                        <span className="text-xs">
                                            ●
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3 dark:border-white/10">
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
}
