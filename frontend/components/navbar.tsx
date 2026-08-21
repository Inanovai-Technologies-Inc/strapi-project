"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SiteSearch from "./SiteSearch";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center"
                >
                    <Image
                        src="/images/marsol-logo.jpg"
                        alt="Marsol Technologies"
                        width={160}
                        height={55}
                        className="h-auto w-[180px] object-contain"
                        priority
                    />
                </Link>

                {/* Search + Navigation */}
                <div className="flex items-center gap-6">

                    {/* Search */}
                    <SiteSearch />

                    {/* Navigation */}
                    <ul className="flex items-center gap-8">

                        {/* Home */}
                        <li>
                            <Link
                                href="/"
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    pathname === "/"
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black"
                                }`}
                            >
                                Home
                            </Link>
                        </li>

                        {/* About */}
                        <li>
                            <Link
                                href="/about"
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    pathname.startsWith("/about")
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black"
                                }`}
                            >
                                About
                            </Link>
                        </li>

                        {/* Products */}
                        <li>
                            <Link
                                href="/product"
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    pathname.startsWith("/product")
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black"
                                }`}
                            >
                                Products
                            </Link>
                        </li>

                        {/* Career */}
                        <li>
                            <Link
                                href="/careers"
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    pathname.startsWith("/careers")
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black"
                                }`}
                            >
                                Careers
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    pathname === "/contact"
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:text-black"
                                }`}
                            >
                                Contact
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}