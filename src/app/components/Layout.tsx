import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SEO } from "./SEO";
import { CookieConsent } from "./CookieConsent";
import { GADebug } from "./GADebug";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Track pageviews on route changes
  useEffect(() => {
    // Check if gtag is available
    if (typeof window.gtag === "function") {
      console.log("[GA] 📊 Tracking page view for:", pathname);
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    } else {
      console.log("[GA] ⚠️ gtag not available yet for:", pathname);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <GADebug />
    </div>
  );
}