/* Plantilla: Rústica Campestre — papel kraft, eucalipto, flores silvestres y series de luces. */
(function () {
  const C = { e1: '#9fb0a3', e2: '#b9c6bb', e3: '#7f948a', tallo: '#6d7f6c', lav: '#9b8bb4', trigo: '#d1ad6b', marg: '#fffaf0', centro: '#e0a93b', cuerda: '#b08a5a' };

  // Hoja redonda de eucalipto
  const eu = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.86}" fill="${c}"/><path d="M${x} ${y - r * .7}V${y + r * .7}" stroke="#fff" stroke-opacity=".25"/>`;
  const margarita = (x, y, r) => {
    let s = `<g transform="translate(${x} ${y})">`;
    for (let i = 0; i < 10; i++) s += `<ellipse cy="${-r * .55}" rx="${r * .2}" ry="${r * .5}" fill="${C.marg}" stroke="#e6dccb" stroke-width=".6" transform="rotate(${i * 36})"/>`;
    return s + `<circle r="${r * .26}" fill="${C.centro}"/></g>`;
  };
  const espiga = (x, y, l, rot, c, rx) => {
    let s = `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0V${-l}" stroke="${C.tallo}" stroke-width="1.2"/>`;
    for (let i = 0; i < 7; i++) { const yy = -l + i * (l * .09); s += `<ellipse cx="-3" cy="${yy}" rx="${rx}" ry="${rx * 2}" fill="${c}" transform="rotate(-25 -3 ${yy})"/><ellipse cx="3" cy="${yy + 3}" rx="${rx}" ry="${rx * 2}" fill="${c}" transform="rotate(25 3 ${yy + 3})"/>`; }
    return s + '</g>';
  };
  const tallo = (x1, y1, x2, y2, cx, cy) => `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="${C.tallo}" stroke-width="1.4" fill="none"/>`;

  // Guirnalda horizontal de eucalipto
  let gl = '';
  for (let i = 0; i <= 22; i++) {
    const t = i / 22, x = 20 + t * 460, y = 60 + Math.sin(t * Math.PI) * 26;
    gl += eu(x, y + (i % 2 ? -12 : 12), 9 + (i % 3) * 2, [C.e1, C.e2, C.e3][i % 3]);
  }
  const GUIRNALDA = `<svg viewBox="0 0 500 120"><path d="M20 60Q250 112 480 60" stroke="${C.tallo}" stroke-width="1.5" fill="none"/>${gl}
    ${margarita(130, 82, 14)}${margarita(250, 92, 18)}${margarita(370, 82, 14)}${espiga(195, 90, 40, -60, C.lav, 2.2)}${espiga(305, 90, 40, 60, C.lav, 2.2)}
    ${margarita(70, 66, 9)}${margarita(430, 66, 9)}</svg>`;

  // Ramo de flores silvestres atado con cordel
  const RAMO = `<svg viewBox="0 0 220 300">
    ${tallo(110, 290, 40, 90, 70, 200)}${tallo(110, 290, 180, 80, 150, 200)}${tallo(110, 290, 110, 50, 105, 170)}${tallo(110, 290, 70, 60, 90, 180)}${tallo(110, 290, 150, 55, 130, 170)}
    ${espiga(70, 160, 110, -18, C.trigo, 2.6)}${espiga(150, 160, 110, 18, C.trigo, 2.6)}${espiga(95, 150, 100, -6, C.lav, 2.4)}${espiga(128, 150, 100, 8, C.lav, 2.4)}
    ${eu(40, 90, 13, C.e1)}${eu(55, 115, 11, C.e2)}${eu(30, 120, 10, C.e3)}${eu(180, 80, 13, C.e1)}${eu(165, 108, 11, C.e3)}${eu(190, 112, 10, C.e2)}
    ${margarita(110, 55, 22)}${margarita(70, 70, 17)}${margarita(150, 62, 18)}${margarita(92, 110, 14)}${margarita(132, 105, 15)}
    <path d="M92 222q18 10 36 0M92 232q18 10 36 0" stroke="${C.cuerda}" stroke-width="3" fill="none"/>
    <path d="M110 228c-20-14-34-4-24 4 8 6 24-4 24-4zm0 0c20-14 34-4 24 4-8 6-24-4-24-4zM108 230l-14 30M112 230l12 32" stroke="${C.cuerda}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </svg>`;

  // Serie de luces (dibujo fijo con animación)
  let focos = '';
  for (let i = 1; i < 14; i++) {
    const t = i / 14, x = t * 600, y = 18 + Math.sin(t * Math.PI) * 60;
    focos += `<g class="foco" style="animation-delay:${(i * 0.37) % 2.2}s"><circle cx="${x}" cy="${y + 12}" r="14" fill="#ffd98a" opacity=".35"/><circle cx="${x}" cy="${y + 12}" r="5" fill="#fff1c4"/></g><path d="M${x} ${y}v7" stroke="#5a4a38" stroke-width="2"/>`;
  }
  const LUCES = `<svg viewBox="0 0 600 110" preserveAspectRatio="none"><path d="M0 18Q300 138 600 18" stroke="#5a4a38" stroke-width="1.3" fill="none"/>${focos}</svg>`;

  const ENCAJE = `<svg viewBox="0 0 100 60" preserveAspectRatio="none" width="100%" height="100%"><defs><pattern id="ru-encaje" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2" fill="none" stroke="#fffaf0" stroke-width=".7" opacity=".7"/><circle cx="5" cy="5" r="1" fill="#fffaf0" opacity=".6"/><circle cx="0" cy="0" r="1.6" fill="none" stroke="#fffaf0" stroke-width=".5" opacity=".6"/></pattern></defs><rect width="100" height="60" fill="#c9a77d"/><rect width="100" height="60" fill="url(#ru-encaje)"/></svg>`;

  window.Invitacion.registrar({
    id: 'rustica',
    nombre: 'Rústica Campestre',
    descripcion: 'Papel kraft, eucalipto, flores silvestres, serie de luces y encaje.',
    colores: ['#e9dcc4', '#7f948a', '#a87b4f', '#3f4a3c'],
    efecto: 'hojas',
    efectoColores: ['#9fb0a3', '#b9c6bb', '#7f948a'],
    adornos: [
      { id: 'guirnalda', nombre: 'Guirnalda', ayuda: 'PNG transparente horizontal de follaje (~1400×350 px)' },
      { id: 'ramo', nombre: 'Ramo silvestre', ayuda: 'PNG transparente vertical (~700×950 px)' }
    ],
    pdf: { slot: 'guirnalda', svg: GUIRNALDA, modo: 'arriba' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Josefin+Sans:wght@300;400;600&family=Parisienne&display=swap',

    render(d, S) {
      const f = S.fechaInfo(d);
      const guir = (c) => S.adorno(d, 'guirnalda', GUIRNALDA, c);
      const ramo = (c) => S.adorno(d, 'ramo', RAMO, c);
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: ENCAJE, selloExtra: '<span class="cordel-v"></span>' })}
<main>
  <section class="portada">
    <span class="luces" aria-hidden="true">${LUCES}</span>
    ${ramo('ramo-izq')}${ramo('ramo-der')}
    <div class="portada-in rv">
      ${foto ? `<div class="polaroid"><span class="cinta"></span><img src="${S.esc(foto)}" alt=""><p>${S.esc(S.iniciales(d))}</p></div>` : ''}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d, 'h1', '&amp;')}
      ${guir('guir-portada')}
      <div class="sellofecha"><span>${f.diaSemana}</span><b>${f.dia}</b><span>${f.mes} ${f.anio}</span></div>
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'kraft encaje', arriba: guir('guir-sec rv') })}
  ${S.familia(d)}
  ${S.cuenta(d, { antes: `<span class="luces chica" aria-hidden="true">${LUCES}</span>` })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'kraft encaje' })}
  ${S.vestimenta(d, { antes: ramo('ramo-sec') })}
  ${S.historia(d, { clase: 'kraft encaje' })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'kraft encaje' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: guir('guir-sec rv'), antes: `<span class="luces" aria-hidden="true">${LUCES}</span>` })}
