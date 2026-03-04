import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Password"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Health check
app.get("/make-server-ba60542a/health", (c) => {
  return c.json({ status: "ok" });
});

// --- Helper: verify admin password ---
function isAdmin(c: any): boolean {
  const token = c.req.header("X-Admin-Password") || "";
  const adminPw = Deno.env.get("ADMIN_PASSWORD");
  return !!adminPw && token === adminPw;
}

// --- Helper: generate unique ID ---
async function nextId(prefix: string): Promise<string> {
  const counterKey = `${prefix}_counter`;
  const current = (await kv.get(counterKey)) || 0;
  const next = current + 1;
  await kv.set(counterKey, next);
  return `${prefix}_${next}`;
}

// --- Helper: generate slug from name ---
function toBaseSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanum → hyphen
    .replace(/(^-|-$)/g, "");        // trim hyphens
}

async function generateUniqueSlug(nombre: string): Promise<string> {
  const base = toBaseSlug(nombre);
  const existing = await kv.getByPrefix("animal:");
  const usedSlugs = new Set(existing.map((a: any) => a.slug).filter(Boolean));
  if (!usedSlugs.has(base)) return base;
  let i = 2;
  while (usedSlugs.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

// --- Helper: send email notification via Resend ---
const ADMIN_EMAIL = "contact@stellaachenbach.com";

async function sendEmailNotification(subject: string, htmlBody: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.log("RESEND_API_KEY not set — skipping email notification");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AdoptaMe <hola@adoptame.pe>",
        to: [ADMIN_EMAIL],
        subject,
        html: htmlBody,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.log(`Resend API error (${res.status}): ${errText}`);
    } else {
      console.log(`Email notification sent: ${subject}`);
    }
  } catch (err) {
    console.log(`Error sending email notification: ${err}`);
  }
}

// --- Supabase Storage helper ---
function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

const BUCKET_NAME = "make-ba60542a-images";

async function ensureBucket() {
  const supabase = getSupabase();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b: any) => b.name === BUCKET_NAME);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET_NAME, { public: false });
  }
}

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /animals — list all approved animals
app.get("/make-server-ba60542a/animals", async (c) => {
  try {
    const animals = await kv.getByPrefix("animal:");
    animals.sort(
      (a: any, b: any) =>
        new Date(b.fechaPublicacion).getTime() -
        new Date(a.fechaPublicacion).getTime()
    );
    return c.json({ animals });
  } catch (err) {
    console.log(`Error fetching animals: ${err}`);
    return c.json({ error: `Error fetching animals: ${err}` }, 500);
  }
});

// GET /animals/:id — get a single approved animal (by id or slug)
app.get("/make-server-ba60542a/animals/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // Try direct ID lookup first
    let animal = await kv.get(`animal:${id}`);
    if (!animal) {
      // Fall back to slug lookup
      const all = await kv.getByPrefix("animal:");
      animal = all.find((a: any) => a.slug === id) || null;
    }
    if (!animal) {
      return c.json({ error: "Animal no encontrado" }, 404);
    }
    return c.json({ animal });
  } catch (err) {
    console.log(`Error fetching animal: ${err}`);
    return c.json({ error: `Error fetching animal: ${err}` }, 500);
  }
});

