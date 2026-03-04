import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { SEO } from "../components/SEO";

export function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <SEO
        title="Politica de Privacidad"
        description="Conoce como AdoptaMe protege tu informacion personal. No creamos cuentas, no usamos cookies de rastreo."
        path="/privacidad"
      />
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground no-underline mb-8"
        style={{ fontSize: "0.875rem" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>

      <h1 className="mb-2" style={{ fontSize: "2rem", fontWeight: 600 }}>
        Politica de Privacidad
      </h1>
      <p className="text-muted-foreground mb-10" style={{ fontSize: "0.875rem" }}>
        Ultima actualizacion: 4 de marzo de 2026
      </p>

      <div className="space-y-8 text-foreground" style={{ fontSize: "0.9375rem", lineHeight: 1.8 }}>
        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            1. Informacion que recopilamos
          </h2>
          <p className="text-muted-foreground mb-3">
            AdoptaMe recopila unicamente la informacion que proporcionas voluntariamente al usar la
            plataforma. No creamos cuentas de usuario ni rastreamos tu actividad. Los datos que podemos
            recibir incluyen:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Al enviar un animal:</strong> nombre del cuidador, correo electronico,
              numero de WhatsApp, descripcion personal (&ldquo;sobre ti&rdquo;), cuentas de redes sociales
              (Instagram, Facebook, TikTok), pagina web, y datos del animal (nombre, especie, raza, edad,
              sexo, tamano, ubicacion, fotos, descripcion y estado de salud).
            </li>
            <li>
              <strong className="text-foreground">Al solicitar una adopcion:</strong> nombre del interesado, correo
              electronico, telefono y mensaje de presentacion.
            </li>
            <li>
              <strong className="text-foreground">Al usar el formulario de contacto:</strong> nombre, correo electronico
              y mensaje. Este formulario esta disponible en la pagina &ldquo;Sobre mi&rdquo; y se utiliza
              para consultas generales.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            2. Como usamos tu informacion
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Datos del rescatista (publicos):</strong> el nombre, la descripcion
              personal (&ldquo;sobre ti&rdquo;) y las redes sociales (Instagram, Facebook, TikTok, pagina web)
              se muestran publicamente en el perfil del animal para dar contexto sobre quien cuida al
              animal. Solo se muestran los campos que hayas proporcionado.
            </li>
            <li>
              <strong className="text-foreground">Datos del rescatista (privados):</strong> el correo electronico y
              numero de WhatsApp nunca se muestran publicamente. Solo se comparten con adoptantes cuya
              solicitud ha sido aprobada por el administrador.
            </li>
            <li>
              <strong className="text-foreground">Datos del adoptante:</strong> se utilizan exclusivamente para evaluar
              la solicitud de adopcion y, si es aprobada, para conectar al adoptante con el rescatista.
            </li>
            <li>
              <strong className="text-foreground">Datos del formulario de contacto:</strong> se utilizan unicamente
              para responder a tu consulta.
            </li>
            <li>
              <strong className="text-foreground">Notificaciones internas:</strong> cuando se recibe un nuevo envio de
              animal, una solicitud de adopcion o un mensaje de contacto, se envia una notificacion por
              correo electronico al administrador de AdoptaMe para agilizar la revision.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            3. Almacenamiento y seguridad
          </h2>
          <p className="text-muted-foreground">
            Los datos se almacenan en servidores seguros proporcionados por{" "}
            <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 no-underline">Supabase</a>,
            con cifrado en transito y en reposo. Las imagenes de los animales se almacenan en{" "}
            <a href="https://www.pinata.cloud" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 no-underline">IPFS a traves de Pinata</a>{" "}
            y en Supabase Storage. Implementamos medidas de seguridad razonables para proteger tu
            informacion, pero ninguna transmision por Internet es 100% segura.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            4. Servicios de terceros
          </h2>
          <p className="text-muted-foreground mb-3">
            Para el funcionamiento de la plataforma, utilizamos los siguientes servicios de terceros
            que pueden procesar datos en nuestro nombre:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Supabase:</strong> almacenamiento de datos y archivos
              (servidores en la nube con cifrado).
            </li>
            <li>
              <strong className="text-foreground">Pinata / IPFS:</strong> almacenamiento descentralizado de imagenes.
            </li>
            <li>
              <strong className="text-foreground">Resend:</strong> envio de notificaciones por correo electronico
              al administrador. Tu correo electronico puede ser procesado por Resend unicamente para la
              entrega de estas notificaciones.
            </li>
          </ul>
          <p className="text-muted-foreground mt-3">
            No utilizamos servicios de analitica, publicidad ni redes de seguimiento de terceros.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            5. Comparticion de datos
          </h2>
          <p className="text-muted-foreground">
            No vendemos, alquilamos ni compartimos tu informacion personal con terceros con fines
            comerciales. Solo compartimos datos de contacto privados (correo, WhatsApp, telefono) entre
            rescatistas y adoptantes cuando una solicitud de adopcion ha sido aprobada por el administrador
            de AdoptaMe. La informacion publica del cuidador (nombre, descripcion personal, redes sociales
            y pagina web) es visible para todos los visitantes de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            6. Cookies y rastreo
          </h2>
          <p className="text-muted-foreground">
            AdoptaMe no utiliza cookies de rastreo, publicidad ni analitica de terceros. No realizamos
            seguimiento de tu comportamiento ni creamos perfiles de navegacion. No recopilamos
            direcciones IP ni datos de navegacion con fines de identificacion.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            7. Retencion de datos
          </h2>
          <p className="text-muted-foreground">
            Los datos de los animales publicados permanecen en la plataforma mientras el animal este
            disponible para adopcion o haya sido marcado como adoptado (como referencia historica). Los
            envios rechazados y las solicitudes de adopcion se conservan por un periodo razonable para
            fines operativos y luego pueden ser eliminados. Puedes solicitar la eliminacion de tus datos
            en cualquier momento contactandonos.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            8. Tus derechos
          </h2>
          <p className="text-muted-foreground mb-3">
            De acuerdo con la Ley N.° 29733, Ley de Proteccion de Datos Personales del Peru, tienes
            derecho a:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
            <li>Solicitar la eliminacion de tus datos personales o de un animal que hayas publicado.</li>
            <li>Solicitar la correccion de informacion inexacta.</li>
            <li>Conocer que datos tuyos tenemos almacenados.</li>
            <li>Oponerte al tratamiento de tus datos personales.</li>
          </ul>
          <p className="text-muted-foreground mt-3">
            Para ejercer cualquiera de estos derechos, contactanos a traves del formulario
            disponible en nuestra{" "}
            <Link to="/sobre-mi" className="text-primary hover:text-primary/80 no-underline">
              pagina de contacto
            </Link>.
            Responderemos a tu solicitud en un plazo razonable.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            9. Menores de edad
          </h2>
          <p className="text-muted-foreground">
            AdoptaMe no esta disenada para ser utilizada por menores de 18 anos sin supervision de un
            adulto. No recopilamos intencionalmente informacion de menores. Si eres menor de edad,
            te pedimos que un padre o tutor supervise el uso de la plataforma y que no envies datos
            personales sin su consentimiento.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            10. Cambios a esta politica
          </h2>
          <p className="text-muted-foreground">
            Podemos actualizar esta politica de privacidad periodicamente. Cualquier cambio sera
            publicado en esta pagina con la fecha de actualizacion correspondiente. Te recomendamos
            revisarla de vez en cuando.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            11. Contacto
          </h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre esta politica de privacidad o deseas ejercer tus derechos,
            puedes contactarnos a traves del formulario disponible en nuestra{" "}
            <Link to="/sobre-mi" className="text-primary hover:text-primary/80 no-underline">
              pagina de contacto
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
