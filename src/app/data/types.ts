export interface Animal {
  id: string;
  slug: string;
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
  desparasitado?: boolean;
  contactoNombre: string;
  contactoEmail: string;
  contactoWhatsapp: string;
  contactoInstagram?: string;
  contactoFacebook?: string;
  contactoTiktok?: string;
  contactoWeb?: string;
  contactoSobreTi?: string;
  rescuerId?: string;
  fechaPublicacion: string;
  adoptado?: boolean;
}

export interface Submission {
  id: string;
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
  desparasitado?: boolean;
  contactoNombre: string;
  contactoEmail: string;
  contactoWhatsapp: string;
  contactoSobreTi?: string;
  contactoInstagram?: string;
  contactoFacebook?: string;
  contactoTiktok?: string;
  contactoWeb?: string;
  fechaEnvio: string;
  estado: string;
}

export interface Inquiry {
  id: string;
  animalId: string;
  animalNombre: string;
  nombre: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  vivienda: string;
  otrasMascotas: string;
  experiencia: string;
  mensaje: string;
  seguimiento: boolean;
  fechaEnvio: string;
  estado: string;
}

export interface SeguimientoNote {
  fecha: string;
  texto: string;
}

export interface Seguimiento {
  id: string;
  animalId: string;
  animalNombre: string;
  animalSlug: string;
  animalImagen: string;
  adoptanteNombre: string;
  adoptanteEmail: string;
  adoptanteTelefono: string;
  adoptanteTipoDoc: string;
  adoptanteNumeroDoc: string;
  inquiryId: string;
  fechaAdopcion: string;
  notas: SeguimientoNote[];
}

export interface Rescuer {
  id: string;
  nombre: string;
  foto: string;
  bio: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  web: string;
  email: string;
  whatsapp: string;
  donacion: string;
  fechaCreacion: string;
}