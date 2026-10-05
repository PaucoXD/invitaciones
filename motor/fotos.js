/*
 * Almacén de fotos: Cloudinary (recomendado) o Supabase Storage. Las fotos y la música se suben a un servidor rápido y en los
 * datos solo queda su enlace: los pedidos pesan unos KB (abren al instante) y las invitaciones
 * publicadas cargan más rápido. Se configura en negocio.js → fotos (manual, sección 2.4).
 * Si no está configurado, todo sigue como antes (las fotos van dentro de los datos).
 *
 *   Fotos.activo()                    → true si hay almacén configurado
 *   Fotos.subir(dataURL, carpeta)     → Promise<enlace público> (o el mismo dato si no aplica)
 */
(function () {
  'use strict';
  const F = () => (window.NEGOCIO && window.NEGOCIO.fotos) || {};
  const cloudinary = () => !!(F().cloudinaryCloud && F().cloudinaryPreset);
  const supabase = () => !!(F().supabaseUrl && F().supabaseKey);
  const activo = () => cloudinary() || supabase();
  const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/ogg': 'ogg', 'audio/wav': 'wav' };
  const azar = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 12);
  const limpia = (t) => String(t || 'varias').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/_-]+/g, '-').replace(/^[-/]+|[-/]+$/g, '') || 'varias';

  function aBlob(dato) {
    const coma = dato.indexOf(','), cab = dato.slice(0, coma);
    const mime = (/^data:([^;,]+)/.exec(cab) || [])[1] || 'application/octet-stream';
    const bin = atob(dato.slice(coma + 1)), u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type: mime });
  }

  /** Cloudinary: subida "unsigned" directa desde el navegador; la foto se entrega optimizada (f_auto,q_auto). */
  async function subirCloudinary(dato, carpeta) {
    const cfg = F(), fd = new FormData();
    fd.append('file', dato); fd.append('upload_preset', cfg.cloudinaryPreset); fd.append('folder', 'invitaciones/' + limpia(carpeta));
    const r = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cfg.cloudinaryCloud)}/auto/upload`, { method: 'POST', body: fd });
    let j = {}; try { j = await r.json(); } catch (e) { /* sin detalle */ }
    if (!r.ok || !j.secure_url) throw new Error(`No se pudo subir (${r.status}${j.error && j.error.message ? ': ' + j.error.message : ''})`);
    return j.resource_type === 'image' ? j.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/') : j.secure_url;
  }

  async function subir(dato, carpeta) {
    if (!activo() || !/^data:/.test(String(dato || ''))) return dato;
    if (cloudinary()) return subirCloudinary(dato, carpeta);
    const cfg = F(), base = cfg.supabaseUrl.replace(/\/+$/, ''), cubeta = cfg.bucket || 'fotos';
    const blob = aBlob(dato);
    const ruta = `${limpia(carpeta)}/${Date.now().toString(36)}-${azar()}.${EXT[blob.type] || 'bin'}`;
    const cab = { apikey: cfg.supabaseKey, 'Content-Type': blob.type, 'x-upsert': 'false', 'cache-control': 'max-age=31536000' };
    if (/^eyJ/.test(cfg.supabaseKey)) cab.Authorization = 'Bearer ' + cfg.supabaseKey; // llave "anon" (formato anterior)
    const r = await fetch(`${base}/storage/v1/object/${cubeta}/${ruta}`, { method: 'POST', headers: cab, body: blob });
    if (!r.ok) {
      let m = ''; try { m = (await r.json()).message || ''; } catch (e) { /* sin detalle */ }
      throw new Error(`No se pudo subir (${r.status}${m ? ': ' + m : ''})`);
    }
    return `${base}/storage/v1/object/public/${cubeta}/${ruta}`;
  }

  window.Fotos = { activo, subir };
})();
