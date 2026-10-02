/*
 * Descarga un pedido del formulario (pedido.html) desde Google Sheets / Apps Script.
 * Con fotos pesa varios MB y Google solo entrega respuestas chicas a la página, así que se pide
 * por pedazos: varios a la vez, y si Google rechaza uno (manda una página HTML) se parte a la mitad.
 * El tamaño que funcionó se recuerda para la próxima vez.
 *
 *   descargarPedido(url, clave, folio, progreso(hecho, total)) → Promise<pedido>
 */
(function () {
  'use strict';
  const MIN = 15000, PARALELO = 4, CLAVE_TAM = 'pedido-tam';
  const espera = (ms) => new Promise(ok => setTimeout(ok, ms));
  const textoHtml = (t) => { try { return (new DOMParser().parseFromString(t, 'text/html').body.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120); } catch (e) { return ''; } };

  async function descargarPedido(url, clave, id, progreso) {
    const sep = url.includes('?') ? '&' : '?';
    const base = `${url}${sep}accion=pedido&id=${encodeURIComponent(id)}&clave=${encodeURIComponent(clave)}`;
    // Versión del código de Google (respuesta chiquita): así se sabe si falta actualizarlo
    let v = 0;
    try { v = (await (await fetch(`${url}${sep}accion=ping&t=${Date.now()}`, { cache: 'no-store' })).json()).version || 0; } catch (e) { /* se intenta de todos modos */ }
    if (v && v < 11) throw new Error(`Tu Google todavía usa el código versión ${v}. Copia el código otra vez (debe decir versión 11), pégalo en Apps Script y en Implementar → Administrar implementaciones → ✏️ elige “Nueva versión” → Implementar.`);

    let ultimo = '';
    /** Un pedazo: { texto, total } o null si Google lo rechazó. */
    async function pedazo(desde, tam) {
      let t;
      try { t = await (await fetch(`${base}&desde=${desde}&tam=${tam}&t=${Date.now()}`, { cache: 'no-store' })).text(); } catch (e) { ultimo = e.message || 'sin conexión'; return null; }
      let r; try { r = JSON.parse(t); } catch (e) { ultimo = textoHtml(t); return null; }
      if (!r.ok) throw new Error(/boda o clave/i.test(r.error || '') ? 'tu código de Google es de una versión anterior; actualízalo (manual, sección 3.0)' : r.error);
      if (r.pedido) return { completo: r.pedido };
      return r;
    }

    // 1) Primer pedazo: se busca un tamaño que Google acepte
    let tam = 200000;
    try { tam = Math.max(MIN, +localStorage.getItem(CLAVE_TAM) || tam); } catch (e) { /* sin almacenamiento */ }
    let primero = null, fallos = 0;
    while (!primero) {
      primero = await pedazo(0, tam);
      if (primero) break;
      if (++fallos > 10) throw new Error(`Google no pudo mandar el pedido (“${ultimo}”). Plan B: en Mis bodas toca “⬇ Archivo” y ábrelo en el editor con 📂 Abrir.`);
      tam = Math.max(MIN, Math.floor(tam / 2));
      await espera(500);
    }
    if (primero.completo) return primero.completo; // código de Google muy anterior
    try { localStorage.setItem(CLAVE_TAM, String(tam)); } catch (e) { /* sin almacenamiento */ }
    const total = primero.total, partes = new Map([[0, primero.texto]]);
    let hecho = primero.texto.length;
    if (progreso) progreso(hecho, total);

    // 2) El resto, varios a la vez; un pedazo rechazado se parte en dos
    const cola = [];
    for (let d = primero.texto.length; d < total; d += tam) cola.push([d, Math.min(tam, total - d)]);
    let error = null;
    async function trabajador() {
      while (cola.length && !error) {
        const [d, t] = cola.shift();
        let r = null;
        for (let i = 0; i < 3 && !r; i++) { r = await pedazo(d, t); if (!r) await espera(400 * (i + 1)); }
        if (r) { partes.set(d, r.texto); hecho += r.texto.length; if (progreso) progreso(Math.min(hecho, total), total); continue; }
        if (t <= MIN) { error = new Error(`Google no pudo mandar una parte del pedido (“${ultimo}”). Plan B: en Mis bodas toca “⬇ Archivo” y ábrelo con 📂 Abrir.`); return; }
        const m = Math.floor(t / 2);
        cola.push([d, m], [d + m, t - m]);
        try { localStorage.setItem(CLAVE_TAM, String(Math.max(MIN, m))); } catch (e) { /* sin almacenamiento */ }
      }
    }
    await Promise.all(Array.from({ length: PARALELO }, trabajador));
    if (error) throw error;
    const texto = [...partes.keys()].sort((a, b) => a - b).map(k => partes.get(k)).join('');
    if (texto.length !== total) throw new Error('El pedido llegó incompleto. Intenta de nuevo.');
    return JSON.parse(texto);
  }

  window.descargarPedido = descargarPedido;
})();