// POST /submissions — public: submit a new animal for review
app.post("/make-server-ba60542a/submissions", async (c) => {
  try {
    const body = await c.req.json();
    const {
      nombre, especie, raza, edad, sexo, tamano,
      ubicacion, descripcion, imagen,
      vacunado, esterilizado, desparasitado,
      contactoNombre, contactoEmail, contactoWhatsapp, contactoInstagram,
      contactoFacebook, contactoTiktok, contactoWeb, contactoSobreTi,
    } = body;

    if (!nombre || !especie || !edad || !sexo || !tamano || !ubicacion || !descripcion || !contactoNombre) {
      return c.json({ error: "Faltan campos requeridos. Por favor completa todos los campos obligatorios." }, 400);
    }

    const id = await nextId("sub");

    const submission = {
      id,
      nombre,
      especie,
      raza: raza || "Desconocida",
      edad,
      sexo,
      tamano,
      ubicacion,
      descripcion,
      imagen: imagen || "",
      vacunado: !!vacunado,
      esterilizado: !!esterilizado,
      desparasitado: !!desparasitado,
      contactoNombre,
      contactoEmail: contactoEmail || "",
      contactoWhatsapp: contactoWhatsapp || "",
      contactoInstagram: contactoInstagram || "",
      contactoFacebook: contactoFacebook || "",
      contactoTiktok: contactoTiktok || "",
      contactoWeb: contactoWeb || "",
      contactoSobreTi: contactoSobreTi || "",
      fechaEnvio: new Date().toISOString(),
      estado: "pendiente",
    };

    await kv.set(`submission:${id}`, submission);

    // Send email notification
    const subject = `Nuevo Envio en AdoptaMe: ${nombre} (${especie})`;
    const htmlBody = `
      <h2>Nuevo animal enviado para revision en AdoptaMe</h2>
      <p>Se ha recibido un nuevo envio de animal para revision:</p>
      <ul>
        <li><strong>Nombre:</strong> ${nombre}</li>
        <li><strong>Especie:</strong> ${especie}</li>
        <li><strong>Raza:</strong> ${raza || "Desconocida"}</li>
        <li><strong>Edad:</strong> ${edad}</li>
        <li><strong>Sexo:</strong> ${sexo}</li>
        <li><strong>Tamano:</strong> ${tamano}</li>
        <li><strong>Ubicacion:</strong> ${ubicacion}</li>
        <li><strong>Descripcion:</strong> ${descripcion}</li>
        ${imagen ? `<li><strong>Imagen:</strong> <a href="${imagen}">Ver imagen</a></li>` : ""}
        <li><strong>Vacunado:</strong> ${vacunado ? "Si" : "No"}</li>
        <li><strong>Esterilizado:</strong> ${esterilizado ? "Si" : "No"}</li>
        <li><strong>Desparasitado:</strong> ${desparasitado ? "Si" : "No"}</li>
      </ul>
      <h3>Contacto del rescatista</h3>
      <ul>
        <li><strong>Nombre:</strong> ${contactoNombre}</li>
        ${contactoEmail ? `<li><strong>Email:</strong> ${contactoEmail}</li>` : ""}
        ${contactoWhatsapp ? `<li><strong>WhatsApp:</strong> ${contactoWhatsapp}</li>` : ""}
        ${body.contactoInstagram ? `<li><strong>Instagram:</strong> <a href="https://instagram.com/${body.contactoInstagram.replace('@', '')}">@${body.contactoInstagram.replace('@', '')}</a></li>` : ""}
        ${body.contactoFacebook ? `<li><strong>Facebook:</strong> <a href="https://facebook.com/${body.contactoFacebook.replace('@', '')}">@${body.contactoFacebook.replace('@', '')}</a></li>` : ""}
        ${body.contactoTiktok ? `<li><strong>TikTok:</strong> <a href="https://tiktok.com/@${body.contactoTiktok.replace('@', '')}">@${body.contactoTiktok.replace('@', '')}</a></li>` : ""}
        ${body.contactoWeb ? `<li><strong>Web:</strong> <a href="${body.contactoWeb}">${body.contactoWeb}</a></li>` : ""}
        ${body.contactoSobreTi ? `<li><strong>Sobre Ti:</strong> ${body.contactoSobreTi}</li>` : ""}
      </ul>
      <p>Ingresa al <strong>panel de administracion</strong> de AdoptaMe para aprobar o rechazar este envio.</p>
    `;
    await sendEmailNotification(subject, htmlBody);

    return c.json({ message: "Envio recibido exitosamente. Sera revisado pronto.", id });
  } catch (err) {
    console.log(`Error creating submission: ${err}`);
    return c.json({ error: `Error al enviar: ${err}` }, 500);
  }
});

