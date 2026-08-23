"use client";

import React, { FormEvent, useState } from "react";

const STRAPI_URL = "http://localhost:1337";

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
};

export default function ContactPage() {
    const [formData, setFormData] =
        useState<ContactFormData>(initialFormData);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

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

    // =========================================================
    // SUBMIT FORM
    // =========================================================

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            // =====================================================
            // VALIDATION
            // =====================================================

            if (!formData.name.trim()) {
                throw new Error("Please enter your name.");
            }

            if (!formData.emailAddress.trim()) {
                throw new Error(
                    "Please enter your email address."
                );
            }

            if (!formData.yourLocation) {
                throw new Error(
                    "Please select your location."
                );
            }

            if (!formData.subject) {
                throw new Error(
                    "Please select a subject."
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
                    "Failed to submit contact form.";

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
                "Thank you for contacting us. We will get back to you soon."
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
                    : "Something went wrong while submitting the form."
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

            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-7xl px-6 text-center">

                    <h1 className="text-4xl font-bold text-gray-900">
                        Contact Us
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Have a question or need technical
                        assistance? Get in touch with our team.
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
                                    Name *
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="companyName"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Company Name
                                </label>

                                <input
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    value={
                                        formData.companyName
                                    }
                                    onChange={handleChange}
                                    placeholder="Company Name"
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
                                    Company Website
                                </label>

                                <input
                                    id="companyWebsite"
                                    name="companyWebsite"
                                    type="text"
                                    value={
                                        formData.companyWebsite
                                    }
                                    onChange={handleChange}
                                    placeholder="Company Website"
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="linkedinProfileUrl"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    LinkedIn Profile URL
                                </label>

                                <input
                                    id="linkedinProfileUrl"
                                    name="linkedinProfileUrl"
                                    type="text"
                                    value={
                                        formData.linkedinProfileUrl
                                    }
                                    onChange={handleChange}
                                    placeholder="LinkedIn Profile URL"
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
                                    Email Address *
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
                                    placeholder="Email Address"
                                    className="w-full border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phoneNumber"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    value={
                                        formData.phoneNumber
                                    }
                                    onChange={handleChange}
                                    placeholder="Phone Number"
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
                                Your Location *
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
                                    Select Your Location
                                </option>

                                <option value="Asia">
                                    Asia
                                </option>

                                <option value="Australasia">
                                    Australasia
                                </option>

                                <option value="Europe">
                                    Europe
                                </option>

                                <option value="India">
                                    India
                                </option>

                                <option value="Middle East and Africa">
                                    Middle East and Africa
                                </option>

                                <option value="North America">
                                    North America
                                </option>

                                <option value="South America">
                                    South America
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
                                Subject *
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
                                    Select Subject
                                </option>

                                <option value="General Request">
                                    General Request
                                </option>

                                <option value="Technical Request">
                                    Technical Request
                                </option>

                                <option value="Other">
                                    Other
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
                                How did you hear about us?
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
                                    Select an option
                                </option>

                                <option value="Friend, Colleague">
                                    Friend, Colleague
                                </option>

                                <option value="Search Engine (Bing etc.)">
                                    Search Engine (Bing etc.)
                                </option>

                                <option value="Print">
                                    Print
                                </option>

                                <option value="Exhibition">
                                    Exhibition
                                </option>

                                <option value="Other Channel">
                                    Other Channel
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
                                Your Message
                            </label>

                            <textarea
                                id="yourMessage"
                                name="yourMessage"
                                rows={6}
                                value={
                                    formData.yourMessage
                                }
                                onChange={handleChange}
                                placeholder="Your Message"
                                className="w-full resize-none border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition focus:border-blue-600 focus:bg-white"
                            />

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

                        <div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 px-8 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Request"}
                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    );
}