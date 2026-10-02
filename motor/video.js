/*
 * Video vertical para estados de WhatsApp / Instagram (720×1280, ~15 s) con el diseño de la invitación.
 * Se dibuja en un <canvas> y se graba con MediaRecorder (MP4 si el navegador puede, si no WebM).
 *
 *   Invitacion.video.generar(datos, { modo: 'aparta' | 'invitacion', progreso }) → { blob, ext, tipo }
 *   Invitacion.video.disponible() → true si el navegador puede grabar video
 */
(function () {
  'use strict';
  const I = window.Invitacion, S = I.S, esc = S.esc, hay = S.hay;
  const W = 540, H = 960;              // tamaño de la página (px CSS)
  const OW = 720, OH = 1280, K = OW / W; // tamaño del video
  const DUR = 15, FIN = 10.2;           // segundos; desde FIN se muestra "Faltan X días"
  const TIPOS = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];

  const disponible = () => !!(window.MediaRecorder && HTMLCanvasElement.prototype.captureStream);
  const formato = () => TIPOS.find(t => MediaRecorder.isTypeSupported(t)) || '';
  const suave = (x) => { x = Math.min(Math.max(x, 0), 1); return 1 - Math.pow(1 - x, 3); };

  // ---------------------------------------------------------------------------
  // Capas: el fondo, los adornos y cada texto se dibujan por separado para animarlos
  // ---------------------------------------------------------------------------
  function contenido(d, modo, foto) {
    const f = I.fechaInfo(d), ap = modo === 'aparta', E = S.ev(d);
    const capa = (id, html) => `<div class="v-capa" data-capa="${id}">${html}</div>`;
    return [
      foto ? capa('foto', `<img class="pp-foto" src="${foto}" alt="">`) : '',
      capa('eye', `<p class="ap-eye">${esc(ap ? 'Aparta la fecha' : d.introPortada)}</p>`),
      ap ? capa('titulo', `<p class="ap-titulo">${esc(d.introPortada)}</p>`) : '<div style="height:20px"></div>',
      capa('nombres', `<h1 class="pp-nombres">${S.unNombre(d) ? esc(d.festejada) : `${esc(d.novia)}<i>&amp;</i>${esc(d.novio)}`}</h1>`),
      capa('fecha', `<div class="pp-fecha"><span>${f.diaSemana}</span><b>${f.dia}</b><span>${f.anio}</span></div><p class="pp-mes">${f.mes}${ap || !hay(d.hora) ? '' : ' · ' + esc(d.hora) + ' hrs'}</p>`),
      hay(d.ciudad) ? capa('ciudad', `<p class="pp-lugar">${esc(d.ciudad)}</p>`) : '',
      capa('pie', `<p class="ap-pronto">${ap ? 'Invitación formal próximamente' : E.voz === 'yo' ? '¡Te espero!' : '¡Te esperamos!'}</p>`)
    ].join('');
  }

  async function capturar(d, modo) {
    const P = I.pdf._;
    await P.prepararLibs(false);
    const fotos = await P.prepararFotos(d);
    const r = I.pdf.construir(d, { fotos });
    const cont = P.prepararRaiz(r);
    const t = document.createElement('div');
    t.innerHTML = r.paginaCon(contenido(r.d, modo, fotos.portada), 'pdf-portada pdf-story');
    const pag = t.firstElementChild;
    cont.appendChild(pag);
    await P.esperarImagenes(cont);
    const foto = () => window.html2canvas(pag, { scale: K, useCORS: true, backgroundColor: null, logging: false });
    const textos = [...pag.querySelectorAll('[data-capa]')], adornos = [...pag.querySelectorAll('.pdf-orn,.pdf-marco')];
    const ver = (lista, si) => lista.forEach(e => { e.style.visibility = si ? '' : 'hidden'; });
    const cs = getComputedStyle(pag), v = (n, o) => (cs.getPropertyValue(n) || '').trim() || o;
    const estilo = { titulo: v('--titulo', v('--tinta', '#333')), acento: v('--acento', '#b08d57'), suave: v('--suave', '#666'), linea: v('--linea', '#ddd'),
      fTitulo: v('--f-titulo', 'Georgia,serif'), fEtiqueta: v('--f-etiqueta', 'sans-serif'), fTexto: v('--f-texto', 'sans-serif') };

    ver(textos, false); ver(adornos, false);
    const fondo = await foto();
    pag.style.background = 'none';
    ver(adornos, true);
    const orn = await foto();
    ver(adornos, false);
    const marco = pag.getBoundingClientRect();
    const capas = [];
    for (const e of textos) {
      e.style.visibility = '';
      const b = e.getBoundingClientRect();
      capas.push({ id: e.dataset.capa, img: await foto(), cy: (b.top - marco.top + b.height / 2) * K });
      e.style.visibility = 'hidden';
    }
    cont.innerHTML = '';
    return { fondo, orn, capas, estilo, p: r.p, d: r.d };
  }

  // ---------------------------------------------------------------------------
  // Partículas según el efecto de la plantilla
  // ---------------------------------------------------------------------------
  function particulas(p) {
    const colores = p.efectoColores || ['#f2c14e', '#ff7aa6', '#ffffff'], tipo = p.efecto || 'confeti';
    return Array.from({ length: tipo === 'destellos' || tipo === 'estrellas' ? 34 : 26 }, (_, i) => ({
      x: Math.random() * OW, y: Math.random() * OH - OH, v: 40 + Math.random() * 70, dx: (Math.random() - .5) * 30,
      r: Math.random() * 6.28, vr: (Math.random() - .5) * 2.4, t: (tipo === 'mariposas' ? 16 : 10) + Math.random() * 10,
      c: colores[i % colores.length], fase: Math.random() * 6.28, tipo
    }));
  }
  function dibujarParticula(ctx, q, s, alfa) {
    ctx.save();
    if (q.tipo === 'destellos' || q.tipo === 'estrellas') {
      // quietas, titilan
      const brillo = (Math.sin(s * 3 + q.fase) + 1) / 2;
      ctx.globalAlpha = alfa * brillo * .9;
      ctx.translate(q.x, (q.y + OH * 2) % OH); ctx.fillStyle = q.c;
      const t = q.t * .7;
      ctx.beginPath(); ctx.moveTo(0, -t); ctx.quadraticCurveTo(0, 0, t, 0); ctx.quadraticCurveTo(0, 0, 0, t); ctx.quadraticCurveTo(0, 0, -t, 0); ctx.quadraticCurveTo(0, 0, 0, -t); ctx.fill();
      ctx.restore(); return;
    }
    const y = ((q.y + q.v * s) % (OH + 80) + OH + 80) % (OH + 80) - 40;
    ctx.globalAlpha = alfa * .85;
    ctx.translate(q.x + Math.sin(s + q.fase) * 24 + q.dx * s, y); ctx.rotate(q.r + q.vr * s); ctx.fillStyle = q.c;
    if (q.tipo === 'petalos') { ctx.beginPath(); ctx.ellipse(0, 0, q.t * .7, q.t * .45, 0, 0, 6.28); ctx.fill(); }
    else if (q.tipo === 'hojas') { ctx.beginPath(); ctx.moveTo(-q.t, 0); ctx.quadraticCurveTo(0, -q.t * .6, q.t, 0); ctx.quadraticCurveTo(0, q.t * .6, -q.t, 0); ctx.fill(); }
    else if (q.tipo === 'mariposas') { const a = Math.abs(Math.sin(s * 9 + q.fase)) * .8 + .2; ctx.beginPath(); ctx.ellipse(-q.t * .45 * a, 0, q.t * .5 * a, q.t * .6, -.4, 0, 6.28); ctx.ellipse(q.t * .45 * a, 0, q.t * .5 * a, q.t * .6, .4, 0, 6.28); ctx.fill(); }
    else ctx.fillRect(-q.t * .5, -q.t * .25, q.t, q.t * .5);
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // Música: la canción de la invitación o la melodía incluida
  // ---------------------------------------------------------------------------
  async function pista(ac, d) {
    if (!ac || !d.musica) return null;
    const dest = ac.createMediaStreamDestination(), g = ac.createGain();
    g.connect(dest);
    const inicio = () => {
      const t0 = ac.currentTime + .05;
      g.gain.setValueAtTime(1, t0); g.gain.setValueAtTime(1, t0 + DUR - 1.6); g.gain.linearRampToValueAtTime(0, t0 + DUR - .1);
      if (buf) { const s = ac.createBufferSource(); s.buffer = buf; s.connect(g); s.start(t0); return; }
      const acordes = [[293.66, 369.99, 440], [220, 277.18, 329.63], [246.94, 293.66, 369.99], [185, 220, 277.18], [196, 246.94, 293.66], [146.83, 185, 220], [196, 246.94, 293.66], [220, 277.18, 329.63]];
      for (let n = 0, t = t0; t < t0 + DUR; n++, t += 1.9) acordes[n % 8].forEach((f, k) => {
        const o = ac.createOscillator(), a = ac.createGain(), s = t + k * .18;
        o.type = 'sine'; o.frequency.value = f;
        a.gain.setValueAtTime(0, s); a.gain.linearRampToValueAtTime(.09, s + .08); a.gain.exponentialRampToValueAtTime(.0008, s + 2.6);
        o.connect(a).connect(g); o.start(s); o.stop(s + 2.7);
      });
    };
    let buf = null;
    if (d.musica !== 'melodia') {
      try { buf = await ac.decodeAudioData(await (await fetch(d.musica)).arrayBuffer()); } catch (e) { buf = null; /* se usa la melodía */ }
    }
    return { pista: dest.stream.getAudioTracks()[0], inicio };
  }

  // ---------------------------------------------------------------------------
  // Animación y grabación
  // ---------------------------------------------------------------------------
  const ENTRADAS = { foto: .3, eye: .7, titulo: 1.3, nombres: 2.1, fecha: 3.3, ciudad: 4.1, pie: 4.9 };

  function cuadro(ctx, A, s, dias, modo) {
    const { fondo, orn, capas, estilo, d } = A;
    const fin = dias > 0 ? suave((s - FIN) / .8) : 0;
    ctx.clearRect(0, 0, OW, OH);
    // Fondo con acercamiento lento
    const z = 1 + .05 * s / DUR;
    ctx.save(); ctx.translate(OW / 2, OH / 2); ctx.scale(z, z); ctx.drawImage(fondo, -OW / 2, -OH / 2, OW, OH); ctx.restore();
    A.part.forEach(q => dibujarParticula(ctx, q, s, suave(s / 1.5)));
    // Adornos: aparecen y se acomodan
    const a = suave(s / 1.4), za = 1.05 - .05 * a;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(OW / 2, OH / 2); ctx.scale(za, za); ctx.drawImage(orn, -OW / 2, -OH / 2, OW, OH); ctx.restore();
    // Textos uno tras otro
    capas.forEach(c => {
      const e = suave((s - (ENTRADAS[c.id] || 1)) / .9) * (1 - fin);
      if (e <= 0) return;
      const esc2 = c.id === 'nombres' ? .9 + .1 * e : 1;
      ctx.save(); ctx.globalAlpha = e;
      ctx.translate(OW / 2, c.cy + (1 - e) * 22 * K); ctx.scale(esc2, esc2); ctx.translate(-OW / 2, -c.cy);
      ctx.drawImage(c.img, 0, 0, OW, OH); ctx.restore();
    });
    // Final: "Faltan X días"
    if (fin > 0) {
      const y0 = OH * .36, n = Math.round(dias * suave((s - FIN - .3) / 1.6));
      ctx.save(); ctx.globalAlpha = fin; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) ctx.letterSpacing = 6 * K + 'px';
      ctx.fillStyle = estilo.acento; ctx.font = `600 ${15 * K}px ${estilo.fEtiqueta}`;
      ctx.fillText('FALTAN', OW / 2, y0);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.fillStyle = estilo.titulo; ctx.font = `400 ${150 * K}px ${estilo.fTitulo}`;
      ctx.fillText(String(n), OW / 2, y0 + 165 * K);
      if ('letterSpacing' in ctx) ctx.letterSpacing = 6 * K + 'px';
      ctx.fillStyle = estilo.acento; ctx.font = `600 ${15 * K}px ${estilo.fEtiqueta}`;
      ctx.fillText(dias === 1 ? 'DÍA' : 'DÍAS', OW / 2, y0 + 205 * K);
      const b = suave((s - FIN - 1.8) / .9);
      ctx.globalAlpha = fin * b;
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.fillStyle = estilo.titulo; ctx.font = `400 ${40 * K}px ${estilo.fTitulo}`;
      ctx.fillText(S.titular(d), OW / 2, y0 + 300 * K, OW * .84);
      if ('letterSpacing' in ctx) ctx.letterSpacing = 4 * K + 'px';
      ctx.fillStyle = estilo.suave; ctx.font = `400 ${14 * K}px ${estilo.fEtiqueta}`;
      ctx.fillText(I.fechaInfo(d).corta, OW / 2, y0 + 345 * K);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      ctx.fillStyle = estilo.acento; ctx.font = `italic 400 ${24 * K}px ${estilo.fTexto}`;
      ctx.fillText(modo === 'aparta' ? '¡Guarda la fecha!' : S.ev(d).voz === 'yo' ? '¡Te espero!' : '¡Te esperamos!', OW / 2, y0 + 410 * K);
      ctx.restore();
    }
  }

  /** Días que faltan (contando desde hoy). */
  function diasFaltan(d) {
    const ms = new Date(I.fechaInfo(d).iso) - Date.now();
    return ms > 0 ? Math.ceil(ms / 864e5) : 0;
  }

  async function generar(datos, opciones = {}) {
    if (!disponible()) throw new Error('Este navegador no puede grabar video. Usa Chrome o Safari actualizados.');
    // El audio se prepara de inmediato (los navegadores lo piden justo después del clic)
    let ac = null;
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) { ac = null; }
    const progreso = opciones.progreso || (() => {}), modo = opciones.modo === 'invitacion' ? 'invitacion' : 'aparta';
    progreso(0, 'Preparando el diseño…');
    const d = I.normalizar(datos);
    const A = await capturar(d, modo);
    A.part = particulas(A.p);
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { /* sin fuentes */ } }
    const dias = diasFaltan(A.d);
    const lienzo = document.createElement('canvas');
    lienzo.width = OW; lienzo.height = OH;
    lienzo.style.cssText = 'position:fixed;left:-99999px;top:0';
    document.body.appendChild(lienzo);
    const ctx = lienzo.getContext('2d');
    cuadro(ctx, A, 0, dias, modo);
    const audio = await pista(ac, A.d);
    const flujo = lienzo.captureStream(30);
    if (audio && audio.pista) flujo.addTrack(audio.pista);
    const tipo = formato();
    const rec = new MediaRecorder(flujo, Object.assign({ videoBitsPerSecond: 6e6, audioBitsPerSecond: 128e3 }, tipo ? { mimeType: tipo } : {}));
    const partes = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) partes.push(e.data); };
    const listo = new Promise(ok => { rec.onstop = ok; });
    rec.start(500);
    if (audio) audio.inicio();
    await new Promise(ok => {
      const t0 = performance.now();
      const paso = () => {
        const s = (performance.now() - t0) / 1000;
        cuadro(ctx, A, Math.min(s, DUR), dias, modo);
        progreso(Math.min(s / DUR, 1), 'Grabando el video…');
        if (s < DUR) requestAnimationFrame(paso); else ok();
      };
      requestAnimationFrame(paso);
    });
    rec.stop();
    await listo;
    flujo.getTracks().forEach(t => t.stop());
    if (ac) try { ac.close(); } catch (e) { /* ya cerrado */ }
    lienzo.remove();
    const mime = (rec.mimeType || tipo || 'video/webm').split(';')[0];
    return { blob: new Blob(partes, { type: mime }), ext: /mp4/.test(mime) ? 'mp4' : 'webm', tipo: mime, dias };
  }

  I.video = { generar, disponible, DUR };
})();