// POST /inquiries — public: send an adoption inquiry (protects rescuer contact)
app.post("/make-server-ba60542a/inquiries", async (c) => {
  try {
    const body = await c.req.json();
    const { animalId, animalNombre, nombre, email, telefono, linkedin, facebook, instagram, vivienda, otrasMascotas, experiencia, mensaje } = body;

    if (!animalId || !nombre || !mensaje) {
      return c.json({ error: "Faltan campos requeridos." }, 400);
    }
    if (!email && !telefono) {
      return c.json({ error: "Debes proporcionar al menos un medio de contacto (correo o telefono)." }, 400);
    }

    const id = await nextId("inquiry");

    const inquiry = {
      id,
      animalId,
      animalNombre: animalNombre || "",
      nombre,
      email: email || "",
      telefono: telefono || "",
      linkedin: linkedin || "",
      facebook: facebook || "",
      instagram: instagram || "",
      vivienda: vivienda || "",
      otrasMascotas: otrasMascotas || "",
      experiencia: experiencia || "",
      mensaje,
      fechaEnvio: new Date().toISOString(),
      estado: "pendiente",
    };

    await kv.set(`inquiry:${id}`, inquiry);

    // Send email notification for adoption inquiry
    const subject = `Nueva Solicitud de Adopcion: ${animalNombre || "un animal"}`;
    const htmlBody = `
      <h2>Nueva solicitud de adopcion en AdoptaMe</h2>
      <p>Alguien quiere adoptar a <strong>${animalNombre || animalId}</strong>.</p>
      <h3>Datos del interesado</h3>
      <ul>
        <li><strong>Nombre:</strong> ${nombre}</li>
        <li><strong>Email:</strong> ${email || "No proporcionado"}</li>
        <li><strong>Telefono:</strong> ${telefono || "No proporcionado"}</li>
        ${linkedin ? `<li><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></li>` : ""}
        ${facebook ? `<li><strong>Facebook:</strong> ${facebook}</li>` : ""}
        ${instagram ? `<li><strong>Instagram:</strong> @${instagram.replace("@", "")}</li>` : ""}
      </ul>
      <h3>Situacion del hogar</h3>
      <ul>
        <li><strong>Vivienda:</strong> ${vivienda || "No especificado"}</li>
        <li><strong>Otras mascotas:</strong> ${otrasMascotas || "No especificado"}</li>
        <li><strong>Experiencia previa:</strong> ${experiencia || "No especificado"}</li>
      </ul>
      <p><strong>Por que quiere adoptar:</strong></p>
      <blockquote style="border-left: 3px solid #E2664A; padding-left: 12px; color: #333;">${mensaje}</blockquote>
      <p>Revisa la solicitud en el panel de administracion de AdoptaMe.</p>
    `;
    await sendEmailNotification(subject, htmlBody);

    return c.json({ message: "Tu solicitud fue enviada. Te contactaremos pronto." });
  } catch (err) {
    console.log(`Error creating inquiry: ${err}`);
    return c.json({ error: `Error al enviar solicitud: ${err}` }, 500);
  }
});

// POST /upload-image — public: upload image to Supabase Storage, return signed URL
app.post("/make-server-ba60542a/upload-image", async (c) => {
  try {
    await ensureBucket();
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return c.json({ error: "No se encontro archivo" }, 400);
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const supabase = getSupabase();

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, arrayBuffer, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.log(`Upload error: ${uploadError.message}`);
      return c.json({ error: `Error al subir imagen: ${uploadError.message}` }, 500);
    }

    const { data: signedData, error: signError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

    if (signError) {
      console.log(`Signed URL error: ${signError.message}`);
      return c.json({ error: `Error al generar URL: ${signError.message}` }, 500);
    }

    return c.json({ url: signedData.signedUrl });
  } catch (err) {
    console.log(`Error uploading image: ${err}`);
    return c.json({ error: `Error al subir imagen: ${err}` }, 500);
  }
});

