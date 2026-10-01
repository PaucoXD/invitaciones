/* Plantilla: Floral Romántica — rosa palo, borgoña y dorado, con rosas y pétalos que caen. */
(function () {
  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  function rosa(x, y, r, base, oscuro, rot) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot || 0})">`;
    for (let i = 0; i < 5; i++) s += `<ellipse cy="${-r * 0.55}" rx="${r * 0.62}" ry="${r * 0.48}" fill="${base}" stroke="${oscuro}" stroke-opacity=".3" stroke-width="1" transform="rotate(${i * 72})"/>`;
    s += `<circle r="${r * 0.72}" fill="${base}"/><circle r="${r * 0.6}" fill="${oscuro}" opacity=".16"/>`;
    const a = (rr, x1, y1, x2, y2, w, o) => `<path d="M${x1 * r} ${y1 * r}A${rr * r} ${rr * r} 0 0 1 ${x2 * r} ${y2 * r}" fill="none" stroke="${oscuro}" stroke-width="${w * r}" stroke-linecap="round" opacity="${o}"/>`;
    s += a(.55, -.55, .15, .45, -.3, .05, .45) + a(.42, .4, .3, -.4, -.12, .05, .4) + a(.28, -.25, -.25, .25, .12, .05, .5) + a(.14, .12, .14, -.12, -.06, .045, .6);
    s += a(.6, -.62, -.05, -.1, -.6, .03, .25);
    return s + '</g>';
  }
  const hoja = (x, y, l, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q${l * .5} ${-l * .3} ${l} 0Q${l * .5} ${l * .3} 0 0Z" fill="${c}"/><path d="M${l * .08} 0L${l * .9} 0" stroke="#fff" stroke-opacity=".35" stroke-width="1"/></g>`;
  const ramita = (x, y, l, rot, c) => {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q${l * .5} ${-l * .08} ${l} 0" stroke="${c}" stroke-width="1.4" fill="none"/>`;
    for (let i = 1; i < 6; i++) { const p = i / 6 * l; s += `<circle cx="${p}" cy="${(i % 2 ? -1 : 1) * 7}" r="${6 - i * .5}" fill="${c}" opacity=".85"/>`; }
    return s + '</g>';
  };
  const boton = (x, y, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0L0 26" stroke="#7d8f6e" stroke-width="1.4"/><ellipse cy="-4" rx="7" ry="11" fill="${c}"/><path d="M-7 2Q0 -6 7 2L0 10Z" fill="#8a9c78"/></g>`;
  const nube = (pts) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/><circle cx="${x}" cy="${y}" r="1.1" fill="#e9d7a8"/>`).join('');
  const V = { blush: '#f3c9c6', rosa: '#dfa0a6', crema: '#f8e6d6', vino: '#b5646f', h1: '#9fae8f', h2: '#7d8f6e', h3: '#b9c4a7', euca: '#a9b9ac' };

  const RAMO_ESQUINA = `<svg viewBox="0 0 300 300">
    ${hoja(80, 80, 120, 8, V.h2)}${hoja(80, 80, 110, 80, V.h1)}${hoja(80, 80, 95, 35, V.h3)}${hoja(80, 80, 90, 55, V.h2)}
    ${ramita(90, 70, 150, -12, V.euca)}${ramita(70, 95, 140, 100, V.euca)}${hoja(70, 70, 80, -40, V.h1)}${hoja(70, 70, 80, 130, V.h3)}
    ${boton(205, 40, 70, V.rosa)}${boton(40, 205, 20, V.blush)}
    ${rosa(155, 62, 26, V.rosa, V.vino, 20)}${rosa(62, 150, 24, V.crema, '#c9a58c', -15)}${rosa(98, 95, 40, V.blush, V.vino, 0)}
    ${nube([[190, 95], [200, 88], [182, 104], [120, 150], [130, 160], [112, 165], [150, 128]])}
  </svg>`;

  const RAMO_ARCO = `<svg viewBox="0 0 420 170">
    ${hoja(210, 90, 150, 185, V.h2)}${hoja(210, 90, 150, -5, V.h2)}${hoja(210, 90, 120, 200, V.h1)}${hoja(210, 90, 120, -20, V.h1)}
    ${ramita(200, 95, 190, 178, V.euca)}${ramita(220, 95, 190, 2, V.euca)}${hoja(210, 90, 90, 160, V.h3)}${hoja(210, 90, 90, 20, V.h3)}
    ${boton(95, 70, -60, V.blush)}${boton(325, 70, 60, V.rosa)}
    ${rosa(150, 92, 26, V.crema, '#c9a58c', 10)}${rosa(272, 92, 26, V.rosa, V.vino, -20)}${rosa(210, 82, 42, V.blush, V.vino, 0)}
    ${nube([[120, 110], [110, 104], [300, 110], [312, 104], [180, 125], [240, 128]])}
  </svg>`;

  const SEPARADOR = `<svg viewBox="0 0 240 40"><path d="M10 20H95M145 20H230" stroke="#c9a063" stroke-width="1"/>
    ${hoja(120, 20, 26, 200, V.h1)}${hoja(120, 20, 26, -20, V.h1)}${rosa(120, 20, 11, V.blush, V.vino, 0)}</svg>`;

  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="fl-forro" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.2" fill="#dfa0a6" opacity=".55"/><circle cx="0" cy="0" r="1.2" fill="#c9a063" opacity=".6"/><circle cx="14" cy="14" r="1.2" fill="#c9a063" opacity=".6"/></pattern></defs>
    <rect width="100" height="60" fill="#f8e1dd"/><rect width="100" height="60" fill="url(#fl-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'floral',
    nombre: 'Floral Romántica',
    descripcion: 'Rosa palo, borgoña y dorado. Rosas en acuarela y pétalos que caen.',
    colores: ['#f3c9c6', '#b5646f', '#6e3f48', '#c9a063'],
    efecto: 'petalos',
    efectoColores: ['#f3c9c6', '#e8b4b8', '#f8e6d6', '#dfa0a6'],
    adornos: [
      { id: 'ramo-esquina', nombre: 'Ramo de esquina', ayuda: 'PNG transparente, flores que salen de la esquina superior izquierda (~800×800 px)' },
      { id: 'ramo-arco', nombre: 'Ramo sobre el arco', ayuda: 'PNG transparente horizontal (~1200×500 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~600×100 px)' }
    ],
    pdf: { slot: 'ramo-esquina', svg: RAMO_ESQUINA, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500&family=Pinyon+Script&display=swap',

    render(d, S) {
      const esq = (c) => S.adorno(d, 'ramo-esquina', RAMO_ESQUINA, c);
      const sep = S.adorno(d, 'separador', SEPARADOR, 'separador rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada">
    ${esq('esq tl')}${esq('esq br')}
    <div class="arco rv ${foto ? 'con-foto' : ''}">
      ${S.adorno(d, 'ramo-arco', RAMO_ARCO, 'arco-flores')}
      ${foto ? `<div class="arco-foto"><img src="${S.esc(foto)}" alt=""></div>` : ''}
      <div class="arco-texto">
        <p class="intro">${S.esc(d.introPortada)}</p>
        ${S.nombres(d)}
        ${S.fechaBloque(d)}
        ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
      </div>
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', antes: esq('esq tr chica'), arriba: sep })}
  ${S.familia(d, { arriba: sep })}
  ${S.cuenta(d, { antes: esq('esq tl chica tenue') + esq('esq br chica tenue') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt', antes: esq('esq tr chica') })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt', antes: esq('esq bl chica') })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: esq('esq tl tenue') + esq('esq br tenue') })}
</main>`;
    },

    css: `
body.plantilla-floral{--acento-texto:#81663f;--fondo:#fdf8f5;--fondo2:#f8ece7;--tinta:#4a3a3a;--suave:#7b6663;--acento:#c9a063;--acento2:#935a63;--linea:#ecd6cf;--oscuro:#6e3f48;--sobre-oscuro:#fbefe9;--titulo:#7a4652;--tarjeta:#fffdfb;
  --f-titulo:'Pinyon Script',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Montserrat',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at center,#fff8f5 0%,#f3dcd5 100%);--sobre-c1:#e9bfb9;--sobre-c2:#f2d3cd;--sobre-c3:#f6dfda;--sello:radial-gradient(circle at 35% 30%,#a85866,#7d3442 60%,#5e2230);--sello-borde:#7d3442}
.plantilla-floral::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.6;background:radial-gradient(circle at 10% 10%,rgba(243,201,198,.25),transparent 40%),radial-gradient(circle at 90% 80%,rgba(201,160,99,.12),transparent 40%)}
.plantilla-floral .titulo{font-size:clamp(50px,12vw,76px)}
.plantilla-floral .alt{background:var(--fondo2)}
.plantilla-floral .esq{position:absolute;width:300px;z-index:1}
.plantilla-floral .esq.tl{top:-20px;left:-20px}
.plantilla-floral .esq.tr{top:-20px;right:-20px;transform:scaleX(-1)}
.plantilla-floral .esq.br{bottom:-20px;right:-20px;transform:rotate(180deg)}
.plantilla-floral .esq.bl{bottom:-20px;left:-20px;transform:scaleY(-1)}
.plantilla-floral .esq.chica{width:190px}
.plantilla-floral .esq.tenue{opacity:.35}
.plantilla-floral .portada .esq{animation:mecer 8s ease-in-out infinite;transform-origin:0 0}
.plantilla-floral .portada .esq.br{transform-origin:100% 100%;animation-name:mecer2}
@keyframes mecer{0%,100%{rotate:0deg}50%{rotate:2deg}}
@keyframes mecer2{0%,100%{rotate:0deg}50%{rotate:-2deg}}
.plantilla-floral .arco{position:relative;width:min(470px,100%);padding:120px 34px 70px;border:1px solid var(--acento);border-radius:240px 240px 6px 6px;outline:1px solid rgba(201,160,99,.5);outline-offset:8px;background:rgba(255,253,251,.75);z-index:2}
.plantilla-floral .arco-flores{position:absolute;top:-58px;left:50%;width:min(420px,108%);transform:translateX(-50%)}
.plantilla-floral .arco.con-foto{padding-top:0;overflow:visible}
.plantilla-floral .arco-foto{margin:0 -34px 30px;border-radius:240px 240px 0 0;overflow:hidden;aspect-ratio:4/4.4}
.plantilla-floral .arco-foto img{width:100%;height:100%;object-fit:cover}
.plantilla-floral .arco.con-foto .arco-flores{top:-50px;z-index:3}
.plantilla-floral .intro{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.45em;text-transform:uppercase;color:var(--suave)}
.plantilla-floral .nombres{font-size:clamp(62px,17vw,104px)}
.plantilla-floral .nombres .amp{font-family:var(--f-texto);font-style:italic}
.plantilla-floral .ciudad{margin-top:24px;font-style:italic;font-size:20px;color:var(--acento2)}
.plantilla-floral .separador{width:220px;margin:0 auto 26px}
.plantilla-floral .sec-frase blockquote{font-size:clamp(23px,5.6vw,32px)}
.plantilla-floral .lugar{border-radius:160px 160px 4px 4px;padding-top:56px}
.plantilla-floral .lugar::before{content:"";position:absolute;inset:8px;border:1px solid var(--linea);border-radius:152px 152px 2px 2px;pointer-events:none}
.plantilla-floral .lugar .btn{position:relative;z-index:1}
.plantilla-floral .foto{border-radius:200px 200px 4px 4px;border:6px solid #fff;box-shadow:0 10px 30px rgba(110,63,72,.12)}
.plantilla-floral .foto:nth-child(3n+2){transform:translateY(24px)}
.plantilla-floral .reloj span{font-family:var(--f-texto)}
.plantilla-floral .pie{background:linear-gradient(180deg,#6e3f48,#4f2a33)}
@media (max-width:640px){
  .plantilla-floral .esq{width:200px}.plantilla-floral .esq.chica{width:130px}
  .plantilla-floral .arco{padding:100px 18px 56px}
  .plantilla-floral .arco-foto{margin:0 -18px 26px}
  .plantilla-floral .foto:nth-child(3n+2){transform:none}
}`
  });
})();
