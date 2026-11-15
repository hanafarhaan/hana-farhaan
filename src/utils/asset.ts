/** Resolves a path inside /public against the site's base URL (the site lives under /hana-farhaan/). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