// POST /contact — public: send a contact message via email
app.post("/make-server-ba60542a/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { nombre, email, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return c.json({ error: "Faltan campos requeridos (nombre, email, mensaje)." }, 400);
    }

    const subject = `Nuevo mensaje de contacto en AdoptaMe de ${nombre}`;
    const htmlBody = `
      <h2>Nuevo mensaje de contacto en AdoptaMe</h2>
      <ul>
        <li><strong>Nombre:</strong> ${nombre}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      <p><strong>Mensaje:</strong></p>
      <blockquote style="border-left: 3px solid #E2664A; padding-left: 12px; color: #333;">${mensaje}</blockquote>
    `;
    await sendEmailNotification(subject, htmlBody);

    return c.json({ message: "Mensaje enviado exitosamente. Gracias por escribirnos!" });
  } catch (err) {
    console.log(`Error sending contact message: ${err}`);
    return c.json({ error: `Error al enviar mensaje: ${err}` }, 500);
  }
});

// ============================================================
// ADMIN ROUTES (password-protected)
// ============================================================

// GET /admin/submissions
app.get("/make-server-ba60542a/admin/submissions", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const submissions = await kv.getByPrefix("submission:");
    submissions.sort((a: any, b: any) =>
      new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()
    );
    return c.json({ submissions });
  } catch (err) {
    console.log(`Error fetching submissions: ${err}`);
    return c.json({ error: `Error fetching submissions: ${err}` }, 500);
  }
});

// POST /admin/approve/:id
app.post("/make-server-ba60542a/admin/approve/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const subId = c.req.param("id");
    const submission = await kv.get(`submission:${subId}`);
    if (!submission) return c.json({ error: "Envio no encontrado" }, 404);

    const animalId = await nextId("animal");
    const animal = {
      id: animalId,
      nombre: submission.nombre,
      especie: submission.especie,
      raza: submission.raza,
      edad: submission.edad,
      sexo: submission.sexo,
      tamano: submission.tamano,
      ubicacion: submission.ubicacion,
      descripcion: submission.descripcion,
      imagen: submission.imagen,
      vacunado: submission.vacunado,
      esterilizado: submission.esterilizado,
      desparasitado: submission.desparasitado,
      contactoNombre: submission.contactoNombre,
      contactoEmail: submission.contactoEmail,
      contactoWhatsapp: submission.contactoWhatsapp,
      contactoInstagram: submission.contactoInstagram || "",
      contactoFacebook: submission.contactoFacebook || "",
      contactoTiktok: submission.contactoTiktok || "",
      contactoWeb: submission.contactoWeb || "",
      contactoSobreTi: submission.contactoSobreTi || "",
      fechaPublicacion: new Date().toISOString(),
      slug: await generateUniqueSlug(submission.nombre),
      adoptado: false,
    };

    await kv.set(`animal:${animalId}`, animal);
    await kv.del(`submission:${subId}`);
    return c.json({ message: "Animal aprobado y publicado", animal });
  } catch (err) {
    console.log(`Error approving submission: ${err}`);
    return c.json({ error: `Error al aprobar: ${err}` }, 500);
  }
});

// POST /admin/reject/:id
app.post("/make-server-ba60542a/admin/reject/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const subId = c.req.param("id");
    const submission = await kv.get(`submission:${subId}`);
    if (!submission) return c.json({ error: "Envio no encontrado" }, 404);
    await kv.del(`submission:${subId}`);
    return c.json({ message: "Envio rechazado y eliminado" });
  } catch (err) {
    console.log(`Error rejecting submission: ${err}`);
    return c.json({ error: `Error al rechazar: ${err}` }, 500);
  }
});

// PUT /admin/submissions/:id — edit a pending submission
app.put("/make-server-ba60542a/admin/submissions/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const subId = c.req.param("id");
    const existing = await kv.get(`submission:${subId}`);
    if (!existing) return c.json({ error: "Envio no encontrado" }, 404);

    const updates = await c.req.json();
    const updated = { ...existing, ...updates, id: existing.id, fechaEnvio: existing.fechaEnvio, estado: existing.estado };
    await kv.set(`submission:${subId}`, updated);
    return c.json({ message: "Envio actualizado", submission: updated });
  } catch (err) {
    console.log(`Error updating submission: ${err}`);
    return c.json({ error: `Error al actualizar envio: ${err}` }, 500);
  }
});

