import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
    title: "Quality Policy | Marsol Technologies",
    description:
        "Marsol Technologies' Quality Policy for the design, manufacture, and implementation of firefighting safety systems.",
};

export default function QualityPolicyPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-4xl px-6">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Quality Policy
                    </h1>

                </div>
            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-16">

                <div className="mx-auto max-w-4xl space-y-8 px-6 text-justify text-lg leading-8 text-gray-700">

                    <p>
                        MARSOL will always strive to provide professional
                        services in the field design, manufacture and
                        implementation of firefighting safety systems and
                        related products for helideck and helipad operations
                        for the Industrial, Marine Offshore and Onshore
                        Industries through sincere effort, commitment,
                        intelligent direction, skillful execution and
                        providing a continual improvement to our quality
                        management systems.
                    </p>

                    <p>
                        The Management and Staff of MARSOL are committed to
                        satisfying applicable requirements and to providing
                        our customers the quality of services that meet
                        their needs and exceed expectations.
                    </p>

                    <div>
                        <p>
                            MARSOL is committed to achieve this policy by
                            adhering to the following principles:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left marker:font-bold">
                            <li>
                                Ensure total client satisfaction by providing
                                best quality products / services along with
                                the efficient and timely completion of the
                                same.
                            </li>
                            <li>
                                Ensure that all personnel are aware of the
                                risks of each machine used during the
                                production / assembly process.
                            </li>
                            <li>
                                Ensure that all personnel are aware of and
                                carry out their responsibilities as set out
                                in their job descriptions.
                            </li>
                            <li>
                                Conducting operations in an environmentally
                                responsible and sustainable manner for
                                optimal use of resources and minimum
                                generation of waste.
                            </li>
                            <li>
                                Integrating economic, social, and
                                environmental considerations into decisions
                                to ensure that the measures adopted are cost
                                effective and in proportion to the
                                significance of the Quality issues being
                                addressed.
                            </li>
                            <li>
                                Promoting awareness among contractors,
                                strategic partners public and individuals
                                within the organization to adhere to high
                                standards of practices to ensure continual
                                improvement and quality throughout the
                                community.
                            </li>
                            <li>
                                Monitoring Quality performance in the
                                organization.
                            </li>
                            <li>
                                Periodical review of policy and objectives
                                for suitability.
                            </li>
                            <li>
                                Communicating the policy to all employees and
                                making it available to all interested
                                parties.
                            </li>
                            <li>
                                Provision of adequate resources for effective
                                implementation of Quality Policy.
                            </li>
                            <li>
                                Streamline and continually improve our
                                processes to meet and exceed our
                                client&apos;s specific requirements.
                            </li>
                            <li>
                                MARSOL is committed to comply with all
                                applicable legal and statutory requirements
                                that govern our operations.
                            </li>
                        </ul>
                    </div>

                    <p>
                        MARSOL management requests all employees of the
                        company that they are aware about this policy and to
                        contribute their skills and talents to implement,
                        maintain and continually improve the quality
                        management system.
                    </p>

                </div>

            </section>

        </main>
    );
}
