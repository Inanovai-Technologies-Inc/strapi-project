import React from "react";

/* =========================================================
   STRAPI RICH TEXT RENDERER

   Shared between the product page sections and the
   <FeatureTabs> component so every rich-text field renders
   identically. Pure function — safe in both Server and
   Client Components.
========================================================= */

export function renderBlocks(blocks: any[]) {
    if (!Array.isArray(blocks)) {
        return null;
    }

    return blocks.map((block: any, index: number) => {
        if (!block) {
            return null;
        }

        const children = Array.isArray(block.children)
            ? block.children
            : [];

        const text = children
            .map((child: any) => child?.text || "")
            .join("");

        if (!text.trim()) {
            return null;
        }

        switch (block.type) {
            case "heading":
                return (
                    <h3
                        key={index}
                        className="mb-4 mt-6 text-xl font-bold text-gray-900"
                    >
                        {text}
                    </h3>
                );

            case "list":
                return (
                    <ul
                        key={index}
                        className="mb-4 list-disc space-y-2 pl-6 text-base leading-8 text-gray-600"
                    >
                        {children.map(
                            (
                                item: any,
                                itemIndex: number
                            ) => (
                                <li key={itemIndex}>
                                    {item?.children
                                        ?.map(
                                            (child: any) =>
                                                child?.text ||
                                                ""
                                        )
                                        .join("") || ""}
                                </li>
                            )
                        )}
                    </ul>
                );

            case "quote":
                return (
                    <blockquote
                        key={index}
                        className="my-6 border-l-4 border-orange-500 pl-5 italic text-gray-600"
                    >
                        {text}
                    </blockquote>
                );

            default:
                return (
                    <p
                        key={index}
                        className="mb-4 text-base leading-8 text-gray-600 last:mb-0"
                    >
                        {text}
                    </p>
                );
        }
    });
}

export default renderBlocks;
