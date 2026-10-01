/*
 * Motor de invitaciones
 * ---------------------
 * Convierte un objeto de datos (nombres, fecha, lugares…) en una invitación
 * usando la plantilla elegida. Lo usan:
 *   - invitacion.html  → para mostrar una boda
 *   - editor.html      → para la vista previa en vivo y para descargar el HTML final
 *
 * Una plantilla se registra con Invitacion.registrar({ id, nombre, fuentes, css, render, adornos, efecto }).
 */
(function () {
  'use strict';

  const Plantillas = {};

  // ---------------------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------------------
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const br = (s) => esc(s).replace(/\n/g, '<br>');
  /** Huella corta de un texto (sirve para identificar cada foto subida). */
  function huella(s) {
    let h = 5381; s = String(s || '');
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'f' + (h >>> 0).toString(36) + s.length.toString(36);
  }
  const desesc = (s) => String(s).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const lineas = (s) => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
  const hay = (v) => Array.isArray(v) ? v.length > 0 : !!(v && String(v).trim());

  const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  function fechaInfo(d) {
    const [y, m, dd] = String(d.fecha || '2027-01-01').split('-').map(Number);
    const local = new Date(y, (m || 1) - 1, dd || 1);
    return {
      anio: y, mes: MESES[(m || 1) - 1], mesNum: String(m).padStart(2, '0'), dia: dd,
      diaSemana: DIAS[local.getDay()],
      corta: `${String(dd).padStart(2, '0')} · ${String(m).padStart(2, '0')} · ${y}`,
      larga: `${DIAS[local.getDay()]} ${dd} de ${MESES[(m || 1) - 1].toLowerCase()} de ${y}`,
      iso: `${d.fecha || '2027-01-01'}T${d.hora || '17:00'}:00${d.zonaHoraria || '-06:00'}`
    };
  }
  function fechaTexto(iso) {
    if (!iso) return '';
    const [y, m, dd] = iso.split('-').map(Number);
    return `${dd} de ${MESES[m - 1].toLowerCase()} de ${y}`;
  }
  function iniciales(d) {
    return (d.iniciales && d.iniciales.trim()) ||
      `${(d.novia || 'A').trim()[0] || ''} & ${(d.novio || 'B').trim()[0] || ''}`;
  }
  function enlaceCalendario(d) {
    const f = fechaInfo(d);
    const ini = new Date(f.iso);
    if (isNaN(ini)) return '#';
    const fin = new Date(ini.getTime() + 9 * 36e5);
    const z = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const recepcion = (d.lugares || [])[1] || (d.lugares || [])[0] || {};
    const q = new URLSearchParams({
      action: 'TEMPLATE', text: `Boda ${d.novia} & ${d.novio}`, dates: `${z(ini)}/${z(fin)}`,
      location: [recepcion.nombre, recepcion.direccion].filter(Boolean).join(', ').replace(/\n/g, ' '),
      details: '¡Te esperamos!'
    });
    return 'https://calendar.google.com/calendar/render?' + q.toString();
  }
  function enlaceMapa(l) {
    if (l.mapa && l.mapa.trim()) return l.mapa.trim();
    return 'https://maps.google.com/?q=' + encodeURIComponent([l.nombre, (l.direccion || '').replace(/\n/g, ' ')].join(' '));
  }

  // ---------------------------------------------------------------------------
  // Íconos (trazo fino, heredan color)
  // ---------------------------------------------------------------------------
  const I = (p, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
  const ICONOS = {
    iglesia: I('<path d="M12 2v4M10 4h4M5 22V11l7-5 7 5v11M9 22v-6a3 3 0 016 0v6M3 22h18"/>'),
    anillos: I('<circle cx="9" cy="14" r="6"/><circle cx="15" cy="14" r="6"/><path d="M10 4l2 3 2-3"/>'),
    copa: I('<path d="M8 2h8l-1 7a3 3 0 01-6 0zM12 12v8M8 22h8"/>'),
    brindis: I('<path d="M5 3h5l-.5 5a2 2 0 01-4 0zM14 3h5l.5 5a2 2 0 01-4 0zM7.5 10v9M16.5 10v9M5 21h5M14 21h5"/>'),
    cena: I('<path d="M3 11h18M5 11a7 7 0 0114 0M12 4V2M4 15h16M7 15v5M17 15v5"/>'),
    musica: I('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'),
    pastel: I('<path d="M4 21h16M5 21v-7h14v7M7 14v-4h10v4M12 10V7M12 4.5a1 1 0 010 2"/>'),
    foto: I('<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>'),
    luna: I('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'),
    auto: I('<path d="M3 16v-4l2-5h14l2 5v4zM3 16v3M21 16v3M7 12h10"/><circle cx="7" cy="16" r="1.5"/><circle cx="17" cy="16" r="1.5"/>'),
    corazon: I('<path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.5-8 11-8 11z"/>'),
    mapa: I('<path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    calendario: I('<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    regalo: I('<path d="M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-4-7-4-6-1 1 2 6 1 6 1zm0 0c2-4 7-4 6-1-1 2-6 1-6 1z"/>'),
    bolsa: I('<path d="M4 7h16l-1 13H5zM9 7V5a3 3 0 016 0v2"/>'),
    banco: I('<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>'),
    sobre: I('<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>'),
    hacienda: I('<path d="M2 21h20M4 21V10h16v11M2 10l10-6 10 6M8 21v-5a2 2 0 014 0v5M14 14h3v3h-3z"/>'),
    flecha: I('<path d="M6 9l6 6 6-6"/>'),
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>',
    traje: '<svg viewBox="0 0 70 110" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M27 6l8 8 8-8M27 6l-11 6-4 28 8 2 2 64h26l2-64 8-2-4-28-11-6"/><path d="M35 14l-5 16 5 6 5-6-5-16M31 20l4 3 4-3"/><circle cx="35" cy="48" r="1"/><circle cx="35" cy="58" r="1"/></svg>',
    vestido: '<svg viewBox="0 0 70 110" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M28 6c0 8 2 14 7 18 5-4 7-10 7-18"/><path d="M28 6l-4 2 3 26-4 6-13 66h50L47 40l-4-6 3-26-4-2"/><path d="M24 40h22"/></svg>'
  };
  const ICONOS_EVENTO = ['iglesia', 'anillos', 'copa', 'brindis', 'cena', 'musica', 'pastel', 'foto', 'auto', 'corazon', 'luna'];
  const ICONOS_REGALO = ['regalo', 'bolsa', 'banco', 'sobre', 'corazon'];

  // ---------------------------------------------------------------------------
  // Datos por defecto (se mezclan con los de cada boda)
  // ---------------------------------------------------------------------------
  const SECCIONES = ['frase', 'familia', 'cuenta', 'itinerario', 'ubicacion', 'vestimenta', 'historia', 'regalos', 'hospedaje', 'rsvp', 'deseos', 'canciones', 'contactos', 'cierre'];
  function normalizar(d) {
    d = JSON.parse(JSON.stringify(d || {}));
    const def = {
      plantilla: 'floral', novia: 'Novia', novio: 'Novio', iniciales: '',
      fecha: '2027-03-20', hora: '17:00', zonaHoraria: '-06:00', ciudad: '',
      introPortada: 'Nos casamos', fotoPortada: '',
      frase: '', fraseAutor: '',
      tituloFamilia: 'Con la bendición de Dios y de nuestros padres',
      textoFamilia: 'tenemos el honor de invitarte a celebrar la unión de nuestras vidas',
      padresNovia: '', padresNovio: '', padrinos: [],
      itinerario: [], lugares: [],
      vestimenta: { tipo: 'Formal', texto: '', colores: [], nota: '' },
      historia: { titulo: 'Nuestra historia', texto: '', fotos: [] },
      regalos: { titulo: 'Tu presencia es nuestro mejor regalo', texto: '', opciones: [], banco: '', titular: '', clabe: '' },
      rsvp: { whatsapp: '', fechaLimite: '', pases: 2, texto: '' },
      hospedaje: [], contactos: { novia: '', novio: '' },
      invitados: [], mesas: { activo: false, texto: '', lista: [], elementos: [] },
      hashtag: '', nota: '', despedida: 'Gracias por ser parte de nuestra historia',
      musica: 'melodia', adornos: {}, ocultar: {}, encuadres: {}
    };
    for (const k in def) {
      if (d[k] == null) d[k] = def[k];
      else if (typeof def[k] === 'object' && !Array.isArray(def[k])) d[k] = Object.assign({}, def[k], d[k]);
    }
    return d;
  }

  // ---------------------------------------------------------------------------
  // Secciones comunes. Cada plantilla las acomoda y decora a su gusto.
  // opts: { clase, antes, despues, titulo }
  // ---------------------------------------------------------------------------
  function seccion(id, interior, opts = {}) {
    return `<section id="${id}" class="sec sec-${id} ${opts.clase || ''}">${opts.antes || ''}<div class="cont">${interior}</div>${opts.despues || ''}</section>`;
  }
  const encabezado = (eyebrow, titulo, lead) =>
    `${eyebrow ? `<p class="eyebrow rv">${esc(eyebrow)}</p>` : ''}<h2 class="titulo rv">${esc(titulo)}</h2>${lead ? `<p class="lead rv">${br(lead)}</p>` : ''}`;

  /** Adorno reemplazable: usa la imagen subida (o plantillas/adornos/<plantilla>-<slot>.png) y si no existe, el dibujo SVG. */
  function adorno(d, slot, fallback, clase = '') {
    const src = (d.adornos && d.adornos[slot]) || (d._rutaAdornos != null ? `${d._rutaAdornos}${d.plantilla}-${slot}.png` : '');
    const img = src ? `<img src="${esc(src)}" alt="" onerror="this.remove()">` : '';
    return `<span class="orn orn-${slot} ${clase}" aria-hidden="true">${img}<span class="fb">${fallback || ''}</span></span>`;
  }

  const S = {
    esc, br, lineas, hay, fechaInfo, iniciales, ICONOS, adorno, seccion, encabezado,

    sobre(d, o = {}) {
      return `
<div id="sobre" class="sobre-pantalla${o.portada ? ' en-portada' : ''}" ${o.portada ? '' : 'role="dialog"'} aria-label="Abrir invitación">
  ${o.fondo || ''}
  <p class="sobre-para">${esc(o.textoPara || 'Una invitación especial para')}<strong data-invitado-nombre>ti</strong></p>
  <div class="sobre" tabindex="0" role="button" aria-label="Abrir sobre">
    <div class="sobre-atras"></div>
    <div class="sobre-carta">${o.carta || `<small>${esc(d.introPortada || 'Nos casamos')}</small><span>${esc(iniciales(d))}</span><small>${fechaInfo(d).corta}</small>`}</div>
    <div class="sobre-frente"></div>
    <div class="sobre-solapa"><div class="solapa-fuera"></div><div class="solapa-dentro">${o.forro || ''}</div></div>
    <div class="sello">${o.selloExtra || ''}${[1, 2].map(n => `<span class="mitad mitad-${n}">${o.sello || esc(iniciales(d)).replace(/&amp;/, '<i>&amp;</i>')}</span>`).join('')}</div>
  </div>
  <p class="sobre-pista">${esc(o.pista || 'Toca el sello para abrir')}</p>
</div>
<button id="btn-musica" class="btn-musica" aria-label="Pausar o reproducir música">${ICONOS.musica}</button>`;
    },

    nombres(d, tag = 'h1', amp = '&amp;') {
      return `<${tag} class="nombres"><span class="n1">${esc(d.novia)}</span><span class="amp">${amp}</span><span class="n2">${esc(d.novio)}</span></${tag}>`;
    },

    fechaBloque(d) {
      const f = fechaInfo(d);
      return `<div class="fecha-bloque"><span class="lado">${f.diaSemana}</span><span class="dia">${f.dia}<small>${f.mes}</small></span><span class="lado">${f.anio}</span></div>`;
    },

    frase(d, o = {}) {
      if (!hay(d.frase) || d.ocultar.frase) return '';
      return seccion('frase', `${o.arriba || ''}<blockquote class="rv">“${br(d.frase)}”</blockquote>${hay(d.fraseAutor) ? `<cite class="rv">${esc(d.fraseAutor)}</cite>` : ''}`, o);
    },

    familia(d, o = {}) {
      if (d.ocultar.familia) return '';
      const [t1, ...t2] = String(d.tituloFamilia).split(' y de ');
      const titulo = t2.length ? `<p class="eyebrow rv">${esc(t1)}</p><h2 class="titulo rv">y de ${esc(t2.join(' y de '))}</h2>` : `<h2 class="titulo rv">${esc(d.tituloFamilia)}</h2>`;
      const padres = (hay(d.padresNovia) || hay(d.padresNovio)) ? `<div class="padres">
        ${hay(d.padresNovia) ? `<div class="rv"><h3>Padres de la novia</h3><p>${lineas(d.padresNovia).map(esc).join('<br>')}</p></div>` : ''}
        ${hay(d.padresNovio) ? `<div class="rv"><h3>Padres del novio</h3><p>${lineas(d.padresNovio).map(esc).join('<br>')}</p></div>` : ''}
      </div>` : '';
      const pad = (d.padrinos || []).filter(p => hay(p.nombres));
      const padrinos = pad.length ? `<div class="padrinos">${pad.map(p => `<div class="rv"><h3>${esc(p.rol)}</h3><p>${br(p.nombres)}</p></div>`).join('')}</div>` : '';
      return seccion('familia', `${o.arriba || ''}${titulo}${hay(d.textoFamilia) ? `<p class="lead rv">${br(d.textoFamilia)}</p>` : ''}${padres}${padrinos}`, o);
    },

    reloj(cortas) {
      const u = (id, l) => `<div><span data-cd="${id}">00</span><small>${l}</small></div>`;
      const n = cortas ? ['D', 'H', 'M', 'S'] : ['Días', 'Horas', 'Minutos', 'Segundos'];
      return `<div class="reloj rv">${u('d', n[0])}<b>:</b>${u('h', n[1])}<b>:</b>${u('m', n[2])}<b>:</b>${u('s', n[3])}</div>`;
    },
    enlaceCalendario, enlaceMapa,

    cuenta(d, o = {}) {
      if (d.ocultar.cuenta) return '';
      return seccion('cuenta', `${encabezado('Faltan', o.titulo || 'para el gran día')}
        ${S.reloj()}
        <a class="btn rv" target="_blank" rel="noopener" href="${esc(enlaceCalendario(d))}">${ICONOS.calendario}Agendar en calendario</a>`, Object.assign({ clase: 'oscura' }, o));
    },

    itinerario(d, o = {}) {
      const it = (d.itinerario || []).filter(x => hay(x.evento));
      if (!it.length || d.ocultar.itinerario) return '';
      return seccion('itinerario', `${encabezado('Itinerario', o.titulo || 'Programa del día')}
        <div class="linea">${it.map(x => `<div class="evento rv">
          <div class="hora">${esc(x.hora)}</div>
          <div class="icono">${ICONOS[x.icono] || ICONOS.corazon}</div>
          <div class="que">${esc(x.evento)}${hay(x.detalle) ? `<small>${esc(x.detalle)}</small>` : ''}</div>
        </div>`).join('')}</div>`, o);
    },

    ubicacion(d, o = {}) {
      const ls = (d.lugares || []).filter(x => hay(x.nombre));
      if (!ls.length || d.ocultar.ubicacion) return '';
      return seccion('ubicacion', `${encabezado('Dónde', o.titulo || 'Ubicación')}
        <div class="lugares n${ls.length}">${ls.map((l, i) => `<div class="lugar rv">
          ${o.decoLugar ? o.decoLugar(i) : `<div class="lugar-icono">${ICONOS[l.icono] || (i === 0 ? ICONOS.iglesia : ICONOS.hacienda)}</div>`}
          <h3>${esc(l.tipo)}</h3>
          ${hay(l.hora) ? `<p class="lugar-hora">${esc(l.hora)} hrs</p>` : ''}
          <p class="lugar-nombre">${esc(l.nombre)}</p>
          <p class="lugar-dir">${br(l.direccion)}</p>
          <a class="btn" target="_blank" rel="noopener" href="${esc(enlaceMapa(l))}">${ICONOS.mapa}Ver mapa</a>
        </div>`).join('')}</div>`, o);
    },

    vestimenta(d, o = {}) {
      const v = d.vestimenta || {};
      if (!hay(v.tipo) || d.ocultar.vestimenta) return '';
      const col = (v.colores || []).filter(Boolean);
      return seccion('vestimenta', `${encabezado('Código de vestimenta', v.tipo)}
        <div class="figuras rv"><figure>${ICONOS.traje}<figcaption>Traje</figcaption></figure><figure>${ICONOS.vestido}<figcaption>Vestido largo</figcaption></figure></div>
        ${hay(v.texto) ? `<p class="rv">${br(v.texto)}</p>` : ''}
        ${col.length ? `<div class="paleta rv">${col.map(c => `<span style="background:${esc(c)}"></span>`).join('')}</div>` : ''}
        ${hay(v.nota) ? `<p class="nota rv">${br(v.nota)}</p>` : ''}`, o);
    },

    historia(d, o = {}) {
      const h = d.historia || {};
      const fotos = h.fotos || [];
      if ((!fotos.length && !hay(h.texto)) || d.ocultar.historia) return '';
      return seccion('historia', `${encabezado('Momentos', h.titulo, h.texto)}
        ${fotos.length ? `<div class="galeria g${Math.min(fotos.length, 6)}">${fotos.map((f, i) => `<figure class="foto rv${f.src ? '' : ' vacia'}" ${f.src ? `data-zoom="${esc(f.src)}"` : ''}>
          ${f.src ? `<img src="${esc(f.src)}" alt="${esc(f.pie || 'Foto ' + (i + 1))}" loading="lazy">` : `<span class="foto-hueco">${ICONOS.foto}</span>`}
          ${hay(f.pie) ? `<figcaption>${esc(f.pie)}</figcaption>` : ''}
        </figure>`).join('')}</div>` : ''}`, o);
    },

    regalos(d, o = {}) {
      const r = d.regalos || {};
      const ops = (r.opciones || []).filter(x => hay(x.nombre));
      if ((!ops.length && !hay(r.clabe)) || d.ocultar.regalos) return '';
      const clabe = String(r.clabe || '').replace(/\s/g, '');
      return seccion('regalos', `${encabezado('Mesa de regalos', r.titulo, r.texto)}
        ${ops.length ? `<div class="regalos n${ops.length}">${ops.map(x => {
          const tag = hay(x.enlace) ? `a href="${esc(x.enlace)}" target="_blank" rel="noopener"` : 'div';
          return `<${tag} class="regalo rv">${ICONOS[x.icono] || ICONOS.regalo}<h4>${esc(x.nombre)}</h4>${hay(x.detalle) ? `<p>${esc(x.detalle)}</p>` : ''}</${tag.split(' ')[0]}>`;
        }).join('')}</div>` : ''}
        ${clabe ? `<p class="banco rv">${hay(r.banco) ? esc(r.banco) + ' · ' : ''}CLABE: <code>${esc(clabe.replace(/(\d{4})(?=\d)/g, '$1 '))}</code><button class="copiar" data-copiar="${esc(clabe)}">Copiar</button>${hay(r.titular) ? `<br>${esc(r.titular)}` : ''}</p>` : ''}`, o);
    },

    formRsvp(d) {
      const r = d.rsvp || {};
      return `<form id="form-rsvp" class="rv" novalidate>
          <label for="f-nombre">Nombre completo</label>
          <input type="text" id="f-nombre" placeholder="Tu nombre" autocomplete="name">
          <label>¿Nos acompañarás?</label>
          <div class="opciones">
            <input type="radio" name="asiste" id="asiste-si" value="si" checked><label for="asiste-si">Sí, ahí estaré</label>
            <input type="radio" name="asiste" id="asiste-no" value="no"><label for="asiste-no">No podré asistir</label>
          </div>
          <div id="caja-pases"><label for="f-pases">Número de asistentes</label><select id="f-pases"></select></div>
          <label for="f-msg">Mensaje para los novios (opcional)</label>
          <textarea id="f-msg" placeholder="Escribe unas palabras…"></textarea>
          <button class="btn solido" type="submit">${ICONOS.whatsapp}Confirmar por WhatsApp</button>
          ${hay(r.fechaLimite) ? `<p class="limite">Agradeceremos tu confirmación antes del ${esc(fechaTexto(r.fechaLimite))}</p>` : ''}
        </form>`;
    },

    rsvp(d, o = {}) {
      const r = d.rsvp || {};
      if (d.ocultar.rsvp) return '';
      return seccion('rsvp', `${encabezado('R.S.V.P.', o.titulo || 'Confirma tu asistencia', r.texto)}
        <div class="pase rv"><strong data-invitado-nombre>Querido invitado</strong>Hemos reservado <b data-pases>${esc(r.pases || 2)}</b> <span data-pases-palabra>lugares</span> en tu honor<em class="pase-mesa" data-mesa-pase hidden></em></div>
        ${S.formRsvp(d)}`, o);
    },

    hospedaje(d, o = {}) {
      const hs = (d.hospedaje || []).filter(h => hay(h.nombre));
      if (!hs.length || d.ocultar.hospedaje) return '';
      return seccion('hospedaje', `${encabezado('Para nuestros invitados', o.titulo || 'Hospedaje')}
        <div class="hoteles">${hs.map(h => `<div class="hotel rv"><h4>${esc(h.nombre)}</h4>${hay(h.nota) ? `<p class="hotel-nota">${br(h.nota)}</p>` : ''}${hay(h.direccion) ? `<p class="hotel-dir">${br(h.direccion)}</p>` : ''}<a class="btn" target="_blank" rel="noopener" href="${esc(enlaceMapa(h))}">${ICONOS.mapa}Ver ubicación</a></div>`).join('')}</div>`, o);
    },

    /** Formulario corto que se envía por WhatsApp (buenos deseos, canciones). */
    formWhats(d, tipo, o) {
      return `<form class="form-whats" data-whats="${tipo}" novalidate>
        <input type="text" name="nombre" placeholder="Tu nombre" autocomplete="name" data-nombre-invitado>
        ${tipo === 'cancion' ? '<input type="text" name="texto" placeholder="Canción y artista">' : '<textarea name="texto" placeholder="Escribe tus buenos deseos…"></textarea>'}
        <button class="btn solido" type="submit">${ICONOS.whatsapp}${esc(o.boton)}</button>
      </form>`;
    },
    deseos(d, o = {}) {
      if (d.ocultar.deseos || !hay(d.rsvp.whatsapp)) return '';
      return seccion('deseos', `${encabezado('Déjanos un mensaje', o.titulo || 'Buenos deseos', o.texto || 'Tus palabras serán un recuerdo para siempre')}${S.formWhats(d, 'deseo', { boton: 'Enviar mis buenos deseos' })}`, o);
    },
    canciones(d, o = {}) {
      if (d.ocultar.canciones || !hay(d.rsvp.whatsapp)) return '';
      return seccion('canciones', `${encabezado('¡Que no pare la fiesta!', o.titulo || 'Sugiere una canción', o.texto || '¿Qué canción no puede faltar en la pista?')}${S.formWhats(d, 'cancion', { boton: 'Enviar canción' })}`, o);
    },
    contactos(d, o = {}) {
      const c = d.contactos || {};
      if (d.ocultar.contactos || (!hay(c.novia) && !hay(c.novio))) return '';
      const b = (num, quien) => hay(num) ? `<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${esc(String(num).replace(/\D/g, ''))}">${ICONOS.whatsapp}${esc(quien)}</a>` : '';
      return seccion('contactos', `${encabezado('¿Tienes dudas?', o.titulo || 'Contactos')}<div class="contactos rv">${b(c.novia, d.novia)}${b(c.novio, d.novio)}</div>`, o);
    },
    /** Hospedaje, buenos deseos, canciones y contactos juntos. */
    /** Plano del salón con las mesas (paquete opcional "Mesas"). */
    plano(d) {
      const m = d.mesas || {};
      const ETQ = { pista: 'Pista', novios: 'Novios', entrada: 'Entrada', barra: 'Barra', dj: 'DJ', pastel: 'Pastel' };
      return `<div class="plano">
        ${(m.elementos || []).map(x => `<div class="pl-el pl-${esc(x.tipo)}" style="left:${+x.x || 0}%;top:${+x.y || 0}%;width:${+x.w || 20}%;height:${+x.h || 15}%"><span>${esc(x.texto || ETQ[x.tipo] || '')}</span></div>`).join('')}
        ${(m.lista || []).map(x => `<div class="pl-mesa ${x.forma === 'rectangular' ? 'rect' : ''}" data-mesa="${esc(x.nombre)}" style="left:${+x.x || 0}%;top:${+x.y || 0}%"><span>${esc(x.nombre)}</span></div>`).join('')}
      </div>`;
    },
    mesa(d, o = {}) {
      const m = d.mesas || {};
      if (!m.activo || !(m.lista || []).length) return '';
      return seccion('mesa', `${encabezado('Su lugar', o.titulo || 'Tu mesa')}
        <p class="mesa-txt rv"><span data-invitado-nombre>Querido invitado</span>, te esperamos en la</p>
        <p class="mesa-num rv" data-mesa-nombre></p>
        ${hay(m.texto) ? `<p class="lead rv">${br(m.texto)}</p>` : ''}
        <div class="rv">${S.plano(d)}</div>`, Object.assign({}, o, { clase: (o.clase || '') + ' sin-mesa' }));
    },

    extras(d, o = {}) {
      return S.mesa(d, o.mesa) + S.hospedaje(d, o.hospedaje) + S.deseos(d, o.deseos) + S.canciones(d, o.canciones) + S.contactos(d, o.contactos);
    },

    cierre(d, o = {}) {
      if (d.ocultar.cierre) return '';
      return `${(hay(d.hashtag) || hay(d.nota)) ? seccion('compartir', `${o.separador || ''}
          ${hay(d.hashtag) ? `<p class="eyebrow rv">Comparte tus fotos</p><p class="hashtag rv">${esc(d.hashtag)}</p>` : ''}
          ${hay(d.nota) ? `<p class="nota rv">${br(d.nota)}</p>` : ''}`, {}) : ''}
        <footer class="pie ${o.clase || ''}">${o.antes || ''}
          <p class="rv">${esc(d.despedida)}</p>
          ${S.nombres(d, 'p')}
          <p class="pie-fecha rv">${fechaInfo(d).corta}</p>
        </footer>`;
    }
  };

  // ---------------------------------------------------------------------------
  // CSS base: estructura común. Cada plantilla define colores, fuentes y adornos.
  // Variables: --fondo --fondo2 --tinta --suave --acento --acento2 --linea --oscuro --sobre-oscuro
  //            --f-titulo --f-texto --f-etiqueta
  // ---------------------------------------------------------------------------
  const CSS_BASE = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--fondo);color:var(--tinta);font-family:var(--f-texto);font-size:19px;line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.bloqueado{overflow:hidden;height:100vh}
img{max-width:100%;display:block}
main{position:relative;z-index:1}
.sec{padding:96px 24px;text-align:center;position:relative;overflow:hidden}
.cont{max-width:760px;margin:0 auto;position:relative;z-index:2}
.eyebrow{font-family:var(--f-etiqueta);font-size:11px;font-weight:500;letter-spacing:.4em;text-transform:uppercase;color:var(--acento);margin-bottom:14px}
.titulo{font-family:var(--f-titulo);font-weight:400;font-size:clamp(44px,11vw,68px);color:var(--titulo,var(--tinta));line-height:1.1;margin-bottom:22px}
.lead{font-size:21px;font-style:italic;color:var(--suave);max-width:560px;margin:0 auto}
.nota{font-size:17px;font-style:italic;color:var(--suave);margin-top:14px}
.btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--f-etiqueta);font-size:11px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;padding:15px 30px;border-radius:var(--radio-btn,40px);text-decoration:none;cursor:pointer;border:1px solid var(--acento2);color:var(--acento2);background:transparent;transition:all .35s ease}
.btn:hover{background:var(--acento2);color:var(--fondo)}
.btn.solido{background:var(--acento2);color:var(--fondo)}
.btn.solido:hover{filter:brightness(.9)}
.btn svg{width:15px;height:15px}
.oscura{background:var(--oscuro);color:var(--sobre-oscuro)}
.oscura .titulo{color:var(--sobre-oscuro)}
.oscura .btn{border-color:var(--acento);color:var(--acento)}
.oscura .btn:hover{background:var(--acento);color:var(--oscuro)}
.rv{opacity:0;transform:translateY(30px);transition:opacity 1.1s ease,transform 1.1s ease}
.rv.vis{opacity:1;transform:none}
.sin-anim .rv{opacity:1;transform:none;transition:none}
.encuadre{display:block;overflow:hidden;width:100%;height:100%}
.encuadre>img{width:100%;height:100%;object-fit:cover}
.orn{display:block;pointer-events:none}
.orn>img{width:100%;height:auto}
.orn>img+.fb{display:none}
.orn .fb svg{width:100%;height:auto;display:block}

/* Sobre: 1) el sello se rompe  2) la solapa se abre en 3D  3) sale la carta  4) la carta se acerca y aparece la invitación */
.sobre-pantalla{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:var(--fondo-sobre,var(--fondo));overflow:hidden}
.sobre-pantalla.abierto{animation:pantallaFuera .7s ease 3s forwards;pointer-events:none}
.sobre-pantalla.fin,.sin-sobre .sobre-pantalla{display:none}
@keyframes pantallaFuera{to{opacity:0}}
.sobre-para{font-style:italic;font-size:22px;color:var(--suave);text-align:center;padding:0 16px;position:relative;z-index:2;transition:opacity .6s ease,transform .6s ease}
.sobre-para strong{display:block;font-family:var(--f-titulo);font-style:normal;font-weight:400;font-size:42px;color:var(--titulo,var(--tinta));line-height:1.25}
.sobre-pista{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--suave);animation:pulso 2.4s ease-in-out infinite;position:relative;z-index:2;transition:opacity .4s ease}
.abierto .sobre-para{opacity:0;transform:translateY(-20px)}
.abierto .sobre-pista{opacity:0;animation:none}
@keyframes pulso{0%,100%{opacity:.45}50%{opacity:1}}
.sobre{position:relative;width:min(370px,86vw);aspect-ratio:1.45;cursor:pointer;z-index:2;perspective:1100px;animation:flotarSobre 3.2s ease-in-out infinite}
.abierto .sobre{animation:none;cursor:default}
@keyframes flotarSobre{0%,100%{transform:translateY(0) rotate(-.6deg)}50%{transform:translateY(-8px) rotate(.6deg)}}
.sobre-atras{position:absolute;inset:0;background:var(--sobre-c1);border-radius:4px;box-shadow:0 26px 40px -12px rgba(40,25,10,.35),0 4px 10px rgba(40,25,10,.12)}
.sobre-carta{position:absolute;left:6%;right:6%;top:6%;bottom:5%;z-index:2;background:var(--fondo);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:var(--titulo,var(--tinta));box-shadow:0 4px 18px rgba(40,25,10,.18);outline:1px solid var(--linea);outline-offset:-8px;opacity:0}
.abierto .sobre-carta{opacity:1;transition:opacity .15s ease .5s}
.sobre-carta span{font-family:var(--f-titulo);font-size:clamp(28px,8.5vw,40px);line-height:1.1}
.sobre-carta small{font-family:var(--f-etiqueta);font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:var(--acento)}
.sobre-frente{position:absolute;inset:0;z-index:3;border-radius:4px;overflow:hidden;background:linear-gradient(to top right,var(--sobre-c2) 49.6%,transparent 50%) left/50.5% 100% no-repeat,linear-gradient(to top left,var(--sobre-c2) 49.6%,transparent 50%) right/50.5% 100% no-repeat}
.sobre-frente::after{content:"";position:absolute;left:0;right:0;bottom:0;height:58%;background:var(--sobre-c3);clip-path:polygon(0 100%,50% 8%,100% 100%)}
.sobre-solapa{position:absolute;left:0;right:0;top:0;height:62%;z-index:5;transform-origin:50% 0;transform-style:preserve-3d}
.solapa-fuera,.solapa-dentro{position:absolute;inset:0;clip-path:polygon(0 0,100% 0,50% 100%);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
.solapa-fuera{background:var(--sobre-solapa,var(--sobre-c1));filter:drop-shadow(0 2px 2px rgba(0,0,0,.08))}
.solapa-fuera::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(0,0,0,.06))}
.solapa-dentro{transform:rotateY(180deg);background:var(--sobre-c3)}
.solapa-dentro>svg{width:100%;height:100%;display:block}
.sello{position:absolute;left:50%;top:62%;width:76px;height:76px;margin:-38px 0 0 -38px;z-index:6;font-family:var(--f-titulo);color:var(--sello-texto,#fff8e8);font-size:26px;white-space:nowrap;text-shadow:0 1px 1px rgba(0,0,0,.3)}
.sello::before{content:"";position:absolute;inset:-5px;border-radius:47% 53% 50% 50%/52% 48% 52% 48%;background:var(--sello-borde,rgba(0,0,0,.15));box-shadow:0 3px 8px rgba(0,0,0,.25);transition:opacity .25s ease .3s}
.sello::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--acento);opacity:0;animation:aro 2.4s ease-out infinite}
@keyframes aro{0%{transform:scale(.9);opacity:.7}80%,100%{transform:scale(1.6);opacity:0}}
.sello i{font-style:normal;font-size:.7em;margin:0 2px}
.mitad{position:absolute;inset:0;border-radius:50%;background:var(--sello);box-shadow:inset 0 0 0 5px rgba(255,255,255,.08),inset 0 0 0 7px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center}
.mitad-1{clip-path:polygon(0 0,52% 0,46% 22%,56% 40%,44% 60%,55% 78%,48% 100%,0 100%)}
.mitad-2{clip-path:polygon(52% 0,100% 0,100% 100%,48% 100%,55% 78%,44% 60%,56% 40%,46% 22%)}
.abierto .sello{animation:temblar .28s ease}
.abierto .sello::before{opacity:0}
.abierto .sello::after{animation:none;opacity:0}
.abierto .mitad-1{animation:mitad1 .8s cubic-bezier(.3,.6,.5,1) .26s forwards}
.abierto .mitad-2{animation:mitad2 .8s cubic-bezier(.3,.6,.5,1) .26s forwards}
@keyframes temblar{20%{transform:rotate(-7deg)}45%{transform:rotate(6deg)}70%{transform:rotate(-3deg)}100%{transform:none}}
@keyframes mitad1{to{transform:translate(-60px,70px) rotate(-50deg);opacity:0}}
@keyframes mitad2{to{transform:translate(58px,80px) rotate(42deg);opacity:0}}
.abierto .sobre-solapa{animation:abrirSolapa .85s cubic-bezier(.45,.05,.3,1) .45s forwards}
@keyframes abrirSolapa{0%{transform:rotateX(0);z-index:5}55%{z-index:5}56%{z-index:1}100%{transform:rotateX(180deg);z-index:1}}
.abierto .sobre-carta{animation:sacarCarta 2.3s ease-in-out 1.1s forwards}
@keyframes sacarCarta{0%{transform:none;opacity:1}40%{transform:translateY(-64%)}68%{transform:translateY(-64%) scale(1.02);z-index:2;opacity:1}69%{z-index:7}100%{transform:translateY(-15%) scale(1.7);z-index:7;opacity:0}}
.abierto .sobre-atras,.abierto .sobre-frente{animation:bajarSobre .8s ease-in 2.6s forwards}
@keyframes bajarSobre{to{translate:0 70px;opacity:0}}
.abierto .solapa-dentro{animation:bajarSobreDentro .8s ease-in 2.6s forwards}
@keyframes bajarSobreDentro{to{transform:rotateY(180deg) translateY(-70px);opacity:0}}
.chispa{position:absolute;left:50%;top:62%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:var(--acento);z-index:8;pointer-events:none;animation:chispa .9s cubic-bezier(.2,.7,.4,1) forwards}
@keyframes chispa{to{transform:translate(var(--x),var(--y)) scale(0);opacity:0}}

