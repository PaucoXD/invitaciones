/* Plantilla: Cielo Tierno — azul cielo pastel, nubes, luna y estrellas colgantes. Para bautizo, primera comunión, baby shower y cumpleaños infantil. */
(function () {
  // Cada dibujo con ids propios (si el primero queda oculto, los degradados de los demás siguen funcionando)
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };

  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const nube = (x, y, k, o) => `<g transform="translate(${x} ${y}) scale(${k})" opacity="${o || 1}">
    <ellipse cx="0" cy="34" rx="78" ry="10" fill="#c9dcec" opacity=".45"/>
    <g fill="#fff" stroke="#cfe0ee" stroke-width="2"><circle cx="-44" cy="12" r="22"/><circle cx="-14" cy="-6" r="32"/><circle cx="24" cy="-2" r="28"/><circle cx="52" cy="14" r="20"/><rect x="-62" y="10" width="130" height="24" rx="12"/></g>
    <g fill="#fff"><circle cx="-44" cy="12" r="20"/><circle cx="-14" cy="-6" r="30"/><circle cx="24" cy="-2" r="26"/><circle cx="52" cy="14" r="18"/><rect x="-60" y="12" width="126" height="20" rx="10"/></g>
  </g>`;
  const est = (x, y, r, c) => `<path transform="translate(${x} ${y})" d="M0 ${-r}L${r * .3} ${-r * .3}L${r} 0L${r * .3} ${r * .3}L0 ${r}L${-r * .3} ${r * .3}L${-r} 0L${-r * .3} ${-r * .3}Z" fill="${c || '#f2cf7c'}"/>`;
  const NUBES = `<svg viewBox="0 0 300 220">${nube(120, 80, 1)}${nube(220, 150, .7, .95)}${nube(60, 165, .55, .9)}${est(250, 50, 9)}${est(30, 70, 6, '#f3c3cf')}${est(190, 30, 5, '#a9cbe6')}${est(270, 105, 4)}</svg>`;

  const cuerda = (x, l, d) => `<path d="M${x} 0V${l}" stroke="#bccfdf" stroke-width="1.2"/>${d}`;
  const LUNA = `<svg viewBox="0 0 320 230"><defs><linearGradient id="nb-luna" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe7a8"/><stop offset="1" stop-color="#eec46a"/></linearGradient></defs>
    ${cuerda(160, 60, '<path d="M182 64a52 52 0 1 0 22 92a42 42 0 1 1 -22 -92z" fill="url(#nb-luna)"/><circle cx="168" cy="118" r="3" fill="#d9a94a" opacity=".5"/><circle cx="182" cy="140" r="2" fill="#d9a94a" opacity=".5"/>')}
    ${cuerda(70, 90, est(70, 104, 13))}${cuerda(110, 40, est(110, 52, 10, '#f3c3cf'))}${cuerda(235, 70, est(235, 84, 12, '#a9cbe6'))}${cuerda(275, 30, est(275, 42, 9))}${cuerda(40, 30, est(40, 42, 8, '#a9cbe6'))}
    <path d="M0 2C80 12 240 12 320 2" stroke="#bccfdf" stroke-width="1.6" fill="none"/></svg>`;
  const SEPARADOR = `<svg viewBox="0 0 260 40"><path d="M10 22H100M160 22H250" stroke="#a9cbe6" stroke-width="1.2" stroke-dasharray="2 5" stroke-linecap="round"/>${est(130, 20, 11)}${est(110, 24, 4, '#f3c3cf')}${est(150, 24, 4, '#a9cbe6')}</svg>`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="nb-forro" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 3L8 6L11 7L8 8L7 11L6 8L3 7L6 6Z" fill="#f2cf7c"/><circle cx="0" cy="0" r="1.4" fill="#fff"/><circle cx="14" cy="14" r="1.4" fill="#fff"/></pattern></defs>
    <rect width="100" height="60" fill="#d6e7f4"/><rect width="100" height="60" fill="url(#nb-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'nube',
    eventos: ['bautizo', 'babyshower'],
    nombre: 'Cielo Tierno',
    descripcion: 'Azul cielo pastel, nubes, luna y estrellas colgantes.',
    colores: ['#eaf4fb', '#a9cbe6', '#4f7fa8', '#f2cf7c'],
    efecto: 'estrellas',
    efectoColores: ['#f2cf7c', '#a9cbe6', '#f3c3cf', '#f6dd9a'],
    adornos: [
      { id: 'luna', nombre: 'Luna y estrellas colgantes', ayuda: 'PNG transparente horizontal (~1000×720 px)' },
      { id: 'nubes', nombre: 'Nubes', ayuda: 'PNG transparente (~900×660 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~700×110 px)' }
    ],
    pdf: { slot: 'nubes', svg: NUBES, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600&family=Nunito:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@500;600&display=swap',

    render(d, S) {
      const nubes = (c) => S.adorno(d, 'nubes', uniq(NUBES), c);
      const luna = (c) => S.adorno(d, 'luna', uniq(LUNA), c);
      const sep = S.adorno(d, 'separador', uniq(SEPARADOR), 'separador rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: uniq(FORRO) })}
<main>
  <section class="portada">
    ${luna('luna-arriba')}
    ${nubes('nubes-i')}${nubes('nubes-d')}
    <div class="globo rv ${foto ? 'con-foto' : ''}">
      ${foto ? `<div class="redonda"><img src="${S.esc(foto)}" alt=""></div>` : ''}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      ${sep}
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', arriba: sep })}
  ${S.familia(d, { arriba: sep, antes: nubes('nubes-fondo') })}
  ${S.cuenta(d, { antes: luna('luna-fondo') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt', antes: nubes('nubes-esq') })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: luna('luna-pie') })}
</main>`;
    },

    css: `
body.plantilla-nube{--fondo:#f6fbfe;--fondo2:#e9f3fa;--tinta:#33475b;--suave:#566a7e;--acento:#d9ac4f;--acento-texto:#7d6326;--acento2:#3f709a;--linea:#d3e4f1;--oscuro:#2f4f6f;--sobre-oscuro:#f6fbfe;--titulo:#3f709a;--tarjeta:#ffffff;
  --f-titulo:'Dancing Script',cursive;--f-texto:'Nunito',system-ui,sans-serif;--f-etiqueta:'Quicksand',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at 50% 30%,#ffffff 0%,#d9e9f6 100%);--sobre-c1:#bcd6ec;--sobre-c2:#cfe2f2;--sobre-c3:#dbeaf6;--sello:radial-gradient(circle at 35% 30%,#f9e3a6,#e5b85a 55%,#c49434);--sello-texto:#5b4515;--sello-borde:#cfa245}
body.plantilla-nube{font-size:18px}
.plantilla-nube::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 15% 10%,rgba(169,203,230,.25),transparent 40%),radial-gradient(circle at 85% 90%,rgba(243,195,207,.2),transparent 40%)}
.plantilla-nube .sello{font-family:'Quicksand',sans-serif;font-weight:600}
.plantilla-nube .eyebrow{font-weight:600}
.plantilla-nube .alt{background:var(--fondo2)}
.plantilla-nube .titulo{font-size:clamp(46px,11vw,66px)}
.plantilla-nube .portada{padding-top:170px;background:linear-gradient(180deg,#dcebf7 0%,var(--fondo) 55%)}
.plantilla-nube .luna-arriba{position:absolute;top:-4px;left:50%;width:min(420px,108vw);transform:translateX(-50%);z-index:1;transform-origin:50% 0;animation:mecerN 7s ease-in-out infinite}
@keyframes mecerN{0%,100%{rotate:-1deg}50%{rotate:1deg}}
.plantilla-nube .nubes-i,.plantilla-nube .nubes-d{position:absolute;width:260px;z-index:1;animation:flotaN 12s ease-in-out infinite}
.plantilla-nube .nubes-i{left:-70px;top:38%}
.plantilla-nube .nubes-d{right:-80px;bottom:6%;transform:scaleX(-1);animation-delay:-6s}
@keyframes flotaN{0%,100%{translate:0 0}50%{translate:14px -6px}}
.plantilla-nube .globo{position:relative;width:min(460px,100%);padding:56px 30px 50px;border-radius:200px 200px 40px 40px;background:rgba(255,255,255,.92);border:2px solid #fff;box-shadow:0 0 0 1px var(--linea),0 22px 50px rgba(63,112,154,.12);z-index:2}
.plantilla-nube .globo::before{content:"";position:absolute;inset:10px;border:1.5px dashed var(--linea);border-radius:190px 190px 32px 32px;pointer-events:none}
.plantilla-nube .redonda{width:min(220px,64%);aspect-ratio:1;margin:0 auto 22px;border-radius:50%;overflow:hidden;border:6px solid #fff;box-shadow:0 0 0 2px #a9cbe6,0 12px 26px rgba(63,112,154,.18)}
.plantilla-nube .redonda img{width:100%;height:100%;object-fit:cover}
.plantilla-nube .intro{font-family:var(--f-etiqueta);font-weight:600;font-size:13px;letter-spacing:.35em;text-transform:uppercase;color:var(--acento-texto)}
.plantilla-nube .nombres{font-size:clamp(66px,18vw,104px);font-weight:600;line-height:1.05;margin:6px 0 2px}
.plantilla-nube .separador{width:210px;margin:6px auto 18px}
.plantilla-nube .ciudad{margin-top:20px;font-style:italic;color:var(--acento2)}
.plantilla-nube .nubes-fondo{position:absolute;width:220px;right:-40px;top:20px;opacity:.7}
.plantilla-nube .luna-fondo{position:absolute;top:0;left:50%;width:min(420px,100vw);transform:translateX(-50%);opacity:.22}
.plantilla-nube .sec-cuenta{padding-top:130px}
.plantilla-nube .nubes-esq{position:absolute;width:200px;left:-50px;top:10px;opacity:.8}
.plantilla-nube .luna-pie{width:min(300px,80vw);margin:-40px auto 10px;opacity:.9}
.plantilla-nube .lugar{border-radius:28px}
.plantilla-nube .lugar::before{content:"";position:absolute;inset:8px;border:1.5px dashed var(--linea);border-radius:22px;pointer-events:none}
.plantilla-nube .lugar .btn{position:relative;z-index:1}
.plantilla-nube .foto{border-radius:24px;border:6px solid #fff;box-shadow:0 10px 26px rgba(63,112,154,.14)}
.plantilla-nube .evento .icono{border-color:var(--linea);background:#fff;color:var(--acento2)}
.plantilla-nube .btn{border-radius:30px}
.plantilla-nube .btn.solido{background:var(--acento2);border:none}
.plantilla-nube .pie{background:linear-gradient(180deg,#3a5a7c,#2a4561)}
.plantilla-nube .pie .nombres{color:#f6fbfe}
@media (max-width:640px){
  .plantilla-nube .portada{padding-top:150px}
  .plantilla-nube .globo{padding:48px 18px 42px}
  .plantilla-nube .nubes-i,.plantilla-nube .nubes-d{width:170px}
}`
  });
})();
