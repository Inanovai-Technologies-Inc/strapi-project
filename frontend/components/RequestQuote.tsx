"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Reveal from "@/components/Reveal";

/* =========================================================
   REQUEST A QUOTE

   Shared pre-footer CTA rendered on every route from the root
   layout. Hidden on the contact routes, where a "Request a
   Quote → /contact" call to action would be redundant.
========================================================= */

export default function RequestQuote() {
    const pathname = usePathname();

    if (
        pathname === "/contact" ||
        pathname.startsWith("/contact/")
    ) {
        return null;
    }

    const isCareers =
        pathname === "/careers" || pathname.startsWith("/careers/");

    const heading = isCareers
        ? "Ready to Get Started?"
        : "Let’s Build Safe Spaces Together";

    const description = isCareers
        ? "We foster a culture built on trust, accountability, and continuous learning. Here you'll collaborate with experts, tackle meaningful challenges, and contribute to safer, more sustainable solutions for industries that rely on us."
        : "At Marsol, we engineer fire protection systems that meet the highest industry standards tailored to your space, timeline, and technical needs.";

    const ctaHref = isCareers ? "/careers#job-openings" : "/contact";
    const ctaLabel = isCareers ? "View Open Positions" : "Request a Quote";

    return (
        <section
            id="request-quote"
            className="
                relative
                isolate
                overflow-hidden
                px-6
                py-24
                sm:px-8
                lg:px-12
                lg:py-32
            "
        >
            <Image
                src="/images/request-quote_2 (1).webp"
                alt=""
                fill
                sizes="100vw"
                className="-z-10 object-cover"
            />

            <div className="absolute inset-0 -z-10 bg-[#04121f]/60" />

            <div className="mx-auto max-w-[1400px]">
                <Reveal direction="up">
                    <div className="flex flex-col items-center text-center">
                        <h2
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-white
                                sm:text-4xl
                                lg:text-5xl
                            "
                        >
                            {heading}
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-5
                                max-w-2xl
                                text-sm
                                leading-7
                                text-white/90
                                sm:text-base
                            "
                        >
                            {description}
                        </p>

                        <Link
                            href={ctaHref}
                            className="
                                group
                                mt-8
                                inline-flex
                                items-center
                                gap-2
                                rounded-lg
                                bg-orange-500
                                px-7
                                py-3.5
                                text-sm
                                font-semibold
                                uppercase
                                tracking-wide
                                text-white
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:bg-orange-600
                                hover:shadow-xl
                                hover:shadow-orange-500/20
                            "
                        >
                            {ctaLabel}

                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </Link>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
