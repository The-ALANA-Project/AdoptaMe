import { Link } from "react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary border-t border-primary-foreground/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Legal links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/terminos"
              className="text-primary-foreground/70 hover:text-primary-foreground no-underline transition-colors"
              style={{ fontSize: "0.8125rem" }}
            >
              Terminos de uso
            </Link>
            <Link
              to="/privacidad"
              className="text-primary-foreground/70 hover:text-primary-foreground no-underline transition-colors"
              style={{ fontSize: "0.8125rem" }}
            >
              Privacidad
            </Link>
            <Link
              to="/sobre-mi"
              className="text-primary-foreground/70 hover:text-primary-foreground no-underline transition-colors"
              style={{ fontSize: "0.8125rem" }}
            >
              Sobre mi
            </Link>
          </div>

          {/* Credit */}
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p
              className="text-primary-foreground/70 flex items-center gap-1"
              style={{ fontSize: "0.8125rem" }}
            >
              Hecho con{" "}
              <Heart className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />{" "}
              by{" "}
              <a
                href="https://www.linkedin.com/in/stella-achenbach/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground hover:text-primary-foreground/80 no-underline transition-colors"
                style={{ fontWeight: 500 }}
              >
                @stellaachenbach
              </a>{" "}
              por la comunidad
            </p>
            <p
              className="text-primary-foreground/50"
              style={{ fontSize: "0.6875rem" }}
            >
              Foto social por{" "}
              <a
                href="https://unsplash.com/@victor_vector"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/60 hover:text-primary-foreground/80 no-underline transition-colors"
              >
                Victor G
              </a>{" "}
              en Unsplash
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}