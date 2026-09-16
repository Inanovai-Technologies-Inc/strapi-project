"use client";

import React from "react";
import Image from "next/image";

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

const VALUES: { key: string; title: string; body: string; icon: React.ReactNode }[] = [
    {
        key: "accountability",
        title: "Accountability",
        body: "We take responsibility for our actions, decisions, and results. Whether it's a small task or a major project, we own the outcome and always strive to deliver what we promise.",
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
        title: "Integrity",
        body: "We are honest, fair & transparent. That's how we build trust with our team, Partners, and customers.",
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
        title: "Passion",
        body: "Our commitment to fire safety & innovation drives everything we do. Passion keeps us focused, motivated, and ready to take on any challenge.",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
            </svg>
        ),
    },
    {
        key: "quality",
        title: "Quality",
        body: "Quality is at the core of everything we deliver, from our products to our service. We strive for excellence to ensure consistent performance and customer trust.",
        icon: (
            <svg {...VALUE_ICON_PROPS}>
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
        ),
    },
    {
        key: "sustainability",
        title: "Sustainability",
        body: "Sustainability is part of our design. Our solutions are designed to protect not just people and assets, but also the environment by using cleaner, safer, and greener technologies.",
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
        title: "Innovation",
        body: "We're constantly looking for better ways to solve fire safety challenges. We push boundaries to solve modern fire risks with smarter and safer technologies.",
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
    return (
        <main className="min-h-screen bg-gray-50 text-gray-800">

            {/* Banner */}
            <section className="relative h-[220px] w-full overflow-hidden sm:h-[320px] lg:h-[420px]">
                <Image
                    src="/images/about-us-banner.png"
                    alt="Marsol Technologies global operations across aviation, maritime, offshore and industrial sites"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04121f]/60 via-transparent to-transparent" />
            </section>

            {/* Hero */}
            <section className="has-ambient relative overflow-hidden border-b border-gray-200 bg-white">
                <AmbientBackground density="soft" />
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                        About Us
                    </p>

                    <h1 className="mt-3 text-4xl font-bold text-[#0b1f3a] md:text-5xl">
                        The Values That Define Us
                    </h1>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:p-10">
                        <p className="text-justify text-base leading-8 text-gray-600 lg:text-lg">
                            At Marsol, our values are the foundation of everything we do. They guide our decisions, shape our systems, and strengthen our partnerships. More than principles, they represent who we are, how we work, and the standards of excellence we uphold in delivering world-class fire protection solutions.
                        </p>

                        <p className="mt-5 text-justify text-base leading-8 text-gray-600 lg:text-lg">
                            Driven by integrity, innovation, reliability, and a commitment to safety, we strive to create lasting value for our customers, employees, and stakeholders. These values inspire us to consistently exceed expectations while protecting what matters most.
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
                                {value.title}
                            </h2>

                            <p className="mt-3 text-justify text-sm leading-7 text-gray-600">
                                {value.body}
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
                                Since
                            </p>

                            <p className="mt-2 text-6xl font-bold text-white">
                                2015
                            </p>
                        </div>

                        <div className="space-y-5 text-gray-300">

                            <p className="leading-8 text-justify">
                                At MARSOL, our expertise lies in fire suppression and life safety solutions, where innovation, performance, and safety come together. We design, develop, and deploy next-generation fire protection and life safety products and systems that help organizations achieve the highest standards of safety, reliability, and operational excellence.What sets MARSOL apart is our commitment to purposeful innovation. Every product and system is engineered to deliver enhanced performance, greater efficiency, and, most importantly, SAFETY.Headquartered in the USA, with offices in the UAE and India, MARSOL combines global reach with local responsiveness. This strategic presence enables us to effectively support customers across diverse industries and regions, providing tailored solutions that address evolving safety challenges. As a trusted partner in fire protection and life safety, we take pride in helping create safer workplaces, facilities, and communities around the world.
                            </p>

                            {/* <p className="leading-8">
                                {t("about.since.p2Prefix")}
                                <strong className="text-white">
                                    {t("about.since.p2Safety")}
                                </strong>
                            </p>

                            <p className="leading-8">
                                {t("about.since.p3")}
                            </p> */}

                        </div>

                    </div>

                </div>
            </section>


            {/* QHSE */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm lg:p-10">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                        QHSE
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-[#0b1f3a] sm:text-3xl">
                        Quality, Health, Safety & Environment
                    </h2>

                    <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">

                        <div className="space-y-4 text-justify text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                            <p>At Marsol, we operate by a simple yet powerful philosophy: &quot;Get it right the first time, every time, and strive to exceed customer expectations.&quot;</p>
                            <p>We are committed to maintaining the highest standards of Quality, Health, Safety, and Environmental (QHSE) performance across all aspects of our operations. Marsol recognizes that the promotion of health, safety, and environmental responsibility is a shared commitment between management and employees at every level of the organization.</p>
                            <p>To support this commitment, Marsol has implemented an Integrated Management System (IMS) accredited by TÜV Rheinland, ensuring compliance with internationally recognized standards and driving continuous improvement in our processes, services, and workplace practices.</p>
                            <p>Through a culture of excellence, accountability, and sustainability, we strive to protect our people, preserve the environment, and deliver reliable, world-class fire protection solutions to our customers.</p>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                            <Image
                                src="/images/ims1.jpg"
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
                        Policies
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                        Our Commitment
                    </h2>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                HSE Policy
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Health, Safety & Environment
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                Quality Policy
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Quality and continuous improvement
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400">
                            <h3 className="font-bold text-[#0b1f3a]">
                                ADC Policy
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Alcohol & Drug Policy
                            </p>
                        </div>

                    </div>

                </div>

            </section>


            {/* Global Offices */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                    Our Locations
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#0b1f3a]">
                    Global Presence
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
                        Email
                    </p>

                    <p className="mt-2 text-xl font-semibold text-white">
                        info@marsoltech.com
                    </p>
                </div>

            </section>

        </main>
    );
}
