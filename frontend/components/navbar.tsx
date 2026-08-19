"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tight text-gray-900"
                >
                    Marsol Technologies
                </Link>

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

                </ul>
            </div>
        </nav>
    );
}