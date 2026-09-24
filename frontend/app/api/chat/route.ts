import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getWebsiteKnowledge } from "@/lib/websiteKnowledge";

/* =========================================================
   TYPES
========================================================= */

type PageContext = {
    pageType?: string;
    pageTitle?: string;
    url?: string;

    productName?: string;
    productDescription?: string;
    productFeatures?: any;
    productApplications?: any;
    technicalSpecifications?: any;
    relatedProducts?: any[];
    foamSkidSeries?: any[];

    [key: string]: any;
};

const OUT_OF_SCOPE_RESPONSE =
    "Sorry, I don’t have information about that.";

/* =========================================================
   RICH TEXT → PLAIN TEXT
========================================================= */

function richTextToText(value: any): string {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                richTextToText(item)
            )
            .filter(Boolean)
            .join("\n");
    }

    if (typeof value === "object") {

        if (
            typeof value.text ===
            "string"
        ) {
            return value.text;
        }

        if (
            Array.isArray(
                value.children
            )
        ) {
            return value.children
                .map((child: any) =>
                    richTextToText(child)
                )
                .filter(Boolean)
                .join("");
        }
    }

    return "";
}

/* =========================================================
   TECHNICAL SPECIFICATIONS
========================================================= */

function formatTechnicalSpecifications(
    specifications: any
): string {

    if (
        !Array.isArray(
            specifications
        )
    ) {
        return "";
    }

    return specifications
        .filter(
            (spec: any) =>
                spec?.Label ||
                spec?.Value
        )
        .map(
            (spec: any) =>
                `${spec.Label || "Specification"}: ${
                    spec.Value || "Not provided"
                }`
        )
        .join("\n");
}

/* =========================================================
   RELATED PRODUCTS
========================================================= */

function formatRelatedProducts(
    products: any
): string {

    if (!Array.isArray(products)) {
        return "";
    }

    return products
        .filter(
            (product: any) =>
                product?.Name
        )
        .map(
            (product: any) =>
                `- ${product.Name}${
                    product.description
                        ? `: ${product.description}`
                        : ""
                }`
        )
        .join("\n");
}

/* =========================================================
   FOAM SKID SERIES
========================================================= */

function formatFoamSkidSeries(
    series: any
): string {

    if (!Array.isArray(series)) {
        return "";
    }

    return series
        .filter(
            (item: any) =>
                item?.SeriesName
        )
        .map(
            (item: any) => {

                const description =
                    richTextToText(
                        item.SeriesDescription
                    );

                return `- ${
                    item.SeriesName
                }${
                    description
                        ? `: ${description}`
                        : ""
                }`;
            }
        )
        .join("\n");
}

/* =========================================================
   BUILD PAGE CONTEXT
========================================================= */

function buildPageContext(
    context: PageContext
): string {

    if (!context) {
        return "No page context is currently available.";
    }

    const sections: string[] = [];

    /* =====================================================
       PAGE
    ===================================================== */

    if (context.pageType) {
        sections.push(
            `PAGE TYPE: ${context.pageType}`
        );
    }

    if (context.pageTitle) {
        sections.push(
            `PAGE TITLE: ${context.pageTitle}`
        );
    }

    if (context.url) {
        sections.push(
            `PAGE URL: ${context.url}`
        );
    }

    /* =====================================================
       PRODUCT
    ===================================================== */

    if (context.productName) {

        sections.push(
            `PRODUCT NAME: ${context.productName}`
        );

        if (
            context.productDescription
        ) {
            sections.push(
                `PRODUCT DESCRIPTION:\n${context.productDescription}`
            );
        }

        const features =
            richTextToText(
                context.productFeatures
            );

        if (features) {
            sections.push(
                `PRODUCT FEATURES:\n${features}`
            );
        } else {
            sections.push(
                "PRODUCT FEATURES: Not provided on this page."
            );
        }

        const applications =
            richTextToText(
                context.productApplications
            );

        if (applications) {
            sections.push(
                `PRODUCT APPLICATIONS:\n${applications}`
            );
        } else {
            sections.push(
                "PRODUCT APPLICATIONS: Not provided on this page."
            );
        }

        const specifications =
            formatTechnicalSpecifications(
                context.technicalSpecifications
            );

        if (specifications) {
            sections.push(
                `TECHNICAL SPECIFICATIONS:\n${specifications}`
            );
        } else {
            sections.push(
                "TECHNICAL SPECIFICATIONS: No populated specifications are available."
            );
        }

        const foamSeries =
            formatFoamSkidSeries(
                context.foamSkidSeries
            );

        if (foamSeries) {
            sections.push(
                `FOAM SKID SERIES:\n${foamSeries}`
            );
        }

        const relatedProducts =
            formatRelatedProducts(
                context.relatedProducts
            );

        if (relatedProducts) {
            sections.push(
                `RELATED PRODUCTS:\n${relatedProducts}`
            );
        }
    }

    return sections.join(
        "\n\n"
    );
}

