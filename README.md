# Estudio de Invitaciones Digitales

Sistema para hacer invitaciones digitales de **boda, XV años, bautizo, primera comunión, baby shower y cumpleaños** **sin tocar código**: eliges un diseño,
llenas un formulario y descargas la invitación lista para publicar.

## Qué hay aquí

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | **Página de ventas**: diseños, paquetes con precios, extras, panel de ejemplo, preguntas y botones de WhatsApp. |
| `negocio.js` | **Tus datos de negocio**: nombre, WhatsApp, redes, precios, paquetes, extras y preguntas frecuentes. |
| `aviso-privacidad.html` | Plantilla de aviso de privacidad (revísala antes de usarla). |
| `pedido.html` | **Formulario para tu cliente**: llena sus datos, fotos e invitados desde el celular y te llegan listos para abrir en el editor. |
| `entrada.html` | **Registro de entrada** el día del evento: escanea el pase QR de cada familia o búscala por nombre (`?demo=1` para practicar). |
| `panel.html` | Panel de confirmaciones para los novios (`?demo=1` para ver un ejemplo). |
| `manual.html` | **Manual del administrador**: todo explicado paso a paso (también se puede imprimir). |
| `i/` | Carpeta donde subes las invitaciones terminadas para publicarlas. |
| `mis-bodas.html` | **Tu panel de administrador**: todas tus bodas, días que faltan y avance de confirmaciones (`?demo=1` para ver un ejemplo). |
| `editor.html` | **El editor.** Formulario + vista previa en vivo + descarga. |
| `invitacion.html` | Muestra una invitación (`?plantilla=boho`, `?b=nombre-de-boda`). |
| `demos/` | Un archivo de demostración por diseño, listo para enviar a clientes. |
| `plantillas/` | 6 diseños de boda (Vino y Olivo, Floral Romántica, Rústica Campestre, Boho Terracota, Elegante Negro y Dorado, Jardín Botánico) 3 de XV años (Princesa Rosa, Mariposas Lila, Noche de Gala) y 5 para otros eventos: Paloma (bautizo, comunión), Cáliz (comunión, bautizo), Globos (baby shower, cumpleaños infantil, bautizo), Cielo Tierno (bautizo, baby shower) y Confeti (cumpleaños). Cada diseño dice para qué eventos sirve (`eventos`); los de boda y XV son solo para su evento. |
| `plantillas/adornos/` | Aquí van tus ilustraciones PNG propias (ver `LEEME.md`). |
| `motor/` | El código compartido (no necesitas abrirlo). |
| `bodas/ejemplo.js` | Datos de la boda ficticia de ejemplo. |
| `bodas/ejemplo-xv.js` | Datos de unos XV años ficticios de ejemplo. |
| `bodas/ejemplos-eventos.js` | Ejemplos de bautizo, primera comunión, baby shower y cumpleaños. |

## Tu página de ventas

Abre `negocio.js` y cambia tu **nombre**, tu **WhatsApp** (con código de país, por ejemplo `5215512345678`),
redes, **precios**, lo que incluye cada paquete, los extras, las preguntas frecuentes y las **opiniones de clientes** (`testimonios`; la sección solo aparece si agregas alguna). La página se actualiza sola.
Todos los botones abren WhatsApp con un mensaje ya escrito (paquete o diseño elegido).
El editor no aparece en la página pública: tú entras directo a `editor.html`.

## Formulario para tu cliente

Manda `pedido.html` (botón **📝 Formulario para cliente** en Mis bodas). El cliente elige diseño y llena todo en
10 pasos desde su celular (se guarda solo; ve una vista previa al final). Al enviarlo, el pedido aparece en
**Mis bodas → Pedidos de clientes** y con **✎ Abrir en el editor** se abre ya lleno. Las fotos quedan en tu Google
Drive (carpeta *Pedidos de invitaciones*). Requiere el código de Google versión 4 (vuelve a pegarlo y crea una
nueva versión; acepta el permiso de Drive). Sin Google Sheets, el cliente comparte el archivo por WhatsApp y tú
lo abres con **📂 Abrir**. Enlaces útiles: `pedido.html?evento=xv`, `pedido.html?plantilla=gala&paquete=Premium`.

## Cómo hacer una invitación para un cliente

