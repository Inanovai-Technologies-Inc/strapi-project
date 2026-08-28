"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/I18nProvider";
import AmbientBackground from "@/components/AmbientBackground";

const STRAPI_URL = "http://localhost:1337";

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

export default function TechnicalDocumentsPage() {
    const { t } = useI18n();
    const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
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
                setError(t("techDocs.error"));
            } finally {
                setLoading(false);
            }
        }

        fetchDocuments();
    }, []);

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

            const matchesType =
                documentType === "All" ||
                doc.documentType === documentType;

            const matchesLanguage =
                language === "All" ||
                doc.language === language;

            return (
                matchesSearch &&
                matchesType &&
                matchesLanguage
            );
        });
    }, [
        documents,
        search,
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
                        {t("techDocs.heroEyebrow")}
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        {t("techDocs.heroTitle")}
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                        {t("techDocs.heroDescription")}
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
                        {t("techDocs.searchLabel")}
                    </label>

                    <input
                        id="document-search"
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder={t("techDocs.searchPlaceholder")}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />

                </div>


                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="mb-10 grid gap-4 md:grid-cols-2">

                    {/* Document Type */}

                    <div>

                        <label
                            htmlFor="document-type"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            {t("techDocs.filterType")}
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
                                        ? t("techDocs.filterAll")
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
                            {t("techDocs.filterLanguage")}
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
                                        ? t("techDocs.filterAll")
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
                        {t("techDocs.loading")}
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
                                {t("techDocs.emptyTitle")}
                            </h2>

                            <p className="mt-2 text-gray-500">
                                {t("techDocs.emptyDescription")}
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
                                    {t("techDocs.tableDocument")}
                                </div>

                                <div className="col-span-2">
                                    {t("techDocs.tableType")}
                                </div>

                                <div className="col-span-2">
                                    {t("techDocs.tableProduct")}
                                </div>

                                <div className="col-span-1">
                                    {t("techDocs.tableVersion")}
                                </div>

                                <div className="col-span-1">
                                    {t("techDocs.tableDate")}
                                </div>

                                <div className="col-span-2">
                                    {t("techDocs.tableAction")}
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
                                    t("techDocs.fileNameFallback");

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
                                                    {t("techDocs.documentNo")}{" "}
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
                                                    t("techDocs.typeFallback")}
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
                                                        title={`${t("techDocs.view")} ${fileName}`}
                                                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        {t("techDocs.view")}
                                                    </a>

                                                    <a
                                                        href={fileUrl}
                                                        download
                                                        title={`${t("techDocs.download")} ${fileName}`}
                                                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                                    >
                                                        {t("techDocs.download")}
                                                    </a>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400">
                                                    {t("techDocs.noFile")}
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
                            {t("techDocs.showing")}{" "}
                            {filteredDocuments.length}{" "}
                            {t("techDocs.of")}{" "}
                            {documents.length}{" "}
                            {t("techDocs.documents")}
                        </p>
                    )}

            </section>

        </main>
    );
}