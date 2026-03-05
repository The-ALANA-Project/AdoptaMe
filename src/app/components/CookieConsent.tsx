import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "adoptame_cookie_consent";
const GA_ID = "G-T3C0K5GXJK";

function loadGtag() {
  // Prevent double-loading
  if (document.getElementById("gtag-script")) return;

  const script = document.createElement("script");
  script.id = "gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    // @ts-ignore
    window.dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      // User already accepted — load GA immediately
      loadGtag();
    } else if (consent === "rejected") {
      // User already rejected — don't show banner, don't load GA
    } else {
      // No choice yet — show the banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    loadGtag();
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
      style={{ animation: "slideUp 0.35s ease-out" }}
    >
      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Cookie className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
        <p
          className="text-muted-foreground text-left"
          style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}
        >
          Usamos cookies de analitica para mejorar AdoptaMe.{" "}
          <Link
            to="/privacidad"
            className="text-primary hover:underline"
            onClick={() => setVisible(false)}
          >
            Mas info
          </Link>
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            Aceptar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}