"use client";

import React from "react";

import { useI18n } from "@/components/I18nProvider";
import { renderBlocks } from "@/components/richText";

/* =========================================================
   FEATURE TABS

   Turns a Strapi rich-text field into a horizontal tab bar:
   every heading block ("Key Features", "Compliance",
   "Optionals", "Quality Testing", "Regulatory Warning", ...)
   becomes a tab, and the blocks that follow it are shown in
   a large light-gray content box below the tabs.

   The Strapi data is untouched — this only regroups the
   blocks that <renderBlocks> already knows how to draw.
========================================================= */

type Section = {
    id: string;
    label: string;
    blocks: any[];
};

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function blockText(block: any): string {
    return Array.isArray(block?.children)
        ? block.children
              .map((child: any) => child?.text || "")
              .join("")
              .trim()
        : "";
}

function splitIntoSections(
    blocks: any[],
    fallbackLabel: string
): Section[] {
    if (!Array.isArray(blocks)) {
        return [];
    }

    const sections: Section[] = [];
    let current: Section | null = null;

    blocks.forEach((block, index) => {
        if (!block) {
            return;
        }

        const text = blockText(block);

        if (block.type === "heading" && text) {
            current = {
                id: `${slugify(text) || "section"}-${sections.length}`,
                label: text,
                blocks: [],
            };
            sections.push(current);
            return;
        }

        if (!current) {
            current = {
                id: `overview-${index}`,
                label: fallbackLabel,
                blocks: [],
            };
            sections.push(current);
        }

        current.blocks.push(block);
    });

    return sections;
}

export default function FeatureTabs({
    blocks,
}: {
    blocks: any[];
}) {
    const { t } = useI18n();

    const sections = React.useMemo(
        () =>
            splitIntoSections(
                blocks,
                t("productDetail.featuresTitle")
            ),
        [blocks, t]
    );

    const [active, setActive] = React.useState(0);
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    if (sections.length === 0) {
        return null;
    }

    const activeIndex = Math.min(active, sections.length - 1);
    const activeSection = sections[activeIndex];

    function focusTab(index: number) {
        const next = (index + sections.length) % sections.length;
        setActive(next);
        tabRefs.current[next]?.focus();
    }

    function onKeyDown(event: React.KeyboardEvent) {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            focusTab(activeIndex + 1);
        } else if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
        ) {
            event.preventDefault();
            focusTab(activeIndex - 1);
        } else if (event.key === "Home") {
            event.preventDefault();
            focusTab(0);
        } else if (event.key === "End") {
            event.preventDefault();
            focusTab(sections.length - 1);
        }
    }

    return (
        <div className="mt-8">

            {/* TABS */}

            <div
                role="tablist"
                aria-label={t("productDetail.featuresTitle")}
                onKeyDown={onKeyDown}
                className="
                    -mx-6
                    flex
                    gap-1
                    overflow-x-auto
                    border-b
                    border-gray-200
                    px-6
                    pb-px

                    sm:mx-0
                    sm:flex-wrap
                    sm:overflow-visible
                    sm:px-0
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                "
            >
                {sections.map((section, index) => {
                    const selected = index === activeIndex;

                    return (
                        <button
                            key={section.id}
                            ref={(node) => {
                                tabRefs.current[index] = node;
                            }}
                            type="button"
                            role="tab"
                            id={`${section.id}-tab`}
                            aria-selected={selected}
                            aria-controls={`${section.id}-panel`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setActive(index)}
                            className={`
                                -mb-px
                                shrink-0
                                whitespace-nowrap
                                border-b-2
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                                transition-colors
                                duration-200

                                ${
                                    selected
                                        ? `
                                            border-orange-500
                                            text-gray-900
                                        `
                                        : `
                                            border-transparent
                                            text-gray-500

                                            hover:border-gray-300
                                            hover:text-gray-800
                                        `
                                }
                            `}
                        >
                            {section.label}
                        </button>
                    );
                })}
            </div>

            {/* CONTENT BOX */}

            <div
                key={activeSection.id}
                role="tabpanel"
                id={`${activeSection.id}-panel`}
                aria-labelledby={`${activeSection.id}-tab`}
                className="
                    mt-6
                    rounded-2xl
                    bg-gray-100
                    p-6

                    sm:p-10
                "
            >
                {activeSection.blocks.length > 0 ? (
                    renderBlocks(activeSection.blocks)
                ) : (
                    <p className="text-base leading-8 text-gray-500">
                        {activeSection.label}
                    </p>
                )}
            </div>

        </div>
    );
}
