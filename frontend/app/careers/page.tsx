import Link from "next/link";
import { T } from "@/components/T";
import AmbientBackground from "@/components/AmbientBackground";
export const dynamic = "force-dynamic";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

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
                        <T k="careersPage.heroTitle" />
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        <T k="careersPage.heroDescription" />
                    </p>

                </div>

            </section>


            {/* =====================================================
                CAREER CONTENT
            ===================================================== */}
            <section className="py-16">

                <div className="mx-auto max-w-5xl px-6">

                    {/* <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">

                        <h2 className="mb-6 text-3xl font-bold text-gray-900">
                            CAREER
                        </h2>

                        <p className="mb-6 text-lg leading-8 text-gray-700">
                            We are one of the leading Fire suppression system
                            manufacturers. A successful organization is a
                            combination of competent and passionate people,
                            working well with each other in a vibrant
                            environment to achieve common objectives.
                        </p>

                        <p className="mb-10 text-lg leading-8 text-gray-700">
                            Our objective is to offer solutions for saving
                            lives.
                        </p>

                        <p className="text-lg leading-8 text-gray-700">
                            Everyone at Marsol Technologies is encouraged and
                            empowered to work with each other to achieve
                            greater success and customer satisfaction.
                        </p>

                    </div> */}


                    {/* =================================================
                        JOB OPENINGS
                    ================================================= */}
                    <div className="mt-12">

                        <h2 className="mb-6 text-3xl font-bold text-gray-900">
                            <T k="careersPage.jobOpenings" />
                        </h2>

                        {careers.length === 0 ? (

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">

                                <p className="text-lg text-gray-600">
                                    <T k="careersPage.noOpenings" />
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
                                                        <T k="careersPage.department" />
                                                    </strong>{" "}
                                                    {career.Department}
                                                </span>
                                            )}

                                            {career.Location && (
                                                <span>
                                                    <strong>
                                                        <T k="careersPage.location" />
                                                    </strong>{" "}
                                                    {career.Location}
                                                </span>
                                            )}

                                            {career.EmploymentType && (
                                                <span>
                                                    <strong>
                                                        <T k="careersPage.employmentType" />
                                                    </strong>{" "}
                                                    {career.EmploymentType}
                                                </span>
                                            )}

                                        </div>


                                        {career.Description && (
                                            <p className="mt-5 line-clamp-3 leading-7 text-gray-700">
                                                {career.Description}
                                            </p>
                                        )}


                                        {career.closingDate && (
                                            <p className="mt-4 text-sm text-gray-500">
                                                <strong>
                                                    <T k="careersPage.closingDate" />
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
                                                <T k="careersPage.viewPosition" />
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