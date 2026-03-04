import { useState, useEffect, useCallback, useRef } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  PawPrint,
  RefreshCw,
  Heart,
  Database,
  Mail,
  Phone,
  Globe,
  User,
  Pencil,
  ClipboardList,
  Send,
  Home,
  Instagram,
  Linkedin,
  Facebook,
  FileText,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  adminGetSubmissions,
  adminGetAnimals,
  adminGetInquiries,
  adminApprove,
  adminReject,
  adminDeleteAnimal,
  adminDeleteInquiry,
  adminSeed,
  adminSeedPending,
  adminToggleAdopted,
  adminUpdateSubmission,
  adminUpdateAnimal,
  adminGetSeguimientos,
  adminAddSeguimientoNote,
} from "../data/api";
import type { Animal, Submission, Inquiry, Seguimiento } from "../data/types";
import { AdminEditModal } from "../components/AdminEditModal";

export function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tab, setTab] = useState<"submissions" | "animals" | "inquiries" | "seguimiento">("animals");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [seedMsg, setSeedMsg] = useState("");
  const hasAutoSeeded = useRef(false);
  const [editItem, setEditItem] = useState<{ item: any; type: "submission" | "animal" } | null>(null);
  const [adoptPickerAnimal, setAdoptPickerAnimal] = useState<Animal | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [subs, anims, inqs] = await Promise.all([
        adminGetSubmissions(password),
        adminGetAnimals(password),
        adminGetInquiries(password),
      ]);
      setSubmissions(subs);
      setAnimals(anims);
      setInquiries(inqs);

      // Also load seguimientos
      try {
        const segs = await adminGetSeguimientos(password);
        setSeguimientos(segs);
      } catch { /* seguimiento table may be empty */ }

      // Auto-seed if no animals exist (only once per session)
      if (anims.length === 0 && !hasAutoSeeded.current) {
        hasAutoSeeded.current = true;
        setSeedMsg("No se encontraron animales. Creando perfiles iniciales...");
        try {
          const res = await adminSeed(password);
          setSeedMsg(res.message);
          const freshAnimals = await adminGetAnimals(password);
          setAnimals(freshAnimals);
          setTab("animals");
        } catch (seedErr: any) {
          setSeedMsg(`Error al crear seed: ${seedErr.message}`);
        }
      }
    } catch (err: any) {
      console.error("Error loading admin data:", err);
      if (err.message?.includes("No autorizado")) {
        setAuthenticated(false);
        setAuthError("Contrasena incorrecta");
      }
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await adminGetSubmissions(password);
      setAuthenticated(true);
    } catch {
      setAuthError("Contrasena incorrecta");
    }
  };

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApprove(password, id);
      await loadData();
    } catch (err) {
      console.error("Error approving:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Estas seguro de rechazar este envio?")) return;
    setActionLoading(id);
    try {
      await adminReject(password, id);
      await loadData();
    } catch (err) {
      console.error("Error rejecting:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Estas seguro de eliminar este animal publicado?")) return;
    setActionLoading(id);
    try {
      await adminDeleteAnimal(password, id);
      await loadData();
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Eliminar esta solicitud de adopcion?")) return;
    setActionLoading(id);
    try {
      await adminDeleteInquiry(password, id);
      await loadData();
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeed = async () => {
    setSeedMsg("");
    setActionLoading("seed");
    try {
      const res = await adminSeed(password);
      setSeedMsg(res.message);
      await loadData();
      if (res.seeded) {
        setTab("animals");
      }
    } catch (err: any) {
      setSeedMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeedPending = async () => {
    setSeedMsg("");
    setActionLoading("seedPending");
    try {
      const res = await adminSeedPending(password);
      setSeedMsg(res.message);
      await loadData();
      if (res.seeded) {
        setTab("submissions");
      }
    } catch (err: any) {
      setSeedMsg(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleAdopted = async (id: string, inquiryId?: string) => {
    setActionLoading(id);
    try {
      await adminToggleAdopted(password, id, inquiryId);
      await loadData();
    } catch (err) {
      console.error("Error toggling adopted:", err);
    } finally {
      setActionLoading(null);
      setAdoptPickerAnimal(null);
    }
  };

  const handleUpdateSubmission = async (id: string, updatedData: Partial<Submission>) => {
    setActionLoading(id);
    try {
      await adminUpdateSubmission(password, id, updatedData);
      await loadData();
    } catch (err) {
      console.error("Error updating submission:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAnimal = async (id: string, updatedData: Partial<Animal>) => {
    setActionLoading(id);
    try {
      await adminUpdateAnimal(password, id, updatedData);
      await loadData();
    } catch (err) {
      console.error("Error updating animal:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="relative flex items-end min-h-[calc(100dvh-8rem)]">
        {/* Full background dog image */}
        <img
          src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Un perro dorado sonriente"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Login form overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="max-w-sm bg-background/90 backdrop-blur-md border border-border rounded-2xl p-8 shadow-lg">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Panel de administracion</h1>
            <p className="text-muted-foreground mt-2 mb-8" style={{ fontSize: "0.9375rem" }}>
              Ingresa la contrasena de administrador
            </p>

            {authError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl mb-4 text-destructive" style={{ fontSize: "0.875rem" }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Contrasena"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Panel de administracion</h1>
          <p className="text-muted-foreground mt-1" style={{ fontSize: "0.9375rem" }}>
            Gestiona envios, solicitudes y animales publicados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            disabled={actionLoading === "seed"}
            className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-colors"
            style={{ fontSize: "0.875rem" }}
            title="Cargar los 3 perros iniciales"
          >
            {actionLoading === "seed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed inicial
          </button>
          <button
            onClick={handleSeedPending}
            disabled={actionLoading === "seedPending"}
            className="flex items-center gap-2 px-4 py-2 border border-primary/30 text-primary rounded-xl hover:bg-primary/5 transition-colors"
            style={{ fontSize: "0.875rem" }}
            title="Cargar los 3 perros pendientes"
          >
            {actionLoading === "seedPending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed pendientes
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-muted transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className={`p-3 rounded-xl mb-6 ${seedMsg.startsWith("Error") ? "bg-destructive/10 border border-destructive/20 text-destructive" : "bg-secondary border border-border text-primary"}`} style={{ fontSize: "0.875rem" }}>
          {seedMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-muted p-1 rounded-xl w-fit flex-wrap">
        <button
          onClick={() => setTab("submissions")}
          className={`px-5 py-2.5 rounded-lg transition-colors ${
            tab === "submissions"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Pendientes ({submissions.length})
        </button>
        <button
          onClick={() => setTab("inquiries")}
          className={`px-5 py-2.5 rounded-lg transition-colors ${
            tab === "inquiries"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Solicitudes ({inquiries.length})
        </button>
        <button
          onClick={() => setTab("animals")}
          className={`px-5 py-2.5 rounded-lg transition-colors ${
            tab === "animals"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Publicados ({animals.length})
        </button>
        <button
          onClick={() => setTab("seguimiento")}
          className={`px-5 py-2.5 rounded-lg transition-colors ${
            tab === "seguimiento"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          style={{ fontSize: "0.875rem", fontWeight: 500 }}
        >
          Seguimiento ({seguimientos.length})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">Cargando...</span>
        </div>
      ) : tab === "submissions" ? (
        /* ===== Submissions tab ===== */
        submissions.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <PawPrint className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="mb-1">No hay envios pendientes</h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Los nuevos envios apareceran aqui para su revision
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                >
                  <div className="flex items-center gap-4">
                    {sub.imagen && (
                      <img src={sub.imagen} alt={sub.nombre} className="w-12 h-12 rounded-lg object-cover" />
                    )}
                    <div>
                      <p style={{ fontWeight: 500 }}>
                        {sub.nombre}{" "}
                        <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.875rem" }}>
                          — {sub.especie} · {sub.ubicacion}
                        </span>
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                        Por {sub.contactoNombre} · {new Date(sub.fechaEnvio).toLocaleDateString("es-PE")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {actionLoading === sub.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); handleApprove(sub.id); }} className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors" title="Aprobar">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setEditItem({ item: sub, type: "submission" }); }} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleReject(sub.id); }} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Rechazar">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {expandedId === sub.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {expandedId === sub.id && (
                  <div className="px-4 pb-4 border-t border-border pt-4 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ fontSize: "0.875rem" }}>
                      <div><span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Raza</span>{sub.raza}</div>
                      <div><span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Edad</span>{sub.edad}</div>
                      <div><span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Sexo</span>{sub.sexo}</div>
                      <div><span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Tamano</span>{sub.tamano}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1" style={{ fontSize: "0.75rem" }}>Descripcion</span>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{sub.descripcion}</p>
                    </div>
                    <div className="flex gap-3 flex-wrap" style={{ fontSize: "0.8125rem" }}>
                      {sub.vacunado && <span className="px-2 py-0.5 bg-secondary text-primary rounded">Vacunado</span>}
                      {sub.esterilizado && <span className="px-2 py-0.5 bg-secondary text-primary rounded">Esterilizado</span>}
                      {sub.desparasitado && <span className="px-2 py-0.5 bg-secondary text-primary rounded">Desparasitado</span>}
                    </div>
                    <div className="flex gap-4" style={{ fontSize: "0.8125rem" }}>
                      {sub.contactoEmail && <span className="text-muted-foreground">Email: {sub.contactoEmail}</span>}
                      {sub.contactoWhatsapp && <span className="text-muted-foreground">WhatsApp: {sub.contactoWhatsapp}</span>}
                      {sub.contactoInstagram && (
                        <a
                          href={`https://www.instagram.com/${sub.contactoInstagram.replace("@", "")}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 no-underline"
                        >
                          IG: @{sub.contactoInstagram.replace("@", "")}
                        </a>
                      )}
                    </div>

                    {/* Sobre ti */}
                    {sub.contactoSobreTi && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground flex items-center gap-1.5 mb-1" style={{ fontSize: "0.75rem" }}>
                          <User className="w-3.5 h-3.5" />
                          Sobre el remitente
                        </span>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{sub.contactoSobreTi}</p>
                      </div>
                    )}

                    {/* Social & web links */}
                    {(sub.contactoFacebook || sub.contactoTiktok || sub.contactoWeb) && (
                      <div className="flex flex-wrap gap-3" style={{ fontSize: "0.8125rem" }}>
                        {sub.contactoFacebook && (
                          <span className="px-2.5 py-1 bg-secondary text-primary rounded-lg flex items-center gap-1.5">
                            FB: {sub.contactoFacebook}
                          </span>
                        )}
                        {sub.contactoTiktok && (
                          <span className="px-2.5 py-1 bg-secondary text-muted-foreground rounded-lg flex items-center gap-1.5">
                            TikTok: {sub.contactoTiktok}
                          </span>
                        )}
                        {sub.contactoWeb && (
                          <a
                            href={sub.contactoWeb.startsWith("http") ? sub.contactoWeb : `https://${sub.contactoWeb}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg flex items-center gap-1.5 no-underline hover:bg-primary/10 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            {sub.contactoWeb}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : tab === "inquiries" ? (
        /* ===== Inquiries tab ===== */
        inquiries.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="mb-1">No hay solicitudes de adopcion</h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Cuando alguien envie una solicitud aparecera aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                >
                  <div>
                    <p style={{ fontWeight: 500 }}>
                      {inq.nombre}{" "}
                      <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.875rem" }}>
                        quiere adoptar a <span className="text-primary" style={{ fontWeight: 500 }}>{inq.animalNombre}</span>
                      </span>
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                      {new Date(inq.fechaEnvio).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {actionLoading === inq.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteInquiry(inq.id); }} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {expandedId === inq.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {expandedId === inq.id && (
                  <div className="px-4 pb-4 border-t border-border pt-4 space-y-3">
                    {/* Motivation */}
                    <div>
                      <span className="text-muted-foreground block mb-1" style={{ fontSize: "0.75rem" }}>Mensaje</span>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{inq.mensaje}</p>
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4" style={{ fontSize: "0.875rem" }}>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 text-primary no-underline hover:underline">
                          <Mail className="w-4 h-4" />
                          {inq.email}
                        </a>
                      )}
                      {inq.telefono && (
                        <a href={`https://wa.me/${inq.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#25D366] no-underline hover:underline">
                          <Phone className="w-4 h-4" />
                          {inq.telefono}
                        </a>
                      )}
                    </div>

                    {/* Document ID */}
                    {inq.tipoDocumento && inq.numeroDocumento && (
                      <div className="flex items-center gap-1.5" style={{ fontSize: "0.875rem" }}>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{inq.tipoDocumento}:</span>
                        <span style={{ fontWeight: 500 }}>{inq.numeroDocumento}</span>
                      </div>
                    )}

                    {/* Location */}
                    {(inq.departamento || inq.provincia || inq.distrito) && (
                      <div className="flex items-center gap-1.5" style={{ fontSize: "0.875rem" }}>
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span style={{ fontWeight: 500 }}>
                          {[inq.distrito, inq.provincia, inq.departamento].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Social profiles */}
                    {(inq.linkedin || inq.facebook || inq.instagram) && (
                      <div className="flex flex-wrap gap-3" style={{ fontSize: "0.8125rem" }}>
                        {inq.linkedin && (
                          <a href={inq.linkedin} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-secondary text-primary rounded-lg flex items-center gap-1.5 no-underline hover:opacity-80 transition-opacity">
                            <Linkedin className="w-3.5 h-3.5" />
                            LinkedIn
                          </a>
                        )}
                        {inq.facebook && (
                          <span className="px-2.5 py-1 bg-secondary text-primary rounded-lg flex items-center gap-1.5">
                            <Facebook className="w-3.5 h-3.5" />
                            {inq.facebook}
                          </span>
                        )}
                        {inq.instagram && (
                          <a href={`https://instagram.com/${inq.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-secondary text-primary rounded-lg flex items-center gap-1.5 no-underline hover:opacity-80 transition-opacity">
                            <Instagram className="w-3.5 h-3.5" />
                            @{inq.instagram.replace("@", "")}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Home situation */}
                    {(inq.vivienda || inq.otrasMascotas || inq.experiencia) && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground flex items-center gap-1.5 mb-2" style={{ fontSize: "0.75rem" }}>
                          <Home className="w-3.5 h-3.5" />
                          Situacion del hogar
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" style={{ fontSize: "0.875rem" }}>
                          {inq.vivienda && (
                            <div>
                              <span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Vivienda</span>
                              {inq.vivienda}
                            </div>
                          )}
                          {inq.otrasMascotas && (
                            <div>
                              <span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Otras mascotas</span>
                              {inq.otrasMascotas}
                            </div>
                          )}
                          {inq.experiencia && (
                            <div>
                              <span className="text-muted-foreground block" style={{ fontSize: "0.75rem" }}>Experiencia</span>
                              {inq.experiencia}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Seguimiento consent */}
                    <div className="flex items-center gap-2" style={{ fontSize: "0.8125rem" }}>
                      <ShieldCheck className={`w-4 h-4 ${inq.seguimiento ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={inq.seguimiento ? "text-primary" : "text-muted-foreground"} style={{ fontWeight: 500 }}>
                        Seguimiento post-adopcion: {inq.seguimiento ? "Aceptado ✓" : "No aceptado"}
                      </span>
                    </div>

                    <div>
                      <a href={`/animales/${inq.animalId}`} target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline" style={{ fontSize: "0.8125rem" }}>
                        Ver perfil de {inq.animalNombre} →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : tab === "seguimiento" ? (
        /* ===== Seguimiento tab ===== */
        seguimientos.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="mb-1">No hay seguimientos activos</h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Cuando marques un animal como adoptado y selecciones al adoptante, aparecera aqui para seguimiento
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {seguimientos.map((seg) => {
              const daysSinceAdoption = Math.floor((Date.now() - new Date(seg.fechaAdopcion).getTime()) / (1000 * 60 * 60 * 24));
              const milestones = [
                { label: "1 semana", days: 7 },
                { label: "1 mes", days: 30 },
                { label: "3 meses", days: 90 },
                { label: "6 meses", days: 180 },
              ];
              return (
                <div key={seg.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedId(expandedId === seg.id ? null : seg.id)}
                  >
                    <div className="flex items-center gap-4">
                      {seg.animalImagen && (
                        <img src={seg.animalImagen} alt={seg.animalNombre} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <p style={{ fontWeight: 500 }}>
                          {seg.animalNombre}{" "}
                          <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.875rem" }}>
                            → adoptado por <span className="text-primary" style={{ fontWeight: 500 }}>{seg.adoptanteNombre}</span>
                          </span>
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                          Adoptado: {new Date(seg.fechaAdopcion).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
                          {" · "}{daysSinceAdoption} dias · {(seg.notas || []).length} nota(s)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {expandedId === seg.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {expandedId === seg.id && (
                    <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                      {/* Adopter contact */}
                      <div className="flex flex-wrap gap-4" style={{ fontSize: "0.875rem" }}>
                        {seg.adoptanteEmail && (
                          <a href={`mailto:${seg.adoptanteEmail}`} className="flex items-center gap-1.5 text-primary no-underline hover:underline">
                            <Mail className="w-4 h-4" />
                            {seg.adoptanteEmail}
                          </a>
                        )}
                        {seg.adoptanteTelefono && (
                          <a href={`https://wa.me/${seg.adoptanteTelefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#25D366] no-underline hover:underline">
                            <Phone className="w-4 h-4" />
                            {seg.adoptanteTelefono}
                          </a>
                        )}
                        {seg.adoptanteTipoDoc && seg.adoptanteNumeroDoc && (
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            {seg.adoptanteTipoDoc}: {seg.adoptanteNumeroDoc}
                          </span>
                        )}
                      </div>

                      {/* Milestones */}
                      <div>
                        <span className="text-muted-foreground block mb-2" style={{ fontSize: "0.75rem" }}>Hitos de seguimiento</span>
                        <div className="flex gap-2 flex-wrap">
                          {milestones.map((m) => (
                            <span
                              key={m.days}
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                daysSinceAdoption >= m.days
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {m.label} {daysSinceAdoption >= m.days ? "✓" : `(faltan ${m.days - daysSinceAdoption}d)`}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Notes timeline */}
                      <div>
                        <span className="text-muted-foreground block mb-2" style={{ fontSize: "0.75rem" }}>Notas de seguimiento</span>
                        {(seg.notas || []).length === 0 ? (
                          <p className="text-muted-foreground italic" style={{ fontSize: "0.8125rem" }}>Aun no hay notas registradas</p>
                        ) : (
                          <div className="space-y-2">
                            {(seg.notas || []).map((nota, i) => (
                              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                                  {new Date(nota.fecha).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                                <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{nota.texto}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add note form */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Agregar nota de seguimiento..."
                          value={noteText[seg.id] || ""}
                          onChange={(e) => setNoteText((prev) => ({ ...prev, [seg.id]: e.target.value }))}
                          className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" && noteText[seg.id]?.trim()) {
                              setActionLoading(seg.id);
                              try {
                                await adminAddSeguimientoNote(password, seg.id, noteText[seg.id].trim());
                                setNoteText((prev) => ({ ...prev, [seg.id]: "" }));
                                await loadData();
                              } catch (err) {
                                console.error("Error adding note:", err);
                              } finally {
                                setActionLoading(null);
                              }
                            }
                          }}
                        />
                        <button
                          onClick={async () => {
                            if (!noteText[seg.id]?.trim()) return;
                            setActionLoading(seg.id);
                            try {
                              await adminAddSeguimientoNote(password, seg.id, noteText[seg.id].trim());
                              setNoteText((prev) => ({ ...prev, [seg.id]: "" }));
                              await loadData();
                            } catch (err) {
                              console.error("Error adding note:", err);
                            } finally {
                              setActionLoading(null);
                            }
                          }}
                          disabled={!noteText[seg.id]?.trim() || actionLoading === seg.id}
                          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                          {actionLoading === seg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>

                      {seg.animalSlug && (
                        <div>
                          <a href={`/animales/${seg.animalSlug}`} target="_blank" rel="noopener noreferrer" className="text-primary no-underline hover:underline" style={{ fontSize: "0.8125rem" }}>
                            Ver perfil de {seg.animalNombre} →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ===== Animals tab ===== */
        animals.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <PawPrint className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="mb-1">No hay animales publicados</h3>
            <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
              Usa el boton "Seed inicial" para cargar los primeros 3 perros, o aprueba envios pendientes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {animals.map((animal) => (
              <div key={animal.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary transition-colors">
                <div className="flex items-center gap-4">
                  {animal.imagen && (
                    <div className="relative">
                      <img src={animal.imagen} alt={animal.nombre} className="w-12 h-12 rounded-lg object-cover" />
                      {animal.adoptado && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <p style={{ fontWeight: 500 }}>
                      {animal.nombre}{" "}
                      {animal.adoptado && (
                        <span className="px-2 py-0.5 bg-secondary text-primary rounded text-xs ml-1" style={{ fontWeight: 500 }}>
                          Adoptado
                        </span>
                      )}
                      <span className="text-muted-foreground" style={{ fontWeight: 400, fontSize: "0.875rem" }}>
                        {" "}— {animal.especie} · {animal.ubicacion}
                      </span>
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                      Publicado: {new Date(animal.fechaPublicacion).toLocaleDateString("es-PE")}
                      {" · "}Contacto: {animal.contactoNombre}
                      {animal.slug && <span className="text-primary/60"> · /{animal.slug}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (animal.adoptado) {
                        // Un-marking: just toggle directly
                        handleToggleAdopted(animal.id);
                      } else {
                        // Marking as adopted: check if there are inquiries for this animal
                        const animalInquiries = inquiries.filter(inq => inq.animalId === animal.id);
                        if (animalInquiries.length > 0) {
                          setAdoptPickerAnimal(animal);
                        } else {
                          handleToggleAdopted(animal.id);
                        }
                      }
                    }}
                    disabled={actionLoading === animal.id}
                    className={`p-2 rounded-lg transition-colors ${
                      animal.adoptado
                        ? "text-primary hover:bg-secondary"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary"
                    }`}
                    title={animal.adoptado ? "Marcar como disponible" : "Marcar como adoptado"}
                  >
                    <Heart className={`w-4 h-4 ${animal.adoptado ? "fill-primary" : ""}`} />
                  </button>
                  <button
                    onClick={() => setEditItem({ item: animal, type: "animal" })}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <a href={`/animales/${animal.slug || animal.id}`} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Ver publicacion">
                    <Eye className="w-4 h-4" />
                  </a>
                  {actionLoading === animal.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  ) : (
                    <button onClick={() => handleDelete(animal.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Edit Modal */}
      {editItem && (
        <AdminEditModal
          item={editItem.item}
          type={editItem.type}
          onSave={async (updates) => {
            if (editItem.type === "submission") {
              await handleUpdateSubmission(editItem.item.id, updates);
            } else {
              await handleUpdateAnimal(editItem.item.id, updates);
            }
            setEditItem(null);
          }}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Adopt Picker Modal */}
      {adoptPickerAnimal && (() => {
        const animalInqs = inquiries.filter(inq => inq.animalId === adoptPickerAnimal.id);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={() => setAdoptPickerAnimal(null)}>
            <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-border">
                <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  Marcar a {adoptPickerAnimal.nombre} como adoptado
                </h2>
                <p className="text-muted-foreground mt-1" style={{ fontSize: "0.875rem" }}>
                  Selecciona quien adopto a {adoptPickerAnimal.nombre} para crear el seguimiento:
                </p>
              </div>
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {animalInqs.map(inq => (
                  <button
                    key={inq.id}
                    onClick={() => handleToggleAdopted(adoptPickerAnimal.id, inq.id)}
                    disabled={actionLoading === adoptPickerAnimal.id}
                    className="w-full text-left p-3 border border-border rounded-xl hover:border-primary hover:bg-secondary transition-colors"
                  >
                    <p style={{ fontWeight: 500, fontSize: "0.9375rem" }}>{inq.nombre}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
                      {inq.email || inq.telefono || "Sin contacto"}
                      {inq.tipoDocumento && inq.numeroDocumento && ` · ${inq.tipoDocumento} ${inq.numeroDocumento}`}
                    </p>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={() => handleToggleAdopted(adoptPickerAnimal.id)}
                  disabled={actionLoading === adoptPickerAnimal.id}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                  style={{ fontSize: "0.875rem" }}
                >
                  Adoptar sin vincular solicitud
                </button>
                <button
                  onClick={() => setAdoptPickerAnimal(null)}
                  className="px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors"
                  style={{ fontSize: "0.875rem" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}