"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

interface TechnicalSpecification {
    label?: string;
    value?: string;

    // Possible Strapi field names
    Label?: string;
    Value?: string;
    specification?: string;
    Specification?: string;
}

interface Product {
    id: number;
    documentId?: string;
    Name?: string;
    slug?: string;
    description?: string;

    Image?: {
        url?: string;
        formats?: {
            large?: {
                url?: string;
            };
            medium?: {
                url?: string;
            };
            small?: {
                url?: string;
            };
            thumbnail?: {
                url?: string;
            };
        };
    };

    TechnicalSpecification?:
        | TechnicalSpecification[]
        | {
              data?: TechnicalSpecification[];
          };

    relatedProducts?: Product[];
}

/* =========================================================
   NORMALIZE TECHNICAL SPECIFICATIONS
========================================================= */

function getTechnicalSpecifications(
    product: Product
): TechnicalSpecification[] {
    const specifications =
        product.TechnicalSpecification;

    if (!specifications) {
        return [];
    }

    if (Array.isArray(specifications)) {
        return specifications;
    }

    if (Array.isArray(specifications.data)) {
        return specifications.data;
    }

    return [];
}

/* =========================================================
   GET SPECIFICATION LABEL
========================================================= */

function getSpecificationLabel(
    specification: TechnicalSpecification
): string {
    return (
        specification.label ||
        specification.Label ||
        specification.specification ||
        specification.Specification ||
        ""
    ).trim();
}

/* =========================================================
   GET SPECIFICATION VALUE
========================================================= */

function getSpecificationValueFromItem(
    specification: TechnicalSpecification
): string {
    const value =
        specification.value ||
        specification.Value ||
        "";

    return String(value).trim();
}

/* =========================================================
   PAGE
========================================================= */

