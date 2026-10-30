# Videos promocionales · Tu Fecha

Videos verticales 9:16 (Reels, TikTok, Shorts) hechos con HyperFrames (HTML + GSAP → MP4).
Carpeta propia de este negocio: no mezclar con otros.

| Carpeta / archivo | Qué es |
|---|---|
| `guiones.md` | Los 3 guiones propuestos (A, B, C) y el costo de voz en ElevenLabs |
| `voz.txt` | Texto exacto enviado a ElevenLabs (con etiquetas de tono) |
| `video-a-papel-ya-fue/` | Proyecto HyperFrames del guion A |
| `mp4/` | Videos terminados |

## Volver a renderizar

```bash
cd videos-promocionales/video-a-papel-ya-fue
npx hyperframes render -q delivery -o ../mp4/tufecha-a-el-papel-ya-fue-9x16.mp4
```

GSAP va incluido en `vendor/` para no depender del CDN. Créditos de música y voz en `assets/CREDITOS.md`.
