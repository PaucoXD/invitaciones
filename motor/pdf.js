/*
 * Invitación en PDF (tamaño A5) — para quienes prefieren algo sencillo de abrir o imprimir.
 * Usa los colores, fuentes y adornos de la plantilla elegida. Los enlaces (mapas, WhatsApp, mesa
 * de regalos) se pueden tocar dentro del PDF. Opcional: código QR a la invitación digital.
 *
 *   Invitacion.pdf.generar(datos, { invitado, base, qr })            → Blob (PDF)
 *   Invitacion.pdf.generarTodos(datos, invitados, opciones, progreso) → Blob (ZIP con un PDF por invitado)
 */
(function () {
  'use strict';
  const I = window.Invitacion, S = I.S;
  const esc = S.esc, br = S.br, hay = S.hay;
  const RUTA_LIB = 'motor/lib/';
  const ANCHO = 559, ALTO = 794; // A5 a 96 ppp

  // ---------------------------------------------------------------------------
  // Librerías (se cargan solo al generar)
  // ---------------------------------------------------------------------------
  const cargadas = {};
  function cargar(archivo) {
    if (!cargadas[archivo]) cargadas[archivo] = new Promise((ok, mal) => {
      const s = document.createElement('script');
      s.src = RUTA_LIB + archivo; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar ' + archivo));
      document.head.appendChild(s);
    });
    return cargadas[archivo];
  }

  function qrDataURL(texto) {
    const q = window.qrcode(0, 'M'); q.addData(texto); q.make();
    return q.createDataURL(6, 2);
  }

  // ---------------------------------------------------------------------------
  // Diseño de las páginas
  // ---------------------------------------------------------------------------
  function varsDe(p) {
    const m = (p.css || '').match(new RegExp('body\\.plantilla-' + p.id + '\\{([^}]*)\\}'));
    return m ? m[1] : '';
  }

  const CSS = `
.pdf-raiz{position:fixed;left:-20000px;top:0;width:${ANCHO}px;z-index:-1}
.pdf-pag{position:relative;width:${ANCHO}px;height:${ALTO}px;overflow:hidden;background:var(--fondo);color:var(--tinta);font-family:var(--f-texto);font-size:14px;line-height:1.45;text-align:center;display:flex;flex-direction:column;padding:62px 48px 40px;margin-bottom:20px}
.pdf-pag *{box-sizing:border-box;margin:0;padding:0}
.pdf-marco{position:absolute;inset:16px;border:1px solid var(--acento);pointer-events:none;z-index:1}
.pdf-marco::after{content:"";position:absolute;inset:5px;border:1px solid var(--linea)}
.pdf-orn{position:absolute;width:175px;z-index:2;display:block}
.pdf-orn img,.pdf-orn svg{width:100%;height:auto;display:block}
.pdf-orn>img+.fb{display:none}
.pdf-orn.tl{top:0;left:0}.pdf-orn.br{bottom:0;right:0;transform:rotate(180deg)}
.pdf-orn.tr{top:0;right:0;transform:scaleX(-1)}.pdf-orn.bl{bottom:0;left:0;transform:scaleY(-1)}
.pdf-orn.arriba{top:4px;left:50%;width:330px;transform:translateX(-50%)}
.pdf-orn.abajo-i{bottom:-10px;left:-30px;width:150px;transform:rotate(-10deg)}
.pdf-orn.abajo-d{bottom:-10px;right:-30px;width:150px;transform:rotate(10deg) scaleX(-1)}
.pdf-orn.colgante{top:-20px;right:-14px;width:150px;transform:rotate(14deg)}
.pdf-orn.colgante2{bottom:-50px;left:-20px;width:120px;transform:rotate(-160deg)}
.pdf-orn.cuatro{width:70px}
.pdf-chico .pdf-orn{width:120px;opacity:.85}.pdf-chico .pdf-orn.arriba{width:250px}.pdf-chico .pdf-orn.cuatro{width:56px}
.pdf-chico .pdf-orn.abajo-i,.pdf-chico .pdf-orn.abajo-d{width:110px}.pdf-chico .pdf-orn.colgante{width:110px}
.pdf-cont{position:relative;z-index:3;flex:1;display:flex;flex-direction:column;justify-content:center;gap:22px;overflow:hidden}
.pdf-portada .pdf-cont{justify-content:center;align-items:center;gap:0}
.pp-eye,.pdf-eye{font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:var(--acento)}
.pp-foto{width:176px;height:212px;flex-shrink:0;border-radius:80px 80px 4px 4px;border:4px solid var(--tarjeta,#fff);box-shadow:0 6px 16px rgba(0,0,0,.15);margin-bottom:18px}
.pp-nombres{font-family:var(--f-titulo);font-weight:400;font-size:60px;line-height:1.02;color:var(--titulo,var(--tinta));margin:12px 0 6px}
.pp-nombres i{display:block;font-style:normal;font-size:.45em;color:var(--acento);margin:4px 0}
.pp-fecha{display:flex;align-items:center;justify-content:center;gap:14px;margin:14px 0 6px}
.pp-fecha span{font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.25em;text-transform:uppercase;border-top:1px solid var(--linea);border-bottom:1px solid var(--linea);padding:6px 0;width:92px}
.pp-fecha b{font-family:var(--f-titulo);font-weight:400;font-size:50px;line-height:1;color:var(--titulo,var(--tinta))}
.pp-mes{font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.3em;text-transform:uppercase}
.pp-lugar{font-style:italic;font-size:16px;color:var(--suave);margin-top:12px}
.pp-frase{font-style:italic;font-size:13px;color:var(--suave);max-width:380px;margin-top:20px}
.pp-para{margin-top:22px;padding:12px 26px;border:1px dashed var(--acento);background:var(--tarjeta,transparent)}
.pp-para small{font-family:var(--f-etiqueta);font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--acento)}
.pp-para strong{display:block;font-family:var(--f-titulo);font-weight:400;font-size:26px;line-height:1.2;color:var(--titulo,var(--tinta))}
.pp-para span{font-size:13px}
.compacta .pp-foto{width:132px;height:159px;margin-bottom:10px}
.compacta .pp-nombres{font-size:48px;margin:6px 0 2px}
.compacta .pp-fecha{margin:8px 0 4px}.compacta .pp-fecha b{font-size:42px}
.compacta .pp-lugar{margin-top:6px}
.compacta .pp-para{margin-top:12px;padding:8px 22px}
.compacta .pp-qr{margin-top:12px}
.pp-qr{display:flex;align-items:center;gap:12px;margin-top:18px;text-align:left;font-size:11px;color:var(--suave);line-height:1.3}
.pp-qr img{width:74px;height:74px;background:#fff;padding:3px;border-radius:3px}
.pp-qr b{display:block;font-family:var(--f-etiqueta);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--acento)}
.pdf-bloque{width:100%}
.pdf-bloque h2{font-family:var(--f-titulo);font-weight:400;font-size:30px;line-height:1.1;color:var(--titulo,var(--tinta));margin:4px 0 8px}
.pdf-bloque h3{font-family:var(--f-etiqueta);font-size:9.5px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:var(--acento);margin:8px 0 3px}
.pdf-bloque p{font-size:13.5px}
.pdf-col{display:flex;gap:18px;justify-content:center}.pdf-col>div{flex:1}
.pdf-tarjeta{border:1px solid var(--linea);background:var(--tarjeta,transparent);padding:12px 12px 14px;border-radius:3px}
.pdf-tarjeta .nom{font-weight:600;font-size:14px}
.pdf-tarjeta .dir{font-size:12px;color:var(--suave)}
.pdf-btn{display:inline-block;margin-top:8px;padding:5px 14px;border:1px solid var(--acento2);color:var(--acento2);font-family:var(--f-etiqueta);font-size:9px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;border-radius:20px}
.pdf-btn.lleno{background:var(--acento2);color:var(--fondo)}
.pdf-it{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 18px;text-align:left;max-width:420px;margin:0 auto}
.pdf-it div{display:flex;gap:10px;align-items:baseline;border-bottom:1px dotted var(--linea);padding:4px 0}
.pdf-it b{font-family:var(--f-titulo);font-weight:400;font-size:17px;color:var(--titulo,var(--tinta));min-width:48px}
.pdf-it span{font-size:12.5px}
.pdf-galeria{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:10px}
.pdf-galeria figure{position:relative;background:var(--tarjeta,#fff);padding:5px;box-shadow:0 3px 10px rgba(0,0,0,.14)}
.pdf-galeria img{display:block}
.pdf-galeria figcaption{font-family:var(--f-titulo);font-size:16px;color:var(--titulo,var(--tinta));padding-top:4px}
.pdf-colores{display:flex;justify-content:center;gap:7px;margin-top:6px}.pdf-colores span{width:18px;height:18px;border-radius:50%;border:1px solid var(--linea)}
.pdf-bloque .pdf-mesa-num{font-family:var(--f-titulo);font-size:52px;line-height:1.1;color:var(--titulo,var(--tinta))}
.pdf-pie{position:relative;z-index:3;font-family:var(--f-etiqueta);font-size:8.5px;letter-spacing:.35em;text-transform:uppercase;color:var(--acento);padding-top:8px}
.plano{position:relative;width:100%;max-width:440px;aspect-ratio:4/3;margin:14px auto 0;background:var(--tarjeta,var(--fondo));border:1px solid var(--linea);border-radius:4px;overflow:hidden}
.pl-el{position:absolute;display:flex;align-items:center;justify-content:center;border:1px dashed var(--linea);background:var(--fondo2,rgba(0,0,0,.04));color:var(--suave);font-family:var(--f-etiqueta);font-size:8px;letter-spacing:.2em;text-transform:uppercase;border-radius:3px}
.pl-novios{border-style:solid;border-color:var(--acento);color:var(--acento)}
.pl-mesa{position:absolute;width:9%;height:12%;transform:translate(-50%,-50%);border-radius:50%;border:1px solid var(--linea);background:var(--fondo);display:flex;align-items:center;justify-content:center;font-family:var(--f-etiqueta);font-size:9px;color:var(--suave)}
.pl-mesa.rect{width:15%;height:9.5%;border-radius:3px}
.pl-mesa.tuya{background:var(--acento2);border-color:var(--acento2);color:var(--fondo);font-weight:700}
`;

  function construir(datos, opc = {}) {
    const d = I.normalizar(datos), fotos = opc.fotos || {};
    const p = I.plantillas[d.plantilla] || Object.values(I.plantillas)[0];
    d.plantilla = p.id; d._rutaAdornos = null;
    const f = I.fechaInfo(d), ini = S.iniciales(d), inv = opc.invitado || null;
    const conf = p.pdf || {};
    const orn = (c) => conf.svg ? S.adorno(d, conf.slot, conf.svg, 'pdf-orn ' + c) : '';
    const adornos = ({ esquinas: orn('tl') + orn('br'), cuatro: orn('cuatro tl') + orn('cuatro tr') + orn('cuatro bl') + orn('cuatro br'), arriba: orn('arriba'), abajo: orn('abajo-i') + orn('abajo-d'), colgante: orn('colgante') + orn('colgante2') })[conf.modo] || '';
    const pie = `<p class="pdf-pie">${esc(ini)} · ${f.corta}</p>`;
    const pagina = (contenido, clase = '') => `<section class="pdf-pag ${clase}"><span class="pdf-marco"></span>${adornos}<div class="pdf-cont">${contenido}</div>${clase.includes('pdf-portada') ? '' : pie}</section>`;
    const wa = (num, txt) => 'https://wa.me/' + String(num || '').replace(/\D/g, '') + (txt ? '?text=' + encodeURIComponent(txt) : '');
    const etqMesa = (m) => /^\d+$/.test(m) ? 'Mesa ' + m : m;
    const conMesa = inv && inv.mesa && d.mesas.activo && (d.mesas.lista || []).some(x => x.nombre === inv.mesa);

    // ---------- Portada ----------
    const portada = pagina(`
      ${fotos.portada ? `<img class="pp-foto" src="${fotos.portada}" alt="">` : ''}
      <p class="pp-eye">${esc(d.introPortada)}</p>
      <h1 class="pp-nombres">${S.esXV(d) ? esc(d.festejada) : `${esc(d.novia)}<i>&amp;</i>${esc(d.novio)}`}</h1>
      <div class="pp-fecha"><span>${f.diaSemana}</span><b>${f.dia}</b><span>${f.anio}</span></div>
      <p class="pp-mes">${f.mes} · ${esc(d.hora)} hrs</p>
      ${hay(d.ciudad) ? `<p class="pp-lugar">${esc(d.ciudad)}</p>` : ''}
      ${inv && inv.nombre ? `<div class="pp-para"><small>Con cariño para</small><strong>${esc(inv.nombre)}</strong><span>${esc(inv.pases || d.rsvp.pases)} ${+(inv.pases || d.rsvp.pases) === 1 ? 'lugar reservado' : 'lugares reservados'}${conMesa ? ' · ' + esc(etqMesa(inv.mesa)) : ''}</span></div>`
        : (hay(d.frase) ? `<p class="pp-frase">“${br(d.frase)}”</p>` : '')}
      ${opc.qr ? `<div class="pp-qr"><img src="${opc.qr}" alt=""><div><b>Invitación digital</b>Escanea el código para ver<br>mapas, cuenta regresiva y más</div></div>` : ''}`,
      'pdf-portada' + ((fotos.portada ? 1 : 0) + (opc.qr ? 1 : 0) + (inv && inv.nombre ? 1 : 0) >= 2 && fotos.portada ? ' compacta' : ''));

    // ---------- Bloques (se acomodan solos en las páginas) ----------
    const B = [];
    const bloque = (html) => B.push(`<div class="pdf-bloque">${html}</div>`);
    if (S.esXV(d) && !d.ocultar.familia && hay(d.padresNovia)) {
      bloque(`<p class="pdf-eye">${esc(String(d.tituloFamilia).split(' y de ')[0])}</p><h2>Mis padres</h2>
        <p>${S.lineas(d.padresNovia).map(esc).join('<br>')}</p>
        ${hay(d.textoFamilia) ? `<p style="font-style:italic;margin-top:8px;color:var(--suave)">${br(d.textoFamilia)}</p>` : ''}`);
    } else if (!S.esXV(d) && !d.ocultar.familia && (hay(d.padresNovia) || hay(d.padresNovio))) {
      bloque(`<p class="pdf-eye">${esc(String(d.tituloFamilia).split(' y de ')[0])}</p><h2>Nuestros padres</h2>
        <div class="pdf-col">${hay(d.padresNovia) ? `<div><h3>Padres de la novia</h3><p>${S.lineas(d.padresNovia).map(esc).join('<br>')}</p></div>` : ''}${hay(d.padresNovio) ? `<div><h3>Padres del novio</h3><p>${S.lineas(d.padresNovio).map(esc).join('<br>')}</p></div>` : ''}</div>
        ${hay(d.textoFamilia) ? `<p style="font-style:italic;margin-top:8px;color:var(--suave)">${br(d.textoFamilia)}</p>` : ''}`);
    }
    const pad = (d.padrinos || []).filter(x => hay(x.nombres));
    if (!d.ocultar.familia && pad.length) bloque(`<h2>Padrinos</h2><div class="pdf-col" style="flex-wrap:wrap">${pad.map(x => `<div style="min-width:120px"><h3>${esc(x.rol)}</h3><p>${br(x.nombres)}</p></div>`).join('')}</div>`);
    const ls = (d.lugares || []).filter(x => hay(x.nombre));
    if (!d.ocultar.ubicacion && ls.length) bloque(`<h2>Dónde</h2><div class="pdf-col">${ls.map(l => `<div class="pdf-tarjeta"><h3>${esc(l.tipo)}${hay(l.hora) ? ' · ' + esc(l.hora) + ' hrs' : ''}</h3><p class="nom">${esc(l.nombre)}</p><p class="dir">${br(l.direccion)}</p><a class="pdf-btn" href="${esc(S.enlaceMapa(l))}">Ver mapa</a></div>`).join('')}</div>`);
    const it = (d.itinerario || []).filter(x => hay(x.evento));
    if (!d.ocultar.itinerario && it.length) bloque(`<h2>Itinerario</h2><div class="pdf-it">${it.map(x => `<div><b>${esc(x.hora)}</b><span>${esc(x.evento)}</span></div>`).join('')}</div>`);
    const v = d.vestimenta || {};
    if (!d.ocultar.vestimenta && hay(v.tipo)) bloque(`<p class="pdf-eye">Código de vestimenta</p><h2>${esc(v.tipo)}</h2>${hay(v.texto) ? `<p>${br(v.texto)}</p>` : ''}${(v.colores || []).length ? `<div class="pdf-colores">${v.colores.map(c => `<span style="background:${esc(c)}"></span>`).join('')}</div>` : ''}${hay(v.nota) ? `<p style="font-style:italic;color:var(--suave);margin-top:6px">${esc(v.nota)}</p>` : ''}`);
    const gal = fotos.galeria || [];
    if (!d.ocultar.historia && (gal.length || hay(d.historia.texto))) {
      // Primer bloque con título y hasta 4 fotos; las demás en grupos de 6 (se acomodan solas en las hojas)
      const figs = (lista) => lista.length ? `<div class="pdf-galeria">${lista.map(g => `<figure><img src="${g.src}" width="${g.w}" height="${g.h}" style="width:${g.w}px;height:${g.h}px" alt="">${hay(g.pie) ? `<figcaption>${esc(g.pie)}</figcaption>` : ''}</figure>`).join('')}</div>` : '';
      bloque(`<h2>${esc(d.historia.titulo || (S.esXV(d) ? 'Mis momentos' : 'Nuestra historia'))}</h2>${hay(d.historia.texto) ? `<p style="font-style:italic;color:var(--suave)">${br(d.historia.texto)}</p>` : ''}${figs(gal.slice(0, 4))}`);
      for (let i = 4; i < gal.length; i += 6) bloque(`<p class="pdf-eye">Más momentos</p>${figs(gal.slice(i, i + 6))}`);
    }
    const rg = d.regalos || {}, ops = (rg.opciones || []).filter(x => hay(x.nombre)), clabe = String(rg.clabe || '').replace(/\s/g, '');
    if (!d.ocultar.regalos && (ops.length || clabe)) bloque(`<h2>Mesa de regalos</h2>${hay(rg.texto) ? `<p style="font-style:italic;color:var(--suave)">${esc(rg.texto)}</p>` : ''}
      <div class="pdf-col" style="flex-wrap:wrap;margin-top:6px">${ops.map(x => `<div style="min-width:110px"><h3>${esc(x.nombre)}</h3><p>${esc(x.detalle || '')}</p>${hay(x.enlace) ? `<a class="pdf-btn" href="${esc(x.enlace)}">Ver mesa</a>` : ''}</div>`).join('')}</div>
      ${clabe ? `<p style="margin-top:8px">${hay(rg.banco) ? esc(rg.banco) + ' · ' : ''}CLABE <b>${esc(clabe.replace(/(\d{4})(?=\d)/g, '$1 '))}</b>${hay(rg.titular) ? '<br>' + esc(rg.titular) : ''}</p>` : ''}`);
    const hs = (d.hospedaje || []).filter(x => hay(x.nombre));
    if (!d.ocultar.hospedaje && hs.length) bloque(`<h2>Hospedaje</h2><div class="pdf-col">${hs.map(h => `<div class="pdf-tarjeta"><p class="nom">${esc(h.nombre)}</p>${hay(h.nota) ? `<h3>${esc(h.nota)}</h3>` : ''}<p class="dir">${br(h.direccion || '')}</p><a class="pdf-btn" href="${esc(S.enlaceMapa(h))}">Ver mapa</a></div>`).join('')}</div>`);
    const r = d.rsvp || {};
    if (!d.ocultar.rsvp && hay(r.whatsapp)) {
      const nombre = inv && inv.nombre ? inv.nombre : '';
      const msg = `¡Hola! ${nombre ? 'Somos ' + nombre + ' y c' : 'C'}onfirmamos nuestra asistencia a ${S.delEvento(d)} ${S.esXV(d) ? '👑' : '💍'}`;
      bloque(`<p class="pdf-eye">R.S.V.P.</p><h2>Confirma tu asistencia</h2>
        <p>${hay(r.fechaLimite) ? `Por favor confírmanos antes del <b>${esc(fechaTexto(r.fechaLimite))}</b>` : 'Por favor confírmanos tu asistencia'}<br>por WhatsApp al <b>${esc(formatoTel(r.whatsapp))}</b></p>
        <a class="pdf-btn lleno" href="${esc(wa(r.whatsapp, msg))}">Confirmar por WhatsApp</a>`);
    }
    const cierre = [hay(d.nota) ? `<p style="font-style:italic;color:var(--suave)">${br(d.nota)}</p>` : '', hay(d.hashtag) ? `<p class="pdf-eye" style="margin-top:6px">${esc(d.hashtag)}</p>` : '', `<h2 style="margin-top:8px">${esc(d.despedida)}</h2>`].join('');
    bloque(cierre);

    // ---------- Página de la mesa (paquete Mesas) ----------
    let mesa = '';
    if (conMesa) {
      const plano = S.plano(d).replace(new RegExp(`(class="pl-mesa[^"]*)("[^>]*data-mesa="${esc(inv.mesa).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}")`), '$1 tuya$2');
      mesa = pagina(`<div class="pdf-bloque"><p class="pdf-eye">Su lugar</p><h2>${esc(inv.nombre)}</h2><p style="font-style:italic;color:var(--suave)">te esperamos en la</p><p class="pdf-mesa-num">${esc(etqMesa(inv.mesa))}</p>${hay(d.mesas.texto) ? `<p>${br(d.mesas.texto)}</p>` : ''}${plano}</div>`, 'pdf-chico');
    }

    return { d, p, css: `.pdf-raiz{${varsDe(p)}}` + CSS, fuentes: p.fuentes || '', portada, bloques: B, mesa, pagina: (c) => pagina(c, 'pdf-chico') };
  }

  function fechaTexto(iso) {
    const [y, m, dd] = iso.split('-').map(Number);
    const M = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dd} de ${M[m - 1]} de ${y}`;
  }
  function formatoTel(n) {
    const d = String(n).replace(/\D/g, '');
    const local = d.length > 10 ? d.slice(-10) : d;
    return local.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
  }

  // ---------------------------------------------------------------------------
  // Fotos: se recortan antes (la conversión a PDF no respeta "cover" ni el ajuste de posición)
  // ---------------------------------------------------------------------------
  const MAX_FOTOS = 30;
  const TAM = { portada: [176, 212], g1: [330, 230], g2: [192, 240], g3: [192, 150] };
  function cargarImagen(src) {
    return new Promise((ok) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
  }
  /** Recorta la foto al tamaño w×h igual que en la invitación (posición y zoom elegidos en el editor). */
  async function recortar(src, w, h, enc) {
    const im = await cargarImagen(src); if (!im || !im.naturalWidth) return '';
    const k = 2.5, W = w * k, H = h * k;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = enc ? +enc.x : 50, y = enc ? +enc.y : 50, z = enc ? Math.max(1, +enc.z || 1) : 1;
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    const ox = (W - dw) * x / 100, oy = (H - dh) * y / 100, Ox = W * x / 100, Oy = H * y / 100;
    try {
      c.getContext('2d').drawImage(im, Ox + (ox - Ox) * z, Oy + (oy - Oy) * z, dw * z, dh * z);
      return c.toDataURL('image/jpeg', 0.9);
    } catch (e) { return ''; } // imagen de otro sitio que no permite copiarse
  }
  async function prepararFotos(datos) {
    const enc = datos.encuadres || {}, e = (src) => enc[I.huella(src)];
    const out = { portada: '', galeria: [] };
    if (datos.fotoPortada) out.portada = await recortar(datos.fotoPortada, ...TAM.portada, e(datos.fotoPortada));
    const fs = ((datos.historia && datos.historia.fotos) || []).filter(f => f.src).slice(0, MAX_FOTOS);
    const t = fs.length === 1 ? TAM.g1 : fs.length === 2 ? TAM.g2 : TAM.g3;
    for (const f of fs) { const src = await recortar(f.src, ...t, e(f.src)); if (src) out.galeria.push({ src, pie: f.pie, w: t[0], h: t[1] }); }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Dibujar y convertir a PDF
  // ---------------------------------------------------------------------------
  let raiz = null;
  function prepararRaiz(r) {
    let st = document.getElementById('pdf-css');
    if (!st) { st = document.createElement('style'); st.id = 'pdf-css'; document.head.appendChild(st); }
    st.textContent = r.css;
    if (r.fuentes && !document.querySelector(`link[data-pdf-fuente="${r.p.id}"]`)) {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = r.fuentes; l.setAttribute('data-pdf-fuente', r.p.id); document.head.appendChild(l);
    }
    if (!raiz) { raiz = document.createElement('div'); raiz.className = 'pdf-raiz'; document.body.appendChild(raiz); }
    raiz.innerHTML = '';
    return raiz;
  }

  /** Acomoda los bloques en páginas sin que se corten. */
  function paginar(r, cont) {
    const paginas = [];
    let actual = null;
    const nueva = () => { const t = document.createElement('div'); t.innerHTML = r.pagina(''); actual = t.firstElementChild; cont.appendChild(actual); paginas.push(actual); return actual.querySelector('.pdf-cont'); };
    let zona = nueva();
    r.bloques.forEach(b => {
      const t = document.createElement('div'); t.innerHTML = b; const nodo = t.firstElementChild;
      zona.appendChild(nodo);
      if (zona.scrollHeight > zona.clientHeight + 1 && zona.children.length > 1) { zona.removeChild(nodo); zona = nueva(); zona.appendChild(nodo); }
    });
    return paginas;
  }

  async function esperarImagenes(nodo) {
    await Promise.all([...nodo.querySelectorAll('img')].map(im => im.complete ? 0 : new Promise(ok => { im.onload = im.onerror = ok; })));
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) { /* sin fuentes */ } }
  }

  async function aImagen(pag) {
    const lienzo = await window.html2canvas(pag, { scale: 2.2, useCORS: true, backgroundColor: null, logging: false });
    const marco = pag.getBoundingClientRect();
    const enlaces = [...pag.querySelectorAll('a[href]')].map(a => { const b = a.getBoundingClientRect(); return { x: b.left - marco.left, y: b.top - marco.top, w: b.width, h: b.height, url: a.href }; });
    return { img: lienzo.toDataURL('image/jpeg', 0.9), enlaces };
  }

  function armarPdf(imagenes) {
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a5', orientation: 'portrait' });
    const k = 148 / ANCHO; // px → mm
    imagenes.forEach((x, i) => {
      if (i) pdf.addPage('a5', 'portrait');
      pdf.addImage(x.img, 'JPEG', 0, 0, 148, 210);
      x.enlaces.forEach(e => pdf.link(e.x * k, e.y * k, e.w * k, e.h * k, { url: e.url }));
    });
    return pdf;
  }

  async function prepararLibs(conZip) {
    await Promise.all([cargar('html2canvas.min.js'), cargar('jspdf.umd.min.js'), cargar('qrcode.js'), conZip ? cargar('jszip.min.js') : 0]);
  }
  function enlaceInvitado(base, d, inv) {
    if (!base) return '';
    if (!inv || !inv.nombre) return base;
    const mesa = d.mesas && d.mesas.activo && inv.mesa ? '&mesa=' + encodeURIComponent(inv.mesa) : '';
    return `${base}${base.includes('?') ? '&' : '?'}invitado=${encodeURIComponent(inv.nombre)}&pases=${inv.pases || d.rsvp.pases}${mesa}`;
  }

  /** PDF de una invitación. opciones: { invitado, base (dirección publicada, para el QR) } */
  async function generar(datos, opciones = {}) {
    await prepararLibs(false);
    const qr = opciones.base ? qrDataURL(enlaceInvitado(opciones.base, datos, opciones.invitado)) : '';
    const fotos = await prepararFotos(datos);
    const r = construir(datos, { invitado: opciones.invitado, qr, fotos });
    const cont = prepararRaiz(r);
    const t = document.createElement('div'); t.innerHTML = r.portada; cont.appendChild(t.firstElementChild);
    paginar(r, cont);
    if (r.mesa) { const m = document.createElement('div'); m.innerHTML = r.mesa; cont.appendChild(m.firstElementChild); }
    await esperarImagenes(cont);
    const imgs = [];
    for (const pag of cont.querySelectorAll('.pdf-pag')) imgs.push(await aImagen(pag));
    cont.innerHTML = '';
    return armarPdf(imgs).output('blob');
  }

  /** Un PDF por invitado dentro de un ZIP. Las páginas de detalles se dibujan una sola vez. */
  async function generarTodos(datos, invitados, opciones = {}, progreso = () => {}) {
    await prepararLibs(true);
    const zip = new window.JSZip();
    const fotos = await prepararFotos(datos);
    const base0 = construir(datos, { fotos });
    let cont = prepararRaiz(base0);
    paginar(base0, cont);
    await esperarImagenes(cont);
    const detalles = [];
    for (const pag of cont.querySelectorAll('.pdf-pag')) detalles.push(await aImagen(pag));
    const lista = invitados.filter(x => x && x.nombre);
    for (let i = 0; i < lista.length; i++) {
      const inv = lista[i];
      progreso(i + 1, lista.length, inv.nombre);
      const qr = opciones.base ? qrDataURL(enlaceInvitado(opciones.base, datos, inv)) : '';
      const r = construir(datos, { invitado: inv, qr, fotos });
      cont = prepararRaiz(r);
      const t = document.createElement('div'); t.innerHTML = r.portada + (r.mesa || ''); [...t.children].forEach(n => cont.appendChild(n));
      await esperarImagenes(cont);
      const pags = cont.querySelectorAll('.pdf-pag');
      const portada = await aImagen(pags[0]);
      const mesa = pags[1] ? await aImagen(pags[1]) : null;
      const pdf = armarPdf([portada, ...detalles, ...(mesa ? [mesa] : [])]);
      const nombre = inv.nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'invitado-' + (i + 1);
      zip.file(`${String(i + 1).padStart(3, '0')}-${nombre}.pdf`, pdf.output('arraybuffer'));
    }
    cont.innerHTML = '';
    return zip.generateAsync({ type: 'blob' });
  }

  I.pdf = { construir, generar, generarTodos };
})();
