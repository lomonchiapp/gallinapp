# Gallinapp – PRD (borrador para TestSprite)

Producto: **Gallinapp** – Aplicación y sitio web para gestión avícola (granjas, lotes, producción, ventas).

## Alcance para pruebas (web pública)

- **Landing / marketing**: Página principal con hero, características, precios, FAQ. Navegación y enlaces.
- **Autenticación**: Login y registro (si están expuestos en la web); flujos de inicio de sesión con email o redes.
- **Precios y planes**: Visualización de planes (Básico, Pro, Hacienda), selector de período (mensual/trimestral/anual), CTA hacia checkout o registro.
- **Responsive**: La web debe ser usable en viewport móvil y escritorio.
- **Idioma**: Contenido en español (y selector de idioma si existe).

## Criterios de éxito

- Las páginas cargan sin errores críticos en consola.
- Los botones y enlaces principales son clicables y llevan a la pantalla esperada.
- Los formularios de login/registro aceptan entrada y responden (éxito o error visible).
- La sección de precios muestra los planes y precios correctos según el período elegido.

## Notas

- Backend y Firebase no están cubiertos en este PRD; enfocado en frontend (React/Vite) de la web pública.
- Para pruebas de la app móvil (Expo) o del panel admin, usar un PRD específico o otro scope en TestSprite.