.btn-musica{position:fixed;right:18px;bottom:18px;z-index:50;width:50px;height:50px;border-radius:50%;border:1px solid var(--acento);background:var(--fondo);color:var(--acento);cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.12)}
.btn-musica.ver{display:flex}
.btn-musica svg{width:20px;height:20px}
.btn-musica.sonando svg{animation:girar 6s linear infinite}
@keyframes girar{to{transform:rotate(360deg)}}

/* Portada */
.portada{min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:70px 20px;position:relative;overflow:hidden;text-align:center}
.nombres{font-family:var(--f-titulo);font-weight:400;color:var(--titulo,var(--tinta));font-size:clamp(60px,16vw,110px);line-height:1;margin:24px 0 12px}
.nombres span{display:block}
.nombres .amp{font-size:.45em;color:var(--acento);margin:6px 0}
.fecha-bloque{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:28px}
.fecha-bloque .lado{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.3em;text-transform:uppercase;padding:8px 0;border-top:1px solid var(--linea);border-bottom:1px solid var(--linea);width:100px}
.fecha-bloque .dia{font-size:58px;font-weight:300;line-height:1}
.fecha-bloque .dia small{display:block;font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.3em;text-transform:uppercase;margin-top:6px}
.bajar{position:absolute;bottom:22px;left:50%;color:var(--acento);animation:flotar 2.2s ease-in-out infinite;z-index:3}
.bajar svg{width:24px;height:24px}
@keyframes flotar{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,8px)}}

