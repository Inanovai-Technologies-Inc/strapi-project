import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getWebsiteKnowledge } from "@/lib/websiteKnowledge";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get website content from Strapi
    const products = await getWebsiteKnowledge();

    // Convert Strapi product data into text
    const websiteContext = products
      .map((product: any) => {
        return `
Product Name:
${product.Name || "Not available"}

Description:
${JSON.stringify(product.description || "Not available")}

Features:
${JSON.stringify(product.Features || "Not available")}

Applications:
${JSON.stringify(product.Applications || "Not available")}

Video Title:
${product.VideoTitle || "Not available"}

Video URL:
${product.VideoURL || "Not available"}

Slug:
${product.slug || "Not available"}
        `;
      })
      .join("\n-----------------------------\n");

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: `
You are the official website assistant.

Your job is to answer questions about this website.

IMPORTANT RULES:

1. Answer ONLY using the website information provided below.
2. Do not invent information.
3. Do not make up product specifications.
4. Do not make up prices.
5. Do not make up applications.
6. Do not make up company information.
7. If the answer cannot be found in the website information, say:
   "I couldn't find that information on our website."
8. Keep answers concise and professional.
9. If the user asks about a product, provide the relevant product information available.
10. Do not answer unrelated general knowledge questions as if they are website information.

WEBSITE INFORMATION:

${websiteContext}
          `,
        },

        {
          role: "user",
          content: message,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate an answer.";

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    return NextResponse.json(
      {
        error: "Failed to process chatbot request",
      },
      {
        status: 500,
      }
    );
  }
}