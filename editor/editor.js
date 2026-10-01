/* Editor de invitaciones: formulario → vista previa en vivo → descarga del HTML final. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const CLAVE = 'invitaciones.editor.v1';
  const PL = Invitacion.plantillas;

  // ---------------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------------
  let datos;
  try { datos = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { datos = null; }
  if (!datos) datos = JSON.parse(JSON.stringify(window.INVITACION));
  datos = Invitacion.normalizar(datos);
  const qp = new URLSearchParams(location.search);
  if (qp.get('plantilla') && PL[qp.get('plantilla')]) datos.plantilla = qp.get('plantilla');

  const obtener = (ruta) => ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), datos);
  function poner(ruta, valor) {
    const ks = ruta.split('.'); let o = datos;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = valor;
    cambio();
  }

  // ---------------------------------------------------------------------------
  // Vista previa + guardado automático
  // ---------------------------------------------------------------------------
  const vista = $('#vista');
  let listo = false, tPrev = null, tGuardar = null;
  function enviar() { if (listo) vista.contentWindow.postMessage({ tipo: 'invitacion', datos, conSobre: $('#con-sobre').checked }, '*'); }
  window.addEventListener('message', (e) => { if (e.data && e.data.tipo === 'lista') { listo = true; enviar(); } });
  vista.addEventListener('load', () => { listo = true; enviar(); });
  function cambio() {
    clearTimeout(tPrev); tPrev = setTimeout(enviar, 200);
    clearTimeout(tGuardar); tGuardar = setTimeout(guardarLocal, 800);
  }
  function guardarLocal() {
    const g = $('#guardado');
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); g.textContent = '· guardado en este navegador'; }
    catch (e) { g.textContent = '· ⚠ fotos muy pesadas para guardado automático: usa “Guardar datos”'; }
  }
  $('#con-sobre').addEventListener('change', enviar);
  $('#dispositivo').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    [...e.currentTarget.children].forEach(x => x.classList.toggle('on', x === b));
    $('#marco-vista').className = 'marco-vista ' + b.dataset.d;
  });
  $('#b-alternar').addEventListener('click', () => {
    const v = document.body.classList.toggle('ver-vista');
    $('#b-alternar span').textContent = v ? 'Editar' : 'Vista previa';
    $('#b-alternar').firstChild.textContent = v ? '✎ ' : '👁 ';
  });

  // ---------------------------------------------------------------------------
  // Utilidades de UI
  // ---------------------------------------------------------------------------
  function el(tag, attrs, ...hijos) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) {
      if (k === 'class') e.className = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    }
    hijos.flat().forEach(h => h != null && e.append(h.nodeType ? h : document.createTextNode(h)));
    return e;
  }
  function avisar(t) { const a = $('#toast'); a.textContent = t; a.classList.add('ver'); clearTimeout(a._t); a._t = setTimeout(() => a.classList.remove('ver'), 2600); }
  function descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const a = el('a', { href: url, download: nombre }); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  const slug = () => `${datos.novia}-y-${datos.novio}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'invitacion';

  /** Reduce una imagen para que la invitación cargue rápido. */
  function leerImagen(file, max, png) {
    return new Promise((ok, mal) => {
      const r = new FileReader();
      r.onerror = mal;
      r.onload = () => {
        const im = new Image();
        im.onerror = mal;
        im.onload = () => {
          const k = Math.min(1, max / Math.max(im.width, im.height));
          const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          ok(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.82));
        };
        im.src = r.result;
      };
      r.readAsDataURL(file);
    });
  }
  function elegirArchivo(accept) {
    return new Promise(ok => {
      const i = el('input', { type: 'file', accept }); i.addEventListener('change', () => ok(i.files[0])); i.click();
    });
  }

  // ---------------------------------------------------------------------------
  // Tipos de campo
  // ---------------------------------------------------------------------------
  const ETIQ_ICONOS = { iglesia: 'Iglesia', anillos: 'Anillos / civil', copa: 'Copa / cóctel', brindis: 'Brindis', cena: 'Cena', musica: 'Música / baile', pastel: 'Pastel', foto: 'Fotos', auto: 'Transporte', corazon: 'Corazón', luna: 'Luna / fin', regalo: 'Regalo', bolsa: 'Tienda', banco: 'Banco', sobre: 'Sobre', hacienda: 'Hacienda / salón' };
  const ZONAS = [['-06:00', 'Centro de México (CDMX, Guadalajara, Monterrey)'], ['-05:00', 'Quintana Roo (Cancún, Tulum)'], ['-07:00', 'Sonora, Sinaloa, Nayarit, BCS'], ['-08:00', 'Baja California (Tijuana)'], ['-05:00 ', 'Colombia, Perú, Ecuador'], ['-03:00', 'Argentina, Chile (verano)'], ['+01:00', 'España (invierno)'], ['+02:00', 'España (verano)']];

  function campo(def, base) {
    if (def.fila) return el('div', { class: 'fila' }, def.fila.map(x => campo(x, base)));
    const ruta = base ? `${base}.${def.k}` : def.k;
    const val = def.k ? obtener(ruta) : undefined;
    const set = (v) => poner(ruta, v);
    const t = def.t || 'text';
    let control;

    if (t === 'text' || t === 'date' || t === 'time' || t === 'number' || t === 'url') {
      control = el('input', { type: t, value: val == null ? '' : val, placeholder: def.ph || '', oninput: (e) => set(t === 'number' ? Number(e.target.value) : e.target.value) });
    } else if (t === 'area') {
      control = el('textarea', { placeholder: def.ph || '', oninput: (e) => set(e.target.value) }); control.value = val || '';
    } else if (t === 'select' || t === 'icono') {
      const ops = t === 'icono' ? (def.set === 'regalo' ? Invitacion.ICONOS_REGALO : Invitacion.ICONOS_EVENTO).map(k => [k, ETIQ_ICONOS[k] || k]) : def.ops;
      control = el('select', { onchange: (e) => set(e.target.value.trim()) }, ops.map(([v, l]) => el('option', { value: v }, l)));
      control.value = ops.some(o => o[0] === val) ? val : (ops.find(o => o[0].trim() === val) || ops[0])[0];
    } else if (t === 'imagen') {
      const prev = el('div', { class: 'img-prev' + (def.png ? ' png' : '') });
      const pintar = () => { const v = obtener(ruta); prev.style.backgroundImage = v ? `url("${v}")` : ''; prev.textContent = v ? '' : 'Sin imagen'; };
      control = el('div', { class: 'img-campo' }, prev, el('div', { class: 'img-btns' },
        el('button', { class: 'b chico', type: 'button', onclick: async () => {
          const f = await elegirArchivo('image/*'); if (!f) return;
          try { set(await leerImagen(f, def.png ? 1400 : 1600, def.png)); pintar(); } catch (e) { avisar('No se pudo leer la imagen'); }
        } }, 'Subir imagen'),
        el('button', { class: 'b chico peligro', type: 'button', onclick: () => { set(''); pintar(); } }, 'Quitar')));
      pintar();
    } else if (t === 'colores') {
      control = el('div', { class: 'colores' });
      const pintar = () => {
        control.innerHTML = '';
        (obtener(ruta) || []).forEach((c, i) => control.append(el('div', { class: 'color' },
          el('input', { type: 'color', value: c, oninput: (e) => { const a = obtener(ruta).slice(); a[i] = e.target.value; set(a); } }),
          el('button', { type: 'button', title: 'Quitar', onclick: () => { const a = obtener(ruta).slice(); a.splice(i, 1); set(a); pintar(); } }, '×'))));
        control.append(el('button', { class: 'b chico', type: 'button', onclick: () => { set([...(obtener(ruta) || []), '#c9b79c']); pintar(); } }, '+ Color'));
      };
      pintar();
    } else if (t === 'lista') {
      control = el('div');
      const pintar = () => {
        control.innerHTML = '';
        const arr = obtener(ruta) || [];
        arr.forEach((_, i) => {
          const mover = (d) => { const a = obtener(ruta).slice(); const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(a); pintar(); };
          const item = el('div', { class: 'item' }, def.item.map(sub => campo(sub, `${ruta}.${i}`)),
            el('div', { class: 'item-ctrl' },
              el('button', { type: 'button', title: 'Subir', onclick: () => mover(-1) }, '↑'),
              el('button', { type: 'button', title: 'Bajar', onclick: () => mover(1) }, '↓'),
              el('button', { type: 'button', title: 'Eliminar', onclick: () => { const a = obtener(ruta).slice(); a.splice(i, 1); set(a); pintar(); } }, '🗑')));
          control.append(item);
        });
        control.append(el('button', { class: 'b agregar', type: 'button', onclick: () => { set([...(obtener(ruta) || []), JSON.parse(JSON.stringify(def.nuevo))]); pintar(); } }, '+ ' + (def.boton || 'Agregar')));
      };
      pintar();
    } else if (t === 'musica') {
      const tipo = !val ? '' : val === 'melodia' ? 'melodia' : 'archivo';
      const nota = el('p', { class: 'ayuda' });
      const sel = el('select', {}, [['', 'Sin música'], ['melodia', 'Melodía suave (incluida)'], ['archivo', 'Mi canción (MP3)']].map(([v, l]) => el('option', { value: v }, l)));
      const url = el('input', { type: 'url', placeholder: 'https://… enlace directo a un .mp3', value: tipo === 'archivo' && !/^data:/.test(val) ? val : '', oninput: (e) => set(e.target.value) });
      const subir = el('button', { class: 'b chico', type: 'button', onclick: async () => {
        const f = await elegirArchivo('audio/*'); if (!f) return;
        if (f.size > 6e6) avisar('El archivo pesa más de 6 MB; la invitación tardará en abrir');
        const r = new FileReader(); r.onload = () => { set(r.result); nota.textContent = `✓ ${f.name} (${(f.size / 1e6).toFixed(1)} MB) incluida en la invitación`; }; r.readAsDataURL(f);
      } }, 'Subir MP3');
      const extra = el('div', {}, el('div', { class: 'campo' }, el('label', {}, 'Enlace al MP3'), url), el('div', { class: 'campo' }, subir, nota));
      sel.value = tipo; extra.style.display = tipo === 'archivo' ? '' : 'none';
      if (/^data:/.test(val || '')) nota.textContent = '✓ Canción subida e incluida en la invitación';
      sel.addEventListener('change', () => { extra.style.display = sel.value === 'archivo' ? '' : 'none'; if (sel.value !== 'archivo') set(sel.value); });
      control = el('div', {}, sel, extra, el('p', { class: 'ayuda' }, 'Recomendado: MP3 de 2–4 MB. Usa música con permiso de uso. La música empieza al abrir el sobre.'));
    } else if (t === 'adornos') {
      control = el('div');
      const p = PL[datos.plantilla];
      control.append(el('p', { class: 'ayuda' }, `Reemplaza las ilustraciones de “${p.nombre}” con tus propios PNG (con fondo transparente). Si no subes nada se usan los dibujos incluidos. También puedes guardar archivos en plantillas/adornos/ con el nombre indicado y se usarán automáticamente.`));
      (p.adornos || []).forEach(a => control.append(el('div', { class: 'campo' },
        el('label', {}, a.nombre), campo({ k: a.id, t: 'imagen', png: true }, 'adornos'),
        el('p', { class: 'ayuda' }, `${a.ayuda} · archivo: ${p.id}-${a.id}.png`))));
    } else if (t === 'nota') {
      return el('p', { class: 'ayuda', style: 'margin-top:12px' }, def.texto);
    } else if (t === 'ocultar') {
      control = el('div');
      const nombres = { frase: 'Frase', familia: 'Padres y padrinos', cuenta: 'Cuenta regresiva', itinerario: 'Itinerario', ubicacion: 'Ubicación', vestimenta: 'Código de vestimenta', historia: 'Historia y fotos', regalos: 'Mesa de regalos', hospedaje: 'Hospedaje', rsvp: 'Confirmación', deseos: 'Buenos deseos', canciones: 'Sugerencia de canciones', contactos: 'Contactos', cierre: 'Hashtag y despedida' };
      Invitacion.SECCIONES.forEach(s => {
        const c = el('input', { type: 'checkbox', onchange: (e) => { const o = Object.assign({}, datos.ocultar); if (e.target.checked) delete o[s]; else o[s] = true; poner('ocultar', o); } });
        c.checked = !datos.ocultar[s];
        control.append(el('label', { class: 'check' }, c, nombres[s]));
      });
    }

    if (!def.l && !def.ayuda && (t === 'adornos' || t === 'ocultar')) return control;
    return el('div', { class: 'campo' }, def.l ? el('label', {}, def.l) : null, control, def.ayuda ? el('p', { class: 'ayuda' }, def.ayuda) : null);
  }

  // ---------------------------------------------------------------------------
  // Formulario
  // ---------------------------------------------------------------------------
  const FORM = [
    { sec: 'Pareja y fecha', abierto: true, campos: [
      { fila: [{ k: 'novia', l: 'Nombre de la novia' }, { k: 'novio', l: 'Nombre del novio' }] },
      { k: 'iniciales', l: 'Iniciales del sello', ph: 'V & S', ayuda: 'Si lo dejas vacío se usan las iniciales de los nombres.' },
      { fila: [{ k: 'fecha', t: 'date', l: 'Fecha' }, { k: 'hora', t: 'time', l: 'Hora de inicio' }] },
      { k: 'zonaHoraria', t: 'select', l: 'Zona horaria (para la cuenta regresiva)', ops: ZONAS },
      { k: 'ciudad', l: 'Ciudad', ph: 'San Miguel de Allende, Guanajuato' }] },
    { sec: 'Portada', campos: [
      { k: 'introPortada', l: 'Texto de arriba', ph: 'Nos casamos' },
      { k: 'fotoPortada', t: 'imagen', l: 'Foto de portada (opcional)', ayuda: 'Una foto vertical de la pareja se ve mejor.' }] },
    { sec: 'Frase', campos: [{ k: 'frase', t: 'area', l: 'Frase o cita' }, { k: 'fraseAutor', l: 'Autor' }] },
    { sec: 'Padres y padrinos', campos: [
      { k: 'tituloFamilia', l: 'Título' }, { k: 'textoFamilia', t: 'area', l: 'Texto de invitación' },
      { k: 'padresNovia', t: 'area', l: 'Padres de la novia', ayuda: 'Un nombre por renglón. Agrega † si alguno ya falleció.' },
      { k: 'padresNovio', t: 'area', l: 'Padres del novio' },
      { k: 'padrinos', t: 'lista', l: 'Padrinos', boton: 'Agregar padrinos', nuevo: { rol: '', nombres: '' }, item: [{ k: 'rol', l: 'De qué (velación, anillos, lazo, arras…)' }, { k: 'nombres', l: 'Nombres' }] }] },
    { sec: 'Itinerario', campos: [
      { k: 'itinerario', t: 'lista', boton: 'Agregar momento', nuevo: { hora: '', evento: '', detalle: '', icono: 'corazon' }, item: [
        { fila: [{ k: 'hora', t: 'time', l: 'Hora' }, { k: 'icono', t: 'icono', l: 'Ícono' }] }, { k: 'evento', l: 'Evento' }, { k: 'detalle', l: 'Detalle (opcional)' }] }] },
    { sec: 'Lugares', campos: [
      { k: 'lugares', t: 'lista', boton: 'Agregar lugar', nuevo: { tipo: '', hora: '', nombre: '', direccion: '', mapa: '', icono: 'hacienda' }, item: [
        { fila: [{ k: 'tipo', l: 'Tipo', ph: 'Ceremonia' }, { k: 'hora', t: 'time', l: 'Hora' }] },
        { k: 'nombre', l: 'Nombre del lugar' }, { k: 'direccion', t: 'area', l: 'Dirección' },
        { k: 'mapa', t: 'url', l: 'Enlace de Google Maps (opcional)', ayuda: 'En Google Maps: Compartir → Copiar vínculo. Si lo dejas vacío se busca por nombre y dirección.' },
        { k: 'icono', t: 'select', l: 'Ícono', ops: [['iglesia', 'Iglesia'], ['hacienda', 'Hacienda / salón'], ['anillos', 'Civil'], ['copa', 'Jardín / terraza']] }] }] },
    { sec: 'Código de vestimenta', campos: [
      { k: 'vestimenta.tipo', l: 'Tipo', ph: 'Formal, Etiqueta, Cóctel, Playa…' }, { k: 'vestimenta.texto', t: 'area', l: 'Sugerencia' },
      { k: 'vestimenta.colores', t: 'colores', l: 'Colores sugeridos' }, { k: 'vestimenta.nota', l: 'Nota', ph: 'El color blanco está reservado para la novia.' }] },
    { sec: 'Historia y fotos', campos: [
      { k: 'historia.titulo', l: 'Título' }, { k: 'historia.texto', t: 'area', l: 'Texto' },
      { k: 'historia.fotos', t: 'lista', l: 'Fotos', boton: 'Agregar foto', nuevo: { src: '', pie: '' }, item: [{ k: 'src', t: 'imagen', l: 'Foto' }, { k: 'pie', l: 'Texto sobre la foto (opcional)' }] }] },
    { sec: 'Mesa de regalos', campos: [
      { k: 'regalos.titulo', l: 'Título' }, { k: 'regalos.texto', l: 'Texto' },
      { k: 'regalos.opciones', t: 'lista', l: 'Opciones', boton: 'Agregar opción', nuevo: { nombre: '', detalle: '', enlace: '', icono: 'regalo' }, item: [
        { fila: [{ k: 'nombre', l: 'Tienda / tipo' }, { k: 'icono', t: 'icono', set: 'regalo', l: 'Ícono' }] }, { k: 'detalle', l: 'Detalle', ph: 'Evento #50123456' }, { k: 'enlace', t: 'url', l: 'Enlace (opcional)' }] },
      { fila: [{ k: 'regalos.banco', l: 'Banco' }, { k: 'regalos.clabe', l: 'CLABE' }] }, { k: 'regalos.titular', l: 'Titular de la cuenta' }] },
    { sec: 'Confirmación de asistencia', campos: [
      { k: 'rsvp.whatsapp', l: 'WhatsApp que recibe las confirmaciones', ph: '5215512345678', ayuda: 'Con código de país, sin espacios ni “+”. México: 521 + 10 dígitos.' },
      { fila: [{ k: 'rsvp.pases', t: 'number', l: 'Lugares por defecto' }, { k: 'rsvp.fechaLimite', t: 'date', l: 'Confirmar antes del' }] },
      { k: 'rsvp.texto', t: 'area', l: 'Texto adicional (opcional)' }] },
    { sec: 'Hospedaje', campos: [
      { k: 'hospedaje', t: 'lista', boton: 'Agregar hotel', nuevo: { nombre: '', nota: '', direccion: '', mapa: '' }, item: [
        { k: 'nombre', l: 'Hotel' }, { k: 'nota', l: 'Nota (tarifa, código, distancia)', ph: 'Código: BODAVS' }, { k: 'direccion', t: 'area', l: 'Dirección' }, { k: 'mapa', t: 'url', l: 'Enlace de Google Maps (opcional)' }] }] },
    { sec: 'Contactos', campos: [
      { fila: [{ k: 'contactos.novia', l: 'WhatsApp de la novia', ph: '5215512345678' }, { k: 'contactos.novio', l: 'WhatsApp del novio' }] },
      { t: 'nota', texto: 'Los “Buenos deseos” y “Sugerencia de canciones” llegan al WhatsApp de confirmaciones.' }] },
    { sec: 'Cierre', campos: [{ k: 'hashtag', l: 'Hashtag', ph: '#ValeYSanti' }, { k: 'nota', t: 'area', l: 'Nota', ph: 'Evento solo para adultos' }, { k: 'despedida', l: 'Frase de despedida' }] },
    { sec: 'Música', campos: [{ k: 'musica', t: 'musica' }] },
    { sec: 'Adornos de la plantilla', id: 'sec-adornos', campos: [{ t: 'adornos' }] },
    { sec: 'Mostrar / ocultar secciones', campos: [{ t: 'ocultar' }] }
  ];

  const form = $('#formulario');
  function pintarPlantillas() {
    const cont = el('div', { class: 'plantillas' });
    Object.values(PL).forEach(p => cont.append(el('button', { type: 'button', class: 'pl' + (p.id === datos.plantilla ? ' on' : ''), onclick: () => { datos.plantilla = p.id; cambio(); pintarFormulario(); } },
      el('div', { class: 'sw' }, (p.colores || []).map(c => { const s = el('span'); s.style.background = c; return s; })),
      el('b', {}, p.nombre), el('small', {}, p.descripcion))));
    return cont;
  }
  function pintarFormulario() {
    const abiertos = new Set([...form.querySelectorAll('details[open]')].map(d => d.dataset.sec));
    const scroll = form.scrollTop;
    form.innerHTML = '';
    form.append(pintarPlantillas());
    FORM.forEach(s => {
      const det = el('details', { 'data-sec': s.sec }, el('summary', {}, s.sec),
        el('div', { class: 'cuerpo' }, s.campos.map(c => campo(c))));
      if (abiertos.size ? abiertos.has(s.sec) : s.abierto) det.open = true;
      form.append(det);
    });
    form.scrollTop = scroll;
  }
  pintarFormulario();

  // ---------------------------------------------------------------------------
  // Botones de la barra
  // ---------------------------------------------------------------------------
  $('#b-nueva').addEventListener('click', () => {
    if (!confirm('¿Empezar una invitación nueva? Se borrarán los datos actuales (guárdalos antes si los necesitas).')) return;
    const base = JSON.parse(JSON.stringify(window.INVITACION));
    datos = Invitacion.normalizar({
      plantilla: datos.plantilla, novia: 'Nombre', novio: 'Nombre', fecha: base.fecha, hora: '17:00', zonaHoraria: '-06:00',
      itinerario: base.itinerario.map(x => Object.assign({}, x, { detalle: '' })),
      lugares: base.lugares.map(l => ({ tipo: l.tipo, hora: l.hora, nombre: '', direccion: '', mapa: '', icono: l.icono })),
      padrinos: [], vestimenta: { tipo: 'Formal', colores: [] }, historia: { titulo: 'Nuestra historia', fotos: [] },
      regalos: { titulo: base.regalos.titulo, texto: base.regalos.texto, opciones: [] }, rsvp: { pases: 2 }, musica: 'melodia'
    });
    pintarFormulario(); cambio();
  });

  $('#b-guardar').addEventListener('click', () => {
    descargar(`datos-${slug()}.json`, JSON.stringify(datos, null, 2), 'application/json');
    avisar('Datos guardados. Ábrelos después con “Abrir”.');
  });
  $('#b-abrir').addEventListener('click', () => $('#abrir-archivo').click());
  $('#abrir-archivo').addEventListener('change', (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try { datos = Invitacion.normalizar(JSON.parse(r.result)); pintarFormulario(); cambio(); avisar('Invitación abierta ✓'); }
      catch (err) { avisar('Ese archivo no es de invitación'); }
    };
    r.readAsText(f); e.target.value = '';
  });

  async function aDataURL(url) {
    const r = await fetch(url); if (!r.ok) throw new Error(r.status);
    const b = await r.blob(); if (!/^image\//.test(b.type)) throw new Error('tipo');
    return new Promise(ok => { const fr = new FileReader(); fr.onload = () => ok(fr.result); fr.readAsDataURL(b); });
  }
  $('#b-descargar').addEventListener('click', async () => {
    // Incluye dentro del archivo los adornos guardados en plantillas/adornos/ (si existen)
    const d = JSON.parse(JSON.stringify(datos));
    d.adornos = Object.assign({}, d.adornos);
    for (const a of (PL[d.plantilla].adornos || [])) {
      if (d.adornos[a.id]) continue;
      try { d.adornos[a.id] = await aDataURL(`plantillas/adornos/${d.plantilla}-${a.id}.png`); } catch (e) { /* se usa el dibujo incluido */ }
    }
    descargar(`${slug()}.html`, Invitacion.exportarHTML(d), 'text/html');
    avisar('Invitación descargada. ¡Súbela a tu hosting!');
  });

  // ---------------------------------------------------------------------------
  // Enlaces para invitados
  // ---------------------------------------------------------------------------
  const modal = $('#modal-invitados');
  const pref = (() => { try { return JSON.parse(localStorage.getItem(CLAVE + '.invitados')) || {}; } catch (e) { return {}; } })();
  $('#inv-base').value = pref.base || '';
  $('#inv-lista').value = pref.lista || '';
  $('#inv-msg').value = pref.msg || '¡Hola {nombre}! 💌 Con mucho cariño te compartimos nuestra invitación de boda. Ábrela aquí: {enlace}';
  let filas = [];
  function generar() {
    const base = $('#inv-base').value.trim(), msg = $('#inv-msg').value;
    try { localStorage.setItem(CLAVE + '.invitados', JSON.stringify({ base, lista: $('#inv-lista').value, msg })); } catch (e) {}
    filas = $('#inv-lista').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [n, p] = l.split('|').map(x => (x || '').trim());
      const pases = parseInt(p, 10) || datos.rsvp.pases || 2;
      const enlace = base ? `${base}${base.includes('?') ? '&' : '?'}invitado=${encodeURIComponent(n)}&pases=${pases}` : '';
      return { nombre: n, pases, enlace, mensaje: msg.replace(/\{nombre\}/g, n).replace(/\{enlace\}/g, enlace) };
    });
    const t = $('#inv-tabla'); t.innerHTML = '';
    if (!filas.length) return;
    if (!base) { t.append(el('p', { class: 'ayuda' }, 'Escribe arriba la dirección de la invitación publicada para generar los enlaces.')); return; }
    t.append(el('table', {}, el('tr', {}, el('th', {}, 'Invitado'), el('th', {}, 'Lugares'), el('th', {}, 'Enlace'), el('th', {})),
      filas.map(f => el('tr', {}, el('td', {}, f.nombre), el('td', {}, String(f.pases)), el('td', { class: 'url', title: f.enlace }, f.enlace),
        el('td', { style: 'white-space:nowrap' },
          el('button', { class: 'b chico', type: 'button', onclick: () => navigator.clipboard.writeText(f.enlace).then(() => avisar('Enlace copiado ✓')) }, 'Copiar'), ' ',
          el('a', { class: 'b chico', href: 'https://wa.me/?text=' + encodeURIComponent(f.mensaje), target: '_blank', rel: 'noopener', style: 'text-decoration:none' }, 'WhatsApp'))))));
  }
  ['#inv-base', '#inv-lista', '#inv-msg'].forEach(s => $(s).addEventListener('input', generar));
  $('#b-invitados').addEventListener('click', () => { modal.classList.add('ver'); generar(); });
  $('#inv-cerrar').addEventListener('click', () => modal.classList.remove('ver'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('ver'); });
  $('#inv-csv').addEventListener('click', () => {
    generar(); if (!filas.length) return avisar('Agrega invitados primero');
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csv = '﻿Invitado,Lugares,Enlace,Mensaje\n' + filas.map(f => [f.nombre, f.pases, f.enlace, f.mensaje].map(q).join(',')).join('\n');
    descargar(`invitados-${slug()}.csv`, csv, 'text/csv');
  });
})();
