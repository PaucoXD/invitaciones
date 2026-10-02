/* Plantilla: Cáliz — primera comunión (y bautizo). Ventana de vitral con cáliz y hostia, trigo y uvas; marfil, dorado y azul. */
(function () {
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };

  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const ORO = `<defs><linearGradient id="cz-oro" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a77d2c"/><stop offset=".45" stop-color="#f1d58e"/><stop offset=".75" stop-color="#c79b45"/><stop offset="1" stop-color="#9a6f22"/></linearGradient></defs>`;
  const CALIZ = `<svg viewBox="0 0 200 240">${ORO}
    <g fill="#fffaf0" stroke="url(#cz-oro)" stroke-width="2.5"><circle cx="100" cy="58" r="30"/></g>
    <g stroke="url(#cz-oro)" stroke-width="1.6" opacity=".9"><path d="M100 34v48M76 58h48"/></g>
    <g stroke="#e7c873" stroke-width="1.2" opacity=".8">${Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return `<path d="M${(100 + Math.cos(a) * 36).toFixed(1)} ${(58 + Math.sin(a) * 36).toFixed(1)}L${(100 + Math.cos(a) * 50).toFixed(1)} ${(58 + Math.sin(a) * 50).toFixed(1)}"/>`; }).join('')}</g>
    <path d="M56 96h88c0 30-18 50-36 56v26c0 6 18 10 26 14v10H66v-10c8-4 26-8 26-14v-26c-18-6-36-26-36-56z" fill="url(#cz-oro)"/>
    <path d="M62 100h76" stroke="#fff3cc" stroke-width="3" opacity=".7"/><ellipse cx="100" cy="166" rx="8" ry="4" fill="#fff3cc" opacity=".6"/>
    <rect x="70" y="204" width="60" height="8" rx="3" fill="url(#cz-oro)"/>
  </svg>`;
  const trigo = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0V-90" stroke="#c9a65a" stroke-width="2"/>${Array.from({ length: 7 }, (_, i) => `<ellipse cx="-6" cy="${-20 - i * 10}" rx="4" ry="8" fill="#e2c37a" transform="rotate(-30 -6 ${-20 - i * 10})"/><ellipse cx="6" cy="${-24 - i * 10}" rx="4" ry="8" fill="#d7b465" transform="rotate(30 6 ${-24 - i * 10})"/>`).join('')}<ellipse cx="0" cy="-94" rx="4" ry="9" fill="#e2c37a"/></g>`;
  const uvas = (x, y) => `<g transform="translate(${x} ${y})">${[[0, 0], [12, 0], [24, 0], [6, 11], [18, 11], [12, 22], [-6, 11], [30, 11]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#6a4c93"/><circle cx="${a - 2}" cy="${b - 2}" r="2" fill="#fff" opacity=".35"/>`).join('')}<path d="M12 -6c0-10 8-14 16-14" stroke="#7d8f5a" stroke-width="2" fill="none"/><path d="M14 -10c-14-10-26 0-26 0s14 8 26 0z" fill="#8fa66b"/></g>`;
  const RAMO = `<svg viewBox="0 0 260 150">${trigo(40, 140, -28)}${trigo(60, 146, -12)}${trigo(220, 140, 28)}${trigo(200, 146, 12)}${uvas(108, 96)}</svg>`;
  const CRUZ = `<svg viewBox="0 0 260 30">${ORO}<path d="M10 15H112M148 15H250" stroke="url(#cz-oro)" stroke-width="1.2"/><path d="M130 2v26M120 11h20" stroke="url(#cz-oro)" stroke-width="3" stroke-linecap="round"/><circle cx="112" cy="15" r="2.4" fill="#c79b45"/><circle cx="148" cy="15" r="2.4" fill="#c79b45"/></svg>`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60"><defs><pattern id="cz-forro" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M5 2v6M2 5h6" stroke="#c79b45" stroke-width=".8"/></pattern></defs><rect width="100" height="60" fill="#f4ecd9"/><rect width="100" height="60" fill="url(#cz-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'caliz',
    eventos: ['comunion', 'bautizo'],
    nombre: 'Cáliz',
    descripcion: 'Vitral de iglesia con cáliz y hostia, trigo y uvas. Marfil, dorado y azul.',
    colores: ['#fbf7ee', '#2c4a7a', '#c79b45', '#6a4c93'],
    efecto: 'destellos',
    efectoColores: ['#f1d58e', '#ffffff', '#c79b45'],
    adornos: [
      { id: 'caliz', nombre: 'Cáliz y hostia', ayuda: 'PNG transparente vertical (~500×600 px)' },
      { id: 'ramo', nombre: 'Trigo y uvas', ayuda: 'PNG transparente horizontal (~780×450 px)' },
      { id: 'cruz', nombre: 'Separador con cruz', ayuda: 'PNG transparente horizontal (~780×90 px)' }
    ],
    pdf: { slot: 'ramo', svg: RAMO, modo: 'abajo' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes&display=swap',

    render(d, S) {
      const caliz = (c) => S.adorno(d, 'caliz', uniq(CALIZ), c);
      const ramo = (c) => S.adorno(d, 'ramo', RAMO, c);
      const cruz = S.adorno(d, 'cruz', uniq(CRUZ), 'cruz rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada">
    <div class="vitral rv">
      <div class="vidrio" aria-hidden="true"></div>
      <div class="vitral-dentro">
        ${foto ? `<div class="foto-arco"><img src="${S.esc(foto)}" alt=""></div>` : caliz('caliz-portada')}
      </div>
    </div>
    <div class="titulo-portada rv">
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      ${cruz}
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
      ${ramo('ramo-portada')}
    </div>
  </section>
  ${S.frase(d, { clase: 'pergamino', arriba: cruz })}
  ${S.familia(d, { arriba: cruz })}
  ${S.cuenta(d)}
  ${S.itinerario(d, { clase: 'pergamino' })}
  ${S.ubicacion(d)}
  ${S.vestimenta(d, { clase: 'pergamino' })}
  ${S.historia(d)}
  ${S.regalos(d, { clase: 'pergamino' })}
  ${S.rsvp(d)}
  ${S.extras(d)}
  ${S.cierre(d, { separador: cruz, antes: caliz('caliz-pie') })}
</main>`;
    },

    css: `
body.plantilla-caliz{--fondo:#fbf7ee;--fondo2:#f4ecd9;--tinta:#2d2a33;--suave:#5c5560;--acento:#c79b45;--acento-texto:#7f5f20;--acento2:#2c4a7a;--linea:#e3d3ad;--oscuro:#1f3557;--sobre-oscuro:#fbf7ee;--titulo:#2c4a7a;--tarjeta:#fffdf7;--radio-btn:2px;
  --f-titulo:'Cinzel',Georgia,serif;--f-texto:'EB Garamond',Georgia,serif;--f-etiqueta:'Cinzel',Georgia,serif;
  --fondo-sobre:radial-gradient(ellipse at center,#fffdf6 0%,#ecdfc0 100%);--sobre-c1:#e3d3ad;--sobre-c2:#ecdfc2;--sobre-c3:#f2e8d2;--sello:radial-gradient(circle at 35% 30%,#f1d58e,#c79b45 55%,#9a6f22);--sello-texto:#3e2c0b;--sello-borde:#b0852f}
.plantilla-caliz .titulo{font-weight:600;font-size:clamp(34px,8.5vw,52px);letter-spacing:.04em}
.plantilla-caliz .eyebrow{color:var(--acento-texto)}
.plantilla-caliz .pergamino{background:var(--fondo2)}
.plantilla-caliz .cruz{width:220px;margin:4px auto 22px}
/* Portada: ventana de vitral */
.plantilla-caliz .portada{flex-direction:column;gap:6px;padding-top:50px;background:radial-gradient(ellipse at 50% 20%,#fffdf8 0%,var(--fondo) 60%)}
.plantilla-caliz .vitral{position:relative;width:min(300px,74vw);aspect-ratio:3/4.2;border-radius:150px 150px 10px 10px;padding:12px;background:linear-gradient(135deg,#a77d2c,#f1d58e 40%,#c79b45 70%,#9a6f22);box-shadow:0 20px 50px rgba(44,74,122,.18)}
.plantilla-caliz .vidrio{position:absolute;inset:12px;border-radius:140px 140px 4px 4px;overflow:hidden;
  background:conic-gradient(from 0deg at 50% 38%,#2c4a7a 0 12%,#6a4c93 0 22%,#3f7f9c 0 34%,#c0533f 0 42%,#2c4a7a 0 54%,#d9a93f 0 62%,#3f7f9c 0 74%,#6a4c93 0 84%,#2c4a7a 0 92%,#c0533f 0)}
.plantilla-caliz .vidrio::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 46px,#c79b45 46px 49px),repeating-linear-gradient(0deg,transparent 0 58px,#c79b45 58px 61px);opacity:.9}
.plantilla-caliz .vidrio::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 36%,rgba(255,250,230,.95) 0 26%,rgba(255,250,230,0) 52%)}
.plantilla-caliz .vitral-dentro{position:relative;z-index:1;height:100%;display:flex;align-items:center;justify-content:center}
.plantilla-caliz .caliz-portada{width:62%;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))}
.plantilla-caliz .foto-arco{width:100%;height:100%;border-radius:140px 140px 4px 4px;overflow:hidden}.plantilla-caliz .foto-arco img{width:100%;height:100%;object-fit:cover}
.plantilla-caliz .titulo-portada{position:relative;z-index:2;width:min(520px,100%);margin-top:18px}
.plantilla-caliz .intro{font-family:var(--f-etiqueta);font-size:14px;letter-spacing:.32em;text-transform:uppercase;color:var(--acento-texto)}
.plantilla-caliz .nombres{font-family:'Great Vibes',cursive;font-size:clamp(70px,20vw,112px);margin:4px 0 0}
.plantilla-caliz .fecha-bloque .dia{font-family:var(--f-etiqueta);font-weight:400;color:var(--titulo)}
.plantilla-caliz .ciudad{margin-top:14px;font-style:italic;color:var(--suave);font-size:20px}
.plantilla-caliz .ramo-portada{width:min(260px,70vw);margin:10px auto 0}
/* Secciones */
.plantilla-caliz .sec-familia h3,.plantilla-caliz .lugar-hora{color:var(--acento-texto)}
.plantilla-caliz .sec-cuenta{background:linear-gradient(160deg,#1f3557,#2c4a7a)}
.plantilla-caliz .reloj span{font-family:var(--f-etiqueta);color:#f1d58e}
.plantilla-caliz .sec-cuenta .eyebrow{color:#f1d58e}
.plantilla-caliz .lugar{border:none;background:var(--tarjeta);border-radius:120px 120px 6px 6px;padding-top:50px;box-shadow:0 0 0 1px var(--linea),0 0 0 7px var(--tarjeta),0 0 0 8px var(--acento)}
.plantilla-caliz .lugar h3{font-family:var(--f-titulo);font-weight:600;font-size:28px;color:var(--titulo)}
.plantilla-caliz .lugar .btn{position:relative}
.plantilla-caliz .evento .icono{border-color:var(--acento);color:var(--acento2)}
.plantilla-caliz .evento .hora{font-family:var(--f-etiqueta);font-size:24px}
.plantilla-caliz .foto{border-radius:90px 90px 4px 4px;border:4px solid #fff;box-shadow:0 0 0 1px var(--acento)}
.plantilla-caliz .regalo{border-color:var(--acento)}
.plantilla-caliz .btn.solido{background:var(--acento2);border-color:var(--acento2)}
.plantilla-caliz .pase{border-style:double;border-width:4px}
.plantilla-caliz .caliz-pie{width:90px;margin:0 auto 18px}
.plantilla-caliz .pie{background:linear-gradient(180deg,#1f3557,#16263f)}
.plantilla-caliz .pie .nombres{font-family:'Great Vibes',cursive;color:#f1d58e}
@media (max-width:640px){.plantilla-caliz .vitral{width:min(250px,68vw)}}`
  });
})();