1. Abre `editor.html` en el navegador (doble clic funciona).
2. Elige el diseño arriba y llena las secciones: nombres, fecha, lugares, fotos, regalos, WhatsApp…
3. **Guardar datos** → descarga un `.json` para poder editar esa boda después (**Abrir**).
4. **🌐 Publicar** → sube la invitación a `i/` del repositorio con la API de GitHub (llave fine-grained con *Contents: Read and write*, guardada solo en el navegador) y da su enlace. **⬇ Descargar archivo** (en la misma ventana) baja el `.html` con todo incluido. La dirección pública sale de `NEGOCIO.sitio` (cámbiala al tener dominio propio).
5. Súbelo a internet. Opciones gratis: [Netlify Drop](https://app.netlify.com/drop) (arrastras el archivo),
   GitHub Pages o Vercel. Con dominio propio queda como `tunegocio.com/valeria-y-santiago`.
6. **Enlaces de invitados** → pega la dirección publicada y la lista `Nombre | lugares`.
   Te da un enlace por invitado (con su nombre en el sobre) y un botón para mandarlo por WhatsApp.

## Otros eventos

En el editor, arriba de los diseños, elige el evento: Boda, XV años, Bautizo, Primera comunión, Baby shower o
Cumpleaños. Los textos, el formulario, los mensajes de WhatsApp, el PDF y el libro de recuerdos se adaptan solos
(un solo nombre, "Mi bautizo", "¿Me acompañarás?"…). Los tipos de evento están en `motor/invitacion.js` (`EVENTOS`):
para agregar uno nuevo basta con agregarlo ahí y poner su clave en `eventos` de los diseños que le sirvan.
Demos: `invitacion.html?plantilla=paloma&evento=bautizo`, `plantilla=caliz&evento=comunion`, `plantilla=globos&evento=babyshower`, `plantilla=confeti&evento=cumple`.

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

## Pase de entrada con QR (paquete)

En el editor, sección **Pase de entrada con QR**: cada familia ve en su enlace personalizado (y en su PDF) un pase
con su nombre, lugares, mesa y un QR que puede guardar como imagen. El día del evento, en `entrada.html`
(botón **🔗 Copiar acceso para la entrada** o **🚪 Entrada** en Mis bodas y en el panel) se escanea con la cámara del
celular: avisa si ya entró, si no está en la lista o si es de otro evento; también se busca por nombre. Funciona en
varios celulares a la vez y guarda los registros si se va la señal. Requiere Confirmaciones automáticas y el código
de Google versión 4.

## Libro de recuerdos (paquete)

Después del evento, en el editor (sección **Libro de recuerdos**) se descarga un PDF con el diseño de la invitación:
portada, su día en números, todos los buenos deseos con nombre y fecha, las canciones más pedidas, la lista de
quienes asistieron y las fotos. Lee los mensajes de Google Sheets (Confirmaciones automáticas). **Ver ejemplo**
arma uno con mensajes ficticios para enseñarlo a tus clientes.

## Aparta la fecha (paquete)

Aviso corto que se manda meses antes: en el editor, sección **Aparta la fecha**. Usa la misma plantilla pero solo
muestra portada, el aviso, la cuenta regresiva y el botón para agendar (`exportarHTML(datos, { aparta: true })`).
Descarga la página (`…-aparta-la-fecha.html`), una imagen vertical 1080×1920 para estados (`Invitacion.pdf.aparta`)
y copia el mensaje para WhatsApp. Vista previa: `invitacion.html?aparta=1&plantilla=paloma&evento=bautizo`.

## Video para estados (paquete)

`motor/video.js` → `Invitacion.video.generar(datos, { modo: 'aparta' | 'invitacion' })`. Dibuja en un canvas
(720×1280, 15 s) las capas de la página de "Aparta la fecha" (fondo, adornos y cada texto, capturados con html2canvas),
las anima con partículas según el efecto de la plantilla y una cuenta de días, y graba con MediaRecorder con la
música de la invitación (MP4 si el navegador puede, si no WebM). En el editor: sección **Video para estados**.

## Quién abrió la invitación y pago del anticipo (código de Google v6)

- **Vistas**: la invitación personalizada (`?invitado=`) avisa a la hoja (`accion: 'vista'`, una vez por visita; no en
  vistas previas ni en "Aparta la fecha"). Hoja *Vistas*: Boda, Invitado, Primera vez, Última vez, Veces. El panel de los
  novios muestra 👀 / ✉️ por invitado y el filtro "No la han abierto"; Mis bodas muestra "abrieron X/Y".
- **Pago**: `NEGOCIO.pago` (Mercado Pago y/o transferencia; `linkPago` opcional por paquete). Al enviar el formulario
  (o con `pedido.html?pagar=FOLIO&paquete=…`) el cliente ve el anticipo y sube su comprobante (`accion: 'comprobante'`,
  se guarda en Drive). En Mis bodas: estado del pago, "Ver comprobante", "Marcar pagado" (`accion: 'pago'`, clave de
  administrador) y "Enlace de pago".

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

## Accesibilidad y legibilidad

Revisado con las reglas de UI UX Pro Max: textos con contraste mínimo 4.5:1 (cada plantilla define
`--acento-texto`, una versión más oscura de su color de acento para letras pequeñas), letra de al menos 11–12 px,
foco visible al navegar con teclado, botones con área de toque cómoda y animaciones apagadas si el celular
tiene activado "reducir movimiento".

## Notas

- El editor guarda automáticamente en el navegador. Si subes muchas fotos puede no caber:
  usa siempre **Guardar datos** para no perder trabajo.
- Las fotos se reducen automáticamente para que la invitación cargue rápido.
- La cuenta regresiva usa la zona horaria elegida en el editor.
