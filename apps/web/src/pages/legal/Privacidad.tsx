import { LegalLayout, LegalProseStyles } from "./LegalLayout"

export default function Privacidad() {
  return (
    <LegalLayout
      active="privacidad"
      title="Política de Privacidad"
      intro="Cómo recopilamos, usamos y protegemos tus datos en Gallinapp. Cumplimos con la Ley 172-13 de protección de datos de la República Dominicana."
      lastUpdated="20 de abril de 2026"
    >
      <LegalProseStyles />

      <h2>1. Responsable del tratamiento</h2>
      <p>
        El responsable del tratamiento de tus datos personales es{" "}
        <strong>Gallinapp Inc.</strong>, con domicilio en Santo Domingo, República Dominicana.
        Contacto del responsable de protección de datos:{" "}
        <a href="mailto:privacidad@gallinapp.com">privacidad@gallinapp.com</a>.
      </p>

      <h2>2. Datos que recopilamos</h2>
      <h3>2.1 Datos que tú nos das</h3>
      <ul>
        <li>
          <strong>Identificación:</strong> nombre, correo electrónico, número de teléfono, RNC o
          cédula cuando se utiliza facturación.
        </li>
        <li>
          <strong>Cuenta y autenticación:</strong> contraseña encriptada (vía Firebase Auth),
          identificadores de inicio de sesión social.
        </li>
        <li>
          <strong>Datos de la operación:</strong> nombres de granjas, lotes, galpones, registros
          de producción y mortalidad, gastos, ventas, clientes, inventario, vacunaciones.
        </li>
        <li>
          <strong>Datos de pago:</strong> los procesa directamente Stripe / Apple / Google. No
          almacenamos números completos de tarjetas en nuestros servidores.
        </li>
      </ul>

      <h3>2.2 Datos que recopilamos automáticamente</h3>
      <ul>
        <li>Direcciones IP, modelo y sistema operativo del dispositivo, idioma, zona horaria.</li>
        <li>Eventos de uso (pantallas visitadas, acciones realizadas) para mejorar el producto.</li>
        <li>Logs técnicos y reportes de errores (a través de Sentry).</li>
        <li>Notificaciones push (token de dispositivo).</li>
      </ul>

      <h3>2.3 Datos de terceros</h3>
      <ul>
        <li>Eventos de pago y suscripción de Stripe y RevenueCat.</li>
        <li>Información básica del perfil al iniciar sesión con proveedores OAuth.</li>
      </ul>

      <h2>3. Bases legales y finalidades</h2>
      <p>Tratamos tus datos personales sobre las siguientes bases:</p>
      <ul>
        <li>
          <strong>Ejecución del contrato:</strong> prestar el Servicio, gestionar tu cuenta,
          procesar pagos y enviarte comunicaciones operativas.
        </li>
        <li>
          <strong>Interés legítimo:</strong> seguridad de la plataforma, prevención de fraude,
          mejora del producto a partir de datos agregados y análisis.
        </li>
        <li>
          <strong>Consentimiento:</strong> envío de comunicaciones de marketing, notificaciones
          push, uso de cookies no esenciales.
        </li>
        <li>
          <strong>Cumplimiento legal:</strong> respuesta a requerimientos de autoridades,
          contabilidad, retención fiscal.
        </li>
      </ul>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>
        No vendemos tus datos personales. Los compartimos únicamente con proveedores que nos
        ayudan a operar el Servicio, bajo contratos que les obligan a confidencialidad y
        seguridad:
      </p>
      <ul>
        <li>
          <strong>Google Cloud / Firebase</strong> (Estados Unidos) — almacenamiento,
          autenticación, base de datos, funciones serverless.
        </li>
        <li>
          <strong>Stripe</strong> (Estados Unidos) — procesamiento de pagos en la web.
        </li>
        <li>
          <strong>RevenueCat</strong> (Estados Unidos) — gestión de suscripciones in-app en iOS
          y Android.
        </li>
        <li>
          <strong>Apple App Store / Google Play Store</strong> — procesamiento de compras desde
          la app móvil.
        </li>
        <li>
          <strong>Sentry</strong> (Estados Unidos) — monitoreo de errores y rendimiento.
        </li>
        <li>
          <strong>Proveedores de email transaccional</strong> para enviarte recibos,
          confirmaciones y restablecimientos de contraseña.
        </li>
        <li>
          <strong>Autoridades</strong> cuando lo requiera la ley (DGII, tribunales, autoridades
          de protección de datos).
        </li>
      </ul>

      <h2>5. Transferencias internacionales</h2>
      <p>
        Algunos de nuestros proveedores procesan datos en Estados Unidos y otros países fuera de
        la República Dominicana. Adoptamos garantías contractuales (cláusulas tipo) para
        asegurar un nivel de protección adecuado.
      </p>

      <h2>6. Plazo de conservación</h2>
      <p>
        Conservamos tus datos mientras tu cuenta esté activa y por hasta <strong>24 meses</strong>{" "}
        adicionales después de la cancelación, salvo obligaciones legales que exijan plazos
        mayores (por ejemplo, conservación contable y fiscal de 10 años en RD para datos de
        facturación). Los datos anonimizados pueden conservarse de forma indefinida con fines
        estadísticos.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Implementamos medidas técnicas y organizativas razonables para proteger tus datos:
        encriptación en tránsito (TLS 1.2+) y en reposo, autenticación segura, principio de
        mínimo privilegio, monitoreo continuo, backups automáticos diarios y reglas de seguridad
        granulares en Firestore. Ningún sistema es 100% inviolable; en caso de incidente que
        afecte tus datos personales, te notificaremos según lo exige la ley.
      </p>

      <h2>8. Tus derechos</h2>
      <p>
        Como titular de los datos puedes ejercer en cualquier momento los siguientes derechos
        reconocidos por la <strong>Ley 172-13</strong> de la República Dominicana y normativas
        equivalentes:
      </p>
      <ul>
        <li>
          <strong>Acceso:</strong> obtener una copia de los datos que tenemos sobre ti.
        </li>
        <li>
          <strong>Rectificación:</strong> corregir datos inexactos o incompletos.
        </li>
        <li>
          <strong>Supresión:</strong> solicitar la eliminación de tus datos (sujeto a
          obligaciones legales de conservación).
        </li>
        <li>
          <strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo.
        </li>
        <li>
          <strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y de uso
          común.
        </li>
        <li>
          <strong>Limitación:</strong> solicitar el bloqueo temporal del tratamiento.
        </li>
        <li>
          <strong>Retiro del consentimiento:</strong> cuando el tratamiento se base en él.
        </li>
      </ul>
      <p>
        Para ejercer estos derechos, escribe a{" "}
        <a href="mailto:privacidad@gallinapp.com">privacidad@gallinapp.com</a> indicando tu
        solicitud y datos de identificación. Responderemos en un plazo máximo de 30 días.
      </p>

      <h2>9. Datos de colaboradores</h2>
      <p>
        Si invitas colaboradores a tu granja, eres responsable de obtener su consentimiento para
        compartir su información con Gallinapp y de informarles sobre esta Política de
        Privacidad.
      </p>

      <h2>10. Menores de edad</h2>
      <p>
        El Servicio no está dirigido a menores de 18 años. No recopilamos intencionadamente
        datos de menores. Si tomamos conocimiento de que un menor nos ha proporcionado datos
        personales, los eliminaremos.
      </p>

      <h2>11. Cookies y tecnologías similares</h2>
      <p>
        Usamos cookies estrictamente necesarias (sesión, preferencias, seguridad) y cookies
        analíticas básicas. No usamos cookies publicitarias de terceros para perfilamiento
        cruzado. Puedes configurar tu navegador para rechazar cookies, aunque algunas funciones
        del sitio podrían no operar correctamente.
      </p>

      <h2>12. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta Política periódicamente. Publicaremos la versión vigente con la
        fecha de "última actualización". Si los cambios son materiales, te avisaremos por email
        o dentro del Servicio.
      </p>

      <h2>13. Contacto y autoridad de control</h2>
      <p>
        Para cualquier consulta sobre privacidad escribe a{" "}
        <a href="mailto:privacidad@gallinapp.com">privacidad@gallinapp.com</a>. Si consideras
        que el tratamiento de tus datos no cumple con la normativa, tienes derecho a presentar
        un reclamo ante la autoridad competente en la República Dominicana.
      </p>
    </LegalLayout>
  )
}
