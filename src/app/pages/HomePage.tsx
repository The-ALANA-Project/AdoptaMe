import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { Heart, Search, Users, ShieldCheck, ArrowRight, PawPrint, Loader2, MessageCircle, Home, Send, AlertTriangle } from "lucide-react";
import { getAnimals } from "../data/api";
import type { Animal } from "../data/types";
import { AnimalCard } from "../components/AnimalCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { SEO } from "../components/SEO";

export function HomePage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    getAnimals()
      .then((data) => setAnimals(data))
      .catch((err) => console.error("Error loading animals:", err))
      .finally(() => setLoading(false));
  }, []);

  // Randomized hero slideshow from actual animals with images
  const heroAnimals = animals.filter((a) => a.imagen).slice(0, 6);

  useEffect(() => {
    if (heroAnimals.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroAnimals.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroAnimals.length]);

  const featured = animals.slice(0, 6);

  // 3 random non-adopted animals for the mid-page showcase
  // Urgent animals get priority, then fill remaining slots with random available
  const showcaseAnimals = useMemo(() => {
    const available = animals.filter((a) => !a.adoptado && a.imagen);
    const urgent = available.filter((a) => a.urgente);
    const nonUrgent = available.filter((a) => !a.urgente);
    const shuffledNonUrgent = [...nonUrgent].sort(() => Math.random() - 0.5);
    // Show all urgent first, then fill up to 3 total with random non-urgent
    const result = [...urgent, ...shuffledNonUrgent].slice(0, 3);
    return result;
  }, [animals]);

  const hasUrgent = showcaseAnimals.some((a) => a.urgente);

  return (
    <div>
      <SEO
        title="Inicio"
        description="Encuentra a tu companero ideal. Plataforma comunitaria de adopcion animal en Peru. Perros y gatos rescatados buscan un hogar."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "AdoptaMe",
            url: "https://adoptame.pe",
            logo: "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png",
            description: "Plataforma comunitaria de adopcion animal en Peru",
            areaServed: { "@type": "Country", name: "Peru" },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "AdoptaMe",
            url: "https://adoptame.pe",
            description: "Encuentra a tu companero ideal. Plataforma comunitaria de adopcion animal en Peru.",
            inLanguage: "es",
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: "https://adoptame.pe/animales?q={search_term_string}" },
              "query-input": "required name=search_term_string",
            },
          },
        ]}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-secondary" />
        {/* Decorative blobs */}
        <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-60px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-secondary/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left - Text */}
            <div>
              
              <h1
                className="text-foreground mb-4"
                style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 700, lineHeight: 1.15 }}
              >
                Dale un hogar a quien{" "}
                <span className="text-primary">mas lo necesita</span>
              </h1>
              <p
                className="text-muted-foreground mb-8 max-w-lg"
                style={{ fontSize: "1.125rem", lineHeight: 1.7 }}
              >
                Conectamos a personas que rescatan animales con familias
                dispuestas a adoptarlos. Sin refugios oficiales, la comunidad
                somos nosotros.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/animales"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl no-underline border border-primary hover:bg-transparent hover:text-primary transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Search className="w-4 h-4" />
                  Buscar animales
                </Link>
                <Link
                  to="/enviar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-background text-foreground border border-border rounded-xl no-underline hover:bg-muted transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Heart className="w-4 h-4" />
                  Publicar un rescate
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-start mt-10">
                <div className="flex-1">
                  <p className="text-primary" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    {animals.length || "—"}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                    Animales publicados
                  </p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-primary" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    100%
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                    Comunitario
                  </p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 text-right">
                  <p className="text-primary" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                    {animals.filter((a) => a.adoptado).length}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                    Adoptados exitosamente
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Hero image */}
            <div className="relative flex justify-center">
              {/* Decorative warm shape behind */}
              <div className="absolute inset-4 lg:inset-0 bg-primary/8 rounded-[2.5rem] rotate-3" />
              <div className="absolute inset-4 lg:inset-0 bg-primary/8 rounded-[2.5rem] -rotate-2 translate-x-2" />

              {/* Main image */}
              <div className="relative w-full max-w-md lg:max-w-full">
                <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 aspect-[4/5]">
                  {heroAnimals.length > 0 && (
                    <Link
                      to={`/animales/${heroAnimals[heroIndex]?.slug || heroAnimals[heroIndex]?.id}`}
                      className="block w-full h-full relative"
                    >
                      {heroAnimals.map((animal, i) => (
                        <ImageWithFallback
                          key={animal.id}
                          src={animal.imagen}
                          alt={animal.nombre}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                          style={{ opacity: i === heroIndex ? 1 : 0 }}
                        />
                      ))}
                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 pt-16">
                        <p className="text-primary-foreground" style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                          {heroAnimals[heroIndex]?.nombre}
                        </p>
                        <p className="text-primary-foreground/75" style={{ fontSize: "0.8125rem" }}>
                          {heroAnimals[heroIndex]?.raza} &middot; {heroAnimals[heroIndex]?.ubicacion}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Slideshow dots */}
                {heroAnimals.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {heroAnimals.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIndex(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === heroIndex
                            ? "w-6 h-2 bg-primary"
                            : "w-2 h-2 bg-primary/25 hover:bg-primary/40"
                        }`}
                        aria-label={`Ver animal ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Floating card */}
                

                {/* Floating mini image */}
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-[0px] py-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full mb-5"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              
              Proceso de adopcion
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>
              Como funciona AdoptaMe
            </h2>
            <p
              className="text-muted-foreground mt-3 max-w-xl"
              style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}
            >
              Un proceso sencillo y transparente para que animales rescatados encuentren un hogar amoroso
            </p>
          </div>

          {/* Adoption steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Search,
                title: "1. Explora",
                desc: "Navega por los perfiles de animales disponibles. Usa los filtros para encontrar al companero ideal segun especie, tamano, ubicacion y mas.",
              },
              {
                icon: MessageCircle,
                title: "2. Conecta",
                desc: "Envia una solicitud de adopcion desde el perfil del animal. Nosotros la revisamos y conectamos a ambas partes de forma segura.",
              },
              {
                icon: Users,
                title: "3. Conoce",
                desc: "Coordina una visita para conocer al animal en persona. Es importante que ambos se sientan comodos antes de formalizar la adopcion.",
              },
              {
                icon: Home,
                title: "4. Adopta",
                desc: "Si todo sale bien, formaliza la adopcion. Prepara tu hogar con lo necesario y dale la bienvenida a tu nuevo companero de vida.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-card border border-border hover:border-primary hover:shadow-md transition-all duration-300"
                style={{ boxShadow: "0 2px 12px rgba(180,140,110,0.06)" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4"
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="mb-2" style={{ fontSize: "1.0625rem" }}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground" style={{ fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page showcase: random available animals */}
      {!loading && showcaseAnimals.length > 0 && (
        <section className="bg-secondary/40 px-[0px] py-[60px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                {hasUrgent ? (
                  <>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full mb-3 animate-pulse"
                      style={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Casos urgentes
                    </div>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>
                      Necesitan un hogar urgente
                    </h2>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "1.0625rem" }}>
                      Estos animales estan en situacion critica y necesitan ser adoptados lo antes posible
                    </p>
                  </>
                ) : (
                  <>
                    <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>
                      Conoce a algunos de ellos
                    </h2>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: "1.0625rem" }}>
                      Animales que buscan un hogar ahora mismo
                    </p>
                  </>
                )}
              </div>
              <Link
                to="/animales"
                className="hidden sm:inline-flex items-center gap-1 text-primary no-underline hover:underline"
                style={{ fontWeight: 500 }}
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {showcaseAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                to="/animales"
                className="inline-flex items-center gap-1 text-primary no-underline"
                style={{ fontWeight: 500 }}
              >
                Ver todos los animales
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Rescataste un animal? */}
      <section className="px-[0px] py-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full mb-5"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              
              Para rescatistas
            </div>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 600 }}>
              Rescataste un animal?
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Asi de facil es publicarlo en AdoptaMe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Send,
                title: "Envia los datos",
                desc: "Llena el formulario con la informacion del animal: nombre, especie, edad, ubicacion, estado de salud y tus datos de contacto. No necesitas crear una cuenta.",
              },
              {
                icon: ShieldCheck,
                title: "Nosotros revisamos",
                desc: "Nuestro equipo revisa cada envio para asegurar que la informacion sea completa y veridica antes de publicarlo.",
              },
              {
                icon: Heart,
                title: "Se publica",
                desc: "Una vez aprobado, el animal aparece en la plataforma y la comunidad puede enviar solicitudes de adopcion que nosotros mediamos.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 bg-card border border-border rounded-3xl hover:border-primary transition-colors"
                style={{ boxShadow: "0 2px 12px rgba(180,140,110,0.06)" }}
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h4 className="mb-2">{s.title}</h4>
                <p className="text-muted-foreground" style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/enviar"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-xl no-underline border border-primary hover:bg-transparent hover:text-primary transition-colors"
              style={{ fontWeight: 600 }}
            >
              <PawPrint className="w-5 h-5" />
              Publicar un animal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}