// DELETE /admin/animals/:id
app.delete("/make-server-ba60542a/admin/animals/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const animalId = c.req.param("id");
    await kv.del(`animal:${animalId}`);
    return c.json({ message: "Animal eliminado" });
  } catch (err) {
    console.log(`Error deleting animal: ${err}`);
    return c.json({ error: `Error al eliminar: ${err}` }, 500);
  }
});

// POST /admin/animals/:id/toggle-adopted — toggle adopted status
app.post("/make-server-ba60542a/admin/animals/:id/toggle-adopted", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const animalId = c.req.param("id");
    const animal = await kv.get(`animal:${animalId}`);
    if (!animal) return c.json({ error: "Animal no encontrado" }, 404);

    animal.adoptado = !animal.adoptado;
    await kv.set(`animal:${animalId}`, animal);

    return c.json({ message: animal.adoptado ? "Marcado como adoptado" : "Marcado como disponible", animal });
  } catch (err) {
    console.log(`Error toggling adopted status: ${err}`);
    return c.json({ error: `Error al cambiar estado: ${err}` }, 500);
  }
});

// PUT /admin/animals/:id — edit a published animal
app.put("/make-server-ba60542a/admin/animals/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const animalId = c.req.param("id");
    const existing = await kv.get(`animal:${animalId}`);
    if (!existing) return c.json({ error: "Animal no encontrado" }, 404);

    const updates = await c.req.json();
    // Regenerate slug if name changed
    let slug = existing.slug;
    if (updates.nombre && updates.nombre !== existing.nombre) {
      slug = await generateUniqueSlug(updates.nombre);
    }
    const updated = { ...existing, ...updates, id: existing.id, slug, fechaPublicacion: existing.fechaPublicacion };
    await kv.set(`animal:${animalId}`, updated);
    return c.json({ message: "Animal actualizado", animal: updated });
  } catch (err) {
    console.log(`Error updating animal: ${err}`);
    return c.json({ error: `Error al actualizar animal: ${err}` }, 500);
  }
});

// GET /admin/animals
app.get("/make-server-ba60542a/admin/animals", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const animals = await kv.getByPrefix("animal:");
    animals.sort((a: any, b: any) =>
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
    );
    return c.json({ animals });
  } catch (err) {
    console.log(`Error fetching animals: ${err}`);
    return c.json({ error: `Error fetching animals: ${err}` }, 500);
  }
});

// GET /admin/inquiries — list adoption inquiries
app.get("/make-server-ba60542a/admin/inquiries", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const inquiries = await kv.getByPrefix("inquiry:");
    inquiries.sort((a: any, b: any) =>
      new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()
    );
    return c.json({ inquiries });
  } catch (err) {
    console.log(`Error fetching inquiries: ${err}`);
    return c.json({ error: `Error fetching inquiries: ${err}` }, 500);
  }
});

// DELETE /admin/inquiries/:id
app.delete("/make-server-ba60542a/admin/inquiries/:id", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    const id = c.req.param("id");
    await kv.del(`inquiry:${id}`);
    return c.json({ message: "Solicitud eliminada" });
  } catch (err) {
    console.log(`Error deleting inquiry: ${err}`);
    return c.json({ error: `Error al eliminar solicitud: ${err}` }, 500);
  }
});

