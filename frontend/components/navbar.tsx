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
                    LOGO
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


                {/* =====================================================
                    SEARCH + NAVIGATION
                ===================================================== */}

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

                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="hidden md:block">
                        <SiteSearch />
                    </div>


                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

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


                    {/* =================================================
                        THEME TOGGLE
                    ================================================= */}

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
            </div>
        </nav>
    );
}