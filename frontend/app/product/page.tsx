
import { Suspense } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import AmbientBackground from "@/components/AmbientBackground";
import ProductCatalogueView, {
    type CatalogueGroup,
    type CatalogueProduct,
} from "@/components/ProductCatalogueView";

const STRAPI_URL =
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337";

/* =========================================================
   IMAGE URL HELPER
========================================================= */

function getImageUrl(image: any) {
    if (!image) {
        return null;
    }

    const imageData =
        image?.data?.attributes ||
        image?.data ||
        image?.attributes ||
        image;

    const url = imageData?.url;

    if (!url) {
        return null;
    }

    if (url.startsWith("http")) {
        return url;
    }

    return `${STRAPI_URL}${url}`;
}

/* =========================================================
   NORMALISERS

   Strapi can return relations either flattened (v5) or nested
   under { data: { attributes } }. These helpers keep the page
   working regardless of the shape that comes back.
========================================================= */

function normalizeEntry(entry: any) {
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

function normalizeList(relation: any): any[] {
    const raw = Array.isArray(relation)
        ? relation
        : Array.isArray(relation?.data)
        ? relation.data
        : [];

    return raw
        .map((item: any) => normalizeEntry(item))
        .filter(Boolean);
}

/* =========================================================
   DATA FETCHING (existing Strapi REST integration)
========================================================= */

async function fetchCategories() {
    const url =
        `${STRAPI_URL}/api/product-categories` +
        `?populate%5Bproducts%5D%5Bpopulate%5D%5BImage%5D=true` +
        `&sort=createdAt:asc` +
        `&pagination%5BpageSize%5D=100`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch product categories: ${response.status}`
        );
    }

    const result = await response.json();

    return (result.data || [])
        .map((entry: any) => {
            const category = normalizeEntry(entry);

            if (!category) {
                return null;
            }

            return {
                id: category.id,
                documentId: category.documentId,
                name: category.Name || category.name || "",
                slug: category.slug || "",
                description:
                    category.Description || category.description || "",
                products: normalizeList(category.products),
            };
        })
        .filter(
            (category: any) =>
                category && category.products.length > 0
        );
}

async function fetchUncategorizedProducts(
    categorizedIds: Set<string>
) {
    const url =
        `${STRAPI_URL}/api/products` +
        `?populate%5BImage%5D=true` +
        `&pagination%5BpageSize%5D=100`;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
        // A missing/blocked products endpoint must not break the page.
        return [];
    }

    const result = await response.json();

    return (result.data || [])
        .map((entry: any) => normalizeEntry(entry))
        .filter(
            (product: any) =>
                product &&
                !categorizedIds.has(
                    String(product.documentId ?? product.id)
                )
        );
}

/* =========================================================
   SERIALISABLE SHAPE

   The two-column catalogue is interactive, so the grouped
   data is handed to a client component. Everything below is
   plain JSON (image URLs resolved here on the server).
========================================================= */

function toCatalogueProduct(product: any): CatalogueProduct {
    const name = product?.Name || product?.name || "";

    return {
        key: String(
            product?.documentId ||
                product?.id ||
                product?.slug ||
                name
        ),
        name,
        slug: product?.slug || "",
        description:
            product?.description || product?.Description || "",
        imageUrl: getImageUrl(product?.Image),
        imageAlt: product?.Image?.alternativeText || name,
    };
}

/* =========================================================
   CATALOGUE SKELETON (loading state for the two-column view)
========================================================= */

function CatalogueSkeleton() {
    return (
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="hidden lg:block">
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-10 lg:mt-0">
                <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-8 w-64 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 h-1 w-12 bg-orange-200" />

                <div className="mt-9 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index}>
                            <div className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200" />
                            <div className="mt-5 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                            <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200" />
                            <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   PRODUCT CATALOGUE

   Async leaf: fetches categories from Strapi and groups the
   products by the Product Category relation. Rendered inside
   a <Suspense> boundary so the page shell paints immediately.
========================================================= */

async function ProductCatalogue() {
    const categories = await fetchCategories();

    const categorizedIds = new Set<string>();

    categories.forEach((category: any) => {
        category.products.forEach((product: any) => {
            categorizedIds.add(
                String(product.documentId ?? product.id)
            );
        });
    });

    const uncategorizedProducts = await fetchUncategorizedProducts(
        categorizedIds
    );

    const hasContent =
        categories.length > 0 ||
        uncategorizedProducts.length > 0;

    if (!hasContent) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-500">
                    <T k="productsPage.noCategories" />
                </p>
            </div>
        );
    }

    const groups: CatalogueGroup[] = categories.map(
        (category: any) => ({
            key: String(
                category.documentId ||
                    category.id ||
                    category.slug
            ),
            name: category.name,
            slug: category.slug || "",
            description: category.description || "",
            products: category.products.map(toCatalogueProduct),
        })
    );

    if (uncategorizedProducts.length > 0) {
        groups.push({
            key: "__other__",
            name: "",
            slug: "",
            description: "",
            isOther: true,
            products: uncategorizedProducts.map(toCatalogueProduct),
        });
    }

    return <ProductCatalogueView groups={groups} />;
}

/* =========================================================
   PRODUCT PAGE
========================================================= */

export default function ProductPage() {
    return (
        <main className="min-h-screen bg-[#f7f7f5] text-[#111827]">

            {/* =========================================================
                PRODUCTS — grouped by Strapi Product Category
            ========================================================= */}

            <section className="border-t border-gray-200 px-6 py-16 lg:px-8 lg:py-20">

                <div className="mx-auto max-w-7xl">

                    {/* SECTION HEADING */}

                    <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                        <div className="max-w-3xl">

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                <T k="productsPage.catalogueEyebrow" />
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                                <T k="productsPage.catalogueTitle" />
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-5 text-base leading-7 text-gray-500">
                                <T k="productsPage.rangeDescription" />
                            </p>

                        </div>

                        <Link
                            href="/product/compare"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            <T k="productsPage.compareProducts" />

                            <span className="ml-2">
                                →
                            </span>
                        </Link>

                    </div>

                    <Suspense fallback={<CatalogueSkeleton />}>
                        <ProductCatalogue />
                    </Suspense>

                </div>

            </section>

            {/* =========================================================
                WHY CHOOSE US
            ========================================================= */}

            <section className="bg-white px-6 py-20 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                                <T k="productsPage.whyEyebrow" />
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                                <T k="productsPage.whyTitle" />
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-6 text-base leading-8 text-gray-600">
                                <T k="productsPage.whyDescription" />
                            </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    <T k="productsPage.whyCard1Title" />
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    <T k="productsPage.whyCard1Body" />
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    <T k="productsPage.whyCard2Title" />
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    <T k="productsPage.whyCard2Body" />
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    <T k="productsPage.whyCard3Title" />
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    <T k="productsPage.whyCard3Body" />
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    <T k="productsPage.whyCard4Title" />
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    <T k="productsPage.whyCard4Body" />
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================================
                CONTACT
            ========================================================= */}

            <section className="has-ambient relative overflow-hidden bg-gray-900 px-6 py-16 lg:px-8">

                <AmbientBackground tone="dark" density="soft" />

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                            <T k="cta.needMoreInfo" />
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white">
                            <T k="cta.contactOurTeam" />
                        </h2>

                        <p className="mt-3 text-gray-400">
                            <T k="cta.productInfo" />
                        </p>

                    </div>

                    <Link
                        href="/contact"
                        className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600"
                    >
                        <T k="cta.contactUs" />
                    </Link>

                </div>

            </section>

        </main>
    );
}
