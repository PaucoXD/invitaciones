# Estudio de Invitaciones Digitales

Sistema para hacer invitaciones digitales de **boda y XV años** **sin tocar código**: eliges un diseño,
llenas un formulario y descargas la invitación lista para publicar.

## Qué hay aquí

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | **Página de ventas**: diseños, paquetes con precios, extras, panel de ejemplo, preguntas y botones de WhatsApp. |
| `negocio.js` | **Tus datos de negocio**: nombre, WhatsApp, redes, precios, paquetes, extras y preguntas frecuentes. |
| `aviso-privacidad.html` | Plantilla de aviso de privacidad (revísala antes de usarla). |
| `panel.html` | Panel de confirmaciones para los novios (`?demo=1` para ver un ejemplo). |
| `manual.html` | **Manual del administrador**: todo explicado paso a paso (también se puede imprimir). |
| `i/` | Carpeta donde subes las invitaciones terminadas para publicarlas. |
| `mis-bodas.html` | **Tu panel de administrador**: todas tus bodas, días que faltan y avance de confirmaciones (`?demo=1` para ver un ejemplo). |
| `editor.html` | **El editor.** Formulario + vista previa en vivo + descarga. |
| `invitacion.html` | Muestra una invitación (`?plantilla=boho`, `?b=nombre-de-boda`). |
| `demos/` | Un archivo de demostración por diseño, listo para enviar a clientes. |
| `plantillas/` | 6 diseños de boda (Vino y Olivo, Floral Romántica, Rústica Campestre, Boho Terracota, Elegante Negro y Dorado, Jardín Botánico) y 3 de XV años (Princesa Rosa, Mariposas Lila, Noche de Gala). |
| `plantillas/adornos/` | Aquí van tus ilustraciones PNG propias (ver `LEEME.md`). |
| `motor/` | El código compartido (no necesitas abrirlo). |
| `bodas/ejemplo.js` | Datos de la boda ficticia de ejemplo. |
| `bodas/ejemplo-xv.js` | Datos de unos XV años ficticios de ejemplo. |

## Tu página de ventas

Abre `negocio.js` y cambia tu **nombre**, tu **WhatsApp** (con código de país, por ejemplo `5215512345678`),
redes, **precios**, lo que incluye cada paquete, los extras y las preguntas frecuentes. La página se actualiza sola.
Todos los botones abren WhatsApp con un mensaje ya escrito (paquete o diseño elegido).
El editor no aparece en la página pública: tú entras directo a `editor.html`.

## Cómo hacer una invitación para un cliente

