import { useEffect, useState } from "react";
import { useLocation } from "react-router";

/**
 * GA Debug Component - Shows real-time Google Analytics status
 * Add this to Layout.tsx temporarily to diagnose GA issues
 * Remove after GA is confirmed working
 */
export function GADebug() {
  const location = useLocation();
  const [events, setEvents] = useState<any[]>([]);
  const [status, setStatus] = useState({
    gtagExists: false,
    dataLayerExists: false,
    scriptLoaded: false,
    eventCount: 0,
  });

  useEffect(() => {
    const checkStatus = () => {
      const gtagExists = typeof window.gtag === "function";
      const dataLayerExists = Array.isArray(window.dataLayer);
      const scriptLoaded = !!document.querySelector(
        'script[src*="googletagmanager.com/gtag/js"]'
      );
      const eventCount = window.dataLayer?.length || 0;

      setStatus({
        gtagExists,
        dataLayerExists,
        scriptLoaded,
        eventCount,
      });

      if (dataLayerExists) {
        setEvents([...window.dataLayer]);
      }
    };

    // Check immediately
    checkStatus();

    // Check periodically
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.9)",
        color: "#00ff00",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "11px",
        fontFamily: "monospace",
        maxWidth: "300px",
        maxHeight: "400px",
        overflow: "auto",
        zIndex: 9999,
        border: "2px solid #00ff00",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#fff" }}>
        🔍 GA DEBUG (G-T3C0K5GXJK)
      </div>
      
      <div style={{ marginBottom: "8px" }}>
        <div>
          window.gtag: {status.gtagExists ? "✅ EXISTS" : "❌ MISSING"}
        </div>
        <div>
          window.dataLayer: {status.dataLayerExists ? "✅ EXISTS" : "❌ MISSING"}
        </div>
        <div>
          Script loaded: {status.scriptLoaded ? "✅ YES" : "❌ NO"}
        </div>
        <div>
          Event count: {status.eventCount}
        </div>
        <div style={{ color: "#ffff00" }}>
          Current route: {location.pathname}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #333", paddingTop: "8px" }}>
        <div style={{ color: "#fff", marginBottom: "4px" }}>
          Recent dataLayer events:
        </div>
        {events.slice(-5).map((event, i) => (
          <div
            key={i}
            style={{
              marginBottom: "4px",
              padding: "4px",
              background: "rgba(0,255,0,0.1)",
              borderRadius: "4px",
              fontSize: "10px",
            }}
          >
            {JSON.stringify(event).slice(0, 100)}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "8px", color: "#ccc", fontSize: "9px" }}>
        Open Console for detailed [GA] logs
      </div>
    </div>
  );
}
