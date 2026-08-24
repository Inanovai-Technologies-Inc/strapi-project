import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        // Check API key first
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");

            return NextResponse.json(
                {
                    error: "GEMINI_API_KEY is not configured",
                },
                { status: 500 }
            );
        }

        const body = await req.json();
        const message = body?.message;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                {
                    error: "Message is required",
                },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `
You are the Marsol Technical Assistant.

Marsol provides fire protection and fire safety solutions.

Your job is to help website visitors understand Marsol's products,
applications, and technical information.

Answer clearly, professionally, and concisely.

IMPORTANT RULES:
- Do not invent Marsol product names.
- Do not invent Marsol product specifications.
- Do not invent certifications, pressure ratings, dimensions,
  flow rates, materials, or other technical specifications.
- If the user asks for Marsol-specific information that you do not
  have, clearly say that the information is not currently available.
- You may answer general fire-safety questions using your general
  knowledge.
- Product information from Strapi will be connected later.

User question:
${message}
            `,
        });

        const answer = response.text;

        if (!answer) {
            return NextResponse.json(
                {
                    error: "Gemini returned an empty response",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            answer: answer,
        });
    } catch (error) {
        console.error("Gemini API error:", error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate response",
            },
            { status: 500 }
        );
    }
}