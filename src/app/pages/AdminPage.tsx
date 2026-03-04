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
} from "../data/api";
import type { Animal, Submission } from "../data/types";
import { AdminEditModal } from "../components/AdminEditModal";

interface Inquiry {
  id: string;
  animalId: string;
  animalNombre: string;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  fechaEnvio: string;
  estado: string;
}

export function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tab, setTab] = useState<"submissions" | "animals" | "inquiries">("animals");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [seedMsg, setSeedMsg] = useState("");
  const hasAutoSeeded = useRef(false);
  const [editItem, setEditItem] = useState<{ item: any; type: "submission" | "animal" } | null>(null);

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

  const handleToggleAdopted = async (id: string) => {
    setActionLoading(id);
    try {
      await adminToggleAdopted(password, id);
      await loadData();
    } catch (err) {
      console.error("Error toggling adopted:", err);
    } finally {
      setActionLoading(null);
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
                    <div>
                      <span className="text-muted-foreground block mb-1" style={{ fontSize: "0.75rem" }}>Mensaje</span>
                      <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{inq.mensaje}</p>
                    </div>
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
                    onClick={() => handleToggleAdopted(animal.id)}
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
    </div>
  );
}