const CRAWLER_USER_AGENTS = [
  "linkedinbot",
  "facebookexternalhit",
  "facebookcatalog",
  "twitterbot",
  "slackbot",
  "telegrambot",
  "whatsapp",
  "discordbot",
  "googlebot",
  "bingbot",
  "pinterestbot",
  "applebot",
];

const OG_ENDPOINT =
  "https://ttcbkbtixtcblbidnfjh.supabase.co/functions/v1/make-server-ba60542a/og";

export default async function handler(request: Request) {
  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const isCrawler = CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));

  const url = new URL(request.url);
  const path = url.pathname;

  // Let robots.txt and sitemap.xml pass through directly (served by Netlify static/redirect)
  if (path === "/robots.txt" || path === "/sitemap.xml") {
    return;
  }

  if (!isCrawler) {
    // Not a crawler — let Netlify serve the SPA normally
    return;
  }

  // It's a crawler — proxy to the Supabase /og endpoint
  const ogUrl = `${OG_ENDPOINT}?path=${encodeURIComponent(path)}`;

  try {
    const response = await fetch(ogUrl, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2JrYnRpeHRjYmxiaWRuZmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTIyNzYsImV4cCI6MjA3MjY2ODI3Nn0.N7wkX64KMqfPVe5TUUmLtP_xal5v-ydq3HsEX6dayCU",
      },
    });

    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300, s-maxage=600",
      },
    });
  } catch (error) {
    console.error("OG proxy error:", error);
    // Fall through to normal SPA on error
    return;
  }
}

export const config = {
  path: "/*",
};