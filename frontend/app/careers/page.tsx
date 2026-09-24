import Image from "next/image";
import Link from "next/link";
import AmbientBackground from "@/components/AmbientBackground";
export const dynamic = "force-dynamic";

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

interface Career {
    id: number;
    documentId?: string;
    Title?: string;
    JobId?: string;
    Department?: string;
    Location?: string;
    EmploymentType?: string;
    Description?: string;
    Requirements?: string;
    closingDate?: string;
    erpnextName?: string;
    slug?: string;
}

interface StrapiResponse {
    data: Career[];
}

async function getCareers(): Promise<Career[]> {
    try {
        const response = await fetch(
            `${STRAPI_URL}/api/careers?populate=*`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to fetch careers:",
                response.status
            );

            return [];
        }

        const result: StrapiResponse = await response.json();

        return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error("Error fetching careers:", error);

        return [];
    }
}

export default async function CareerPage() {
    const careers = await getCareers();

    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}
            <section className="has-ambient relative overflow-hidden bg-gray-50 py-20">

                <AmbientBackground density="soft" />

                <div className="mx-auto max-w-7xl px-6 text-center">

                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Career
                    </h1>

                    <p className="mx-auto mt-4 text-lg text-gray-600 lg:whitespace-nowrap">
                        Join Marsol Technologies and be part of a team working towards solutions that help save lives.
                    </p>

                </div>

            </section>


            {/* =====================================================
                CAREER CONTENT
            ===================================================== */}
            <section className="py-16">

                <div className="mx-auto max-w-5xl px-6">

                    <div className="space-y-16">

                        <div className="max-w-5xl">

                            <h2 className="mb-6 text-3xl font-bold text-gray-900">
                                JOIN OUR TEAM
                            </h2>

                            <h3 className="mb-3 text-lg font-bold text-gray-900">
                                Join Our Team
                            </h3>

                            <p className="mb-6 text-justify text-lg leading-8 text-gray-700">
                                At Marsol Technologies, we do more than design
                                fire suppression systems. We bring together
                                passionate professionals dedicated to protecting
                                lives, safeguarding assets, and delivering
                                innovative solutions.
                            </p>

                            <p className="mb-6 text-justify text-lg leading-8 text-gray-700">
                                We believe great ideas can come from anyone,
                                which is why we foster a culture of
                                collaboration, continuous learning, and
                                professional growth.
                            </p>

                            <p className="mb-8 text-justify text-lg leading-8 text-gray-700">
                                If you&apos;re looking for a workplace where your
                                contributions make a real impact and where you
                                can help solve meaningful engineering challenges,
                                we&apos;d love to hear from you.
                            </p>

                            <Link
                                href="#job-openings"
                                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                View Open Positions
                                <span>&gt;</span>
                            </Link>

                            <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">

                                <div>

                                    <h3 className="mb-3 text-lg font-bold text-gray-900">
                                        Why Work With Us
                                    </h3>

                                    <p className="mb-6 text-justify text-lg leading-8 text-gray-700">
                                        At Marsol Technologies, you&apos;re joining
                                        more than a company, you&apos;re becoming
                                        part of a mission to protect lives,
                                        safeguard critical assets, and create safer
                                        environments through innovative engineering
                                        solutions. Every role plays an important
                                        part in making a meaningful impact.
                                    </p>

                                    <p className="text-justify text-lg leading-8 text-gray-700">
                                        We foster a culture built on collaboration,
                                        mutual respect, and a shared commitment to
                                        excellence. Whether you&apos;re advancing
                                        your expertise, contributing new ideas, or
                                        taking on exciting challenges, you&apos;ll
                                        find opportunities to grow and thrive with
                                        us.
                                    </p>

                                </div>

                                <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg sm:h-96">
                                    <Image
                                        src="/images/why-work-with-us.webp"
                                        alt="Marsol Technologies open-plan office"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                            </div>

                        </div>

                        <div className="max-w-5xl">

                            <span className="inline-block rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                                Culture
                            </span>

                            <h2 className="mb-8 mt-4 text-3xl font-bold text-gray-900">
                                LIFE AT MARSOL TECHNOLOGIES
                            </h2>

                            <div className="space-y-5 text-justify text-lg leading-8 text-gray-700">

                                <p>
                                    At Marsol Technologies, life is about
                                    collaboration, continuous learning, and
                                    working together to build a safer
                                    future. We believe in fostering a
                                    supportive environment where every team
                                    member is valued, encouraged, and
                                    empowered to succeed.
                                </p>

                                <p>
                                    From casual coffee conversations and
                                    team celebrations to tackling complex
                                    engineering challenges, there&apos;s
                                    always an opportunity to connect,
                                    innovate, and grow. We embrace new
                                    ideas, recognize achievements, and
                                    inspire one another to deliver our
                                    best.
                                </p>

                                <p>
                                    It&apos;s a place where you can be
                                    yourself, develop your skills, make a
                                    meaningful impact, and take pride in
                                    the work you do every day.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        JOB OPENINGS
                    ================================================= */}
                    <div id="job-openings" className="mt-16 scroll-mt-24">

                        <h2 className="mb-6 text-3xl font-bold text-gray-900">
                            JOB OPENINGS
                        </h2>

                        {careers.length === 0 ? (

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">

                                <p className="text-lg text-gray-600">
                                    We currently do not have any job openings.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-6">

                                {careers.map((career) => (

                                    <div
                                        key={career.id}
                                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
                                    >

                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {career.Title}
                                        </h3>


                                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">

                                            {career.Department && (
                                                <span>
                                                    <strong>
                                                        Department:
                                                    </strong>{" "}
                                                    {career.Department}
                                                </span>
                                            )}

                                            {career.Location && (
                                                <span>
                                                    <strong>
                                                        Location:
                                                    </strong>{" "}
                                                    {career.Location}
                                                </span>
                                            )}

                                            {career.EmploymentType && (
                                                <span>
                                                    <strong>
                                                        Employment Type:
                                                    </strong>{" "}
                                                    {career.EmploymentType}
                                                </span>
                                            )}

                                        </div>


                                        {career.Description && (
                                            <p className="mt-5 line-clamp-3 text-justify leading-7 text-gray-700">
                                                {career.Description}
                                            </p>
                                        )}


                                        {career.closingDate && (
                                            <p className="mt-4 text-sm text-gray-500">
                                                <strong>
                                                    Closing Date:
                                                </strong>{" "}
                                                {new Date(
                                                    career.closingDate
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )}
                                            </p>
                                        )}


                                        {/* View Position */}
                                        <div className="mt-6">

                                            <Link
                                                href={`/careers/${career.slug}`}
                                                className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                                            >
                                                View Position
                                            </Link>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </section>

        </main>
    );
}