export default function ComparePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showOnlyDifferences, setShowOnlyDifferences] =
        useState(false);

    /* =========================================================
       FETCH PRODUCTS
    ========================================================= */

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${STRAPI_URL}/api/products?populate=*`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch products: ${response.status}`
                    );
                }

                const result = await response.json();

                console.log(
                    "FULL PRODUCTS API:",
                    result
                );

                const allProducts: Product[] =
                    result?.data || [];

                /* =================================================
                   FIND PRODUCTS USED AS RELATED PRODUCTS
                ================================================= */

                const relatedProductIds =
                    new Set<string>();

                allProducts.forEach(
                    (product: Product) => {
                        product.relatedProducts?.forEach(
                            (related: Product) => {
                                if (
                                    related.documentId
                                ) {
                                    relatedProductIds.add(
                                        related.documentId
                                    );
                                }
                            }
                        );
                    }
                );

                /* =================================================
                   ONLY MAIN PRODUCTS
                ================================================= */

                const mainProducts =
                    allProducts.filter(
                        (product: Product) =>
                            !(
                                product.documentId &&
                                relatedProductIds.has(
                                    product.documentId
                                )
                            )
                    );

                setProducts(mainProducts);
            } catch (err) {
                console.error(
                    "Product comparison fetch error:",
                    err
                );

                setError(
                    "Unable to load products. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    /* =========================================================
       IMAGE URL
    ========================================================= */

    const getImageUrl = (
        product: Product
    ) => {
        if (!product.Image) {
            return null;
        }

        const imageUrl =
            product.Image.formats?.medium?.url ||
            product.Image.formats?.small?.url ||
            product.Image.formats?.thumbnail?.url ||
            product.Image.url;

        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${STRAPI_URL}${imageUrl}`;
    };

    /* =========================================================
       ADD PRODUCT
    ========================================================= */

    const addProduct = (productId: string) => {
        if (!productId) return;

        const product = products.find(
            (item) =>
                item.id.toString() === productId
        );

        if (!product) return;

        if (selectedProducts.length >= 3) {
            alert(
                "You can compare a maximum of 3 products."
            );
            return;
        }

        const alreadySelected =
            selectedProducts.some(
                (item) =>
                    item.id === product.id
            );

        if (alreadySelected) {
            return;
        }

        setSelectedProducts(
            (previous) => [
                ...previous,
                product,
            ]
        );
    };

    /* =========================================================
       REMOVE PRODUCT
    ========================================================= */

    const removeProduct = (
        productId: number
    ) => {
        setSelectedProducts(
            (previous) =>
                previous.filter(
                    (product) =>
                        product.id !== productId
                )
        );
    };

    /* =========================================================
       ALL TECHNICAL SPECIFICATIONS
    ========================================================= */

    const allSpecifications = useMemo(() => {
        const specificationSet =
            new Set<string>();

        selectedProducts.forEach(
            (product) => {
                const specifications =
                    getTechnicalSpecifications(
                        product
                    );

                specifications.forEach(
                    (specification) => {
                        const label =
                            getSpecificationLabel(
                                specification
                            );

                        if (label) {
                            specificationSet.add(
                                label
                            );
                        }
                    }
                );
            }
        );

        return Array.from(
            specificationSet
        );
    }, [selectedProducts]);

    /* =========================================================
       GET SPECIFICATION VALUE
    ========================================================= */

    const getSpecificationValue = (
        product: Product,
        label: string
    ) => {
        const specifications =
            getTechnicalSpecifications(
                product
            );

        const specification =
            specifications.find(
                (item) =>
                    getSpecificationLabel(
                        item
                    ).toLowerCase() ===
                    label
                        .trim()
                        .toLowerCase()
            );

        if (!specification) {
            return "—";
        }

        return (
            getSpecificationValueFromItem(
                specification
            ) || "—"
        );
    };

    /* =========================================================
       DIFFERENCES ONLY
    ========================================================= */

    const displayedSpecifications =
        useMemo(() => {
            if (!showOnlyDifferences) {
                return allSpecifications;
            }

            return allSpecifications.filter(
                (label) => {
                    const values =
                        selectedProducts.map(
                            (product) =>
                                getSpecificationValue(
                                    product,
                                    label
                                )
                                    .trim()
                                    .toLowerCase()
                        );

                    return (
                        new Set(values).size >
                        1
                    );
                }
            );
        }, [
            allSpecifications,
            selectedProducts,
            showOnlyDifferences,
        ]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f7f5]">
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">

                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0b1f3a]" />

                        <p className="text-sm text-gray-600">
                            Loading products...
                        </p>

                    </div>
                </div>
            </main>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {
        return (
            <main className="min-h-screen bg-[#f7f7f5]">

                <div className="mx-auto max-w-7xl px-6 py-20 text-center">

                    <h1 className="text-3xl font-bold text-[#0b1f3a]">
                        Unable to load products
                    </h1>

                    <p className="mt-4 text-gray-600">
                        {error}
                    </p>

                    <Link
                        href="/product"
                        className="mt-8 inline-flex rounded-lg bg-[#0b1f3a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16385f]"
                    >
                        Back to Products
                    </Link>

                </div>

            </main>
        );
    }

    /* =========================================================
       MAIN PAGE
    ========================================================= */

    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111827]">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="border-b border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <Link
                        href="/product"
                        className="text-sm font-medium text-gray-500 transition hover:text-[#0b1f3a]"
                    >
                        ← Back to Products
                    </Link>

                    <div className="mt-8 max-w-3xl">

                        <div className="mb-4 flex items-center gap-3">

                            <span className="h-[2px] w-8 bg-orange-500" />

                            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                                Product Comparison
                            </p>

                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-[#0b1f3a] md:text-5xl">
                            Compare Our Products
                        </h1>

                        <p className="mt-5 text-lg leading-8 text-gray-600">
                            Compare Marsol fire protection
                            solutions side by side and
                            review their technical
                            specifications.
                        </p>

                    </div>
                </div>
            </section>


            {/* =================================================
                PRODUCT SELECTION
            ================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-[#0b1f3a]">
                                Select Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select 2 or 3 products
                                to compare.
                            </p>

                        </div>

                        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
                            {selectedProducts.length}{" "}
                            / 3
                        </div>

                    </div>


                    {/* =================================================
                        SELECT BOXES
                    ================================================= */}

                    <div className="grid gap-5 md:grid-cols-3">

                        {[0, 1, 2].map(
                            (slot) => {

                                const selectedProduct =
                                    selectedProducts[
                                        slot
                                    ];

                                return (
                                    <div
                                        key={slot}
                                        className="rounded-xl border border-gray-200 bg-gray-50 p-5"
                                    >

                                        {selectedProduct ? (
                                            <>

                                                <div className="mb-4 flex items-start justify-between">

                                                    <div>

                                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                                            Product{" "}
                                                            {slot +
                                                                1}
                                                        </p>

                                                        <h3 className="mt-1 font-semibold text-[#0b1f3a]">
                                                            {
                                                                selectedProduct.Name
                                                            }
                                                        </h3>

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeProduct(
                                                                selectedProduct.id
                                                            )
                                                        }
                                                        className="rounded-full px-2 py-1 text-gray-400 transition hover:bg-white hover:text-red-600"
                                                    >
                                                        ✕
                                                    </button>

                                                </div>


                                                <div className="flex h-36 items-center justify-center rounded-lg bg-white">

                                                    {getImageUrl(
                                                        selectedProduct
                                                    ) ? (

                                                        <img
                                                            src={getImageUrl(
                                                                selectedProduct
                                                            )!}
                                                            alt={
                                                                selectedProduct.Name ||
                                                                "Product"
                                                            }
                                                            className="h-full w-full object-contain"
                                                        />

                                                    ) : (

                                                        <span className="text-sm text-gray-400">
                                                            No image
                                                        </span>

                                                    )}

                                                </div>

                                            </>

                                        ) : (

                                            <>

                                                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                                    Product{" "}
                                                    {slot +
                                                        1}
                                                </p>

                                                <select
                                                    defaultValue=""
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        addProduct(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0b1f3a] focus:ring-1 focus:ring-[#0b1f3a]"
                                                >

                                                    <option value="">
                                                        Select a product
                                                    </option>

                                                    {products.map(
                                                        (
                                                            product
                                                        ) => {

                                                            const alreadySelected =
                                                                selectedProducts.some(
                                                                    (
                                                                        selected
                                                                    ) =>
                                                                        selected.id ===
                                                                        product.id
                                                                );

                                                            return (
                                                                <option
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    value={
                                                                        product.id
                                                                    }
                                                                    disabled={
                                                                        alreadySelected
                                                                    }
                                                                >
                                                                    {
                                                                        product.Name
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}

                                                </select>

                                            </>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>
                </div>
            </section>


            {/* =================================================
                COMPARISON
            ================================================= */}

            {selectedProducts.length >=
                2 && (

                <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">

                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-[#0b1f3a]">
                                Technical Comparison
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Technical specifications
                                compared side by side.
                            </p>

                        </div>

                        <label className="flex cursor-pointer items-center gap-3">

                            <input
                                type="checkbox"
                                checked={
                                    showOnlyDifferences
                                }
                                onChange={(
                                    event
                                ) =>
                                    setShowOnlyDifferences(
                                        event.target
                                            .checked
                                    )
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700">
                                Show only differences
                            </span>

                        </label>

                    </div>


                    {/* =================================================
                        NO SPECIFICATIONS DEBUG MESSAGE
                    ================================================= */}

                    {allSpecifications.length ===
                        0 && (
                        <div className="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-5">

                            <p className="text-sm font-semibold text-yellow-800">
                                No technical specifications
                                were detected.
                            </p>

                            <p className="mt-1 text-xs text-yellow-700">
                                Please check the browser
                                console for the Product API
                                response.
                            </p>

                        </div>
                    )}


                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="min-w-[900px] w-full border-collapse">

                                <thead>

                                    <tr className="bg-gray-50">

                                        <th className="sticky left-0 z-10 min-w-[220px] border-b border-r border-gray-200 bg-gray-50 px-6 py-6 text-left text-sm font-semibold text-[#0b1f3a]">
                                            Specification
                                        </th>

                                        {selectedProducts.map(
                                            (
                                                product
                                            ) => (

                                                <th
                                                    key={
                                                        product.id
                                                    }
                                                    className="min-w-[240px] border-b border-gray-200 px-6 py-6 text-left align-top"
                                                >

                                                    <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-white">

                                                        {getImageUrl(
                                                            product
                                                        ) ? (

                                                            <img
                                                                src={getImageUrl(
                                                                    product
                                                                )!}
                                                                alt={
                                                                    product.Name ||
                                                                    "Product"
                                                                }
                                                                className="h-full w-full object-contain"
                                                            />

                                                        ) : (

                                                            <span className="text-sm text-gray-400">
                                                                No image
                                                            </span>

                                                        )}

                                                    </div>

                                                    <h3 className="text-base font-semibold text-[#0b1f3a]">
                                                        {
                                                            product.Name
                                                        }
                                                    </h3>

                                                    {product.slug && (
                                                        <Link
                                                            href={`/product/${product.slug}`}
                                                            className="mt-3 inline-block text-sm font-medium text-gray-600 underline underline-offset-4 transition hover:text-orange-500"
                                                        >
                                                            View Product
                                                            →
                                                        </Link>
                                                    )}

                                                </th>

                                            )
                                        )}

                                    </tr>

                                </thead>


                                <tbody>

                                    {displayedSpecifications.length >
                                    0 ? (

                                        displayedSpecifications.map(
                                            (
                                                specification,
                                                index
                                            ) => {

                                                const values =
                                                    selectedProducts.map(
                                                        (
                                                            product
                                                        ) =>
                                                            getSpecificationValue(
                                                                product,
                                                                specification
                                                            )
                                                    );

                                                const normalizedValues =
                                                    values.map(
                                                        (
                                                            value
                                                        ) =>
                                                            value
                                                                .trim()
                                                                .toLowerCase()
                                                    );

                                                const isDifferent =
                                                    new Set(
                                                        normalizedValues
                                                    ).size >
                                                    1;

                                                return (

                                                    <tr
                                                        key={
                                                            specification
                                                        }
                                                        className={
                                                            index %
                                                                2 ===
                                                            0
                                                                ? "bg-white"
                                                                : "bg-gray-50/50"
                                                        }
                                                    >

                                                        <td className="sticky left-0 z-10 border-b border-r border-gray-200 bg-inherit px-6 py-5 text-sm font-semibold text-gray-800">
                                                            {
                                                                specification
                                                            }
                                                        </td>

                                                        {selectedProducts.map(
                                                            (
                                                                product
                                                            ) => {

                                                                const value =
                                                                    getSpecificationValue(
                                                                        product,
                                                                        specification
                                                                    );

                                                                return (

                                                                    <td
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        className={`border-b border-gray-200 px-6 py-5 text-sm text-gray-700 ${
                                                                            isDifferent
                                                                                ? "font-medium text-[#0b1f3a]"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        {value}
                                                                    </td>

                                                                );
                                                            }
                                                        )}

                                                    </tr>

                                                );
                                            }
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan={
                                                    selectedProducts.length +
                                                    1
                                                }
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                No technical
                                                specifications
                                                found for the
                                                selected
                                                products.
                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>
                    </div>

                </section>

            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {selectedProducts.length <
                2 && (

                <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            ⚖
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#0b1f3a]">
                            Select at least two
                            products
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Choose two or three Marsol
                            products above to compare
                            their technical
                            specifications side by
                            side.
                        </p>

                    </div>

                </section>

            )}


            {/* =================================================
                CONTACT SECTION
            ================================================= */}

            {selectedProducts.length >=
                2 && (

                <section className="border-t border-gray-200 bg-white">

                    <div className="mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">

                        <h2 className="text-2xl font-bold text-[#0b1f3a]">
                            Need help choosing the
                            right solution?
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                            Contact the Marsol team to
                            discuss your requirements
                            and find the most suitable
                            fire protection solution.
                        </p>

                        <Link
                            href="/contact"
                            className="mt-6 inline-flex rounded-lg bg-[#0b1f3a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#16385f]"
                        >
                            Contact Marsol
                        </Link>

                    </div>

                </section>

            )}

        </main>
    );
}