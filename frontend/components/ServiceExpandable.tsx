
"use client";

import { useState } from "react";

import { renderBlocks } from "@/components/richText";

/* =========================================================
   SERVICE EXPANDABLE ITEMS

   Renders the service-level `ExpandableItemtitle`,
   `ExpandableItemImage` and repeatable `ExpandableItem`
   component as a click-to-reveal accordion. Every item shows
   its `title`; its `content` (Strapi blocks) is revealed on
   click. Nothing is hardcoded — the list is driven entirely
   by the Strapi data passed in.
========================================================= */

type ExpandableItem = {
    id?: number | string;
    title?: string;
    number?: number | null;
    content?: any;
};

export default function ServiceExpandable({
    title,
    imageUrl,
    imageAlt,
    items,
}: {
    title?: string | null;
    imageUrl?: string | null;
    imageAlt?: string;
    items: ExpandableItem[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    return (
        <section className="px-6 py-16 lg:px-8">

            <div className="mx-auto max-w-6xl">

                {title && (
                    <>
                        <h2 className="text-2xl font-bold uppercase leading-tight text-[#0b1f3a] sm:text-3xl">
                            {title}
                        </h2>

                        <div className="mt-5 h-1 w-12 bg-orange-500" />
                    </>
                )}

                <div
                    className={`mt-10 grid gap-12 lg:items-start ${
                        imageUrl ? "lg:grid-cols-2" : "lg:grid-cols-1"
                    }`}
                >

                    {/* ACCORDION */}

                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={item.id ?? index}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-colors duration-300 hover:border-orange-300"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenIndex(
                                                isOpen ? null : index
                                            )
                                        }
                                        aria-expanded={isOpen}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    >
                                        <span className="flex items-center gap-3">
                                            {typeof item.number ===
                                                "number" && (
                                                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                                                    {item.number}
                                                </span>
                                            )}

                                            <span className="text-base font-semibold text-[#0b1f3a]">
                                                {item.title}
                                            </span>
                                        </span>

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`h-5 w-5 shrink-0 text-orange-500 transition-transform duration-300 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ease-out ${
                                            isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t border-gray-200 bg-white px-5 py-4 text-sm leading-7 text-gray-600">
                                                {renderBlocks(item.content)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* IMAGE */}

                    {imageUrl && (
                        <div className="lg:sticky lg:top-24">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                                <img
                                    src={imageUrl}
                                    alt={imageAlt || title || "Service"}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </section>
    );
}
