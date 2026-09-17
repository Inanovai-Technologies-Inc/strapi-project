"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import AmbientBackground from "@/components/AmbientBackground";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface TechnicalDocument {
    id: number;
    documentId?: string;
    title: string;
    documentType?: string;
    description?: string;
    documentNumber?: string;
    version?: string;
    date?: string;
    language?: string;
    featured?: boolean;
    slug?: string;

    file?: {
        id?: number;
        documentId?: string;
        name?: string;
        url?: string;
        mime?: string;
    }[];

    product?: {
        id?: number;
        documentId?: string;
        Name?: string;
        name?: string;
    };
}

/* =========================================================
   PRODUCT LINE MAP

   A technical-document only links to a single `product`, and a
   product only belongs to a category through that category's own
   `products` list (there's no field on the product pointing back
   up). So to filter documents by top-level "Product Line", every
   product-category is fetched once, a parent/child tree is built
   the same way as the product catalogue page (from the union of
   `parentCategory` and `childCategories`, since editors don't
   always fill in both sides), and every product anywhere in a
   top-level category's subtree is mapped to that category's name.
========================================================= */

function normalizeCategoryEntry(entry: any) {
    if (!entry) {
        return null;
    }

    const attributes = entry.attributes || entry;

    return {
        ...attributes,
        id: entry.id ?? attributes.id,
        documentId: entry.documentId ?? attributes.documentId,
    };
}

function normalizeCategoryList(relation: any): any[] {
    const raw = Array.isArray(relation)
        ? relation
        : Array.isArray(relation?.data)
        ? relation.data
        : [];

    return raw
        .map((item: any) => normalizeCategoryEntry(item))
        .filter(Boolean);
}

function categoryEntryKey(entry: any): string {
    const normalized = normalizeCategoryEntry(entry);

    return String(normalized?.documentId || normalized?.id || "");
}

async function fetchProductLineMap(): Promise<Record<string, string>> {
    const params = new URLSearchParams();

    params.set("pagination[pageSize]", "200");
    params.set("populate[products]", "true");
    params.set("populate[parentCategory]", "true");
    params.set("populate[childCategories]", "true");

    const response = await fetch(
        `${STRAPI_URL}/api/product-categories?${params.toString()}`
    );

    if (!response.ok) {
        return {};
    }

    const result = await response.json();
    const rawEntries: any[] = result.data || [];

    type FlatCategory = {
        key: string;
        name: string;
        productKeys: string[];
        parentKeys: string[];
        childKeysFromField: string[];
    };

    const flatByKey = new Map<string, FlatCategory>();

    rawEntries.forEach((entry) => {
        const category = normalizeCategoryEntry(entry);
        const key = categoryEntryKey(entry);

        if (!category || !key) {
            return;
        }

        flatByKey.set(key, {
            key,
            name: category.Name || category.name || "",
            productKeys: normalizeCategoryList(category.products).map(
                (product) => String(product.documentId || product.id)
            ),
            parentKeys: normalizeCategoryList(
                category.parentCategory
            ).map(categoryEntryKey),
            childKeysFromField: normalizeCategoryList(
                category.childCategories
            ).map(categoryEntryKey),
        });
    });

    // Union of "child via parentCategory pointer" and "child via
    // childCategories field" — same reasoning as the product page.
    const childKeysByParent = new Map<string, Set<string>>();

    function linkChild(parentKey: string, childKey: string) {
        if (!parentKey || !childKey || !flatByKey.has(childKey)) {
            return;
        }

        if (!childKeysByParent.has(parentKey)) {
            childKeysByParent.set(parentKey, new Set());
        }

        childKeysByParent.get(parentKey)!.add(childKey);
    }

    flatByKey.forEach((category) => {
        category.parentKeys.forEach((parentKey) =>
            linkChild(parentKey, category.key)
        );

        category.childKeysFromField.forEach((childKey) =>
            linkChild(category.key, childKey)
        );
    });

    const keysWithAParent = new Set<string>();

    childKeysByParent.forEach((childKeys) => {
        childKeys.forEach((childKey) => keysWithAParent.add(childKey));
    });

    const topLevelKeys = Array.from(flatByKey.keys()).filter(
        (key) => !keysWithAParent.has(key)
    );

    function collectProductKeys(
        key: string,
        visited: Set<string>
    ): string[] {
        const category = flatByKey.get(key);

        if (!category || visited.has(key)) {
            return [];
        }

        const nextVisited = new Set(visited).add(key);
        const childKeys = Array.from(childKeysByParent.get(key) || []);

        return [
            ...category.productKeys,
            ...childKeys.flatMap((childKey) =>
                collectProductKeys(childKey, nextVisited)
            ),
        ];
    }

    const productLineMap: Record<string, string> = {};

    topLevelKeys.forEach((key) => {
        const category = flatByKey.get(key);

        if (!category) {
            return;
        }

        collectProductKeys(key, new Set()).forEach((productKey) => {
            productLineMap[productKey] = category.name;
        });
    });

    return productLineMap;
}

