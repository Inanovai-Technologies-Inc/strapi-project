export async function getWebsiteKnowledge() {
  const strapiUrl = process.env.STRAPI_URL;

  if (!strapiUrl) {
    throw new Error("STRAPI_URL is not defined");
  }

  const response = await fetch(
    `${strapiUrl}/api/products?populate=*`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch website content from Strapi: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data || [];
}