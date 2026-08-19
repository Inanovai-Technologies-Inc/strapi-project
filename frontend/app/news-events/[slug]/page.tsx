import Link from "next/link";

const STRAPI_URL = "http://localhost:1337";

interface NewsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function NewsDetailPage({
    params,
}: NewsPageProps) {

    const { slug } = await params;

    const response = await fetch(
        `${STRAPI_URL}/api/news?filters[slug][$eq]=${encodeURIComponent(
            slug
        )}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    const result = await response.json();

    const news = result.data?.[0];

    if (!news) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

                <div className="text-center">

                    <h1 className="text-3xl font-bold text-gray-900">
                        News Not Found
                    </h1>

                    <p className="mt-3 text-gray-500">
                        The news article you are looking for does not exist.
                    </p>

                    <Link
                        href="/news-events"
                        className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                    >
                        Back to News
                    </Link>

                </div>

            </main>
        );
    }


    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                NEWS HERO
            ===================================================== */}
            <section className="bg-gray-50 px-6 py-16 lg:px-8 lg:py-24">

                <div className="mx-auto max-w-5xl">

                    <Link
                        href="/news-events"
                        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-orange-500"
                    >
                        ← Back to News
                    </Link>


                    <div className="mt-10">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            News & Events
                        </p>

                        <h1 className="mt-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                            {news.NewsTitle}
                        </h1>

                        <div className="mt-6 h-1 w-16 bg-orange-500" />

                        {news.Date && (
                            <p className="mt-5 text-sm font-medium text-gray-500">
                                {new Date(news.Date).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )}
                            </p>
                        )}

                    </div>

                </div>

            </section>


            {/* =====================================================
                DESCRIPTION
            ===================================================== */}
            <section className="px-6 py-16 lg:px-8">

                <div className="mx-auto max-w-5xl">

                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Description
                        </h2>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />

                        <p className="mt-7 whitespace-pre-line text-base leading-8 text-gray-600">
                            {news.Description}
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                MORE INFORMATION
            ===================================================== */}
            {news.MoreInformation && (
                <section className="bg-gray-50 px-6 py-16 lg:px-8">

                    <div className="mx-auto max-w-5xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                            More Information
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900">
                            Additional Information
                        </h2>

                        <div className="mt-4 h-1 w-12 bg-orange-500" />


                        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">

                            <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                                {news.MoreInformation}
                            </p>

                        </div>

                    </div>

                </section>
            )}


            {/* =====================================================
                CONTACT
            ===================================================== */}
            <section className="bg-gray-900 px-6 py-16 lg:px-8">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

                    <div>

                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                            Need More Information?
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-white">
                            Contact our team
                        </h2>

                        <p className="mt-3 text-gray-400">
                            Get in touch with us for more information.
                        </p>

                    </div>

                    <Link
                        href="/contact"
                        className="shrink-0 rounded-lg bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-orange-600"
                    >
                        Contact Us
                    </Link>

                </div>

            </section>

        </main>
    );
}