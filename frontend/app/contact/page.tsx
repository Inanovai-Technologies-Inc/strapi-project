"use client";

import React, { FormEvent, useState } from "react";
import Link from "next/link";

import { useI18n } from "@/components/I18nProvider";
import AmbientBackground from "@/components/AmbientBackground";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface ContactFormData {
    name: string;
    companyName: string;
    companyWebsite: string;
    linkedinProfileUrl: string;
    emailAddress: string;
    phoneNumber: string;
    yourLocation: string;
    subject: string;
    howDidYouHearAboutUs: string;
    yourMessage: string;
    agreedToPolicies: boolean;
}

const initialFormData: ContactFormData = {
    name: "",
    companyName: "",
    companyWebsite: "",
    linkedinProfileUrl: "",
    emailAddress: "",
    phoneNumber: "",
    yourLocation: "",
    subject: "",
    howDidYouHearAboutUs: "",
    yourMessage: "",
    agreedToPolicies: false,
};

function PhoneIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-4 w-4 text-blue-600"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5c0-1.1.9-2 2-2h2.28a1 1 0 0 1 .97.76l1 4a1 1 0 0 1-.5 1.11L7 9.5a12.05 12.05 0 0 0 5.5 5.5l.63-1.75a1 1 0 0 1 1.11-.5l4 1a1 1 0 0 1 .76.97V19c0 1.1-.9 2-2 2h-1C10.4 21 3 13.6 3 4V5Z"
            />
        </svg>
    );
}

