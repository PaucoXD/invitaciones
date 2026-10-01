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
  function invitadoPrueba() {
    const i = $('#ver-como').value; const x = i !== '' && (datos.invitados || [])[+i];
    return x ? { nombre: x.nombre, pases: x.pases, mesa: x.mesa } : null;
  }
  function enviar() { if (listo) vista.contentWindow.postMessage({ tipo: 'invitacion', datos, conSobre: $('#con-sobre').checked, prueba: invitadoPrueba() }, '*'); }
  function opcionesVerComo() {
    const s = $('#ver-como'), v = s.value;
    s.innerHTML = '';
    s.append(el('option', { value: '' }, 'Invitado genérico'));
    (datos.invitados || []).forEach((x, i) => { if (x.nombre) s.append(el('option', { value: String(i) }, `${x.nombre} (${x.pases || '?'}${x.mesa ? ' · mesa ' + x.mesa : ''})`)); });
    s.value = [...s.options].some(o => o.value === v) ? v : '';
  }
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
  $('#ver-como').addEventListener('focus', opcionesVerComo);
  $('#ver-como').addEventListener('change', enviar);
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
      const ops = t === 'icono' ? (def.set === 'regalo' ? Invitacion.ICONOS_REGALO : Invitacion.ICONOS_EVENTO).map(k => [k, ETIQ_ICONOS[k] || k]) : (typeof def.ops === 'function' ? def.ops() : def.ops);
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
        el('button', { class: 'b chico peligro', type: 'button', onclick: () => { quitarEncuadre(obtener(ruta)); set(''); pintar(); } }, 'Quitar'),
        def.png ? null : el('button', { class: 'b chico', type: 'button', onclick: () => { if (obtener(ruta)) abrirEncuadre(obtener(ruta)); else avisar('Primero sube una imagen'); } }, '✥ Ajustar posición')));
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
    } else if (t === 'check') {
      const c = el('input', { type: 'checkbox', onchange: (e) => { set(e.target.checked); if (def.repintar) pintarFormulario(); } });
      c.checked = !!val;
      control = el('label', { class: 'check' }, c, def.texto);
    } else if (t === 'mapaMesas') {
      return editorMesas();
    } else if (t === 'invitadosHerramientas') {
      const inv = datos.invitados || [];
      const total = inv.reduce((a, x) => a + (parseInt(x.pases, 10) || 0), 0);
      return el('div', { class: 'inv-herr' },
        el('p', { class: 'inv-total' }, `${inv.length} invitaciones · ${total} personas`),
        el('button', { class: 'b chico', type: 'button', onclick: pegarInvitados }, '📋 Pegar lista'),
        el('button', { class: 'b chico', type: 'button', onclick: () => $('#b-invitados').click() }, '🔗 Enlaces para enviar'));
    } else if (t === 'confAyuda') {
      const c = datos.confirmaciones = Object.assign({ url: '', boda: '', clave: '', whatsapp: false }, datos.confirmaciones);
      if (!c.boda || !c.clave) { c.boda = c.boda || slug(); c.clave = c.clave || Math.random().toString(36).slice(2, 8); setTimeout(cambio, 0); }
      return el('div', {},
        el('p', { class: 'ayuda' }, 'Las confirmaciones, buenos deseos y canciones se guardan solos en una hoja de Google Sheets (gratis) y los novios los ven en su panel. Se instala una sola vez y sirve para todas tus bodas:'),
        el('ol', { class: 'pasos-conf' },
          el('li', {}, 'Abre ', el('a', { href: 'https://sheets.new', target: '_blank', rel: 'noopener' }, 'sheets.new'), ' (crea una hoja nueva) y ponle nombre, por ejemplo “Confirmaciones”.'),
          el('li', {}, 'Menú ', el('code', {}, 'Extensiones → Apps Script'), '. Borra lo que aparece y pega el código (botón de abajo). Guarda 💾.'),
          el('li', {}, el('code', {}, 'Implementar → Nueva implementación'), ' → tipo ', el('code', {}, 'App web'), ' → Ejecutar como: ', el('b', {}, 'Yo'), ' → Quién tiene acceso: ', el('b', {}, 'Cualquier persona'), ' → Implementar. Autoriza con tu cuenta (en “Configuración avanzada” → “Ir a…”).'),
          el('li', {}, 'Copia la ', el('b', {}, 'URL de la app web'), ' y pégala aquí abajo. Listo.')),
        el('button', { class: 'b chico', type: 'button', onclick: () => {
          const t = window.CODIGO_SHEETS || '';
          (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => avisar('Código copiado ✓ Pégalo en Apps Script'), () => descargar('confirmaciones.gs', t, 'text/plain'));
        } }, '📋 Copiar código para Google Sheets'));
    } else if (t === 'confHerramientas') {
      const estado = el('p', { class: 'conf-estado' });
      const c = () => datos.confirmaciones || {};
      const marcar = (txt, ok) => { estado.textContent = txt; estado.className = 'conf-estado ' + (ok ? 'ok' : 'mal'); };
      const enlacePanel = () => {
        const p = new URLSearchParams({ u: c().url, b: c().boda, k: c().clave, n: `${datos.novia} & ${datos.novio}` });
        const base = ($('#inv-base') && $('#inv-base').value.trim()) || '';
        if (base) p.set('l', base);
        return new URL('panel.html?' + p.toString(), location.href).href;
      };
      const listo = () => { if (!c().url) { marcar('Primero pega la dirección de la app de Google.', false); return false; } return true; };
      return el('div', {},
        el('div', { class: 'conf-herr' },
          el('button', { class: 'b chico', type: 'button', onclick: async () => {
            if (!listo()) return; marcar('Probando…', true);
            try { const r = await (await fetch(c().url + (c().url.includes('?') ? '&' : '?') + 'accion=ping')).json(); marcar(r.ok ? '✓ Conexión correcta con Google Sheets.' : 'La hoja respondió con un error: ' + (r.error || ''), r.ok); }
            catch (e) { marcar('No se pudo conectar. Revisa que la URL termine en /exec y que el acceso sea “Cualquier persona”.', false); }
          } }, '🔌 Probar conexión'),
          el('button', { class: 'b chico', type: 'button', onclick: async () => {
            if (!listo()) return;
            const lista = (datos.invitados || []).filter(x => x.nombre).map(x => ({ nombre: x.nombre, pases: x.pases, mesa: datos.mesas && datos.mesas.activo ? x.mesa : '', tel: x.tel || '' }));
            marcar(`Enviando ${lista.length} invitaciones…`, true);
            try {
              const r = await (await fetch(c().url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: 'invitados', boda: c().boda, clave: c().clave, invitados: lista }) })).json();
              marcar(r.ok ? `✓ Lista sincronizada: ${r.invitados} invitaciones. El panel ya sabe quién falta por responder.` : 'Error: ' + (r.error || ''), r.ok);
            } catch (e) { marcar('No se pudo sincronizar. Prueba la conexión primero.', false); }
          } }, '👥 Sincronizar lista de invitados'),
          el('button', { class: 'b chico', type: 'button', onclick: () => { if (listo()) window.open(enlacePanel(), '_blank'); } }, '📊 Abrir panel'),
          el('button', { class: 'b chico', type: 'button', onclick: () => {
            if (!listo()) return;
            if (location.protocol === 'file:') avisar('Para compartir el panel, usa el editor desde tu sitio publicado');
            navigator.clipboard.writeText(enlacePanel()).then(() => avisar('Enlace del panel copiado ✓ Mándalo a los novios'));
          } }, '🔗 Copiar enlace del panel'),
          el('a', { class: 'b chico', href: 'panel.html?demo=1', target: '_blank', rel: 'noopener', style: 'text-decoration:none' }, '👀 Panel de ejemplo')),
        estado,
        el('p', { class: 'ayuda' }, 'Sincroniza otra vez si cambias la lista de invitados. La clave solo la usan los novios para ver su panel; no viaja dentro de la invitación. Para que el botón “Recordar” incluya el enlace de cada familia, escribe la dirección publicada en “Enlaces de invitados”.'));
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
  // Ajustar posición y zoom de una foto (arrastrar + control de zoom)
  // ---------------------------------------------------------------------------
  function quitarEncuadre(src) {
    if (!src || !datos.encuadres) return;
    const e = Object.assign({}, datos.encuadres); delete e[Invitacion.huella(src)]; datos.encuadres = e;
  }
  function abrirEncuadre(src) {
    const k = Invitacion.huella(src);
    const actual = Object.assign({ x: 50, y: 50, z: 1 }, (datos.encuadres || {})[k]);
    const guardar = () => { poner('encuadres', Object.assign({}, datos.encuadres, { [k]: { x: Math.round(actual.x), y: Math.round(actual.y), z: +actual.z.toFixed(2) } })); };
    const marcos = [['Vertical', '3/4'], ['Cuadrado', '1/1'], ['Horizontal', '16/9']];
    const vistas = marcos.map(([n, r]) => {
      const im = el('img', { src, draggable: 'false' });
      return { im, box: el('div', { class: 'enc-box', style: `aspect-ratio:${r}` }, im, el('span', { class: 'enc-mira' })), n };
    });
    const pintar = () => vistas.forEach(v => { v.im.style.objectPosition = `${actual.x}% ${actual.y}%`; v.im.style.transformOrigin = `${actual.x}% ${actual.y}%`; v.im.style.transform = `scale(${actual.z})`; });
    const zoom = el('input', { type: 'range', min: '1', max: '3', step: '0.05', value: actual.z, oninput: (e) => { actual.z = +e.target.value; pintar(); guardar(); } });
    const modal = el('div', { class: 'modal ver' }, el('div', { class: 'caja' },
      el('h2', {}, 'Ajustar posición de la foto'),
      el('p', {}, 'Arrastra la foto para elegir qué parte se ve y usa el zoom para acercar. El ajuste se aplica en toda la invitación; aquí ves cómo queda en marcos de distintas formas.'),
      el('div', { class: 'enc-vistas' }, vistas.map(v => el('figure', {}, v.box, el('figcaption', {}, v.n)))),
      el('div', { class: 'campo' }, el('label', {}, 'Zoom'), zoom),
      el('div', { class: 'caja-pie' },
        el('button', { class: 'b', type: 'button', onclick: () => { actual.x = 50; actual.y = 50; actual.z = 1; zoom.value = 1; pintar(); guardar(); } }, 'Restablecer'),
        el('button', { class: 'b pri', type: 'button', onclick: () => modal.remove() }, 'Listo'))));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    // Arrastrar: mover la foto mueve el punto de enfoque en sentido contrario
    vistas.forEach(v => {
      let ini = null;
      v.box.addEventListener('pointerdown', (e) => { ini = { px: e.clientX, py: e.clientY, x: actual.x, y: actual.y }; v.box.setPointerCapture(e.pointerId); v.box.classList.add('arrastrando'); });
      v.box.addEventListener('pointermove', (e) => {
        if (!ini) return;
        const r = v.box.getBoundingClientRect(), sens = 100 / actual.z;
        actual.x = Math.min(100, Math.max(0, ini.x - (e.clientX - ini.px) / r.width * sens));
        actual.y = Math.min(100, Math.max(0, ini.y - (e.clientY - ini.py) / r.height * sens));
        pintar();
      });
      const fin = () => { if (ini) { ini = null; v.box.classList.remove('arrastrando'); guardar(); } };
      v.box.addEventListener('pointerup', fin); v.box.addEventListener('pointercancel', fin);
    });
    pintar();
    document.body.append(modal);
  }

  // ---------------------------------------------------------------------------
  // Invitados: pegar una lista completa
  // ---------------------------------------------------------------------------
  function pegarInvitados() {
    const ta = el('textarea', { placeholder: 'Familia López | 4 | 5 | 5215511112222\nAna y Luis Pérez | 2 | 3\nTía Carmen | 1', style: 'min-height:200px' });
    const modal = el('div', { class: 'modal ver' }, el('div', { class: 'caja' },
      el('h2', {}, 'Pegar lista de invitados'),
      el('p', {}, 'Uno por renglón: Nombre | lugares | mesa | WhatsApp (mesa y WhatsApp son opcionales). Puedes copiar las columnas desde Excel o Google Sheets.'),
      el('div', { class: 'campo' }, ta),
      el('div', { class: 'caja-pie' },
        el('button', { class: 'b', type: 'button', onclick: () => modal.remove() }, 'Cancelar'),
        el('button', { class: 'b pri', type: 'button', onclick: () => {
          const nuevos = ta.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
            const [n, p, m, t] = l.split(/\s*[|\t;]\s*/);
            return { nombre: (n || '').trim(), pases: parseInt(p, 10) || datos.rsvp.pases || 2, mesa: (m || '').trim(), tel: (t || '').replace(/[^\d]/g, '') };
          }).filter(x => x.nombre);
          poner('invitados', [...(datos.invitados || []), ...nuevos]);
          modal.remove(); pintarFormulario(); avisar(`${nuevos.length} invitaciones agregadas`);
        } }, 'Agregar'))));
    document.body.append(modal); ta.focus();
  }

  // ---------------------------------------------------------------------------
  // Paquete Mesas: plano del salón con mesas que se arrastran
  // ---------------------------------------------------------------------------
  const ETQ_EL = { pista: 'Pista', novios: 'Novios', entrada: 'Entrada', barra: 'Barra', dj: 'DJ', pastel: 'Pastel' };
  let seleccion = null; // { tipo: 'mesa'|'el', i }
  function editorMesas() {
    const m = datos.mesas = Object.assign({ activo: false, texto: '', lista: [], elementos: [] }, datos.mesas);
    const caja = el('div', { class: 'ed-mesas' + (m.activo ? '' : ' apagado') });
    if (!m.activo) { caja.append(el('p', { class: 'ayuda' }, 'Activa el paquete para dibujar el salón.')); return caja; }
    const guardar = () => { datos.mesas = Object.assign({}, m); cambio(); };
    const ocupacion = (nombre) => (datos.invitados || []).filter(x => x.mesa === nombre).reduce((a, x) => a + (parseInt(x.pases, 10) || 0), 0);
    const plano = el('div', { class: 'ed-plano' });
    const panel = el('div', { class: 'ed-panel' });
    const resumen = el('div', { class: 'ed-resumen' });

    function nuevaMesa(forma) {
      const usados = m.lista.map(x => parseInt(x.nombre, 10)).filter(n => !isNaN(n));
      m.lista.push({ nombre: String((usados.length ? Math.max(...usados) : 0) + 1), lugares: 10, forma, x: 50, y: 50 });
      seleccion = { tipo: 'mesa', i: m.lista.length - 1 }; guardar(); pintarFormulario();
    }
    function nuevoEl(tipo) {
      const tam = { pista: [30, 26], novios: [40, 8], entrada: [16, 7], barra: [8, 30], dj: [12, 10], pastel: [10, 10] }[tipo];
      m.elementos.push({ tipo, x: 50 - tam[0] / 2, y: 50 - tam[1] / 2, w: tam[0], h: tam[1] });
      seleccion = { tipo: 'el', i: m.elementos.length - 1 }; guardar(); pintar();
    }
    function generar() {
      const n = parseInt(prompt('¿Cuántas mesas? (se acomodan alrededor de la pista)', '12'), 10); if (!n) return;
      const lug = parseInt(prompt('¿Cuántos lugares por mesa?', '10'), 10) || 10;
      m.elementos = [{ tipo: 'novios', x: 30, y: 3, w: 40, h: 8 }, { tipo: 'pista', x: 35, y: 34, w: 30, h: 26 }, { tipo: 'entrada', x: 42, y: 92, w: 16, h: 7 }];
      const pos = [];
      for (let fy = 0; fy < 8; fy++) for (let fx = 0; fx < 7; fx++) {
        const x = 9 + fx * 13.6, y = 20 + fy * 10;
        if (x > 28 && x < 72 && y > 28 && y < 66) continue; // deja libre la pista
        if (y > 86) continue;
        pos.push([x, y]);
      }
      pos.sort((a, b) => Math.hypot(a[0] - 50, a[1] - 47) - Math.hypot(b[0] - 50, b[1] - 47));
      m.lista = pos.slice(0, n).sort((a, b) => a[1] - b[1] || a[0] - b[0]).map((p, i) => ({ nombre: String(i + 1), lugares: lug, forma: 'redonda', x: +p[0].toFixed(1), y: +p[1].toFixed(1) }));
      if (n > pos.length) avisar(`Solo caben ${pos.length} mesas automáticamente; agrega las demás a mano`);
      seleccion = null; guardar(); pintarFormulario();
    }

    function arrastrable(nodo, obtenerXY, ponerXY) {
      let ini = null;
      nodo.addEventListener('pointerdown', (e) => {
        e.preventDefault(); const [x, y] = obtenerXY();
        ini = { px: e.clientX, py: e.clientY, x, y, movio: false }; nodo.setPointerCapture(e.pointerId);
      });
      nodo.addEventListener('pointermove', (e) => {
        if (!ini) return; const r = plano.getBoundingClientRect();
        const nx = ini.x + (e.clientX - ini.px) / r.width * 100, ny = ini.y + (e.clientY - ini.py) / r.height * 100;
        if (Math.abs(e.clientX - ini.px) + Math.abs(e.clientY - ini.py) > 3) ini.movio = true;
        ponerXY(Math.min(100, Math.max(0, nx)), Math.min(100, Math.max(0, ny)));
      });
      nodo.addEventListener('pointerup', () => { if (ini) { const movio = ini.movio; ini = null; if (movio) guardar(); } });
    }

    function pintar() {
      plano.innerHTML = '';
      m.elementos.forEach((x, i) => {
        const n = el('div', { class: `ed-el pl-${x.tipo}` + (seleccion && seleccion.tipo === 'el' && seleccion.i === i ? ' sel' : '') }, x.texto || ETQ_EL[x.tipo]);
        const pos = () => { n.style.left = x.x + '%'; n.style.top = x.y + '%'; n.style.width = x.w + '%'; n.style.height = x.h + '%'; };
        pos();
        arrastrable(n, () => [x.x, x.y], (a, b) => { x.x = +Math.min(a, 100 - x.w).toFixed(1); x.y = +Math.min(b, 100 - x.h).toFixed(1); pos(); });
        n.addEventListener('click', () => { seleccion = { tipo: 'el', i }; pintar(); });
        plano.append(n);
      });
      m.lista.forEach((x, i) => {
        const oc = ocupacion(x.nombre), lleno = oc > (x.lugares || 0);
        const n = el('div', { class: 'ed-mesa' + (x.forma === 'rectangular' ? ' rect' : '') + (lleno ? ' lleno' : '') + (seleccion && seleccion.tipo === 'mesa' && seleccion.i === i ? ' sel' : ''), title: `${x.nombre}: ${oc}/${x.lugares} lugares` },
          el('b', {}, x.nombre), el('small', {}, `${oc}/${x.lugares}`));
        const pos = () => { n.style.left = x.x + '%'; n.style.top = x.y + '%'; };
        pos();
        arrastrable(n, () => [x.x, x.y], (a, b) => { x.x = +a.toFixed(1); x.y = +b.toFixed(1); pos(); });
        n.addEventListener('click', () => { seleccion = { tipo: 'mesa', i }; pintar(); });
        plano.append(n);
      });
      pintarPanel(); pintarResumen();
    }

    function pintarPanel() {
      panel.innerHTML = '';
      if (!seleccion) { panel.append(el('p', { class: 'ayuda' }, 'Arrastra las mesas para acomodarlas. Toca una para cambiar su número, lugares o forma.')); return; }
      if (seleccion.tipo === 'mesa') {
        const x = m.lista[seleccion.i]; if (!x) { seleccion = null; return pintarPanel(); }
        const nombreIn = el('input', { type: 'text', value: x.nombre });
        nombreIn.addEventListener('change', () => {
          const nuevo = nombreIn.value.trim(); if (!nuevo || nuevo === x.nombre) return;
          if (m.lista.some(o => o !== x && o.nombre === nuevo)) { avisar('Ya existe una mesa con ese nombre'); nombreIn.value = x.nombre; return; }
          (datos.invitados || []).forEach(g => { if (g.mesa === x.nombre) g.mesa = nuevo; });
          x.nombre = nuevo; guardar(); pintarFormulario();
        });
        const lug = el('input', { type: 'number', min: '1', value: x.lugares, oninput: (e) => { x.lugares = parseInt(e.target.value, 10) || 1; guardar(); pintar(); } });
        const forma = el('select', { onchange: (e) => { x.forma = e.target.value; guardar(); pintar(); } }, el('option', { value: 'redonda' }, 'Redonda'), el('option', { value: 'rectangular' }, 'Rectangular'));
        forma.value = x.forma || 'redonda';
        panel.append(el('div', { class: 'fila3' },
          el('div', { class: 'campo' }, el('label', {}, 'Número o nombre'), nombreIn),
          el('div', { class: 'campo' }, el('label', {}, 'Lugares'), lug),
          el('div', { class: 'campo' }, el('label', {}, 'Forma'), forma)),
          el('button', { class: 'b chico peligro', type: 'button', onclick: () => {
            (datos.invitados || []).forEach(g => { if (g.mesa === x.nombre) g.mesa = ''; });
            m.lista.splice(seleccion.i, 1); seleccion = null; guardar(); pintarFormulario();
          } }, '🗑 Eliminar mesa'));
      } else {
        const x = m.elementos[seleccion.i]; if (!x) { seleccion = null; return pintarPanel(); }
        const num = (k, l) => el('div', { class: 'campo' }, el('label', {}, l), el('input', { type: 'number', min: '3', max: '100', value: x[k], oninput: (e) => { x[k] = Math.min(100, Math.max(3, +e.target.value || 3)); guardar(); pintar(); } }));
        panel.append(el('div', { class: 'fila3' },
          el('div', { class: 'campo' }, el('label', {}, 'Texto'), el('input', { type: 'text', value: x.texto || ETQ_EL[x.tipo], onchange: (e) => { x.texto = e.target.value; guardar(); pintar(); } })),
          num('w', 'Ancho %'), num('h', 'Alto %')),
          el('button', { class: 'b chico peligro', type: 'button', onclick: () => { m.elementos.splice(seleccion.i, 1); seleccion = null; guardar(); pintar(); } }, '🗑 Quitar'));
      }
    }

    function pintarResumen() {
      resumen.innerHTML = '';
      const inv = datos.invitados || [];
      const sin = inv.filter(g => g.nombre && !m.lista.some(x => x.nombre === g.mesa));
      const cap = m.lista.reduce((a, x) => a + (parseInt(x.lugares, 10) || 0), 0);
      const pers = inv.reduce((a, g) => a + (parseInt(g.pases, 10) || 0), 0);
      resumen.append(el('p', { class: 'inv-total' }, `${m.lista.length} mesas · ${cap} lugares · ${pers} personas invitadas`));
      const llenas = m.lista.filter(x => ocupacion(x.nombre) > x.lugares);
      if (llenas.length) resumen.append(el('p', { class: 'alerta' }, '⚠ Mesas con más personas que lugares: ' + llenas.map(x => x.nombre).join(', ')));
      if (sin.length) resumen.append(el('p', { class: 'ayuda' }, `Sin mesa (${sin.length}): ` + sin.slice(0, 12).map(g => g.nombre).join(', ') + (sin.length > 12 ? '…' : '') + '. Asígnalas en la sección “Invitados”.'));
    }

    const tb = (txt, fn) => el('button', { class: 'b chico', type: 'button', onclick: fn }, txt);
    caja.append(
      el('div', { class: 'ed-barra' }, tb('✦ Generar mesas', generar), tb('+ Mesa redonda', () => nuevaMesa('redonda')), tb('+ Mesa rectangular', () => nuevaMesa('rectangular')),
        tb('+ Pista', () => nuevoEl('pista')), tb('+ Novios', () => nuevoEl('novios')), tb('+ Entrada', () => nuevoEl('entrada')), tb('+ Barra', () => nuevoEl('barra')), tb('+ DJ', () => nuevoEl('dj'))),
      plano, panel, resumen,
      el('button', { class: 'b chico', type: 'button', onclick: descargarMesas }, '⬇ Lista por mesa (Excel/CSV)'));
    pintar();
    return caja;
  }
  function descargarMesas() {
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const filas = [];
    (datos.mesas.lista || []).forEach(x => (datos.invitados || []).filter(g => g.mesa === x.nombre).forEach(g => filas.push([x.nombre, g.nombre, g.pases])));
    (datos.invitados || []).filter(g => !(datos.mesas.lista || []).some(x => x.nombre === g.mesa)).forEach(g => filas.push(['Sin mesa', g.nombre, g.pases]));
    descargar(`mesas-${slug()}.csv`, '﻿Mesa,Invitado,Lugares\n' + filas.map(f => f.map(q).join(',')).join('\n'), 'text/csv');
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
      { k: 'historia.fotos', t: 'lista', l: 'Fotos', ayuda: 'Salen en la galería. En “Vino y Olivo” además se reparten por la invitación en este orden: 1 historia · 2 y 3 padrinos · 4 franja ancha · 5 buenos deseos · 6 fondo del cierre. La foto de portada solo va en la portada.', boton: 'Agregar foto', nuevo: { src: '', pie: '' }, item: [{ k: 'src', t: 'imagen', l: 'Foto' }, { k: 'pie', l: 'Texto sobre la foto (opcional)' }] }] },
    { sec: 'Mesa de regalos', campos: [
      { k: 'regalos.titulo', l: 'Título' }, { k: 'regalos.texto', l: 'Texto' },
      { k: 'regalos.opciones', t: 'lista', l: 'Opciones', boton: 'Agregar opción', nuevo: { nombre: '', detalle: '', enlace: '', icono: 'regalo' }, item: [
        { fila: [{ k: 'nombre', l: 'Tienda / tipo' }, { k: 'icono', t: 'icono', set: 'regalo', l: 'Ícono' }] }, { k: 'detalle', l: 'Detalle', ph: 'Evento #50123456' }, { k: 'enlace', t: 'url', l: 'Enlace (opcional)' }] },
      { fila: [{ k: 'regalos.banco', l: 'Banco' }, { k: 'regalos.clabe', l: 'CLABE' }] }, { k: 'regalos.titular', l: 'Titular de la cuenta' }] },
    { sec: 'Confirmación de asistencia', campos: [
      { k: 'rsvp.whatsapp', l: 'WhatsApp que recibe las confirmaciones', ph: '5215512345678', ayuda: 'Con código de país, sin espacios ni “+”. México: 521 + 10 dígitos.' },
      { fila: [{ k: 'rsvp.pases', t: 'number', l: 'Lugares por defecto' }, { k: 'rsvp.fechaLimite', t: 'date', l: 'Confirmar antes del' }] },
      { k: 'rsvp.texto', t: 'area', l: 'Texto adicional (opcional)' }] },
    { sec: 'Invitados', campos: [
      { t: 'nota', texto: 'Cada invitación lleva sus propios lugares: Familia López 4, Tía Carmen 1… Con esta lista se generan los enlaces personalizados para enviar por WhatsApp.' },
      { t: 'invitadosHerramientas' },
      { k: 'invitados', t: 'lista', boton: 'Agregar invitación', nuevo: { nombre: '', pases: 2, mesa: '' }, item: [
        { k: 'nombre', l: 'Nombre en la invitación', ph: 'Familia López' },
        { k: 'tel', l: 'WhatsApp (opcional, para recordarle)', ph: '5215512345678' },
        { fila: [{ k: 'pases', t: 'number', l: 'Lugares' }, { k: 'mesa', t: 'select', l: 'Mesa', ops: () => [['', datos.mesas && datos.mesas.activo ? 'Sin asignar' : '— (paquete Mesas apagado)'], ...((datos.mesas && datos.mesas.lista) || []).map(m => [m.nombre, /^\d+$/.test(m.nombre) ? 'Mesa ' + m.nombre : m.nombre])] }] }] }] },
    { sec: 'Mesas ✦ paquete opcional', campos: [
      { k: 'mesas.activo', t: 'check', repintar: true, texto: 'Activar paquete de mesas', ayuda: 'Actívalo solo si el cliente lo contrató. Cada invitado verá en su invitación su número de mesa y el plano del salón con su mesa resaltada.' },
      { k: 'mesas.texto', t: 'area', l: 'Texto (opcional)', ph: 'Al llegar, nuestro personal te guiará a tu lugar.' },
      { t: 'mapaMesas' }] },
    { sec: 'Confirmaciones automáticas ✦ paquete', campos: [
      { t: 'confAyuda' },
      { k: 'confirmaciones.url', t: 'url', l: 'Dirección de la app de Google (termina en /exec)', ph: 'https://script.google.com/macros/s/…/exec' },
      { fila: [{ k: 'confirmaciones.boda', l: 'ID de la boda' }, { k: 'confirmaciones.clave', l: 'Clave del panel' }] },
      { k: 'confirmaciones.whatsapp', t: 'check', texto: 'Además abrir WhatsApp cuando el invitado confirme' },
      { t: 'confHerramientas' }] },
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
  // Invitación en PDF
  // ---------------------------------------------------------------------------
  const modalPdf = $('#modal-pdf');
  function abrirPdf() {
    const s = $('#pdf-para'); s.innerHTML = '';
    s.append(el('option', { value: '' }, 'Invitación general (sin nombre)'));
    (datos.invitados || []).forEach((x, i) => { if (x.nombre) s.append(el('option', { value: String(i) }, `${x.nombre} (${x.pases || '?'})`)); });
    if ($('#ver-como').value) s.value = $('#ver-como').value;
    $('#pdf-base').value = $('#inv-base').value;
    $('#pdf-estado').textContent = (datos.invitados || []).length ? '' : 'Tip: agrega invitados en la sección “Invitados” para hacer un PDF personalizado para cada familia.';
    modalPdf.classList.add('ver');
  }
  const ocupado = (si) => ['#pdf-uno', '#pdf-todos'].forEach(b => { $(b).disabled = si; $(b).style.opacity = si ? .5 : 1; });
  $('#b-pdf').addEventListener('click', abrirPdf);
  $('#pdf-cerrar').addEventListener('click', () => modalPdf.classList.remove('ver'));
  $('#pdf-base').addEventListener('input', (e) => { $('#inv-base').value = e.target.value; $('#inv-base').dispatchEvent(new Event('input')); });
  $('#pdf-uno').addEventListener('click', async () => {
    const i = $('#pdf-para').value, inv = i !== '' ? datos.invitados[+i] : null;
    ocupado(true); $('#pdf-estado').textContent = 'Generando PDF…';
    try {
      const blob = await Invitacion.pdf.generar(datos, { invitado: inv, base: $('#pdf-base').value.trim() });
      descargar(`${slug()}${inv ? '-' + inv.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]+/g, '-') : ''}.pdf`, blob, 'application/pdf');
      $('#pdf-estado').textContent = '✓ PDF descargado.';
    } catch (e) { console.error(e); $('#pdf-estado').textContent = 'No se pudo generar el PDF: ' + e.message; }
    ocupado(false);
  });
  $('#pdf-todos').addEventListener('click', async () => {
    const lista = (datos.invitados || []).filter(x => x.nombre);
    if (!lista.length) { $('#pdf-estado').textContent = 'Primero agrega invitados en la sección “Invitados”.'; return; }
    ocupado(true);
    try {
      const zip = await Invitacion.pdf.generarTodos(datos, lista, { base: $('#pdf-base').value.trim() },
        (n, t, nom) => { $('#pdf-estado').textContent = `Generando ${n} de ${t}: ${nom}…`; });
      descargar(`invitaciones-pdf-${slug()}.zip`, zip, 'application/zip');
      $('#pdf-estado').textContent = `✓ ${lista.length} PDFs descargados en un ZIP.`;
    } catch (e) { console.error(e); $('#pdf-estado').textContent = 'No se pudo generar: ' + e.message; }
    ocupado(false);
  });

  // ---------------------------------------------------------------------------
  // Enlaces para invitados
  // ---------------------------------------------------------------------------
  const modal = $('#modal-invitados');
  const pref = (() => { try { return JSON.parse(localStorage.getItem(CLAVE + '.invitados')) || {}; } catch (e) { return {}; } })();
  $('#inv-base').value = pref.base || '';
  // Migra la lista vieja (texto) a la sección Invitados
  if (pref.lista && !(datos.invitados || []).length) {
    datos.invitados = pref.lista.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const [n, p] = l.split('|').map(x => (x || '').trim()); return { nombre: n, pases: parseInt(p, 10) || 2, mesa: '' }; });
    delete pref.lista; cambio();
  }
  $('#inv-msg').value = pref.msg || '¡Hola {nombre}! 💌 Con mucho cariño te compartimos nuestra invitación de boda. Ábrela aquí: {enlace}';
  let filas = [];
  function generar() {
    const base = $('#inv-base').value.trim(), msg = $('#inv-msg').value;
    try { localStorage.setItem(CLAVE + '.invitados', JSON.stringify({ base, msg })); } catch (e) {}
    const conMesas = datos.mesas && datos.mesas.activo;
    filas = (datos.invitados || []).filter(g => g.nombre).map(g => {
      const n = g.nombre, pases = parseInt(g.pases, 10) || datos.rsvp.pases || 2, mesa = conMesas ? (g.mesa || '') : '';
      const enlace = base ? `${base}${base.includes('?') ? '&' : '?'}invitado=${encodeURIComponent(n)}&pases=${pases}${mesa ? '&mesa=' + encodeURIComponent(mesa) : ''}` : '';
      return { nombre: n, pases, mesa, enlace, mensaje: msg.replace(/\{nombre\}/g, n).replace(/\{enlace\}/g, enlace) };
    });
    const t = $('#inv-tabla'); t.innerHTML = '';
    if (!filas.length) { t.append(el('p', { class: 'ayuda' }, 'Agrega invitados en la sección “Invitados” del formulario (puedes pegar la lista completa).')); return; }
    if (!base) { t.append(el('p', { class: 'ayuda' }, 'Escribe arriba la dirección de la invitación publicada para generar los enlaces.')); return; }
    t.append(el('table', {}, el('tr', {}, el('th', {}, 'Invitado'), el('th', {}, 'Lugares'), el('th', {}, 'Mesa'), el('th', {}, 'Enlace'), el('th', {})),
      filas.map(f => el('tr', {}, el('td', {}, f.nombre), el('td', {}, String(f.pases)), el('td', {}, f.mesa || '—'), el('td', { class: 'url', title: f.enlace }, f.enlace),
        el('td', { style: 'white-space:nowrap' },
          el('button', { class: 'b chico', type: 'button', onclick: () => navigator.clipboard.writeText(f.enlace).then(() => avisar('Enlace copiado ✓')) }, 'Copiar'), ' ',
          el('a', { class: 'b chico', href: 'https://wa.me/?text=' + encodeURIComponent(f.mensaje), target: '_blank', rel: 'noopener', style: 'text-decoration:none' }, 'WhatsApp'))))));
  }
  ['#inv-base', '#inv-msg'].forEach(s => $(s).addEventListener('input', generar));
  $('#b-invitados').addEventListener('click', () => { modal.classList.add('ver'); generar(); });
  $('#inv-cerrar').addEventListener('click', () => modal.classList.remove('ver'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('ver'); });
  $('#inv-csv').addEventListener('click', () => {
    generar(); if (!filas.length) return avisar('Agrega invitados primero');
    const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const csv = '﻿Invitado,Lugares,Mesa,Enlace,Mensaje\n' + filas.map(f => [f.nombre, f.pases, f.mesa, f.enlace, f.mensaje].map(q).join(',')).join('\n');
    descargar(`invitados-${slug()}.csv`, csv, 'text/csv');
  });
})();