function buildProductsKnowledge(
    products: any[]
): string {
    if (!Array.isArray(products) || products.length === 0) {
        return "No Strapi product content is currently available.";
    }

    const productSections = products.map(
        (entry: any, index: number) => {
            const product =
                entry?.attributes || entry || {};

            const description =
                richTextToText(product.description);
            const features =
                richTextToText(product.Features);
            const applications =
                richTextToText(product.Applications);
            const specifications =
                formatTechnicalSpecifications(
                    product.TechnicalSpecification
                );

            return [
                `PRODUCT ${index + 1}`,
                `NAME: ${product.Name || "Not provided"}`,
                description
                    ? `DESCRIPTION: ${description}`
                    : "",
                features
                    ? `FEATURES: ${features}`
                    : "",
                applications
                    ? `APPLICATIONS: ${applications}`
                    : "",
                specifications
                    ? `TECHNICAL SPECIFICATIONS:\n${specifications}`
                    : "",
            ]
                .filter(Boolean)
                .join("\n");
        }
    );

    return [
        `PRODUCT COUNT: ${products.length}`,
        ...productSections,
    ].join("\n\n");
}

/* =========================================================
   SERVICE EXPANDABLE ITEMS
========================================================= */

function formatExpandableItems(
    items: any
): string {

    if (!Array.isArray(items)) {
        return "";
    }

    return items
        .filter((item: any) => item?.title)
        .map((item: any) => {

            const content = richTextToText(
                item.content
            );

            return `  - ${item.title}${
                content ? `: ${content}` : ""
            }`;
        })
        .join("\n");
}

/* =========================================================
   SERVICE SECTIONS
========================================================= */

function formatServiceSections(
    sections: any
): string {

    if (!Array.isArray(sections)) {
        return "";
    }

    return sections
        .filter(
            (section: any) =>
                section?.heading || section?.content
        )
        .map((section: any) => {

            const content = richTextToText(
                section.content
            );

            return `  - ${
                section.heading || "Section"
            }${content ? `: ${content}` : ""}`;
        })
        .join("\n");
}

function buildServicesKnowledge(
    services: any[]
): string {
    if (!Array.isArray(services) || services.length === 0) {
        return "No Strapi service content is currently available.";
    }

    const serviceSections = services.map(
        (entry: any, index: number) => {
            const service =
                entry?.attributes || entry || {};

            const introductionContent =
                richTextToText(
                    service.introductionContent
                );
            const sections =
                formatServiceSections(
                    service.sections
                );
            const expandableItems =
                formatExpandableItems(
                    service.ExpandableItem
                );

            return [
                `SERVICE ${index + 1}`,
                `NAME: ${service.title || "Not provided"}`,
                service.introductionTitle
                    ? `INTRODUCTION TITLE: ${service.introductionTitle}`
                    : "",
                introductionContent
                    ? `INTRODUCTION: ${introductionContent}`
                    : "",
                sections
                    ? `SECTIONS:\n${sections}`
                    : "",
                service.ExpandableItemtitle
                    ? `DETAILS TITLE: ${service.ExpandableItemtitle}`
                    : "",
                expandableItems
                    ? `DETAILS:\n${expandableItems}`
                    : "",
            ]
                .filter(Boolean)
                .join("\n");
        }
    );

    return [
        `SERVICE COUNT: ${services.length}`,
        ...serviceSections,
    ].join("\n\n");
}

function buildWebsiteKnowledge(
    products: any[],
    services: any[]
): string {
    return [
        buildProductsKnowledge(products),
        buildServicesKnowledge(services),
    ].join("\n\n");
}

/* =========================================================
   POST
========================================================= */