export default function TechnicalDocumentsPage() {
    const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [productLineByProductKey, setProductLineByProductKey] =
        useState<Record<string, string>>({});

    const [search, setSearch] = useState("");
    const [productLine, setProductLine] = useState("All");
    const [documentType, setDocumentType] = useState("All");
    const [language, setLanguage] = useState("All");

    useEffect(() => {
        async function fetchDocuments() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${STRAPI_URL}/api/technical-documents?populate=*`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch documents: ${response.status}`
                    );
                }

                const result = await response.json();

                console.log("Technical Documents API:", result);

                setDocuments(result.data || []);
            } catch (err) {
                console.error("Technical documents error:", err);
                setError("Unable to load technical documents.");
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, []);

    useEffect(() => {
        fetchProductLineMap()
            .then(setProductLineByProductKey)
            .catch((err) =>
                console.error("Failed to load product lines:", err)
            );
    }, []);

    /* =========================================================
       PRODUCT LINE OF A DOCUMENT
    ========================================================= */

    const productLineOf = useCallback(
        (doc: TechnicalDocument): string | undefined => {
            const productKey = String(
                doc.product?.documentId ?? doc.product?.id ?? ""
            );

            return productKey
                ? productLineByProductKey[productKey]
                : undefined;
        },
        [productLineByProductKey]
    );

    /* =========================================================
       PRODUCT LINES
    ========================================================= */

    const productLines = useMemo(() => {
        return [
            "All",
            ...Array.from(
                new Set(
                    documents
                        .map((doc) => productLineOf(doc))
                        .filter(Boolean) as string[]
                )
            ),
        ];
    }, [documents, productLineOf]);

    /* =========================================================
       DOCUMENT TYPES
    ========================================================= */

    const documentTypes = useMemo(() => {
        return [
            "All",
            ...Array.from(
                new Set(
                    documents
                        .map((doc) => doc.documentType)
                        .filter(Boolean) as string[]
                )
            ),
        ];
    }, [documents]);

    /* =========================================================
       LANGUAGES
    ========================================================= */

    const languages = useMemo(() => {
        return [
            "All",
            ...Array.from(
                new Set(
                    documents
                        .map((doc) => doc.language)
                        .filter(Boolean) as string[]
                )
            ),
        ];
    }, [documents]);

    /* =========================================================
       FILTER DOCUMENTS
    ========================================================= */

    const filteredDocuments = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return documents.filter((doc) => {
            const productName =
                doc.product?.Name ||
                doc.product?.name ||
                "";

            const matchesSearch =
                !searchValue ||
                doc.title?.toLowerCase().includes(searchValue) ||
                doc.description?.toLowerCase().includes(searchValue) ||
                doc.documentNumber?.toLowerCase().includes(searchValue) ||
                productName.toLowerCase().includes(searchValue);

            const matchesProductLine =
                productLine === "All" ||
                productLineOf(doc) === productLine;

            const matchesType =
                documentType === "All" ||
                doc.documentType === documentType;

            const matchesLanguage =
                language === "All" ||
                doc.language === language;

            return (
                matchesSearch &&
                matchesProductLine &&
                matchesType &&
                matchesLanguage
            );
        });
    }, [
        documents,
        search,
        productLine,
        productLineOf,
        documentType,
        language,
    ]);

    /* =========================================================
       GET FILE URL
    ========================================================= */

    function getFileUrl(
        file?: TechnicalDocument["file"]
    ) {
        const url = file?.[0]?.url;

        if (!url) {
            return "#";
        }

        if (url.startsWith("http")) {
            return url;
        }

        return `${STRAPI_URL}${url}`;
    }

    /* =========================================================
       FORMAT DATE
    ========================================================= */

    function formatDate(date?: string) {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b bg-gray-50">
                <AmbientBackground density="soft" />
                <div className="mx-auto max-w-7xl px-6 py-16">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Resources
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Document Center
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                        Access technical documentation, datasheets, brochures, and other product resources.
                    </p>

                </div>
            </section>


            {/* =====================================================
                DOCUMENT CENTER
            ===================================================== */}

            <section className="mx-auto max-w-7xl px-6 py-12">

                {/* =================================================
                    SEARCH
                ================================================= */}

                <div className="mb-8">

                    <label
                        htmlFor="document-search"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                        Search Documents
                    </label>

                    <div className="relative">
                        <input
                            id="document-search"
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by document, product or document number..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        />

                        <button
                            type="button"
                            aria-label="Search"
                            onClick={() =>
                                document
                                    .getElementById("document-search")
                                    ?.focus()
                            }
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <Search size={18} strokeWidth={2} />
                        </button>
                    </div>

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="mb-10 grid gap-4 md:grid-cols-3">

                    {/* Product Line */}

                    <div>

                        <label
                            htmlFor="product-line"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Product Line
                        </label>

                        <select
                            id="product-line"
                            value={productLine}
                            onChange={(e) =>
                                setProductLine(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                        >
                            {productLines.map((line) => (
                                <option
                                    key={line}
                                    value={line}
                                >
                                    {line === "All"
                                        ? "All Product Lines"
                                        : line}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* Document Type */}

                    <div>

                        <label
                            htmlFor="document-type"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Document Type
                        </label>

                        <select
                            id="document-type"
                            value={documentType}
                            onChange={(e) =>
                                setDocumentType(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                        >
                            {documentTypes.map((type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {type === "All"
                                        ? "All"
                                        : type}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* Language */}

                    <div>

                        <label
                            htmlFor="document-language"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Language
                        </label>

                        <select
                            id="document-language"
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                        >
                            {languages.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item === "All"
                                        ? "All"
                                        : item}
                                </option>
                            ))}
                        </select>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div className="py-20 text-center text-gray-500">
                        Loading technical documents...
                    </div>
                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
                        {error}
                    </div>
                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredDocuments.length === 0 && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">

                            <h2 className="text-xl font-semibold text-gray-900">
                                No documents found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Try changing your search or filters.
                            </p>

                        </div>
                    )}


                {/* =================================================
                    DOCUMENTS
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredDocuments.length > 0 && (

                        <div className="overflow-hidden rounded-xl border border-gray-200">

                            {/* =================================================
                                TABLE HEADER
                            ================================================= */}

                            <div className="hidden grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">

                                <div className="col-span-4">
                                    Document
                                </div>

                                <div className="col-span-2">
                                    Type
                                </div>

                                <div className="col-span-2">
                                    Product
                                </div>

                                <div className="col-span-1">
                                    Version
                                </div>

                                <div className="col-span-1">
                                    Date
                                </div>

                                <div className="col-span-2">
                                    Action
                                </div>

                            </div>


                            {/* =================================================
                                DOCUMENT ROWS
                            ================================================= */}

                            {filteredDocuments.map((doc) => {

                                const fileUrl =
                                    getFileUrl(doc.file);

                                const fileName =
                                    doc.file?.[0]?.name ||
                                    "Technical Document";

                                const productName =
                                    doc.product?.Name ||
                                    doc.product?.name ||
                                    "—";

                                return (
                                    <div
                                        key={
                                            doc.documentId ||
                                            doc.id
                                        }
                                        className="grid gap-5 border-b border-gray-200 px-6 py-6 last:border-b-0 md:grid-cols-12 md:items-center md:gap-4"
                                    >

                                        {/* =================================================
                                            DOCUMENT
                                        ================================================= */}

                                        <div className="md:col-span-4">

                                            <h2 className="font-semibold text-gray-900">
                                                {doc.title}
                                            </h2>

                                            {doc.description && (
                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                    {doc.description}
                                                </p>
                                            )}

                                            {doc.documentNumber && (
                                                <p className="mt-2 text-xs text-gray-400">
                                                    Document No:{" "}
                                                    {doc.documentNumber}
                                                </p>
                                            )}

                                        </div>


                                        {/* =================================================
                                            TYPE
                                        ================================================= */}

                                        <div className="md:col-span-2">

                                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {doc.documentType ||
                                                    "Document"}
                                            </span>

                                        </div>


                                        {/* =================================================
                                            PRODUCT
                                        ================================================= */}

                                        <div className="text-sm text-gray-600 md:col-span-2">
                                            {productName}
                                        </div>


                                        {/* =================================================
                                            VERSION
                                        ================================================= */}

                                        <div className="text-sm text-gray-600 md:col-span-1">
                                            {doc.version || "—"}
                                        </div>


                                        {/* =================================================
                                            DATE
                                        ================================================= */}

                                        <div className="text-sm text-gray-600 md:col-span-1">
                                            {formatDate(doc.date) ||
                                                "—"}
                                        </div>


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        <div className="flex flex-wrap gap-2 md:col-span-2">

                                            {fileUrl !== "#" ? (
                                                <>
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={`View ${fileName}`}
                                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        View
                                                    </a>

                                                    <a
                                                        href={fileUrl}
                                                        download
                                                        title={`Download ${fileName}`}
                                                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                                    >
                                                        Download
                                                    </a>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    No file
                                                </span>
                                            )}

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}


                {/* =================================================
                    RESULT COUNT
                ================================================= */}

                {!loading &&
                    !error &&
                    documents.length > 0 && (

                        <p className="mt-5 text-sm text-gray-500">
                            Showing{" "}
                            {filteredDocuments.length}{" "}
                            of{" "}
                            {documents.length}{" "}
                            documents
                        </p>
                    )}

            </section>

        </main>
    );
}