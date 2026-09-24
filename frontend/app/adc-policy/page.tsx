import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
    title: "Alcohol, Drugs and Contraband Policy | Marsol Technologies",
    description:
        "Marsol Technologies' Alcohol, Drugs and Contraband Policy, defining our position to keep the workplace safe.",
};

export default function AdcPolicyPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-4xl px-6">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Alcohol, Drugs and Contraband Policy
                    </h1>

                </div>
            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-16">

                <div className="mx-auto max-w-4xl space-y-8 px-6 text-justify text-lg leading-8 text-gray-700">

                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Purpose
                        </h2>

                        <p>
                            This policy defines the MARSOL position to
                            prevent the problems caused by alcohol, drugs and
                            contraband in the workplace, thereby providing
                            our employees with a safe workplace environment.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Prohibited Activities
                        </h2>

                        <ul className="list-disc space-y-4 pl-6 text-left marker:font-bold">
                            <li>
                                The use, possession, and transportation of
                                sale of contraband, narcotics, illegal drugs
                                or drug paraphernalia by any employee while
                                on duty, while on company premises or in any
                                company vehicle, in any personal vehicle on
                                company business, or while on any job site of
                                a customer, is prohibited. The only exception
                                shall be for properly used prescription
                                medication prescribed by a licensed physician
                                for use solely by the person the medication
                                is prescribed to.
                            </li>
                            <li>
                                The use, possession, and transportation of
                                sale of alcohol or intoxicating beverages
                                while on company premises or in any company
                                vehicle, in any personal vehicle on company
                                business, or on any job site of a customer,
                                is prohibited.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">
                            Disciplinary Action
                        </h2>

                        <p>
                            MARSOL can exercise testing of suspicious
                            employees on set parameters of being under the
                            influence of alcohol/drugs. Any employee
                            determined by the company to have engaged in any
                            of the prohibited activities set forth in this
                            policy, shall be subjected to disciplinary action
                            including immediate termination from employment
                            for cause.
                        </p>
                    </div>

                </div>

            </section>

        </main>
    );
}
