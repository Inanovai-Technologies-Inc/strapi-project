import React from "react";
import Link from "next/link";

export default function Navbar() {
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
                    <li>
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-600 transition hover:text-black"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-600 transition hover:text-black"
                        >
                            About
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/product"
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Products
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}