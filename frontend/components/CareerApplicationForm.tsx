"use client";

import React, { FormEvent, useState } from "react";

import { useI18n } from "@/components/I18nProvider";

const STRAPI_URL = "http://localhost:1337";

interface CareerApplicationFormProps {
    careerId: number;
    careerTitle: string;
}

export default function CareerApplicationForm({
    careerId,
    careerTitle,
}: CareerApplicationFormProps) {
    const { t } = useI18n();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setSuccess("");
        setError("");

        try {
            // =====================================================
            // VALIDATION
            // =====================================================

            if (!fullName.trim()) {
                throw new Error(
                    t("careerApply.validationFullName")
                );
            }

            if (!email.trim()) {
                throw new Error(
                    t("careerApply.validationEmail")
                );
            }

            if (!phone.trim()) {
                throw new Error(
                    t("careerApply.validationPhone")
                );
            }

            if (!resume) {
                throw new Error(
                    t("careerApply.validationResume")
                );
            }

            // =====================================================
            // 1. UPLOAD RESUME
            // =====================================================

            const uploadFormData = new FormData();

            uploadFormData.append(
                "files",
                resume
            );

            console.log(
                "Uploading resume to:",
                `${STRAPI_URL}/api/upload`
            );

            const uploadResponse = await fetch(
                `${STRAPI_URL}/api/upload`,
                {
                    method: "POST",
                    body: uploadFormData,
                }
            );

            // Read response as TEXT first.
            // This prevents JSON parsing errors when Strapi
            // returns "Method Not Allowed" or another text response.
            const uploadText =
                await uploadResponse.text();

            console.log(
                "Upload status:",
                uploadResponse.status
            );

            console.log(
                "Upload response:",
                uploadText
            );

            if (!uploadResponse.ok) {
                throw new Error(
                    `Resume upload failed (${uploadResponse.status}): ${uploadText}`
                );
            }

            // =====================================================
            // PARSE UPLOAD RESPONSE
            // =====================================================

            let uploadedFiles: any;

            try {
                uploadedFiles =
                    JSON.parse(uploadText);
            } catch {
                throw new Error(
                    "Strapi returned an invalid response after uploading the resume."
                );
            }

            console.log(
                "Uploaded files:",
                uploadedFiles
            );

            const resumeId =
                uploadedFiles?.[0]?.id;

            if (!resumeId) {
                throw new Error(
                    "Resume uploaded, but Strapi did not return a file ID."
                );
            }

            console.log(
                "Resume ID:",
                resumeId
            );

            // =====================================================
            // 2. CREATE CAREER APPLICATION
            // =====================================================

            const applicationData = {
                    data: {
                        FullName: String(fullName).trim(),
                        Email: String(email).trim(),
                        Phone: String(phone).trim(),
                        Resume: resumeId,
                        CoverLetter: String(coverLetter).trim(),
                        career: careerId,
    },
};

            console.log(
                "Creating career application:",
                applicationData
            );

            /*
             * IMPORTANT:
             *
             * Your Strapi content type is named:
             *
             * carrer-application
             *
             * Therefore the API endpoint is:
             *
             * /api/carrer-applications
             */

            const applicationResponse =
                await fetch(
                    `${STRAPI_URL}/api/carrer-applications`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            applicationData
                        ),
                    }
                );

            // Read as text first so we don't get
            // "Unexpected token..." if Strapi returns
            // a non-JSON error.
            const applicationText =
                await applicationResponse.text();

            console.log(
                "Application status:",
                applicationResponse.status
            );

            console.log(
                "Application response:",
                applicationText
            );

            if (!applicationResponse.ok) {
                let errorMessage =
                    t("careerApply.errorGeneric");

                try {
                    const applicationResult =
                        JSON.parse(
                            applicationText
                        );

                    errorMessage =
                        applicationResult?.error
                            ?.message ||
                        errorMessage;

                    console.error(
                        "Application error:",
                        applicationResult
                    );
                } catch {
                    console.error(
                        "Application error:",
                        applicationText
                    );

                    errorMessage =
                        applicationText ||
                        errorMessage;
                }

                throw new Error(
                    errorMessage
                );
            }

            // =====================================================
            // SUCCESS
            // =====================================================

            console.log(
                "Application submitted successfully."
            );

            setSuccess(
                t("careerApply.success")
            );

            // Clear form

            setFullName("");
            setEmail("");
            setPhone("");
            setResume(null);
            setCoverLetter("");

            // Clear file input

            const fileInput =
                document.getElementById(
                    "resume"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            console.error(
                "Application submission error:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : t("careerApply.errorUnknown")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* =====================================================
                POSITION
            ===================================================== */}

            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                    {t("careerApply.position")}
                </label>

                <input
                    type="text"
                    value={careerTitle}
                    readOnly
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-gray-700"
                />
            </div>

            {/* =====================================================
                FULL NAME
            ===================================================== */}

            <div>
                <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    {t("careerApply.fullName")} *
                </label>

                <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                        setFullName(
                            e.target.value
                        )
                    }
                    placeholder={t("careerApply.placeholderFullName")}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* =====================================================
                EMAIL
            ===================================================== */}

            <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    {t("careerApply.email")} *
                </label>

                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    placeholder={t("careerApply.placeholderEmail")}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* =====================================================
                PHONE
            ===================================================== */}

            <div>
                <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    {t("careerApply.phone")} *
                </label>

                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                        setPhone(
                            e.target.value
                        )
                    }
                    placeholder={t("careerApply.placeholderPhone")}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* =====================================================
                RESUME
            ===================================================== */}

            <div>
                <label
                    htmlFor="resume"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    {t("careerApply.resume")} *
                </label>

                <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                        const file =
                            e.target.files?.[0] ||
                            null;

                        setResume(file);
                    }}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <p className="mt-2 text-xs text-gray-500">
                    {t("careerApply.acceptedFormats")}
                </p>
            </div>

            {/* =====================================================
                COVER LETTER
            ===================================================== */}

            <div>
                <label
                    htmlFor="coverLetter"
                    className="mb-2 block text-sm font-semibold text-gray-900"
                >
                    {t("careerApply.coverLetter")}
                </label>

                <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) =>
                        setCoverLetter(
                            e.target.value
                        )
                    }
                    rows={6}
                    placeholder={t("careerApply.placeholderCoverLetter")}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
            </div>

            {/* =====================================================
                ERROR MESSAGE
            ===================================================== */}

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* =====================================================
                SUCCESS MESSAGE
            ===================================================== */}

            {success && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* =====================================================
                SUBMIT BUTTON
            ===================================================== */}

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading
                    ? t("careerApply.submitting")
                    : t("careerApply.submit")}
            </button>
        </form>
    );
}