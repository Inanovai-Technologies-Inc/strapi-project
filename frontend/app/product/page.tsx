const data = await fetch(
    "http://localhost:1337/api/products?populate=*",
    { cache: "no-store" }
);

const products = await data.json();

export default function ProductPage() {
    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Explore our latest products
                    </p>
                </div>

                {/* Products */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.data?.map((product: any) => (
                        <div
                            key={product.documentId}
                            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            {/* Image */}
                            <div className="flex h-64 items-center justify-center bg-gray-50 p-6">
                                {product.Image && (
                                    <img
                                        src={`http://localhost:1337${product.Image.url}`}
                                        alt={
                                            product.Image.alternativeText ||
                                            product.Name
                                        }
                                        width={product.Image.width}
                                        height={product.Image.height}
                                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {product.Name}
                                </h2>

                                <p className="mt-2 text-sm text-gray-500">
                                    Premium quality product
                                </p>

                                <button className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                                    View Product
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}