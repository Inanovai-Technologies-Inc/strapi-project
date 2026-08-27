"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { usePageContext } from "./PageContext";

type Message = {
    role: "user" | "assistant";
    content: string;
};

/* =========================================================
   MARKDOWN RENDERING FOR ASSISTANT MESSAGES

   Maps Markdown elements to Tailwind-styled tags so the
   assistant's replies render like a formatted response
   instead of showing raw "###", "**", "*", "---" symbols.
========================================================= */

/* `node` is destructured out of every renderer so it is not spread onto the
   DOM element (react-markdown's documented pattern); it is intentionally unused. */
/* eslint-disable @typescript-eslint/no-unused-vars */
const markdownComponents: Components = {
    h1: ({ node, ...props }) => (
        <h1 className="mb-1 mt-3 text-base font-bold first:mt-0" {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 className="mb-1 mt-3 text-[15px] font-bold first:mt-0" {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 className="mb-1 mt-3 text-sm font-bold first:mt-0" {...props} />
    ),
    h4: ({ node, ...props }) => (
        <h4 className="mb-1 mt-3 text-sm font-semibold first:mt-0" {...props} />
    ),
    p: ({ node, ...props }) => (
        <p className="mb-2 whitespace-pre-wrap last:mb-0" {...props} />
    ),
    ul: ({ node, ...props }) => (
        <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0" {...props} />
    ),
    ol: ({ node, ...props }) => (
        <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0" {...props} />
    ),
    li: ({ node, ...props }) => <li className="leading-6" {...props} />,
    a: ({ node, ...props }) => (
        <a
            className="font-medium text-orange-600 underline underline-offset-2 hover:text-orange-700"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
        />
    ),
    strong: ({ node, ...props }) => (
        <strong className="font-semibold" {...props} />
    ),
    em: ({ node, ...props }) => <em className="italic" {...props} />,
    hr: ({ node, ...props }) => (
        <hr className="my-3 border-gray-200" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote
            className="my-2 border-l-2 border-gray-300 pl-3 italic text-gray-500"
            {...props}
        />
    ),
    pre: ({ node, ...props }) => (
        <pre
            className="my-2 overflow-x-auto rounded-lg bg-gray-900 p-3 font-mono text-[12px] leading-5 text-gray-100 last:my-0"
            {...props}
        />
    ),
    code: ({ node, className, children, ...props }) => {
        const text = String(children ?? "");
        const isBlock =
            text.includes("\n") || /^language-/.test(className ?? "");

        if (isBlock) {
            return (
                <code className={`block ${className ?? ""}`} {...props}>
                    {children}
                </code>
            );
        }

        return (
            <code
                className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800"
                {...props}
            >
                {children}
            </code>
        );
    },
};
/* eslint-enable @typescript-eslint/no-unused-vars */

export default function Chatbot() {
    const { pageContext } = usePageContext();

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hello! I'm the Marsol Assistant. How can I help you with our products and website?",
        },
    ]);

    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage || loading) {
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: trimmedMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: trimmedMessage,

                    /*
                     * Send the current page/product context
                     * to the Gemini API.
                     */
                    pageContext: {
                        ...pageContext,
                        url:
                            typeof window !== "undefined"
                                ? window.location.href
                                : pageContext.url,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to get response"
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        data.answer ||
                        "Sorry, I could not generate an answer.",
                },
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't connect to the assistant. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* =================================================
                FLOATING CHAT BUTTON
            ================================================= */}

            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-orange-600"
                    aria-label="Open Marsol Assistant"
                >
                    <span className="text-2xl">
                        💬
                    </span>
                </button>
            )}

            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            {isOpen && (
                <div className="fixed bottom-6 right-6 z-[9999] flex h-[600px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-center justify-between bg-[#0b1f3a] px-5 py-4 text-white">

                        <div>
                            <h2 className="font-semibold">
                                Marsol Assistant
                            </h2>

                            <p className="text-xs text-gray-300">
                                Website Product Assistant
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsOpen(false)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xl transition hover:bg-white/10"
                            aria-label="Close chatbot"
                        >
                            ×
                        </button>

                    </div>

                    {/* =================================================
                        CURRENT PAGE INDICATOR
                    ================================================= */}

                    {pageContext?.pageType === "product" &&
                        pageContext?.productName && (
                            <div className="border-b border-gray-200 bg-white px-4 py-2">

                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Currently viewing
                                </p>

                                <p className="mt-0.5 truncate text-xs font-semibold text-[#0b1f3a]">
                                    {pageContext.productName}
                                </p>

                            </div>
                        )}

                    {/* =================================================
                        MESSAGES
                    ================================================= */}

                    <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">

                        {messages.map(
                            (msg, index) => (
                                <div
                                    key={`${msg.role}-${index}`}
                                    className={`flex ${
                                        msg.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >

                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                            msg.role === "user"
                                                ? "rounded-br-sm bg-orange-500 text-white"
                                                : "rounded-bl-sm border border-gray-200 bg-white text-gray-700"
                                        }`}
                                    >
                                        {msg.role === "assistant" ? (
                                            <div className="break-words">
                                                <ReactMarkdown
                                                    components={
                                                        markdownComponents
                                                    }
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            msg.content
                                        )}
                                    </div>

                                </div>
                            )
                        )}

                        {loading && (
                            <div className="flex justify-start">

                                <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
                                    Thinking...
                                </div>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div className="border-t border-gray-200 bg-white p-3">

                        <div className="flex items-center gap-2">

                            <input
                                type="text"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        sendMessage();
                                    }
                                }}
                                placeholder={
                                    pageContext?.pageType ===
                                        "product"
                                        ? "Ask about this product..."
                                        : "Ask about our website..."
                                }
                                disabled={loading}
                                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
                            />

                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={
                                    loading ||
                                    !message.trim()
                                }
                                className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Send
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}