/* Frase */
.sec-frase blockquote{font-size:clamp(22px,5.4vw,30px);font-style:italic;font-weight:300;line-height:1.5;color:var(--titulo,var(--tinta))}
.sec-frase cite{display:block;margin-top:18px;font-family:var(--f-etiqueta);font-style:normal;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--acento)}

/* Familia */
.padres{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:34px}
.sec-familia h3{font-family:var(--f-etiqueta);font-size:11px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:var(--acento);margin-bottom:10px}
.padres p{font-size:21px;line-height:1.5}
.padrinos{display:flex;flex-wrap:wrap;justify-content:center;gap:24px 40px;margin-top:44px;padding-top:38px;border-top:1px solid var(--linea)}
.padrinos>div{min-width:160px}
.padrinos p{font-size:18px}

/* Cuenta */
.reloj{display:flex;justify-content:center;align-items:flex-start;gap:clamp(8px,3.5vw,34px);margin:16px 0 40px}
.reloj span{display:block;font-size:clamp(40px,11vw,68px);font-weight:300;line-height:1;font-variant-numeric:lining-nums tabular-nums}
.reloj small{display:block;margin-top:10px;font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--acento)}
.reloj b{font-weight:300;font-size:clamp(34px,9vw,54px);color:var(--acento);line-height:1}

