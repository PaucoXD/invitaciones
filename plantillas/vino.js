/* Plantilla: Vino y Olivo — estilo collage de papelería: sobre que se queda abierto como portada,
   tarjetas troqueladas, sellos de cera, encaje, fotos encimadas y alcatraces dibujados. */
(function () {
  const C = { vino: '#7e2638', vinoOsc: '#4f1220', olivo: '#9c9b5f', olivoOsc: '#6f6e3a', tallo: '#5f6b3a', blanco: '#fbf8f3', amarillo: '#e2c15a', hojaOsc: '#3f1019' };

  // ---------------- Flores dibujadas (se reemplazan por PNG desde el editor) ----------------
  function alcatraz(x, y, rot, color, s) {
    const interior = color === C.blanco ? '#e9e2d6' : '#000';
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s || 1})">
      <path d="M2 0C4 30 0 62 6 100" stroke="${C.tallo}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <path d="M0 0C-14-8-21-30-11-52C-4-65 10-71 23-66C14-56 12-40 14-24C15-10 8-2 0 0Z" fill="${color}"/>
      <path d="M3-5C-5-18-8-36-2-50C4-58 12-62 20-64C12-50 10-36 10-22C10-12 7-7 3-5Z" fill="${interior}" opacity=".2"/>
      <path d="M3-10Q5-28 9-40" stroke="${C.amarillo}" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M-11-52C-4-65 10-71 23-66" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" fill="none"/>
    </g>`;
  }
  function orquidea(x, y, r, rot) {
    const pe = (cx, cy, rx, ry, a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${cx} ${cy})" fill="${C.blanco}" stroke="#ddd2c4" stroke-width=".8"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${rot || 0})">
      ${pe(0, -r * .62, r * .32, r * .55, 0)}${pe(-r * .5, r * .5, r * .3, r * .52, 35)}${pe(r * .5, r * .5, r * .3, r * .52, -35)}
      ${pe(-r * .6, -r * .05, r * .55, r * .48, 10)}${pe(r * .6, -r * .05, r * .55, r * .48, -10)}
      <path d="M-${r * .22} ${r * .05}Q0 ${r * .55} ${r * .22} ${r * .05}Q0 -${r * .1} -${r * .22} ${r * .05}Z" fill="#c4808f"/>
      <circle r="${r * .1}" cy="-${r * .06}" fill="${C.amarillo}"/>
    </g>`;
  }
  const hojaOscura = (x, y, l, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0C${l * .45}-${l * .38} ${l * .9}-${l * .25} ${l} 0C${l * .9} ${l * .25} ${l * .45} ${l * .38} 0 0Z" fill="${c || C.hojaOsc}"/><path d="M${l * .05} 0H${l * .92}" stroke="#fff" stroke-opacity=".18"/></g>`;
  const bayas = (x, y) => [[0, 0], [7, -5], [12, 3], [4, 8], [-6, 6], [-4, -7], [14, -9]].map(([a, b], i) => `<circle cx="${x + a}" cy="${y + b}" r="${3.6 - (i % 3) * .5}" fill="${i % 2 ? '#6d1a2a' : '#8e2a3b'}"/><circle cx="${x + a - 1}" cy="${y + b - 1}" r=".9" fill="#fff" opacity=".5"/>`).join('');
  function amaranto(x, y, l, curva) {
    let s = '';
    for (let k = 0; k < 3; k++) {
      const dx = (k - 1) * 7 + curva, len = l - k * 18;
      s += `<path d="M${x + k * 4} ${y}q${dx} ${len * .5} ${dx * .6} ${len}" stroke="#6e7a35" stroke-width="1.2" fill="none"/>`;
      for (let i = 0; i < 16; i++) { const t = i / 16, px = x + k * 4 + dx * 2 * t * (1 - t) + dx * .6 * t * t, py = y + len * t; s += `<circle cx="${px}" cy="${py}" r="${3 - t * 1.6}" fill="${i % 2 ? '#7f8a3c' : '#93a04a'}"/>`; }
    }
    return s;
  }
  const RAMO = `<svg viewBox="0 0 200 260">
    ${hojaOscura(95, 95, 80, -150)}${hojaOscura(105, 95, 85, -40)}${hojaOscura(100, 100, 70, -95, '#2f3b1e')}${hojaOscura(100, 100, 66, 160, '#5a1626')}
    ${amaranto(92, 120, 130, -6)}
    ${alcatraz(118, 82, 28, C.vino, 1)}${alcatraz(92, 80, -8, C.vinoOsc, .95)}${alcatraz(70, 98, -38, C.blanco, .85)}${alcatraz(142, 100, 55, C.blanco, .8)}
    ${bayas(58, 122)}${bayas(140, 128)}
    ${orquidea(84, 118, 17, -10)}${orquidea(112, 128, 15, 15)}${orquidea(128, 110, 13, 30)}${orquidea(96, 146, 13, -20)}
  </svg>`;
  const ALCATRAZ = `<svg viewBox="0 0 280 70"><path d="M60 40C120 46 190 42 275 34" stroke="${C.tallo}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g transform="translate(60 40) rotate(-100)">
      <path d="M0 0C-14-8-21-30-11-52C-4-65 10-71 23-66C14-56 12-40 14-24C15-10 8-2 0 0Z" fill="${C.vino}"/>
      <path d="M3-5C-5-18-8-36-2-50C4-58 12-62 20-64C12-50 10-36 10-22C10-12 7-7 3-5Z" fill="#000" opacity=".2"/>
      <path d="M3-10Q5-28 9-40" stroke="${C.amarillo}" stroke-width="4" stroke-linecap="round"/></g></svg>`;

  // Forro del sobre: follaje vino sobre fondo dorado
  let follaje = '';
  for (let i = 0; i < 9; i++) follaje += hojaOscura(10 + (i % 3) * 38, 8 + Math.floor(i / 3) * 22, 30, 20 + i * 47, i % 2 ? '#7e2638' : '#5d6233');
  const FORRO = `<svg viewBox="0 0 120 70" preserveAspectRatio="xMidYMid slice"><rect width="120" height="70" fill="#d9c9a0"/>${follaje}${orquidea(98, 18, 9, 10)}${orquidea(60, 52, 8, -20)}</svg>`;

  // Florituras para las esquinas de las tarjetas troqueladas
  const ESQ = `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1"><path d="M2 38V14C2 7 7 2 14 2h24"/><path d="M8 38V18c0-6 4-10 10-10h20"/><path d="M14 14c4 0 6 3 4 6s-6 1-5-2"/><circle cx="5" cy="5" r="1.6" fill="currentColor"/></svg>`;
  const marco = (contenido, clase = '', attrs = '') => `<div class="troquel ${clase}" ${attrs}><span class="tq tq1">${ESQ}</span><span class="tq tq2">${ESQ}</span><span class="tq tq3">${ESQ}</span><span class="tq tq4">${ESQ}</span><div class="tq-in">${contenido}</div></div>`;
  const SILUETA = `<svg viewBox="0 0 120 160" preserveAspectRatio="xMidYMax slice"><circle cx="30" cy="30" r="22" fill="#fff" opacity=".06"/><circle cx="95" cy="50" r="14" fill="#fff" opacity=".07"/><circle cx="70" cy="18" r="9" fill="#fff" opacity=".08"/>
    <g fill="#fff" opacity=".22"><circle cx="48" cy="70" r="11"/><path d="M28 160c0-40 6-70 20-70s18 22 22 40l8 30z"/><circle cx="76" cy="66" r="10"/><path d="M60 160c2-36 6-64 16-64 12 0 18 30 20 64z"/></g></svg>`;

  window.Invitacion.registrar({
    id: 'vino',
    nombre: 'Vino y Olivo',
    descripcion: 'Collage de papelería: sobre que se queda abierto, tarjetas, sellos de cera, encaje y alcatraces.',
    colores: ['#7e2638', '#9c9b5f', '#f4efe8', '#b5707e'],
    efecto: 'petalos',
    efectoColores: ['#7e2638', '#a8455a', '#fbf8f3', '#9c9b5f'],
    adornos: [
      { id: 'ramo', nombre: 'Ramo de flores', ayuda: 'PNG transparente, ramo que cuelga de la esquina (~700×900 px)' },
      { id: 'alcatraz', nombre: 'Flor suelta horizontal', ayuda: 'PNG transparente horizontal (~1000×250 px)' }
    ],
    fuentes: 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Pinyon+Script&display=swap',

    render(d, S) {
      const e = S.esc, f = S.fechaInfo(d), ini = S.iniciales(d), oc = d.ocultar;
      const ramo = (c) => S.adorno(d, 'ramo', RAMO, 'ramo ' + c);
      const alcatrazSuelto = (c) => S.adorno(d, 'alcatraz', ALCATRAZ, 'alc ' + c);
      const lista = [d.fotoPortada, ...(d.historia.fotos || []).map(x => x.src)].filter(Boolean);
      const foto = (i, c = '') => lista.length
        ? `<figure class="vf ${c}" data-zoom="${e(lista[i % lista.length])}"><img src="${e(lista[i % lista.length])}" alt="" loading="lazy"></figure>`
        : `<figure class="vf hueco ${c}">${SILUETA}</figure>`;
      const cera = (txt, c = '') => `<span class="cera ${c}">${e(txt)}</span>`;
      const btnMini = (href, txt) => `<a class="mini" target="_blank" rel="noopener" href="${e(href)}">${e(txt)}</a>`;
      const lineas = S.lineas;

      // ---------- Portada: sobre que se queda abierto ----------
      const carta = `<div class="carta-foto">${lista[0] ? `<img src="${e(lista[0])}" alt="">` : SILUETA}</div>
        <div class="carta-nombres"><span>${e(d.novia)}</span><i>&amp;</i><span>${e(d.novio)}</span></div>`;
      const portada = S.sobre(d, { portada: true, carta, forro: FORRO, sello: e(ini).replace('&amp;', '<i>&amp;</i>'), textoPara: '', pista: 'Toca el sello para abrir' })
        .replace('<p class="sobre-para">', `<div class="portada-txt"><p class="eyebrow">${e(d.introPortada)}</p><h1 class="nombres-v">${e(d.novia)} <i>&amp;</i> ${e(d.novio)}</h1></div><p class="sobre-para">`)
        .replace('<div class="sobre-frente"></div>', `<div class="sobre-frente"><span class="sobre-fecha">${f.dia}.${f.mesNum}.${f.anio}</span><span class="sobre-para-quien">Para: <b data-invitado-nombre>ti</b></span></div>`)
        .replace('<div class="sobre-atras"></div>', `${ramo('r-sobre-der')}${ramo('r-sobre-izq')}<div class="sobre-atras"></div>`);

      // ---------- Secciones ----------
      const padres = (S.hay(d.padresNovia) || S.hay(d.padresNovio)) && !oc.familia ? `
        <section id="familia" class="v-sec">
          ${marco(`<p class="eyebrow">${e(String(d.tituloFamilia).split(' y de ')[0])}</p><h2 class="v-tit">Nuestros padres</h2>
            <div class="padres-v">${[d.padresNovia, d.padresNovio].filter(S.hay).map(t => `<p>${lineas(t).map(e).join('<br>')}</p>`).join('<span class="sep-v">✦</span>')}</div>
            ${S.hay(d.textoFamilia) ? `<p class="lead-v">${S.br(d.textoFamilia)}</p>` : ''}`, 'rv')}
        </section>` : '';

      const cuenta = !oc.cuenta ? `
        <section id="cuenta" class="v-sec">
          <div class="olivo-card cuenta-card rv">${cera(ini, 'arriba')}
            <h2 class="v-tit claro">Cuenta regresiva</h2><p class="eyebrow claro">Para el gran día</p>
            ${S.reloj(true)}
            <a class="mini claro" target="_blank" rel="noopener" href="${e(S.enlaceCalendario(d))}">Agendar en calendario</a>
          </div>
        </section>` : '';

      const pad = (d.padrinos || []).filter(p => S.hay(p.nombres));
      const padrinos = pad.length && !oc.familia ? `
        <section id="padrinos" class="v-sec collage">
          ${marco(`<h2 class="v-tit">Padrinos</h2>${pad.map(p => `<h3>${e(p.rol)}</h3><p>${S.br(p.nombres)}</p>`).join('')}`, 'padrinos-card rv')}
          ${foto(1, 'f-incl1 rv')}${foto(2, 'f-incl2 rv')}
        </section>` : '';

      const it = (d.itinerario || []).filter(x => S.hay(x.evento));
      const itinerario = it.length && !oc.itinerario ? `
        <section id="itinerario" class="v-sec">
          ${ramo('r-itin')}
          <div class="capsula rv"><h2 class="v-tit claro">Itinerario</h2>
            ${it.map(x => `<div class="paso-v"><span class="ico">${S.ICONOS[x.icono] || S.ICONOS.corazon}</span><small>${e(x.hora)}</small><b>${e(x.evento)}</b>${S.hay(x.detalle) ? `<em>${e(x.detalle)}</em>` : ''}</div>`).join('')}
          </div>
        </section>` : '';

      const ls = (d.lugares || []).filter(l => S.hay(l.nombre));
      const ubicacion = ls.length && !oc.ubicacion ? `
        <section id="ubicacion" class="v-sec">
          <div class="olivo-card ubic-card rv"><div class="ovalo">
            ${ls.map(l => `<div class="lugar-v"><h3>${e(l.tipo)}</h3>${S.hay(l.hora) ? `<small>${e(l.hora)} hrs</small>` : ''}
              <span class="ico-l">${S.ICONOS[l.icono] || S.ICONOS.hacienda}</span>
              <p>${e(l.nombre)}</p>${btnMini(S.enlaceMapa(l), 'Ver ubicación')}</div>`).join('')}
          </div></div>
        </section>` : '';

      const r = d.rsvp || {};
      const rsvp = !oc.rsvp ? `
        <section id="rsvp" class="v-sec">
          <div class="sobre-rsvp rv">
            <div class="sr-solapa"></div>
            <p class="sr-click">Click aquí</p><h2 class="sr-tit">Rsvp</h2>
            <button class="etiqueta" type="button" data-desplegar="caja-rsvp" aria-expanded="false">
              <strong data-invitado-nombre>Querido invitado</strong>
              <span>No. de pases <b data-pases>${e(r.pases || 2)}</b></span>
            </button>
          </div>
          <div id="caja-rsvp" class="caja-form" hidden>${marco(`${S.hay(r.texto) ? `<p class="lead-v">${S.br(r.texto)}</p>` : ''}${S.formRsvp(d)}`)}</div>
        </section>` : '';

      const h = d.historia || {};
      const historia = (S.hay(h.texto) || lista.length) && !oc.historia ? `
        <section id="historia" class="v-sec">
          <h2 class="v-tit rv">${e(h.titulo || 'Nuestra historia')}</h2>
          <div class="volteo rv" data-voltear tabindex="0" role="button" aria-label="Voltear tarjeta">
            <div class="cara frente"><div class="encaje">${foto(0, 'sin-zoom')}<p class="toca">Toca para leer</p></div>${ramo('r-hist')}</div>
            <div class="cara atras"><div class="encaje"><div class="historia-txt"><p class="eyebrow">Nuestra historia</p><p>${S.br(h.texto || '')}</p><p class="toca">Toca para volver</p></div></div></div>
          </div>
        </section>` : '';

      const v = d.vestimenta || {};
      const vestimenta = S.hay(v.tipo) && !oc.vestimenta ? `
        <section id="vestimenta" class="v-sec">
          <div class="placa rv"><h2>Código de vestimenta</h2><p class="eyebrow claro">${e(v.tipo)}</p>
            ${S.hay(v.texto) ? `<p class="placa-txt">${S.br(v.texto)}</p>` : ''}
            ${(v.colores || []).length ? `<div class="paleta">${v.colores.map(c => `<span style="background:${e(c)}"></span>`).join('')}</div>` : ''}
            ${S.hay(v.nota) ? `<p class="placa-nota">${e(v.nota)}</p>` : ''}</div>
        </section>` : '';

      const rg = d.regalos || {}, ops = (rg.opciones || []).filter(x => S.hay(x.nombre)), clabe = String(rg.clabe || '').replace(/\s/g, '');
      const regalos = (ops.length || clabe) && !oc.regalos ? `
        <section id="regalos" class="v-sec">
          ${marco(`<h2 class="v-tit">Mesa de regalos</h2>${S.hay(rg.texto) ? `<p class="lead-v">${e(rg.texto)}</p>` : ''}
            <div class="tiendas">${ops.map(x => `<div><h3>${e(x.nombre)}</h3><p>${e(x.detalle || '')}</p>${S.hay(x.enlace) ? btnMini(x.enlace, 'Ir a la mesa') : ''}</div>`).join('')}</div>
            ${clabe ? `<div class="banco-v"><h3>${e(rg.banco || 'Transferencia')}</h3>${S.hay(rg.titular) ? `<p>${e(rg.titular)}</p>` : ''}<p>CLABE: ${e(clabe.replace(/(\d{4})(?=\d)/g, '$1 '))}</p><button class="mini" data-copiar="${e(clabe)}">Copiar CLABE</button></div>` : ''}`, 'rv')}
        </section>` : '';

      const galeria = lista.length || (h.fotos || []).length ? `
        <section id="galeria" class="v-sec">
          <h2 class="v-tit rv">Galería <small>de fotos</small></h2>
          <div class="galeria-v">${[0, 1, 2, 3, 4].map(i => foto(i + 1, 'g' + i + ' rv')).join('')}</div>
          <p class="mono rv">${e(ini)}</p>
        </section>` : '';

      const hs = (d.hospedaje || []).filter(x => S.hay(x.nombre));
      const hospedaje = hs.length && !oc.hospedaje ? `
        <section id="hospedaje" class="v-sec">
          ${marco(`<h2 class="v-tit">Hospedaje</h2>${hs.map(x => `<div class="hotel-v"><h3>${e(x.nombre)}</h3>${S.hay(x.nota) ? `<small>${e(x.nota)}</small>` : ''}<p>${S.br(x.direccion || '')}</p>${btnMini(S.enlaceMapa(x), 'Ver ubicación')}</div>`).join('')}`, 'rv')}
        </section>` : '';

      const conWhats = S.hay(r.whatsapp);
      const extrasCollage = conWhats && (!oc.deseos || !oc.canciones) ? `
        <section id="deseos" class="v-sec collage dos">
          ${!oc.deseos ? `<div class="olivo-card mini-card rv"><h2 class="v-tit claro">Buenos deseos</h2><button class="mini claro" data-desplegar="caja-deseos">Escribir mis deseos</button></div>` : ''}
          ${foto(3, 'f-incl3 rv')}
          ${!oc.canciones ? `<div class="vino-card mini-card rv" id="canciones"><h2 class="v-tit claro">Sugerencia <small>de canciones</small></h2><button class="mini claro" data-desplegar="caja-canciones">Sugerir canción</button></div>` : ''}
          ${ramo('r-deseos')}
        </section>
        <div id="caja-deseos" class="caja-form" hidden>${marco(`<h3 class="v-sub">Tus buenos deseos</h3>${S.formWhats(d, 'deseo', { boton: 'Enviar por WhatsApp' })}`)}</div>
        <div id="caja-canciones" class="caja-form" hidden>${marco(`<h3 class="v-sub">¿Qué canción no puede faltar?</h3>${S.formWhats(d, 'cancion', { boton: 'Enviar por WhatsApp' })}`)}</div>` : '';

      const c = d.contactos || {};
      const wa = (n) => 'https://wa.me/' + String(n).replace(/\D/g, '');
      const contactos = (S.hay(c.novia) || S.hay(c.novio)) && !oc.contactos ? `
        <section id="contactos" class="v-sec">
          ${alcatrazSuelto('rv')}
          ${marco(`<h2 class="v-tit">Contactos</h2><div class="cont-v">${S.hay(c.novio) ? `<div><h3>Novio</h3>${btnMini(wa(c.novio), 'Click aquí')}</div>` : ''}${S.hay(c.novia) ? `<div><h3>Novia</h3>${btnMini(wa(c.novia), 'Click aquí')}</div>` : ''}</div>`, 'rv')}
        </section>` : '';

      const cierre = `
        <section id="cierre" class="v-cierre">
          ${foto(0, 'fondo-cierre sin-zoom')}
          <div class="encaje cierre-encaje rv">${ramo('r-cierre')}<div class="cierre-txt">
            ${S.hay(d.hashtag) ? `<p class="hash">${e(d.hashtag)}</p>` : ''}
            <p class="eyebrow">Con amor</p><p class="nombres-cierre">${e(d.novia)}<i>&amp;</i>${e(d.novio)}</p>
            ${S.hay(d.nota) ? `<p class="nota-v">${S.br(d.nota)}</p>` : ''}</div></div>
        </section>
        <footer class="pie-v">${e(d.despedida)} · ${f.corta}</footer>`;

      const menu = [['sobre', 'Inicio'], ['rsvp', rsvp && 'Confirmar asistencia'], ['itinerario', itinerario && 'Itinerario'], ['ubicacion', ubicacion && 'Ubicaciones'], ['historia', historia && 'Nuestra historia'], ['regalos', regalos && 'Mesa de regalos'], ['vestimenta', vestimenta && 'Código de vestimenta'], ['deseos', extrasCollage && 'Buenos deseos'], ['galeria', galeria && 'Galería'], ['hospedaje', hospedaje && 'Hospedaje'], ['contactos', contactos && 'Contactos']].filter(x => x[1]);

      return `
<button class="menu-btn" data-menu aria-label="Menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<nav class="menu" aria-label="Secciones"><button class="menu-btn menu-cerrar" data-menu aria-label="Cerrar">✕</button>${menu.map(([id, t]) => `<a href="#${id}">${e(t)}</a>`).join('')}</nav>
<button class="arriba-btn" data-arriba aria-label="Volver arriba"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<main>
  ${portada}
  ${padres}${cuenta}${padrinos}${itinerario}${ubicacion}
  <div class="tira rv">${foto(2, '')}</div>
  ${rsvp}${historia}${vestimenta}${regalos}${galeria}${extrasCollage}${hospedaje}${contactos}
  ${cierre}
</main>`;
    },

    css: `
body.plantilla-vino{--fondo:#f4efe8;--fondo2:#ece4d8;--tinta:#5a2230;--suave:#8a6a66;--acento:#9c9b5f;--acento2:#7e2638;--linea:#d9cfc2;--oscuro:#4f1220;--sobre-oscuro:#f7efe6;--titulo:#7e2638;--tarjeta:#f8f4ee;--radio-btn:2px;
  --f-titulo:'Gilda Display',Georgia,serif;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Cormorant Garamond',Georgia,serif;
  --sobre-c1:#7a2335;--sobre-c2:#8c2c40;--sobre-c3:#93324a;--sello:radial-gradient(circle at 35% 30%,#c9c78e,#a3a165 55%,#7c7a43);--sello-texto:#4f4e25;--sello-borde:#8e8c52}
.plantilla-vino{font-size:19px;background-color:#f4efe8;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .45 0 0 0 0 .4 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.plantilla-vino main{overflow:hidden}
.plantilla-vino .eyebrow{font-family:var(--f-texto);font-weight:500;font-size:13px;letter-spacing:.32em;color:var(--acento)}
.plantilla-vino .claro{color:#f7efe6!important}
.plantilla-vino .v-sec{position:relative;padding:56px 20px;max-width:560px;margin:0 auto;text-align:center}
.plantilla-vino .v-tit{font-family:var(--f-titulo);font-weight:400;font-size:clamp(34px,9vw,46px);line-height:1.1;color:var(--titulo);margin-bottom:10px}
.plantilla-vino .v-tit small{display:block;font-size:.55em}
.plantilla-vino .v-sub{font-family:var(--f-titulo);font-weight:400;font-size:28px;color:var(--titulo);margin-bottom:6px}
.plantilla-vino .lead-v{font-style:italic;color:var(--suave);margin-top:12px;line-height:1.5}
.plantilla-vino .mini{display:inline-block;margin-top:12px;padding:4px 14px;border:1px solid currentColor;outline:1px solid currentColor;outline-offset:2px;background:none;font-family:var(--f-texto);font-size:13px;letter-spacing:.12em;color:var(--titulo);text-decoration:none;cursor:pointer}
.plantilla-vino .mini:hover{background:rgba(126,38,56,.08)}

/* Sobre como portada */
.plantilla-vino .sobre-pantalla.en-portada{justify-content:center;padding:60px 16px 70px;gap:22px}
.plantilla-vino .en-portada.abierto .sobre{margin-top:110px}
.plantilla-vino .portada-txt{text-align:center;transition:opacity .6s ease,transform .8s ease;z-index:3}
.plantilla-vino .nombres-v{font-family:var(--f-titulo);font-weight:400;font-size:clamp(46px,13vw,76px);line-height:1.05;color:var(--acento);margin-top:6px}
.plantilla-vino .nombres-v i,.plantilla-vino .carta-nombres i,.plantilla-vino .nombres-cierre i{font-style:normal;font-size:.62em;margin:0 .1em}
.plantilla-vino .sobre-para{display:none}
.plantilla-vino .abierto .portada-txt{opacity:0;transform:translateY(-30px)}
.plantilla-vino .sobre{width:min(360px,88vw);margin-top:20px;transition:margin-top 1.1s cubic-bezier(.5,0,.2,1) .4s}
.plantilla-vino .sobre-atras{background:linear-gradient(160deg,#8a2b3f,#6a1a2b);box-shadow:0 30px 40px -14px rgba(60,10,20,.45),0 4px 12px rgba(60,10,20,.15)}
.plantilla-vino .sobre-frente::after{background:linear-gradient(180deg,#962f47,#7e2638)}
.plantilla-vino .solapa-fuera{background:linear-gradient(180deg,#86283c,#a03a52)}
.plantilla-vino .sobre-frente{overflow:visible}
.plantilla-vino .sobre-fecha{position:absolute;left:50%;bottom:16%;transform:translateX(-50%);z-index:2;font-family:var(--f-texto);font-size:17px;letter-spacing:.25em;color:#f3e6dc;opacity:0;transition:opacity .8s ease 2.2s;white-space:nowrap}
.plantilla-vino .abierto .sobre-fecha{opacity:1}
.plantilla-vino .sobre-para-quien{position:absolute;right:8%;bottom:5%;z-index:2;font-family:'Pinyon Script',cursive;font-size:17px;color:#f1dfd4;opacity:.9;transition:opacity .4s}
.plantilla-vino .sobre-para-quien b{font-weight:400;font-size:1.15em}
.plantilla-vino .abierto .sobre-para-quien{opacity:0}
.plantilla-vino .sobre-carta{background:none;box-shadow:none;outline:none;display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:start;padding:0;left:4%;right:4%;top:4%}
.plantilla-vino .carta-foto{background:#fff;padding:6px 6px 22px;box-shadow:0 6px 16px rgba(0,0,0,.2);transform:rotate(-4deg);aspect-ratio:4/4.6;overflow:hidden}
.plantilla-vino .carta-foto img,.plantilla-vino .carta-foto svg{width:100%;height:100%;object-fit:cover;display:block;background:linear-gradient(160deg,#5b4a3e,#2f3a2a)}
.plantilla-vino .carta-nombres{background:#f8f4ee;border:1px solid #c9b2b2;outline:1px solid #c9b2b2;outline-offset:-6px;border-radius:46% 46% 8px 8px/22% 22% 8px 8px;padding:22px 8px 30px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--f-titulo);color:var(--acento);font-size:clamp(26px,8vw,34px);line-height:1.1;box-shadow:0 6px 16px rgba(0,0,0,.15);min-height:100%}
.plantilla-vino .abierto .sobre-carta{animation:cartaVino 1.3s cubic-bezier(.3,.7,.25,1) 1.15s forwards}
@keyframes cartaVino{0%{transform:none;opacity:1}100%{transform:translateY(-58%);opacity:1}}
.plantilla-vino .sello{width:70px;height:70px;margin:-35px 0 0 -35px;font-family:var(--f-titulo);font-size:22px}
.plantilla-vino .mitad{box-shadow:inset 0 0 0 6px rgba(255,255,255,.12),inset 0 0 0 9px rgba(0,0,0,.12),inset 0 0 0 10px rgba(255,255,255,.15)}
.plantilla-vino .sobre-pista{font-family:var(--f-texto);font-size:15px;letter-spacing:.3em;color:var(--acento);margin-top:40px}
.plantilla-vino .ramo{position:absolute;width:130px;z-index:7;pointer-events:none}
.plantilla-vino .r-sobre-der{right:-36px;top:18%;width:105px;transform:rotate(18deg)}
.plantilla-vino .r-sobre-izq{left:-38px;bottom:-60px;transform:rotate(-30deg) scaleX(-1);width:100px}

/* Tarjeta troquelada (marfil con esquinas ornamentadas) */
.plantilla-vino .troquel{position:relative;background:#f8f5f0;padding:16px;border-radius:26px;box-shadow:0 14px 30px rgba(80,40,30,.12),0 2px 4px rgba(80,40,30,.08);color:#a49a8c;text-align:center}
.plantilla-vino .tq-in{border:1px solid #d6cdc1;outline:1px solid #e3dbd0;outline-offset:4px;border-radius:16px;padding:34px 22px;color:var(--tinta)}
.plantilla-vino .tq{position:absolute;width:34px;height:34px;color:#b7ab9b;background:#f8f5f0;z-index:1}
.plantilla-vino .tq1{top:8px;left:8px}.plantilla-vino .tq2{top:8px;right:8px;transform:scaleX(-1)}.plantilla-vino .tq3{bottom:8px;left:8px;transform:scaleY(-1)}.plantilla-vino .tq4{bottom:8px;right:8px;transform:scale(-1)}
.plantilla-vino .troquel h3{font-family:var(--f-texto);font-weight:600;font-size:15px;letter-spacing:.22em;text-transform:uppercase;color:var(--titulo);margin-top:16px}
.plantilla-vino .padres-v{display:flex;flex-direction:column;gap:6px;margin-top:10px;font-size:20px}
.plantilla-vino .sep-v{color:var(--acento);font-size:12px}

/* Tarjeta olivo con relieve */
.plantilla-vino .olivo-card,.plantilla-vino .vino-card{position:relative;padding:44px 24px 34px;border-radius:4px;box-shadow:0 18px 34px rgba(60,50,20,.25);color:#f7efe6;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23fff' stroke-opacity='.13'%3E%3Cpath d='M30 4c8 10 8 18 0 26-8-8-8-16 0-26zM30 56c8-10 8-18 0-26-8 8-8 16 0 26zM4 30c10-8 18-8 26 0-8 8-16 8-26 0zM56 30c-10-8-18-8-26 0 8 8 16 8 26 0z'/%3E%3C/g%3E%3C/svg%3E"),linear-gradient(160deg,#a9a86c,#8b8a50)}
.plantilla-vino .vino-card{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23fff' stroke-opacity='.1'%3E%3Cpath d='M30 4c8 10 8 18 0 26-8-8-8-16 0-26zM30 56c8-10 8-18 0-26-8 8-8 16 0 26z'/%3E%3C/g%3E%3C/svg%3E"),linear-gradient(160deg,#8f3046,#6b1c2c);box-shadow:0 18px 34px rgba(70,10,25,.3)}
.plantilla-vino .olivo-card::before,.plantilla-vino .vino-card::before{content:"";position:absolute;inset:10px;border:1px solid rgba(255,255,255,.35);pointer-events:none}
.plantilla-vino .cuenta-card{max-width:400px;margin:0 auto}
.plantilla-vino .cera{position:absolute;left:50%;top:-30px;transform:translateX(-50%);width:62px;height:62px;border-radius:47% 53% 50% 50%/52% 48% 52% 48%;background:radial-gradient(circle at 35% 30%,#a8455a,#7e2638 55%,#5a1626);box-shadow:0 4px 10px rgba(0,0,0,.3),inset 0 0 0 5px rgba(255,255,255,.08),inset 0 0 0 7px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-family:var(--f-titulo);font-size:17px;color:#f0d9cf;white-space:nowrap;z-index:2}
.plantilla-vino .reloj{margin:18px 0 6px;color:#fff}
.plantilla-vino .reloj span{font-family:var(--f-titulo);font-size:clamp(34px,9vw,44px)}
.plantilla-vino .reloj small,.plantilla-vino .reloj b{color:#f1ead8}

/* Collage con fotos encimadas */
.plantilla-vino .vf{position:relative;overflow:hidden;background:linear-gradient(160deg,#5b4a3e,#2f3a2a);margin:0;box-shadow:0 10px 24px rgba(0,0,0,.2);cursor:zoom-in}
.plantilla-vino .vf img{width:100%;height:100%;object-fit:cover}
.plantilla-vino .vf.hueco{cursor:default}
.plantilla-vino .vf.hueco svg{width:100%;height:100%;display:block}
.plantilla-vino .sin-zoom{cursor:default}
.plantilla-vino .collage{display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:auto auto;gap:14px;align-items:center}
.plantilla-vino .padrinos-card{grid-row:1/3}
.plantilla-vino .padrinos-card .tq-in{padding:40px 14px}
.plantilla-vino .padrinos-card p{font-size:18px}
.plantilla-vino .f-incl1{aspect-ratio:3/4;transform:rotate(3deg);border:5px solid #fff}
.plantilla-vino .f-incl2{aspect-ratio:4/3.4;transform:rotate(-3deg) translateX(-10px);border:5px solid #fff}

/* Itinerario: cápsula vino */
.plantilla-vino #itinerario{padding-top:80px}
.plantilla-vino .capsula{position:relative;max-width:330px;margin:0 auto;padding:70px 26px 80px;border-radius:200px;color:#f7efe6;background:linear-gradient(180deg,#8f3046,#6b1c2c);box-shadow:0 20px 40px rgba(70,10,25,.3)}
.plantilla-vino .capsula::before{content:"";position:absolute;inset:10px;border:1px solid rgba(255,255,255,.3);border-radius:200px;pointer-events:none}
.plantilla-vino .paso-v{display:grid;grid-template-columns:44px 1fr;grid-template-rows:auto auto;column-gap:12px;text-align:left;align-items:center;margin:18px 0 0 10px}
.plantilla-vino .paso-v .ico{grid-row:1/4;width:36px;height:36px;color:#f1dcd0;opacity:.9}
.plantilla-vino .paso-v .ico svg{width:100%;height:100%;stroke-width:1}
.plantilla-vino .paso-v small{font-size:12px;letter-spacing:.25em;color:#e7c9c0}
.plantilla-vino .paso-v b{font-family:var(--f-titulo);font-weight:400;font-size:22px;line-height:1.1}
.plantilla-vino .paso-v em{font-size:14px;color:#e7c9c0}
.plantilla-vino .r-itin{left:-6px;top:20px;width:140px}

/* Ubicaciones: óvalo marfil sobre tarjeta olivo */
.plantilla-vino .ubic-card{padding:30px 22px}
.plantilla-vino .ovalo{background:#f8f4ee;border-radius:50%;padding:70px 26px;border:2px solid #f8f4ee;outline:1px solid #8a2b3f;outline-offset:-10px;color:var(--titulo);display:flex;flex-direction:column;gap:26px;box-shadow:0 6px 18px rgba(0,0,0,.18)}
.plantilla-vino .lugar-v h3{font-family:var(--f-titulo);font-weight:400;font-size:26px}
.plantilla-vino .lugar-v small{font-size:13px;letter-spacing:.22em;color:var(--acento)}
.plantilla-vino .ico-l{display:block;width:56px;height:56px;margin:8px auto 4px;color:#9b5f68}
.plantilla-vino .ico-l svg{width:100%;height:100%;stroke-width:.8}
.plantilla-vino .lugar-v p{font-size:17px}
.plantilla-vino .lugar-v .mini{margin-top:6px;font-size:12px}

.plantilla-vino .tira{margin:20px 0;height:min(110vw,560px)}
.plantilla-vino .tira .vf{width:100%;height:100%;box-shadow:none}

/* RSVP: sobre vino con etiqueta */
.plantilla-vino .sobre-rsvp{position:relative;max-width:360px;margin:0 auto;aspect-ratio:1.45;background:linear-gradient(180deg,#8f3046,#73202f);border-radius:3px;box-shadow:0 20px 34px rgba(70,10,25,.3);color:#f7efe6;padding-top:22px}
.plantilla-vino .sr-solapa{position:absolute;left:0;right:0;top:0;height:58%;background:linear-gradient(180deg,#9a3a50,#842a3e);clip-path:polygon(0 0,100% 0,50% 100%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.2))}
.plantilla-vino .sr-click,.plantilla-vino .sr-tit{position:relative;z-index:1}
.plantilla-vino .sr-click{font-size:12px;letter-spacing:.3em;text-transform:uppercase}
.plantilla-vino .sr-tit{font-family:var(--f-titulo);font-weight:400;font-size:38px;line-height:1}
.plantilla-vino .etiqueta{position:absolute;left:50%;bottom:-14%;transform:translateX(-50%);width:68%;padding:20px 10px 16px;background:#f8f5f0;border:1px solid #d6cdc1;outline:1px solid #d6cdc1;outline-offset:-7px;border-radius:6px;box-shadow:0 8px 18px rgba(0,0,0,.18);cursor:pointer;color:var(--titulo);font:inherit;transition:transform .3s}
.plantilla-vino .etiqueta:hover{transform:translateX(-50%) translateY(-4px)}
.plantilla-vino .etiqueta strong{display:block;font-family:var(--f-titulo);font-weight:400;font-size:24px;line-height:1.2}
.plantilla-vino .etiqueta span{display:block;font-size:12px;letter-spacing:.25em;text-transform:uppercase;margin-top:6px}
.plantilla-vino .caja-form{max-width:520px;margin:60px auto 10px;padding:0 20px}
.plantilla-vino #rsvp .caja-form{margin-top:80px;padding:0}
.plantilla-vino #form-rsvp label{color:var(--suave)}
.plantilla-vino #form-rsvp .btn,.plantilla-vino .form-whats .btn{background:#7e2638;border-color:#7e2638;color:#f7efe6;border-radius:2px}

/* Historia: foto con encaje que se voltea */
.plantilla-vino .encaje{position:relative;padding:18px;background-color:#fff;background-image:radial-gradient(circle,#e7e1d9 1.2px,transparent 1.6px);background-size:7px 7px;
  -webkit-mask:radial-gradient(circle 8px at 8px 8px,#000 96%,#0000) 0 0/16px 16px,linear-gradient(#000 0 0) 7px 7px/calc(100% - 14px) calc(100% - 14px) no-repeat;
  mask:radial-gradient(circle 8px at 8px 8px,#000 96%,#0000) 0 0/16px 16px,linear-gradient(#000 0 0) 7px 7px/calc(100% - 14px) calc(100% - 14px) no-repeat;filter:drop-shadow(0 8px 14px rgba(0,0,0,.15))}
.plantilla-vino .volteo{position:relative;max-width:360px;margin:18px auto 0;aspect-ratio:3/4.1;perspective:1200px;cursor:pointer;background:#8a2b3f;padding:16px;box-shadow:0 20px 34px rgba(70,10,25,.3)}
.plantilla-vino .cara{position:absolute;inset:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .9s cubic-bezier(.4,.2,.2,1)}
.plantilla-vino .cara .encaje{height:100%;display:flex;flex-direction:column}
.plantilla-vino .cara .vf{flex:1;box-shadow:none}
.plantilla-vino .atras{transform:rotateY(180deg)}
.plantilla-vino .volteada .frente{transform:rotateY(-180deg)}
.plantilla-vino .volteada .atras{transform:rotateY(0)}
.plantilla-vino .toca{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--titulo);padding-top:10px}
.plantilla-vino .historia-txt{flex:1;background:#fbf8f3;display:flex;flex-direction:column;justify-content:center;padding:24px;font-size:20px;line-height:1.5;font-style:italic;color:var(--tinta)}
.plantilla-vino .r-hist{right:-40px;bottom:-60px;width:120px}

/* Vestimenta: placa ovalada */
.plantilla-vino .placa{max-width:300px;margin:0 auto;padding:60px 28px;border-radius:50%;background:radial-gradient(ellipse at 40% 30%,#c47a8a,#a2546a 60%,#8d4258);color:#f7efe6;box-shadow:0 16px 30px rgba(90,20,40,.3),inset 0 0 0 8px rgba(255,255,255,.08)}
.plantilla-vino .placa h2{font-family:var(--f-titulo);font-weight:400;font-size:28px;line-height:1.15}
.plantilla-vino .placa-txt{font-size:15px;letter-spacing:.06em;margin-top:8px}
.plantilla-vino .placa-nota{font-size:13px;font-style:italic;margin-top:8px;opacity:.85}
.plantilla-vino .paleta{margin-top:12px}
.plantilla-vino .paleta span{width:24px;height:24px;border-color:#f3dde0}

/* Regalos */
.plantilla-vino .tiendas{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px 16px}
.plantilla-vino .tiendas p,.plantilla-vino .banco-v p{font-size:16px;color:var(--suave)}
.plantilla-vino .banco-v{margin-top:14px;padding-top:12px;border-top:1px solid var(--linea)}

/* Galería */
.plantilla-vino .galeria-v{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
.plantilla-vino .galeria-v .vf{aspect-ratio:3/4;border:5px solid #fff}
.plantilla-vino .galeria-v .g0{grid-column:1/3;aspect-ratio:4/3}
.plantilla-vino .galeria-v .g1{transform:rotate(-2deg)}.plantilla-vino .galeria-v .g2{transform:rotate(2deg) translateY(16px)}
.plantilla-vino .galeria-v .g3{transform:rotate(1.5deg)}.plantilla-vino .galeria-v .g4{transform:rotate(-2deg) translateY(16px);filter:grayscale(1)}
.plantilla-vino .mono{font-family:var(--f-titulo);font-size:30px;color:var(--titulo);margin-top:30px;letter-spacing:.1em}

/* Buenos deseos y canciones */
.plantilla-vino .collage.dos{grid-template-columns:1fr 1fr;padding-top:30px}
.plantilla-vino .mini-card{padding:34px 16px 26px}
.plantilla-vino .mini-card .v-tit{font-size:28px}
.plantilla-vino .collage.dos .olivo-card{transform:rotate(-2deg)}
.plantilla-vino .collage.dos .vino-card{grid-column:1/2;transform:rotate(1.5deg) translateY(-10px)}
.plantilla-vino .f-incl3{aspect-ratio:3/4;transform:rotate(3deg);border:5px solid #fff;grid-row:1/3;grid-column:2}
.plantilla-vino .r-deseos{right:-30px;top:-40px;width:110px}

/* Hospedaje y contactos */
.plantilla-vino .hotel-v{margin-top:14px}
.plantilla-vino .hotel-v small{font-size:13px;letter-spacing:.12em;color:var(--acento)}
.plantilla-vino .hotel-v p{font-size:15px;color:var(--suave)}
.plantilla-vino .alc{width:220px;margin:0 auto 10px}
.plantilla-vino .cont-v{display:flex;justify-content:center;gap:34px}

/* Cierre con encaje sobre foto */
.plantilla-vino .v-cierre{position:relative;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:60px 20px;margin-top:40px}
.plantilla-vino .fondo-cierre{position:absolute;inset:0;box-shadow:none}
.plantilla-vino .cierre-encaje{width:min(330px,86vw);aspect-ratio:3/3.6}
.plantilla-vino .cierre-txt{height:100%;background:#fbf8f3;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center}
.plantilla-vino .nombres-cierre{font-family:var(--f-titulo);font-size:40px;line-height:1.15;color:var(--titulo);display:flex;flex-direction:column}
.plantilla-vino .hash{font-size:14px;letter-spacing:.15em;color:var(--acento);margin-bottom:12px}
.plantilla-vino .nota-v{font-size:14px;font-style:italic;color:var(--suave);margin-top:12px}
.plantilla-vino .r-cierre{right:-20px;top:-40px;width:120px;z-index:3}
.plantilla-vino .cierre-encaje{overflow:visible}
.plantilla-vino .pie-v{background:#7e2638;color:#f3e3dc;text-align:center;padding:14px;font-size:14px;letter-spacing:.08em}

/* Botones flotantes */
.plantilla-vino .menu-btn{background:#c4949a;color:#fff;width:40px;height:40px}
.plantilla-vino .arriba-btn{background:#c4949a;color:#fff;width:40px;height:40px}
.plantilla-vino .btn-musica{background:#2b1a1e;color:#e8b9c1;border:none}
.plantilla-vino .menu{background:#f4efe8}
.plantilla-vino .menu a{font-family:var(--f-titulo);letter-spacing:.12em;font-size:19px}

@media (min-width:700px){
  .plantilla-vino .v-sec{padding:70px 20px}
  .plantilla-vino .ramo{width:170px}
}`
  });
})();