1. Abre `editor.html` en el navegador (doble clic funciona).
2. Elige el diseño arriba y llena las secciones: nombres, fecha, lugares, fotos, regalos, WhatsApp…
3. **Guardar datos** → descarga un `.json` para poder editar esa boda después (**Abrir**).
4. **Descargar invitación** → un solo archivo `.html` con todo incluido (fotos, música, diseño).
5. Súbelo a internet. Opciones gratis: [Netlify Drop](https://app.netlify.com/drop) (arrastras el archivo),
   GitHub Pages o Vercel. Con dominio propio queda como `tunegocio.com/valeria-y-santiago`.
6. **Enlaces de invitados** → pega la dirección publicada y la lista `Nombre | lugares`.
   Te da un enlace por invitado (con su nombre en el sobre) y un botón para mandarlo por WhatsApp.

## XV años

En el editor, arriba de los diseños, elige **👑 XV años**. Aparecen los diseños de XV (Princesa Rosa, Mariposas Lila,
Noche de Gala) y el formulario cambia: un solo nombre (la quinceañera), textos en primera persona ("Mis XV años",
"Mis padres", "¿Me acompañarás?"), padrinos y chambelanes, contactos de mamá y papá e íconos de corona, zapatilla,
mariposa y estrella para el itinerario. Todo lo demás (sobre, invitados, mesas, confirmaciones, panel, PDF) funciona igual.
Demos: `invitacion.html?plantilla=princesa` (o `mariposas`, `gala`) y `demos/princesa.html`.

## Invitados y mesas

- **Invitados:** en la sección *Invitados* del editor anotas cada invitación con su número de lugares
  (Familia López 4, Tía Carmen 1…). Puedes pegar la lista completa desde Excel: `Nombre | lugares | mesa`.
- **Mesas (paquete opcional):** actívalo solo si el cliente lo contrató. Dibujas el salón (mesas, pista,
  mesa de novios, entrada), asignas la mesa de cada invitación y cada invitado ve *“Mesa 5”* con el plano
  y su mesa resaltada. *Lista por mesa* descarga un Excel para el salón o el coordinador.
- **Ver como:** arriba de la vista previa eliges un invitado para ver su invitación personalizada.

## Invitación en PDF

Para quienes no se llevan bien con la tecnología: botón **📄 PDF** en el editor.

- Hoja tamaño **A5** con el mismo diseño de la plantilla; se manda por WhatsApp o se imprime.
- Los botones de **mapa**, **mesa de regalos** y **confirmar por WhatsApp** se pueden tocar dentro del PDF.
- Elige **para quién** es: aparece su nombre, lugares y mesa (si contrataron el paquete Mesas, con el plano).
- Incluye la foto de portada y **todas las fotos de “Historia y fotos”** (hasta 30), con el recorte elegido en *Ajustar posición*.
- Si escribes la dirección publicada, incluye un **código QR** que abre la invitación digital de esa familia.
- **Un PDF por invitado (ZIP):** genera todos de una vez.
- Funciona sin internet: las librerías están en `motor/lib/`.

## Confirmaciones automáticas (paquete)

Las confirmaciones, buenos deseos y canciones se guardan solos en **Google Sheets** (gratis) y los novios
los ven en su **panel** (`panel.html`): personas confirmadas, quién falta (con botón para recordarle por
WhatsApp), quién no asistirá, mensajes y canciones más pedidas, y descarga a Excel.

1. En el editor, sección **Confirmaciones automáticas**, copia el código y sigue los 4 pasos para instalarlo en
   Google Sheets (una sola vez; sirve para todas tus bodas, cada una con su *ID de boda*).
2. Pega la URL de la app web (termina en `/exec`), **Probar conexión** y **Sincronizar lista de invitados**.
3. **Copiar enlace del panel** y mándalo a los novios. La clave del panel no viaja dentro de la invitación.
4. Opcional: *Además abrir WhatsApp* si los novios también quieren recibir el mensaje.

**Entrar al panel de forma sencilla:** pon una sola vez la dirección de tu app de Google en `negocio.js`
(`hojaConfirmaciones`). Así los novios entran a `tusitio/panel.html` solo con su **código de boda** y **clave**,
el celular lo recuerda y pueden agregarlo a su pantalla de inicio. El botón *Copiar acceso para los novios*
del editor arma el mensaje de WhatsApp con el enlace directo, el código y la clave.

Ejemplo del panel con datos ficticios: `panel.html?demo=1`. El código de Google está en `servidor/codigo-sheets.js`.

## Mis bodas (tu panel de administrador)

`mis-bodas.html` muestra todas tus bodas con su fecha, cuántos días faltan, personas confirmadas,
pendientes, buenos deseos y canciones, con alertas cuando la boda está cerca y falta gente por responder.
Desde ahí abres el panel de cada boda o copias el acceso para los novios.

- La **primera vez** que entras, la clave que escribas (mínimo 6 caracteres) queda como tu clave de administrador.
  Se guarda en las propiedades del script de Google, no en la hoja.
- Las bodas aparecen al usar **Sincronizar lista de invitados** en el editor (ahí se envían nombres y fecha).
- Si instalaste el código de Google antes de esta función, vuelve a pegarlo y crea una **nueva versión**
  (Implementar → Administrar implementaciones → ✏️ → Nueva versión). La URL no cambia.

## Personalización por invitado

Cualquier invitación acepta al final del enlace:

```
?invitado=Familia%20López&pases=4&mesa=5
```

## Reemplazar las ilustraciones por las tuyas

Los diseños traen flores, pampas y adornos dibujados. Para que se vean como acuarela profesional:

- **Para una sola boda:** en el editor, sección *Adornos de la plantilla*, sube tu PNG.
- **Para todas las bodas:** guarda el PNG en `plantillas/adornos/` con el nombre indicado
  (por ejemplo `floral-ramo-esquina.png`). Funciona cuando el sitio está publicado o con un servidor local.

Si vas a vender, usa ilustraciones, fuentes y música con **licencia comercial**.

## Notas

- El editor guarda automáticamente en el navegador. Si subes muchas fotos puede no caber:
  usa siempre **Guardar datos** para no perder trabajo.
- Las fotos se reducen automáticamente para que la invitación cargue rápido.
- La cuenta regresiva usa la zona horaria elegida en el editor.
