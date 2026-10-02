/* Plantilla: Boho Terracota — arcos, sol, pampas y palmas secas en tonos tierra. */
(function () {
  const C = { terra: '#c2734f', terra2: '#a0563a', mostaza: '#d9a548', salvia: '#a4a77e', rubor: '#e7b59b', arena: '#f1e2d0', pampa: '#ead8b8', tallo: '#b89a72' };

  // Pluma de pampa: tallo curvo con plumas finas
  function pampa(x, y, l, rot) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q8 ${-l * .5} 0 ${-l}" stroke="${C.tallo}" stroke-width="1.6" fill="none"/>`;
    for (let i = 0; i < 46; i++) {
      const t = .35 + i / 46 * .65, yy = -l * t, xx = Math.sin(t * Math.PI) * 4;
      const len = 14 + Math.sin(t * Math.PI) * 16, lado = i % 2 ? 1 : -1, a = lado * (35 + (i % 5) * 6);
      s += `<path d="M${xx} ${yy}l${Math.sin(a * Math.PI / 180) * len} ${-Math.cos(a * Math.PI / 180) * len}" stroke="${C.pampa}" stroke-width="${2.6 - t}" stroke-linecap="round" opacity=".9"/>`;
    }
    return s + '</g>';
  }
  // Abanico de palma seca
  function palma(x, y, r, rot, c) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot})">`;
    for (let i = 0; i <= 12; i++) { const a = (-80 + i * 13.3) * Math.PI / 180; s += `<path d="M0 0L${Math.sin(a - .06) * r} ${-Math.cos(a - .06) * r}L${Math.sin(a + .06) * r} ${-Math.cos(a + .06) * r}Z" fill="${c}"/>`; }
    return s + `<path d="M0 0v${r * .9}" stroke="${C.tallo}" stroke-width="2"/></g>`;
  }
  const arcoiris = (cx, cy, r0, cols, w) => cols.map((c, i) => { const r = r0 - i * w; return `<path d="M${cx - r + w / 2} ${cy}A${r - w / 2} ${r - w / 2} 0 0 1 ${cx + r - w / 2} ${cy}" stroke="${c}" stroke-width="${w - 2}" fill="none"/>`; }).join('');
  const sol = (cx, cy, r) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.mostaza}"/>`;
    for (let i = 0; i < 16; i++) { const a = i * 22.5 * Math.PI / 180; s += `<path d="M${cx + Math.cos(a) * r * 1.25} ${cy + Math.sin(a) * r * 1.25}L${cx + Math.cos(a) * r * 1.6} ${cy + Math.sin(a) * r * 1.6}" stroke="${C.mostaza}" stroke-width="2.5" stroke-linecap="round"/>`; }
    return s;
  };

  const PAMPAS = `<svg viewBox="0 0 260 320">
    ${palma(70, 250, 120, -40, C.terra)}${palma(190, 260, 110, 35, C.rubor)}${palma(130, 260, 95, 0, C.mostaza)}
    ${pampa(120, 310, 270, -18)}${pampa(140, 310, 250, 10)}${pampa(100, 310, 200, -38)}${pampa(160, 310, 210, 32)}
    ${palma(130, 300, 70, 0, C.salvia)}
  </svg>`;
  const ARCOIRIS = `<svg viewBox="0 0 300 160">${arcoiris(150, 156, 146, [C.terra, C.rubor, C.mostaza, C.salvia, C.arena], 22)}</svg>`;
  const SOL = `<svg viewBox="0 0 120 120">${sol(60, 60, 26)}</svg>`;
  const FORRO = `<svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMin slice" width="100%" height="100%"><rect width="200" height="120" fill="#f1e2d0"/>${arcoiris(100, 120, 110, [C.terra, C.rubor, C.mostaza, C.salvia], 16)}</svg>`;

  window.Invitacion.registrar({
    id: 'boho',
    eventos: ['boda', 'babyshower', 'cumple', 'bautizo'],
    nombre: 'Boho Terracota',
    descripcion: 'Arcos, sol y pampas en terracota, mostaza y salvia. Cálida y moderna.',
    colores: ['#c2734f', '#d9a548', '#a4a77e', '#f1e2d0'],
    efecto: 'petalos',
    efectoColores: ['#e7b59b', '#d9a548', '#c2734f', '#ead8b8'],
    adornos: [
      { id: 'pampas', nombre: 'Pampas y palmas', ayuda: 'PNG transparente vertical (~800×1000 px)' },
      { id: 'arcoiris', nombre: 'Arco de colores', ayuda: 'PNG transparente horizontal (~900×480 px)' },
      { id: 'sol', nombre: 'Sol', ayuda: 'PNG transparente cuadrado (~400×400 px)' }
    ],
    pdf: { slot: 'pampas', svg: PAMPAS, modo: 'abajo' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Allura&family=Italiana&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Josefin+Sans:wght@300;400;600&display=swap',

    render(d, S) {
      const f = S.fechaInfo(d);
      const pam = (c) => S.adorno(d, 'pampas', PAMPAS, c);
      const arc = (c) => S.adorno(d, 'arcoiris', ARCOIRIS, c);
      const sol = (c) => S.adorno(d, 'sol', SOL, c);
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada">
    <span class="mancha m1"></span><span class="mancha m2"></span>
    ${pam('pam-izq')}${pam('pam-der')}
    <div class="portada-in rv">
      <div class="ventana ${foto ? 'con-foto' : ''}">
        ${foto ? `<img src="${S.esc(foto)}" alt="">` : `${sol('sol-ventana')}${arc('arc-ventana')}`}
      </div>
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d, 'h1', 'y')}
      <div class="fecha-boho"><span>${f.diaSemana}</span><b>${f.dia}.${f.mesNum}.${String(f.anio).slice(2)}</b><span>${d.hora} hrs</span></div>
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'arena', arriba: sol('sol-sec rv') })}
  ${S.familia(d, { antes: pam('pam-sec') })}
  ${S.cuenta(d, { antes: arc('arc-fondo') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'arena', decoLugar: () => arc('arc-lugar') })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'arena' })}
  ${S.regalos(d, { antes: pam('pam-sec der') })}
  ${S.rsvp(d, { clase: 'arena' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sol('sol-sec rv'), antes: arc('arc-fondo') })}
