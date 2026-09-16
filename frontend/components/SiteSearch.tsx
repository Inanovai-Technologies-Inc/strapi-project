"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
    id: number;
    documentId?: string;
    Name: string;
    slug?: string;
};

export default function SiteSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    const handleSearch = async (value: string) => {
        setQuery(value);

        if (!value.trim()) {
            setProducts([]);
            setIsOpen(false);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:1337/api/products?filters[Name][$containsi]=${encodeURIComponent(
                    value
                )}&populate=*`
            );

            if (!response.ok) {
                throw new Error("Failed to search products");
            }

            const result = await response.json();

            setProducts(result.data || []);
            setIsOpen(true);
        } catch (error) {
            console.error("Search error:", error);
            setProducts([]);
        }
    };

    const handleProductClick = (product: Product) => {
        setIsOpen(false);
        setQuery("");

        if (product.slug) {
            router.push(`/product/${product.slug}`);
        } else {
            router.push(`/product/${product.documentId || product.id}`);
        }
    };

    return (
        <div className="relative w-64">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (query.trim() && products.length > 0) {
                            setIsOpen(true);
                        }
                    }}
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                </span>
            </div>

            {/* Search Results */}
            {isOpen && query.trim() && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {products.length > 0 ? (
                        <div className="max-h-72 overflow-y-auto">
                            {products.map((product) => (
                                <button
                                    key={product.documentId || product.id}
                                    type="button"
                                    onClick={() =>
                                        handleProductClick(product)
                                    }
                                    className="block w-full border-b border-gray-100 px-4 py-3 text-left text-sm transition hover:bg-gray-50"
                                >
                                    <span className="font-medium text-gray-900">
                                        {product.Name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                            No products found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}