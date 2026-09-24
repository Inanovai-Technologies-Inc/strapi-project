import React from "react";
import Link from "next/link";

/* =========================================================
   STRAPI RICH TEXT RENDERER

   Shared between the product page sections and the
   <FeatureTabs> component so every rich-text field renders
   identically. Pure function — safe in both Server and
   Client Components.
========================================================= */

/* =========================================================
   PLAIN-TEXT BULLET RENDERER

   Some Strapi fields are plain text (not rich-text blocks), but
   content editors still hand-format lines as a bullet list using
   a leading "·" or "•". Consecutive bullet lines are grouped into
   a real <ul> with the same list-disc/spacing/bold-marker styling
   used by every other bullet list on the site (see renderBlocks'
   "list" case below), instead of just an inline dot.

   Callers can optionally pass `links`/`highlights` — exact
   substrings to turn into an internal link or an emphasised
   highlight wherever they occur in the text. Omitting the
   option leaves rendering exactly as before.
========================================================= */

const BULLET_LINE_PATTERN = /^\s*[·•]\s*/;

export interface TextLink {
    match: string;
    href: string;
    className?: string;
}

export interface TextHighlight {
    match: string;
    className?: string;
}

export interface RenderTextOptions {
    links?: TextLink[];
    highlights?: TextHighlight[];
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLineParts(
    line: string,
    keyPrefix: string,
    options?: RenderTextOptions
): React.ReactNode {
    const links = options?.links || [];
    const highlights = options?.highlights || [];

    const patternParts = [
        ...links.map((l) => escapeRegExp(l.match)),
        ...highlights.map((h) => escapeRegExp(h.match)),
    ];

    if (patternParts.length === 0) {
        return line;
    }

    const tokenizer = new RegExp(`(${patternParts.join("|")})`, "g");

    return line.split(tokenizer).map((segment, index) => {
        if (!segment) {
            return null;
        }

        const linkMatch = links.find((l) => l.match === segment);

        if (linkMatch) {
            return (
                <Link
                    key={`${keyPrefix}-${index}`}
                    href={linkMatch.href}
                    className={
                        linkMatch.className ||
                        "font-semibold text-orange-600 underline underline-offset-2 transition hover:text-orange-700"
                    }
                >
                    {segment}
                </Link>
            );
        }

        const highlightMatch = highlights.find((h) => h.match === segment);

        if (highlightMatch) {
            return (
                <mark
                    key={`${keyPrefix}-${index}`}
                    className={
                        highlightMatch.className ||
                        "rounded bg-orange-100 px-1 font-semibold text-gray-900"
                    }
                >
                    {segment}
                </mark>
            );
        }

        return segment;
    });
}

export function renderBulletedText(
    text: string,
    options?: RenderTextOptions
) {
    if (!text) {
        return null;
    }

    const lines = text.split("\n");
    const nodes: React.ReactNode[] = [];
    let bulletBuffer: React.ReactNode[] = [];

    function flushBullets() {
        if (bulletBuffer.length === 0) {
            return;
        }

        nodes.push(
            <ul
                key={`ul-${nodes.length}`}
                className="my-3 list-disc space-y-2 pl-6 marker:font-bold"
            >
                {bulletBuffer.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                ))}
            </ul>
        );

        bulletBuffer = [];
    }

    lines.forEach((line, lineIndex) => {
        const match = line.match(BULLET_LINE_PATTERN);

        if (match) {
            const bulletText = line.slice(match[0].length);
            bulletBuffer.push(
                renderLineParts(bulletText, `bullet-${lineIndex}`, options)
            );
            return;
        }

        flushBullets();

        if (!line.trim()) {
            nodes.push(<br key={`br-${nodes.length}`} />);
            return;
        }

        nodes.push(
            <span key={`line-${nodes.length}`} className="block">
                {renderLineParts(line, `line-${lineIndex}`, options)}
            </span>
        );
    });

    flushBullets();

    return nodes;
}

export function renderBlocks(
    blocks: any[],
    options?: { justify?: boolean }
) {
    if (!Array.isArray(blocks)) {
        return null;
    }

    const justify = options?.justify ? "text-justify" : "";

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

        // For "list" blocks, `children` are list-item nodes (their
        // text is nested one level deeper), not text nodes, so `text`
        // above is always empty for them — this check only applies to
        // block types whose children ARE text nodes directly.
        if (block.type !== "list" && !text.trim()) {
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
                        className={`mb-4 list-disc space-y-2 pl-6 text-base leading-8 text-gray-600 marker:font-bold ${justify}`}
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
                        className={`my-6 border-l-4 border-orange-500 pl-5 italic text-gray-600 ${justify}`}
                    >
                        {text}
                    </blockquote>
                );

            default:
                return (
                    <p
                        key={index}
                        className={`mb-4 text-base leading-8 text-gray-600 last:mb-0 ${justify}`}
                    >
                        {text}
                    </p>
                );
        }
    });
}

export default renderBlocks;
