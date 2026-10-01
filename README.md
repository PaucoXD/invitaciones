# Estudio de Invitaciones Digitales

Sistema para hacer invitaciones de boda digitales **sin tocar código**: eliges un diseño,
llenas un formulario y descargas la invitación lista para publicar.

## Qué hay aquí

| Archivo / carpeta | Para qué sirve |
|---|---|
| `index.html` | Catálogo de diseños (sirve como vitrina para tus clientes). |
| `editor.html` | **El editor.** Formulario + vista previa en vivo + descarga. |
| `invitacion.html` | Muestra una invitación (`?plantilla=boho`, `?b=nombre-de-boda`). |
| `demos/` | Un archivo de demostración por diseño, listo para enviar a clientes. |
| `plantillas/` | Los 6 diseños: Vino y Olivo (collage), Floral Romántica, Rústica Campestre, Boho Terracota, Elegante Negro y Dorado, Jardín Botánico. |
| `plantillas/adornos/` | Aquí van tus ilustraciones PNG propias (ver `LEEME.md`). |
| `motor/` | El código compartido (no necesitas abrirlo). |
| `bodas/ejemplo.js` | Datos de la boda ficticia de ejemplo. |

## Cómo hacer una invitación para un cliente

1. Abre `editor.html` en el navegador (doble clic funciona).
2. Elige el diseño arriba y llena las secciones: nombres, fecha, lugares, fotos, regalos, WhatsApp…
3. **Guardar datos** → descarga un `.json` para poder editar esa boda después (**Abrir**).
4. **Descargar invitación** → un solo archivo `.html` con todo incluido (fotos, música, diseño).
5. Súbelo a internet. Opciones gratis: [Netlify Drop](https://app.netlify.com/drop) (arrastras el archivo),
   GitHub Pages o Vercel. Con dominio propio queda como `tunegocio.com/valeria-y-santiago`.
6. **Enlaces de invitados** → pega la dirección publicada y la lista `Nombre | lugares`.
   Te da un enlace por invitado (con su nombre en el sobre) y un botón para mandarlo por WhatsApp.

## Personalización por invitado

Cualquier invitación acepta al final del enlace:

```
?invitado=Familia%20López&pases=4
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
