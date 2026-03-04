import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2, PawPrint } from "lucide-react";
import { Link } from "react-router";
import { getAnimals } from "../data/api";
import type { Animal } from "../data/types";
import { AnimalCard } from "../components/AnimalCard";
import { SEO } from "../components/SEO";

export function BrowsePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [especie, setEspecie] = useState("Todos");
  const [tamano, setTamano] = useState("Todos");
  const [sexo, setSexo] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getAnimals()
      .then((data) => {
        // Shuffle animals randomly on each page load
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setAnimals(shuffled);
      })
      .catch((err) => console.error("Error loading animals:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return animals.filter((a) => {
      const matchSearch =
        !search ||
        a.nombre.toLowerCase().includes(search.toLowerCase()) ||
        a.raza.toLowerCase().includes(search.toLowerCase()) ||
        a.ubicacion.toLowerCase().includes(search.toLowerCase());
      const matchEspecie = especie === "Todos" || a.especie === especie;
      const matchTamano = tamano === "Todos" || a.tamano === tamano;
      const matchSexo = sexo === "Todos" || a.sexo === sexo;
      return matchSearch && matchEspecie && matchTamano && matchSexo;
    });
  }, [animals, search, especie, tamano, sexo]);

  const hasActiveFilters = especie !== "Todos" || tamano !== "Todos" || sexo !== "Todos";

  const clearFilters = () => {
    setEspecie("Todos");
    setTamano("Todos");
    setSexo("Todos");
    setSearch("");
  };

  const selectClass =
    "px-4 py-2.5 bg-input-background border border-border rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <SEO
        title="Animales en adopcion"
        description="Explora perros, gatos y otros animales rescatados disponibles para adopcion en Peru. Filtra por especie, tamano y sexo."
        path="/animales"
      />
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Animales en adopcion</h1>
        <p className="text-muted-foreground mt-1" style={{ fontSize: "1.0625rem" }}>
          Encuentra a tu proximo companero de vida
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, raza o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-input-background border border-border rounded-xl"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>
      </div>

      {/* Filters */}
      <div className={`${showFilters ? "block" : "hidden"} md:block mb-8`}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select value={especie} onChange={(e) => setEspecie(e.target.value)} className={selectClass}>
            <option value="Todos">Todas las especies</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
            <option value="Conejo">Conejos</option>
            <option value="Otro">Otros</option>
          </select>

          <select value={tamano} onChange={(e) => setTamano(e.target.value)} className={selectClass}>
            <option value="Todos">Todos los tamanos</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>

          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={selectClass}>
            <option value="Todos">Todos los sexos</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontSize: "0.875rem" }}
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">Cargando animales...</span>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-muted-foreground mb-6" style={{ fontSize: "0.875rem" }}>
            {filtered.length} {filtered.length === 1 ? "animal encontrado" : "animales encontrados"}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          ) : animals.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <p style={{ fontSize: "2.5rem" }} className="mb-3">🐾</p>
              <h3 className="mb-2">Aun no hay animales publicados</h3>
              <p className="text-muted-foreground mb-5" style={{ fontSize: "0.9375rem" }}>
                Se el primero en enviar un animal para adopcion
              </p>
              <Link
                to="/enviar"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl no-underline hover:opacity-90"
              >
                <PawPrint className="w-4 h-4" />
                Enviar animal
              </Link>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="mb-2">No se encontraron resultados</h3>
              <p className="text-muted-foreground" style={{ fontSize: "0.9375rem" }}>
                Intenta con otros filtros o terminos de busqueda
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}