</main>`;
    },

    css: `
body.plantilla-boho{--acento-texto:#91563b;--fondo:#fbf4ec;--fondo2:#f3e4d3;--tinta:#4b3428;--suave:#7b5f4f;--acento:#c2734f;--acento2:#9a5338;--linea:#e6cdb4;--oscuro:#8a4a32;--sobre-oscuro:#fbeee2;--titulo:#8a4a32;--tarjeta:#fffaf4;--radio-btn:40px;
  --f-titulo:'Allura',cursive;--f-texto:'EB Garamond',Georgia,serif;--f-etiqueta:'Josefin Sans',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(circle at 50% 120%,#f0d2bd,#fbf4ec 70%);--sobre-c1:#c2734f;--sobre-c2:#cf8562;--sobre-c3:#d99574;--sello:radial-gradient(circle at 35% 30%,#e3bd6a,#c9973a 60%,#a97a26);--sello-borde:#b8862f}
.plantilla-boho .titulo{font-size:clamp(50px,12vw,76px)}
.plantilla-boho .eyebrow{font-weight:600}
.plantilla-boho .arena{background:var(--fondo2)}
.plantilla-boho .mancha{position:absolute;border-radius:58% 42% 51% 49%/45% 55% 45% 55%;z-index:0;opacity:.55}
.plantilla-boho .m1{width:420px;height:380px;background:#f1d6c2;top:-120px;right:-160px}
.plantilla-boho .m2{width:360px;height:340px;background:#e5e3cf;bottom:-120px;left:-150px}
.plantilla-boho .portada-in{position:relative;z-index:2;max-width:520px;width:100%}
.plantilla-boho .ventana{position:relative;width:min(300px,74%);aspect-ratio:3/3.7;margin:0 auto 30px;border-radius:200px 200px 0 0;overflow:hidden;background:linear-gradient(#f3dcc8,#f6e7d6);border:1px solid var(--linea);outline:1px solid var(--acento);outline-offset:8px}
.plantilla-boho .ventana.con-foto{outline-offset:8px}
.plantilla-boho .ventana img{width:100%;height:100%;object-fit:cover}
.plantilla-boho .sol-ventana{position:absolute;width:44%;left:28%;top:22%;animation:rotar 60s linear infinite}
@keyframes rotar{to{transform:rotate(360deg)}}
.plantilla-boho .arc-ventana{position:absolute;left:-2%;right:-2%;bottom:0}
.plantilla-boho .pam-izq,.plantilla-boho .pam-der{position:absolute;bottom:-20px;width:250px;z-index:1;transform-origin:50% 100%;animation:viento 7s ease-in-out infinite}
.plantilla-boho .pam-izq{left:-70px;rotate:-8deg}
.plantilla-boho .pam-der{right:-70px;scale:-1 1;rotate:8deg;animation-delay:-3s}
@keyframes viento{0%,100%{transform:rotate(0)}50%{transform:rotate(3deg)}}
.plantilla-boho .intro{font-family:'Italiana',serif;font-size:15px;letter-spacing:.5em;text-transform:uppercase;color:var(--acento-texto)}
.plantilla-boho .nombres{font-size:clamp(66px,17vw,110px);margin:12px 0}
.plantilla-boho .nombres .amp{font-family:'Italiana',serif;font-size:.3em;letter-spacing:.2em;margin:4px 0 10px}
.plantilla-boho .fecha-boho{display:flex;align-items:center;justify-content:center;gap:16px;font-family:var(--f-etiqueta);text-transform:uppercase;letter-spacing:.25em;font-size:11px;color:var(--suave)}
.plantilla-boho .fecha-boho b{font-family:'Italiana',serif;font-weight:400;font-size:34px;letter-spacing:.12em;color:var(--titulo);padding:0 16px;border-left:1px solid var(--acento);border-right:1px solid var(--acento)}
.plantilla-boho .ciudad{margin-top:22px;font-style:italic;color:var(--suave)}
.plantilla-boho .sol-sec{width:80px;margin:0 auto 18px}
.plantilla-boho .pam-sec{position:absolute;left:-60px;top:20px;width:170px;opacity:.6;transform:rotate(-15deg)}
.plantilla-boho .pam-sec.der{left:auto;right:-60px;transform:rotate(15deg) scaleX(-1)}
.plantilla-boho .arc-fondo{position:absolute;left:50%;bottom:-6px;width:min(640px,130%);transform:translateX(-50%);opacity:.18;z-index:0}
.plantilla-boho .oscura,.plantilla-boho .pie{background:linear-gradient(160deg,#9a5539,#7a3f2a)}
.plantilla-boho .oscura .eyebrow,.plantilla-boho .oscura small,.plantilla-boho .oscura b{color:#f3c98a}
.plantilla-boho .oscura .btn{border-color:#f3c98a;color:#f3c98a}
.plantilla-boho .oscura .btn:hover{background:#f3c98a;color:#7a3f2a}
.plantilla-boho .pie .amp,.plantilla-boho .pie .pie-fecha{color:#f3c98a}
.plantilla-boho .evento .icono{border-radius:30px 30px 4px 4px;background:var(--fondo2);border-color:var(--acento)}
.plantilla-boho .lugar{border-radius:180px 180px 4px 4px;overflow:hidden;padding-top:0}
.plantilla-boho .arc-lugar{width:70%;margin:30px auto 10px}
.plantilla-boho .foto{border-radius:200px 200px 4px 4px}
.plantilla-boho .foto:nth-child(3n+2){border-radius:4px 4px 200px 200px}
.plantilla-boho .regalo{border-radius:100px 100px 4px 4px;padding-top:40px}
.plantilla-boho .pase{border-radius:4px;border-style:solid}
@media (max-width:640px){
  .plantilla-boho .pam-izq,.plantilla-boho .pam-der{width:150px}
  .plantilla-boho .pam-izq{left:-50px}.plantilla-boho .pam-der{right:-50px}
  .plantilla-boho .pam-sec{width:110px}
  .plantilla-boho .fecha-boho{gap:10px;letter-spacing:.15em;font-size:10px}
  .plantilla-boho .fecha-boho b{font-size:26px;padding:0 10px}
}`
  });
})();
