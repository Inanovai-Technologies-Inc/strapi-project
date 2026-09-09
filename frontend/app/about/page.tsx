"use client";

import React from "react";
import Image from "next/image";

import { useI18n } from "@/components/I18nProvider";
import AmbientBackground from "@/components/AmbientBackground";

/* Core values — icon per value, copy pulled from about.values.* */
const VALUE_ICON_PROPS = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-6 w-6",
};

const VALUES: { key: string; icon: React.ReactNode }[] = [
    {
        key: "accountability",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="m16 11 2 2 4-4" />
            </svg>
        ),
    },
    {
        key: "integrity",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                <path d="m21 3 1 11h-2" />
                <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                <path d="M3 4h8" />
            </svg>
        ),
    },
    {
        key: "passion",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
        ),
    },
    {
        key: "quality",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        key: "sustainability",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                <path d="m14 16-3 3 3 3" />
                <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
                <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
                <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
            </svg>
        ),
    },
    {
        key: "innovation",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
            </svg>
        ),
    },
];

export default function About() {
    const { t } = useI18n();

    return (
        <main className="min-h-screen bg-gray-50 text-gray-800">

            {/* Hero */}
            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-white">
                <AmbientBackground density="soft" />
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                        {t("about.hero.eyebrow")}
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-[#0b1f3a] md:text-5xl">
                        {t("about.hero.title")}
                    </h1>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:p-10">
                        <p className="text-justify text-base leading-8 text-gray-600 lg:text-lg">
                            {t("about.hero.description1")}
                        </p>

                        <p className="mt-5 text-justify text-base leading-8 text-gray-600 lg:text-lg">
                            {t("about.hero.description2")}
                        </p>
                    </div>

                </div>
            </section>


            {/* Core Values */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {VALUES.map((value) => (
                        <div
                            key={value.key}
                            className="group rounded-xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-md"
                        >
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white">
                                {value.icon}
                            </span>

                            <h2 className="mt-5 text-xl font-bold text-[#0b1f3a]">
                                {t(`about.values.${value.key}Title`)}
                            </h2>

                            <p className="mt-3 text-justify text-sm leading-7 text-gray-600">
                                {t(`about.values.${value.key}Body`)}
                            </p>
                        </div>
                    ))}

                </div>

            </section>


            {/* Since 2015 */}
            <section className="has-ambient relative overflow-hidden bg-[#0b1f3a]">
                <AmbientBackground tone="navy" />
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="grid gap-10 md:grid-cols-[220px_1fr]">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                                {t("about.since.label")}
                            </p>

                            <p className="mt-2 text-6xl font-bold text-white">
                                2015
                            </p>
                        </div>

                        <div className="space-y-5 text-gray-300">

                            <p className="leading-8">
                                {t("about.since.p1")}
                            </p>

                            <p className="leading-8">
                                {t("about.since.p2Prefix")}
                                <strong className="text-white">
                                    {t("about.since.p2Safety")}
                                </strong>
                            </p>

                            <p className="leading-8">
                                {t("about.since.p3")}
                            </p>

                        </div>

                    </div>

                </div>
            </section>


            {/* QHSE */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:p-10">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                        {t("about.qhse.eyebrow")}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">
                        {t("about.qhse.title")}
                    </h2>

                    <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">

                        <div className="space-y-4 text-justify text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                            <p>{t("about.qhse.p1")}</p>
                            <p>{t("about.qhse.p2")}</p>
                            <p>{t("about.qhse.p3")}</p>
                            <p>{t("about.qhse.p4")}</p>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                            <Image
                                src="/images/IMS.png"
                                alt="Integrated Management System — ISO 9001, ISO 14001 and ISO 45001 accreditations"
                                width={587}
                                height={529}
                                className="h-auto w-full max-w-[280px] object-contain lg:max-w-none"
                            />
                        </div>

                    </div>

                </div>

            </section>


            {/* Policies */}
            <section className="border-y border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                        {t("about.policies.eyebrow")}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                        {t("about.policies.title")}
                    </h2>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                {t("about.policies.hseTitle")}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {t("about.policies.hseDesc")}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                {t("about.policies.qualityTitle")}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {t("about.policies.qualityDesc")}
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                {t("about.policies.adcTitle")}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {t("about.policies.adcDesc")}
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* Global Offices */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                    {t("about.locations.eyebrow")}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                    {t("about.locations.title")}
                </h2>

                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-[#0b1f3a]">
                            Marsol Technologies, Inc.
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            14331 Spencer Road (FM-529),
                            <br />
                            Houston, Texas-77095, USA
                            <br />
                            Phone: +1-346-701-8268
                            <br />
                            Fax: +1-346-701-8261
                        </p>
                    </div>


                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-[#0b1f3a]">
                            Marsol Technologies, FZE.
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            P.O Box 50481,
                            <br />
                            Hamriyah Free Zone, Sharjah, UAE
                            <br />
                            Phone: +971-6-5269350
                            <br />
                            Fax: +971-6-5269340
                        </p>
                    </div>


                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-[#0b1f3a]">
                            Marsol Technologies Pvt. Ltd.
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            No. 2877/14, New No. K-13, Second Floor
                            <br />
                            J.L.B Road, Chamundipuram, K.R. Mohalla,
                            <br />
                            Mysore, Karnataka, 570 004
                        </p>
                    </div>

                </div>

                <div className="mt-8 rounded-xl bg-[#0b1f3a] p-7 text-center">
                    <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
                        {t("about.locations.email")}
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                        info@marsoltech.com
                    </p>
                </div>

            </section>

        </main>
    );
}
