import Link from "next/link";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
    title: "Terms & Conditions | Marsol Technologies",
    description:
        "Review the Terms and Conditions of Marsol Technologies. Learn about your rights, website usage policies, data protection, legal disclaimers, and more.",
};

export default function TermsConditionsPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-4xl px-6">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Terms & Conditions
                    </h1>

                    <p className="mt-5 text-justify text-lg leading-8 text-gray-600">
                        Review the Terms and Conditions of Marsol Technologies. Learn about your rights, website usage policies, data protection, legal disclaimers, and more.
                    </p>

                </div>
            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-16">

                <div className="mx-auto max-w-4xl space-y-10 px-6 text-justify text-lg leading-8 text-gray-700">

                    <p>
                        Welcome to Marsol Technologies. These Terms and
                        Conditions govern your use of our website
                        (marsoltech.com). By accessing or using the site,
                        you agree to comply with the following terms. If you
                        do not agree, please do not use the site.
                    </p>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Acceptance of Terms
                        </h2>

                        <p>
                            By accessing our website, you acknowledge that
                            you have read, understood, and agree to be bound
                            by these Terms and Conditions. These terms apply
                            to all visitors, users, and others who access
                            the site.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Intellectual Property
                        </h2>

                        <p>
                            All content on this site—including text, images,
                            videos, logos, product brochures, designs, and
                            other visual materials—is the property of
                            Marsol Technologies and is protected by
                            applicable intellectual property laws. You may
                            not copy, reproduce, distribute, modify, or
                            publicly display any part of the site without
                            our prior written consent.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            User Commitments
                        </h2>

                        <p>By using this site, you confirm that:</p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left marker:font-bold">
                            <li>You are legally allowed to access and use our content.</li>
                            <li>Any information you provide is accurate and truthful.</li>
                            <li>You will not misuse the site for illegal or unauthorized purposes.</li>
                        </ul>

                        <p className="mt-6">
                            Marsol Technologies reserves the right to
                            restrict or remove access if these terms are
                            violated.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Accuracy and Corrections
                        </h2>

                        <p>
                            We strive to keep all information on the site
                            accurate and up to date. However, errors such as
                            typos or outdated content may occasionally
                            occur. We reserve the right to correct such
                            errors or update information at any time
                            without prior notice.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Links to Third-Party Sites
                        </h2>

                        <p>
                            Our website may contain links to external
                            websites not owned or controlled by Marsol
                            Technologies. We are not responsible for the
                            content, accuracy, or privacy practices of these
                            third-party sites. Users should review their
                            terms and privacy policies separately.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Limitations of Liability
                        </h2>

                        <p>
                            Marsol Technologies is not liable for any loss
                            or damage arising from your use of this website
                            or reliance on its content. While we strive for
                            accuracy, we recommend verifying technical
                            information before making decisions.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Changes to Terms
                        </h2>

                        <p>
                            We may revise these Terms and Conditions at any
                            time. Updates will be posted on this page with
                            the effective date. It is your responsibility to
                            review the terms regularly. Continued use of the
                            site after changes means you accept the revised
                            terms.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Website Availability
                        </h2>

                        <p>
                            While we strive for uninterrupted access, we
                            cannot guarantee that the site will always be
                            available. Temporary downtime may occur due to
                            maintenance, updates, or technical issues beyond
                            our control.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Privacy and Data Protection
                        </h2>

                        <p>
                            Your privacy matters to us. We are committed to
                            protecting your personal information. For
                            details, please review our{" "}
                            <Link
                                href="/privacy-policy"
                                className="font-semibold text-orange-600 underline underline-offset-4 transition hover:text-orange-700"
                            >
                                Privacy Policy
                            </Link>{" "}
                            which outlines how we collect, use, and
                            safeguard your data.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            International Users and Governing Law
                        </h2>

                        <p>
                            Marsol Technologies operates this website from
                            the United States, with international branches
                            in the UAE and India. If you access this site
                            from outside the United States, you are
                            responsible for compliance with local laws in
                            your region. These Terms and Conditions are
                            governed by the laws of the United States, and
                            any legal disputes shall be resolved in the
                            state or federal courts located in the United
                            States, without regard to conflict of law
                            principles.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Contact Us
                        </h2>

                        <p>
                            If you have any questions, concerns, or need to
                            resolve a complaint regarding the site, please
                            contact us at:
                            <br />
                            Email:{" "}
                            <a
                                href="mailto:info@marsoltech.com"
                                className="font-semibold text-orange-600 underline underline-offset-4 transition hover:text-orange-700"
                            >
                                info@marsoltech.com
                            </a>
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}
