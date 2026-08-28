"use client";

import dynamic from "next/dynamic";

import type { OfficeMapProps } from "@/components/OfficeMapClient";

/* =========================================================
   CLIENT-ONLY MAP WRAPPER

   Leaflet / react-leaflet touch `window` at module load, so
   the real map implementation must never be evaluated on the
   server. This wrapper is a Client Component, which lets us
   load `OfficeMapClient` with `ssr: false` and keeps the map,
   markers, popups and office panel exactly as before.
========================================================= */

const OfficeMapClient = dynamic(
    () => import("@/components/OfficeMapClient"),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-[500px] items-center justify-center rounded-2xl bg-gray-100" />
        ),
    }
);

export default function OfficeMap(props: OfficeMapProps) {
    return <OfficeMapClient {...props} />;
}
