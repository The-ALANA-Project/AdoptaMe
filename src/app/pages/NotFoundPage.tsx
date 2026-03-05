import { Link } from "react-router";
import { Home, Search } from "lucide-react";
import { SEO } from "../components/SEO";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <SEO
        title="Pagina no encontrada"
        description="La pagina que buscas no existe o fue movida. Explora los animales disponibles para adopcion en Peru o vuelve al inicio de AdoptaMe."
        path="/404"
      />
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Pagina no encontrada
        </h1>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la pagina que buscas no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-background hover:text-primary border border-primary transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
          <Link
            to="/animales"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-background text-primary font-semibold rounded-xl border border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Search className="w-4 h-4" />
            Ver animales
          </Link>
        </div>
      </div>
    </div>
  );
}