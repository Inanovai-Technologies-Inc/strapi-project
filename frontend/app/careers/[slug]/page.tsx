import Link from "next/link";
import { notFound } from "next/navigation";
import { T } from "@/components/T";

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

async function getCareer(slug: string): Promise<Career | null> {
    try {
        const url =
            `${STRAPI_URL}/api/careers` +
            `?filters[slug][$eq]=${encodeURIComponent(slug)}`;

        const response = await fetch(url, {
            cache: "no-store",
        });

        if (!response.ok) {
            console.error(
                "Failed to fetch career:",
                response.status,
                response.statusText
            );

            return null;
        }

        const result: StrapiResponse = await response.json();

        if (!result.data || result.data.length === 0) {
            return null;
        }

        return result.data[0];
    } catch (error) {
        console.error("Error fetching career:", error);
        return null;
    }
}

interface CareerDetailsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CareerDetailsPage({
    params,
}: CareerDetailsPageProps) {
    const { slug } = await params;

    const career = await getCareer(slug);

    if (!career) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO / JOB HEADER
            ===================================================== */}
            <section className="bg-gray-50 py-16">
                <div className="mx-auto max-w-6xl px-6">

                    {/* Back Button */}
                    <Link
                        href="/careers"
                        className="inline-flex items-center text-sm font-medium text-gray-600 transition hover:text-gray-900"
                    >
                        ← <T k="careerDetail.back" />
                    </Link>

                    {/* Job Title */}
                    <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        {career.Title || <T k="careerDetail.defaultTitle" />}
                    </h1>

                    {/* Job Information */}
                    <div className="mt-6 flex flex-wrap gap-3">

                        {career.Department && (
                            <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
                                <T k="careerDetail.department" /> {career.Department}
                            </span>
                        )}

                        {career.Location && (
                            <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
                                <T k="careerDetail.location" /> {career.Location}
                            </span>
                        )}

                        {career.EmploymentType && (
                            <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-700 shadow-sm">
                                {career.EmploymentType}
                            </span>
                        )}

                    </div>

                </div>
            </section>


            {/* =====================================================
                JOB DETAILS
            ===================================================== */}
            <section className="py-16">

                <div className="mx-auto max-w-6xl px-6">

                    <div className="grid gap-10 md:grid-cols-3">

                        {/* =================================================
                            MAIN JOB CONTENT
                        ================================================= */}
                        <div className="md:col-span-2">

                            {/* Job Description */}
                            {career.Description && (
                                <section>

                                    <h2 className="text-2xl font-bold text-gray-900">
                                        <T k="careerDetail.jobDescription" />
                                    </h2>

                                    <p className="mt-5 whitespace-pre-line text-lg leading-8 text-gray-700">
                                        {career.Description}
                                    </p>

                                </section>
                            )}


                            {/* Requirements */}
                            {career.Requirements && (
                                <section className="mt-12">

                                    <h2 className="text-2xl font-bold text-gray-900">
                                        <T k="careerDetail.requirements" />
                                    </h2>

                                    <p className="mt-5 whitespace-pre-line text-lg leading-8 text-gray-700">
                                        {career.Requirements}
                                    </p>

                                </section>
                            )}

                        </div>


                        {/* =================================================
                            APPLY CARD
                        ================================================= */}
                        <aside>

                            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6">

                                <h2 className="text-xl font-bold text-gray-900">
                                    <T k="careerDetail.interestedTitle" />
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    <T k="careerDetail.interestedDescription" />
                                </p>


                                {/* Closing Date */}
                                {career.closingDate && (
                                    <div className="mt-6">

                                        <p className="text-sm text-gray-500">
                                            <T k="careerDetail.applicationCloses" />
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {new Date(
                                                career.closingDate
                                            ).toLocaleDateString("en-IN")}
                                        </p>

                                    </div>
                                )}


                                {/* Apply Button */}
                                <Link
                                    href={`/careers/${career.slug}/apply`}
                                    className="mt-6 block w-full rounded-lg bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                                >
                                    <T k="careerDetail.applyCta" />
                                </Link>

                            </div>

                        </aside>

                    </div>

                </div>

            </section>

        </main>
    );
}