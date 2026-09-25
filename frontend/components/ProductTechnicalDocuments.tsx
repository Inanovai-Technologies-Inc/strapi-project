import { getImageUrl } from "@/components/strapiMedia";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    "http://localhost:1337";

/* =========================================================
   TYPES
========================================================= */

interface TechnicalDocument {
    id: number;
    documentId?: string;
    title: string;
    documentType?: string;
    description?: string;
    documentNumber?: string;
    version?: string;
    date?: string;

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
   FETCH ALL DOCUMENTS

   Reuses the same `technical-documents` collection and data
   shape as the /technical-documents Document Center. Shown
   unfiltered on every product page for now.
========================================================= */

async function fetchAllTechnicalDocuments(): Promise<TechnicalDocument[]> {
    const params = new URLSearchParams();

    params.set("populate[file]", "true");
    params.set("populate[product]", "true");
    params.set("sort", "date:desc");

    try {
        const response = await fetch(
            `${STRAPI_URL}/api/technical-documents?${params.toString()}`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            console.error(
                "Failed to fetch technical documents:",
                await response.text()
            );

            return [];
        }

        const result = await response.json();

        return result?.data || [];
    } catch (error) {
        console.error("Failed to fetch technical documents:", error);

        return [];
    }
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

/* =========================================================
   PRODUCT TECHNICAL DOCUMENTS SECTION
========================================================= */

export default async function ProductTechnicalDocuments() {
    const documents = await fetchAllTechnicalDocuments();

    if (documents.length === 0) {
        return null;
    }

    return (
        <section className="px-6 py-16 lg:px-8">

            <div className="mx-auto max-w-7xl">

                <div className="mb-8">

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                        Resources
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900">
                        Technical Documents
                    </h2>

                    <div className="mt-4 h-1 w-12 bg-orange-500" />

                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200">

                    {/* TABLE HEADER */}

                    <div className="hidden grid-cols-12 gap-4 border-b bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 md:grid">

                        <div className="col-span-4">Document</div>
                        <div className="col-span-2">Type</div>
                        <div className="col-span-2">Product</div>
                        <div className="col-span-1">Version</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-2">Action</div>

                    </div>

                    {/* DOCUMENT ROWS */}

                    {documents.map((doc) => {
                        const fileUrl = getImageUrl(doc.file);
                        const fileName =
                            doc.file?.[0]?.name || "Technical Document";

                        const productName =
                            doc.product?.Name || doc.product?.name || "—";

                        return (
                            <div
                                key={doc.documentId || doc.id}
                                className="grid gap-5 border-b border-gray-200 px-6 py-6 last:border-b-0 md:grid-cols-12 md:items-center md:gap-4"
                            >

                                <div className="md:col-span-4">

                                    <h3 className="font-semibold text-gray-900">
                                        {doc.title}
                                    </h3>

                                    {doc.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                            {doc.description}
                                        </p>
                                    )}

                                    {doc.documentNumber && (
                                        <p className="mt-2 text-xs text-gray-400">
                                            Document No: {doc.documentNumber}
                                        </p>
                                    )}

                                </div>

                                <div className="md:col-span-2">
                                    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                        {doc.documentType || "Document"}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 md:col-span-2">
                                    {productName}
                                </div>

                                <div className="text-sm text-gray-600 md:col-span-1">
                                    {doc.version || "—"}
                                </div>

                                <div className="text-sm text-gray-600 md:col-span-1">
                                    {formatDate(doc.date) || "—"}
                                </div>

                                <div className="flex flex-wrap gap-2 md:col-span-2">

                                    {fileUrl ? (
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

            </div>

        </section>
    );
}
