/* Plantilla: Globos — baby shower y cumpleaños infantil. Globo aerostático con osito, colores pastel, letras redondas y secciones con bordes ondulados. */
(function () {
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };

  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const GLOBO = `<svg viewBox="0 0 260 330">
    <defs><clipPath id="gl-c"><path d="M130 14C70 14 30 58 30 112c0 52 46 94 74 122h52c28-28 74-70 74-122C230 58 190 14 130 14z"/></clipPath></defs>
    <g clip-path="url(#gl-c)">
      <rect x="0" y="0" width="260" height="260" fill="#ffcfb8"/>
      <path d="M130 0C96 50 92 170 112 260H148C168 170 164 50 130 0z" fill="#fff3d6"/>
      <path d="M60 0C40 70 60 190 104 260H76C38 200 22 80 60 0z" fill="#bfe6d6"/>
      <path d="M200 0C220 70 200 190 156 260H184C222 200 238 80 200 0z" fill="#d9c8f2"/>
      <path d="M0 0C0 80 20 190 60 260H0z" fill="#ffe69a"/><path d="M260 0C260 80 240 190 200 260H260z" fill="#ffe69a"/>
      <path d="M20 128Q130 150 240 128" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>
    </g>
    <path d="M130 14C70 14 30 58 30 112c0 52 46 94 74 122h52c28-28 74-70 74-122C230 58 190 14 130 14z" fill="none" stroke="#e8a98f" stroke-width="3"/>
    <path d="M106 234L112 262M154 234L148 262" stroke="#b9a08a" stroke-width="2.5"/>
    <rect x="100" y="260" width="60" height="44" rx="8" fill="#e9b989" stroke="#c48d5e" stroke-width="2"/>
    <path d="M100 274H160" stroke="#c48d5e" stroke-width="2"/>
    <g transform="translate(130 252)">
      <circle cx="-14" cy="-6" r="7" fill="#c69468"/><circle cx="14" cy="-6" r="7" fill="#c69468"/><circle cx="-14" cy="-6" r="3.5" fill="#f1cfa8"/><circle cx="14" cy="-6" r="3.5" fill="#f1cfa8"/>
      <circle r="17" fill="#c69468"/><ellipse cy="6" rx="8" ry="6" fill="#f1cfa8"/><circle cx="-6" cy="-3" r="2.2" fill="#3b3557"/><circle cx="6" cy="-3" r="2.2" fill="#3b3557"/><ellipse cy="4" rx="2.6" ry="2" fill="#3b3557"/>
      <circle cx="-10" cy="4" r="3" fill="#f6a7b0" opacity=".7"/><circle cx="10" cy="4" r="3" fill="#f6a7b0" opacity=".7"/>
    </g>
  </svg>`;
  const globito = (x, y, c, k) => `<g transform="translate(${x} ${y}) scale(${k || 1})"><path d="M0 -26C-15 -26 -22 -14 -22 -4c0 14 14 24 22 28c8-4 22-14 22-28c0-10-7-22-22-22z" fill="${c}"/><path d="M-3 24L3 24L0 29z" fill="${c}"/><path d="M0 29q-6 18 4 34" stroke="#b9a08a" stroke-width="1.4" fill="none"/><ellipse cx="-8" cy="-12" rx="4" ry="7" fill="#fff" opacity=".45" transform="rotate(-20 -8 -12)"/></g>`;
  const GLOBITOS = `<svg viewBox="0 0 200 170">${globito(50, 50, '#ffcfb8')}${globito(100, 36, '#bfe6d6', 1.1)}${globito(150, 56, '#d9c8f2')}${globito(76, 92, '#ffe69a', .8)}${globito(128, 98, '#f6b8c4', .75)}</svg>`;
  const NUBE = `<svg viewBox="0 0 160 70"><path d="M24 62c-14 0-22-8-22-18 0-11 9-18 20-17 3-14 14-22 28-20 7-10 26-12 36-2 6-4 18-4 24 4 12-1 24 8 24 22 0 18-12 31-28 31z" fill="#fff"/></svg>`;
  const ONDA = (c) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'><path d='M0 16V8Q15 0 30 8T60 8T90 8T120 8V16Z' fill='${c}'/></svg>`)}")`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="gl-forro" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#ffcfb8"/><circle cx="9" cy="9" r="2" fill="#bfe6d6"/></pattern></defs>
    <rect width="100" height="60" fill="#fff6e9"/><rect width="100" height="60" fill="url(#gl-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'globos',
    eventos: ['babyshower', 'cumple', 'bautizo'],
    nombre: 'Globos',
    descripcion: 'Alegre y pastel: globo aerostático con osito, letras redondas y secciones de colores.',
    colores: ['#fff6e9', '#ffcfb8', '#bfe6d6', '#d9c8f2'],
    efecto: 'confeti',
    efectoColores: ['#ffcfb8', '#bfe6d6', '#d9c8f2', '#ffe69a', '#f6b8c4'],
    adornos: [
      { id: 'globo', nombre: 'Globo aerostático', ayuda: 'PNG transparente vertical (~600×760 px)' },
      { id: 'globitos', nombre: 'Globitos', ayuda: 'PNG transparente (~600×520 px)' },
      { id: 'nube', nombre: 'Nube', ayuda: 'PNG transparente horizontal (~480×210 px)' }
    ],
    pdf: { slot: 'globitos', svg: GLOBITOS, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap',

    render(d, S) {
      const globo = (c) => S.adorno(d, 'globo', uniq(GLOBO), c);
      const globitos = (c) => S.adorno(d, 'globitos', uniq(GLOBITOS), c);
      const nube = (c) => S.adorno(d, 'nube', NUBE, c);
      const f = S.fechaInfo(d), foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: uniq(FORRO) })}
