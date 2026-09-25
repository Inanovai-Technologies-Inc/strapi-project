import "server-only";
import sharp from "sharp";

/* =========================================================
   IMAGE TYPE — transparent-render vs normal photo

   File format alone isn't a reliable signal: several "photo"
   product images in this catalogue (e.g. Foam Branch Pipe,
   Foam-Water Sprinkler) are exported as flattened PNGs with no
   real alpha channel, while others (e.g. ROTO Spray Deluge
   Nozzles) are PNGs with a genuine transparent background. So
   this inspects the actual pixel data via `sharp` and asks
   whether the image has an alpha channel in use at all.

   - JPEG can never carry alpha — treated as photographic
     without a fetch.
   - Anything else is downloaded once (server-side, so no CORS
     concerns) and its metadata checked for `hasAlpha`.

   Results are memoized per URL for the life of the server
   process — these image URLs are content-hashed by Strapi, so
   the same URL always points at the same bytes.
========================================================= */

const cache = new Map<string, Promise<boolean>>();

export function isPhotographicImage(
    url: string | null | undefined
): Promise<boolean> {
    if (!url) {
        return Promise.resolve(false);
    }

    if (/\.jpe?g(\?.*)?$/i.test(url)) {
        return Promise.resolve(true);
    }

    const cached = cache.get(url);

    if (cached) {
        return cached;
    }

    const result = (async () => {
        try {
            const response = await fetch(url, {
                cache: "force-cache",
            });

            if (!response.ok) {
                // Safe default: keep the existing boxed/contain look.
                return false;
            }

            const buffer = Buffer.from(
                await response.arrayBuffer()
            );

            const metadata = await sharp(buffer).metadata();

            return !metadata.hasAlpha;
        } catch (error) {
            console.error(
                "Failed to inspect image for transparency:",
                url,
                error
            );

            // Safe default: keep the existing boxed/contain look.
            return false;
        }
    })();

    cache.set(url, result);

    return result;
}
