/* =========================================================
   STRAPI MEDIA HELPERS

   Shared, framework-agnostic helpers for turning the many
   shapes Strapi can return for a media field (v4 nested
   `{ data: { attributes } }`, v5 flattened, single vs
   multiple) into plain URL strings.

   Mirrors the helpers already used on the product detail
   page so the Services pages resolve media identically.
========================================================= */

const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    "http://localhost:1337";

export function normalizeMedia(media: any): any[] {
    if (!media) {
        return [];
    }

    if (Array.isArray(media)) {
        return media.flatMap((item) => normalizeMedia(item));
    }

    if (media?.data) {
        return normalizeMedia(media.data);
    }

    if (media?.attributes) {
        return normalizeMedia(media.attributes);
    }

    if (media?.url) {
        return [media];
    }

    return [];
}

function absolute(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return `${STRAPI_URL}${url}`;
}

export function getImageUrl(image: any): string | null {
    const mediaItems = normalizeMedia(image);

    const url = mediaItems[0]?.url;

    return url ? absolute(url) : null;
}

export function getMediaUrls(media: any): string[] {
    return normalizeMedia(media)
        .map((item) => item?.url)
        .filter(Boolean)
        .map((url: string) => absolute(url));
}

export function getMediaAlt(media: any, fallback: string): string {
    const mediaItems = normalizeMedia(media);

    return (
        mediaItems[0]?.alternativeText ||
        mediaItems[0]?.name ||
        fallback
    );
}
