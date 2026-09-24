import AmbientBackground from "@/components/AmbientBackground";

export const metadata = {
    title: "HSE Policy | Marsol Technologies",
    description:
        "Marsol Technologies' Health, Safety and Environment Policy for the design, manufacture, and implementation of firefighting safety systems.",
};

export default function HsePolicyPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-gray-50 py-16">
                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-4xl px-6">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Health, Safety and Environment Policy
                    </h1>

                </div>
            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-16">

                <div className="mx-auto max-w-4xl space-y-8 px-6 text-justify text-lg leading-8 text-gray-700">

                    <p>
                        MARSOL aims to achieve high standards of health,
                        safety &amp; environmental management throughout in
                        its activities of Design, manufacture and
                        implementation of firefighting safety systems and
                        related products for helideck and helipad operations
                        for the Industrial, Marine Offshore and Onshore
                        Industries&rdquo; by definition of risks and
                        opportunities with necessary actions to control and
                        expects the same high standards from its
                        sub-contractors and suppliers.
                    </p>

                    <p>
                        MARSOL regards the promotion of Health, Safety &amp;
                        Environment measures as a mutual objective for
                        management and employees at all levels and considers
                        this as a responsibility.
                    </p>

                    <p>
                        It is, therefore, MARSOL policy to apply principle of
                        prevention of pollution, prevention of injury &amp;
                        ill health so far as is reasonable practicable, to
                        provide, maintain and continually improve a working
                        environment that is safe, without risk to health, and
                        with adequate welfare and environment friendly
                        facilities for all its employees and non-company
                        employees involved in the Company&apos;s
                        undertakings.
                    </p>

                    <p>
                        To this end, MARSOL will provide such resources and
                        competent technical advice as may be necessary to
                        enable all employees to meet their Health, Safety
                        &amp; Environment responsibilities, taking in to
                        account all applicable statutory and regulatory legal
                        and other requirements. Risk assessments will be
                        carried out, and recorded, in all areas where
                        potential hazards are likely to exist.
                    </p>

                    <p>
                        The Management of MARSOL gives full support and
                        commitment to this policy and encourages all
                        personnel to implement it. Everyone with supervisory
                        responsibility must recognize the need and accept
                        responsibility for Health, Safety and Environment in
                        all undertakings coming within their area(s) of
                        control and to arrange for adequate information,
                        equipment, instruction, and training for employees
                        for whom they are responsible. They must ensure
                        adequate delegation of those responsibilities when
                        they are absent.
                    </p>

                    <div>
                        <p>
                            Successful implementation of this policy requires
                            commitment of everyone in the Company and
                            acceptance by individual employees of their
                            responsibilities to:
                        </p>

                        <ul className="mt-4 list-disc space-y-2 pl-6 text-left marker:font-bold">
                            <li>
                                Take reasonable care for the Health &amp;
                                Safety of self and for other personnel who
                                may be affected by their acts or omissions at
                                work.
                            </li>
                            <li>
                                To minimize any adverse impact on the
                                environment and risks to the occupational
                                health and safety from its activities,
                                products, and services.
                            </li>
                            <li>
                                To co-operate with the Company by adhering to
                                Company, local, international rules,
                                applicable legal and other requirements, safe
                                working practices and all instructions
                                necessary to enable the Company to comply
                                with its duties.
                            </li>
                            <li>
                                To continually improve the performance of
                                health, safety, and environmental management
                                system performance.
                            </li>
                        </ul>
                    </div>

                    <p>
                        The Company stresses its commitment to Health, Safety
                        and environment protection to the extent that, where
                        willful disregard for safe working practices by an
                        employee seriously puts at risk the Health and Safety
                        of themselves or any other person and danger to
                        environment will be considered as gross misconduct
                        and may lead to the severest disciplinary action.
                    </p>

                    <p>
                        Simultaneously all those employees who would
                        contribute in promoting HSE exceptionally would be
                        suitably rewarded.
                    </p>

                    <p>
                        The HSE policy may be revised or added to or modified
                        from time to time and will be supplemented, where
                        appropriate, by codes of practices, guidance notes,
                        HSE information bulletins and standards. Changes will
                        be brought to the individual attention of the
                        relevant personnel.
                    </p>

                    <p className="text-base text-gray-500">
                        Doc No: HSEP-01 Rev 00 1 Date: 07/05/2020
                    </p>

                </div>

            </section>

        </main>
    );
}
