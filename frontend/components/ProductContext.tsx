"use client";

import { useEffect } from "react";
import { usePageContext } from "./PageContext";

interface ProductContextProps {
    product: any;
}

export default function ProductContext({
    product,
}: ProductContextProps) {
    const { setPageContext } = usePageContext();

    useEffect(() => {
        if (!product) {
            return;
        }

        setPageContext({
            pageType: "product",

            pageTitle:
                product?.Name || "Product",

            url:
                typeof window !== "undefined"
                    ? window.location.pathname
                    : "",

            productName:
                product?.Name || "",

            productDescription:
                product?.description || "",

            productFeatures:
                product?.Features || "",

            productApplications:
                product?.Applications || "",

            technicalSpecifications:
                product?.TechnicalSpecification || [],

            relatedProducts:
                product?.relatedProducts || [],
        });

        return () => {
            setPageContext({});
        };
    }, [product, setPageContext]);

    return null;
}