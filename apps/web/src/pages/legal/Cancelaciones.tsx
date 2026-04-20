import { LegalLayout, LegalProseStyles } from "./LegalLayout"

export default function Cancelaciones() {
  return (
    <LegalLayout
      active="cancelaciones"
      title="Política de Cancelaciones y Reembolsos"
      intro="Cómo cancelar tu suscripción y nuestra política de reembolsos. Lee con atención antes de suscribirte: al pagar aceptas estos términos."
      lastUpdated="20 de abril de 2026"
    >
      <LegalProseStyles />

      <h2>1. Resumen rápido</h2>
      <p>
        Puedes cancelar tu suscripción en cualquier momento desde tu cuenta. La cancelación{" "}
        <strong>detiene la próxima renovación</strong> y conservas el acceso hasta que termine
        el ciclo ya pagado. <strong>No se realizan reembolsos prorrateados</strong> de
        suscripciones en curso, salvo en los casos expresamente previstos en esta Política o
        cuando la ley aplicable lo exija.
      </p>

      <h2>2. Prueba gratuita de 14 días</h2>
      <p>
        Las suscripciones a los planes Básico, Pro y Hacienda incluyen <strong>14 días gratis</strong>.
        Durante este período puedes cancelar sin costo. Si no cancelas antes de que termine la
        prueba, la suscripción se convertirá automáticamente en pagada al precio del plan
        elegido y se cargará tu método de pago.
      </p>
      <p>
        <strong>Importante:</strong> los recordatorios de fin de prueba se envían como cortesía
        pero no garantizamos su entrega. Es tu responsabilidad cancelar a tiempo si no deseas
        continuar.
      </p>

      <h2>3. Cómo cancelar</h2>
      <h3>3.1 Si pagas vía web (Stripe)</h3>
      <ul>
        <li>
          Inicia sesión en{" "}
          <a href="https://gallinapp.com">gallinapp.com</a> y ve a{" "}
          <strong>Configuración → Suscripción → Cancelar suscripción</strong>.
        </li>
        <li>Confirma la cancelación. Recibirás un correo de confirmación.</li>
      </ul>
      <h3>3.2 Si pagas en iOS (App Store)</h3>
      <p>
        La gestión de cancelación se realiza directamente desde Apple. En tu iPhone abre{" "}
        <strong>Ajustes → [Tu nombre] → Suscripciones</strong>, selecciona Gallinapp y toca{" "}
        <strong>Cancelar suscripción</strong>. Las suscripciones de App Store se rigen también
        por las{" "}
        <a href="https://www.apple.com/legal/internet-services/itunes/">condiciones de Apple</a>.
      </p>
      <h3>3.3 Si pagas en Android (Google Play)</h3>
      <p>
        Abre la app de <strong>Google Play → Menú → Pagos y suscripciones → Suscripciones</strong>,
        selecciona Gallinapp y elige <strong>Cancelar suscripción</strong>. Aplican también las{" "}
        <a href="https://play.google.com/intl/es/about/play-terms/">condiciones de Google Play</a>.
      </p>

      <h2>4. Efectos de la cancelación</h2>
      <ul>
        <li>
          <strong>Acceso continuo</strong> a las funciones pagadas hasta el final del ciclo de
          facturación ya cobrado.
        </li>
        <li>
          <strong>No se cobrará el siguiente ciclo</strong> en tu método de pago.
        </li>
        <li>
          Al finalizar el período pagado, la cuenta pasa al plan <strong>Colaborador
          (gratuito)</strong> con los límites correspondientes (no podrás administrar granjas
          propias, solo colaborar en granjas de terceros que te inviten).
        </li>
        <li>
          Tus datos quedarán <strong>conservados por 24 meses</strong> después de la
          cancelación, durante los cuales puedes reactivar la suscripción y recuperar el acceso.
          Pasado ese plazo podrán ser eliminados de manera definitiva.
        </li>
      </ul>

      <h2>5. Política de reembolsos</h2>
      <p>
        Como regla general, las suscripciones a Gallinapp <strong>no son reembolsables</strong>{" "}
        una vez que el cobro ha sido procesado. Esto incluye:
      </p>
      <ul>
        <li>Suscripciones mensuales, trimestrales o anuales ya cobradas.</li>
        <li>Cancelaciones realizadas a mitad de un ciclo.</li>
        <li>Períodos en los que el usuario decidió no usar el Servicio.</li>
        <li>
          Cambios de plan a uno inferior — el cambio aplica al siguiente ciclo, sin reembolso
          del actual.
        </li>
        <li>
          Cancelaciones tras vencer el período de prueba si no se canceló antes de su
          finalización.
        </li>
        <li>Bloqueos o terminaciones por incumplimiento de los Términos.</li>
      </ul>

      <h2>6. Excepciones limitadas</h2>
      <p>
        A nuestra entera discreción y caso por caso, podremos otorgar reembolsos parciales o
        totales en las siguientes situaciones:
      </p>
      <ul>
        <li>
          <strong>Doble cobro</strong> demostrable atribuible a un error técnico de Gallinapp.
        </li>
        <li>
          <strong>Indisponibilidad continua del Servicio</strong> superior a 72 horas
          consecutivas, atribuible a Gallinapp y debidamente reportada a soporte.
        </li>
        <li>
          <strong>Fraude</strong> demostrado en el método de pago utilizado, previa verificación
          y notificación a las autoridades.
        </li>
      </ul>
      <p>
        Las solicitudes deben enviarse a{" "}
        <a href="mailto:facturacion@gallinapp.com">facturacion@gallinapp.com</a> dentro de los{" "}
        <strong>14 días</strong> siguientes al cobro objetado, acompañadas de evidencia. Los
        reembolsos aprobados se procesan al método de pago original en un plazo de 5 a 15 días
        hábiles.
      </p>

      <h2>7. Compras a través de App Store y Google Play</h2>
      <p>
        Cuando la compra se realiza dentro de la app móvil, los reembolsos los gestiona{" "}
        <strong>Apple</strong> o <strong>Google</strong> según sus propias políticas. Gallinapp{" "}
        <strong>no puede emitir reembolsos directos</strong> sobre cobros procesados por estas
        plataformas. Debes presentar tu solicitud directamente en:
      </p>
      <ul>
        <li>
          Apple:{" "}
          <a href="https://reportaproblem.apple.com/" target="_blank" rel="noopener noreferrer">
            reportaproblem.apple.com
          </a>
        </li>
        <li>
          Google Play:{" "}
          <a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noopener noreferrer">
            support.google.com/googleplay
          </a>
        </li>
      </ul>

      <h2>8. Cambios de plan</h2>
      <ul>
        <li>
          <strong>Upgrade (mejora):</strong> el cambio es inmediato. Cobramos la diferencia
          prorrateada por los días restantes del ciclo actual.
        </li>
        <li>
          <strong>Downgrade (rebaja):</strong> el cambio aplica al inicio del siguiente ciclo de
          facturación. No hay reembolso por el ciclo en curso.
        </li>
        <li>
          Cualquier feature exclusiva del plan superior dejará de estar disponible al hacer
          downgrade. Es tu responsabilidad exportar tus datos antes del cambio si aplica.
        </li>
      </ul>

      <h2>9. Modificación de precios</h2>
      <p>
        Si Gallinapp aumenta el precio de tu plan, te avisaremos con al menos{" "}
        <strong>30 días de anticipación</strong>. El nuevo precio aplicará en la siguiente
        renovación. Si no estás de acuerdo, puedes cancelar antes de la renovación sin penalidad.
      </p>

      <h2>10. Suspensión por falta de pago</h2>
      <p>
        Si el cobro de la renovación falla, intentaremos cobrarlo nuevamente durante un período
        de gracia de hasta 7 días. Si el pago sigue sin procesarse, la suscripción se{" "}
        <strong>suspenderá automáticamente</strong>. Tendrás 30 días adicionales para
        regularizar el pago antes de que la cuenta pase a estado de cancelación.
      </p>

      <h2>11. Terminación por parte de Gallinapp</h2>
      <p>
        Gallinapp se reserva el derecho de cancelar suscripciones por incumplimiento de los{" "}
        <a href="/terminos">Términos de Uso</a>, fraude, abuso del Servicio o uso ilegal. En
        estos casos <strong>no se realizarán reembolsos</strong>, sin perjuicio de las acciones
        legales que correspondan.
      </p>

      <h2>12. Recuperación de datos tras cancelación</h2>
      <p>
        Durante 24 meses tras la cancelación puedes reactivar tu cuenta y recuperar tus datos
        sin costo. Pasado ese plazo, los datos podrán eliminarse definitivamente de forma
        irreversible. Recomendamos exportar tus datos (Excel/PDF) antes de cancelar; los planes
        Básico, Pro y Hacienda incluyen exportación.
      </p>

      <h2>13. Contacto</h2>
      <p>
        Para gestiones de cancelación o reembolso escribe a{" "}
        <a href="mailto:facturacion@gallinapp.com">facturacion@gallinapp.com</a>. Para consultas
        legales, a <a href="mailto:legal@gallinapp.com">legal@gallinapp.com</a>.
      </p>
    </LegalLayout>
  )
}
