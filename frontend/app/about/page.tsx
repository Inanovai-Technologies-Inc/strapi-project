"use client";

import React from "react";

import { useI18n } from "@/components/I18nProvider";
import AmbientBackground from "@/components/AmbientBackground";

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

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                        {t("about.hero.description")}
                    </p>

                </div>
            </section>


            {/* Why Work With Us */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="grid gap-6 md:grid-cols-3">

                    <div className="rounded-xl border border-gray-200 bg-white p-7">
                        <div className="mb-5 h-1 w-10 bg-orange-500" />

                        <h2 className="text-xl font-bold text-[#0b1f3a]">
                            {t("about.why.card1Title")}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            {t("about.why.card1Body")}
                        </p>
                    </div>


                    <div className="rounded-xl border border-gray-200 bg-white p-7">
                        <div className="mb-5 h-1 w-10 bg-orange-500" />

                        <h2 className="text-xl font-bold text-[#0b1f3a]">
                            {t("about.why.card2Title")}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            {t("about.why.card2Body")}
                        </p>
                    </div>


                    <div className="rounded-xl border border-gray-200 bg-white p-7">
                        <div className="mb-5 h-1 w-10 bg-orange-500" />

                        <h2 className="text-xl font-bold text-[#0b1f3a]">
                            {t("about.why.card3Title")}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            {t("about.why.card3Body")}
                        </p>
                    </div>

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


            {/* Associations / QHSE */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="grid gap-12 md:grid-cols-2">

                    {/* Associations */}
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                            {t("about.associations.eyebrow")}
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                            {t("about.associations.title")}
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            {t("about.associations.body")}
                        </p>
                    </div>


                    {/* QHSE */}
                    <div className="rounded-xl border border-gray-200 bg-white p-7">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                            {t("about.qhse.eyebrow")}
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a]">
                            {t("about.qhse.title")}
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            {t("about.qhse.philosophyIntro")}
                            <span className="font-semibold text-gray-800">
                                {" "}{t("about.qhse.philosophyQuote")}
                            </span>
                        </p>

                        <p className="mt-4 leading-7 text-gray-600">
                            {t("about.qhse.body2")}
                        </p>

                        <p className="mt-4 leading-7 text-gray-600">
                            {t("about.qhse.body3")}
                        </p>

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
                            Marsol Engineering (India) Pvt. Ltd.
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Akshatha Enclave, Kuvempunagar,
                            <br />
                            Mysore, 570023
                            <br />
                            Karnataka, India
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


            {/* Latest News */}
            <section className="bg-gray-100">

                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                                {t("about.news.eyebrow")}
                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                                {t("about.news.title")}
                            </h2>
                        </div>
                    </div>


                    <div className="mt-8 grid gap-6 md:grid-cols-2">

                        <article className="rounded-xl bg-white p-7 shadow-sm">

                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                                {t("about.news.card1Badge")}
                            </p>

                            <h3 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                                {t("about.news.card1Title")}
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-gray-600">
                                {t("about.news.card1Body")}
                            </p>

                            <a
                                href="/news"
                                className="mt-5 inline-block text-sm font-bold text-orange-500 hover:text-orange-600"
                            >
                                {t("about.news.readMore")} →
                            </a>

                        </article>


                        <article className="rounded-xl bg-white p-7 shadow-sm">

                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                                {t("about.news.card2Badge")}
                            </p>

                            <h3 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                                {t("about.news.card2Title")}
                            </h3>

                            <p className="mt-4 text-sm leading-7 text-gray-600">
                                {t("about.news.card2Body")}
                            </p>

                            <a
                                href="/news"
                                className="mt-5 inline-block text-sm font-bold text-orange-500 hover:text-orange-600"
                            >
                                {t("about.news.readMore")} →
                            </a>

                        </article>

                    </div>

                </div>

            </section>

        </main>
    );
}
