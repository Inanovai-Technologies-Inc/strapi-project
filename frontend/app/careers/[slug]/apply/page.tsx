import Link from "next/link";
import { notFound } from "next/navigation";
import CareerApplicationForm from "@/components/CareerApplicationForm";
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

async function getCareer(
    slug: string
): Promise<Career | null> {
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
                response.status
            );

            return null;
        }

        const result: StrapiResponse =
            await response.json();

        if (
            !result.data ||
            result.data.length === 0
        ) {
            return null;
        }

        return result.data[0];
    } catch (error) {
        console.error(
            "Error fetching career:",
            error
        );

        return null;
    }
}

interface ApplyPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ApplyPage({
    params,
}: ApplyPageProps) {
    const { slug } = await params;

    const career = await getCareer(slug);

    if (!career) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 py-16">
            <div className="mx-auto max-w-3xl px-6">

                {/* Back */}

                <Link
                    href={`/careers/${career.slug}`}
                    className="text-sm font-medium text-gray-600 hover:text-black"
                >
                    ← <T k="careerApply.back" />
                </Link>

                {/* Header */}

                <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

                    <h1 className="text-3xl font-bold text-gray-900">
                        <T k="careerApply.title" />
                    </h1>

                    <p className="mt-3 text-gray-600">
                        <T k="careerApply.description" />
                    </p>

                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            <T k="careerApply.positionLabel" />
                        </p>

                        <p className="mt-1 font-semibold text-gray-900">
                            {career.Title}
                        </p>
                    </div>

                </div>

                {/* Application Form */}

                <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">

                    <CareerApplicationForm
                        careerId={career.id}
                        careerTitle={career.Title || "Job Opening"}
                    />

                </div>

            </div>
        </main>
    );
}