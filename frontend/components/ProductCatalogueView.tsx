"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

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

export type CatalogueGroup = {
    key: string;
    name: string;
    slug: string;
    description: string;
    /** true for the synthetic "products without a category" group */
    isOther?: boolean;
    products: CatalogueProduct[];
};

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
                className={`mt-2 line-clamp-3 text-sm leading-6 ${
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

   Two-column catalogue: sticky category panel on the left,
   products for the selected category on the right. Switching
   categories is pure client state — no navigation, no reload.
========================================================= */

export default function ProductCatalogueView({
    groups,
}: {
    groups: CatalogueGroup[];
}) {
    const { t } = useI18n();

    const resolvedGroups = useMemo(
        () =>
            groups.map((group) => ({
                ...group,
                displayName: group.isOther
                    ? t("productsPage.otherProducts")
                    : group.name,
            })),
        [groups, t]
    );

    const [selectedKey, setSelectedKey] = useState(
        resolvedGroups[0]?.key ?? ""
    );

    const activeGroup =
        resolvedGroups.find(
            (group) => group.key === selectedKey
        ) ?? resolvedGroups[0];

    if (!activeGroup) {
        return null;
    }

    const viewLabel = t("productsPage.viewProduct");
    const fallbackDescription = t(
        "productsPage.cardDefaultDescription"
    );
    const imageUnavailableLabel = t(
        "productsPage.imageUnavailable"
    );

    return (
        <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[340px_minmax(0,1fr)]">

            {/* =====================================================
                MOBILE / TABLET — horizontal category selector
            ===================================================== */}

            <div className="lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                    {t("productsPage.categoriesTitle")}
                </p>

                <div className="-mx-6 mt-4 overflow-x-auto px-6 pb-1">
                    <div className="flex w-max gap-2">
                        {resolvedGroups.map((group) => {
                            const isActive =
                                group.key === activeGroup.key;

                            return (
                                <button
                                    key={group.key}
                                    type="button"
                                    onClick={() =>
                                        setSelectedKey(group.key)
                                    }
                                    aria-pressed={isActive}
                                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                        isActive
                                            ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-[#0b1f3a]"
                                    }`}
                                >
                                    {group.displayName}
                                    <span
                                        className={`ml-2 text-xs ${
                                            isActive
                                                ? "text-white/70"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {group.products.length}
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
                        {t("productsPage.categoriesTitle")}
                    </p>

                    <nav className="flex flex-col gap-0.5">
                        {resolvedGroups.map((group) => {
                            const isActive =
                                group.key === activeGroup.key;

                            return (
                                <button
                                    key={group.key}
                                    type="button"
                                    onClick={() =>
                                        setSelectedKey(group.key)
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
                                        {group.displayName}
                                    </span>
                                    <span
                                        className={`shrink-0 text-xs ${
                                            isActive
                                                ? "text-white/60"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {group.products.length}
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

                <div className="mb-9 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-500">
                        {t("productsPage.categoryEyebrow")}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">
                        {activeGroup.displayName}
                    </h2>

                    <div className="mt-4 h-1 w-12 bg-orange-500" />

                    {activeGroup.description ? (
                        <p className="mt-5 text-base leading-7 text-gray-500">
                            {activeGroup.description}
                        </p>
                    ) : null}
                </div>

                {activeGroup.products.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                        <p className="text-gray-500">
                            {t("productsPage.noProducts")}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                        {activeGroup.products.map((product) => (
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
