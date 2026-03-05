import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Heart,
  PawPrint,
  ArrowDown,
  Send,
  Loader2,
  CheckCircle2,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { SEO } from "../components/SEO";
import { getRescuers } from "../data/api";
import type { Rescuer } from "../data/types";

const HERO_IMG =
  "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeifjzhjkr7pkjbywne2cemthav3plevi4xofd3esmdbwd2pod7g2du/Zeus.png";

const BRAELIA_IMG =
  "https://scontent.flim20-1.fna.fbcdn.net/v/t39.30808-6/633276317_4277925302352897_4541785310514846509_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=LWwJrFLt_gAQ7kNvwETEFHF&_nc_oc=AdlLdM_Yz9YQ3ssnXxNp3SgbAP3Qmz5Lajjqg9zCIrSag193a5fI5BgVlsCi-kpX4uw&_nc_zt=23&_nc_ht=scontent.flim20-1.fna&_nc_gid=98TNn6JaqPi65GHpkNJgag&_nc_ss=8&oh=00_Afx7ZqSIU_h06t7BrLZ0snuHMarSWg35Lq1pp8ZXjCGa7Q&oe=69AF5B52";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.2v-3.46a4.85 4.85 0 01-2-.58z" />
    </svg>
  );
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ba60542a`;

const dogs = [
  {
    name: "Zeus",
    origin: "Adoptado de un refugio en Alemania",
    description: "Mi primer companero. Cruzo conmigo el oceano para empezar una nueva vida en Peru.",
    img: "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeifjzhjkr7pkjbywne2cemthav3plevi4xofd3esmdbwd2pod7g2du/Zeus2.png",
    flag: "DE",
  },
  {
    name: "Apollon",
    origin: "Rescatado de las calles de Peru hace ~7 anos",
    description: "Un callejero con alma de rey. Se gano mi corazon desde el primer momento.",
    img: "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeifjzhjkr7pkjbywne2cemthav3plevi4xofd3esmdbwd2pod7g2du/Apollon.png",
    flag: "PE",
  },
  {
    name: "Neptuna",
    origin: "La mas reciente integrante de la familia",
    description: "Ella fue la inspiracion directa para crear AdoptaMe.",
    img: "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeifjzhjkr7pkjbywne2cemthav3plevi4xofd3esmdbwd2pod7g2du/Neptuna.png",
    flag: "PE",
  },
];

export function SobreMiPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showHero, setShowHero] = useState(true);

  // Contact form
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Dynamic rescuer profile (Braelia)
  const [braelia, setBraelia] = useState<Rescuer | null>(null);

  useEffect(() => {
    getRescuers()
      .then((rescuers: Rescuer[]) => {
        const b = rescuers.find((r: Rescuer) => r.nombre === "Braelia Garcia Chuquihuanga");
        if (b) setBraelia(b);
      })
      .catch(() => { /* fallback to hardcoded */ });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setShowHero(y < window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shadeOpacity = Math.min(scrollY / 500, 0.85);
  const bgScale = 1 + scrollY * 0.0004;
  const titleOffset = scrollY * 0.2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al enviar mensaje");
      }
      setSent(true);
    } catch (err: any) {
      console.error("Error sending contact message:", err);
      setError(err.message || "Algo salio mal. Intentalo de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  return (
    <div>
      <SEO
        title="Sobre mi"
        description="Conoce a Stella, la creadora de AdoptaMe, y a Zeus, Apollon y Neptuna — los perros que inspiraron esta plataforma de adopcion animal en Peru."
        path="/sobre-mi"
      />
      {/* ===== Parallax Hero ===== */}
      <div className="relative h-[100vh] overflow-hidden" style={{ zIndex: 0 }}>
        {showHero && (
          <>
            {/* Background image — fixed, scales on scroll */}
            <div
              className="fixed inset-0 w-full h-screen bg-cover bg-center"
              style={{
                backgroundImage: `url(${HERO_IMG})`,
                transform: `scale(${bgScale})`,
                willChange: "transform",
              }}
            />

            {/* Dark overlay that fades in on scroll */}
            <div
              className="fixed inset-0 w-full h-screen bg-black"
              style={{ opacity: shadeOpacity }}
            />

            {/* Bottom gradient for text readability */}
            <div
              className="fixed inset-0 w-full h-screen"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 40%, transparent 70%)",
              }}
            />

            {/* Bottom-left aligned text */}
            <div
              className="fixed bottom-0 left-0 w-full"
              style={{ transform: `translateY(${titleOffset * -0.5}px)` }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">
                <div className="flex items-center gap-3 mb-4">
                  
                  <span
                    className="text-primary-foreground/70 uppercase tracking-widest"
                    style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em" }}
                  >
                    Sobre mi
                  </span>
                </div>
                <h1
                  className="text-primary-foreground mb-3"
                  style={{
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    fontWeight: 700,
                    lineHeight: 1.05,
                    maxWidth: "640px",
                  }}
                >
                  Este es Zeus
                </h1>
                <p
                  className="text-primary-foreground/70"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    lineHeight: 1.6,
                    maxWidth: "480px",
                  }}
                >
                  Y el es la razon por la que todo esto empezo
                </p>
                {/* Bouncing arrow below text */}
                <div className="mt-6 animate-bounce">
                  <ArrowDown className="w-6 h-6 text-primary-foreground/80" />
                </div>
              </div>
            </div>

            {/* ... remove old bouncing arrow ... */}
          </>
        )}
      </div>

      {/* ===== Content ===== */}
      <div className="relative bg-background" style={{ zIndex: 1 }}>
        <section className="bg-gradient-to-b from-[#FEF2ED] to-background px-[0px] py-[60px]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Greeting */}
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full mb-6"
                style={{ fontSize: "0.875rem", fontWeight: 500 }}
              >
                
                Mi historia
              </div>
              <h2
                className="text-foreground mb-6"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                Todo empezo con un perro de un refugio aleman
              </h2>
              <div
                className="space-y-5 text-muted-foreground"
                style={{ fontSize: "1.0625rem", lineHeight: 1.8 }}
              >
                <p>
                  Hola, mi nombre es{" "}
                  <span className="text-foreground" style={{ fontWeight: 500 }}>
                    Stella
                  </span>
                  . Vivo en Peru desde hace aproximadamente 9 anos, y cuando llegue no vine sola
                  — traje conmigo a{" "}
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    Zeus
                  </span>
                  , mi primer perro adoptado, rescatado de un refugio de animales en Alemania. El
                  fue mi companero de aventura hacia una nueva vida en un nuevo continente.
                </p>
                <p>
                  Poco despues de llegar, adopte a{" "}
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    Apollon
                  </span>
                  , un perrito callejero que encontre hace unos 7 anos aqui en Peru. Y mas
                  recientemente llego{" "}
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    Neptuna
                  </span>
                  . Los tres hacen que mi vida se sienta bendecida. Cada uno tiene su propia
                  personalidad, su propia historia de supervivencia, y juntos formamos una familia
                  ruidosa, peluda y feliz.
                </p>
              </div>
            </div>

            {/* ===== Three dog cards: Zeus, Apollon, Neptuna ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
              {dogs.map((dog) => (
                <div
                  key={dog.name}
                  className="rounded-3xl overflow-hidden bg-card border border-border hover:border-primary hover:-translate-y-1 transition-all duration-300"
                  style={{ boxShadow: "0 2px 16px rgba(180,140,110,0.08)" }}
                >
                  <div className="aspect-square overflow-hidden">
                    <ImageWithFallback
                      src={dog.img}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="text-foreground"
                        style={{ fontSize: "1.125rem", fontWeight: 600 }}
                      >
                        {dog.name}
                      </h4>
                      <span style={{ fontSize: "1rem" }}>
                        {dog.flag === "DE" ? "🇩🇪" : "🇵🇪"}
                      </span>
                    </div>
                    <p
                      className="text-primary mb-1.5"
                      style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                    >
                      {dog.origin}
                    </p>
                    <p
                      className="text-muted-foreground"
                      style={{ fontSize: "0.875rem", lineHeight: 1.5 }}
                    >
                      {dog.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* The realization */}
            <div className="mb-12">
              <h3
                className="text-foreground mb-5"
                style={{ fontSize: "1.375rem", fontWeight: 600 }}
              >
                El momento que cambio todo
              </h3>
              <div
                className="space-y-5 text-muted-foreground"
                style={{ fontSize: "1.0625rem", lineHeight: 1.8 }}
              >
                <p>
                  Recientemente, al adoptar a mi ultima perrita{" "}
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    Neptuna
                  </span>
                  , me involucre mas en como funciona la adopcion de animales aqui en Peru. Y me
                  entristecio descubrir que no existe un proceso formal que garantice la seguridad
                  tanto del animal como del adoptante.
                </p>
                <p>
                  Los rescatistas hacen un trabajo increible — muchas veces con sus propios
                  recursos, sin apoyo institucional, publicando en redes sociales con la esperanza
                  de que alguien vea la publicacion correcta en el momento correcto. Pero no hay
                  un lugar centralizado, no hay un sistema organizado. Y eso hace que muchos
                  animales esperen mas de lo necesario.
                </p>
              </div>
            </div>

            {/* Highlight quote */}
            <div
              className="p-8 rounded-3xl mb-12 border border-primary/20"
              style={{
                background: "linear-gradient(135deg, #FEF2ED 0%, #FFFAF7 100%)",
              }}
            >
              <p
                className="text-foreground text-center italic"
                style={{ fontSize: "1.25rem", lineHeight: 1.7, fontWeight: 500 }}
              >
                "Como mi experiencia es en diseno y desarrollo, decidi crear esta pagina para que
                sea un hogar mas centralizado aqui en Peru para la adopcion de animales."
              </p>
              <p
                className="text-primary text-center mt-4"
                style={{ fontWeight: 600 }}
              >
                — Stella
              </p>
            </div>

            {/* Braelia */}
            <div className="mb-12">
              <h3
                className="text-foreground mb-5"
                style={{ fontSize: "1.375rem", fontWeight: 600 }}
              >
                Los primeros en confiar
              </h3>
              <div
                className="space-y-5 text-muted-foreground"
                style={{ fontSize: "1.0625rem", lineHeight: 1.8 }}
              >
                <p>
                  Tuve la suerte de conocer a{" "}
                  <a
                    href="https://www.facebook.com/braelia.garciachuquihuanga"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 no-underline"
                    style={{ fontWeight: 500 }}
                  >
                    Braelia Garcia Chuquihuanga
                  </a>{" "}
                  y su adorable grupo de perritos listos para ser adoptados. Ella fue la primera
                  en confiar en esta plataforma y permitir que sus rescatados fueran publicados
                  aqui. Gracias a ella, AdoptaMe dejo de ser solo una idea.
                </p>

                {/* Profile card */}
                <div
                  className="p-6 rounded-2xl border border-border bg-card"
                  style={{ boxShadow: "0 2px 16px rgba(180,140,110,0.08)" }}
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-primary/20">
                      <ImageWithFallback
                        src={braelia?.foto || BRAELIA_IMG}
                        alt="Braelia Garcia Chuquihuanga"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-foreground mb-1"
                        style={{ fontSize: "1.0625rem", fontWeight: 600 }}
                      >
                        {braelia?.nombre || "Braelia Garcia Chuquihuanga"}
                      </h4>
                      <p
                        className="text-primary mb-3"
                        style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                      >
                        Rescatista independiente
                      </p>
                      <p
                        className="text-muted-foreground mb-4"
                        style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                      >
                        {braelia?.bio || "Braelia rescata, rehabilita y busca hogares para perritos en situacion de calle. Su dedicacion y amor por los animales fue lo que le dio vida a AdoptaMe."}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(braelia?.facebook || "braelia.garciachuquihuanga") && (
                          <a
                            href={`https://www.facebook.com/${braelia?.facebook || "braelia.garciachuquihuanga"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors no-underline"
                            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                          >
                            <Facebook className="w-3.5 h-3.5" />
                            Facebook
                          </a>
                        )}
                        {(braelia?.instagram || "braeliagarcia") && (
                          <a
                            href={`https://www.instagram.com/${braelia?.instagram || "braeliagarcia"}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors no-underline"
                            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                          >
                            <Instagram className="w-3.5 h-3.5" />
                            Instagram
                          </a>
                        )}
                        {(braelia?.tiktok || "brae1974") && (
                          <a
                            href={`https://www.tiktok.com/@${braelia?.tiktok || "brae1974"}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors no-underline"
                            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                          >
                            <TikTokIcon className="w-3.5 h-3.5" />
                            TikTok
                          </a>
                        )}
                      </div>
                      {(braelia?.donacion || "https://www.paypal.me/misrescataditos") && (
                        <a
                          href={braelia?.donacion || "https://www.paypal.me/misrescataditos"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-primary rounded-xl hover:bg-background hover:text-primary transition-colors no-underline"
                          style={{ fontSize: "0.8125rem", fontWeight: 500 }}
                        >
                          <Heart className="w-4 h-4" />
                          Apoyar a Braelia
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="mb-16">
              <h3
                className="text-foreground mb-5"
                style={{ fontSize: "1.375rem", fontWeight: 600 }}
              >
                Lo que espero para el futuro
              </h3>
              <div
                className="space-y-5 text-muted-foreground"
                style={{ fontSize: "1.0625rem", lineHeight: 1.8 }}
              >
                <p>
                  Espero que podamos convertir el proceso de adopcion en Peru en un esfuerzo
                  comunitario organizado y coordinado. Que podamos reparar donde el gobierno nos
                  falla — a nosotros y a esas cositas de cuatro patas
                  <span className="text-primary">
                    {" "}
                    (y a veces, tristemente, de menos)
                  </span>
                  .
                </p>
                <p>
                  AdoptaMe no es una empresa. No hay fines de lucro aqui. Es un proyecto hecho
                  con amor, codigo y la conviccion de que juntos podemos hacer algo mejor por los
                  animales que mas lo necesitan.
                </p>
              </div>
            </div>

            {/* ===== Apoya a AdoptaMe ===== */}
            <div
              className="mb-16 p-8 rounded-3xl border border-primary/20"
              style={{
                background: "linear-gradient(135deg, #FEF2ED 0%, #FFFAF7 100%)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                
                <h3
                  className="text-foreground"
                  style={{ fontSize: "1.25rem", fontWeight: 600 }}
                >
                  Apoya a AdoptaMe
                </h3>
              </div>
              <p
                className="text-muted-foreground mb-4"
                style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}
              >
                Mantener esta plataforma tiene costos reales: el dominio adoptame.pe, hosting,
                servicios de backend, almacenamiento de imagenes, envio de correos, y muchas horas
                de desarrollo y administracion. Si AdoptaMe te parece util y quieres que siga
                creciendo, cualquier aporte ayuda enormemente.
              </p>
              <a
                href="https://ko-fi.com/stellaachenbach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground border border-primary rounded-xl hover:bg-background hover:text-primary transition-colors no-underline"
                style={{ fontSize: "0.9375rem", fontWeight: 500 }}
              >
                <Heart className="w-4 h-4" />
                Invitame un cafe en Ko-fi
              </a>
              <p
                className="text-muted-foreground mt-3"
                style={{ fontSize: "0.75rem", lineHeight: 1.5 }}
              >
                100% de los aportes se destinan a mantener y mejorar la plataforma.
              </p>
            </div>

            {/* ===== Contact form ===== */}
            <div
              className="p-8 rounded-3xl border border-border bg-card"
              style={{ boxShadow: "0 2px 16px rgba(180,140,110,0.08)" }}
            >
              <h3
                className="text-foreground mb-2"
                style={{ fontSize: "1.25rem", fontWeight: 600 }}
              >
                Escribeme
              </h3>
              <p
                className="text-muted-foreground mb-6"
                style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
              >
                Ya sea para preguntas, sugerencias, o simplemente para saludar — me encantaria
                saber de ti.
              </p>

              {sent ? (
                <div className="p-8 bg-secondary border border-border rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h4
                    className="mb-2"
                    style={{ fontSize: "1.125rem", fontWeight: 600 }}
                  >
                    Mensaje enviado
                  </h4>
                  <p
                    className="text-muted-foreground"
                    style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
                  >
                    Gracias por escribirme. Revisare tu mensaje y te respondere lo antes
                    posible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block mb-1.5"
                        style={{ fontSize: "0.875rem", fontWeight: 500 }}
                      >
                        Tu nombre *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nombre completo"
                        value={form.nombre}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, nombre: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        className="block mb-1.5"
                        style={{ fontSize: "0.875rem", fontWeight: 500 }}
                      >
                        Tu correo *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-1.5"
                      style={{ fontSize: "0.875rem", fontWeight: 500 }}
                    >
                      Mensaje *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Cuentame lo que quieras..."
                      value={form.mensaje}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, mensaje: e.target.value }))
                      }
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  {error && (
                    <p
                      className="text-destructive"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl border border-primary hover:bg-transparent hover:text-primary transition-colors disabled:opacity-60"
                    style={{ fontWeight: 500, fontSize: "1rem" }}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar mensaje
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                <p
                  className="text-muted-foreground"
                  style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}
                >
                  <strong className="text-foreground">Nota:</strong> Si quieres publicar un
                  animal en adopcion, usa nuestro{" "}
                  <Link
                    to="/enviar"
                    className="text-primary hover:text-primary/80 no-underline"
                    style={{ fontWeight: 500 }}
                  >
                    formulario de envio
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}