import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Home, Search } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function ErrorBoundaryPage() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <p className="text-7xl font-bold text-primary mb-4">
            {is404 ? "404" : "Error"}
          </p>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            {is404
              ? "Pagina no encontrada"
              : "Algo salio mal"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {is404
              ? "Lo sentimos, la pagina que buscas no existe o fue movida."
              : "Ha ocurrido un error inesperado. Por favor, intenta de nuevo."}
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
      </main>
      <Footer />
    </div>
  );
}