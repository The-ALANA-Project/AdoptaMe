import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { SEO } from "../components/SEO";

export function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <SEO
        title="Terminos de Uso"
        description="Terminos y condiciones de uso de AdoptaMe, plataforma comunitaria de adopcion animal en Peru."
        path="/terminos"
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
        Terminos de Uso
      </h1>
      <p className="text-muted-foreground mb-10" style={{ fontSize: "0.875rem" }}>
        Ultima actualizacion: 4 de marzo de 2026
      </p>

      <div className="space-y-8 text-foreground" style={{ fontSize: "0.9375rem", lineHeight: 1.8 }}>
        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            1. Aceptacion de los terminos
          </h2>
          <p className="text-muted-foreground">
            Al acceder y utilizar la plataforma AdoptaMe (adoptame.pe), aceptas estos terminos de uso
            en su totalidad. Si no estas de acuerdo con alguna parte de estos terminos, te pedimos que
            no utilices la plataforma. AdoptaMe es un proyecto personal y comunitario sin fines de lucro
            que busca conectar animales en situacion de abandono con familias adoptantes en Peru.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            2. Descripcion del servicio
          </h2>
          <p className="text-muted-foreground">
            AdoptaMe es una plataforma intermediaria que facilita la conexion entre rescatistas o
            cuidadores temporales de animales y personas interesadas en adoptar. No somos un refugio ni
            albergue. No tenemos custodia legal de los animales publicados. La plataforma es operada de
            forma personal y no constituye una empresa ni organizacion formal. La plataforma permite:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
            <li>Publicar perfiles de animales en busca de hogar, sujeto a aprobacion del administrador.</li>
            <li>Explorar animales disponibles para adopcion.</li>
            <li>Enviar solicitudes de adopcion que son revisadas antes de conectar a las partes.</li>
            <li>Contactar al administrador a traves del formulario disponible en la pagina &ldquo;Sobre mi&rdquo;.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            3. Edad minima
          </h2>
          <p className="text-muted-foreground">
            La plataforma esta dirigida a personas mayores de 18 anos. Los menores de edad pueden
            navegar la plataforma bajo la supervision de un padre o tutor, pero no deben enviar
            formularios ni proporcionar datos personales sin el consentimiento de un adulto responsable.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            4. Envio de animales
          </h2>
          <p className="text-muted-foreground">
            Cualquier persona puede enviar un animal para publicacion a traves del formulario de envio.
            Todos los envios son revisados y aprobados o rechazados por el administrador de AdoptaMe. Al enviar
            un animal, declaras que:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1.5 text-muted-foreground">
            <li>La informacion proporcionada es veraz y completa.</li>
            <li>Tienes conocimiento directo del estado del animal o eres su cuidador.</li>
            <li>Las fotos corresponden al animal descrito y no infringen derechos de terceros.</li>
            <li>
              Consientes que tu nombre, descripcion personal (&ldquo;sobre ti&rdquo;) y redes sociales
              (Instagram, Facebook, TikTok, pagina web) sean visibles publicamente en el perfil del animal,
              segun los campos que hayas proporcionado.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            5. Solicitudes de adopcion
          </h2>
          <p className="text-muted-foreground">
            Las solicitudes de adopcion son revisadas por el administrador de AdoptaMe antes de conectar al
            interesado con el rescatista. No garantizamos que toda solicitud resulte en una adopcion
            exitosa. El rescatista tiene la decision final sobre a quien confiar el animal. AdoptaMe no
            cobra ningun monto por el uso de la plataforma ni por las adopciones facilitadas.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            6. Moderacion y remocion de contenido
          </h2>
          <p className="text-muted-foreground">
            El administrador de AdoptaMe se reserva el derecho de rechazar envios, editar publicaciones,
            eliminar animales publicados o marcarlos como adoptados en cualquier momento y sin previo aviso,
            por cualquier motivo, incluyendo pero no limitado a: informacion falsa, contenido inapropiado,
            duplicados, o a solicitud del rescatista original.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            7. Responsabilidades del usuario
          </h2>
          <ul className="list-disc pl-6 space-y-1.5 text-muted-foreground">
            <li>No publicar informacion falsa, enganosa o que incite al maltrato animal.</li>
            <li>No utilizar la plataforma con fines comerciales, de cria o venta de animales.</li>
            <li>Tratar con respeto a rescatistas, adoptantes y al administrador de AdoptaMe.</li>
            <li>Reportar cualquier contenido inapropiado o sospechoso.</li>
            <li>No intentar acceder a areas restringidas de la plataforma sin autorizacion.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            8. Limitacion de responsabilidad
          </h2>
          <p className="text-muted-foreground">
            AdoptaMe actua unicamente como intermediario y es un proyecto personal sin fines de lucro.
            No somos responsables por el estado de salud de los animales, la veracidad de la informacion
            proporcionada por terceros, ni por el resultado de las adopciones. Recomendamos a los adoptantes
            verificar la informacion del animal y realizar una visita previa antes de formalizar cualquier
            adopcion. AdoptaMe no garantiza la disponibilidad ininterrumpida del servicio ni se hace
            responsable por perdidas derivadas de interrupciones o fallos tecnicos.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            9. Contenido y propiedad intelectual
          </h2>
          <p className="text-muted-foreground">
            Las fotos e informacion de los animales son proporcionadas por los rescatistas y cuidadores.
            El diseno, codigo y marca de AdoptaMe son propiedad del proyecto. Al subir contenido a la
            plataforma, otorgas a AdoptaMe una licencia no exclusiva para usar, mostrar y compartir
            dicho contenido con el unico fin de facilitar la adopcion del animal. Esta licencia se
            mantiene vigente mientras el contenido este publicado y se revoca automaticamente al ser
            eliminado de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            10. Ley aplicable
          </h2>
          <p className="text-muted-foreground">
            Estos terminos se rigen por las leyes de la Republica del Peru. Cualquier controversia
            derivada del uso de la plataforma sera resuelta conforme a la legislacion peruana vigente.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            11. Modificaciones
          </h2>
          <p className="text-muted-foreground">
            Nos reservamos el derecho de modificar estos terminos en cualquier momento. Los cambios
            entraran en vigor al ser publicados en esta pagina con la fecha de actualizacion
            correspondiente. El uso continuado de la plataforma despues de cualquier modificacion
            constituye la aceptacion de los nuevos terminos.
          </p>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            12. Contacto
          </h2>
          <p className="text-muted-foreground">
            Si tienes preguntas sobre estos terminos de uso, puedes contactarnos a traves del formulario
            disponible en nuestra{" "}
            <Link to="/sobre-mi" className="text-primary hover:text-primary/80 no-underline">
              pagina de contacto
            </Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
