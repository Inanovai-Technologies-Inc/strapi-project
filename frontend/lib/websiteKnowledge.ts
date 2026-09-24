async function fetchCollection(
  strapiUrl: string,
  endpoint: string
) {
  const response = await fetch(
    `${strapiUrl}/api/${endpoint}?populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${endpoint} from Strapi: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data || [];
}

export async function getWebsiteKnowledge() {
  const strapiUrl = process.env.STRAPI_URL;

  if (!strapiUrl) {
    throw new Error("STRAPI_URL is not defined");
  }

  const [products, services] = await Promise.all([
    fetchCollection(strapiUrl, "products"),
    fetchCollection(strapiUrl, "services"),
  ]);

  return { products, services };
}