import { useParams, Link } from "react-router";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Share2,
  Loader2,
  Heart,
  Send,
  X,
  Instagram,
  User,
  Home,
  PawPrint,
  Linkedin,
  Facebook,
  ChevronDown,
} from "lucide-react";
import { getAnimals, getAnimal, submitInquiry } from "../data/api";
import type { Animal } from "../data/types";
import { AnimalCard } from "../components/AnimalCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";

// Social share icons as inline SVGs for reliability
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// --- JSON-LD structured data for animal profiles ---
function AnimalJsonLd({ animal }: { animal: Animal }) {
  const siteUrl = "https://adoptame.pe";
  const profileUrl = `${siteUrl}/animales/${animal.slug || animal.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: animal.nombre,
    description: `${animal.nombre} es un ${animal.especie.toLowerCase()} ${animal.raza.toLowerCase()}, ${animal.edad}, en ${animal.ubicacion}. ${animal.descripcion.slice(0, 200)}`,
    image: animal.imagen,
    url: profileUrl,
    brand: {
      "@type": "Organization",
      name: "AdoptaMe",
      url: siteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PEN",
      availability: animal.adoptado
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: profileUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function AnimalDetailPage() {
  const { id } = useParams();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [related, setRelated] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Share menu
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Inquiry form state
  const [showForm, setShowForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquiry, setInquiry] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    departamento: "",
    provincia: "",
    distrito: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    vivienda: "",
    otrasMascotas: "",
    experiencia: "",
    mensaje: "",
    compromiso: false,
    seguimiento: false,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    setShowForm(false);
    setInquirySubmitted(false);

    getAnimal(id)
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setAnimal(data);
        return getAnimals().then((all: Animal[]) => {
          setRelated(
            all
              .filter((a) => a.id !== data.id && a.especie === data.especie)
              .slice(0, 3)
          );
        });
      })
      .catch((err) => {
        console.error("Error loading animal:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Close share menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    }
    if (showShareMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showShareMenu]);

  const getShareUrl = () => {
    const base = window.location.origin;
    return `${base}/animales/${animal?.slug || animal?.id || id}`;
  };

  const shareText = () => {
    if (!animal) return "";
    return `${animal.nombre} busca hogar! ${animal.especie} ${animal.raza}, ${animal.edad}, en ${animal.ubicacion}. Ayudalo a encontrar una familia.`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = animal
    ? [
        {
          label: "X (Twitter)",
          icon: <TwitterIcon className="w-4 h-4" />,
          href: `https://x.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(getShareUrl())}`,
          color: "hover:bg-secondary",
        },
        {
          label: "Facebook",
          icon: <FacebookIcon className="w-4 h-4" />,
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
          color: "hover:bg-secondary",
        },
        {
          label: "LinkedIn",
          icon: <LinkedInIcon className="w-4 h-4" />,
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
          color: "hover:bg-secondary",
        },
        {
          label: "WhatsApp",
          icon: <WhatsAppIcon className="w-4 h-4" />,
          href: `https://wa.me/?text=${encodeURIComponent(`${shareText()} ${getShareUrl()}`)}`,
          color: "hover:bg-secondary",
        },
      ]
    : [];

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animal) return;
    if (!inquiry.compromiso) {
      setInquiryError("Debes aceptar el compromiso de adopcion responsable para continuar.");
      return;
    }
    if (!inquiry.seguimiento) {
      setInquiryError("Debes aceptar el seguimiento post-adopcion para continuar.");
      return;
    }
    setInquiryError("");
    setInquiryLoading(true);
    try {
      await submitInquiry({
        animalId: animal.id,
        animalNombre: animal.nombre,
        nombre: inquiry.nombre,
        email: inquiry.email,
        telefono: inquiry.telefono,
        tipoDocumento: inquiry.tipoDocumento,
        numeroDocumento: inquiry.numeroDocumento,
        departamento: inquiry.departamento,
        provincia: inquiry.provincia,
        distrito: inquiry.distrito,
        linkedin: inquiry.linkedin,
        facebook: inquiry.facebook,
        instagram: inquiry.instagram,
        vivienda: inquiry.vivienda,
        otrasMascotas: inquiry.otrasMascotas,
        experiencia: inquiry.experiencia,
        mensaje: inquiry.mensaje,
        seguimiento: inquiry.seguimiento,
      });
      setInquirySubmitted(true);
    } catch (err: any) {
      console.error("Error submitting inquiry:", err);
      setInquiryError(err.message || "Ocurrio un error. Intenta de nuevo.");
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <span className="ml-3 text-muted-foreground">Cargando...</span>
      </div>
    );
  }

  if (notFound || !animal) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2>Animal no encontrado</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          El animal que buscas no existe o fue removido.
        </p>
        <Link
          to="/animales"
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a buscar
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const selectClass =
    `${inputClass} pr-12 appearance-none cursor-pointer`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <SEO
        title={`${animal.nombre} busca hogar`}
        description={`${animal.nombre} es un ${animal.especie.toLowerCase()} ${animal.raza.toLowerCase()}, ${animal.edad}, en ${animal.ubicacion}. Conocelo y dale un hogar.`}
        path={`/animales/${animal.slug || animal.id}`}
        image={animal.imagen}
      />
      <AnimalJsonLd animal={animal} />
      {/* Back */}
      <Link
        to="/animales"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground no-underline mb-6"
        style={{ fontSize: "0.875rem" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a resultados
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image — portrait format */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl overflow-hidden bg-muted">
            {animal.imagen ? (
              <ImageWithFallback
                src={animal.imagen}
                alt={animal.nombre}
                className="w-full h-auto block"
              />
            ) : (
              <div className="w-full aspect-[4/5] flex items-center justify-center">
                <span style={{ fontSize: "5rem" }}>🐾</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>{animal.nombre}</h1>
              {animal.adoptado && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-primary border border-border rounded-full mt-2" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Adoptado exitosamente
                </div>
              )}
            </div>
          </div>

          <p
            className="text-muted-foreground mb-6"
            style={{ fontSize: "1.0625rem" }}
          >
            {animal.raza} &middot; {animal.sexo} &middot; {animal.tamano}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                Edad
              </p>
              <p style={{ fontWeight: 500 }}>{animal.edad}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-xl">
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                Especie
              </p>
              <p style={{ fontWeight: 500 }}>{animal.especie}</p>
            </div>
          </div>

          {/* Health tags */}
          <div className="flex gap-2 flex-wrap mb-6">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${animal.vacunado ? 'bg-secondary text-primary' : 'bg-muted/50 text-muted-foreground'}`} style={{ fontSize: "0.75rem" }}>
              {animal.vacunado ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              Vacunado
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${animal.esterilizado ? 'bg-secondary text-primary' : 'bg-muted/50 text-muted-foreground'}`} style={{ fontSize: "0.75rem" }}>
              {animal.esterilizado ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              Esterilizado
            </span>
            {animal.desparasitado !== undefined && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${animal.desparasitado ? 'bg-secondary text-primary' : 'bg-muted/50 text-muted-foreground'}`} style={{ fontSize: "0.75rem" }}>
                {animal.desparasitado ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                Desparasitado
              </span>
            )}
          </div>

          {/* Location + date */}
          <div
            className="flex items-center gap-4 text-muted-foreground mb-6"
            style={{ fontSize: "0.875rem" }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {animal.ubicacion}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(animal.fechaPublicacion).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2">Acerca de {animal.nombre}</h3>
            <p
              className="text-muted-foreground"
              style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}
            >
              {animal.descripcion}
            </p>
          </div>

          {/* Rescuer / caretaker profile */}
          {animal.contactoNombre && (
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-muted-foreground mb-2" style={{ fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Bajo el cuidado de
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p style={{ fontWeight: 500 }}>{animal.contactoNombre}</p>
                  {animal.contactoInstagram && (
                    <a
                      href={`https://www.instagram.com/${animal.contactoInstagram.replace("@", "")}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors no-underline"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      @{animal.contactoInstagram.replace("@", "")}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Social share bar (compact inline version) */}
          <div className="flex items-center gap-2 mb-6 p-3 bg-muted/30 rounded-xl">
            <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
              Compartir:
            </span>
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
            <button
              onClick={handleCopyLink}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
              title={copied ? "Copiado!" : "Copiar enlace"}
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="text-primary" style={{ fontSize: "0.75rem" }}>
                Copiado!
              </span>
            )}
          </div>

          {/* Adoption inquiry section */}
          {animal.adoptado ? (
            <div className="p-6 bg-secondary border border-border rounded-2xl text-center">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="mb-1" style={{ fontSize: "1.125rem" }}>
                {animal.nombre} ya fue adoptado
              </h3>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
              >
                Este animal ya encontro un hogar amoroso. Pero hay muchos mas esperando por ti!
              </p>
              <Link
                to="/animales"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl no-underline hover:opacity-90 transition-opacity"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                Ver otros animales
              </Link>
            </div>
          ) : inquirySubmitted ? (
            <div className="p-6 bg-secondary border border-border rounded-2xl text-center">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="mb-1" style={{ fontSize: "1.125rem" }}>
                Solicitud enviada
              </h3>
              <p
                className="text-muted-foreground"
                style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
              >
                Recibimos tu interes en adoptar a {animal.nombre}. Revisaremos tu
                solicitud y te contactaremos pronto para coordinar los
                siguientes pasos.
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowForm(true);
                setTimeout(() => {
                  document.getElementById("adoption-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              style={{ fontWeight: 500, fontSize: "1.0625rem" }}
            >
              <Heart className="w-5 h-5" />
              Quiero adoptar a {animal.nombre}
            </button>
          )}
        </div>
      </div>

      {/* ===== Full-width Adoption Inquiry Form ===== */}
      {!animal.adoptado && showForm && !inquirySubmitted && (
        <div id="adoption-form" className="mt-12 scroll-mt-24">
          <div className="p-6 sm:p-8 lg:p-10 bg-card border border-border rounded-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                
                <h2 className="text-left" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                  Solicitud de adopcion para {animal.nombre}
                </h2>
                <p
                  className="text-muted-foreground mt-2 text-left"
                  style={{ fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "560px" }}
                >
                  Queremos asegurarnos de que {animal.nombre} llegue al mejor hogar posible.
                  Completa este formulario y revisaremos tu solicitud para ponerte en contacto con su rescatista.
                </p>
              </div>

              {inquiryError && (
                <div
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6 text-destructive text-center"
                  style={{ fontSize: "0.875rem" }}
                >
                  {inquiryError}
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-8">
                {/* Section 1: Contact info */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    
                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Tus datos de contacto</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Tu nombre y apellido"
                        value={inquiry.nombre}
                        onChange={(e) => setInquiry((p) => ({ ...p, nombre: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Correo electronico
                      </label>
                      <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={inquiry.email}
                        onChange={(e) => setInquiry((p) => ({ ...p, email: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Telefono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+51 999 999 999"
                        value={inquiry.telefono}
                        onChange={(e) => setInquiry((p) => ({ ...p, telefono: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Tipo de documento
                      </label>
                      <div className="relative">
                        <select
                          value={inquiry.tipoDocumento}
                          onChange={(e) => setInquiry((p) => ({ ...p, tipoDocumento: e.target.value }))}
                          className={selectClass}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="DNI">DNI</option>
                          <option value="CE">CE (Carnet de Extranjeria)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    {inquiry.tipoDocumento && (
                      <div>
                        <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                          Numero de {inquiry.tipoDocumento}
                        </label>
                        <input
                          type="text"
                          placeholder={inquiry.tipoDocumento === "DNI" ? "12345678" : "001234567890"}
                          value={inquiry.numeroDocumento}
                          onChange={(e) => setInquiry((p) => ({ ...p, numeroDocumento: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Departamento
                      </label>
                      <input
                        type="text"
                        placeholder="Lima"
                        value={inquiry.departamento}
                        onChange={(e) => setInquiry((p) => ({ ...p, departamento: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Provincia
                      </label>
                      <input
                        type="text"
                        placeholder="Lima"
                        value={inquiry.provincia}
                        onChange={(e) => setInquiry((p) => ({ ...p, provincia: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Distrito
                      </label>
                      <input
                        type="text"
                        placeholder="Lima"
                        value={inquiry.distrito}
                        onChange={(e) => setInquiry((p) => ({ ...p, distrito: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Social profiles */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    
                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Tus redes sociales</h3>
                  </div>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    Opcional, pero nos ayuda a conocerte mejor y agilizar el proceso.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.875rem" }}>
                        <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/tu-perfil"
                        value={inquiry.linkedin}
                        onChange={(e) => setInquiry((p) => ({ ...p, linkedin: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.875rem" }}>
                        <Facebook className="w-3.5 h-3.5 text-muted-foreground" />
                        Facebook
                      </label>
                      <input
                        type="text"
                        placeholder="Tu nombre o enlace de perfil"
                        value={inquiry.facebook}
                        onChange={(e) => setInquiry((p) => ({ ...p, facebook: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.875rem" }}>
                        <Instagram className="w-3.5 h-3.5 text-muted-foreground" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        placeholder="@tu_usuario"
                        value={inquiry.instagram}
                        onChange={(e) => setInquiry((p) => ({ ...p, instagram: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Home situation */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    
                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Tu hogar</h3>
                  </div>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
                    Esto nos ayuda a evaluar la compatibilidad con {animal.nombre}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Tipo de vivienda
                      </label>
                      <div className="relative">
                        <select
                          value={inquiry.vivienda}
                          onChange={(e) => setInquiry((p) => ({ ...p, vivienda: e.target.value }))}
                          className={selectClass}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Casa propia">Casa propia</option>
                          <option value="Casa alquilada">Casa alquilada</option>
                          <option value="Departamento propio">Departamento propio</option>
                          <option value="Departamento alquilado">Departamento alquilado</option>
                          <option value="Otro">Otro</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Otras mascotas en casa
                      </label>
                      <div className="relative">
                        <select
                          value={inquiry.otrasMascotas}
                          onChange={(e) => setInquiry((p) => ({ ...p, otrasMascotas: e.target.value }))}
                          className={selectClass}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Ninguna">Ninguna</option>
                          <option value="1 perro">1 perro</option>
                          <option value="2+ perros">2+ perros</option>
                          <option value="1 gato">1 gato</option>
                          <option value="2+ gatos">2+ gatos</option>
                          <option value="Perros y gatos">Perros y gatos</option>
                          <option value="Otro tipo">Otro tipo de mascota</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                        Experiencia con mascotas
                      </label>
                      <div className="relative">
                        <select
                          value={inquiry.experiencia}
                          onChange={(e) => setInquiry((p) => ({ ...p, experiencia: e.target.value }))}
                          className={selectClass}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Primera vez">Es mi primera mascota</option>
                          <option value="He tenido antes">He tenido mascotas antes</option>
                          <option value="Tengo actualmente">Tengo mascotas actualmente</option>
                          <option value="Experiencia profesional">Experiencia profesional con animales</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Motivation */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    
                    <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Tu motivacion</h3>
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "0.875rem" }}>
                      Por que quieres adoptar a {animal.nombre}? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Cuentanos sobre ti, tu estilo de vida, tu hogar y por que te gustaria darle un hogar a este animal. Mientras mas detalle, mejor podemos evaluar tu solicitud."
                      value={inquiry.mensaje}
                      onChange={(e) => setInquiry((p) => ({ ...p, mensaje: e.target.value }))}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                {/* Commitment disclaimer */}
                <div className="p-5 bg-secondary border border-border rounded-xl">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="compromiso"
                      checked={inquiry.compromiso}
                      onChange={(e) => setInquiry((p) => ({ ...p, compromiso: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary flex-shrink-0"
                    />
                    <label htmlFor="compromiso" className="cursor-pointer" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 600 }}>Entiendo que adoptar es un compromiso serio.</span>{" "}
                      <span className="text-muted-foreground">
                        Adoptar un animal requiere tiempo, paciencia, atencion y recursos economicos para su alimentacion, salud y bienestar.
                        Me comprometo a brindarle un hogar responsable y permanente, y entiendo que el equipo de AdoptaMe
                        se reserva el derecho de evaluar y rechazar solicitudes si considera que no es un match adecuado.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Post-adoption follow-up */}
                <div className="p-5 bg-secondary border border-border rounded-xl">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="seguimiento"
                      checked={inquiry.seguimiento}
                      onChange={(e) => setInquiry((p) => ({ ...p, seguimiento: e.target.checked }))}
                      className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary flex-shrink-0"
                    />
                    <label htmlFor="seguimiento" className="cursor-pointer" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 600 }}>Acepto el seguimiento post-adopcion.</span>{" "}
                      <span className="text-muted-foreground">
                        Entiendo que AdoptaMe puede contactarme para verificar el bienestar de {animal.nombre} en su nuevo hogar.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Privacy note + submit */}
                <div>
                  <p
                    className="text-muted-foreground mb-4"
                    style={{ fontSize: "0.75rem", lineHeight: 1.5 }}
                  >
                    Tus datos solo seran compartidos con el rescatista una vez aprobada la solicitud.
                    Al enviar este formulario aceptas nuestra{" "}
                    <Link to="/privacidad" className="text-primary hover:underline">politica de privacidad</Link>.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={inquiryLoading || !inquiry.compromiso || !inquiry.seguimiento}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ fontWeight: 500, fontSize: "1rem" }}
                    >
                      {inquiryLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Enviando solicitud...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar solicitud de adopcion
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3.5 border border-border rounded-xl hover:bg-muted transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            Mas {animal.especie.toLowerCase()}s en adopcion
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <AnimalCard key={a.id} animal={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}