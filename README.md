# AdoptaMe

Plataforma comunitaria de adopcion animal en Peru.

![AdoptaMe](https://teal-united-parrot-418.mypinata.cloud/ipfs/bafybeihscx6ivorazotnxpzv3gaz2p3a3fdnbs2x6lss6vpp5kmfa3tdai/AdoptaMe%20Social%20Crawler.png)

**adoptame.pe**

Cualquier persona puede enviar un animal en adopcion a traves del formulario publico. Los envios son revisados y aprobados manualmente antes de ser publicados. El contacto entre adoptantes y rescatistas se gestiona a traves de solicitudes de adopcion que son revisadas antes de conectar a las partes.

## Stack

- React + Tailwind CSS v4
- Supabase (KV store, Edge Functions con Hono, Storage, Auth)
- Pinata / IPFS (imagenes)
- Resend (notificaciones por correo)

## Estructura

- `/` — Inicio
- `/animales` — Explorar animales
- `/animales/:slug` — Detalle del animal
- `/enviar` — Formulario publico de envio
- `/sobre-mi` — Sobre la creadora
- `/terminos` — Terminos y condiciones
- `/privacidad` — Politica de privacidad
- `/admin` — Panel de administracion (protegido)
