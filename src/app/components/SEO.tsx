import { useEffect } from "react";

const FAVICON =
  "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Favicon.png";
const OG_IMAGE =
  "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png";
const SITE_URL = "https://adoptame.pe";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

function setMeta(attr: string, attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra
    ? `link[rel="${rel}"][type="${extra.type}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEO({
  title,
  description = "Encuentra a tu companero ideal. AdoptaMe es una plataforma comunitaria de adopcion animal en Peru donde puedes adoptar perros, gatos y mas.",
  path = "",
  image = OG_IMAGE,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | AdoptaMe`
    : "AdoptaMe — Adopta un animal en Peru";
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = "es";

    // Favicon
    setLink("icon", FAVICON, { type: "image/png" });
    setLink("apple-touch-icon", FAVICON);

    // Description
    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");
    setMeta("name", "theme-color", "#E2664A");
    setMeta("name", "author", "AdoptaMe");
    setMeta("property", "article:published_time", "2025-06-01T00:00:00Z");

    // Open Graph
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", image);
    setMeta("property", "og:site_name", "AdoptaMe");
    setMeta("property", "og:locale", "es_PE");

    // Twitter / X
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical
    setLink("canonical", url);
  }, [fullTitle, description, url, image]);

  return null;
}