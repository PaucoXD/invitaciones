/* Plantilla XV años: Mariposas Lila — lavanda, glicinas colgantes y mariposas que vuelan. */
(function () {
  // Cada dibujo con ids propios (si el primero queda oculto, los degradados de los demás siguen funcionando)
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };
  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  function mariposa(x, y, s, rot, c1, c2, id) {
    const ala = `<path d="M0 -2C-8 -26 -34 -38 -44 -28C-54 -18 -40 4 -2 4Z" fill="url(#${id})" stroke="#7c5ea8" stroke-opacity=".5" stroke-width="1"/>
      <path d="M-2 4C-26 6 -38 22 -30 32C-22 42 -6 28 -1 10Z" fill="url(#${id})" stroke="#7c5ea8" stroke-opacity=".5" stroke-width="1" opacity=".9"/>
      <circle cx="-30" cy="-20" r="4" fill="#fff" opacity=".6"/><circle cx="-20" cy="-10" r="2.5" fill="#d9b86a"/><circle cx="-20" cy="22" r="3" fill="#fff" opacity=".5"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <g class="ala-i">${ala}</g><g class="ala-d" transform="scale(-1 1)">${ala}</g>
      <ellipse rx="2.6" ry="16" cy="6" fill="#5e4682"/><path d="M-1 -9C-4 -18 -8 -22 -11 -23M1 -9C4 -18 8 -22 11 -23" stroke="#5e4682" stroke-width="1.2" fill="none"/>
    </g>`;
  }
  const MARIPOSAS = `<svg viewBox="0 0 220 160">
    ${mariposa(70, 70, 1, -14, '#e7d8f6', '#b49ad9', 'mp1')}${mariposa(160, 46, .62, 18, '#f7d9e8', '#d9a5c6', 'mp2')}${mariposa(170, 122, .45, -8, '#e9e1f8', '#a58bc9', 'mp3')}
    <g fill="#d9b86a"><circle cx="120" cy="100" r="2"/><circle cx="132" cy="88" r="1.4"/><circle cx="196" cy="84" r="1.6"/><circle cx="26" cy="130" r="1.6"/></g>
  </svg>`;
  const UNA = `<svg viewBox="-50 -42 100 84">${mariposa(0, 0, 1, 0, '#e7d8f6', '#b49ad9', 'mp4')}</svg>`;

  // Glicinas (racimos colgantes)
  function racimo(x, y, largo, tono) {
    const tonos = { a: ['#c9b3ea', '#b39ad9', '#d9c8f2', '#e8dcf8'], b: ['#e4bcd8', '#d3a2c6', '#efd3e6', '#f6e3ef'] }[tono];
    let s = `<path d="M${x} ${y - 10}V${y + largo * .2}" stroke="#8aa07a" stroke-width="1.2"/>`;
    const n = Math.round(largo / 7);
    for (let i = 0; i < n; i++) {
      const t = i / n, ancho = 14 * (1 - t) + 2, yy = y + i * 7;
      for (let j = -1; j <= 1; j += 2) s += `<circle cx="${x + j * ancho * (0.4 + (i % 2) * .25)}" cy="${yy}" r="${5.4 - t * 3.4}" fill="${tonos[(i + (j > 0 ? 1 : 0)) % 4]}"/>`;
      s += `<circle cx="${x}" cy="${yy + 3}" r="${4.8 - t * 3}" fill="${tonos[(i + 2) % 4]}"/>`;
    }
    return s;
  }
  const hoja = (x, y, l, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q${l * .5} ${-l * .32} ${l} 0Q${l * .5} ${l * .32} 0 0Z" fill="#9fb38f"/></g>`;
  const GLICINAS = `<svg viewBox="0 0 420 190">
    <path d="M0 14C80 30 150 4 210 16S340 30 420 10" stroke="#8aa07a" stroke-width="2.2" fill="none"/>
    ${hoja(40, 20, 34, 40)}${hoja(100, 22, 30, 140)}${hoja(170, 14, 32, 30)}${hoja(250, 20, 30, 150)}${hoja(320, 22, 34, 35)}${hoja(390, 14, 28, 150)}
    ${racimo(30, 28, 120, 'a')}${racimo(76, 30, 90, 'b')}${racimo(125, 22, 150, 'a')}${racimo(178, 22, 100, 'b')}${racimo(232, 24, 160, 'a')}${racimo(285, 28, 96, 'b')}${racimo(335, 26, 140, 'a')}${racimo(385, 18, 104, 'b')}
  </svg>`;
  const SEPARADOR = `<svg viewBox="0 0 260 44"><path d="M10 24H100M160 24H250" stroke="#b39ad9" stroke-width="1.2"/><g transform="translate(130 24) scale(.42)">${mariposa(0, 0, 1, 0, '#e7d8f6', '#b49ad9', 'mp5')}</g>
    <circle cx="100" cy="24" r="2.4" fill="#d9b86a"/><circle cx="160" cy="24" r="2.4" fill="#d9b86a"/></svg>`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="mp-forro" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.6" fill="#b39ad9" opacity=".6"/><circle cx="0" cy="0" r="1" fill="#d9b86a"/><circle cx="10" cy="10" r="1" fill="#d9b86a"/></pattern></defs>
    <rect width="100" height="60" fill="#efe6f8"/><rect width="100" height="60" fill="url(#mp-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'mariposas',
    evento: 'xv',
    nombre: 'Mariposas Lila',
    descripcion: 'XV años: lavanda, glicinas colgantes y mariposas que vuelan.',
    colores: ['#efe6f8', '#b39ad9', '#5e4682', '#d9b86a'],
    efecto: 'mariposas',
    efectoColores: ['#c9b3ea', '#e4bcd8', '#b39ad9', '#efd3e6'],
    adornos: [
      { id: 'glicinas', nombre: 'Flores colgantes', ayuda: 'PNG transparente horizontal, flores que cuelgan desde arriba (~1200×550 px)' },
      { id: 'mariposas', nombre: 'Grupo de mariposas', ayuda: 'PNG transparente (~700×500 px)' },
      { id: 'mariposa', nombre: 'Mariposa sola', ayuda: 'PNG transparente cuadrado (~300×260 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~700×120 px)' }
    ],
    pdf: { slot: 'mariposas', svg: MARIPOSAS, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Quicksand:wght@400;500;600&display=swap',

    render(d, S) {
      const glic = (c) => S.adorno(d, 'glicinas', uniq(GLICINAS), c);
      const grupo = (c) => S.adorno(d, 'mariposas', uniq(MARIPOSAS), c);
      const una = (c) => S.adorno(d, 'mariposa', uniq(UNA), 'vuela ' + c);
      const sep = S.adorno(d, 'separador', uniq(SEPARADOR), 'separador rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: uniq(FORRO) })}
<main>
  <section class="portada">
    ${glic('glic-arriba')}
    ${una('v1')}${una('v2')}${una('v3')}
    <div class="ventana rv ${foto ? 'con-foto' : ''}">
      ${foto ? `<div class="circulo"><img src="${S.esc(foto)}" alt=""></div>` : ''}
      ${grupo('grupo-portada')}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      <p class="quince">mis quince años</p>
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', arriba: sep })}
  ${S.familia(d, { arriba: sep, antes: una('v4') })}
  ${S.cuenta(d, { antes: glic('glic-fondo') })}
  ${S.itinerario(d, { antes: una('v5') })}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt', antes: grupo('grupo-esq') })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt', antes: una('v6') })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: glic('glic-pie') })}