<main>
  <section class="portada">
    ${nube('nb n1')}${nube('nb n2')}${nube('nb n3')}
    <div class="cielo-cont rv">
      ${foto ? `<div class="burbuja"><img src="${S.esc(foto)}" alt=""></div>` : globo('globo-portada')}
      <p class="intro"><span>${S.esc(d.introPortada)}</span></p>
      ${S.nombres(d)}
      <div class="fecha-pills"><span class="p1">${f.diaSemana}</span><span class="p2"><b>${f.dia}</b>${f.mes}</span><span class="p3">${f.anio}</span></div>
      ${d.ciudad ? `<p class="ciudad">📍 ${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'c-menta' })}
  ${S.familia(d, { clase: 'c-durazno', antes: globitos('globitos-esq') })}
  ${S.cuenta(d, { clase: 'c-lila' })}
  ${S.itinerario(d, { clase: 'c-crema' })}
  ${S.ubicacion(d, { clase: 'c-menta' })}
  ${S.vestimenta(d, { clase: 'c-crema' })}
  ${S.historia(d, { clase: 'c-durazno' })}
  ${S.regalos(d, { clase: 'c-lila' })}
  ${S.rsvp(d, { clase: 'c-crema', antes: globitos('globitos-esq d') })}
  ${S.extras(d, { mesa: { clase: 'c-menta' }, acceso: { clase: 'c-menta' }, hospedaje: { clase: 'c-durazno' }, deseos: { clase: 'c-lila' }, canciones: { clase: 'c-crema' }, contactos: { clase: 'c-menta' } })}
  ${S.cierre(d, { antes: globitos('globitos-pie') })}
</main>`;
    },

    css: `
body.plantilla-globos{--fondo:#fff6e9;--fondo2:#fff0dc;--tinta:#3b3557;--suave:#5f5878;--acento:#e8a98f;--acento-texto:#8f4a33;--acento2:#a8325a;--linea:#f0dccb;--oscuro:#4b3f8f;--sobre-oscuro:#fffaf3;--titulo:#4b3f8f;--tarjeta:#ffffff;--radio-btn:40px;
  --f-titulo:'Fredoka',system-ui,sans-serif;--f-texto:'Nunito',system-ui,sans-serif;--f-etiqueta:'Fredoka',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(circle at 50% 30%,#fffaf3 0%,#ffe2d2 100%);--sobre-c1:#ffcfb8;--sobre-c2:#ffdccb;--sobre-c3:#ffe6d8;--sello:radial-gradient(circle at 35% 30%,#d9c8f2,#a58bc9 60%,#7d63a8);--sello-texto:#fff;--sello-borde:#8d72b8;
  --menta:#d8f1e6;--durazno:#ffe3d6;--lila:#ece3fa;--crema:#fff6e9}
body.plantilla-globos{font-size:18px}
.plantilla-globos .sello{font-family:'Fredoka',sans-serif;font-weight:600}
.plantilla-globos .titulo{font-weight:700;font-size:clamp(38px,9.5vw,58px);letter-spacing:-.01em}
.plantilla-globos .eyebrow{display:inline-block;font-weight:600;letter-spacing:.12em;font-size:13px;color:#fff;background:var(--acento2);padding:6px 16px;border-radius:20px;margin-bottom:16px}
.plantilla-globos .lead{font-style:normal}
/* Secciones de colores: cada una dibuja su propia onda encima (no importa el orden ni las que se oculten) */
.plantilla-globos .sec,.plantilla-globos .pie{overflow-x:clip;overflow-y:visible}
.plantilla-globos .sec{padding:90px 22px 90px}
.plantilla-globos .sec::before,.plantilla-globos .pie::before{content:"";position:absolute;left:0;right:0;top:-25px;height:26px;z-index:1;background-size:100% 100%;pointer-events:none}
.plantilla-globos .c-menta{background:var(--menta)}.plantilla-globos .c-menta::before{background-image:${ONDA('#d8f1e6')}}
.plantilla-globos .c-durazno{background:var(--durazno)}.plantilla-globos .c-durazno::before{background-image:${ONDA('#ffe3d6')}}
.plantilla-globos .c-lila{background:var(--lila)}.plantilla-globos .c-lila::before{background-image:${ONDA('#ece3fa')}}
.plantilla-globos .c-crema{background:var(--crema)}.plantilla-globos .c-crema::before{background-image:${ONDA('#fff6e9')}}
.plantilla-globos .pie::before{background-image:${ONDA('#4b3f8f')}}
.plantilla-globos .oscura{color:var(--tinta)}.plantilla-globos .oscura .titulo{color:var(--titulo)}
/* Portada */
.plantilla-globos .portada{background:linear-gradient(180deg,#cfe9ff 0%,#e9f5ff 45%,var(--fondo) 100%)}
.plantilla-globos .nb{position:absolute;width:150px;opacity:.95;animation:nubeG 18s linear infinite;z-index:0}
.plantilla-globos .nb.n1{top:12%;left:-10%}.plantilla-globos .nb.n2{top:30%;right:-12%;width:120px;animation-duration:24s;animation-direction:reverse}.plantilla-globos .nb.n3{bottom:16%;left:4%;width:100px;animation-duration:30s}
@keyframes nubeG{0%{translate:0 0}50%{translate:40px 0}100%{translate:0 0}}
.plantilla-globos .cielo-cont{position:relative;z-index:2;width:min(460px,100%)}
.plantilla-globos .globo-portada{width:min(190px,48vw);margin:0 auto -6px;animation:flotaG 5s ease-in-out infinite}
@keyframes flotaG{0%,100%{translate:0 0;rotate:-2deg}50%{translate:0 -14px;rotate:2deg}}
.plantilla-globos .burbuja{width:min(230px,62vw);aspect-ratio:1;margin:0 auto 18px;border-radius:50%;overflow:hidden;border:8px solid #fff;box-shadow:0 0 0 4px #ffcfb8,8px 10px 0 4px #bfe6d6}
.plantilla-globos .burbuja img{width:100%;height:100%;object-fit:cover}
.plantilla-globos .intro span{display:inline-block;font-family:var(--f-etiqueta);font-weight:600;font-size:16px;letter-spacing:.06em;color:var(--titulo);background:#fff;padding:8px 20px;border-radius:30px;box-shadow:3px 4px 0 #d9c8f2}
.plantilla-globos .nombres{font-weight:700;font-size:clamp(68px,20vw,120px);line-height:.95;margin:16px 0 10px;color:var(--titulo);text-shadow:4px 5px 0 #ffcfb8}
.plantilla-globos .fecha-pills{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:18px;font-family:var(--f-etiqueta);font-weight:600}
.plantilla-globos .fecha-pills span{display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;color:var(--tinta);text-transform:uppercase;font-size:12px;letter-spacing:.08em}
.plantilla-globos .fecha-pills .p1{width:76px;height:76px;background:#bfe6d6}.plantilla-globos .fecha-pills .p3{width:76px;height:76px;background:#d9c8f2;font-size:15px}
.plantilla-globos .fecha-pills .p2{width:104px;height:104px;background:#ffcfb8;box-shadow:4px 5px 0 #e8a98f}
.plantilla-globos .fecha-pills .p2 b{font-size:44px;line-height:1;font-weight:700;color:var(--titulo)}
.plantilla-globos .ciudad{margin-top:18px;font-weight:600;color:var(--suave)}
/* Tarjetas tipo sticker */
.plantilla-globos .lugar,.plantilla-globos .regalo,.plantilla-globos .hotel,.plantilla-globos .pase,.plantilla-globos .acceso-tarjeta{background:#fff;border:3px solid var(--tinta);border-radius:26px;box-shadow:6px 7px 0 var(--tinta)}
.plantilla-globos .lugar h3{font-family:var(--f-titulo);font-weight:700;font-size:30px;color:var(--titulo)}
.plantilla-globos .lugar-icono{color:var(--acento2)}
.plantilla-globos .btn{font-family:var(--f-etiqueta);font-weight:600;font-size:14px;letter-spacing:.06em;border-width:2px}
.plantilla-globos .btn.solido{background:var(--acento2);border-color:var(--tinta);color:#fff;box-shadow:4px 5px 0 var(--tinta)}
.plantilla-globos .btn.solido:hover{transform:translate(2px,2px);box-shadow:2px 3px 0 var(--tinta)}
/* Itinerario en tarjetas */
.plantilla-globos .linea{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;max-width:640px}
.plantilla-globos .linea::before{display:none}
.plantilla-globos .evento,.plantilla-globos .evento:nth-child(even){display:flex;flex-direction:column;align-items:center;gap:6px;margin:0;background:#fff;border-radius:22px;padding:18px 10px;border:2px solid var(--linea)}
.plantilla-globos .evento .hora,.plantilla-globos .evento:nth-child(even) .hora{order:0;text-align:center;font-family:var(--f-titulo);font-weight:700;font-size:26px}
.plantilla-globos .evento .icono,.plantilla-globos .evento:nth-child(even) .icono{order:-1;background:#ffcfb8;border:none;color:var(--titulo)}
.plantilla-globos .evento:nth-child(3n+2) .icono{background:#bfe6d6}.plantilla-globos .evento:nth-child(3n) .icono{background:#d9c8f2}
.plantilla-globos .evento .que,.plantilla-globos .evento:nth-child(even) .que{order:1;text-align:center;font-weight:700;font-size:17px}
/* Cuenta regresiva en burbujas */
.plantilla-globos .reloj{gap:10px}
.plantilla-globos .reloj>div{width:clamp(66px,19vw,96px);aspect-ratio:1;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:4px 5px 0 #a58bc9}
.plantilla-globos .reloj span{font-family:var(--f-titulo);font-weight:700;font-size:clamp(28px,8vw,40px);color:var(--titulo)}
.plantilla-globos .reloj small{margin-top:2px;font-size:10px;letter-spacing:.08em;color:var(--suave)}
.plantilla-globos .reloj b{display:none}
.plantilla-globos .oscura .btn{border-color:var(--tinta);color:var(--tinta);background:#fff}
.plantilla-globos .oscura .eyebrow{color:#fff}
/* Fotos tipo polaroid */
.plantilla-globos .foto{background:#fff;padding:10px 10px 36px;border-radius:6px;box-shadow:0 8px 20px rgba(59,53,87,.15)}
.plantilla-globos .foto:nth-child(odd){rotate:-3deg}.plantilla-globos .foto:nth-child(even){rotate:3deg}
.plantilla-globos .foto figcaption{background:none;color:var(--tinta);font-family:var(--f-titulo);bottom:6px}
.plantilla-globos .globitos-esq{position:absolute;width:150px;top:30px;right:-20px;opacity:.9}
.plantilla-globos .globitos-esq.d{right:auto;left:-20px}
.plantilla-globos .globitos-pie{width:170px;margin:0 auto 10px}
.plantilla-globos .pie{background:linear-gradient(180deg,#4b3f8f,#3a2f73)}
.plantilla-globos .pie .nombres{color:#fff;text-shadow:4px 5px 0 #a58bc9;font-size:clamp(56px,15vw,90px)}
.plantilla-globos #form-rsvp label{color:var(--tinta)}
.plantilla-globos #form-rsvp input[type=text],.plantilla-globos #form-rsvp select,.plantilla-globos #form-rsvp textarea,.plantilla-globos .form-whats input,.plantilla-globos .form-whats textarea{border:2px solid var(--linea);border-radius:16px;font-family:var(--f-texto)}
.plantilla-globos .opciones label{border-radius:16px!important}
@media (max-width:640px){
  .plantilla-globos .linea{grid-template-columns:1fr 1fr}
  .plantilla-globos .globitos-esq{width:100px}
}`
  });
})();
