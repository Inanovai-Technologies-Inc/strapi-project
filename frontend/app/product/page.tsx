
import { Suspense } from "react";
import AmbientBackground from "@/components/AmbientBackground";
import ProductCatalogueView, {
    type CatalogueCategoryNode,
    type CatalogueProduct,
} from "@/components/ProductCatalogueView";
import { isPhotographicImage } from "@/lib/imageTransparency";

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

/* =========================================================
   PRODUCT CATEGORY TREE

   Strapi's product-categories are self-related two ways:
   `parentCategory` (a child points up to its parent) and
   `childCategories` (a parent lists its children). Content
   editors aren't guaranteed to keep both sides in sync, so the
   tree below is built from the UNION of both directions —
   whichever side actually got filled in still produces the
   correct hierarchy.

   Only categories with no `parentCategory` are treated as
   top-level ("Categories" sidebar entries); everything else is
   nested under its parent, to any depth.
========================================================= */

async function fetchProductCategoryTree(): Promise<
    CatalogueCategoryNode[]
> {
    const params = new URLSearchParams();

    params.set("sort", "createdAt:asc");
    params.set("pagination[pageSize]", "200");
    params.set("populate[Image]", "true");
    params.set("populate[products][populate][Image]", "true");
    params.set("populate[parentCategory]", "true");
    params.set("populate[childCategories]", "true");

    const response = await fetch(
        `${STRAPI_URL}/api/product-categories?${params.toString()}`,
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch product categories: ${response.status}`
        );
    }

    const result = await response.json();
    const rawEntries: any[] = result.data || [];

    type FlatCategory = {
        key: string;
        name: string;
        slug: string;
        description: string;
        imageUrl: string | null;
        imageAlt: string;
        directProducts: any[];
        parentKeys: string[];
        childKeysFromField: string[];
    };

    function entryKey(entry: any): string {
        const normalized = normalizeEntry(entry);

        return String(
            normalized?.documentId ||
                normalized?.id ||
                normalized?.slug ||
                ""
        );
    }

    const flatByKey = new Map<string, FlatCategory>();

    rawEntries.forEach((entry) => {
        const category = normalizeEntry(entry);

        if (!category) {
            return;
        }

        const key = entryKey(entry);

        if (!key) {
            return;
        }

        const categoryName = category.Name || category.name || "";

        flatByKey.set(key, {
            key,
            name: categoryName,
            slug: category.slug || "",
            description:
                category.Description || category.description || "",
            imageUrl: getImageUrl(category.Image),
            imageAlt:
                category.Image?.alternativeText || categoryName,
            directProducts: normalizeList(category.products),
            parentKeys: normalizeList(category.parentCategory).map(
                (parent: any) => entryKey(parent)
            ),
            childKeysFromField: normalizeList(
                category.childCategories
            ).map((child: any) => entryKey(child)),
        });
    });

    // Union of "child via parentCategory pointer" and "child via
    // childCategories field" — see comment above.
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

    async function buildNode(
        key: string,
        visited: Set<string>
    ): Promise<CatalogueCategoryNode | null> {
        const category = flatByKey.get(key);

        // `visited` guards against a mistaken cyclical parent/child
        // assignment in Strapi ever causing infinite recursion here.
        if (!category || visited.has(key)) {
            return null;
        }

        const nextVisited = new Set(visited).add(key);
        const childKeys = Array.from(
            childKeysByParent.get(key) || []
        );

        const [directProducts, children] = await Promise.all([
            Promise.all(
                category.directProducts.map(toCatalogueProduct)
            ),
            Promise.all(
                childKeys.map((childKey) =>
                    buildNode(childKey, nextVisited)
                )
            ),
        ]);

        return {
            key: category.key,
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.imageUrl,
            imageAlt: category.imageAlt,
            directProducts,
            children: children.filter(
                Boolean
            ) as CatalogueCategoryNode[],
        };
    }

    // A category is "top-level" only if it isn't anyone's child in the
    // union graph above — not merely if its own `parentCategory` field
    // is empty, since a parent's `childCategories` list can name a child
    // whose own back-reference was never filled in.
    const keysWithAParent = new Set<string>();

    childKeysByParent.forEach((childKeys) => {
        childKeys.forEach((childKey) => keysWithAParent.add(childKey));
    });

    const topLevelKeys = Array.from(flatByKey.keys()).filter(
        (key) => !keysWithAParent.has(key)
    );

    const topLevelNodes = await Promise.all(
        topLevelKeys.map((key) => buildNode(key, new Set()))
    );

    return topLevelNodes.filter(
        Boolean
    ) as CatalogueCategoryNode[];
}

/* =========================================================
   CATEGORISED PRODUCT KEYS

   Walks the whole tree (every level) so uncategorised products
   are only the ones truly linked to no category anywhere.
========================================================= */

function collectCategorizedProductKeys(
    nodes: CatalogueCategoryNode[]
): Set<string> {
    const keys = new Set<string>();

    function walk(node: CatalogueCategoryNode) {
        node.directProducts.forEach((product: CatalogueProduct) =>
            keys.add(product.key)
        );
        node.children.forEach(walk);
    }

    nodes.forEach(walk);

    return keys;
}

/* =========================================================
   ALPHABETICAL ORDER

   Strapi returns categories in creation order; the sidebar
   shows them A–Z instead, at every level of the tree.
========================================================= */

function sortCategoriesByName(
    nodes: CatalogueCategoryNode[]
): CatalogueCategoryNode[] {
    return [...nodes]
        .sort((a, b) =>
            a.name.localeCompare(b.name, "en", {
                sensitivity: "base",
            })
        )
        .map((node) => ({
            ...node,
            children: sortCategoriesByName(node.children),
        }));
}

// Only these products belong in the "Other Products" bucket —
// not every uncategorized product in Strapi.
const OTHER_PRODUCTS_SLUGS = [
    "ev-parking-nozzle",
    "ev-ff-nozzle-kit",
    "fire-pumps",
];

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
                ) &&
                OTHER_PRODUCTS_SLUGS.includes(product.slug)
        );
}

/* =========================================================
   SERIALISABLE SHAPE

   The two-column catalogue is interactive, so the grouped
   data is handed to a client component. Everything below is
   plain JSON (image URLs resolved here on the server).
========================================================= */

async function toCatalogueProduct(
    product: any
): Promise<CatalogueProduct> {
    const name = product?.Name || product?.name || "";
    const imageUrl = getImageUrl(product?.Image);

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
        imageUrl,
        imageAlt: product?.Image?.alternativeText || name,
        imageIsPhoto: await isPhotographicImage(imageUrl),
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

                <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="h-56 w-full animate-pulse bg-gray-200" />
                            <div className="p-6">
                                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                                <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200" />
                                <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                                <div className="mt-6 h-3 w-28 animate-pulse rounded bg-gray-200" />
                            </div>
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
    const categories = await fetchProductCategoryTree();

    const categorizedKeys = collectCategorizedProductKeys(categories);

    const uncategorizedProducts = await fetchUncategorizedProducts(
        categorizedKeys
    );

    const hasContent =
        categories.length > 0 ||
        uncategorizedProducts.length > 0;

    if (!hasContent) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                <p className="text-gray-500">
                    No products are available at the moment. Please check back soon.
                </p>
            </div>
        );
    }

    const rootCategories: CatalogueCategoryNode[] = [...categories];

    if (uncategorizedProducts.length > 0) {
        rootCategories.push({
            key: "__other__",
            name: "Other Products",
            slug: "",
            description: "",
            imageUrl: null,
            imageAlt: "Other Products",
            directProducts: await Promise.all(
                uncategorizedProducts.map(toCatalogueProduct)
            ),
            children: [],
        });
    }

    return (
        <ProductCatalogueView
            categories={sortCategoriesByName(rootCategories)}
        />
    );
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

                    <div className="mb-14">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            Fire-Fighting Products
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                            Products
                        </h2>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <p className="mt-5 text-base leading-7 text-gray-500 lg:whitespace-nowrap">
                            Discover our range of fire protection systems and engineered equipment developed to meet demanding industry requirements.
                        </p>

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
                                Why Choose Us
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
                                Reliable Fire Protection Engineering
                            </h2>

                            <div className="mt-4 h-1 w-12 bg-orange-500" />

                            <p className="mt-6 text-justify text-base leading-8 text-gray-600">
                                Our fire protection solutions are engineered to meet demanding operational requirements while delivering dependable performance and long-term reliability.
                            </p>

                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Engineered Solutions
                                </h3>

                                <p className="mt-3 text-justify text-sm leading-6 text-gray-500">
                                    Systems designed around specific project and application requirements.
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Proven Performance
                                </h3>

                                <p className="mt-3 text-justify text-sm leading-6 text-gray-500">
                                    Reliable equipment designed for demanding fire protection applications.
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Industry Standards
                                </h3>

                                <p className="mt-3 text-justify text-sm leading-6 text-gray-500">
                                    Solutions developed to meet applicable industry standards and requirements.
                                </p>

                            </div>

                            <div className="rounded-2xl border border-gray-200 bg-[#f7f7f5] p-6">

                                <h3 className="text-lg font-bold text-[#0b1f3a]">
                                    Technical Support
                                </h3>

                                <p className="mt-3 text-justify text-sm leading-6 text-gray-500">
                                    Technical expertise and support throughout the project lifecycle.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}