/* Itinerario */
.linea{position:relative;max-width:580px;margin:40px auto 0}
.linea::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(var(--linea),var(--linea) 88%,transparent)}
.evento{display:grid;grid-template-columns:1fr 64px 1fr;align-items:center;margin-bottom:38px}
.evento .hora{font-size:30px;font-weight:300;color:var(--titulo,var(--tinta));text-align:right}
.evento .icono{width:54px;height:54px;margin:0 auto;border-radius:50%;position:relative;z-index:1;background:var(--fondo);border:1px solid var(--linea);color:var(--acento2);display:flex;align-items:center;justify-content:center}
.evento .icono svg{width:24px;height:24px}
.evento .que{text-align:left;font-size:20px;line-height:1.35}
.evento .que small{display:block;font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--suave);margin-top:4px}
.evento:nth-child(even) .hora{order:3;text-align:left}
.evento:nth-child(even) .que{order:1;text-align:right}
.evento:nth-child(even) .icono{order:2}

/* Ubicación */
.lugares{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:26px;margin-top:30px}
.lugar{background:var(--tarjeta,var(--fondo));padding:42px 26px 34px;border:1px solid var(--linea);position:relative}
.lugar-icono{width:60px;height:60px;margin:0 auto 14px;color:var(--acento)}
.lugar-icono svg{width:100%;height:100%;stroke-width:.9}
.lugar h3{font-family:var(--f-titulo);font-weight:400;font-size:40px;color:var(--titulo,var(--tinta));line-height:1.1}
.lugar-hora{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:var(--acento);margin:6px 0 14px}
.lugar-nombre{font-size:21px;font-weight:600}
.lugar-dir{font-size:17px;color:var(--suave);margin:4px 0 24px}
.lugar .btn{padding:13px 22px}