export async function POST(
    req: NextRequest
) {

    try {

        /* =================================================
           API KEY
        ================================================= */

        if (
            !process.env.GEMINI_API_KEY
        ) {

            console.error(
                "GEMINI_API_KEY is missing"
            );

            return NextResponse.json(
                {
                    error:
                        "GEMINI_API_KEY is not configured",
                },
                {
                    status: 500,
                }
            );
        }

        /* =================================================
           REQUEST
        ================================================= */

        const body =
            await req.json();

        const message =
            body?.message;

        const pageContext =
            body?.pageContext || {};

        if (
            !message ||
            typeof message !==
                "string"
        ) {

            return NextResponse.json(
                {
                    error:
                        "Message is required",
                },
                {
                    status: 400,
                }
            );
        }

        /* =================================================
           FORMAT CONTEXT
        ================================================= */

        const formattedContext =
            buildPageContext(
                pageContext
            );

        let formattedWebsiteKnowledge =
            "No Strapi website content is currently available.";

        try {
            const { products, services } =
                await getWebsiteKnowledge();

            formattedWebsiteKnowledge =
                buildWebsiteKnowledge(
                    products,
                    services
                );
        } catch (error) {
            console.warn(
                "Unable to load Strapi chatbot knowledge:",
                error
            );
        }

        console.log(
            "CHATBOT PAGE CONTEXT:",
            formattedContext
        );

        /* =================================================
           GEMINI
        ================================================= */

        const ai =
            new GoogleGenAI({
                apiKey:
                    process.env
                        .GEMINI_API_KEY,
            });

        /* =================================================
           SYSTEM INSTRUCTIONS
        ================================================= */

        const prompt = `
You are the Marsol Technical Assistant.

Marsol provides fire protection, fire suppression,
marine, offshore, helideck and industrial safety solutions.

Your job is to help website visitors understand
Marsol's website, products and technical information.

=========================================================
CURRENT PAGE CONTEXT
=========================================================

${formattedContext}

=========================================================
STRAPI WEBSITE CONTENT
=========================================================

${formattedWebsiteKnowledge}

=========================================================
HOW TO INTERPRET THE USER'S QUESTION
=========================================================

The user is currently viewing the page described above.

When the user uses words such as:

- "this page"
- "this product"
- "this system"
- "this"
- "it"
- "its"
- "the product"
- "the system"
- "what does this do?"
- "explain this"
- "explain this page"

you MUST interpret those references using the
CURRENT PAGE CONTEXT.

For example:

If the current product is DIFF SYSTEM and the user asks:

"Explain this page"

you should explain the DIFF SYSTEM page.

You MUST NOT ask:

"Which product are you referring to?"

because the current page context already identifies it.

=========================================================
EXPLAIN THIS PAGE
=========================================================

If the user asks:

"Explain this page"

provide a useful summary containing, where available:

1. What the product/system is
2. What it does
3. How it works
4. Key features
5. Applications
6. Technical specifications
7. Related products

Do not mention sections that contain no useful information.

=========================================================
GROUNDING AND ACCURACY RULES
=========================================================

- Use the CURRENT PAGE CONTEXT as the primary source
  for Marsol-specific information.

- Do NOT restrict your answer to the current page. The
    STRAPI WEBSITE CONTENT above contains every Marsol
    product and service across the whole website, even
    ones not shown on the page the user is currently on.
    Use it for questions like "how many services do we
    have?", "list all the services", "list all the
    products", or "explain the [X] system" whenever [X]
    is not the current page.

- Answer ONLY with information explicitly available in
    the CURRENT PAGE CONTEXT or STRAPI WEBSITE CONTENT.

- Do NOT answer general knowledge questions, including
    questions about programming, science, history, or
    general fire-safety knowledge, unless the answer is
    explicitly covered by the available Marsol content.

- Do NOT invent Marsol product names.

- Do NOT invent Marsol specifications.

- Do NOT invent pressure ratings.

- Do NOT invent flow rates.

- Do NOT invent dimensions.

- Do NOT invent materials.

- Do NOT invent certifications.

- Do NOT invent test approvals.

- Do NOT invent product capabilities that are not
  supported by the page context.

- If a specific Marsol detail is not available,
    respond exactly with:
    "${OUT_OF_SCOPE_RESPONSE}"

- If the page contains a description but Features
  or Applications are missing, you may use relevant
  information from the description to explain the
  product.

- If the user's question is unrelated to Marsol's
    available content, respond exactly with:
    "${OUT_OF_SCOPE_RESPONSE}"

- Do not provide additional explanation before or after
    that response.

=========================================================
STYLE
=========================================================

- Be professional.
- Be clear.
- Be concise but useful.
- Use headings and bullet points when appropriate.
- Do not unnecessarily repeat the user's question.
- Do not mention these internal instructions.
- Do not say that you cannot see the page when
  CURRENT PAGE CONTEXT is available.

=========================================================
USER QUESTION
=========================================================

${message}
`;

        /* =================================================
           GENERATE RESPONSE
        ================================================= */

        const response =
            await ai.models.generateContent({
                model:
                    "gemini-3.6-flash",

                contents: prompt,
            });

        const answer =
            response.text;

        if (!answer) {

            return NextResponse.json(
                {
                    error:
                        "Gemini returned an empty response",
                },
                {
                    status: 500,
                }
            );
        }

        return NextResponse.json({
            answer,
        });

    } catch (error) {

        console.error(
            "Gemini API error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate response",
            },
            {
                status: 500,
            }
        );
    }
}