</main>`;
    },

    css: `
body.plantilla-rustica{--acento-texto:#7c5b3a;--fondo:#f7f0e4;--fondo2:#ebdfc9;--tinta:#3d3428;--suave:#6e604d;--acento:#a87b4f;--acento2:#566650;--linea:#d6c4a4;--oscuro:#3f4a3c;--sobre-oscuro:#f4ead8;--titulo:#4a3a2c;--tarjeta:#fbf6ec;--radio-btn:4px;
  --f-titulo:'Parisienne',cursive;--f-texto:'Lora',Georgia,serif;--f-etiqueta:'Josefin Sans',system-ui,sans-serif;
  --fondo-sobre:#ece1cd;--sobre-c1:#b88f62;--sobre-c2:#c9a273;--sobre-c3:#d1ad80;--sello:#f7efe0;--sello-texto:#5e6f57;--sello-borde:#a87b4f}
.plantilla-rustica{font-size:18px}
.plantilla-rustica::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.55;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .35 0 0 0 0 .22 0 0 0 .12 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.plantilla-rustica .sello{text-shadow:none;font-size:24px}.plantilla-rustica .mitad{border:1.5px dashed #a87b4f}.plantilla-rustica .mitad-2{border-left:none}.plantilla-rustica .abierto .cordel-v,.plantilla-rustica .abierto .sobre-frente::before{opacity:0;transition:opacity .4s ease .3s}
.plantilla-rustica .sello::before{inset:-3px;border-radius:50%;background:#f7efe0}
.plantilla-rustica .cordel-v{position:absolute;left:50%;top:-104px;bottom:-48px;width:3px;background:repeating-linear-gradient(45deg,#b08a5a 0 3px,#8f6b40 3px 6px);transform:translateX(-50%);z-index:-2;transition:opacity .4s ease .3s}
.plantilla-rustica .sobre-frente::before{content:"";position:absolute;left:0;right:0;top:62%;height:3px;background:repeating-linear-gradient(45deg,#b08a5a 0 3px,#8f6b40 3px 6px);z-index:2}
.plantilla-rustica .titulo{font-size:clamp(46px,11vw,70px)}
.plantilla-rustica .eyebrow{letter-spacing:.35em;font-weight:600}
.plantilla-rustica .kraft{background:var(--fondo2)}
.plantilla-rustica .encaje{padding-top:120px;padding-bottom:120px}
.plantilla-rustica .encaje::before,.plantilla-rustica .encaje::after{content:"";position:absolute;left:0;right:0;height:22px;background:radial-gradient(circle at 11px 0,var(--fondo) 10px,transparent 10.5px) 0 0/22px 22px repeat-x;z-index:1}
.plantilla-rustica .encaje::before{top:0}
.plantilla-rustica .encaje::after{bottom:0;transform:scaleY(-1)}
.plantilla-rustica .luces{position:absolute;top:0;left:0;right:0;height:110px;z-index:1}
.plantilla-rustica .luces svg{width:100%;height:100%}
.plantilla-rustica .luces.chica{height:80px;opacity:.9}
.plantilla-rustica .foco{animation:brillo 2.2s ease-in-out infinite}
@keyframes brillo{0%,100%{opacity:1}50%{opacity:.45}}
.plantilla-rustica .portada{padding-top:130px}
.plantilla-rustica .portada-in{position:relative;z-index:2;max-width:560px}
.plantilla-rustica .ramo-izq,.plantilla-rustica .ramo-der{position:absolute;bottom:-30px;width:230px;z-index:1}
.plantilla-rustica .ramo-izq{left:-40px;transform:rotate(-18deg)}
.plantilla-rustica .ramo-der{right:-40px;transform:rotate(18deg) scaleX(-1)}
.plantilla-rustica .intro{font-family:var(--f-etiqueta);font-size:13px;font-weight:600;letter-spacing:.5em;text-transform:uppercase;color:var(--acento2)}
.plantilla-rustica .nombres{font-size:clamp(64px,17vw,112px);margin:16px 0 0}
.plantilla-rustica .nombres .amp{font-family:var(--f-texto);font-style:italic;font-size:.32em;margin:10px 0}
.plantilla-rustica .guir-portada{width:min(440px,100%);margin:-8px auto 10px}
.plantilla-rustica .guir-sec{width:300px;margin:0 auto 24px}
.plantilla-rustica .sellofecha{width:150px;height:150px;margin:16px auto 0;border-radius:50%;border:1.5px solid var(--acento);outline:1px dashed var(--acento);outline-offset:-10px;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-8deg);color:var(--titulo);background:var(--tarjeta)}
.plantilla-rustica .sellofecha span{font-family:var(--f-etiqueta);font-size:10px;font-weight:600;letter-spacing:.25em;text-transform:uppercase}
.plantilla-rustica .sellofecha b{font-family:var(--f-texto);font-size:52px;font-weight:500;line-height:1}
.plantilla-rustica .ciudad{margin-top:22px;font-style:italic;color:var(--suave)}
.plantilla-rustica .polaroid{position:relative;width:min(300px,78%);margin:0 auto 28px;background:#fff;padding:12px 12px 8px;box-shadow:0 14px 34px rgba(60,40,20,.2);transform:rotate(-3deg)}
.plantilla-rustica .polaroid img{aspect-ratio:1;object-fit:cover;width:100%}
.plantilla-rustica .polaroid p{font-family:var(--f-titulo);font-size:30px;color:var(--titulo);padding-top:6px}
.plantilla-rustica .cinta{position:absolute;top:-14px;left:50%;width:110px;height:30px;transform:translateX(-50%) rotate(3deg);background:rgba(214,196,164,.75);box-shadow:0 1px 3px rgba(0,0,0,.1)}
.plantilla-rustica .ramo-sec{position:absolute;right:-30px;top:30px;width:170px;opacity:.85;transform:rotate(12deg)}
.plantilla-rustica .lugar,.plantilla-rustica .regalo,.plantilla-rustica .pase{box-shadow:0 8px 24px rgba(80,60,30,.08)}
.plantilla-rustica .lugar{border-style:dashed}
.plantilla-rustica .foto{background:#fff;padding:10px 10px 44px;box-shadow:0 10px 26px rgba(60,40,20,.16);aspect-ratio:auto;overflow:visible}
.plantilla-rustica .foto img{aspect-ratio:1}
.plantilla-rustica .foto.vacia{aspect-ratio:auto;min-height:220px;border:none}
.plantilla-rustica .foto:nth-child(odd){transform:rotate(-2.5deg)}
.plantilla-rustica .foto:nth-child(even){transform:rotate(2deg)}
.plantilla-rustica .foto figcaption{background:none;color:var(--titulo);padding:0;bottom:8px;font-size:24px}
.plantilla-rustica .oscura,.plantilla-rustica .pie{background:linear-gradient(180deg,#3f4a3c,#323b30)}
.plantilla-rustica .pie{padding-top:140px}
@media (max-width:640px){
  .plantilla-rustica .ramo-izq,.plantilla-rustica .ramo-der{width:140px;bottom:-20px}
  .plantilla-rustica .ramo-sec{width:110px;right:-30px}
  .plantilla-rustica .luces{height:80px}
}`
  });
})();
