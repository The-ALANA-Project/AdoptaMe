import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ba60542a`;

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (!headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    console.error(`API error ${res.status} on ${path}:`, data);
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

// --- Public ---
export async function getAnimals() {
  const data = await request("/animals");
  return data.animals || [];
}

export async function getAnimal(id: string) {
  const data = await request(`/animals/${id}`);
  return data.animal;
}

export async function submitAnimal(submission: any) {
  return request("/submissions", {
    method: "POST",
    body: JSON.stringify(submission),
  });
}

// --- Adoption Inquiry (public, protects rescuer contact) ---
export async function submitInquiry(inquiry: {
  animalId: string;
  animalNombre: string;
  nombre: string;
  email: string;
  telefono: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  vivienda: string;
  otrasMascotas: string;
  experiencia: string;
  mensaje: string;
}) {
  return request("/inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

// --- Image Upload ---
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${publicAnonKey}`,
  };
  // Don't set Content-Type — browser sets it with boundary for FormData
  const res = await fetch(`${BASE}/upload-image`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data.url;
}

// --- Admin ---
function adminHeaders(password: string) {
  return { "X-Admin-Password": password };
}

export async function adminGetSubmissions(password: string) {
  const data = await request("/admin/submissions", {
    headers: adminHeaders(password),
  });
  return data.submissions || [];
}

export async function adminGetAnimals(password: string) {
  const data = await request("/admin/animals", {
    headers: adminHeaders(password),
  });
  return data.animals || [];
}

export async function adminGetInquiries(password: string) {
  const data = await request("/admin/inquiries", {
    headers: adminHeaders(password),
  });
  return data.inquiries || [];
}

export async function adminDeleteInquiry(password: string, id: string) {
  return request(`/admin/inquiries/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });
}

export async function adminSeed(password: string) {
  return request("/admin/seed", {
    method: "POST",
    headers: adminHeaders(password),
  });
}

export async function adminSeedPending(password: string) {
  return request("/admin/seed-pending", {
    method: "POST",
    headers: adminHeaders(password),
  });
}

export async function adminApprove(password: string, id: string) {
  return request(`/admin/approve/${id}`, {
    method: "POST",
    headers: adminHeaders(password),
  });
}

export async function adminReject(password: string, id: string) {
  return request(`/admin/reject/${id}`, {
    method: "POST",
    headers: adminHeaders(password),
  });
}

export async function adminDeleteAnimal(password: string, id: string) {
  return request(`/admin/animals/${id}`, {
    method: "DELETE",
    headers: adminHeaders(password),
  });
}

export async function adminToggleAdopted(password: string, id: string) {
  return request(`/admin/animals/${id}/toggle-adopted`, {
    method: "POST",
    headers: adminHeaders(password),
  });
}

export async function adminUpdateSubmission(password: string, id: string, updates: Record<string, any>) {
  return request(`/admin/submissions/${id}`, {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify(updates),
  });
}

export async function adminUpdateAnimal(password: string, id: string, updates: Record<string, any>) {
  return request(`/admin/animals/${id}`, {
    method: "PUT",
    headers: adminHeaders(password),
    body: JSON.stringify(updates),
  });
}