export default function ContactPage() {
    const { t } = useI18n();
    const [formData, setFormData] =
        useState<ContactFormData>(initialFormData);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [consentError, setConsentError] = useState(false);

    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConsentChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            agreedToPolicies: checked,
        }));

        if (checked) {
            setConsentError(false);
        }
    };

    // =========================================================
    // SUBMIT FORM
    // =========================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        if (!formData.agreedToPolicies) {
            setConsentError(true);
            return;
        }

        setConsentError(false);
        setLoading(true);

        try {
            // =====================================================
            // VALIDATION
            // =====================================================

            if (!formData.name.trim()) {
                throw new Error(t("contact.validation.name"));
            }

            if (!formData.emailAddress.trim()) {
                throw new Error(
                    t("contact.validation.email")
                );
            }

            if (!formData.yourLocation) {
                throw new Error(
                    t("contact.validation.location")
                );
            }

            if (!formData.subject) {
                throw new Error(
                    t("contact.validation.subject")
                );
            }

            // =====================================================
            // DATA FOR STRAPI
            // =====================================================

            const contactData = {
                data: {
                    name: formData.name.trim(),

                    companyName:
                        formData.companyName.trim(),

                    companyWebsite:
                        formData.companyWebsite.trim(),

                    linkedinProfileUrl:
                        formData.linkedinProfileUrl.trim(),

                    emailAddress:
                        formData.emailAddress.trim(),

                    phoneNumber:
                        formData.phoneNumber.trim(),

                    yourLocation:
                        formData.yourLocation,

                    subject:
                        formData.subject,

                    howDidYouHearAboutUs:
                        formData.howDidYouHearAboutUs,

                    yourMessage:
                        formData.yourMessage.trim(),
                },
            };

            console.log(
                "Data being sent to Strapi:",
                contactData
            );

            // =====================================================
            // SEND TO STRAPI
            // =====================================================

            const response = await fetch(
                `${STRAPI_URL}/api/contacts`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        contactData
                    ),
                }
            );

            // =====================================================
            // READ RESPONSE
            // =====================================================

            const responseText =
                await response.text();

            console.log(
                "Strapi status:",
                response.status
            );

            console.log(
                "Strapi response:",
                responseText
            );

            // =====================================================
            // ERROR
            // =====================================================

            if (!response.ok) {
                let errorMessage =
                    t("contact.validation.generic");

                try {
                    const errorData =
                        JSON.parse(responseText);

                    console.error(
                        "Strapi error:",
                        errorData
                    );

                    errorMessage =
                        errorData?.error?.message ||
                        errorMessage;

                    // Show field-specific validation errors
                    if (
                        errorData?.error?.details
                            ?.errors
                    ) {
                        const validationErrors =
                            errorData.error.details.errors;

                        const messages =
                            validationErrors.map(
                                (item: {
                                    path?: string[];
                                    message?: string;
                                }) => {
                                    const field =
                                        item.path?.join(
                                            "."
                                        ) ||
                                        "Field";

                                    return `${field}: ${
                                        item.message ||
                                        "Invalid value"
                                    }`;
                                }
                            );

                        if (
                            messages.length > 0
                        ) {
                            errorMessage =
                                messages.join(
                                    "\n"
                                );
                        }
                    }
                } catch {
                    console.error(
                        "Strapi returned:",
                        responseText
                    );

                    if (responseText) {
                        errorMessage =
                            responseText;
                    }
                }

                throw new Error(
                    errorMessage
                );
            }

            // =====================================================
            // SUCCESS
            // =====================================================

            console.log(
                "Contact successfully saved in Strapi."
            );

            setSuccess(
                t("contact.success")
            );

            setFormData(
                initialFormData
            );

        } catch (err) {
            console.error(
                "Contact form error:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : t("contact.validation.unknown")
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <main className="min-h-screen bg-white">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-white py-16">
                <AmbientBackground density="soft" />
                <div className="mx-auto max-w-7xl px-6 text-center">

                    <h1 className="text-4xl font-bold text-[#0b1f3a]">
                        {t("contact.title")}
                    </h1>

                    <p className="mx-auto mt-4 text-gray-500 lg:whitespace-nowrap">
                        {t("contact.description")}
                    </p>

                </div>
            </section>

            {/* =================================================
                FORM
            ================================================= */}

            <section className="py-14">

                <div className="mx-auto max-w-6xl px-6">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >

                        {/* =================================================
                            NAME + COMPANY
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.name")} *
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.name")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="companyName"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.companyName")}
                                </label>

                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    value={
                                        formData.companyName
                                    }
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.companyName")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                        </div>

                        {/* =================================================
                            WEBSITE + LINKEDIN
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="companyWebsite"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.companyWebsite")}
                                </label>

                                <input
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="text"
                                    value={
                                        formData.companyWebsite
                                    }
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.companyWebsite")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="linkedinProfileUrl"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.linkedinUrl")}
                                </label>

                                <input
                                    id="linkedinProfileUrl"
                                    name="linkedinProfileUrl"
                                    type="text"
                                    value={
                                        formData.linkedinProfileUrl
                                    }
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.linkedinUrl")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                        </div>

                        {/* =================================================
                            EMAIL + PHONE
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="emailAddress"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.email")} *
                                </label>

                                <input
                                    id="emailAddress"
                                    name="emailAddress"
                                    type="email"
                                    required
                                    value={
                                        formData.emailAddress
                                    }
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.email")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phoneNumber"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    {t("contact.form.phone")}
                                </label>

                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={handleChange}
                                    placeholder={t("contact.placeholders.phone")}
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                        </div>

                        {/* =================================================
                            LOCATION
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="yourLocation"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t("contact.form.location")} *
                            </label>

                            <select
                                id="yourLocation"
                                name="yourLocation"
                                required
                                value={
                                    formData.yourLocation
                                }
                                onChange={handleChange}
                                className="w-full appearance-none border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                            >
                                <option value="">
                                    {t("contact.select.location")}
                                </option>

                                <option value="Asia">
                                    {t("contact.locations.asia")}
                                </option>

                                <option value="Australasia">
                                    {t("contact.locations.australasia")}
                                </option>

                                <option value="Europe">
                                    {t("contact.locations.europe")}
                                </option>

                                <option value="India">
                                    {t("contact.locations.india")}
                                </option>

                                <option value="Middle East and Africa">
                                    {t("contact.locations.mea")}
                                </option>

                                <option value="North America">
                                    {t("contact.locations.northAmerica")}
                                </option>

                                <option value="South America">
                                    {t("contact.locations.southAmerica")}
                                </option>

                            </select>

                        </div>

                        {/* =================================================
                            SUBJECT
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="subject"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t("contact.form.subject")} *
                            </label>

                            <select
                                id="subject"
                                name="subject"
                                required
                                value={
                                    formData.subject
                                }
                                onChange={handleChange}
                                className="w-full appearance-none border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                            >
                                <option value="">
                                    {t("contact.select.subject")}
                                </option>

                                <option value="General Request">
                                    {t("contact.subjects.general")}
                                </option>

                                <option value="Technical Request">
                                    {t("contact.subjects.technical")}
                                </option>

                                <option value="Other">
                                    {t("contact.subjects.other")}
                                </option>

                            </select>

                        </div>

                        {/* =================================================
                            HOW DID YOU HEAR
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="howDidYouHearAboutUs"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t("contact.form.howHeard")}
                            </label>

                            <select
                                id="howDidYouHearAboutUs"
                                name="howDidYouHearAboutUs"
                                value={
                                    formData.howDidYouHearAboutUs
                                }
                                onChange={handleChange}
                                className="w-full appearance-none border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                            >
                                <option value="">
                                    {t("contact.select.option")}
                                </option>

                                <option value="Friend, Colleague">
                                    {t("contact.howHeardOptions.friend")}
                                </option>

                                <option value="Search Engine (Bing etc.)">
                                    {t("contact.howHeardOptions.searchEngine")}
                                </option>

                                <option value="Print">
                                    {t("contact.howHeardOptions.print")}
                                </option>

                                <option value="Exhibition">
                                    {t("contact.howHeardOptions.exhibition")}
                                </option>

                                <option value="Other Channel">
                                    {t("contact.howHeardOptions.otherChannel")}
                                </option>

                            </select>

                        </div>

                        {/* =================================================
                            MESSAGE
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="yourMessage"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                {t("contact.form.message")}
                            </label>

                            <textarea
                                id="yourMessage"
                                name="yourMessage"
                                rows={6}
                                value={
                                    formData.yourMessage
                                }
                                onChange={handleChange}
                                placeholder={t("contact.placeholders.message")}
                                className="w-full resize-none border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                            />

                        </div>

                        {/* =================================================
                            DISCLAIMER
                        ================================================= */}

                        <p className="font-semibold text-gray-900">
                            {t("contact.disclaimer")}
                        </p>

                        {/* =================================================
                            POLICY CONSENT
                        ================================================= */}

                        <div>

                            <label className="flex items-start gap-3">

                                <input
                                    type="checkbox"
                                    name="agreedToPolicies"
                                    checked={formData.agreedToPolicies}
                                    onChange={handleConsentChange}
                                    className="mt-1 h-4 w-4 shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500"
                                />

                                <span className="text-sm uppercase tracking-wide text-gray-800">
                                    I confirm that I have read and understood
                                    Marsol Technologies{" "}
                                    <Link
                                        href="/privacy-policy"
                                        className="underline hover:text-blue-600"
                                    >
                                        Privacy Policy
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/terms-conditions"
                                        className="underline hover:text-blue-600"
                                    >
                                        Terms and Conditions
                                    </Link>
                                    *
                                </span>

                            </label>

                            {consentError && (
                                <p className="mt-2 text-sm text-red-600">
                                    I confirm that I have read and
                                    understood Marsol Technologies Privacy
                                    Policy and Terms and Conditions* is
                                    required
                                </p>
                            )}

                        </div>

                        {/* =================================================
                            SUCCESS
                        ================================================= */}

                        {success && (
                            <div className="border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                                {success}
                            </div>
                        )}

                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (
                            <div className="whitespace-pre-line border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                {error}
                            </div>
                        )}

                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        <div className="flex justify-center">

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-10 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? t("contact.form.submitting")
                                    : t("contact.form.submit")}
                            </button>

                        </div>

                    </form>

                </div>

            </section>

            {/* =================================================
                OFFICES
            ================================================= */}

            <section className="border-t border-gray-200 bg-white py-14">

                <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-3">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                            North America / HQ
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                            United States
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Marsol Technologies Inc.
                            <br />
                            14331 Spencer Road (FM-529),
                            <br />
                            Houston, Texas-77095, USA.
                        </p>

                        <p className="mt-4 flex items-center gap-2 text-sm text-gray-800">
                            <PhoneIcon />
                            Phone: +1-346-701-8268
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Middle East Hub
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                            United Arab Emirates
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Marsol Technologies FZE.
                            <br />
                            P.O Box 50481,
                            <br />
                            Hamriyah Free Zone, Sharjah, UAE.
                        </p>

                        <p className="mt-4 flex items-center gap-2 text-sm text-gray-800">
                            <PhoneIcon />
                            Phone: +971-(0)6-526-9350
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Asia Pacific Center
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                            India
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Marsol Technologies Pvt. Ltd.
                            <br />
                            No. 2877/14, New No. K-13, Second Floor,
                            <br />
                            J.L.B Road, Chamundipuram, K.R. Mohalla,
                            <br />
                            Mysore, Karnataka, 570 004.
                        </p>

                        <p className="mt-4 flex items-center gap-2 text-sm text-gray-800">
                            <PhoneIcon />
                            Phone: +91-(0)821-422-1225
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}