/* Vestimenta */
.figuras{display:flex;justify-content:center;gap:50px;margin:30px 0 24px;color:var(--acento2)}
.figuras svg{width:70px;height:110px}
.figuras figcaption{font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--suave);margin-top:8px}
.paleta{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:20px}
.paleta span{width:36px;height:36px;border-radius:50%;border:3px solid var(--fondo);box-shadow:0 0 0 1px var(--linea)}

/* Galería */
.galeria{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:36px auto 0;max-width:900px}
.galeria.g1{grid-template-columns:1fr;max-width:520px}
.galeria.g2,.galeria.g4{grid-template-columns:repeat(2,1fr)}
.foto{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--fondo2);cursor:zoom-in}
.foto img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s ease}
.foto:hover img{transform:scale(1.05)}
.foto figcaption{position:absolute;left:0;right:0;bottom:0;padding:30px 10px 12px;font-family:var(--f-titulo);font-size:24px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.45))}
.foto.vacia{cursor:default;display:flex;align-items:center;justify-content:center;border:1px dashed var(--linea)}
.foto-hueco{width:40px;color:var(--suave);opacity:.6}
.foto.vacia figcaption{background:none;color:var(--suave)}
.zoom{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out}
.zoom img{max-height:92vh;max-width:96vw;object-fit:contain}

/* Regalos */
.regalos{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin-top:34px}
.regalo{display:block;padding:30px 16px;border:1px solid var(--linea);background:var(--tarjeta,var(--fondo));color:inherit;text-decoration:none;transition:transform .4s ease,box-shadow .4s ease}
a.regalo:hover{transform:translateY(-5px);box-shadow:0 14px 30px rgba(0,0,0,.08)}
.regalo svg{width:36px;height:36px;color:var(--acento);margin:0 auto 12px}
.regalo h4{font-family:var(--f-etiqueta);font-size:11px;font-weight:500;letter-spacing:.22em;text-transform:uppercase}
.regalo p{font-size:16px;color:var(--suave);margin-top:6px}
.banco{margin-top:26px;font-size:17px;color:var(--suave)}
.banco code{font-family:var(--f-etiqueta);font-size:14px;color:var(--tinta);letter-spacing:.06em}
.copiar{background:none;border:none;color:var(--acento);cursor:pointer;font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.15em;text-transform:uppercase;text-decoration:underline;text-underline-offset:3px;margin-left:8px}

