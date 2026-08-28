"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

interface Office {
    id: number;
    City?: string;
    Country?: string;
    OfficeType?: string;
}

interface SocialLinks {
    LinkedIn?: string;
    YouTube?: string;
    Facebook?: string;
}

interface Logo {
    id?: number;
    url?: string;
    alternativeText?: string;
    width?: number;
    height?: number;
}

interface SiteSettings {
    id?: number;
    documentId?: string;

    CompanyDescription?: string;
    CopyrightText?: string;

    Logo?: Logo;

    Offices?: Office[];

    SocialLinks?: SocialLinks;
}

interface StrapiResponse {
    data: SiteSettings | null;
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        async function fetchSiteSettings() {
            try {
                const response = await fetch(
                    `${STRAPI_URL}/api/site-setting?populate=*`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch site settings: ${response.status}`
                    );
                }

                const result: StrapiResponse = await response.json();

                console.log("Site Settings:", result);

                if (result.data) {
                    setSettings(result.data);
                }
            } catch (error) {
                console.error(
                    "Error fetching site settings:",
                    error
                );
            }
        }

        fetchSiteSettings();
    }, []);

    /* =====================================================
       FALLBACK CONTENT
    ===================================================== */

    const description =
        settings?.CompanyDescription ||
        "30+ years of combined experience engineering fire suppression systems for offshore, marine, aviation and industrial environments.";

    const copyright =
        settings?.CopyrightText ||
        "© 2026 Marsol Technologies. All rights reserved.";

    const offices = settings?.Offices || [];

    const socialLinks = settings?.SocialLinks || {};

    /* =====================================================
       LOGO URL
    ===================================================== */

    const logoUrl = settings?.Logo?.url
        ? settings.Logo.url.startsWith("http")
            ? settings.Logo.url
            : `${STRAPI_URL}${settings.Logo.url}`
        : "/images/brand/logo.png";

    /* =====================================================
       JSX
    ===================================================== */

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                {/* =================================================
                   MAIN FOOTER
                ================================================= */}

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* =================================================
                       BRAND
                    ================================================= */}

                    <div className="lg:col-span-1">

                        <Link
                            href="/"
                            className="inline-block"
                        >
                            <Image
                                src={logoUrl}
                                alt={
                                    settings?.Logo
                                        ?.alternativeText ||
                                    "Marsol Technologies"
                                }
                                width={180}
                                height={60}
                                className="h-auto w-[170px] object-contain"
                                unoptimized
                            />
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-7 text-gray-600">
                            {description}
                        </p>

                    </div>

                    {/* =================================================
                       COMPANY
                    ================================================= */}

                    <div>

                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                            Company
                        </h3>

                        <ul className="mt-5 space-y-3">

                            <li>
                                <Link
                                    href="/about"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    About Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/product"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/environmental-services"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    Environmental Services
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/news"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    News & Events
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/careers"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    Careers
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    Contact
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* =================================================
                       OFFICES
                    ================================================= */}

                    <div>

                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                            Offices
                        </h3>

                        <div className="mt-5 space-y-6">

                            {offices.length > 0 ? (

                                offices.map((office) => (

                                    <div key={office.id}>

                                        <p className="text-sm font-semibold text-gray-900">

                                            {office.City}

                                            {office.Country
                                                ? `, ${office.Country}`
                                                : ""}

                                        </p>

                                        {office.OfficeType && (

                                            <p className="mt-1 text-sm text-gray-600">
                                                {office.OfficeType}
                                            </p>

                                        )}

                                    </div>

                                ))

                            ) : (

                                <>
                                    <div>

                                        <p className="text-sm font-semibold text-gray-900">
                                            Houston, USA
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Head Office
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-gray-900">
                                            Sharjah, UAE
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Regional Office
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-gray-900">
                                            Mysore, India
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Manufacturing & Engineering
                                        </p>

                                    </div>
                                </>

                            )}

                        </div>

                    </div>

                    {/* =================================================
                       SOCIAL
                    ================================================= */}

                    <div>

                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                            Follow
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">

                            {socialLinks.LinkedIn && (

                                <a
                                    href={socialLinks.LinkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    LinkedIn
                                </a>

                            )}

                            {socialLinks.YouTube && (

                                <a
                                    href={socialLinks.YouTube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    YouTube
                                </a>

                            )}

                            {socialLinks.Facebook && (

                                <a
                                    href={socialLinks.Facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-600 transition hover:text-gray-900"
                                >
                                    Facebook
                                </a>

                            )}

                        </div>

                    </div>

                </div>

                {/* =================================================
                   COPYRIGHT
                ================================================= */}

                <div className="mt-12 border-t border-gray-200 pt-6">

                    <p className="text-center text-xs text-gray-500">
                        {copyright}
                    </p>

                </div>

            </div>
        </footer>
    );
}