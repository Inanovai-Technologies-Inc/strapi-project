import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
    title: "Privacy Policy | Marsol Technologies",
    description:
        "Learn how Marsol Technologies collects, uses, and safeguards your personal data. Read our Privacy Policy to understand your rights, cookie usage, and data protection practices.",
};

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-4xl px-6">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-5 text-justify text-lg leading-8 text-gray-600">
                        Learn how Marsol Technologies collects, uses, and safeguards your personal data. Read our Privacy Policy to understand your rights, cookie usage, and data protection practices.
                    </p>

                </div>
            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-16">

                <div className="mx-auto max-w-4xl space-y-10 px-6 text-justify text-lg leading-8 text-gray-700">

                    <p>
                        At Marsol Technologies, your privacy matters. This
                        Privacy Policy explains how we collect, use, store,
                        and protect your personal information when you
                        interact with our website or services.
                    </p>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            What Information Do We Collect?
                        </h2>

                        <p>
                            We may collect personal information that you
                            voluntarily provide when:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left">
                            <li>You submit an inquiry form.</li>
                            <li>You download a document or product material.</li>
                            <li>You interact with our website via cookies.</li>
                        </ul>

                        <p className="mt-6">
                            We also collect certain information
                            automatically, such as:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left">
                            <li>IP addresses</li>
                            <li>Browser type</li>
                            <li>Device characteristics</li>
                            <li>User behaviour</li>
                        </ul>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            What Are Cookies?
                        </h2>

                        <p>
                            Cookies are small text files stored on your
                            device to enhance your browsing experience. This
                            site uses cookies and related technologies, as
                            described in our Privacy Policy, for purposes
                            that may include site operation, analytics,
                            enhanced user experience, or advertising. You may
                            choose to consent to our use of these
                            technologies or manage your own preferences.
                        </p>

                        <h3 className="mb-3 mt-6 text-lg font-bold text-gray-900">
                            Why do we use them?
                        </h3>

                        <ul className="list-disc space-y-2 pl-6 text-left">
                            <li>Understand visitor behavior and improve our site.</li>
                            <li>Analyze marketing campaign effectiveness.</li>
                            <li>Customise your user experience.</li>
                        </ul>

                        <h3 className="mb-3 mt-6 text-lg font-bold text-gray-900">
                            How Can You Control Cookies?
                        </h3>

                        <p>
                            You can use your internet browser to
                            automatically or manually delete cookies. You
                            may also specify that certain cookies are not to
                            be placed. Another option is to change your
                            browser settings to notify you when a cookie is
                            being placed. Please note that our website may
                            not function properly if you disable all
                            cookies. If you delete cookies, they may be
                            placed again after your consent on your next
                            visit.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Scripts and Technologies Used
                        </h2>

                        <p>
                            Scripts are small pieces of code used to ensure
                            our website functions properly and
                            interactively. These scripts may run on our
                            server or directly on your device to enhance
                            usability.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Legal Bases for Processing (for EU & UK Users)
                        </h2>

                        <p>
                            We process your personal data based on the
                            following legal grounds:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left">
                            <li>
                                <strong>Consent:</strong> You&apos;ve given
                                permission for us to use your data.
                            </li>
                            <li>
                                <strong>Legitimate Interests:</strong> For
                                business-related needs that don&apos;t
                                override your rights.
                            </li>
                            <li>
                                <strong>Legal Obligation:</strong> When
                                required by law.
                            </li>
                            <li>
                                <strong>Vital Interests:</strong> To protect
                                your safety or that of others.
                            </li>
                        </ul>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Why Do We Process Your Data?
                        </h2>

                        <p>
                            Depending on how you interact with our services,
                            we may process your information to:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left">
                            <li>Respond to your inquiries or support needs.</li>
                            <li>Send updates about our services, terms, or policies.</li>
                            <li>Deliver content or advertising tailored to your interests.</li>
                            <li>Prevent fraud and enhance security.</li>
                            <li>Analyze the effectiveness of our marketing efforts.</li>
                            <li>Maintain communications with partners, customers, or investors.</li>
                        </ul>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Marketing
                        </h2>

                        <p>
                            We may occasionally send you updates on our
                            products and services. You can opt out of
                            receiving marketing emails at any time by
                            contacting us or clicking the
                            &quot;unsubscribe&quot; link in our emails.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Your Data Protection Rights
                        </h2>

                        <ul className="list-disc space-y-2 pl-6 text-left">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request corrections to inaccurate information.</li>
                            <li>Request deletion of your personal data (under certain conditions).</li>
                            <li>Restrict or object to how your data is processed.</li>
                            <li>Request a copy of your data (data portability).</li>
                        </ul>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Sharing of Information
                        </h2>

                        <p>
                            We do not sell or share your personal
                            information with third parties. If you request
                            deletion of your data, we will respect your
                            request, unless retention is required by law.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Data Retention
                        </h2>

                        <p>
                            We keep your personal data only as long as
                            necessary for the purposes outlined in this
                            policy or to comply with legal requirements.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Third-Party Links
                        </h2>

                        <p>
                            Our website may contain links to third-party
                            websites, plug-ins, or applications. Clicking
                            these links may allow third parties to collect
                            or share information about you. We do not
                            control these external sites and are not
                            responsible for their privacy policies. We
                            recommend reviewing their policies before
                            submitting any personal data.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Updates to This Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy periodically.
                            Any changes will be posted here with a new
                            &quot;Last Updated&quot; date.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Acceptance of Terms
                        </h2>

                        <p>
                            By using our site, you agree to this Privacy
                            Policy. If you do not agree, please discontinue
                            use of the website.
                        </p>
                    </div>


                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Contact Us
                        </h2>

                        <p>
                            If you have any questions or concerns about this
                            Privacy Policy, please reach out to us at:{" "}
                            <a
                                href="mailto:info@marsoltech.com"
                                className="font-semibold text-orange-600 underline underline-offset-4 transition hover:text-orange-700"
                            >
                                info@marsoltech.com
                            </a>
                            .
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}
