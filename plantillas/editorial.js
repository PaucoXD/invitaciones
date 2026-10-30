/* Plantillas "Editorial": invitación de fotos con papel texturizado, bordes rasgados, monograma,
   calendario del mes, reproductor de música e iconos de línea fina. Un solo diseño con 4 estilos
   (sobre, acuarela, esmeralda y artesanal) y 7 paletas; cada combinación se registra como un diseño. */
(function () {
  // ---------------- Utilidades de dibujo ----------------
  const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  // Números pseudoaleatorios con semilla: los bordes rasgados salen iguales en cada carga
  const azar = (s) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;

  /** Máscara de papel rasgado (arriba, abajo o ambos). Se estira al tamaño del elemento. */
  function rasgado(arriba, abajo, semilla) {
    const r = azar(semilla), pts = (y0, sentido) => {
      const p = [];
      for (let x = 0; x <= 400; x += 2.5) p.push(`${x} ${(y0 + sentido * (0.4 + r() * 1.3 + Math.sin(x / 9) * .5 + Math.sin(x / 31) * .6)).toFixed(2)}`);
      return p;
    };
    const top = arriba ? pts(0, 1) : ['0 0', '400 0'];
    const bot = abajo ? pts(100, -1).reverse() : ['400 100', '0 100'];
    return url(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" preserveAspectRatio="none"><path d="M${top.join(' L')} L${bot.join(' L')} Z"/></svg>`);
  }
  const RASGADOS = { ambos: rasgado(true, true, 7), abajo: rasgado(false, true, 11), arriba: rasgado(true, false, 23) };

  // Textura de papel (fibras finas)
  const PAPEL = url(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .35  0 0 0 .22 0"/></filter><rect width="260" height="260" filter="url(#p)"/></svg>`);
  const PAPEL_ALGODON = url(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".035 .05" numOctaves="5" seed="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .4  0 0 0 0 .38  0 0 0 .28 -.08"/></filter><rect width="300" height="300" filter="url(#p)"/></svg>`);

  // ---------------- Flores en acuarela (SVG) ----------------
  const ACU = `<defs><filter id="acu" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="5" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="4"/></filter></defs>`;
  const hoja = (x, y, l, w, rot, c, op = .85) => `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0C${l * .3} -${w} ${l * .75} -${w} ${l} 0C${l * .75} ${w} ${l * .3} ${w} 0 0Z" fill="${c}" opacity="${op}"/>`;
  const tallo = (d, c, w = 1.4) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  function rosa(x, y, r, c, osc, claro) {
    let s = `<g transform="translate(${x} ${y})">`;
    for (let i = 0; i < 7; i++) s += `<ellipse cx="0" cy="${-r * .52}" rx="${r * .58}" ry="${r * .5}" transform="rotate(${i * 51.4})" fill="${c}" opacity=".9"/>`;
    for (let i = 0; i < 5; i++) s += `<ellipse cx="0" cy="${-r * .3}" rx="${r * .4}" ry="${r * .32}" transform="rotate(${i * 72 + 20})" fill="${claro}" opacity=".55"/>`;
    s += `<circle r="${r * .34}" fill="${osc}" opacity=".55"/><path d="M${-r * .2} 0a${r * .2} ${r * .2} 0 1 1 ${r * .3} ${r * .12}a${r * .12} ${r * .12} 0 1 1 ${-r * .14} ${-r * .14}" stroke="${osc}" stroke-width="${Math.max(1, r * .07)}" fill="none" opacity=".8"/></g>`;
    return s;
  }
  const flor5 = (x, y, r, c, centro) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="${-r * .55}" rx="${r * .42}" ry="${r * .55}" transform="rotate(${a})" fill="${c}" opacity=".88"/>`).join('')}<circle r="${r * .25}" fill="${centro}"/></g>`;
  const gypso = (x, y, sem) => { const r = azar(sem); let s = ''; for (let i = 0; i < 22; i++) { const a = r() * 6.28, d = 6 + r() * 26, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * .7; s += tallo(`M${x} ${y + 34}Q${(x + px) / 2} ${py + 14} ${px} ${py}`, '#9aa38a', .6) + `<circle cx="${px}" cy="${py}" r="${1.6 + r() * 1.4}" fill="#fff" stroke="#d9d6cc" stroke-width=".5"/>`; } return s; };
  const eucalipto = (x, y, l, rot, c) => { let s = `<g transform="translate(${x} ${y}) rotate(${rot})">` + tallo(`M0 0Q${l * .5} -8 ${l} 0`, c, 1.2); for (let i = 1; i < 8; i++) { const t = i / 8, px = l * t, py = -8 * 4 * t * (1 - t) * .5; s += `<circle cx="${px}" cy="${py + (i % 2 ? -7 : 7)}" r="${6.5 - t * 2.5}" fill="${c}" opacity="${.55 + (i % 3) * .12}"/>`; } return s + '</g>'; };
  const pampa = (x, y, l, rot, c) => { let s = `<g transform="translate(${x} ${y}) rotate(${rot})">` + tallo(`M0 0L${l} 0`, c, 1); for (let i = 0; i < 16; i++) { const t = .35 + i / 26; s += hoja(l * t, 0, 12, 1.6, (i % 2 ? -1 : 1) * 38, c, .7); } return s + '</g>'; };

  /** Ramillete para esquinas y separadores. tipo: rosas | gypso | silvestre | seca | eucalipto | linea */
  function ramo(tipo, P) {
    const v = P.f;
    let g = '';
    if (tipo === 'linea') {
      // Dibujo a línea (estilo artesanal): tulipanes y hojas
      const tul = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M0 0V-48"/><path d="M0-48c-9-2-12-12-9-20 4 3 7 5 9 9 2-4 5-6 9-9 3 8 0 18-9 20z"/><path d="M0-20c-8-4-16-3-20 2 7 3 14 2 20-2zM0-30c7-6 15-6 20-2-6 4-14 5-20 2z"/></g>`;
      g = `${tul(60, 120, -34)}${tul(84, 118, -14)}${tul(110, 120, 8)}${tul(150, 122, 32)}${tul(130, 124, 18)}
        <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${30 + i * 32} 128q8-${10 + (i % 2) * 6} 18 0"/>`).join('')}</g>`;
      return `<svg viewBox="0 0 240 140" aria-hidden="true">${g}</svg>`;
    }
    if (tipo === 'rosas') {
      g = hoja(120, 70, 70, 16, -160, v.hoja) + hoja(120, 70, 74, 15, -20, v.hoja2) + hoja(120, 74, 62, 14, 160, v.hoja) + hoja(122, 72, 60, 13, 25, v.hoja2)
        + hoja(110, 76, 58, 12, -120, v.hoja2, .7) + hoja(132, 76, 58, 12, -60, v.hoja, .7)
        + rosa(92, 72, 26, v.a, v.aOsc, v.aClaro) + rosa(146, 70, 24, v.b, v.bOsc, v.bClaro) + rosa(120, 92, 22, v.a, v.aOsc, v.aClaro)
        + rosa(64, 92, 15, v.b, v.bOsc, v.bClaro) + rosa(176, 94, 14, v.a, v.aOsc, v.aClaro)
        + [[50, 70], [190, 72], [104, 112], [138, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${v.b}" opacity=".9"/><circle cx="${x + 7}" cy="${y + 4}" r="3.6" fill="${v.b}" opacity=".8"/>`).join('');
    } else if (tipo === 'gypso') {
      g = tallo('M30 120Q90 70 210 90', v.hoja, 1) + hoja(70, 98, 30, 6, -30, v.hoja, .6) + hoja(150, 80, 28, 5, 10, v.hoja, .6)
        + gypso(60, 70, 3) + gypso(120, 60, 9) + gypso(180, 72, 15) + gypso(95, 92, 21) + gypso(160, 98, 27);
    } else if (tipo === 'silvestre') {
      g = tallo('M20 110C80 80 160 80 220 100', v.hoja, 1) + [[40, 96, -40], [70, 86, -10], [110, 82, -30], [150, 84, 20], [190, 92, 40]].map(([x, y, r]) => hoja(x, y, 26, 5, r, v.hoja, .65)).join('')
        + flor5(60, 80, 11, v.a, v.centro) + flor5(100, 66, 9, v.b, v.centro) + flor5(132, 74, 12, v.a, v.centro) + flor5(170, 70, 9, v.c, v.centro) + flor5(200, 86, 8, v.b, v.centro) + flor5(36, 92, 7, v.c, v.centro)
        + [[84, 70], [118, 58], [156, 60], [186, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${v.c}"/>`).join('');
    } else if (tipo === 'seca') {
      g = pampa(120, 96, 90, -150, v.hoja2) + pampa(120, 96, 86, -30, v.hoja2) + hoja(120, 96, 60, 13, -110, v.hoja) + hoja(120, 96, 62, 12, -70, v.hoja, .7) + hoja(118, 98, 52, 10, 170, v.hoja2, .8)
        + rosa(96, 92, 22, v.a, v.aOsc, v.aClaro) + rosa(142, 90, 19, v.b, v.bOsc, v.bClaro) + rosa(120, 110, 15, v.c, v.aOsc, v.aClaro)
        + flor5(70, 104, 8, v.c, v.aOsc) + flor5(170, 106, 7, v.a, v.aOsc);
    } else {
      g = eucalipto(120, 90, 100, -160, v.a) + eucalipto(120, 90, 96, -25, v.b) + eucalipto(118, 94, 70, -100, v.a) + eucalipto(124, 94, 72, -70, v.b)
        + eucalipto(120, 92, 60, 170, v.b) + eucalipto(122, 92, 58, 12, v.a);
    }
    return `<svg viewBox="0 0 240 140" aria-hidden="true">${ACU}<g filter="url(#acu)">${g}</g></svg>`;
  }

  // Pareja en silueta para el código de vestimenta
  const SILUETA = `<svg viewBox="0 0 120 140" aria-hidden="true" fill="currentColor"><circle cx="42" cy="17" r="9"/><path d="M30 30h24l6 4 2 44h-7l-1 58h-9l-3-46-3 46h-9l-1-58h-7l2-44z"/><path d="M42 30l-3 12 3 10 3-10z" fill="#fff" opacity=".9"/><circle cx="80" cy="18" r="8.5"/><path d="M80 27c-6 0-9 3-9 9l2 20-2 4-18 76h54l-18-76-2-4 2-20c0-6-3-9-9-9z"/></svg>`;
  const ICO = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const REP = {
    azar: ICO('<path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    ant: ICO('<path d="M19 20L9 12l10-8zM5 19V5"/>'),
    sig: ICO('<path d="M5 4l10 8-10 8zM19 5v14"/>'),
    rep: ICO('<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>'),
    play: '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pausa: '<svg class="i-pausa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
  };
  const CORAZON = '<svg class="cal-corazon" viewBox="0 0 40 36" aria-hidden="true"><path d="M20 34S3 23.5 3 12.3A8.8 8.8 0 0120 8a8.8 8.8 0 0117 4.3C37 23.5 20 34 20 34z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

  // ---------------- Estilos y paletas ----------------
  const ESTILOS = {
    sobre: { rasgado: false, fuentes: 'family=Great+Vibes&family=Lora:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@400;500' },
    acuarela: { rasgado: true, fuentes: 'family=Pinyon+Script&family=Lora:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@400;500' },
    esmeralda: { rasgado: true, fuentes: 'family=Italiana&family=Great+Vibes&family=Montserrat:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400' },
    artesanal: { rasgado: true, fuentes: 'family=Pinyon+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400' }
  };
  const VARIANTES = [
    { id: 'ed-cafe', nombre: 'Editorial Café', estilo: 'sobre', flores: 'gypso', desc: 'Beige y café con sobre, gypsophila, calendario y reproductor.',
      c: { papel: '#f6f2ec', papel2: '#efe8de', banda: '#9c7a63', bandaOsc: '#7f604c', sobreBanda: '#fffaf3', tinta: '#4a3b31', suave: '#7a6a5d', acento: '#9c7a63', acentoTxt: '#7f604c', linea: '#dccfbf' },
      f: { hoja: '#8f9a78' } },
    { id: 'ed-navy', nombre: 'Editorial Navy', estilo: 'sobre', flores: 'rosas', sello: true, desc: 'Azul marino, rosas blancas y sello dorado.',
      c: { papel: '#f5f4f1', papel2: '#ebebe8', banda: '#4c5874', bandaOsc: '#3b4560', sobreBanda: '#fbfaf7', tinta: '#2f3546', suave: '#626a7d', acento: '#4c5874', acentoTxt: '#4c5874', linea: '#d4d6de' },
      f: { a: '#f4f2ee', aOsc: '#b9bfcc', aClaro: '#ffffff', b: '#2e3b5c', bOsc: '#18213a', bClaro: '#5c6c90', hoja: '#7d8ba3', hoja2: '#a9b6c6' } },
    { id: 'ed-vino', nombre: 'Editorial Vino', estilo: 'sobre', flores: 'silvestre', desc: 'Vino profundo con flores silvestres.',
      c: { papel: '#f5f1eb', papel2: '#ece5dc', banda: '#5b1f2c', bandaOsc: '#461521', sobreBanda: '#fbf6f1', tinta: '#3d2a2c', suave: '#6f5d5c', acento: '#5b1f2c', acentoTxt: '#5b1f2c', linea: '#dccdc6' },
      f: { a: '#b46a7c', b: '#8e7aa8', c: '#d9a6a0', centro: '#e5c66d', hoja: '#8a9670' } },
    { id: 'ed-terracota', nombre: 'Editorial Terracota', estilo: 'acuarela', flores: 'seca', desc: 'Papel crema, flores secas en terracota y fotos con borde rasgado.',
      c: { papel: '#f7f3ed', papel2: '#f0e8de', banda: '#c06a3d', bandaOsc: '#9e5430', sobreBanda: '#fff8f1', tinta: '#3e3029', suave: '#77675c', acento: '#c06a3d', acentoTxt: '#a4552f', linea: '#e5d6c6' },
      f: { a: '#c9774d', aOsc: '#8f4627', aClaro: '#e9b18f', b: '#e3b49a', bOsc: '#b0705a', bClaro: '#f5d9c7', c: '#d99a6c', hoja: '#8b6a4f', hoja2: '#c9a985' } },
    { id: 'ed-salvia', nombre: 'Editorial Salvia', estilo: 'acuarela', flores: 'eucalipto', desc: 'Verde salvia, eucalipto en acuarela y fotos con borde rasgado.',
      c: { papel: '#f6f3ec', papel2: '#e7ebe0', banda: '#3e4a34', bandaOsc: '#2f3927', sobreBanda: '#f6f3ec', tinta: '#323a2c', suave: '#666e5e', acento: '#3e4a34', acentoTxt: '#3e4a34', linea: '#d5dacb' },
      f: { a: '#8fa287', b: '#a9b9a0' } },
    { id: 'ed-esmeralda', nombre: 'Editorial Esmeralda', estilo: 'esmeralda', flores: 'rosas', desc: 'Verde esmeralda casi negro, rosas blancas y franjas de papel rasgado.',
      c: { papel: '#0f231e', papel2: '#132b25', banda: '#d7d1c5', bandaOsc: '#c9c2b4', sobreBanda: '#1c2b26', tinta: '#e9e5dc', suave: '#b4bdb7', acento: '#9fb7a6', acentoTxt: '#c5d6ca', linea: '#2e4740' },
      f: { a: '#f3efe6', aOsc: '#c9c3b1', aClaro: '#ffffff', b: '#1e5444', bOsc: '#0b2c22', bClaro: '#3f8069', hoja: '#173c31', hoja2: '#2b5a49' } },
    { id: 'ed-artesanal', nombre: 'Editorial Artesanal', estilo: 'artesanal', flores: 'linea', desc: 'Papel de algodón, fotos en blanco y negro y dibujos a línea.',
      c: { papel: '#f3f1ec', papel2: '#ebe8e1', banda: '#8d8d8b', bandaOsc: '#6e6e6c', sobreBanda: '#fbfaf7', tinta: '#232323', suave: '#5c5b58', acento: '#8d8d8b', acentoTxt: '#4f4e4b', linea: '#d6d2c9' },
      f: {} }
  ];

  // ---------------- Render ----------------
  function render(V, d, S) {
    const e = S.esc, f = S.fechaInfo(d), oc = d.ocultar, E = V.estilo;
    const gal = (d.historia.fotos || []).filter(x => x && x.src);
    // Ramillete en PNG (plantillas/adornos/<diseño>-flores.png). En el archivo publicado se pide a la dirección del sitio.
    const N = window.NEGOCIO || {}, ruta = d._rutaAdornos != null ? d._rutaAdornos : (N.sitio ? String(N.sitio).replace(/\/?$/, '/') + 'plantillas/adornos/' : null);
    const dFlores = V.flores === 'linea' ? Object.assign({}, d, { _rutaAdornos: null }) : Object.assign({}, d, { _rutaAdornos: ruta });
    const flores = (c) => S.adorno(dFlores, 'flores', ramo(V.flores, V), 'ed-flores ' + c);
    const ini1 = ((d.novia || '').trim()[0] || '').toUpperCase(), ini2 = ((d.novio || '').trim()[0] || '').toUpperCase();
    const mono = `<p class="ed-mono rv"><span>${e(ini1)}</span><i></i><span>${e(ini2)}</span></p>`;
    const nombresScript = `<h1 class="ed-nombres">${e(d.novia)}<i>&amp;</i>${e(d.novio)}</h1>`;
    const foto = (src, c = '', extra = '') => src
      ? `<figure class="ed-foto ${V.e.rasgado ? 'rasg' : ''} ${c} rv" data-zoom="${e(src)}">${extra}<img src="${e(src)}" alt="" loading="lazy"></figure>`
      : '';
    const fotoPortada = d.fotoPortada
      ? `<figure class="ed-foto ${V.e.rasgado ? 'rasg' : ''} ed-portada-foto rv"><img src="${e(d.fotoPortada)}" alt="${e(d.novia)} y ${e(d.novio)}"></figure>`
      : `<figure class="ed-foto ed-portada-foto vacia rv"><span>${S.ICONOS.foto}Foto de portada</span></figure>`;
    const frase = S.hay(d.frase) && !oc.frase ? `<blockquote class="ed-frase rv">“${S.br(d.frase)}”${S.hay(d.fraseAutor) ? `<cite>${e(d.fraseAutor)}</cite>` : ''}</blockquote>` : '';

    // ---- Portada según el estilo ----
    let portada;
    if (E === 'sobre') {
      portada = `<header class="ed-hero hero-sobre">
        ${nombresScript}
        ${V.sello ? `<span class="hs-sello" aria-hidden="true">${e(ini1)}${e(ini2)}</span>` : ''}
        <p class="hs-fecha">${String(f.dia).padStart(2, '0')}.${f.mesNum}.${f.anio}</p>
      </header>
      <div class="ed-tira">${flores('t-izq')}${flores('t-der')}</div>
      <section class="ed-sec ed-intro">
        ${S.hay(d.textoFamilia) && false ? '' : ''}${frase}${mono}
        <div class="ed-portada-caja">${fotoPortada.replace('<img', `<p class="ed-sobre-foto">${e(d.introPortada)}</p><img`).replace('<span>', `<p class="ed-sobre-foto">${e(d.introPortada)}</p><span>`)}</div>
      </section>`;
    } else if (E === 'acuarela') {
      portada = `<header class="ed-hero hero-acuarela">
        ${flores('esq-izq')}${flores('esq-der')}
        ${frase}${mono}
        <p class="ed-eyebrow rv">${e(d.introPortada)}</p>
      </header>
      ${fotoPortada}`;
    } else if (E === 'esmeralda') {
      portada = `<header class="ed-hero hero-esmeralda">
        ${d.fotoPortada ? `<img class="he-foto" src="${e(d.fotoPortada)}" alt="">` : '<span class="he-foto vacia"></span>'}
        <div class="he-txt"><p class="he-fecha">${String(f.dia).padStart(2, '0')}.${f.mesNum}.${f.anio}</p>${nombresScript}</div>
      </header>
      <div class="ed-tira grande">${flores('t-centro')}</div>
      <section class="ed-sec ed-intro"><h2 class="ed-script rv">${e(d.introPortada)}</h2>${frase}${mono}</section>`;
    } else {
      portada = `<header class="ed-hero hero-artesanal">
        <p class="ha-nombres">${e(d.novia)} &amp; ${e(d.novio)}</p><p class="ha-sub">${e(d.introPortada)}</p>
        ${fotoPortada}
      </header>
      <section class="ed-sec ed-intro">${frase}${flores('corona')}${mono}</section>`;
    }

    // ---- Reproductor de música (usa el botón de música del motor) ----
    const reproductor = d.musica ? `
      <section class="ed-sec ed-musica"><div class="rep rv">
        <p class="rep-titulo">Dale play a nuestra canción</p>
        <div class="rep-barra"><span></span></div>
        <div class="rep-tiempos"><small>0:00</small><small>3:48</small></div>
        <div class="rep-ctrl">${REP.azar}${REP.ant}
          <button type="button" class="rep-play" aria-label="Reproducir o pausar nuestra canción" onclick="var b=document.getElementById('btn-musica');if(b)b.click()">${REP.play}${REP.pausa}</button>
          ${REP.sig}${REP.rep}</div>
      </div></section>` : '';

    // ---- Fecha, cuenta regresiva y calendario del mes ----
    const [yy, mm, dd] = String(d.fecha || '2027-01-01').split('-').map(Number);
    const primero = (new Date(yy, mm - 1, 1).getDay() + 6) % 7, diasMes = new Date(yy, mm, 0).getDate();
    let celdas = '';
    for (let i = 0; i < primero; i++) celdas += '<span></span>';
    for (let n = 1; n <= diasMes; n++) celdas += n === dd ? `<span class="hoy">${CORAZON}<b>${n}</b></span>` : `<span>${n}</span>`;
    const calendario = `<div class="cal rv" aria-label="Calendario de ${e(f.mes)} ${yy}">
        <p class="cal-tit">El gran día</p><p class="cal-mes">${e(f.mes)} ${yy}</p>
        <div class="cal-sem">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(x => `<span>${x}</span>`).join('')}</div>
        <div class="cal-dias">${celdas}</div></div>`;
    const cuenta = `
      <section id="cuenta" class="ed-sec ed-fecha banda">
        ${S.hay(d.textoFamilia) && !oc.familia ? '' : ''}
        <div class="fb rv"><span class="fb-lado">${e(f.diaSemana)}</span><span class="fb-dia"><small>${e(f.mes)}</small>${f.dia}</span><span class="fb-lado">${f.anio}</span></div>
        ${oc.cuenta ? '' : `<p class="ed-eyebrow rv">Faltan</p>${S.reloj()}<a class="ed-pill rv" target="_blank" rel="noopener" href="${e(S.enlaceCalendario(d))}">${S.ICONOS.calendario}Agendar en calendario</a>`}
        ${calendario}
      </section>`;

    // ---- Secciones del motor con el acomodo editorial ----
    const banda = { sobre: ['familia', 'regalos', 'rsvp'], acuarela: [], esmeralda: ['itinerario', 'regalos', 'hospedaje'], artesanal: [] }[E];
    const cls = (id) => 'ed-sec' + (banda.includes(id) ? ' banda' : '') + (id === 'itinerario' && E === 'acuarela' ? ' lavado' : '');
    const vestimenta = S.vestimenta(d, { clase: cls('vestimenta') }).replace(/<div class="figuras rv">[\s\S]*?<\/div>/, `<div class="ed-silueta rv">${SILUETA}</div>`);
    const historia = S.historia(Object.assign({}, d, { historia: Object.assign({}, d.historia, { fotos: gal.slice(3) }) }), { clase: cls('historia') });

    return `
${S.sobre(d)}
<main class="ed e-${E}">
  ${portada}
  ${reproductor}
  ${S.familia(d, { clase: cls('familia') })}
  ${cuenta}
  ${gal[0] ? `<div class="ed-sec ed-fotos">${foto(gal[0].src, 'f1')}</div>` : ''}
  ${S.ubicacion(d, { clase: cls('ubicacion') })}
  ${S.itinerario(d, { clase: cls('itinerario') })}
  ${gal[1] ? `<div class="ed-sec ed-fotos">${foto(gal[1].src, 'f2')}${gal[2] ? '' : ''}</div>` : ''}
  ${vestimenta}
  ${historia}
  ${S.regalos(d, { clase: cls('regalos') })}
  ${S.rsvp(d, { clase: cls('rsvp') })}
  ${S.extras(d, { hospedaje: { clase: cls('hospedaje') }, deseos: { clase: 'ed-sec' }, canciones: { clase: 'ed-sec' }, contactos: { clase: 'ed-sec' }, mesa: { clase: 'ed-sec' }, acceso: { clase: 'ed-sec' } })}
  <div class="ed-tira">${flores('t-izq')}${flores('t-der')}</div>
  ${S.cierre(d, { clase: 'ed-pie', antes: gal[2] ? foto(gal[2].src, 'f-cierre', `<span class="ed-mono-foto">${e(ini1)} | ${e(ini2)}</span>`) : '' })}
</main>`;
  }

  // ---------------- CSS ----------------
  function css(V) {
    const c = V.c, id = V.id, E = V.estilo;
    const fuente = { sobre: ["'Great Vibes',cursive", "'Lora',Georgia,serif", "'Lora',Georgia,serif"], acuarela: ["'Pinyon Script',cursive", "'Lora',Georgia,serif", "'Lora',Georgia,serif"],
      esmeralda: ["'Italiana',serif", "'Cormorant Garamond',Georgia,serif", "'Montserrat',system-ui,sans-serif"], artesanal: ["'Pinyon Script',cursive", "'Cormorant Garamond',Georgia,serif", "'Cinzel',serif"] }[E];
    return `
body.plantilla-${id}{--fondo:${c.papel};--fondo2:${c.papel2};--tinta:${c.tinta};--suave:${c.suave};--acento:${c.acento};--acento2:${c.acento};--acento-texto:${c.acentoTxt};--linea:${c.linea};--titulo:${c.tinta};
  --oscuro:${c.banda};--sobre-oscuro:${c.sobreBanda};--banda:${c.banda};--banda-osc:${c.bandaOsc};--sobre-banda:${c.sobreBanda};--tarjeta:${E === 'esmeralda' ? c.papel2 : '#fffdf9'};
  --f-titulo:${fuente[0]};--f-texto:${fuente[1]};--f-etiqueta:${fuente[2]};--f-script:${E === 'esmeralda' ? "'Great Vibes',cursive" : fuente[0]};
  --fondo-sobre:${c.papel};--sobre-c1:${E === 'esmeralda' || E === 'artesanal' ? c.papel2 : c.banda};--sobre-c2:${E === 'esmeralda' ? '#183730' : E === 'artesanal' ? '#e4e0d7' : c.bandaOsc};--sobre-c3:${E === 'esmeralda' ? '#1d4038' : E === 'artesanal' ? '#efece5' : c.banda};
  --sello:radial-gradient(circle at 35% 30%,#d9b968,#a8843c 60%,#7f6127);--sello-borde:#a8843c;
  font-size:16px;background:${c.papel} ${PAPEL};line-height:1.65}
${E === 'artesanal' ? `body.plantilla-${id}{background:${c.papel} ${PAPEL_ALGODON}}` : ''}
.ed{overflow:hidden}
.ed .sec,.ed .ed-sec{padding:58px 24px;text-align:center;position:relative}
.ed .cont{max-width:560px}
.ed .eyebrow,.ed .ed-eyebrow{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--acento-texto);margin-bottom:10px}
.ed .titulo,.ed .ed-script{font-family:var(--f-script);font-weight:400;font-size:clamp(36px,10vw,48px);color:var(--titulo);line-height:1.15;margin-bottom:14px}
.ed .lead{font-size:16px;font-style:normal;color:var(--suave)}
.ed .btn,.ed .ed-pill{display:inline-flex;align-items:center;gap:8px;font-family:var(--f-texto);font-size:14px;letter-spacing:.04em;text-transform:none;padding:8px 20px;border-radius:999px;border:none;background:var(--acento);color:var(--sobre-banda);text-decoration:none;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.12)}
.ed .btn:hover,.ed .ed-pill:hover{filter:brightness(1.08);background:var(--acento);color:var(--sobre-banda)}
.ed .btn svg,.ed .ed-pill svg{width:15px;height:15px}
.ed .rv{transform:translateY(18px)}.ed .rv.vis{transform:none}

/* Franjas de color */
.ed .banda{background:var(--banda);color:var(--sobre-banda);--titulo:var(--sobre-banda);--suave:color-mix(in srgb,var(--sobre-banda) 78%,var(--banda));--acento-texto:var(--sobre-banda);--linea:color-mix(in srgb,var(--sobre-banda) 35%,var(--banda))}
.ed .banda .btn,.ed .banda .ed-pill{background:transparent;color:var(--sobre-banda);border:1px solid var(--sobre-banda);box-shadow:none}
.ed .banda .btn.solido{background:var(--sobre-banda);color:var(--banda)}
.ed .banda .reloj small,.ed .banda .reloj b{color:var(--sobre-banda)}

/* Fotos */
.ed-foto{position:relative;margin:0 auto;max-width:420px;overflow:hidden;cursor:zoom-in;box-shadow:0 10px 24px -12px rgba(0,0,0,.35)}
.ed-foto img{width:100%;aspect-ratio:4/5;object-fit:cover}
.ed-foto.vacia{aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,var(--fondo2),color-mix(in srgb,var(--acento) 25%,var(--fondo2)));cursor:default}
.ed-foto.vacia span{display:flex;flex-direction:column;align-items:center;gap:8px;font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:var(--suave)}
.ed-foto.vacia svg{width:34px;height:34px}
.ed-foto.rasg{-webkit-mask:${RASGADOS.ambos} center/100% 100% no-repeat;mask:${RASGADOS.ambos} center/100% 100% no-repeat;box-shadow:none;filter:drop-shadow(0 6px 10px rgba(0,0,0,.12))}
.ed-fotos{padding-top:10px!important;padding-bottom:10px!important}
.ed-portada-caja{position:relative;margin-top:22px}
.ed-sobre-foto{position:absolute;top:14px;left:0;right:0;z-index:2;font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.45)}
.ed-foto.vacia .ed-sobre-foto{color:var(--suave);text-shadow:none}
.ed-mono-foto{position:absolute;top:14px;left:0;right:0;z-index:2;font-family:var(--f-etiqueta);font-size:15px;letter-spacing:.2em;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.4)}

/* Monograma y frase */
.ed-mono{display:flex;align-items:center;justify-content:center;gap:16px;margin:20px 0 10px;font-family:var(--f-etiqueta);font-size:40px;line-height:1;color:var(--titulo);letter-spacing:.04em}
.ed-mono i{width:1px;height:46px;background:currentColor;opacity:.6}
.ed-frase{font-style:italic;font-size:15px;line-height:1.55;color:var(--suave);max-width:330px;margin:0 auto 6px}
.ed-frase cite{display:block;font-style:normal;font-size:12px;letter-spacing:.12em;margin-top:6px}

/* Flores */
.ed-flores{display:block;pointer-events:none}
.ed-tira{display:flex;justify-content:space-between;align-items:flex-start;height:0;position:relative;z-index:3}
.ed-tira .ed-flores{width:190px;margin-top:-50px}
.ed-tira .t-der{transform:scaleX(-1)}
.ed-tira.grande{justify-content:center;height:auto}
.ed-tira.grande .ed-flores{width:min(420px,108%);margin:-70px auto -30px}

/* Calendario */
.cal{max-width:330px;margin:34px auto 0}
.cal-tit{font-family:var(--f-etiqueta);font-size:13px;letter-spacing:.28em;text-transform:uppercase}
.cal-mes{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.85;margin:2px 0 12px}
.cal-sem,.cal-dias{display:grid;grid-template-columns:repeat(7,1fr);gap:4px 0}
.cal-sem span{font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.08em;text-transform:uppercase;opacity:.8;padding-bottom:6px}
.cal-dias span{font-size:13px;height:32px;display:flex;align-items:center;justify-content:center;position:relative}
.cal-dias .hoy b{position:relative;font-weight:600}
.cal-corazon{position:absolute;width:36px;height:33px;left:50%;top:50%;transform:translate(-50%,-48%);animation:edLatir 1.8s ease-in-out infinite}
@keyframes edLatir{50%{transform:translate(-50%,-48%) scale(1.12)}}

/* Fecha */
.fb{display:flex;align-items:center;justify-content:center;gap:16px}
.fb-lado{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.24em;text-transform:uppercase;border-top:1px solid currentColor;border-bottom:1px solid currentColor;padding:6px 0;width:92px}
.fb-dia{font-family:var(--f-script);font-size:58px;line-height:1}
.fb-dia small{display:block;font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.28em;text-transform:uppercase;margin-bottom:2px}
.ed .ed-fecha .ed-eyebrow{margin-top:30px}
.ed .reloj{margin:4px 0 22px;gap:6px}
.ed .reloj span{font-family:var(--f-texto);font-size:clamp(34px,10vw,44px);font-weight:400}
.ed .reloj small{font-size:10px;margin-top:4px;letter-spacing:.12em}
.ed .reloj b{font-size:34px}

/* Reproductor */
.ed-musica{padding-top:26px!important;padding-bottom:30px!important}
.rep{max-width:300px;margin:0 auto;color:var(--tinta)}
.rep-titulo{font-size:13px;margin-bottom:10px;color:var(--suave)}
.rep-barra{height:3px;border-radius:2px;background:var(--linea);position:relative}
.rep-barra span{position:absolute;left:0;top:0;bottom:0;width:6%;background:var(--tinta);border-radius:2px}
.rep-barra span::after{content:"";position:absolute;right:-5px;top:-3.5px;width:10px;height:10px;border-radius:50%;background:var(--tinta)}
body:has(#btn-musica.sonando) .rep-barra span{animation:edBarra 228s linear forwards}
@keyframes edBarra{to{width:100%}}
.rep-tiempos{display:flex;justify-content:space-between;font-size:11px;color:var(--suave);margin-top:4px}
.rep-ctrl{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:6px}
.rep-ctrl>svg{width:18px;height:18px;opacity:.75}
.rep-play{width:46px;height:46px;border-radius:50%;border:none;background:var(--acento);color:var(--sobre-banda);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.18)}
.rep-play svg{width:22px;height:22px}
.rep-play .i-pausa,body:has(#btn-musica.sonando) .rep-play .i-play{display:none}
body:has(#btn-musica.sonando) .rep-play .i-pausa{display:block}

/* Secciones del motor más compactas */
.ed .padres{gap:18px;margin-top:20px}
.ed .sec-familia h3,.ed .hotel-nota{font-size:12px;letter-spacing:.2em}
.ed .padres p,.ed .padrinos p{font-size:16px;font-style:italic}
.ed .padrinos{margin-top:24px;padding-top:22px;gap:14px 30px}
.ed .lugares{gap:34px;margin-top:16px}
.ed .lugar{background:none;border:none;padding:0}
.ed .lugar-icono{width:38px;height:38px;margin-bottom:6px;color:var(--acento)}
.ed .lugar h3{font-family:var(--f-etiqueta);font-size:14px;letter-spacing:.24em;text-transform:uppercase;font-weight:500}
.ed .lugar-hora{font-size:15px;font-weight:600;letter-spacing:.06em;margin:2px 0 4px;color:var(--tinta)}
.ed .lugar-nombre{font-size:16px;font-weight:500;text-transform:uppercase;letter-spacing:.06em}
.ed .lugar-dir{font-size:14px;font-style:italic;margin-bottom:12px}
.ed .linea{margin-top:20px;max-width:360px}
.ed .linea::before{background:currentColor;opacity:.55;width:1.5px}
.ed .evento{grid-template-columns:1fr 46px 1fr;column-gap:12px;margin-bottom:20px}
.ed .evento .hora{font-size:15px;font-weight:600}
.ed .evento .icono{width:42px;height:42px;border:none;background:var(--fondo);color:var(--acento)}
.ed .banda .evento .icono,.ed .lavado .evento .icono{background:transparent;color:inherit}
.ed .evento .que{font-size:14px;text-transform:uppercase;letter-spacing:.08em}
.ed .evento .que small{font-size:11px;text-transform:none;letter-spacing:.04em;font-style:italic}
.ed-silueta{width:120px;margin:12px auto 14px;color:var(--tinta)}
.ed .regalos{gap:12px;margin-top:18px}
.ed .regalo{background:none;border:none;padding:8px}
.ed .regalo svg{width:28px;height:28px;margin-bottom:6px}
.ed .regalo h4{font-family:var(--f-etiqueta);font-size:12px}
.ed .regalo p,.ed .banco{font-size:14px}
.ed .banda .banco code,.ed .banda .regalo svg{color:var(--sobre-banda)}
.ed .pase{border:1px solid currentColor;padding:12px 22px;margin-bottom:18px;background:transparent;font-size:15px}
.ed .pase strong{font-family:var(--f-script);font-size:30px}
.ed .pase b{font-size:20px;color:inherit;border:1px solid currentColor;padding:0 8px;margin:0 2px}
.ed #form-rsvp label{font-size:11px;letter-spacing:.18em;margin:14px 0 6px;color:inherit;opacity:.85}
.ed #form-rsvp input[type=text],.ed #form-rsvp select,.ed #form-rsvp textarea,.ed .form-whats input,.ed .form-whats textarea{font-size:16px;padding:10px 14px;border-radius:8px;background:#fffdf9;color:#2d2620}
.ed #form-rsvp .opciones label{border-radius:999px;color:#2d2620;background:#fffdf9;opacity:1}
.ed .banda #form-rsvp .opciones input:checked+label{background:var(--banda-osc);border-color:var(--sobre-banda);color:var(--sobre-banda)}
.ed .limite{font-size:13px;color:inherit;opacity:.85}
.ed .hotel{background:none;border:none;padding:6px}
.ed .hotel h4{font-family:var(--f-etiqueta);font-size:14px;letter-spacing:.14em;text-transform:uppercase}
.ed .galeria{gap:8px}
.ed .sec-compartir .hashtag{font-size:18px;letter-spacing:.08em}
.ed .pie,.ed .ed-pie{background:none;color:var(--tinta);padding:30px 24px 120px}
.ed .pie .pie-fecha{color:var(--suave)}
body.plantilla-${id} .firma-tf{color:var(--tinta)}
.ed .pie>p:first-of-type{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.28em;text-transform:uppercase;margin-top:22px}
.ed .pie .nombres{font-family:var(--f-script);font-size:42px;margin:8px 0 4px;color:var(--titulo)}
.ed .pie .nombres span{display:inline}.ed .pie .nombres .amp{margin:0 8px;font-size:.7em}
.ed .pie .ed-foto{margin-top:6px}

/* ---- Estilo: sobre ---- */
.hero-sobre{position:relative;background:var(--banda);color:var(--sobre-banda);padding:64px 20px 78px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:22px}
.hero-sobre .ed-nombres{position:relative;z-index:1;font-family:var(--f-script);font-weight:400;font-size:clamp(44px,13vw,60px);line-height:1.08;display:flex;flex-direction:column;align-items:center}
.ed-nombres i{font-style:normal;font-size:.55em;opacity:.85}
.hs-sello{position:relative;width:58px;height:58px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e3c677,#b28d3f 60%,#86662a);color:#6d511e;display:flex;align-items:center;justify-content:center;font-family:var(--f-script);font-size:22px;box-shadow:inset 0 0 0 4px rgba(255,255,255,.18),0 4px 10px rgba(0,0,0,.35)}
.hs-fecha{position:relative;z-index:1;font-size:14px;letter-spacing:.2em}
.e-sobre .ed-intro{padding-top:96px}
.e-sobre .ed-fecha{padding-bottom:50px}

/* ---- Estilo: acuarela ---- */
.hero-acuarela{position:relative;padding:150px 24px 26px;text-align:center}
.hero-acuarela .ed-flores{position:absolute;top:-18px;width:250px}
.hero-acuarela .esq-izq{left:-36px;transform:rotate(-14deg)}
.hero-acuarela .esq-der{right:-36px;transform:scaleX(-1) rotate(-14deg)}
.e-acuarela .ed-portada-foto{max-width:none;margin:0 -0px}
.e-acuarela .ed-portada-foto img{aspect-ratio:4/4.6}
.e-acuarela .lavado{background:radial-gradient(ellipse 60% 40% at 30% 30%,color-mix(in srgb,var(--acento) 14%,transparent),transparent 70%),radial-gradient(ellipse 70% 45% at 75% 70%,color-mix(in srgb,var(--acento) 12%,transparent),transparent 70%),color-mix(in srgb,var(--acento) 6%,var(--fondo));-webkit-mask:${RASGADOS.ambos} center/100% 100%;mask:${RASGADOS.ambos} center/100% 100%;color:var(--tinta)}
.e-acuarela .ed-fotos .ed-foto{max-width:none}

/* ---- Estilo: esmeralda ---- */
.hero-esmeralda{position:relative;min-height:88vh;min-height:88svh;display:flex;align-items:flex-end;justify-content:center;text-align:center;color:#fff}
.he-foto{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.he-foto.vacia{background:linear-gradient(180deg,#2c4a40,#0f231e)}
.hero-esmeralda::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,35,30,0) 40%,rgba(15,35,30,.75) 78%,var(--fondo))}
.he-txt{position:relative;z-index:1;padding:0 18px 80px}
.he-fecha{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.3em}
.hero-esmeralda .ed-nombres{font-family:var(--f-titulo);font-weight:400;font-size:clamp(50px,15vw,74px);line-height:.95;display:flex;flex-direction:column}
.hero-esmeralda .ed-nombres i{font-family:var(--f-script);font-size:.5em;margin:4px 0}
.e-esmeralda .titulo{font-family:var(--f-titulo);font-size:clamp(34px,10vw,44px)}
.e-esmeralda .ed-script{font-family:var(--f-script)}
.e-esmeralda .banda{-webkit-mask:${RASGADOS.ambos} center/100% 100%;mask:${RASGADOS.ambos} center/100% 100%;padding-top:70px;padding-bottom:70px;--acento:#1c3d33;color:#1c2b26}
.e-esmeralda .banda .evento .icono{color:#1c3d33}
.e-esmeralda .btn,.e-esmeralda .ed-pill,.e-esmeralda .rep-play{background:linear-gradient(180deg,#2d5a4c,#173a30);color:#e9e5dc;border:1px solid #4f7a6b}
.e-esmeralda .banda .btn{background:#1c3d33;color:#e9e5dc;border:none}
.e-esmeralda .ed-foto.vacia{background:linear-gradient(160deg,#173a30,#0f231e)}
.e-esmeralda #form-rsvp .opciones input:checked+label{background:#2d5a4c;color:#fff;border-color:#2d5a4c}

/* ---- Estilo: artesanal ---- */
.hero-artesanal{padding:34px 18px 10px;text-align:center}
.ha-nombres{font-family:var(--f-etiqueta);font-size:18px;letter-spacing:.24em;text-transform:uppercase}
.ha-sub{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--suave);margin-bottom:16px}
.e-artesanal .ed-foto img,.e-artesanal .galeria img{filter:grayscale(1) contrast(1.05)}
.e-artesanal .corona{width:200px;margin:18px auto 0;color:var(--tinta)}
.e-artesanal .btn,.e-artesanal .ed-pill,.e-artesanal .rep-play{border-radius:2px;background:var(--banda);color:#fff}
.e-artesanal .titulo{font-size:clamp(34px,9vw,42px)}
/* Pantallas anchas (laptop): la invitación se ve como una hoja vertical al centro, como en el celular */
@media (min-width:700px){
  body.plantilla-${id}{background:${E === 'esmeralda' ? '#08130f' : `color-mix(in srgb,${c.banda} 22%,${c.papel})`} fixed}
  .ed{max-width:500px;margin:0 auto;background:${c.papel} ${E === 'artesanal' ? PAPEL_ALGODON : PAPEL};box-shadow:0 30px 70px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.04)}
  .ed .ed-portada-foto{max-width:none}
  .hero-esmeralda{min-height:760px}
  body.plantilla-${id} .firma-tf{max-width:500px;margin-left:auto;margin-right:auto}
}`;
  }

  VARIANTES.forEach(V => {
    V.e = ESTILOS[V.estilo];
    window.Invitacion.registrar({
      id: V.id,
      eventos: ['boda'],
      nombre: V.nombre,
      descripcion: V.desc,
      colores: [V.c.papel, V.c.banda, V.c.tinta, V.c.acento],
      efecto: null,
      adornos: [{ id: 'flores', nombre: 'Flores', ayuda: 'PNG transparente horizontal, ramillete (~900×520 px)' }],
      pdf: { slot: 'flores', svg: ramo(V.flores, V), modo: 'esquinas' },
      fuentes: `https://fonts.googleapis.com/css2?${V.e.fuentes}&display=swap`,
      // Fotos de muestra (Pixabay, uso libre) para las demos. ruta: '' desde la raíz del sitio, '../' desde demos/
      fotosEjemplo: (d, ruta) => {
        const m = (n) => `${ruta}fotos/muestra/${n}.jpg`;
        return { fotoPortada: m(V.estilo === 'artesanal' ? 'byn' : 'auto'),
          historia: Object.assign({}, d.historia, { fotos: ['anillos', 'jardin', 'abrazo', 'byn'].map(n => ({ src: m(n), pie: '' })) }) };
      },
      render: (d, S) => render(V, d, S),
      css: css(V)
    });
  });
})();
