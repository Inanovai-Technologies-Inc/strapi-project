"use client";

import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useI18n } from "@/components/I18nProvider";

/* =========================================================
   FIX LEAFLET DEFAULT MARKER ICONS

   Leaflet resolves its default marker PNGs relative to the
   stylesheet at runtime, which breaks under the Next.js
   bundler and shows broken/missing marker images. Re-point
   the default icon at the images shipped in the `leaflet`
   package so the standard pin (with shadow) renders and
   stays anchored correctly on zoom/resize.
========================================================= */

const resolveAssetUrl = (asset: unknown): string =>
    typeof asset === "string"
        ? asset
        : (asset as { src: string }).src;

delete (
    L.Icon.Default.prototype as unknown as {
        _getIconUrl?: unknown;
    }
)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: resolveAssetUrl(markerIcon2x),
    iconUrl: resolveAssetUrl(markerIcon),
    shadowUrl: resolveAssetUrl(markerShadow),
});

interface Office {
    id: number;
    name?: string;
    country?: string;
    city?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    fax?: string;
    email?: string;
    services?: string[];
}

export interface OfficeMapProps {
    offices: Office[];
}

function MapController({ offices }: OfficeMapProps) {
    const map = useMap();

    useEffect(() => {
        const validOffices = offices.filter(
            (office) =>
                typeof office.latitude === "number" &&
                typeof office.longitude === "number"
        );

        if (validOffices.length === 0) return;

        const latitudes = validOffices.map(
            (office) => office.latitude!
        );

        const longitudes = validOffices.map(
            (office) => office.longitude!
        );

        const southWest: [number, number] = [
            Math.min(...latitudes),
            Math.min(...longitudes),
        ];

        const northEast: [number, number] = [
            Math.max(...latitudes),
            Math.max(...longitudes),
        ];

        map.fitBounds([southWest, northEast], {
            padding: [50, 50],
        });
    }, [offices, map]);

    return null;
}

export default function OfficeMapClient({
    offices,
}: OfficeMapProps) {
    const { t } = useI18n();
    const [selectedOffice, setSelectedOffice] =
        useState<Office | null>(offices[0] || null);

    const validOffices = offices.filter(
        (office) =>
            typeof office.latitude === "number" &&
            typeof office.longitude === "number"
    );

    if (validOffices.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-2xl bg-gray-100">
                <p className="text-gray-500">
                    {t("officeMap.noLocations")}
                </p>
            </div>
        );
    }

    return (
        <div className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white lg:grid-cols-[1fr_360px]">

            {/* MAP */}
            <div className="h-[500px] w-full">
                <MapContainer
                    center={[20, 20]}
                    zoom={2}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapController offices={validOffices} />

                    {validOffices.map((office) => (
                        <Marker
                            key={office.id}
                            position={[
                                office.latitude!,
                                office.longitude!,
                            ]}
                            eventHandlers={{
                                click: () =>
                                    setSelectedOffice(office),
                            }}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-semibold">
                                        {office.name}
                                    </h3>

                                    <p className="text-sm text-gray-600">
                                        {office.city},{" "}
                                        {office.country}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* OFFICE INFORMATION */}
            <div className="border-t border-gray-200 p-6 lg:border-l lg:border-t-0">
                {selectedOffice && (
                    <>
                        <p className="text-sm uppercase tracking-wider text-gray-500">
                            {selectedOffice.country}
                        </p>

                        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                            {selectedOffice.name}
                        </h3>

                        <p className="mt-2 font-medium text-gray-700">
                            {selectedOffice.city}
                        </p>

                        {selectedOffice.address && (
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                                {selectedOffice.address}
                            </p>
                        )}

                        {selectedOffice.services &&
                            selectedOffice.services.length > 0 && (
                                <div className="mt-6">
                                    <p className="mb-3 font-semibold text-gray-900">
                                        {t("officeMap.services")}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedOffice.services.map(
                                            (service) => (
                                                <span
                                                    key={service}
                                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                                >
                                                    {service}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        <div className="mt-6 space-y-2 text-sm text-gray-700">
                            {selectedOffice.phone && (
                                <p>
                                    <strong>{t("officeMap.phone")}</strong>{" "}
                                    {selectedOffice.phone}
                                </p>
                            )}

                            {selectedOffice.fax && (
                                <p>
                                    <strong>{t("officeMap.fax")}</strong>{" "}
                                    {selectedOffice.fax}
                                </p>
                            )}

                            {selectedOffice.email && (
                                <p>
                                    <strong>{t("officeMap.email")}</strong>{" "}
                                    {selectedOffice.email}
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
