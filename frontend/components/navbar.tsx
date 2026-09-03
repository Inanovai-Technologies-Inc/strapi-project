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

    // ALL navigation routes live inside the hamburger menu.
    // Products is additionally visible in the main navbar.
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
            name: t("nav.services"),
            href: "/services",
            active: pathname.startsWith("/services"),
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

    const productsItem = navItems.find(
        (item) => item.href === "/product"
    );

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
                    px-4
                    sm:px-7
                    lg:px-10
                    xl:px-12
                "
            >
                {/* =====================================================
                    LOGO
                ====================================================== */}
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
                            w-[132px]
                            object-contain

                            dark:brightness-110

                            sm:w-[150px]
                        "
                    />
                </Link>

                {/* =====================================================
                    RIGHT SIDE OF NAVBAR
                    SAME ON EVERY PAGE
                ====================================================== */}
                <div
                    className="
                        ml-auto
                        flex
                        min-w-0
                        items-center
                        gap-2

                        sm:gap-3
                        lg:gap-4
                    "
                >
                    {/* =================================================
                        SEARCH
                        Desktop/tablet only.
                        On mobile it is available inside hamburger.
                    ================================================== */}
                    <div
                        className="
                            hidden
                            min-w-0
                            md:block
                        "
                    >
                        <SiteSearch />
                    </div>

                    {/* =================================================
                        PRODUCTS
                        Visible in navbar on desktop/tablet.
                        On mobile it is inside hamburger.
                    ================================================== */}
                    {productsItem && (
                        <Link
                            href="/product"
                            className={`
                                hidden
                                shrink-0
                                items-center
                                whitespace-nowrap
                                rounded-lg
                                px-3
                                py-2.5
                                text-[15px]
                                font-medium
                                transition-all
                                duration-300

                                sm:inline-flex

                                ${
                                    productsItem.active
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
                            {productsItem.name}
                        </Link>
                    )}

                    {/* =================================================
                        LANGUAGE + THEME
                        Always visible.
                    ================================================== */}
                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1.5

                            sm:gap-2
                            sm:border-l
                            sm:border-gray-200
                            sm:pl-3

                            dark:border-white/10
                        "
                    >
                        <LanguageSelector />
                        <ThemeToggle />
                    </div>

                    {/* =================================================
                        HAMBURGER
                        ALWAYS VISIBLE ON EVERY PAGE
                    ================================================== */}
                    <NavMenu
                        id="main-navigation-menu"
                        items={navItems}
                        pathname={pathname}
                        t={t}
                    />
                </div>
            </div>
        </nav>
    );
}


/* ============================================================
   HAMBURGER MENU

   This component is used on EVERY PAGE.

   It contains:
   Home
   About
   Products
   Services
   Careers
   Technical Documents
   Contact
============================================================ */

function NavMenu({
    id,
    items,
    pathname,
    t,
}: {
    id: string;

    items: {
        name: string;
        href: string;
        active: boolean;
    }[];

    pathname: string;

    t: (key: string) => string;
}) {
    const [open, setOpen] = React.useState(false);

    const containerRef =
        React.useRef<HTMLDivElement | null>(null);

    /* ============================================================
       CLOSE MENU WHEN NAVIGATING TO ANOTHER PAGE
    ============================================================ */

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    /* ============================================================
       CLOSE WHEN CLICKING OUTSIDE
       CLOSE WHEN PRESSING ESCAPE
    ============================================================ */

    React.useEffect(() => {
        if (!open) {
            return;
        }

        function handleOutsideClick(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [open]);

    return (
        <div
            ref={containerRef}
            className="
                relative
                flex
                shrink-0
                items-center
            "
        >
            {/* ========================================================
                HAMBURGER BUTTON
            ========================================================= */}

            <button
                type="button"
                onClick={() =>
                    setOpen((value) => !value)
                }
                aria-expanded={open}
                aria-controls={id}
                aria-label={
                    open
                        ? t("nav.closeMenu")
                        : t("nav.openMenu")
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
                    {open
                        ? t("nav.closeMenu")
                        : t("nav.openMenu")}
                </span>

                <span
                    className="
                        relative
                        block
                        h-4
                        w-5
                    "
                >
                    {/* TOP LINE */}
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

                    {/* MIDDLE LINE */}
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

                            ${
                                open
                                    ? "opacity-0"
                                    : "opacity-100"
                            }
                        `}
                    />

                    {/* BOTTOM LINE */}
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


            {/* ========================================================
                HAMBURGER DROPDOWN
            ========================================================= */}

            <div
                id={id}
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
                            ? `
                                pointer-events-auto
                                translate-y-0
                                scale-100
                                opacity-100
                            `
                            : `
                                pointer-events-none
                                -translate-y-2
                                scale-95
                                opacity-0
                            `
                    }
                `}
            >
                {/* ====================================================
                    SEARCH INSIDE MOBILE / HAMBURGER MENU
                ===================================================== */}

                <div
                    className="
                        border-b
                        border-gray-100
                        p-3

                        dark:border-white/10
                    "
                >
                    <SiteSearch />
                </div>


                {/* ====================================================
                    ALL ROUTES
                ===================================================== */}

                <ul className="p-2">
                    {items.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() =>
                                    setOpen(false)
                                }
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
                                <span>
                                    {item.name}
                                </span>

                                {item.active && (
                                    <span className="text-xs">
                                        ●
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}