// POST /admin/seed — seed initial animals (idempotent)
app.post("/make-server-ba60542a/admin/seed", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    // Clear any existing animals first
    const existing = await kv.getByPrefix("animal:");
    for (const animal of existing) {
      if (animal.id) {
        await kv.del(`animal:${animal.id}`);
      }
    }

    const IPFS_BASE = "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeibzy5wyxqndwosyyhkigw5hnomnppdb5rvwmhuzlbrp7xtednazuy";

    const seedAnimals = [
      {
        nombre: "Pelusa",
        especie: "Perro",
        raza: "Poodle mestiza",
        edad: "5 anos",
        sexo: "Hembra",
        tamano: "Mediano",
        ubicacion: "Lima, Peru",
        descripcion: "Pelusa es una amiga playera por excelencia. Le encanta pasear por la playa, correr en la arena y jugar con otros perros. Es muy sociable, carinosa y llena de energia. Busca una familia activa que la quiera llevar de aventuras. Es una poodle mestiza de 5 anos que se lleva bien con ninos y otros animales.",
        imagen: `${IPFS_BASE}/Pelusa.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: false,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Fiona",
        especie: "Perro",
        raza: "Mestiza",
        edad: "15 anos",
        sexo: "Hembra",
        tamano: "Mediano",
        ubicacion: "Lima, Peru",
        descripcion: "La Abuelita Fiona es una perrita sabia y tranquila de 15 anos. A pesar de su edad avanzada, todavia disfruta de paseos cortos y largos ratos de siesta al sol. Fiona es la companera ideal para alguien que busque un amigo calmado y fiel. Tiene todas sus vacunas al dia, esta esterilizada y desparasitada. Merece vivir sus anos dorados rodeada de amor.",
        imagen: `${IPFS_BASE}/Fiona.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Caballito",
        especie: "Perro",
        raza: "Mestizo",
        edad: "9 anos",
        sexo: "Macho",
        tamano: "Grande",
        ubicacion: "Lima, Peru",
        descripcion: "Caballito Fiel hace honor a su nombre: es un perro leal, noble y protector. Con 9 anos de experiencia siendo el mejor amigo del humano, este mestizo grande es perfecto para una familia con espacio. Esta vacunado, castrado y desparasitado. Le encantan los paseos largos y es muy obediente. Solo necesita una oportunidad para demostrar todo el amor que tiene para dar.",
        imagen: `${IPFS_BASE}/Caballito.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Luna",
        especie: "Perro",
        raza: "Cocker Spaniel mestiza",
        edad: "1.5 anos",
        sexo: "Hembra",
        tamano: "Mediano",
        ubicacion: "Lima, Peru",
        descripcion: "Conoce a la dulce Luna, una perrita de 1,5 anos con un corazon muy tierno que se lleva de maravilla con todos los animales. Esta esterilizada y lista para llevar armonia, alegria y mucho carino a una familia que busque una companera dulce y tranquila. Luna es ideal para hogares con otras mascotas, ya que su naturaleza gentil la hace adaptarse facilmente.",
        imagen: `${IPFS_BASE}/Luna.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Tito",
        especie: "Perro",
        raza: "Mestizo",
        edad: "2 anos",
        sexo: "Macho",
        tamano: "Mediano",
        ubicacion: "Lima, Peru",
        descripcion: "Soy Tito jugueton, un perrito feliz de 2 anos con mucha energia y una gran sonrisa. Estoy castrado, vacunado y desparasitado, y no veo la hora de unirme a una familia divertida que disfrute del juego, el entrenamiento y dar muchisimo amor. Tito es perfecto para familias activas que busquen un companero lleno de vida y entusiasmo.",
        imagen: `${IPFS_BASE}/Tito.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Gringa",
        especie: "Perro",
        raza: "Mestiza",
        edad: "3 anos",
        sexo: "Hembra",
        tamano: "Pequeno",
        ubicacion: "Lima, Peru",
        descripcion: "Hola, soy la aventurera Gringa, una perrita juguetona de 3 anos que adora la playa y siempre esta lista para una nueva aventura. Estoy esterilizada, vacunada y desparasitada, y espero encontrar una familia activa y amorosa que me lleve de paseo, juegue conmigo y me haga parte de su vida. Gringa es pequena pero con un corazon enorme.",
        imagen: `${IPFS_BASE}/Gringa.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
    ];

    for (const animalData of seedAnimals) {
      const animalId = await nextId("animal");
      await kv.set(`animal:${animalId}`, {
        id: animalId,
        ...animalData,
        fechaPublicacion: new Date().toISOString(),
        slug: await generateUniqueSlug(animalData.nombre),
      });
    }

    return c.json({ message: `${seedAnimals.length} animales creados exitosamente.`, seeded: true });
  } catch (err) {
    console.log(`Error seeding animals: ${err}`);
    return c.json({ error: `Error al crear animales: ${err}` }, 500);
  }
});

