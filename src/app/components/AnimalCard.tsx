import { Link } from "react-router";
import { MapPin, Calendar, AlertTriangle } from "lucide-react";
import type { Animal } from "../data/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AnimalCard({ animal }: { animal: Animal }) {
  const especieColor: Record<string, string> = {
    Perro: "bg-secondary text-primary",
    Gato: "bg-secondary text-primary",
    Conejo: "bg-secondary text-primary",
    Otro: "bg-secondary text-muted-foreground",
  };

  return (
    <Link
      to={`/animales/${animal.slug || animal.id}`}
      className="group block bg-card rounded-3xl border border-border overflow-hidden no-underline hover:-translate-y-1 hover:border-primary transition-all duration-300"
      style={{ boxShadow: "0 2px 16px rgba(180,140,110,0.08)" }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {animal.imagen ? (
          <ImageWithFallback
            src={animal.imagen}
            alt={animal.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span style={{ fontSize: "3rem" }}>🐾</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full backdrop-blur-sm ${especieColor[animal.especie] || especieColor.Otro}`}
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            {animal.especie}
          </span>
        </div>
        {animal.urgente && !animal.adoptado && (
          <div className="absolute top-3 right-3">
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive text-primary-foreground backdrop-blur-sm animate-pulse"
              style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.04em" }}
            >
              <AlertTriangle className="w-3 h-3" />
              URGENTE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-foreground">{animal.nombre}</h3>
          <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
            {animal.edad}
          </span>
        </div>
        <p className="text-muted-foreground mb-3" style={{ fontSize: "0.875rem" }}>
          {animal.raza} &middot; {animal.sexo} &middot; {animal.tamano}
        </p>
        <div className="flex items-center gap-4 text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {animal.ubicacion}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(animal.fechaPublicacion).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
        {/* Rescuer */}
        {animal.contactoNombre && (
          <p className="text-muted-foreground mt-2 truncate" style={{ fontSize: "0.75rem" }}>
            Cuidado por <span className="text-foreground" style={{ fontWeight: 500 }}>{animal.contactoNombre}</span>
          </p>
        )}
        {/* Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {animal.vacunado && (
            <span className="px-2 py-0.5 bg-secondary text-primary rounded-full" style={{ fontSize: "0.75rem" }}>
              Vacunado
            </span>
          )}
          {animal.esterilizado && (
            <span className="px-2 py-0.5 bg-secondary text-primary rounded-full" style={{ fontSize: "0.75rem" }}>
              Esterilizado
            </span>
          )}
          {animal.desparasitado && (
            <span className="px-2 py-0.5 bg-secondary text-primary rounded-full" style={{ fontSize: "0.75rem" }}>
              Desparasitado
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}