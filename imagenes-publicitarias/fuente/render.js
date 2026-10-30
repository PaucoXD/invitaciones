// Genera las 9 imágenes: node fuente/render.js  (desde imagenes-publicitarias/, con el repo servido en http://127.0.0.1:8765)
const { chromium } = require('playwright');
const path = require('path');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/imagenes-publicitarias/fuente/pieza.html';
const conceptos = { papel: '1-el-papel-ya-fue', disenos: '2-catorce-disenos', panel: '3-quien-va-a-ir' };
const formatos = { '1x1': [1080, 1080], '4x5': [1080, 1350], '9x16': [1080, 1920] };
const solo = process.argv[2];
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } : undefined;
  const b = await chromium.launch({ proxy });
  for (const [c, nombre] of Object.entries(conceptos)) for (const [f, [w, h]] of Object.entries(formatos)) {
    if (solo && solo !== c) continue;
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`${BASE}?c=${c}&f=${f}`, { waitUntil: 'load', timeout: 120000 });
    await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    const out = path.join(__dirname, '..', 'png', `tufecha-${nombre}-${f}.png`);
    await p.screenshot({ path: out });
    console.log(out);
    await p.close();
  }
  await b.close();
})();