/* RSVP */
.pase{display:inline-block;margin:6px auto 30px;padding:18px 34px;border:1px dashed var(--acento);font-size:19px;background:var(--tarjeta,var(--fondo))}
.pase strong{display:block;font-family:var(--f-titulo);font-weight:400;font-size:36px;color:var(--titulo,var(--tinta));line-height:1.25}
.pase b{font-weight:600;color:var(--acento);font-size:24px}
#form-rsvp{max-width:460px;margin:0 auto;text-align:left}
#form-rsvp label{display:block;font-family:var(--f-etiqueta);font-size:10px;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--suave);margin:20px 0 8px}
#form-rsvp input[type=text],#form-rsvp select,#form-rsvp textarea{width:100%;padding:13px 16px;font-family:var(--f-texto);font-size:19px;color:var(--tinta);background:var(--tarjeta,var(--fondo));border:1px solid var(--linea);border-radius:2px;outline:none}
#form-rsvp input:focus,#form-rsvp select:focus,#form-rsvp textarea:focus{border-color:var(--acento)}
#form-rsvp textarea{resize:vertical;min-height:90px}
.opciones{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.opciones input{position:absolute;opacity:0;pointer-events:none}
#form-rsvp .opciones label{margin:0;padding:14px;text-align:center;border:1px solid var(--linea);background:var(--tarjeta,var(--fondo));cursor:pointer;font-size:11px;letter-spacing:.12em;color:var(--tinta);transition:all .3s}
#form-rsvp .opciones input:checked+label{background:var(--acento2);border-color:var(--acento2);color:var(--fondo)}
.opciones input:focus-visible+label{outline:2px solid var(--acento);outline-offset:2px}
#form-rsvp .btn{width:100%;justify-content:center;margin-top:30px}
.limite{font-size:16px;font-style:italic;color:var(--suave);text-align:center;margin-top:16px}

/* Hospedaje, deseos, canciones, contactos */
.hoteles{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin-top:28px}
.hotel{border:1px solid var(--linea);background:var(--tarjeta,var(--fondo));padding:28px 20px}
.hotel h4{font-family:var(--f-titulo);font-weight:400;font-size:30px;color:var(--titulo,var(--tinta));line-height:1.2}
.hotel-nota{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--acento);margin:6px 0}
.hotel-dir{font-size:16px;color:var(--suave);margin-bottom:18px}
.form-whats{max-width:440px;margin:26px auto 0;display:flex;flex-direction:column;gap:12px}
.form-whats input,.form-whats textarea{width:100%;padding:13px 16px;font-family:var(--f-texto);font-size:18px;color:var(--tinta);background:var(--tarjeta,var(--fondo));border:1px solid var(--linea);border-radius:2px;outline:none}
.form-whats textarea{min-height:100px;resize:vertical}
.form-whats .btn{justify-content:center}
.contactos{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:26px}

/* Sobre como portada (se queda abierto) */
.sobre-pantalla.en-portada{position:relative;inset:auto;z-index:2;min-height:100vh;min-height:100svh;background:none;overflow:visible}
.sobre-pantalla.en-portada.abierto{animation:none;pointer-events:auto}
.sin-sobre .sobre-pantalla.en-portada{display:flex}
.en-portada.ya *,.en-portada.ya *::before,.en-portada.ya *::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}
.en-portada .sobre-atras,.en-portada .sobre-frente{animation:none!important}

/* Mesas */
.sec-mesa.sin-mesa{display:none}
.mesa-txt{font-style:italic;color:var(--suave)}
.mesa-num{font-family:var(--f-titulo);font-size:clamp(46px,12vw,64px);line-height:1.1;color:var(--titulo,var(--tinta));margin:4px 0 14px}
.pase-mesa{display:block;font-style:normal;font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.25em;text-transform:uppercase;color:var(--acento);margin-top:6px}
.plano{position:relative;width:100%;max-width:520px;aspect-ratio:4/3;margin:24px auto 0;background:var(--tarjeta,var(--fondo));border:1px solid var(--linea);border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 6px var(--fondo2,transparent)}
.pl-el{position:absolute;display:flex;align-items:center;justify-content:center;border:1px dashed var(--linea);background:var(--fondo2,rgba(0,0,0,.04));color:var(--suave);font-family:var(--f-etiqueta);font-size:10px;letter-spacing:.2em;text-transform:uppercase;border-radius:4px}
.pl-pista{background:repeating-linear-gradient(45deg,var(--fondo2,#eee) 0 8px,var(--tarjeta,#fff) 8px 16px)}
.pl-novios{border-style:solid;border-color:var(--acento);color:var(--acento)}
.pl-mesa{position:absolute;width:9%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;border:1px solid var(--linea);background:var(--fondo);display:flex;align-items:center;justify-content:center;font-family:var(--f-etiqueta);font-size:clamp(8px,2.4vw,12px);color:var(--suave);transition:all .4s}
.pl-mesa.rect{width:15%;aspect-ratio:2.1;border-radius:4px}
.pl-mesa.tuya{background:var(--acento2);border-color:var(--acento2);color:var(--fondo);font-weight:600;z-index:2;animation:latido 1.6s ease-in-out infinite;box-shadow:0 0 0 0 var(--acento2)}
@keyframes latido{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--acento2) 60%,transparent)}70%{box-shadow:0 0 0 14px transparent}100%{box-shadow:0 0 0 0 transparent}}

/* Menú y botón para volver arriba */
.menu-btn,.arriba-btn{position:fixed;z-index:60;width:46px;height:46px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:var(--acento2);color:var(--fondo);box-shadow:0 6px 16px rgba(0,0,0,.18);transition:opacity .3s,transform .3s}
.menu-btn{top:14px;right:14px}
.menu-btn svg,.arriba-btn svg{width:20px;height:20px}
.arriba-btn{left:16px;bottom:18px;opacity:0;pointer-events:none;transform:translateY(10px)}
.arriba-btn.ver{opacity:.9;pointer-events:auto;transform:none}
.menu{position:fixed;inset:0;z-index:70;background:var(--fondo);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0;pointer-events:none;transition:opacity .35s;overflow-y:auto;padding:70px 20px}
.menu a{font-family:var(--f-texto);font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:var(--titulo,var(--tinta));text-decoration:none}
.menu-abierto .menu{opacity:1;pointer-events:auto}
.menu-cerrar{position:absolute;top:14px;right:14px}
.bloqueado .menu-btn{display:none}

/* Cierre */
.hashtag{font-family:var(--f-etiqueta);font-size:clamp(15px,4.4vw,22px);letter-spacing:.18em;color:var(--acento2);word-break:break-word}
.pie{padding:90px 24px 110px;text-align:center;background:var(--oscuro);color:var(--sobre-oscuro);position:relative;overflow:hidden}
.pie>p{font-style:italic;opacity:.85;position:relative;z-index:2}
.pie .nombres{color:var(--sobre-oscuro);font-size:clamp(40px,11.5vw,80px);margin:12px 0;position:relative;z-index:2}
.pie .nombres{display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline}.pie .nombres span{display:inline}
.pie .nombres .amp{margin:0 10px;color:var(--acento)}
.pie .pie-fecha{font-family:var(--f-etiqueta);font-style:normal;font-size:11px;letter-spacing:.3em;color:var(--acento);margin-top:20px;opacity:1}

.aviso{position:fixed;left:50%;bottom:28px;transform:translate(-50%,140px);z-index:300;background:var(--oscuro);color:var(--sobre-oscuro);padding:12px 24px;border-radius:30px;font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.08em;transition:transform .4s ease}
.aviso.ver{transform:translate(-50%,0)}

/* Efectos que caen (pétalos, hojas, destellos) */
.efecto{position:fixed;inset:0;pointer-events:none;z-index:40;overflow:hidden}
.efecto i{position:absolute;top:-40px;display:block;animation:caer linear forwards}
@keyframes caer{to{transform:translate(var(--dx),110vh) rotate(var(--rot))}}

