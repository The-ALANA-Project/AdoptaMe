import { useState, useRef } from "react";
import { X, Upload, Loader2, ImageIcon } from "lucide-react";
import { uploadImage } from "../data/api";
import type { Rescuer } from "../data/types";

interface EditableFields {
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  sexo: string;
  tamano: string;
  ubicacion: string;
  descripcion: string;
  imagen: string;
  vacunado: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  urgente: boolean;
  contactoNombre: string;
  contactoEmail: string;
  contactoWhatsapp: string;
  contactoInstagram: string;
  contactoFacebook: string;
  contactoTiktok: string;
  contactoWeb: string;
  contactoSobreTi: string;
  rescuerId: string;
}

interface AdminEditModalProps {
  item: any;
  type: "submission" | "animal";
  onSave: (updates: Partial<EditableFields>) => Promise<void>;
  onClose: () => void;
  rescuers?: Rescuer[];
}

const ESPECIE_OPTIONS = ["Perro", "Gato", "Conejo", "Ave", "Otro"];
const SEXO_OPTIONS = ["Macho", "Hembra"];
const TAMANO_OPTIONS = ["Pequeno", "Mediano", "Grande"];

export function AdminEditModal({ item, type, onSave, onClose, rescuers = [] }: AdminEditModalProps) {
  const [form, setForm] = useState<EditableFields>({
    nombre: item.nombre || "",
    especie: item.especie || "Perro",
    raza: item.raza || "",
    edad: item.edad || "",
    sexo: item.sexo || "Macho",
    tamano: item.tamano || "Mediano",
    ubicacion: item.ubicacion || "",
    descripcion: item.descripcion || "",
    imagen: item.imagen || "",
    vacunado: !!item.vacunado,
    esterilizado: !!item.esterilizado,
    desparasitado: !!item.desparasitado,
    urgente: !!item.urgente,
    contactoNombre: item.contactoNombre || "",
    contactoEmail: item.contactoEmail || "",
    contactoWhatsapp: item.contactoWhatsapp || "",
    contactoInstagram: item.contactoInstagram || "",
    contactoFacebook: item.contactoFacebook || "",
    contactoTiktok: item.contactoTiktok || "",
    contactoWeb: item.contactoWeb || "",
    contactoSobreTi: item.contactoSobreTi || "",
    rescuerId: item.rescuerId || "",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof EditableFields, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, imagen: url }));
    } catch (err: any) {
      setError(`Error al subir imagen: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err: any) {
      setError(`Error al guardar: ${err.message}`);
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";
  const labelClass = "block text-muted-foreground mb-1";
  const labelStyle = { fontSize: "0.75rem", fontWeight: 500 as const };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 my-8 bg-background border border-border rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            Editar {type === "submission" ? "envio pendiente" : "animal publicado"}: {item.nombre}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {error && (
            <div
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive"
              style={{ fontSize: "0.875rem" }}
            >
              {error}
            </div>
          )}

          {/* Image section */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Imagen
            </label>
            <div className="flex items-start gap-4">
              {form.imagen ? (
                <img
                  src={form.imagen}
                  alt={form.nombre}
                  className="w-24 h-24 rounded-xl object-cover border border-border flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-xl border border-border bg-muted flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2 flex-1">
                <input
                  type="text"
                  value={form.imagen}
                  onChange={(e) => handleChange("imagen", e.target.value)}
                  placeholder="URL de la imagen"
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-fit"
                  style={{ fontSize: "0.8125rem" }}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Subiendo..." : "Subir nueva imagen"}
                </button>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>
                Nombre *
              </label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                Especie *
              </label>
              <select
                value={form.especie}
                onChange={(e) => handleChange("especie", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
              >
                {ESPECIE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                Raza
              </label>
              <input
                type="text"
                value={form.raza}
                onChange={(e) => handleChange("raza", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                Edad *
              </label>
              <input
                type="text"
                value={form.edad}
                onChange={(e) => handleChange("edad", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
                required
              />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                Sexo *
              </label>
              <select
                value={form.sexo}
                onChange={(e) => handleChange("sexo", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
              >
                {SEXO_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                Tamano *
              </label>
              <select
                value={form.tamano}
                onChange={(e) => handleChange("tamano", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
              >
                {TAMANO_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} style={labelStyle}>
                Ubicacion *
              </label>
              <input
                type="text"
                value={form.ubicacion}
                onChange={(e) => handleChange("ubicacion", e.target.value)}
                className={inputClass}
                style={{ fontSize: "0.875rem" }}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Descripcion *
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className={`${inputClass} min-h-[120px] resize-y`}
              style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
              required
            />
          </div>

          {/* Health checkboxes */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Salud
            </label>
            <div className="flex flex-wrap gap-4 mt-1">
              {(["vacunado", "esterilizado", "desparasitado"] as const).map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={(e) => handleChange(field, e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary accent-primary"
                  />
                  <span style={{ fontSize: "0.875rem" }} className="capitalize">
                    {field}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Urgente toggle */}
          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.urgente}
                onChange={(e) => handleChange("urgente", e.target.checked)}
                className="w-4 h-4 rounded border-border text-destructive accent-[var(--destructive)]"
              />
              <div>
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }} className="text-destructive">
                  Caso urgente
                </span>
                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                  Marca si este animal necesita hogar con urgencia. Se mostrara con prioridad en la pagina de inicio.
                </p>
              </div>
            </label>
          </div>

          {/* Contact info */}
          <div className="border-t border-border pt-5">
            <p className="text-muted-foreground mb-3" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
              Informacion de contacto
            </p>

            {/* Rescuer profile link (only for animals) */}
            {type === "animal" && rescuers.length > 0 && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                <label className={labelClass} style={labelStyle}>
                  Vincular perfil de rescatista
                </label>
                <select
                  value={form.rescuerId}
                  onChange={(e) => handleChange("rescuerId", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                >
                  <option value="">— Sin vincular —</option>
                  {rescuers.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}{r.instagram ? ` (@${r.instagram})` : ""}
                    </option>
                  ))}
                </select>
                <p className="text-muted-foreground mt-1.5" style={{ fontSize: "0.75rem" }}>
                  Al vincular, el perfil del rescatista aparecera en la pagina del animal con foto y redes sociales.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>
                  Nombre de contacto *
                </label>
                <input
                  type="text"
                  value={form.contactoNombre}
                  onChange={(e) => handleChange("contactoNombre", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                  required
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.contactoEmail}
                  onChange={(e) => handleChange("contactoEmail", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={form.contactoWhatsapp}
                  onChange={(e) => handleChange("contactoWhatsapp", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  Instagram
                </label>
                <input
                  type="text"
                  value={form.contactoInstagram}
                  onChange={(e) => handleChange("contactoInstagram", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                  placeholder="@usuario"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  Facebook
                </label>
                <input
                  type="text"
                  value={form.contactoFacebook}
                  onChange={(e) => handleChange("contactoFacebook", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  TikTok
                </label>
                <input
                  type="text"
                  value={form.contactoTiktok}
                  onChange={(e) => handleChange("contactoTiktok", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>
                  Sitio web
                </label>
                <input
                  type="text"
                  value={form.contactoWeb}
                  onChange={(e) => handleChange("contactoWeb", e.target.value)}
                  className={inputClass}
                  style={{ fontSize: "0.875rem" }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={labelStyle}>
                  Sobre el rescatista
                </label>
                <textarea
                  value={form.contactoSobreTi}
                  onChange={(e) => handleChange("contactoSobreTi", e.target.value)}
                  className={`${inputClass} min-h-[80px] resize-y`}
                  style={{ fontSize: "0.875rem", lineHeight: 1.6 }}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ fontSize: "0.875rem" }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}