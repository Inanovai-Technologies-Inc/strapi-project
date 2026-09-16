"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/* =========================================================
   TYPES (plain, serialisable data built on the server)
========================================================= */

export type CatalogueProduct = {
    key: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    imageAlt: string;
};

export type CatalogueCategoryNode = {
    key: string;
    name: string;
    slug: string;
    description: string;
    /** Products linked directly to this category (not its children). */
    directProducts: CatalogueProduct[];
    children: CatalogueCategoryNode[];
};

/* =========================================================
   TREE HELPERS (pure, recursive — work at any depth)
========================================================= */

/** Every product in this category's own subtree, deduplicated. */
function collectAllProducts(
    node: CatalogueCategoryNode
): CatalogueProduct[] {
    const seen = new Map<string, CatalogueProduct>();

    function walk(current: CatalogueCategoryNode) {
        current.directProducts.forEach((product) => {
            if (!seen.has(product.key)) {
                seen.set(product.key, product);
            }
        });
        current.children.forEach(walk);
    }

    walk(node);

    return Array.from(seen.values());
}

function findNodeByPath(
    nodes: CatalogueCategoryNode[],
    path: string[]
): CatalogueCategoryNode | null {
    let level = nodes;
    let node: CatalogueCategoryNode | null = null;

    for (const key of path) {
        node = level.find((item) => item.key === key) ?? null;

        if (!node) {
            return null;
        }

        level = node.children;
    }

    return node;
}

function findPathBySlug(
    nodes: CatalogueCategoryNode[],
    slug: string
): string[] | null {
    for (const node of nodes) {
        if (node.slug === slug) {
            return [node.key];
        }

        const childPath = findPathBySlug(node.children, slug);

        if (childPath) {
            return [node.key, ...childPath];
        }
    }

    return null;
}

/* =========================================================
   PRODUCT ITEM — unchanged clean, image-focused presentation
========================================================= */

function ProductItem({
    product,
    viewLabel,
    fallbackDescription,
    imageUnavailableLabel,
}: {
    product: CatalogueProduct;
    viewLabel: string;
    fallbackDescription: string;
    imageUnavailableLabel: string;
}) {
    const href = product.slug
        ? `/product/${product.slug}`
        : "/product";

    return (
        <article className="group flex flex-col">

            {/* IMAGE — the whole image links to the product detail page */}

            <Link
                href={href}
                aria-label={product.name}
                className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[#f2f3f4] transition-colors duration-300 group-hover:bg-[#edeef0]"
            >
                <span className="absolute left-0 top-0 h-0.5 w-12 bg-orange-500 transition-all duration-300 group-hover:w-20" />

                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                ) : (
                    <span className="px-6 text-center text-xs uppercase tracking-[0.18em] text-gray-400">
                        {imageUnavailableLabel}
                    </span>
                )}
            </Link>

            {/* TEXT */}

            <h3 className="mt-5 text-base font-bold uppercase leading-6 tracking-wide text-[#0b1f3a]">
                <Link
                    href={href}
                    className="transition-colors duration-300 group-hover:text-orange-600"
                >
                    {product.name}
                </Link>
            </h3>

            <p
                className={`mt-2 line-clamp-3 text-justify text-sm leading-6 ${
                    product.description
                        ? "text-gray-500"
                        : "text-gray-400"
                }`}
            >
                {product.description || fallbackDescription}
            </p>

            <Link
                href={href}
                className="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-[#0b1f3a] transition-colors duration-300 hover:text-orange-600"
            >
                {viewLabel}
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                </span>
            </Link>

        </article>
    );
}

/* =========================================================
   PRODUCT CATALOGUE VIEW

   Sidebar lists only top-level categories. Selecting one shows
   every product in its whole subtree (its own direct products
   plus every descendant category's products). If the selected
   category has children, they're offered as a drill-down strip
   so the user can narrow to a specific child (and its children,
   to any depth) — switching categories is pure client state, no
   navigation or reload, only the URL's `category` slug updates
   to reflect the current selection.
========================================================= */

