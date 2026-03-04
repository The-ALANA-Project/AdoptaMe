import { useState } from "react";
import { Upload, PawPrint, CheckCircle2, Loader2, ImagePlus, X } from "lucide-react";
import { Link } from "react-router";
import { submitAnimal, uploadImage } from "../data/api";
import { SEO } from "../components/SEO";

export function SubmitAnimalPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    sexo: "",
    tamano: "",
    ubicacion: "",
    descripcion: "",
    imagen: "",
    vacunado: false,
    esterilizado: false,
    desparasitado: false,
    contactoNombre: "",
    contactoEmail: "",
    contactoWhatsapp: "",
    contactoSobreTi: "",
    contactoInstagram: "",
    contactoFacebook: "",
    contactoTiktok: "",
    contactoWeb: "",
  });

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    setError("");
    try {
      const url = await uploadImage(file);
      update("imagen", url);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError("Error al subir la imagen. Puedes pegar un enlace manualmente.");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const clearImage = () => {
    update("imagen", "");
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitAnimal(form);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting animal:", err);
      setError(err.message || "Ocurrio un error al enviar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
  const selectClass =
    "w-full px-4 py-3 bg-input-background border border-border rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Envio recibido</h1>
        <p className="text-muted-foreground mt-3 mb-8" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
          Revisaremos los datos del animal y lo publicaremos lo antes posible. Gracias por ayudar a encontrar un hogar para un amigo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/animales"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl no-underline hover:opacity-90 transition-opacity"
          >
            Ver animales
          </Link>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                nombre: "",
                especie: "",
                raza: "",
                edad: "",
                sexo: "",
                tamano: "",
                ubicacion: "",
                descripcion: "",
                imagen: "",
                vacunado: false,
                esterilizado: false,
                desparasitado: false,
                contactoNombre: "",
                contactoEmail: "",
                contactoWhatsapp: "",
                contactoSobreTi: "",
                contactoInstagram: "",
                contactoFacebook: "",
                contactoTiktok: "",
                contactoWeb: "",
              });
            }}
            className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
          >
            Enviar otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <SEO
        title="Publicar un animal"
        description="Envia los datos de un animal rescatado para que la comunidad pueda adoptarlo. Sin cuentas, sin complicaciones."
        path="/enviar"
      />
      <div className="mb-8">
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Publicar un animal</h1>
        <p className="text-muted-foreground mt-1" style={{ fontSize: "1.0625rem" }}>
          Completa los datos del animal. Nuestro equipo lo revisara y publicara para que la comunidad pueda adoptarlo.
        </p>
      </div>

      {/* Info banner */}
      <div className="p-4 bg-primary/5 border border-primary rounded-xl mb-8 flex gap-3">
        
        <div>
          <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>No necesitas crear una cuenta</p>
          <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
            Solo deja tus datos de contacto y nosotros nos encargamos de publicar al animal una vez revisado.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6 text-destructive" style={{ fontSize: "0.875rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Animal info */}
        <div className="pb-2">
          <h3 className="mb-4 pb-2 border-b border-primary">Datos del animal</h3>
        </div>

        {/* Photo URL */}
        <div>
          <label className="block mb-2">Foto del animal (URL)</label>
          <input
            type="url"
            placeholder="https://ejemplo.com/foto-del-animal.jpg"
            value={form.imagen}
            onChange={(e) => update("imagen", e.target.value)}
            className={inputClass}
          />
          <p className="text-muted-foreground mt-1.5" style={{ fontSize: "0.8125rem" }}>
            Pega un enlace a una foto del animal (puedes subirla a Google Drive, Imgur, etc.)
          </p>
        </div>

        {/* Upload photo */}
        <div className="relative">
          <label className="block mb-2">Subir foto del animal</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="animal-image-upload"
            />
            <label
              htmlFor="animal-image-upload"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl no-underline hover:opacity-90 transition-opacity cursor-pointer"
            >
              <ImagePlus className="w-5 h-5" />
              Subir
            </label>
            {uploadingImage && (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-destructive text-primary-foreground rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Name + species */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nombre *</label>
            <input
              type="text"
              placeholder="Ej: Luna"
              required
              value={form.nombre}
              onChange={(e) => update("nombre", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block mb-2">Especie *</label>
            <select
              required
              value={form.especie}
              onChange={(e) => update("especie", e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Breed + age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Raza</label>
            <input
              type="text"
              placeholder="Ej: Mestizo, Siames..."
              value={form.raza}
              onChange={(e) => update("raza", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block mb-2">Edad *</label>
            <input
              type="text"
              placeholder="Ej: 2 anos, 6 meses..."
              required
              value={form.edad}
              onChange={(e) => update("edad", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Sex + size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Sexo *</label>
            <select
              required
              value={form.sexo}
              onChange={(e) => update("sexo", e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div>
            <label className="block mb-2">Tamano *</label>
            <select
              required
              value={form.tamano}
              onChange={(e) => update("tamano", e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar...</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2">Ubicacion *</label>
          <input
            type="text"
            placeholder="Ej: Lima, Arequipa..."
            required
            value={form.ubicacion}
            onChange={(e) => update("ubicacion", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2">Descripcion *</label>
          <textarea
            placeholder="Describe la personalidad, historia y necesidades del animal..."
            rows={4}
            required
            value={form.descripcion}
            onChange={(e) => update("descripcion", e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Health checkboxes */}
        <div>
          <label className="block mb-3">Estado de salud</label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontWeight: 400 }}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-[var(--primary)]"
                checked={form.vacunado}
                onChange={(e) => update("vacunado", e.target.checked)}
              />
              Vacunado
            </label>
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontWeight: 400 }}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-[var(--primary)]"
                checked={form.esterilizado}
                onChange={(e) => update("esterilizado", e.target.checked)}
              />
              Esterilizado
            </label>
            <label className="flex items-center gap-2 cursor-pointer" style={{ fontWeight: 400 }}>
              <input
                type="checkbox"
                className="w-4 h-4 accent-[var(--primary)]"
                checked={form.desparasitado}
                onChange={(e) => update("desparasitado", e.target.checked)}
              />
              Desparasitado
            </label>
          </div>
        </div>

        {/* Section: Contact */}
        <div className="pt-4 pb-2">
          <h3 className="mb-4 pb-2 border-b border-primary">Tus datos de contacto</h3>
        </div>

        <div>
          <label className="block mb-2">Tu nombre *</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            required
            value={form.contactoNombre}
            onChange={(e) => update("contactoNombre", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Correo electronico *</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              required
              value={form.contactoEmail}
              onChange={(e) => update("contactoEmail", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block mb-2">WhatsApp</label>
            <input
              type="tel"
              placeholder="+51 999 123 456"
              value={form.contactoWhatsapp}
              onChange={(e) => update("contactoWhatsapp", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Sobre ti</label>
          <textarea
            placeholder="Cuentanos un poco sobre ti: ¿eres rescatista independiente, parte de un albergue, o encontraste al animal en la calle?"
            rows={3}
            value={form.contactoSobreTi}
            onChange={(e) => update("contactoSobreTi", e.target.value)}
            className={`${inputClass} resize-none`}
          />
          <p className="text-muted-foreground mt-1.5" style={{ fontSize: "0.8125rem" }}>
            Opcional. Nos ayuda a conocerte mejor y verificar el envio.
          </p>
        </div>

        <div>
          <label className="block mb-2">Instagram</label>
          <input
            type="text"
            placeholder="@tucuenta"
            value={form.contactoInstagram}
            onChange={(e) => update("contactoInstagram", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Facebook</label>
            <input
              type="text"
              placeholder="Nombre o enlace de perfil"
              value={form.contactoFacebook}
              onChange={(e) => update("contactoFacebook", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block mb-2">TikTok</label>
            <input
              type="text"
              placeholder="@tucuenta"
              value={form.contactoTiktok}
              onChange={(e) => update("contactoTiktok", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">Sitio web</label>
          <input
            type="url"
            placeholder="https://www.tusitio.com"
            value={form.contactoWeb}
            onChange={(e) => update("contactoWeb", e.target.value)}
            className={inputClass}
          />
        </div>

        <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
          Las redes sociales y sitio web son opcionales pero nos ayudan a verificar la legitimidad del envio. El correo electronico es obligatorio ya que sera nuestro principal medio de comunicacion contigo.
        </p>

        {/* Consent checkbox */}
        <div className="p-4 bg-muted/40 border border-primary rounded-xl bg-[#e2664a0d]">
          <label className="flex items-start gap-3 cursor-pointer" style={{ fontWeight: 400 }}>
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 accent-[var(--primary)] shrink-0"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span className="text-muted-foreground" style={{ fontSize: "0.8125rem", lineHeight: 1.6 }}>
              Acepto que AdoptaMe revise la informacion proporcionada antes de publicarla, que mis datos de contacto (nombre, correo electronico y, si los proporcione, telefono y redes sociales) sean compartidos con personas interesadas en adoptar al animal, y que la informacion del animal junto con mi nombre se publiquen en el sitio web adoptame.pe. Confirmo que la informacion es veraz y que tengo derecho a gestionar la adopcion de este animal. Puedo solicitar la eliminacion de mi publicacion en cualquier momento contactando al equipo de AdoptaMe. He leido y acepto los{" "}
              <Link to="/terminos" target="_blank" className="text-primary hover:underline no-underline">
                terminos y condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacidad" target="_blank" className="text-primary hover:underline no-underline">
                politica de privacidad
              </Link>.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !acceptedTerms}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl border border-primary hover:bg-transparent hover:text-primary transition-colors disabled:opacity-60"
          style={{ fontWeight: 500 }}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              
              Publicar animal
            </>
          )}
        </button>
      </form>
    </div>
  );
}