</main>`;
    },

    css: `
body.plantilla-mariposas{--acento-texto:#7d6839;--fondo:#fbf8fd;--fondo2:#f3ecfa;--tinta:#3f3550;--suave:#70667e;--acento:#c9a75c;--acento2:#7a5ca5;--linea:#e3d8f0;--oscuro:#4a3a66;--sobre-oscuro:#f6f0fc;--titulo:#6b4f96;--tarjeta:#fffeff;
  --f-titulo:'Allura',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Quicksand',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at center,#fcf9ff 0%,#e4d7f3 100%);--sobre-c1:#d3c1ec;--sobre-c2:#e2d5f3;--sobre-c3:#ebe1f7;--sello:radial-gradient(circle at 35% 30%,#a58bc9,#7c5ea8 60%,#5e4682);--sello-borde:#6b4f96}
.plantilla-mariposas .eyebrow{font-weight:600}
.plantilla-mariposas .alt{background:var(--fondo2)}
.plantilla-mariposas .titulo{font-size:clamp(50px,12vw,76px)}
.plantilla-mariposas .portada{padding-top:150px}
.plantilla-mariposas .glic-arriba{position:absolute;top:-8px;left:50%;width:max(760px,110%);transform:translateX(-50%);z-index:1;transform-origin:50% 0;animation:mecerG 9s ease-in-out infinite}
@keyframes mecerG{0%,100%{rotate:0deg}50%{rotate:.6deg}}
.plantilla-mariposas .ventana{position:relative;width:min(480px,100%);padding:70px 30px 60px;border-radius:30px;background:#fffeff;border:1px solid var(--linea);box-shadow:0 20px 50px rgba(94,70,130,.10);z-index:2}
.plantilla-mariposas .ventana::before{content:"";position:absolute;inset:10px;border:1px solid rgba(201,167,92,.45);border-radius:22px;pointer-events:none}
.plantilla-mariposas .circulo{width:min(250px,72%);aspect-ratio:1;margin:0 auto 24px;border-radius:50%;overflow:hidden;border:6px solid #fff;box-shadow:0 0 0 1.5px var(--acento),0 14px 34px rgba(94,70,130,.18)}
.plantilla-mariposas .circulo img{width:100%;height:100%;object-fit:cover}
.plantilla-mariposas .grupo-portada{position:absolute;width:150px;top:-50px;right:-36px;z-index:3}
.plantilla-mariposas .ventana.con-foto .grupo-portada{top:auto;bottom:calc(100% - 300px);right:-30px}
.plantilla-mariposas .intro{font-family:var(--f-etiqueta);font-weight:600;font-size:11px;letter-spacing:.45em;text-transform:uppercase;color:var(--suave)}
.plantilla-mariposas .nombres{font-size:clamp(72px,20vw,118px);color:var(--titulo)}
.plantilla-mariposas .quince{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.5em;text-transform:uppercase;color:var(--acento);margin:-4px 0 20px}
.plantilla-mariposas .ciudad{margin-top:22px;font-style:italic;font-size:20px;color:var(--acento2)}
.plantilla-mariposas .separador{width:220px;margin:0 auto 24px}
.plantilla-mariposas .vuela{position:absolute;width:46px;z-index:3;animation:volar 14s ease-in-out infinite}
.plantilla-mariposas .vuela .fb svg,.plantilla-mariposas .vuela>img{animation:aletear .5s ease-in-out infinite alternate;transform-origin:50% 50%}
@keyframes aletear{from{transform:scaleX(1)}to{transform:scaleX(.55)}}
@keyframes volar{0%{translate:0 0;rotate:-8deg}25%{translate:30px -24px;rotate:6deg}50%{translate:6px -48px;rotate:-4deg}75%{translate:-24px -20px;rotate:8deg}100%{translate:0 0;rotate:-8deg}}
.plantilla-mariposas .vuela.v1{top:24%;left:8%}
.plantilla-mariposas .vuela.v2{top:62%;right:7%;width:36px;animation-delay:-5s}
.plantilla-mariposas .vuela.v3{bottom:12%;left:14%;width:30px;animation-delay:-9s}
.plantilla-mariposas .vuela.v4{top:40px;right:12%;width:38px}
.plantilla-mariposas .vuela.v5{top:60px;left:8%;width:34px;animation-delay:-4s}
.plantilla-mariposas .vuela.v6{bottom:60px;right:8%;width:40px;animation-delay:-7s}
.plantilla-mariposas .glic-fondo{position:absolute;top:0;left:50%;width:max(700px,100%);transform:translateX(-50%);opacity:.18}
.plantilla-mariposas .glic-pie{position:absolute;top:0;left:50%;width:max(700px,100%);transform:translateX(-50%);opacity:.13}
.plantilla-mariposas .pie .nombres{color:#f3eafc}
.plantilla-mariposas .sec-cuenta,.plantilla-mariposas .pie{padding-top:130px}
.plantilla-mariposas .grupo-esq{position:absolute;width:170px;top:20px;right:-10px;opacity:.8}
.plantilla-mariposas .lugar{border-radius:26px}
.plantilla-mariposas .lugar::before{content:"";position:absolute;inset:8px;border:1px solid var(--linea);border-radius:20px;pointer-events:none}
.plantilla-mariposas .lugar .btn{position:relative;z-index:1}
.plantilla-mariposas .foto{border-radius:50% 50% 18px 18px;border:6px solid #fff;box-shadow:0 10px 30px rgba(94,70,130,.14)}
.plantilla-mariposas .evento .icono{border-color:var(--linea);background:#fff;color:var(--acento2)}
.plantilla-mariposas .btn.solido{background:linear-gradient(100deg,#6b4f96,#7c5ea8);border:none}
.plantilla-mariposas .quince{color:var(--acento-texto)}
.plantilla-mariposas .pie{background:linear-gradient(180deg,#4a3a66,#33284a)}
@media (max-width:640px){
  .plantilla-mariposas .portada{padding-top:130px}
  .plantilla-mariposas .ventana{padding:60px 18px 50px}
  .plantilla-mariposas .grupo-portada{width:110px;right:-14px;top:-40px}
  .plantilla-mariposas .grupo-esq{width:120px}
}`
  });
})();
