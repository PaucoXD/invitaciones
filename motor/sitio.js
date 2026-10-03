/*
 * Común a las páginas públicas (ventas, formulario, avisos, 404):
 *  - Fuerza https (si alguien entra con http://).
 *  - Analítica opcional, configurada en negocio.js → analitica:
 *      goatcounter: 'tucodigo'  → sin cookies, no necesita aviso (recomendada)
 *      ga4: 'G-XXXXXXX'         → Google Analytics; usa cookies, se activa solo si la persona acepta
 */
(function () {
  'use strict';
  if (location.protocol === 'http:' && !/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) {
    location.replace('https://' + location.host + location.pathname + location.search + location.hash);
    return;
  }
  var N = window.NEGOCIO || {}, A = N.analitica || {};
  var CLAVE = 'cookies-analitica';
  function cargar(src, attrs) {
    var s = document.createElement('script'); s.async = true; s.src = src;
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    document.head.appendChild(s);
  }
  // GoatCounter: cuenta visitas sin cookies ni datos personales
  if (A.goatcounter) cargar('https://gc.zgo.at/count.js', { 'data-goatcounter': 'https://' + A.goatcounter + '.goatcounter.com/count' });
  // Google Analytics 4: solo con permiso (aviso de cookies)
  if (A.ga4) {
    var gtag = function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
    var activar = function () {
      cargar('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(A.ga4));
      window.gtag = gtag; gtag('js', new Date()); gtag('config', A.ga4, { anonymize_ip: true });
    };
    var dec = null; try { dec = localStorage.getItem(CLAVE); } catch (e) { /* sin almacenamiento */ }
    if (dec === 'si') activar();
    else if (dec !== 'no') document.addEventListener('DOMContentLoaded', function () {
      var b = document.createElement('div');
      b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
      b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99;max-width:560px;margin:0 auto;background:#2e2721;color:#fff;border-radius:14px;padding:14px 16px;font:14px/1.45 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3)';
      b.innerHTML = 'Usamos cookies de Google Analytics para saber cuántas personas visitan la página. <a href="aviso-privacidad.html#cookies" style="color:#f3d9a4">Más información</a>' +
        '<div style="display:flex;gap:8px;margin-top:10px;justify-content:flex-end"><button data-c="no" style="padding:8px 14px;border-radius:20px;border:1px solid #fff6;background:none;color:#fff;cursor:pointer;font:inherit">Rechazar</button>' +
        '<button data-c="si" style="padding:8px 16px;border-radius:20px;border:0;background:#fff;color:#2e2721;font-weight:600;cursor:pointer;font:inherit">Aceptar</button></div>';
      b.addEventListener('click', function (e) {
        var c = e.target.getAttribute && e.target.getAttribute('data-c'); if (!c) return;
        try { localStorage.setItem(CLAVE, c); } catch (er) { /* sin almacenamiento */ }
        b.remove(); if (c === 'si') activar();
      });
      document.body.appendChild(b);
    });
  }
})();
