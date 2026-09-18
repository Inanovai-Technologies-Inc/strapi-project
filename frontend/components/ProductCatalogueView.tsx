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
    imageUrl: string | null;
    imageAlt: string;
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
   PRODUCT ITEM — styled to match the Service listing cards:
   bordered panel, fixed-height image, hover lift + shadow,
   uppercase eyebrow/title, justified description, CTA row —
   with the same light/dark theme support used across the site.
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
        <Link
            href={href}
            aria-label={product.name}
            className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition-all
                duration-500

                hover:-translate-y-2
                hover:shadow-2xl

                dark:border-white/10
                dark:bg-[#0b1622]
                dark:shadow-black/40
            "
        >

            {/* IMAGE */}

            <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-white/[0.04]">
                <span className="absolute left-0 top-0 z-10 h-0.5 w-12 bg-orange-500 transition-all duration-300 group-hover:w-20" />

                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                        {imageUnavailableLabel}
                    </div>
                )}
            </div>

            {/* CONTENT */}

            <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                    Product
                </p>

                <h3 className="mt-3 text-lg font-bold uppercase leading-tight text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-600 dark:text-white">
                    {product.name}
                </h3>

                <p
                    className={`mt-3 line-clamp-3 text-justify text-sm leading-6 ${
                        product.description
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    {product.description || fallbackDescription}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-500 dark:text-white">
                    {viewLabel}
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                    </span>
                </span>
            </div>
        </Link>
    );
}

/* =========================================================
   CATEGORY ITEM — same card as a product, but for a
   subcategory. Selecting it drills into that subcategory
   rather than navigating to a detail page, so it's a button.
========================================================= */

function CategoryItem({
    category,
    onSelect,
}: {
    category: CatalogueCategoryNode;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            aria-label={category.name}
            className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-gray-200
                bg-white
                text-left
                shadow-sm
                transition-all
                duration-500

                hover:-translate-y-2
                hover:shadow-2xl

                dark:border-white/10
                dark:bg-[#0b1622]
                dark:shadow-black/40
            "
        >

            {/* IMAGE */}

            <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-white/[0.04]">
                <span className="absolute left-0 top-0 z-10 h-0.5 w-12 bg-orange-500 transition-all duration-300 group-hover:w-20" />

                {category.imageUrl ? (
                    <img
                        src={category.imageUrl}
                        alt={category.imageAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                        Image unavailable
                    </div>
                )}
            </div>

            {/* CONTENT */}

            <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                    Category
                </p>

                <h3 className="mt-3 text-lg font-bold uppercase leading-tight text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-600 dark:text-white">
                    {category.name}
                </h3>

                <p
                    className={`mt-3 line-clamp-3 text-justify text-sm leading-6 ${
                        category.description
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-400 dark:text-gray-500"
                    }`}
                >
                    {category.description ||
                        "Explore the products available in this category."}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0b1f3a] transition-colors duration-300 group-hover:text-orange-500 dark:text-white">
                    View Products
                    <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                        →
                    </span>
                </span>
            </div>
        </button>
    );
}

/* =========================================================
   PRODUCT CATALOGUE VIEW

   Sidebar lists only top-level categories. A category with no
   children is selected directly and shows its products. One that
   has children never shows products itself — clicking it expands
   its subcategories inline, indented beneath it in the same card,
   and only those subcategory rows select anything.
   Switching categories is pure client state, no navigation or
   reload; only the URL's `category` slug updates to reflect the
   current selection.
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

        return (
            fromSlug ?? (categories[0] ? [categories[0].key] : [])
        );
    });

    // Which parent category currently has its subcategories expanded
    // inline. Toggled by clicking/tapping the parent row — purely a
    // display toggle, never selects a product view.
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

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

    function goTo(nextPath: string[]) {
        setPath(nextPath);
        updateUrl(nextPath);
    }

    // Selects a top-level category that has no children of its own.
    // Moving to another category also closes any open expansion.
    function selectTopLevel(key: string) {
        setExpandedKey(null);
        goTo([key]);
    }

    // A category with children shows its subcategories as cards
    // instead of products, and toggles its list open in the sidebar.
    function selectParentCategory(key: string, isExpanded: boolean) {
        setExpandedKey(isExpanded ? null : key);
        goTo([key]);
    }

    function selectAncestor(depth: number) {
        goTo(path.slice(0, depth));
    }

    // Selects a subcategory — reached either from the sidebar list
    // or from its card, so the path is set to the pair in one step.
    function selectSubcategory(topLevelKey: string, childKey: string) {
        setExpandedKey(topLevelKey);
        goTo([topLevelKey, childKey]);
    }

    const topLevelWithCounts = useMemo(
        () =>
            categories.map((category) => ({
                category,
                count: collectAllProducts(category).length,
            })),
        [categories]
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
                            const hasChildren =
                                category.children.length > 0;
                            const isExpanded =
                                expandedKey === category.key;

                            return (
                                <button
                                    key={category.key}
                                    type="button"
                                    onClick={() =>
                                        hasChildren
                                            ? selectParentCategory(
                                                  category.key,
                                                  isExpanded
                                              )
                                            : selectTopLevel(category.key)
                                    }
                                    aria-haspopup={hasChildren || undefined}
                                    aria-expanded={
                                        hasChildren ? isExpanded : undefined
                                    }
                                    aria-pressed={
                                        hasChildren ? undefined : isActive
                                    }
                                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                        !hasChildren && isActive
                                            ? "border-[#0b1f3a] bg-[#0b1f3a] text-white dark:border-white dark:bg-white dark:text-[#0b1f3a]"
                                            : hasChildren && isExpanded
                                            ? "border-orange-400 bg-white text-[#0b1f3a] dark:border-orange-400 dark:bg-white/5 dark:text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#0b1f3a] dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white"
                                    }`}
                                >
                                    {category.name}
                                    <span
                                        className={`ml-2 text-xs ${
                                            !hasChildren && isActive
                                                ? "text-white/70 dark:text-[#0b1f3a]/70"
                                                : "text-gray-400 dark:text-gray-500"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                    {hasChildren && (
                                        <span
                                            aria-hidden="true"
                                            className="ml-1.5 text-gray-400 dark:text-gray-500"
                                        >
                                            {isExpanded ? "︿" : "›"}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tapped-open subcategories — the mobile equivalent
                        of the sidebar's inline expansion. Selecting one
                        shows its products and collapses this row again. */}

                    {expandedKey && (
                        <div className="mt-2 flex w-max gap-2">
                            {(
                                categories.find(
                                    (category) =>
                                        category.key === expandedKey
                                )?.children ?? []
                            ).map((child) => (
                                <button
                                    key={child.key}
                                    type="button"
                                    onClick={() => {
                                        selectSubcategory(
                                            expandedKey,
                                            child.key
                                        );
                                        setExpandedKey(null);
                                    }}
                                    className="whitespace-nowrap rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 hover:border-orange-400 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-orange-400 dark:hover:text-orange-400"
                                >
                                    {child.name}
                                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                                        {
                                            collectAllProducts(child)
                                                .length
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================
                DESKTOP — sticky category panel
            ===================================================== */}

            <aside className="relative z-20 hidden lg:block">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#0b1622]">
                    <p className="px-3 pb-3 pt-3 text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                        Categories
                    </p>

                    <nav className="flex flex-col gap-0.5">
                        {topLevelWithCounts.map(({ category, count }) => {
                            const isActive = path[0] === category.key;
                            const childrenWithCounts = category.children.map(
                                (child) => ({
                                    child,
                                    count: collectAllProducts(child).length,
                                })
                            );

                            const hasChildren =
                                childrenWithCounts.length > 0;

                            const isExpanded =
                                expandedKey === category.key;

                            return (
                                <div
                                    key={category.key}
                                    className="relative"
                                >
                                    {hasChildren ? (
                                        // Expand trigger only — a category
                                        // with subcategories has no product
                                        // view of its own, so clicking it
                                        // opens/closes its children here
                                        // and shows them as cards in the
                                        // content area.
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectParentCategory(
                                                    category.key,
                                                    isExpanded
                                                )
                                            }
                                            aria-expanded={isExpanded}
                                            className="relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-left text-base font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-50 hover:text-[#0b1f3a] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
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
                                            <span className="flex shrink-0 items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                                {count}
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-block transition-transform duration-200 ${
                                                        isExpanded
                                                            ? "rotate-90"
                                                            : ""
                                                    }`}
                                                >
                                                    ›
                                                </span>
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectTopLevel(category.key)
                                            }
                                            aria-pressed={isActive}
                                            className={`group/item relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-4 text-left text-base font-semibold transition-colors duration-200 ${
                                                isActive
                                                    ? "bg-[#0b1f3a] text-white dark:bg-white dark:text-[#0b1f3a]"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#0b1f3a] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
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
                                                        ? "text-white/60 dark:text-[#0b1f3a]/60"
                                                        : "text-gray-400 dark:text-gray-500"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    )}

                                    {/* SUBCATEGORIES — expanded inline in
                                        the same Categories card, indented
                                        under their parent. Toggled by
                                        clicking the parent row; only these
                                        rows navigate. */}

                                    {hasChildren && isExpanded && (
                                        <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-3 dark:border-white/10">
                                            {childrenWithCounts.map(
                                                ({ child, count: childCount }) => {
                                                    const isChildActive =
                                                        path[
                                                            path.length - 1
                                                        ] === child.key;

                                                    return (
                                                        <button
                                                            key={child.key}
                                                            type="button"
                                                            onClick={() =>
                                                                selectSubcategory(
                                                                    category.key,
                                                                    child.key
                                                                )
                                                            }
                                                            aria-pressed={
                                                                isChildActive
                                                            }
                                                            className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                                                                isChildActive
                                                                    ? "bg-[#0b1f3a] text-white dark:bg-white dark:text-[#0b1f3a]"
                                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#0b1f3a] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                                                            }`}
                                                        >
                                                            <span>
                                                                {child.name}
                                                            </span>
                                                            <span
                                                                className={`shrink-0 text-xs ${
                                                                    isChildActive
                                                                        ? "text-white/60 dark:text-[#0b1f3a]/60"
                                                                        : "text-gray-400 dark:text-gray-500"
                                                                }`}
                                                            >
                                                                {childCount}
                                                            </span>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* =====================================================
                RIGHT — products for the selected category
            ===================================================== */}

            <div className="relative z-0 mt-10 lg:mt-0">

                {/* BREADCRUMB — only once drilled past the top level */}

                {path.length > 1 && (
                    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
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
                                        <span className="text-gray-300 dark:text-gray-600">
                                            /
                                        </span>
                                    )}

                                    {isLast ? (
                                        <span className="font-semibold text-[#0b1f3a] dark:text-white">
                                            {node.name}
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                selectAncestor(index + 1)
                                            }
                                            className="transition-colors hover:text-orange-600 dark:hover:text-orange-400"
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

                    <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a] sm:text-3xl dark:text-white">
                        {activeNode.name}
                    </h2>

                    <div className="mt-4 h-1 w-12 bg-orange-500" />

                    {activeNode.description ? (
                        <p className="mt-5 text-justify text-base leading-7 text-gray-500 dark:text-gray-400">
                            {activeNode.description}
                        </p>
                    ) : null}
                </div>

                {activeNode.children.length > 0 ? (
                    // A category with subcategories shows those as cards
                    // — its products are reached by picking one of them.
                    // Any products pinned directly to it still follow.
                    <>
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {activeNode.children.map((child) => (
                                <CategoryItem
                                    key={child.key}
                                    category={child}
                                    onSelect={() =>
                                        selectSubcategory(
                                            activeNode.key,
                                            child.key
                                        )
                                    }
                                />
                            ))}
                        </div>

                        {activeNode.directProducts.length > 0 && (
                            <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                                {activeNode.directProducts.map(
                                    (product) => (
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
                                    )
                                )}
                            </div>
                        )}
                    </>
                ) : displayedProducts.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#0b1622]">
                        <p className="text-gray-500 dark:text-gray-400">
                            No products available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
