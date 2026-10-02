/* Plantilla XV años: Princesa Rosa — rosa, dorado, tiara y rosas. Destellos que caen. */
(function () {
  // Cada dibujo con ids propios (si el primero queda oculto, los degradados de los demás siguen funcionando)
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };
  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const ORO = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b98a3e"/><stop offset=".45" stop-color="#f4dc9b"/><stop offset=".7" stop-color="#d1a556"/><stop offset="1" stop-color="#a87a30"/></linearGradient></defs>`;

  const CORONA = `<svg viewBox="0 0 240 150">${ORO('pr-oro')}
    <path d="M28 116Q120 140 212 116L216 130Q120 156 24 130Z" fill="url(#pr-oro)"/>
    <path d="M32 116L46 64L64 96L82 46L101 88L120 16L139 88L158 46L176 96L194 64L208 116" fill="none" stroke="url(#pr-oro)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
    <g fill="none" stroke="url(#pr-oro)" stroke-width="2" stroke-linecap="round">
      <path d="M50 110c0-14 8-22 14-14M78 110c0-20 4-34 4-34M120 108c-10-10-10-26 0-32 10 6 10 22 0 32M162 110c0-20-4-34-4-34M190 110c0-14-8-22-14-14"/>
      <path d="M96 104c-4-8 2-14 7-10M144 104c4-8-2-14-7-10"/>
    </g>
    <g fill="#fff8f0" stroke="#d1a556" stroke-width="1.5"><circle cx="46" cy="60" r="6"/><circle cx="82" cy="42" r="6.5"/><circle cx="158" cy="42" r="6.5"/><circle cx="194" cy="60" r="6"/><circle cx="120" cy="12" r="7"/></g>
    <path d="M120 44c9 10 12 18 12 24a12 12 0 01-24 0c0-6 3-14 12-24z" fill="#e58aa3" stroke="#d1a556" stroke-width="2"/>
    <path d="M116 56c-2 4-2 9 1 12" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>
    <g fill="#f3b3c4" stroke="#d1a556" stroke-width="1.2"><circle cx="62" cy="124" r="4.5"/><circle cx="92" cy="129" r="4.5"/><circle cx="148" cy="129" r="4.5"/><circle cx="178" cy="124" r="4.5"/></g>
    <g fill="#fff"><circle cx="120" cy="131" r="3.5"/><circle cx="76" cy="127" r="2.5"/><circle cx="105" cy="131" r="2.5"/><circle cx="135" cy="131" r="2.5"/><circle cx="164" cy="127" r="2.5"/><circle cx="44" cy="120" r="2.5"/><circle cx="196" cy="120" r="2.5"/></g>
  </svg>`;

  function rosa(x, y, r, base, oscuro, rot) {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot || 0})">`;
    for (let i = 0; i < 5; i++) s += `<ellipse cy="${-r * 0.55}" rx="${r * 0.62}" ry="${r * 0.48}" fill="${base}" stroke="${oscuro}" stroke-opacity=".3" stroke-width="1" transform="rotate(${i * 72})"/>`;
    s += `<circle r="${r * 0.72}" fill="${base}"/><circle r="${r * 0.6}" fill="${oscuro}" opacity=".14"/>`;
    const a = (rr, x1, y1, x2, y2, w, o) => `<path d="M${x1 * r} ${y1 * r}A${rr * r} ${rr * r} 0 0 1 ${x2 * r} ${y2 * r}" fill="none" stroke="${oscuro}" stroke-width="${w * r}" stroke-linecap="round" opacity="${o}"/>`;
    s += a(.55, -.55, .15, .45, -.3, .05, .45) + a(.42, .4, .3, -.4, -.12, .05, .4) + a(.28, -.25, -.25, .25, .12, .05, .5) + a(.14, .12, .14, -.12, -.06, .045, .6);
    return s + '</g>';
  }
  const hoja = (x, y, l, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0Q${l * .5} ${-l * .3} ${l} 0Q${l * .5} ${l * .3} 0 0Z" fill="${c}"/><path d="M${l * .08} 0L${l * .9} 0" stroke="#fff" stroke-opacity=".35" stroke-width="1"/></g>`;
  const brillo = (x, y, r) => `<path transform="translate(${x} ${y})" d="M0 ${-r}L${r * .22} ${-r * .22}L${r} 0L${r * .22} ${r * .22}L0 ${r}L${-r * .22} ${r * .22}L${-r} 0L${-r * .22} ${-r * .22}Z" fill="#e6c27a"/>`;
  const V = { blush: '#f8d3db', rosa: '#ec9fb3', fucsia: '#d76c8c', crema: '#fbe9e4', vino: '#a8445f', h1: '#a7b89a', h2: '#86997a', h3: '#c3d0b6' };

  const RAMO = `<svg viewBox="0 0 300 300">
    ${hoja(80, 80, 120, 8, V.h2)}${hoja(80, 80, 110, 80, V.h1)}${hoja(80, 80, 95, 35, V.h3)}${hoja(80, 80, 92, 58, V.h2)}${hoja(70, 70, 80, -40, V.h1)}${hoja(70, 70, 80, 130, V.h3)}
    ${rosa(160, 60, 24, V.rosa, V.vino, 20)}${rosa(60, 160, 24, V.crema, '#c9a58c', -15)}${rosa(196, 34, 13, V.fucsia, V.vino, 0)}${rosa(34, 196, 13, V.blush, V.vino, 0)}
    ${rosa(100, 96, 40, V.blush, V.vino, 0)}${rosa(150, 128, 18, V.fucsia, V.vino, 40)}
    ${brillo(215, 92, 9)}${brillo(92, 214, 9)}${brillo(190, 140, 6)}${brillo(140, 186, 6)}${brillo(232, 50, 5)}
  </svg>`;

  const SEPARADOR = `<svg viewBox="0 0 260 40">${ORO('pr-oro2')}<path d="M10 22H96M164 22H250" stroke="url(#pr-oro2)" stroke-width="1.2"/>
    <path d="M108 30L112 14L120 22L130 8L140 22L148 14L152 30Z" fill="none" stroke="url(#pr-oro2)" stroke-width="2" stroke-linejoin="round"/>
    <path d="M106 32H154" stroke="url(#pr-oro2)" stroke-width="2.4"/><circle cx="130" cy="6" r="2.6" fill="#ec9fb3"/>
    ${brillo(80, 22, 5)}${brillo(180, 22, 5)}</svg>`;

  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60">
    <defs><pattern id="pr-forro" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M6 3L7 6L6 9L5 6Z" fill="#d1a556" opacity=".7"/><circle cx="0" cy="0" r="1.3" fill="#ec9fb3"/><circle cx="12" cy="12" r="1.3" fill="#ec9fb3"/></pattern></defs>
    <rect width="100" height="60" fill="#fbe3e9"/><rect width="100" height="60" fill="url(#pr-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'princesa',
    eventos: ['xv'],
    nombre: 'Princesa Rosa',
    descripcion: 'XV años: rosa y dorado, tiara, rosas y destellos.',
    colores: ['#fbe3e9', '#ec9fb3', '#a8445f', '#d1a556'],
    efecto: 'destellos',
    efectoColores: ['#f4dc9b', '#ec9fb3', '#f8d3db', '#d1a556'],
    adornos: [
      { id: 'corona', nombre: 'Tiara', ayuda: 'PNG transparente horizontal, tiara o corona (~900×560 px)' },
      { id: 'ramo', nombre: 'Ramo de esquina', ayuda: 'PNG transparente, flores que salen de la esquina superior izquierda (~800×800 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~700×100 px)' }
    ],
    pdf: { slot: 'ramo', svg: RAMO, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@400;500&family=Parisienne&display=swap',

    render(d, S) {
      const esq = (c) => S.adorno(d, 'ramo', uniq(RAMO), 'esq ' + c);
      const sep = S.adorno(d, 'separador', uniq(SEPARADOR), 'separador rv');
      const corona = (c) => S.adorno(d, 'corona', uniq(CORONA), c);
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: uniq(FORRO), selloExtra: corona('sello-corona') })}
<main>
  <section class="portada">
    ${esq('tl')}${esq('br')}
    <div class="medallon rv ${foto ? 'con-foto' : ''}">
      ${corona('corona')}
      ${foto ? `<div class="ovalo"><img src="${S.esc(foto)}" alt=""></div>` : ''}
      <p class="intro">${S.esc(d.introPortada)}</p>
      <div class="xv" aria-hidden="true">XV</div>
      ${S.nombres(d)}
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', arriba: sep })}
  ${S.familia(d, { arriba: corona('corona-chica rv') })}
  ${S.cuenta(d, { antes: esq('tl chica tenue') + esq('br chica tenue') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt', antes: esq('tr chica') })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt', antes: esq('bl chica') })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: corona('corona-pie') })}