// POST /admin/seed-pending — seed pending submissions for testing
app.post("/make-server-ba60542a/admin/seed-pending", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "No autorizado" }, 401);
  try {
    // Clear existing submissions first
    const existing = await kv.getByPrefix("submission:");
    for (const sub of existing) {
      if (sub.id) {
        await kv.del(`submission:${sub.id}`);
      }
    }

    const IPFS_BASE = "https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeibzy5wyxqndwosyyhkigw5hnomnppdb5rvwmhuzlbrp7xtednazuy";

    const pendingAnimals = [
      {
        nombre: "Bruno",
        especie: "Perro",
        raza: "Schnauzer mestizo",
        edad: "6 anos",
        sexo: "Macho",
        tamano: "Grande",
        ubicacion: "Lima, Peru",
        descripcion: "Conoce a Bruno, un perrito de 6 anos, mezcla de Schnauzer, con una presencia tranquila y un corazon lleno de amor. Esta castrado y listo para ir a casa, esperando encontrar una familia que disfrute de paseos relajados, buena compania y un perro leal siempre a su lado.",
        imagen: `${IPFS_BASE}/Bruno.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Nala",
        especie: "Perro",
        raza: "Mestiza",
        edad: "10 anos",
        sexo: "Hembra",
        tamano: "Grande",
        ubicacion: "Lima, Peru",
        descripcion: "Hola, soy Nala, amante de las personas, una perrita de 10 anos esterilizada, vacunada y desparasitada que ama profundamente a los humanos. Me conecto mucho con ellos y seria muy feliz en un hogar tranquilo; me va mejor siendo la unica perrita hembra (o conviviendo con machos), asi que espero encontrar una familia que pueda darme todo su amor.",
        imagen: `${IPFS_BASE}/Nala.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Negro",
        especie: "Perro",
        raza: "Mestizo",
        edad: "1.5 anos",
        sexo: "Macho",
        tamano: "Mediano",
        ubicacion: "Lima, Peru",
        descripcion: "Me llamo el jugueton Negro y soy un perrito feliz y jugueton que se lleva muy bien con todos los animales. Estoy castrado, vacunado y desparasitado, y sueno con una familia activa y carinosa que disfrute de mi energia divertida y me haga parte de sus aventuras de cada dia.",
        imagen: `${IPFS_BASE}/Negro.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
      {
        nombre: "Mila",
        especie: "Perro",
        raza: "Mestiza",
        edad: "3 anos",
        sexo: "Hembra",
        tamano: "Pequeno",
        ubicacion: "Lima, Peru",
        descripcion: "Esta es Mila divertida y carinosa, una perrita de 3 anos, esterilizada, vacunada y desparasitada, que adora jugar con los ninos. Es divertida, amistosa y llena de personalidad, y esta buscando un hogar amoroso donde pueda ser la mejor amiga peluda de los peques.",
        imagen: `${IPFS_BASE}/Mila.jpg`,
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        contactoNombre: "Braelia Garcia Chuquihuanga",
        contactoEmail: "",
        contactoWhatsapp: "",
        contactoInstagram: "braeliagarcia",
      },
    ];

    for (const data of pendingAnimals) {
      const id = await nextId("sub");
      await kv.set(`submission:${id}`, {
        id,
        ...data,
        fechaEnvio: new Date().toISOString(),
        estado: "pendiente",
      });
    }

    return c.json({ message: `${pendingAnimals.length} envios pendientes creados exitosamente.`, seeded: true });
  } catch (err) {
    console.log(`Error seeding pending submissions: ${err}`);
    return c.json({ error: `Error al crear envios pendientes: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);