export default function ProductCatalogueView({
    categories,
}: {
    categories: CatalogueCategoryNode[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [path, setPath] = useState<string[]>(() => {
        const slugParam = searchParams.get("category");
        const fromSlug = slugParam
            ? findPathBySlug(categories, slugParam)
            : null;

        return fromSlug ?? (categories[0] ? [categories[0].key] : []);
    });

    const activeNode = useMemo(
        () =>
            findNodeByPath(categories, path) ?? categories[0] ?? null,
        [categories, path]
    );

    function updateUrl(nextPath: string[]) {
        const node = findNodeByPath(categories, nextPath);
        const params = new URLSearchParams(searchParams.toString());

        if (node?.slug) {
            params.set("category", node.slug);
        } else {
            params.delete("category");
        }

        const query = params.toString();

        router.replace(
            `${pathname}${query ? `?${query}` : ""}`,
            { scroll: false }
        );
    }

    function selectTopLevel(key: string) {
        setPath([key]);
        updateUrl([key]);
    }

    // Selects a category at the same depth as whatever's currently
    // active — extending the path by one the first time a child is
    // chosen, or swapping the last segment when switching between
    // siblings (so the pill row never collapses to just the one
    // selected item; the whole sibling group stays visible).
    function selectSibling(siblingKey: string) {
        const basePath = path.length > 1 ? path.slice(0, -1) : path;
        const next = [...basePath, siblingKey];
        setPath(next);
        updateUrl(next);
    }

    function selectAncestor(depth: number) {
        const next = path.slice(0, depth);
        setPath(next);
        updateUrl(next);
    }

    const topLevelWithCounts = useMemo(
        () =>
            categories.map((category) => ({
                category,
                count: collectAllProducts(category).length,
            })),
        [categories]
    );

    // The pill row always shows the whole sibling group at the
    // current depth — the active node's own children while viewing
    // a parent's aggregate, or its siblings (the parent's children)
    // once drilled into one of them — so switching between siblings
    // never makes the other options disappear.
    const siblingCategories = useMemo(() => {
        if (!activeNode) {
            return [];
        }

        if (path.length <= 1) {
            return activeNode.children;
        }

        const parentNode = findNodeByPath(
            categories,
            path.slice(0, -1)
        );

        return parentNode?.children ?? [];
    }, [categories, path, activeNode]);

    const siblingsWithCounts = useMemo(
        () =>
            siblingCategories.map((sibling) => ({
                sibling,
                count: collectAllProducts(sibling).length,
            })),
        [siblingCategories]
    );

    const displayedProducts = useMemo(
        () => (activeNode ? collectAllProducts(activeNode) : []),
        [activeNode]
    );

    if (!activeNode) {
        return null;
    }

    const viewLabel = "View Product";
    const fallbackDescription =
        "Engineered fire protection equipment designed for reliable performance and demanding safety applications.";
    const imageUnavailableLabel = "Product image unavailable";

    return (
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">

            {/* =====================================================
                MOBILE / TABLET — horizontal category selector
            ===================================================== */}

            <div className="lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                    Categories
                </p>

                <div className="-mx-6 mt-4 overflow-x-auto px-6 pb-1">
                    <div className="flex w-max gap-2">
                        {topLevelWithCounts.map(({ category, count }) => {
                            const isActive = path[0] === category.key;

                            return (
                                <button
                                    key={category.key}
                                    type="button"
                                    onClick={() =>
                                        selectTopLevel(category.key)
                                    }
                                    aria-pressed={isActive}
                                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                        isActive
                                            ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#0b1f3a]"
                                    }`}
                                >
                                    {category.name}
                                    <span
                                        className={`ml-2 text-xs ${
                                            isActive
                                                ? "text-white/70"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* =====================================================
                DESKTOP — sticky category panel
            ===================================================== */}

            <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-4">
                    <p className="px-3 pb-3 pt-3 text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                        Categories
                    </p>

                    <nav className="flex flex-col gap-0.5">
                        {topLevelWithCounts.map(({ category, count }) => {
                            const isActive = path[0] === category.key;

                            return (
                                <button
                                    key={category.key}
                                    type="button"
                                    onClick={() =>
                                        selectTopLevel(category.key)
                                    }
                                    aria-pressed={isActive}
                                    className={`group/item relative flex items-center justify-between gap-3 rounded-xl px-4 py-4 text-left text-base font-semibold transition-colors duration-200 ${
                                        isActive
                                            ? "bg-[#0b1f3a] text-white"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#0b1f3a]"
                                    }`}
                                >
                                    <span
                                        className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r bg-orange-500 transition-opacity duration-200 ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                    <span className="leading-5">
                                        {category.name}
                                    </span>
                                    <span
                                        className={`shrink-0 text-xs ${
                                            isActive
                                                ? "text-white/60"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* =====================================================
                RIGHT — products for the selected category
            ===================================================== */}

            <div className="mt-10 lg:mt-0">

                {/* BREADCRUMB — only once drilled past the top level */}

                {path.length > 1 && (
                    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                        {path.map((key, index) => {
                            const node = findNodeByPath(
                                categories,
                                path.slice(0, index + 1)
                            );

                            if (!node) {
                                return null;
                            }

                            const isLast = index === path.length - 1;

                            return (
                                <span
                                    key={key}
                                    className="flex items-center gap-1.5"
                                >
                                    {index > 0 && (
                                        <span className="text-gray-300">
                                            /
                                        </span>
                                    )}

                                    {isLast ? (
                                        <span className="font-semibold text-[#0b1f3a]">
                                            {node.name}
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectAncestor(index + 1)
                                            }
                                            className="transition-colors hover:text-orange-600"
                                        >
                                            {node.name}
                                        </button>
                                    )}
                                </span>
                            );
                        })}
                    </nav>
                )}

                <div className="mb-9 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                        Product Category
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">
                        {activeNode.name}
                    </h2>

                    <div className="mt-4 h-1 w-12 bg-orange-500" />

                    {activeNode.description ? (
                        <p className="mt-5 text-justify text-base leading-7 text-gray-500">
                            {activeNode.description}
                        </p>
                    ) : null}
                </div>

                {/* SIBLING CATEGORIES — the whole group at the current
                    depth, only when there is one */}

                {siblingsWithCounts.length > 0 && (
                    <div className="mb-10 flex flex-wrap gap-2">
                        {siblingsWithCounts.map(({ sibling, count }) => {
                            const isActive =
                                path.length > 1 &&
                                path[path.length - 1] === sibling.key;

                            return (
                            <button
                                key={sibling.key}
                                type="button"
                                onClick={() => selectSibling(sibling.key)}
                                aria-pressed={isActive}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                    isActive
                                        ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                                        : "border-gray-200 bg-white text-gray-600 hover:border-orange-400 hover:text-orange-600"
                                }`}
                            >
                                {sibling.name}
                                <span
                                    className={`text-xs ${
                                        isActive
                                            ? "text-white/70"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                            );
                        })}
                    </div>
                )}

                {displayedProducts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <p className="text-gray-500">
                            No products available.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                        {displayedProducts.map((product) => (
                            <ProductItem
                                key={product.key}
                                product={product}
                                viewLabel={viewLabel}
                                fallbackDescription={
                                    fallbackDescription
                                }
                                imageUnavailableLabel={
                                    imageUnavailableLabel
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
