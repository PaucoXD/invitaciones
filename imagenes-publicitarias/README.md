# Imágenes publicitarias · Tu Fecha

Piezas estáticas para Instagram, Facebook, TikTok y estados de WhatsApp. Usan la misma marca que el video
"El papel ya fue" (rama `videos-promocionales`): crema `#faf6f1`, oscuro `#262423`, terracota `#8a5d53`,
rosa `#c4968a`, Cormorant Garamond + Inter.

| Concepto | Idea | Archivos en `png/` |
|---|---|---|
| 1 · El papel ya fue | Dos celulares con el sobre y la portada de la demo Vino, y sus funciones | `tufecha-1-el-papel-ya-fue-*.png` |
| 2 · 14 diseños | Mosaico de portadas reales: boda, XV años, bautizo, primera comunión, baby shower y cumpleaños | `tufecha-2-catorce-disenos-*.png` |
| 3 · ¿Quién va a ir? | Panel de los novios (paquete Premium) con confirmaciones, recordatorios, mesas y pase QR | `tufecha-3-quien-va-a-ir-*.png` |

Formatos: `1x1` (1080×1080, post cuadrado), `4x5` (1080×1350, post vertical del feed) y `9x16` (1080×1920, historias y estados).

Todas cierran con el WhatsApp +52 81 2341 2206 y `paucoxd.github.io/invitaciones`, tomados de `negocio.js`.
No llevan precios ni la promoción, para que sigan sirviendo si cambian.

## Volver a generarlas

Las capturas de `fuente/capturas/` salen de `demos/*.html` y de `panel.html?demo=1` (datos ficticios).
Para cambiar un texto, edita `fuente/pieza.html` y vuelve a renderizar:

```bash
# desde la raíz del repo
python3 -m http.server 8765 &
cd imagenes-publicitarias && node fuente/render.js          # las 9
node fuente/render.js panel                                  # solo un concepto (papel | disenos | panel)
```

Necesita Node con Playwright (`npm i playwright`). Vista previa en el navegador:
`http://127.0.0.1:8765/imagenes-publicitarias/fuente/pieza.html?c=papel&f=4x5`
