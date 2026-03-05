# AdoptaMe

**Community-driven animal adoption platform built in Peru.**
**Plataforma comunitaria de adopcion animal construida en Peru.**

![AdoptaMe](https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png)

*Hero photo by [Victor G](https://unsplash.com/@victor_vector) on Unsplash.*

**[adoptame.pe](https://adoptame.pe)**

---

## English

### What is AdoptaMe?

AdoptaMe is an open-source, community-driven animal adoption platform. Anyone can submit a rescued animal through the public form. Submissions are reviewed and approved by an admin before going live. Contact between adopters and rescuers is mediated through adoption inquiry forms that the admin reviews before connecting both parties.

The platform is admin-curated with no user accounts required — keeping it simple, safe, and focused on finding animals loving homes.

### Features

- **Public animal directory** — Browse, search, and filter animals by species, size, sex, and urgency
- **Urgent cases** — Animals in critical situations are flagged with a pulsing "URGENTE" badge and prioritized on the homepage
- **Public submission form** — Rescuers submit animals for review with photos, health info, and contact details
- **Adoption inquiry form** — Potential adopters fill out a detailed form; admin reviews and connects parties
- **Admin panel** — Password-protected dashboard with tabs for pending submissions, published animals, adoption inquiries, and post-adoption follow-up
- **Rescuer profiles** — CRUD system for rescuer profiles with social links and donation buttons, linked to their animals
- **Post-adoption follow-up** — Tracking system for adopted animals with notes and timeline
- **Image handling** — Upload to Supabase Storage with permanent hosting on Pinata/IPFS
- **Email notifications** — Branded transactional emails via Resend (new submissions, adoption inquiries, confirmation to applicants)
- **SEO & social sharing** — Dynamic OG meta tags with server-rendered HTML for social crawlers, dynamic OG image generation (1200x630 branded cards with animal photo, name, location)
- **Slug-based URLs** — Clean, shareable URLs for each animal (e.g., `/animales/pelusa`)
- **Fully responsive** — Mobile-first design with warm coral color palette
- **Google Analytics with cookie consent** — Consent-gated GA4 integration compliant with Peru's Ley 29733; analytics scripts only load after user accepts via a minimal bottom banner, choice persisted in localStorage
- **SEO infrastructure** — Dynamic XML sitemap, robots.txt blocking `/admin`, JSON-LD structured data (Organization, WebSite, CollectionPage, BreadcrumbList, individual animal schemas), geo meta tags for Peru

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router (data mode), Tailwind CSS v4 |
| Backend | Supabase Edge Functions (Hono web server) |
| Database | Supabase KV Store |
| Storage | Supabase Storage + Pinata/IPFS |
| Email | Resend (from `hola@adoptame.pe`) |
| Hosting | Netlify (with edge function for OG proxy) |
| Icons | Lucide React |
| Font | Work Sans |

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero slideshow, stats, and urgent/featured animals |
| `/animales` | Browse all animals with search and filters |
| `/animales/:slug` | Animal detail page with adoption inquiry form |
| `/enviar` | Public submission form for rescuers |
| `/sobre-mi` | About the creator |
| `/terminos` | Terms and conditions |
| `/privacidad` | Privacy policy |
| `/admin` | Admin panel (password-protected via `ADMIN_PASSWORD`) |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `ADMIN_PASSWORD` | Password for the admin panel |
| `RESEND_API_KEY` | Resend API key for email notifications |

### Want to build your own?

This project is MIT-licensed. Fork it, adapt it for your city or country, translate it, change the colors, and launch your own adoption platform. The architecture is intentionally simple: no user accounts, no complex auth flows — just a KV store, an admin password, and a mission to connect rescued animals with loving families.

If you do build something with it, we'd love to hear about it.

---

## Espanol

### Que es AdoptaMe?

AdoptaMe es una plataforma de adopcion animal de codigo abierto e impulsada por la comunidad. Cualquier persona puede enviar un animal rescatado a traves del formulario publico. Los envios son revisados y aprobados por un administrador antes de publicarse. El contacto entre adoptantes y rescatistas se gestiona a traves de formularios de solicitud de adopcion que el administrador revisa antes de conectar a ambas partes.

La plataforma es curada por un administrador y no requiere cuentas de usuario — manteniendola simple, segura y enfocada en encontrar hogares amorosos para los animales.

### Funcionalidades

- **Directorio publico de animales** — Explora, busca y filtra animales por especie, tamano, sexo y urgencia
- **Casos urgentes** — Los animales en situacion critica se marcan con una etiqueta pulsante "URGENTE" y se priorizan en la pagina de inicio
- **Formulario publico de envio** — Los rescatistas envian animales para revision con fotos, informacion de salud y datos de contacto
- **Formulario de solicitud de adopcion** — Los posibles adoptantes completan un formulario detallado; el administrador revisa y conecta a las partes
- **Panel de administracion** — Dashboard protegido con contrasena con pestanas para envios pendientes, animales publicados, solicitudes de adopcion y seguimiento post-adopcion
- **Perfiles de rescatistas** — Sistema CRUD para perfiles de rescatistas con enlaces sociales y botones de donacion, vinculados a sus animales
- **Seguimiento post-adopcion** — Sistema de seguimiento para animales adoptados con notas y linea de tiempo
- **Manejo de imagenes** — Subida a Supabase Storage con alojamiento permanente en Pinata/IPFS
- **Notificaciones por correo** — Correos transaccionales con diseno de marca via Resend (nuevos envios, solicitudes de adopcion, confirmacion a solicitantes)
- **SEO y compartir en redes** — Meta tags OG dinamicos con HTML renderizado en servidor para crawlers sociales, generacion dinamica de imagenes OG (tarjetas de 1200x630 con foto del animal, nombre, ubicacion y marca AdoptaMe)
- **URLs basadas en slug** — URLs limpias y compartibles para cada animal (ej: `/animales/pelusa`)
- **Totalmente responsivo** — Diseno mobile-first con paleta de colores coral calido
- **Google Analytics con consentimiento de cookies** — Integracion GA4 con consentimiento conforme a la Ley 29733 del Peru; los scripts de analitica solo se cargan si el usuario acepta a traves de un banner minimo en la parte inferior, la eleccion se guarda en localStorage
- **Infraestructura SEO** — Sitemap XML dinamico, robots.txt bloqueando `/admin`, datos estructurados JSON-LD (Organization, WebSite, CollectionPage, BreadcrumbList, esquemas individuales por animal), meta tags geograficos para Peru

### Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React, React Router (modo data), Tailwind CSS v4 |
| Backend | Supabase Edge Functions (servidor web Hono) |
| Base de datos | Supabase KV Store |
| Almacenamiento | Supabase Storage + Pinata/IPFS |
| Correo | Resend (desde `hola@adoptame.pe`) |
| Hosting | Netlify (con edge function para proxy OG) |
| Iconos | Lucide React |
| Tipografia | Work Sans |

### Paginas

| Ruta | Descripcion |
|------|-------------|
| `/` | Inicio con slideshow hero, estadisticas y animales urgentes/destacados |
| `/animales` | Explorar todos los animales con busqueda y filtros |
| `/animales/:slug` | Detalle del animal con formulario de solicitud de adopcion |
| `/enviar` | Formulario publico de envio para rescatistas |
| `/sobre-mi` | Sobre la creadora |
| `/terminos` | Terminos y condiciones |
| `/privacidad` | Politica de privacidad |
| `/admin` | Panel de administracion (protegido con `ADMIN_PASSWORD`) |

### Variables de Entorno

| Variable | Proposito |
|----------|-----------|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | Clave publica anon de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio de Supabase (solo servidor) |
| `ADMIN_PASSWORD` | Contrasena para el panel de administracion |
| `RESEND_API_KEY` | Clave API de Resend para notificaciones por correo |

### Quieres construir la tuya?

Este proyecto tiene licencia MIT. Haz un fork, adaptalo para tu ciudad o pais, traducelo, cambia los colores y lanza tu propia plataforma de adopcion. La arquitectura es intencionalmente simple: sin cuentas de usuario, sin flujos complejos de autenticacion — solo un KV store, una contrasena de admin y la mision de conectar animales rescatados con familias amorosas.

Si construyes algo con esto, nos encantaria saberlo.

---

## License / Licencia

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

Este proyecto esta bajo la Licencia MIT. Consulta [LICENSE](./LICENSE) para mas detalles.