@media (max-width:640px){
  body{font-size:18px}
  .sec{padding:76px 18px}
  .padres{grid-template-columns:1fr;gap:22px}
  .fecha-bloque{gap:12px}.fecha-bloque .lado{width:80px;font-size:10px;letter-spacing:.2em}
  .reloj small{font-size:8px;letter-spacing:.12em}
  .evento{grid-template-columns:1fr 54px 1fr}.evento .hora{font-size:24px}.evento .que{font-size:17px}
  .galeria{gap:6px}.foto figcaption{font-size:18px}
  .galeria.g3{grid-template-columns:repeat(2,1fr)}.galeria.g3 .foto:first-child{grid-column:span 2;aspect-ratio:4/3}
  .figuras{gap:30px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition-duration:.01ms!important;transition-delay:0s!important}
  .rv{opacity:1;transform:none}
  .efecto{display:none}
}`;

  // ---------------------------------------------------------------------------
  // Comportamiento de la página (sobre, cuenta regresiva, RSVP…).
  // IMPORTANTE: esta función debe ser autónoma (no usar nada de fuera), porque
  // el editor copia su código tal cual dentro del HTML que se descarga.
  // ---------------------------------------------------------------------------
  function runtime(d) {
    var W = window;
    (W.__inv || []).forEach(function (f) { try { f(); } catch (e) {} });
    var limpiar = W.__inv = [];
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    // Personalización: ?invitado=Familia%20López&pases=4&mesa=5  (en el editor: d._prueba)
    var params = new URLSearchParams(location.search), prueba = d._prueba || {};
    var invitado = (params.get('invitado') || prueba.nombre || '').trim().slice(0, 60);
    var pasesDef = parseInt((d.rsvp && d.rsvp.pases) || 2, 10) || 2;
    var pases = Math.min(Math.max(parseInt(params.get('pases') || prueba.pases, 10) || pasesDef, 1), 30);
    var mesa = String(params.get('mesa') || prueba.mesa || '').trim().slice(0, 40);
    if (mesa && d.mesas && d.mesas.activo) {
      var mesasEl = $$('[data-mesa]').filter(function (e) { return e.getAttribute('data-mesa') === mesa; });
      if (mesasEl.length) {
        var etq = /^\d+$/.test(mesa) ? 'Mesa ' + mesa : mesa;
        mesasEl.forEach(function (e) { e.classList.add('tuya'); });
        $$('.sec-mesa').forEach(function (e) { e.classList.remove('sin-mesa'); });
        $$('[data-mesa-nombre]').forEach(function (e) { e.textContent = etq; });
        $$('[data-mesa-pase]').forEach(function (e) { e.textContent = etq; e.hidden = false; });
      }
    }
    if (invitado) $$('[data-invitado-nombre]').forEach(function (e) { e.textContent = invitado; });
    $$('[data-pases]').forEach(function (e) { e.textContent = pases; });
    $$('[data-pases-palabra]').forEach(function (e) { e.textContent = pases === 1 ? 'lugar' : 'lugares'; });
    var sel = $('#f-pases');
    if (sel) for (var i = 1; i <= pases; i++) sel.add(new Option(i + (i === 1 ? ' persona' : ' personas'), i, false, i === pases));
    var fNombre = $('#f-nombre');
    if (fNombre && invitado) fNombre.value = invitado;

    // Aviso flotante
    var aviso = document.createElement('div'); aviso.className = 'aviso'; document.body.appendChild(aviso);
    function avisar(t) { aviso.textContent = t; aviso.classList.add('ver'); setTimeout(function () { aviso.classList.remove('ver'); }, 2400); }

    // Música: archivo de audio, o melodía suave generada por el navegador
    var btnM = $('#btn-musica'), sonando = false, audio = null, ctx = null, tmr = null;
    var acordes = [[293.66, 369.99, 440], [220, 277.18, 329.63], [246.94, 293.66, 369.99], [185, 220, 277.18], [196, 246.94, 293.66], [146.83, 185, 220], [196, 246.94, 293.66], [220, 277.18, 329.63]];
    function tocarAcorde(fs, t) {
      fs.forEach(function (f, k) {
        var o = ctx.createOscillator(), g = ctx.createGain(), s = t + k * 0.18;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.05, s + 0.08); g.gain.exponentialRampToValueAtTime(0.0008, s + 2.6);
        o.connect(g).connect(ctx.destination); o.start(s); o.stop(s + 2.7);
      });
    }
    function play() {
      if (!d.musica || !btnM) return;
      try {
        if (d.musica === 'melodia') {
          ctx = ctx || new (W.AudioContext || W.webkitAudioContext)(); ctx.resume();
          var n = 0, tick = function () { tocarAcorde(acordes[n++ % acordes.length], ctx.currentTime + 0.05); };
          tick(); tmr = setInterval(tick, 1900);
        } else {
          audio = audio || new Audio(d.musica); audio.loop = true;
          var p = audio.play(); if (p && p.catch) p.catch(function () {});
        }
        sonando = true; btnM.classList.add('sonando');
      } catch (e) {}
    }
    function pause() { clearInterval(tmr); if (audio) audio.pause(); sonando = false; if (btnM) btnM.classList.remove('sonando'); }
    if (btnM) btnM.addEventListener('click', function () { sonando ? pause() : play(); });
    limpiar.push(pause);

    // Animaciones al aparecer
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    function observar() { $$('.rv').forEach(function (e) { io.observe(e); }); }
    limpiar.push(function () { io.disconnect(); });

    // Sobre
    var pantalla = $('#sobre');
    function abrir() {
      if (!pantalla || pantalla.classList.contains('abierto')) return;
      var quieto = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
      pantalla.classList.add('abierto');
      if (navigator.vibrate) try { navigator.vibrate(25); } catch (e) {}
      // Chispas al romper el sello
      var sobreEl = $('.sobre', pantalla);
      for (var c = 0; c < 14 && !quieto; c++) {
        var ch = document.createElement('span'), ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 70;
        ch.className = 'chispa';
        ch.style.setProperty('--x', Math.cos(ang) * dist + 'px'); ch.style.setProperty('--y', Math.sin(ang) * dist + 'px');
        ch.style.animationDelay = (0.22 + Math.random() * 0.1) + 's';
        sobreEl.appendChild(ch);
      }
      play();
      if (!quieto) setTimeout(function () { lluviaDelSobre(sobreEl); }, 1150);
      setTimeout(function () {
        document.body.classList.remove('bloqueado');
        if (btnM && d.musica) btnM.classList.add('ver');
        observar(); iniciarEfecto();
      }, quieto ? 0 : 3000);
      if (!enPortada) setTimeout(function () { pantalla.classList.add('fin'); }, quieto ? 0 : 3800);
    }
    var enPortada = pantalla && pantalla.classList.contains('en-portada');
    if (enPortada && document.body.classList.contains('sin-sobre')) pantalla.classList.add('abierto', 'ya');
    if (pantalla && !document.body.classList.contains('sin-sobre')) {
      document.body.classList.add('bloqueado');
      var s = $('.sobre', pantalla);
      s.addEventListener('click', abrir);
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
    } else {
      if (btnM && d.musica) btnM.classList.add('ver');
      observar(); iniciarEfecto();
    }

    // Cuenta regresiva
    var meta = new Date(d.fecha + 'T' + (d.hora || '17:00') + ':00' + (d.zonaHoraria || '-06:00')).getTime();
    var cd = { d: $$('[data-cd=d]'), h: $$('[data-cd=h]'), m: $$('[data-cd=m]'), s: $$('[data-cd=s]') };
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function reloj() {
      var x = Math.max(0, meta - Date.now()) || 0;
      var v = { d: Math.floor(x / 864e5), h: Math.floor(x / 36e5) % 24, m: Math.floor(x / 6e4) % 60, s: Math.floor(x / 1e3) % 60 };
      for (var k in cd) cd[k].forEach(function (e) { e.textContent = k === 'd' ? v[k] : pad(v[k]); });
    }
    reloj(); var tReloj = setInterval(reloj, 1000);
    limpiar.push(function () { clearInterval(tReloj); });

    // Forma de cada partícula según la plantilla
    function forma(e, tipo, c, sz) {
      e.style.background = c;
      if (tipo === 'petalos') { e.style.width = sz + 'px'; e.style.height = sz * 0.8 + 'px'; e.style.borderRadius = '80% 0 80% 0'; }
      else if (tipo === 'hojas') { e.style.width = sz * 0.6 + 'px'; e.style.height = sz + 'px'; e.style.borderRadius = '0 100% 0 100%'; }
      else if (tipo === 'destellos') { sz = 3 + Math.random() * 4; e.style.width = e.style.height = sz + 'px'; e.style.borderRadius = '50%'; e.style.boxShadow = '0 0 ' + sz * 2 + 'px ' + c; }
      else { e.style.width = sz * 0.5 + 'px'; e.style.height = sz * 0.9 + 'px'; }
    }

    // Pétalos que salen disparados del sobre al abrirse
    function lluviaDelSobre(sobreEl) {
      if (!sobreEl.animate) return;
      var r = sobreEl.getBoundingClientRect(), ox = r.left + r.width / 2, oy = r.top + r.height * 0.12;
      var tipo = d._efecto || 'hojas';
      var cols = d._efectoColores || ['#8a9a7b', '#b9c4a7', '#d8c08f'];
      var capa = document.createElement('div'); capa.className = 'efecto'; capa.style.zIndex = 150; document.body.appendChild(capa);
      for (var i = 0; i < 40; i++) {
        var e = document.createElement('i'), c = cols[i % cols.length];
        // En la plantilla dorada se mezclan confeti y destellos
        forma(e, tipo === 'destellos' && i % 2 ? 'confeti' : tipo, c, 12 + Math.random() * 14);
        e.style.left = ox + 'px'; e.style.top = oy + 'px'; e.style.animation = 'none';
        capa.appendChild(e);
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, fuerza = 140 + Math.random() * 220;
        var x1 = Math.cos(ang) * fuerza, y1 = Math.sin(ang) * fuerza, x2 = x1 * 1.5 + (Math.random() - 0.5) * 120, y2 = y1 + 420 + Math.random() * 260;
        var giro = (Math.random() - 0.5) * 900, dur = 2600 + Math.random() * 1400;
        e.animate([
          { transform: 'translate(0,0) rotate(0deg) scale(.3)', opacity: 0 },
          { transform: 'translate(' + x1 * 0.6 + 'px,' + y1 * 0.6 + 'px) rotate(' + giro * 0.2 + 'deg) scale(1)', opacity: 1, offset: 0.12 },
          { transform: 'translate(' + x1 + 'px,' + y1 + 'px) rotate(' + giro * 0.45 + 'deg) scale(1)', opacity: 1, offset: 0.35, easing: 'ease-in' },
          { transform: 'translate(' + x2 + 'px,' + y2 + 'px) rotate(' + giro + 'deg) scale(.9)', opacity: 0 }
        ], { duration: dur, delay: Math.random() * 350, easing: 'cubic-bezier(.15,.7,.35,1)', fill: 'both' });
      }
      var t = setTimeout(function () { capa.remove(); }, 4600);
      limpiar.push(function () { clearTimeout(t); capa.remove(); });
    }

    // Efecto que cae (pétalos, hojas, destellos, confeti dorado)
    function iniciarEfecto() {
      var tipo = d._efecto; if (!tipo || (W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
      var capa = document.createElement('div'); capa.className = 'efecto'; document.body.appendChild(capa);
      var cols = d._efectoColores || ['#e8b4b8'], total = 0;
      function uno() {
        if (total > 70 || document.hidden) return;
        var e = document.createElement('i'), t = 9 + Math.random() * 9, sz = 8 + Math.random() * 12;
        var c = cols[Math.floor(Math.random() * cols.length)];
        e.style.left = Math.random() * 100 + 'vw';
        e.style.setProperty('--dx', (Math.random() * 30 - 15) + 'vw');
        e.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        e.style.animationDuration = t + 's';
        e.style.opacity = 0.5 + Math.random() * 0.4;
        forma(e, tipo, c, sz);
        capa.appendChild(e); total++;
        setTimeout(function () { e.remove(); total--; }, t * 1000);
      }
      var tEf = setInterval(uno, 650);
      limpiar.push(function () { clearInterval(tEf); capa.remove(); });
    }

    // Copiar CLABE
    $$('[data-copiar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-copiar');
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { avisar('CLABE copiada ✓'); }, function () { avisar(t); });
        else avisar(t);
      });
    });

    // Fotos en grande
    $$('[data-zoom]').forEach(function (f) {
      f.addEventListener('click', function () {
        var z = document.createElement('div'); z.className = 'zoom';
        var im = document.createElement('img'); im.src = f.getAttribute('data-zoom'); z.appendChild(im);
        z.addEventListener('click', function () { z.remove(); }); document.body.appendChild(z);
      });
    });

    // Formularios cortos por WhatsApp (buenos deseos, canciones)
    $$('[data-whats]').forEach(function (f) {
      var n = $('[name=nombre]', f); if (invitado && n) n.value = invitado;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var nom = $('[name=nombre]', f).value.trim(), txt = $('[name=texto]', f).value.trim();
        if (!txt) { avisar(f.getAttribute('data-whats') === 'cancion' ? 'Escribe una canción' : 'Escribe tu mensaje'); return; }
        var num = String((d.rsvp && d.rsvp.whatsapp) || '').replace(/\D/g, '');
        var msg = f.getAttribute('data-whats') === 'cancion'
          ? '🎵 Sugerencia de canción para la boda de ' + d.novia + ' & ' + d.novio + ':\n' + txt + (nom ? '\n— ' + nom : '')
          : '💌 Buenos deseos para ' + d.novia + ' & ' + d.novio + ':\n' + txt + (nom ? '\n— ' + nom : '');
        W.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank');
      });
    });

    // Tarjetas que se voltean y bloques que se despliegan
    $$('[data-voltear]').forEach(function (e) {
      e.addEventListener('click', function () { e.classList.toggle('volteada'); });
      e.addEventListener('keydown', function (k) { if (k.key === 'Enter') e.classList.toggle('volteada'); });
    });
    $$('[data-desplegar]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = document.getElementById(b.getAttribute('data-desplegar')); if (!c) return;
        var abrirlo = c.hasAttribute('hidden');
        if (abrirlo) { c.removeAttribute('hidden'); $$('.rv', c).forEach(function (x) { x.classList.add('vis'); }); setTimeout(function () { c.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50); }
        else c.setAttribute('hidden', '');
        b.setAttribute('aria-expanded', abrirlo);
      });
    });

    // Menú de secciones y botón para volver arriba
    $$('[data-menu]').forEach(function (b) { b.addEventListener('click', function () { document.body.classList.toggle('menu-abierto'); }); });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-abierto'); }); });
    var arriba = $('[data-arriba]');
    if (arriba) {
      arriba.addEventListener('click', function () { W.scrollTo({ top: 0, behavior: 'smooth' }); });
      var alScroll = function () { arriba.classList.toggle('ver', W.scrollY > 700); };
      W.addEventListener('scroll', alScroll, { passive: true });
      limpiar.push(function () { W.removeEventListener('scroll', alScroll); });
    }

    // Confirmación por WhatsApp
    var form = $('#form-rsvp');
    if (form) {
      var caja = $('#caja-pases');
      $$('input[name=asiste]').forEach(function (r) { r.addEventListener('change', function () { caja.style.display = $('#asiste-si').checked ? '' : 'none'; }); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nom = fNombre.value.trim();
        if (!nom) { avisar('Escribe tu nombre, por favor'); fNombre.focus(); return; }
        var si = $('#asiste-si').checked, msg = $('#f-msg').value.trim(), pareja = d.novia + ' & ' + d.novio;
        var txt = si ? '¡Hola! Soy ' + nom + ' y confirmo mi asistencia a la boda de ' + pareja + ' 💍\nAsistentes: ' + sel.value
                     : 'Hola, soy ' + nom + '. Lamentablemente no podré asistir a la boda de ' + pareja + ', ¡pero les deseo lo mejor! 🤍';
        if (msg) txt += '\n\nMensaje: ' + msg;
        var num = String((d.rsvp && d.rsvp.whatsapp) || '').replace(/\D/g, '');
        if (!num) { avisar('Falta configurar el número de WhatsApp'); return; }
        W.open('https://wa.me/' + num + '?text=' + encodeURIComponent(txt), '_blank');
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Construir y montar
  // ---------------------------------------------------------------------------
  function construir(datos, opciones = {}) {
    const d = normalizar(datos);
    const p = Plantillas[d.plantilla] || Plantillas[Object.keys(Plantillas)[0]];
    d.plantilla = p.id;
    d._rutaAdornos = opciones.rutaAdornos != null ? opciones.rutaAdornos : 'plantillas/adornos/';
    d._efecto = p.efecto || null;
    d._efectoColores = p.efectoColores || null;
    let html = p.render(d, S);
    // Encuadre de fotos: posición (x, y en %) y zoom elegidos en el editor
    const enc = d.encuadres || {};
    if (Object.keys(enc).length) {
      html = html.replace(/<img\b[^>]*?\bsrc="([^"]+)"[^>]*>/g, (tag, src) => {
        const e = enc[huella(desesc(src))];
        if (!e) return tag;
        const x = +e.x || 50, y = +e.y || 50, z = Math.min(Math.max(+e.z || 1, 1), 4);
        return `<span class="encuadre">${tag.replace('<img', `<img style="object-position:${x}% ${y}%;transform:scale(${z});transform-origin:${x}% ${y}%"`)}</span>`;
      });
    }
    const titulo = `${d.novia} & ${d.novio} · Nuestra boda`;
    return { d, p, html, css: CSS_BASE + '\n' + (p.css || ''), fuentes: p.fuentes || '', titulo, descripcion: `${fechaInfo(d).larga}${d.ciudad ? ' — ' + d.ciudad : ''}` };
  }

  function montar(datos, opciones = {}) {
    const r = construir(datos, opciones);
    const head = document.head;
    let st = document.getElementById('inv-css');
    if (!st) { st = document.createElement('style'); st.id = 'inv-css'; head.appendChild(st); }
    st.textContent = r.css;
    let fl = document.getElementById('inv-fuentes');
    if (r.fuentes) {
      if (!fl) { fl = document.createElement('link'); fl.id = 'inv-fuentes'; fl.rel = 'stylesheet'; head.appendChild(fl); }
      if (fl.href !== r.fuentes) fl.href = r.fuentes;
    }
    document.title = r.titulo;
    document.body.className = `plantilla-${r.p.id}` + (opciones.sinSobre ? ' sin-sobre' : '') + (opciones.sinAnim ? ' sin-anim' : '');
    document.body.innerHTML = r.html;
    runtime(r.d);
    return r;
  }

  /** HTML final de un solo archivo, listo para subir a cualquier hosting. */
  function exportarHTML(datos, opciones = {}) {
    const r = construir(datos, Object.assign({ rutaAdornos: null }, opciones));
    const dJson = JSON.stringify(r.d).replace(/</g, '\\u003c');
    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(r.titulo)}</title>
<meta name="description" content="${esc(r.descripcion)}">
<meta property="og:title" content="${esc(r.d.novia)} & ${esc(r.d.novio)} · ¡Nos casamos!">
<meta property="og:description" content="${esc(r.descripcion)}">
${r.d.fotoPortada && !/^data:/.test(r.d.fotoPortada) ? `<meta property="og:image" content="${esc(r.d.fotoPortada)}">` : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${r.fuentes ? `<link rel="stylesheet" href="${esc(r.fuentes)}">` : ''}
<style>${r.css}</style>
</head>
<body class="plantilla-${r.p.id}">
${r.html}
<script>(${runtime.toString()})(${dJson});<\/script>
</body>
</html>`;
  }

  window.Invitacion = {
    registrar(p) { Plantillas[p.id] = p; },
    plantillas: Plantillas,
    construir, montar, exportarHTML, normalizar,
    ICONOS, ICONOS_EVENTO, ICONOS_REGALO, SECCIONES, fechaInfo, huella
  };
})();
