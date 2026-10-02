/* Plantilla XV años: Noche de Gala — azul noche, plata, luna y estrellas que caen. */
(function () {
  // Cada dibujo con ids propios (si el primero queda oculto, los degradados de los demás siguen funcionando)
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };
  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const PLATA = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa6bb"/><stop offset=".45" stop-color="#f4f7fc"/><stop offset=".7" stop-color="#c3ccda"/><stop offset="1" stop-color="#8d99ae"/></linearGradient></defs>`;
  const est = (x, y, r, o) => `<path transform="translate(${x} ${y})" d="M0 ${-r}L${r * .2} ${-r * .2}L${r} 0L${r * .2} ${r * .2}L0 ${r}L${-r * .2} ${r * .2}L${-r} 0L${-r * .2} ${-r * .2}Z" fill="#eef2f8" opacity="${o || 1}"/>`;

  const LUNA = `<svg viewBox="0 0 300 170">${PLATA('ga-plata')}
    <path d="M150 20a62 62 0 1 0 54 92a50 50 0 1 1 -54 -92z" fill="url(#ga-plata)" opacity=".95"/>
    <g stroke="#c3ccda" stroke-width=".8" opacity=".55" fill="none"><path d="M40 60L78 30L112 52M196 40L236 24L262 62L284 50"/></g>
    ${est(40, 60, 6)}${est(78, 30, 8)}${est(112, 52, 5, .8)}${est(196, 40, 5, .8)}${est(236, 24, 9)}${est(262, 62, 6)}${est(284, 50, 4, .7)}
    ${est(20, 120, 4, .6)}${est(270, 130, 5, .7)}${est(222, 96, 3, .6)}${est(60, 150, 3, .5)}
    <g fill="#eef2f8"><circle cx="96" cy="90" r="1.4"/><circle cx="250" cy="100" r="1.2"/><circle cx="130" cy="150" r="1.3"/><circle cx="20" cy="30" r="1.2"/><circle cx="292" cy="150" r="1.4"/></g>
  </svg>`;

  const ESQUINA = `<svg viewBox="0 0 200 200">${PLATA('ga-plata2')}
    <g fill="none" stroke="url(#ga-plata2)" stroke-width="1.6"><path d="M6 194V6H194"/><path d="M18 182V18H182" stroke-width=".9"/>
      <path d="M18 70C40 70 70 40 70 18" /><path d="M18 46C30 46 46 30 46 18"/><circle cx="18" cy="18" r="8"/></g>
    ${est(18, 18, 6)}${est(86, 30, 7, .9)}${est(30, 86, 7, .9)}${est(120, 22, 4, .7)}${est(22, 120, 4, .7)}${est(60, 60, 3, .6)}
  </svg>`;

  const SEPARADOR = `<svg viewBox="0 0 260 40">${PLATA('ga-plata3')}<path d="M10 20H104M156 20H250" stroke="url(#ga-plata3)" stroke-width="1"/>
    <path d="M130 6L134 16L144 20L134 24L130 34L126 24L116 20L126 16Z" fill="url(#ga-plata3)"/>${est(112, 20, 3, .8)}${est(148, 20, 3, .8)}<circle cx="104" cy="20" r="2" fill="#c3ccda"/><circle cx="156" cy="20" r="2" fill="#c3ccda"/></svg>`;

  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="ga-forro" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 4L7.8 6.2L10 7L7.8 7.8L7 10L6.2 7.8L4 7L6.2 6.2Z" fill="#c3ccda" opacity=".8"/><circle cx="0" cy="0" r=".8" fill="#eef2f8"/></pattern></defs>
    <rect width="100" height="60" fill="#16264a"/><rect width="100" height="60" fill="url(#ga-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'gala',
    eventos: ['xv', 'cumple'],
    nombre: 'Noche de Gala',
    descripcion: 'XV años: azul noche y plata, luna y estrellas que caen.',
    colores: ['#0e1a35', '#1f3463', '#c3ccda', '#eef2f8'],
    efecto: 'estrellas',
    efectoColores: ['#eef2f8', '#c3ccda', '#a9c1ff', '#ffffff'],
    adornos: [
      { id: 'luna', nombre: 'Luna y estrellas', ayuda: 'PNG transparente horizontal (~900×500 px)' },
      { id: 'esquina', nombre: 'Esquina', ayuda: 'PNG transparente cuadrado, esquina superior izquierda (~500×500 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~700×100 px)' }
    ],
    pdf: { slot: 'esquina', svg: ESQUINA, modo: 'cuatro' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Great+Vibes&display=swap',

    render(d, S) {
      const f = S.fechaInfo(d);
      const esq = (c) => S.adorno(d, 'esquina', uniq(ESQUINA), 'esq ' + c);
      const marco = esq('tl') + esq('tr') + esq('bl') + esq('br');
      const sep = S.adorno(d, 'separador', uniq(SEPARADOR), 'separador rv');
      const luna = (c) => S.adorno(d, 'luna', uniq(LUNA), c);
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: uniq(FORRO) })}
<main>
  <section class="portada ${foto ? 'con-foto' : ''}">
    <div class="cielo" aria-hidden="true"></div>
    ${foto ? `<div class="foto-fondo"><img src="${S.esc(foto)}" alt=""></div>` : ''}
    <div class="marco rv">
      ${marco}
      ${luna('luna')}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      ${sep}
      <div class="fecha-deco"><span>${f.diaSemana}</span><b>${f.dia}</b><span>${f.mes}</span><b class="anio">${f.anio}</b></div>
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', arriba: sep })}
  ${S.familia(d, { arriba: luna('luna-chica rv') })}
  ${S.cuenta(d, { antes: '<div class="cielo" aria-hidden="true"></div>' + marco })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt' })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: '<div class="cielo" aria-hidden="true"></div>' + luna('luna-pie') })}
</main>`;
    },

    css: `
body.plantilla-gala{--fondo:#0e1a35;--fondo2:#12224a;--tinta:#e7ecf5;--suave:#a3afc6;--acento:#c3ccda;--acento2:#dfe5ee;--linea:rgba(195,204,218,.3);--oscuro:#09122a;--sobre-oscuro:#e7ecf5;--titulo:#f1f4f9;--tarjeta:#13244b;--radio-btn:0;
  --f-titulo:'Great Vibes',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Cinzel',Georgia,serif;
  --fondo-sobre:radial-gradient(ellipse at 50% 30%,#1f3463 0%,#09122a 100%);--sobre-c1:#1a2c58;--sobre-c2:#20366a;--sobre-c3:#253d75;--sello:radial-gradient(circle at 35% 30%,#f4f7fc,#c3ccda 55%,#8d99ae);--sello-texto:#1b2a4d;--sello-borde:#9aa6bb}
.plantilla-gala .sello{font-family:'Cinzel',serif;text-shadow:0 1px 0 rgba(255,255,255,.6)}
.plantilla-gala .sobre-atras,.plantilla-gala .sobre-frente{outline:1px solid rgba(195,204,218,.35)}
.plantilla-gala .sobre-carta{background:#13244b;color:var(--acento)}
.plantilla-gala .eyebrow{font-size:12px;letter-spacing:.35em}
.plantilla-gala .titulo,.plantilla-gala .nombres,.plantilla-gala .sobre-para strong,.plantilla-gala .pase strong,.plantilla-gala .lugar h3,.plantilla-gala .fecha-deco b{
  background:linear-gradient(100deg,#8d99ae 0%,#f4f7fc 22%,#c3ccda 40%,#ffffff 50%,#c3ccda 60%,#f4f7fc 78%,#8d99ae 100%);background-size:250% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent;animation:foilG 6s ease-in-out infinite}
@keyframes foilG{0%,100%{background-position:0% 0}50%{background-position:100% 0}}
.plantilla-gala .alt{background:var(--fondo2)}
.plantilla-gala .sec{border-top:1px solid rgba(195,204,218,.1)}
.plantilla-gala .cielo{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.8;
  background-image:radial-gradient(1.2px 1.2px at 12% 18%,#fff,transparent),radial-gradient(1px 1px at 28% 72%,#fff,transparent),radial-gradient(1.4px 1.4px at 46% 30%,#dfe8ff,transparent),radial-gradient(1px 1px at 63% 84%,#fff,transparent),radial-gradient(1.6px 1.6px at 78% 22%,#fff,transparent),radial-gradient(1px 1px at 90% 60%,#cfdcff,transparent),radial-gradient(1.2px 1.2px at 6% 52%,#fff,transparent),radial-gradient(1px 1px at 36% 8%,#fff,transparent),radial-gradient(1.3px 1.3px at 55% 55%,#fff,transparent),radial-gradient(1px 1px at 84% 92%,#fff,transparent);
  background-size:300px 300px;animation:titilar 5s ease-in-out infinite alternate}
@keyframes titilar{from{opacity:.45}to{opacity:.95}}
.plantilla-gala .portada{background:radial-gradient(ellipse at 50% 20%,#24407a 0%,#0e1a35 65%)}
.plantilla-gala .foto-fondo{position:absolute;inset:0;z-index:0}.plantilla-gala .foto-fondo img{width:100%;height:100%;object-fit:cover}
.plantilla-gala .foto-fondo::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(9,18,42,.62),rgba(9,18,42,.88))}
.plantilla-gala .portada .marco{z-index:1}
.plantilla-gala .marco{position:relative;width:min(520px,100%);padding:150px 40px 80px;border:1px solid var(--linea);background:rgba(14,26,53,.35)}
.plantilla-gala .esq{position:absolute;width:86px;z-index:1}
.plantilla-gala .esq.tl{top:-1px;left:-1px}
.plantilla-gala .esq.tr{top:-1px;right:-1px;transform:scaleX(-1)}
.plantilla-gala .esq.bl{bottom:-1px;left:-1px;transform:scaleY(-1)}
.plantilla-gala .esq.br{bottom:-1px;right:-1px;transform:scale(-1)}
.plantilla-gala .sec-cuenta .esq{width:70px;opacity:.7}
.plantilla-gala .sec-cuenta .esq.tl{top:16px;left:16px}.plantilla-gala .sec-cuenta .esq.tr{top:16px;right:16px}
.plantilla-gala .sec-cuenta .esq.bl{bottom:16px;left:16px}.plantilla-gala .sec-cuenta .esq.br{bottom:16px;right:16px}
.plantilla-gala .luna{position:absolute;top:18px;left:50%;width:250px;transform:translateX(-50%)}
.plantilla-gala .luna-chica{width:170px;margin:0 auto 14px}
.plantilla-gala .luna-pie{width:180px;margin:0 auto 18px;position:relative;z-index:1}
.plantilla-gala .pie{position:relative;overflow:hidden;border-top:1px solid var(--linea)}
.plantilla-gala .pie>*{position:relative;z-index:1}
.plantilla-gala .pie>.cielo{position:absolute;z-index:0}
.plantilla-gala .intro{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.5em;text-transform:uppercase;color:var(--acento);margin-top:10px}
.plantilla-gala .nombres{font-size:clamp(70px,19vw,116px);padding:0 .12em}
.plantilla-gala .separador{width:230px;margin:6px auto 22px}
.plantilla-gala .fecha-deco{display:grid;grid-template-columns:1fr auto 1fr;grid-template-rows:auto auto;align-items:center;gap:4px 18px;max-width:300px;margin:0 auto}
.plantilla-gala .fecha-deco span{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--tinta);border-top:1px solid var(--linea);border-bottom:1px solid var(--linea);padding:8px 0}
.plantilla-gala .fecha-deco b{font-family:var(--f-etiqueta);font-weight:400;font-size:60px;line-height:1;grid-row:1;grid-column:2}
.plantilla-gala .fecha-deco span:first-child{grid-column:1;grid-row:1}
.plantilla-gala .fecha-deco span:nth-of-type(2){grid-column:3;grid-row:1}
.plantilla-gala .fecha-deco .anio{grid-row:2;grid-column:1/4;font-size:22px;letter-spacing:.6em;padding-left:.6em;margin-top:8px}
.plantilla-gala .ciudad{margin-top:26px;font-style:italic;color:var(--suave);font-size:20px}
.plantilla-gala .lugar{border-color:var(--linea)}
.plantilla-gala .lugar::before{content:"";position:absolute;inset:8px;border:1px solid rgba(195,204,218,.15);pointer-events:none}
.plantilla-gala .lugar .btn{position:relative;z-index:1}
.plantilla-gala .lugar h3{font-size:44px}
.plantilla-gala .evento .icono{border-radius:50%;box-shadow:0 0 14px rgba(169,193,255,.25)}
.plantilla-gala .foto{border:1px solid var(--linea);padding:8px;background:transparent}
.plantilla-gala .reloj span{font-family:var(--f-etiqueta);font-weight:400;color:var(--titulo)}
.plantilla-gala .btn.solido{background:linear-gradient(100deg,#9aa6bb,#f4f7fc,#c3ccda);border:none;color:#0e1a35;font-weight:600}
.plantilla-gala .paleta span{border-color:var(--fondo)}
.plantilla-gala #form-rsvp .opciones input:checked+label{color:#0e1a35}
@media (max-width:640px){
  .plantilla-gala .marco{padding:130px 20px 70px}
  .plantilla-gala .esq{width:62px}
  .plantilla-gala .luna{width:200px}
  .plantilla-gala .fecha-deco b{font-size:48px}
}`
  });
})();