</main>`;
    },

    css: `
body.plantilla-princesa{--acento-texto:#856633;--fondo:#fff8f9;--fondo2:#fcebef;--tinta:#4b3540;--suave:#77596a;--acento:#c99a4e;--acento2:#a35268;--linea:#f0d3da;--oscuro:#7a3550;--sobre-oscuro:#fff1f4;--titulo:#a24a68;--tarjeta:#fffdfd;
  --f-titulo:'Parisienne',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Montserrat',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at center,#fff6f8 0%,#f6d3dc 100%);--sobre-c1:#f0b9c7;--sobre-c2:#f6ccd6;--sobre-c3:#f9d8e0;--sello:radial-gradient(circle at 35% 30%,#f4dc9b,#d1a556 55%,#a87a30);--sello-texto:#6b3a20;--sello-borde:#b98a3e}
.plantilla-princesa::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(circle at 12% 8%,rgba(236,159,179,.18),transparent 40%),radial-gradient(circle at 88% 85%,rgba(209,165,86,.14),transparent 40%)}
.plantilla-princesa .sello{font-family:'Cinzel',serif;letter-spacing:.05em}
.plantilla-princesa .sello-corona{position:absolute;width:60%;left:20%;top:-34%;z-index:3}
.plantilla-princesa .alt{background:var(--fondo2)}
.plantilla-princesa .titulo{font-size:clamp(46px,11vw,70px)}
.plantilla-princesa .esq{position:absolute;width:290px;z-index:1}
.plantilla-princesa .esq.tl{top:-24px;left:-24px}
.plantilla-princesa .esq.tr{top:-24px;right:-24px;transform:scaleX(-1)}
.plantilla-princesa .esq.br{bottom:-24px;right:-24px;transform:rotate(180deg)}
.plantilla-princesa .esq.bl{bottom:-24px;left:-24px;transform:scaleY(-1)}
.plantilla-princesa .esq.chica{width:180px}
.plantilla-princesa .esq.tenue{opacity:.3}
.plantilla-princesa .medallon{position:relative;width:min(470px,100%);padding:110px 32px 64px;border:1.5px solid var(--acento);border-radius:240px 240px 24px 24px;outline:1px solid rgba(201,154,78,.45);outline-offset:8px;background:rgba(255,253,253,.8);z-index:2}
.plantilla-princesa .corona{position:absolute;top:-62px;left:50%;width:210px;transform:translateX(-50%);filter:drop-shadow(0 6px 10px rgba(168,122,48,.25));animation:brillar 4s ease-in-out infinite}
@keyframes brillar{0%,100%{filter:drop-shadow(0 6px 10px rgba(168,122,48,.25))}50%{filter:drop-shadow(0 0 16px rgba(244,220,155,.9))}}
.plantilla-princesa .medallon.con-foto{padding-top:90px}
.plantilla-princesa .ovalo{width:min(260px,74%);aspect-ratio:3/4;margin:0 auto 26px;border-radius:50%;overflow:hidden;border:5px solid #fff;box-shadow:0 0 0 2px var(--acento),0 14px 30px rgba(168,68,95,.18)}
.plantilla-princesa .ovalo img{width:100%;height:100%;object-fit:cover}
.plantilla-princesa .intro{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.45em;text-transform:uppercase;color:var(--suave)}
.plantilla-princesa .xv{font-family:'Cinzel',serif;font-weight:600;font-size:clamp(76px,22vw,120px);line-height:1;margin:6px 0 -34px;opacity:.9;
  background:linear-gradient(100deg,#b98a3e 0%,#f4dc9b 25%,#d1a556 45%,#fff3d2 52%,#d1a556 60%,#f4dc9b 80%,#b98a3e 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:foilP 6s ease-in-out infinite}
@keyframes foilP{0%,100%{background-position:0 0}50%{background-position:100% 0}}
.plantilla-princesa .nombres{font-size:clamp(64px,18vw,104px);position:relative;text-shadow:0 2px 0 #fff,0 0 18px #fff}
.plantilla-princesa .ciudad{margin-top:22px;font-style:italic;font-size:20px;color:var(--acento2)}
.plantilla-princesa .separador{width:230px;margin:0 auto 24px}
.plantilla-princesa .corona-chica{width:120px;margin:0 auto 18px}
.plantilla-princesa .corona-pie{width:130px;margin:0 auto 20px}
.plantilla-princesa .lugar{border-radius:150px 150px 14px 14px;padding-top:56px}
.plantilla-princesa .lugar::before{content:"";position:absolute;inset:8px;border:1px solid var(--linea);border-radius:142px 142px 10px 10px;pointer-events:none}
.plantilla-princesa .lugar .btn{position:relative;z-index:1}
.plantilla-princesa .foto{border-radius:16px;border:6px solid #fff;box-shadow:0 10px 30px rgba(168,68,95,.14)}
.plantilla-princesa .foto:nth-child(odd){transform:rotate(-1.5deg)}.plantilla-princesa .foto:nth-child(even){transform:rotate(1.5deg)}
.plantilla-princesa .evento .icono{border-color:var(--acento);color:var(--acento2)}
.plantilla-princesa .reloj span{font-family:'Cinzel',serif;font-weight:400}
.plantilla-princesa .btn.solido{background:linear-gradient(100deg,#9c4762,#b15870);border:none}
.plantilla-princesa .pie{background:linear-gradient(180deg,#7a3550,#5b2439)}
.plantilla-princesa .pie .nombres{text-shadow:none}
@media (max-width:640px){
  .plantilla-princesa .esq{width:190px}.plantilla-princesa .esq.chica{width:120px}
  .plantilla-princesa .medallon{padding:96px 18px 54px}
  .plantilla-princesa .corona{width:170px;top:-50px}
}`
  });
})();
