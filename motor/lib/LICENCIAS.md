# Librerías incluidas

| Archivo | Proyecto | Licencia |
|---|---|---|
| `html2canvas.min.js` | html2canvas 1.4.1 — Niklas von Hertzen | MIT |
| `jspdf.umd.min.js` | jsPDF 2.5.2 — James Hall, yWorks GmbH | MIT |
| `jszip.min.js` | JSZip 3.10.1 — Stuart Knightley | MIT (o GPLv3) |
| `qrcode.js` | qrcode-generator 1.4.4 — Kazuhiko Arase | MIT |
| `qrcode-fuente.js` | qrcode-generator 1.4.4 (minificado) — Kazuhiko Arase | MIT |
| `jsQR.min.js` | jsQR 1.4.0 — Cosmo Wolfe (lee códigos QR con la cámara) | Apache-2.0 |

Las del PDF se cargan solo cuando se genera un PDF desde el editor. `qrcode-fuente.js` dibuja el pase de entrada (va incluido dentro de cada invitación que lo usa) y `jsQR.min.js` lo usa la página de registro de entrada (`entrada.html`).
