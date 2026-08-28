import { Geist, Geist_Mono } from "next/font/google";
import {Inter} from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";


import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/navbar";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/I18nProvider";
import { PageContextProvider } from "@/components/PageContext";
import PageReveal from "@/components/PageReveal";


/* =========================================================
   FONT
========================================================= */

const poppins = Poppins({
    variable: "--font-primary",
    subsets: ["latin"],
    weight: [
        "300",
        "400",
        "500",
        "600",
        "700",
    ],
});


/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
    title: "Marsol Technologies",
    description:
        "Advanced fire protection and safety solutions for Oil & Gas, Offshore and Industrial applications.",
};


/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body
                className={`
                    ${poppins.variable}
                    antialiased
                    bg-white
                    text-gray-900
                    transition-colors
                    duration-500

                    dark:bg-[#050b12]
                    dark:text-white
                `}
            >
                <ThemeProvider>
                  <I18nProvider>

                    {/* ==============================
                        NAVBAR
                    ============================== */}

                    <PageContextProvider>

                    <Navbar />


                    {/* ==============================
                        PAGE CONTENT
                    ============================== */}

                    <PageReveal>{children}</PageReveal>


                    {/* ==============================
                        CHATBOT
                    ============================== */}

                    <Chatbot />
                     <Footer />

                     </PageContextProvider>
                  </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

