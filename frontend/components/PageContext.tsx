"use client";

import React, {
    createContext,
    useContext,
    useState,
} from "react";

export interface PageContextData {
    pageType?: string;
    pageTitle?: string;
    url?: string;

    productName?: string;
    productDescription?: string;
    productFeatures?: string;
    productApplications?: string;
    technicalSpecifications?: any;
    relatedProducts?: any[];

    [key: string]: any;
}

interface PageContextType {
    pageContext: PageContextData;
    setPageContext: (
        context: PageContextData
    ) => void;
}

const PageContext =
    createContext<PageContextType | undefined>(
        undefined
    );

export function PageContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [pageContext, setPageContext] =
        useState<PageContextData>({});

    return (
        <PageContext.Provider
            value={{
                pageContext,
                setPageContext,
            }}
        >
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    const context = useContext(PageContext);

    if (!context) {
        throw new Error(
            "usePageContext must be used inside PageContextProvider"
        );
    }

    return context;
}