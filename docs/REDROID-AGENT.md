# REDROID Agent — API key, enrolamiento y dispositivos

Guía rápida para quien use **REDROID Agent** (u otra herramienta de agente que gestione **Android / ADB**) junto con este proyecto.

## Pantalla del dashboard (API key vs enrolamiento)

En el **dashboard del agente**, la página que **compara o valida la API key con el estado de enrolamiento** solo funcionará si el entorno local puede hablar con los dispositivos y con el servidor. Si algo falla en ese paso, suele ser por permisos o por `adb`, no por la clave en sí.

## Windows: ejecutar como administrador

En **Windows** es recomendable **ejecutar todo el stack del agente con privilegios elevados**:

1. Cierra **REDROID Agent** (y el terminal que lo haya lanzado, si aplica).
2. **Clic derecho** en el acceso directo o en el ejecutable → **Ejecutar como administrador**.
3. Vuelve a abrir el **dashboard**, revisa la **API key** y el **enrolamiento**, y la pestaña de **Dispositivos** / **Móviles Android**.

**Por qué:** en Windows, el bridge **ADB** (`adb.exe`) y el acceso a dispositivos USB/red suelen requerir permisos que el modo normal no otorga. Sin ese nivel, aparecen errores típicos como **`spawn adb ENOENT`** (no encuentra `adb`) o fallos al listar dispositivos, aunque la API key sea correcta.

> **Resumen:** Si estás en **Windows**, **ejecuta el agente como administrador** antes de diagnosticar problemas de API key o enrolamiento.

## macOS / Linux

No suele hacer falta “administrador” equivalente. Lo habitual es:

- Tener **Android Platform Tools** instalados y **`adb` en el PATH** (p. ej. `brew install android-platform-tools`).
- Comprobar en terminal: `which adb` y `adb version`.

Si el agente sigue sin ver dispositivos, revisa la ruta de `adb` en la **configuración del agente** (si permite indicar la ruta absoluta al binario).

---

## Streaming en el dashboard vs “sandbox” / automatización

Es un **conflicto habitual**, no un bug que podamos corregir desde el código de Gallinapp.

### Qué está pasando

Cuando REDROID **proyecta el pantallazo** de tus móviles en **Dispositivos**, el agente suele mantener una sesión de **captura / codificación de vídeo** (similar a scrcpy). Eso puede:

- **Ocupar el canal de vídeo** o el **decodificador** del PC (`EncodingError: Null or empty decoder buffer` en una tarjeta, mientras otras van bien).
- **Impedir u otro proceso** use el mismo dispositivo para otra sesión ADB “exclusiva” o para un **sandbox** de pruebas que también intente controlar la pantalla.
- Hacer que **automatización, grabación o agentes** fallen si compiten por el mismo recurso.

**No es que “el sandbox esté mal” del todo:** muchas veces el dispositivo **ya está atado al streaming** del dashboard y no queda libre para el modo que esperas.

### Qué puedes hacer (orden práctico)

1. **Dejar de proyectar** ese móvil en REDROID cuando necesites el sandbox / automatización: cierra la vista del dispositivo, cambia de pestaña, o usa **Actualizar** tras desconectar la sesión si la app lo permite.
2. **Un dispositivo = un uso a la vez:** si puedes, reserva **un teléfono solo para streaming en REDROID** y **otro** (o un **emulador Android**) para desarrollo / pruebas / “sandbox” sin REDROID encima.
3. Si ves **`EncodingError: Null or empty decoder buffer`** en una tarjeta:
   - Pulsa **Actualizar** en el dashboard.
   - Reinicia la sesión de ese dispositivo o desenchufa y vuelve a conectar USB / depuración.
   - Cierra otras apps que capturen pantalla en el PC (OBS, grabadores, otro scrcpy).
   - Actualiza **drivers de vídeo** en Windows y prueba de nuevo **como administrador**.

### Si “sandbox” es Cursor (terminal / agente de IA)

El **sandbox de Cursor** al ejecutar comandos **no tiene acceso** a USB, ADB ni a lo que REDROID está usando en tu máquina igual que tu terminal normal. Para comandos que necesiten `adb` o dispositivos:

- Ejecuta **`adb`** en una **terminal fuera de Cursor**, o
- Acepta permisos **“All” / sin sandbox** cuando la herramienta lo pida, si aplica.

Eso no quita el conflicto con el **streaming de REDROID**: sigue siendo mejor **no tener el mismo móvil en streaming** mientras otro flujo intenta controlarlo.

---

## Referencia

- Error **`spawn adb ENOENT`**: el proceso no encuentra el ejecutable `adb`; en Windows a menudo se mitiga **ejecutando como administrador** y/o instalando **Platform Tools** y añadiendo la carpeta al `PATH` del sistema.
- **`EncodingError: Null or empty decoder buffer`**: fallo del **decodificador** al pintar el stream; suele aliviarse refrescando el dispositivo, liberando GPU/otras capturas o separando usos (streaming vs automatización).
