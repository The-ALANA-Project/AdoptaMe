import { Link, useLocation } from "react-router";
import { Menu, X, HeartHandshake, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/animales", label: "Adoptar" },
    { to: "/enviar", label: "Publicar" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-primary backdrop-blur-md border-b border-primary-foreground/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 bg-background rounded-xl flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary-foreground tracking-tight" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
              AdoptaMe
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl no-underline transition-colors ${
                  isActive(link.to)
                    ? "bg-background text-primary"
                    : "text-primary-foreground/70 hover:text-primary hover:bg-background"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-foreground/10 bg-primary px-4 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl no-underline transition-colors ${
                isActive(link.to)
                  ? "bg-background text-primary"
                  : "text-primary-foreground/70 hover:text-primary hover:bg-background"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}