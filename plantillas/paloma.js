/* Plantilla: Paloma — bautizo (y primera comunión). Corona redonda de olivo con palomita; verde salvia, blanco y azul cielo. */
(function () {
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };

  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const hoja = (x, y, rot, c, s = 1) => `<path d="M0 0c6-8 18-10 26-4c-6 8-18 10-26 4z" fill="${c}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${s})"/>`;
  // Corona circular de olivo: dos ramas que suben por los lados y se abren arriba
  const CORONA = (() => {
    const cx = 200, cy = 200, r = 170, out = [];
    const verdes = ['#8aa37b', '#6f8a63', '#a7bb98', '#5f7a55'];
    for (const lado of [-1, 1]) {
      for (let i = 0; i < 22; i++) {
        const a = Math.PI / 2 + lado * (0.22 + i * 0.118); // de abajo hacia arriba
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        const tang = a * 180 / Math.PI + (lado < 0 ? 90 : -90);
        out.push(hoja(x, y, tang + 35 * lado, verdes[i % 4], 1.05));
        out.push(hoja(x, y, tang - 35 * lado + 180, verdes[(i + 2) % 4], .9));
        if (i % 5 === 2) out.push(`<ellipse cx="${(cx + Math.cos(a) * (r - 12)).toFixed(1)}" cy="${(cy + Math.sin(a) * (r - 12)).toFixed(1)}" rx="5" ry="7" fill="#46603f" transform="rotate(${tang.toFixed(1)} ${(cx + Math.cos(a) * (r - 12)).toFixed(1)} ${(cy + Math.sin(a) * (r - 12)).toFixed(1)})"/>`);
      }
    }
    return `<svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="170" fill="none" stroke="#7d9670" stroke-width="2"/>${out.join('')}<path d="M186 372c8 6 20 6 28 0" stroke="#7d9670" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  })();
  const PALOMA = `<svg viewBox="0 0 220 150"><defs><linearGradient id="pl-ala" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe9f2"/></linearGradient></defs>
    <path d="M40 92c20-6 40-4 58 6c10-26 34-58 78-74c-8 26-20 44-38 58c22-2 44 6 58 22c-24 2-44 8-62 18c-14 8-34 14-56 12c-14-1-30-8-40-22c-6 4-16 6-26 4c8-6 16-14 28-24z" fill="url(#pl-ala)" stroke="#9fb6c9" stroke-width="2" stroke-linejoin="round"/>
    <path d="M98 98c16-10 34-22 48-40M102 104c22-4 40-8 56-6" stroke="#b9cbd9" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="58" cy="88" r="2.6" fill="#3d5266"/><path d="M40 92l-12 2 11 4z" fill="#d9a46b"/>
    <path d="M30 96c-10 8-14 20-12 30" stroke="#6f8a63" stroke-width="1.8" fill="none"/>${hoja(24, 108, 200, '#8aa37b', .7)}${hoja(20, 120, 150, '#6f8a63', .7)}${hoja(26, 102, -30, '#a7bb98', .6)}
  </svg>`;
  const RAMITA = `<svg viewBox="0 0 260 40"><path d="M14 22C70 14 190 14 246 22" stroke="#7d9670" stroke-width="1.6" fill="none"/>${Array.from({ length: 9 }, (_, i) => { const x = 30 + i * 25; return hoja(x, 18, -40, i % 2 ? '#8aa37b' : '#a7bb98', .75) + hoja(x + 8, 22, 140, i % 2 ? '#6f8a63' : '#8aa37b', .75); }).join('')}<circle cx="130" cy="20" r="3.4" fill="#9fb6c9"/></svg>`;
  const GOTAS = `<svg viewBox="0 0 120 60"><g fill="none" stroke="#9fb6c9" stroke-width="1.4"><ellipse cx="60" cy="40" rx="54" ry="12"/><ellipse cx="60" cy="40" rx="34" ry="7"/><ellipse cx="60" cy="40" rx="14" ry="3"/></g><path d="M60 4c6 10 10 16 10 21a10 10 0 0 1-20 0c0-5 4-11 10-21z" fill="#cfe0ec" stroke="#9fb6c9" stroke-width="1.4"/></svg>`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60"><defs><pattern id="pl-forro" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M2 9c3-4 8-5 11-2c-3 4-8 5-11 2z" fill="#a7bb98" opacity=".7"/></pattern></defs><rect width="100" height="60" fill="#f3f6ef"/><rect width="100" height="60" fill="url(#pl-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'paloma',
    eventos: ['bautizo', 'comunion'],
    nombre: 'Paloma',
    descripcion: 'Corona redonda de olivo con palomita blanca. Verde salvia, blanco y azul cielo.',
    colores: ['#fbfcf8', '#6f8a63', '#9fb6c9', '#46603f'],
    efecto: 'hojas',
    efectoColores: ['#a7bb98', '#8aa37b', '#cfe0ec'],
    adornos: [
      { id: 'corona', nombre: 'Corona de olivo', ayuda: 'PNG transparente cuadrado (~800×800 px)' },
      { id: 'paloma', nombre: 'Palomita', ayuda: 'PNG transparente horizontal (~660×450 px)' },
      { id: 'ramita', nombre: 'Separador de olivo', ayuda: 'PNG transparente horizontal (~780×120 px)' }
    ],
    pdf: { slot: 'paloma', svg: PALOMA, modo: 'arriba' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&family=Allura&display=swap',

    render(d, S) {
      const paloma = (c) => S.adorno(d, 'paloma', uniq(PALOMA), c);
      const ramita = S.adorno(d, 'ramita', RAMITA, 'ramita rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada">
    <div class="medallon rv">
      ${S.adorno(d, 'corona', CORONA, 'corona')}
      ${paloma('paloma-portada')}
      <div class="medallon-dentro">
        ${foto ? `<div class="foto-redonda"><img src="${S.esc(foto)}" alt=""></div>` : ''}
        <p class="intro">${S.esc(d.introPortada)}</p>
        ${S.nombres(d)}
      </div>
    </div>
    <div class="titulo-portada rv">
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
      <div class="gotas" aria-hidden="true">${GOTAS}</div>
    </div>
  </section>
  ${S.frase(d, { clase: 'cielo', arriba: ramita })}
  ${S.familia(d, { arriba: ramita })}
  ${S.cuenta(d, { clase: 'salvia' })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'cielo', decoLugar: () => `<div class="lugar-rama">${RAMITA}</div>` })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'cielo' })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'cielo' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: ramita, antes: paloma('paloma-pie') })}
</main>`;
    },

    css: `
body.plantilla-paloma{--fondo:#fbfcf8;--fondo2:#eef4f8;--tinta:#2f3a33;--suave:#5b665e;--acento:#6f8a63;--acento-texto:#4f6a45;--acento2:#46603f;--linea:#d6e0d0;--oscuro:#46603f;--sobre-oscuro:#fbfcf8;--titulo:#46603f;--tarjeta:#ffffff;--radio-btn:999px;
  --f-titulo:'Playfair Display',Georgia,serif;--f-texto:'Lato',system-ui,sans-serif;--f-etiqueta:'Lato',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at center,#ffffff 0%,#e3ece0 100%);--sobre-c1:#dfe8da;--sobre-c2:#e8efe4;--sobre-c3:#f1f5ee;--sello:radial-gradient(circle at 35% 30%,#a7bb98,#6f8a63 60%,#4f6a45);--sello-texto:#fff;--sello-borde:#5f7a55}
.plantilla-paloma .titulo{font-weight:400;font-style:italic;font-size:clamp(32px,8vw,48px)}
.plantilla-paloma .eyebrow{color:var(--acento-texto);letter-spacing:.3em;font-weight:700}
.plantilla-paloma .cielo{background:var(--fondo2)}
.plantilla-paloma .ramita{width:200px;margin:0 auto 20px}
/* Portada: medallón con corona de olivo y paloma */
.plantilla-paloma .portada{flex-direction:column;gap:10px;padding-top:56px;background:radial-gradient(circle at 20% 15%,#e6eff6 0 22%,transparent 50%),radial-gradient(circle at 85% 80%,#e9f0e4 0 20%,transparent 48%),var(--fondo)}
.plantilla-paloma .medallon{position:relative;width:min(400px,88vw);aspect-ratio:1;display:flex;align-items:center;justify-content:center}
.plantilla-paloma .corona{position:absolute;inset:0}
.plantilla-paloma .corona svg,.plantilla-paloma .corona img{width:100%;height:100%}
.plantilla-paloma .paloma-portada{position:absolute;top:-6%;left:50%;width:42%;transform:translateX(-50%);animation:pl-vuelo 5s ease-in-out infinite;z-index:2}
@keyframes pl-vuelo{50%{transform:translate(-50%,-8px)}}
@media (prefers-reduced-motion:reduce){.plantilla-paloma .paloma-portada{animation:none}}
.plantilla-paloma .medallon-dentro{position:relative;z-index:1;width:72%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#ffffff 55%,rgba(255,255,255,.6));display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8%;box-shadow:0 10px 40px rgba(70,96,63,.12)}
.plantilla-paloma .foto-redonda{width:46%;aspect-ratio:1;border-radius:50%;overflow:hidden;border:3px solid #fff;box-shadow:0 0 0 2px var(--acento);margin-bottom:6px}
.plantilla-paloma .foto-redonda img{width:100%;height:100%;object-fit:cover}
.plantilla-paloma .intro{font-size:12px;letter-spacing:.34em;text-transform:uppercase;font-weight:700;color:var(--acento-texto)}
.plantilla-paloma .nombres{font-family:'Allura',cursive;font-size:clamp(58px,17vw,92px);line-height:1;margin:4px 0 0;color:var(--titulo)}
.plantilla-paloma .titulo-portada{width:min(520px,100%)}
.plantilla-paloma .fecha-bloque{border-color:var(--linea)}
.plantilla-paloma .fecha-bloque .dia{font-family:var(--f-titulo);font-weight:400;color:var(--titulo)}
.plantilla-paloma .ciudad{margin-top:12px;color:var(--suave);font-size:17px;letter-spacing:.06em}
.plantilla-paloma .gotas{width:110px;margin:16px auto 0;opacity:.9}
/* Familia en medallones */
.plantilla-paloma .padres>div,.plantilla-paloma .padrinos>div{background:var(--tarjeta);border:1px solid var(--linea);border-radius:28px;padding:22px 18px;box-shadow:0 6px 18px rgba(70,96,63,.07)}
.plantilla-paloma .sec-familia h3{color:var(--acento-texto);letter-spacing:.18em}
/* Cuenta regresiva en círculos claros */
.plantilla-paloma .sec-cuenta.salvia{background:linear-gradient(180deg,#e9f0e4,#dfe9d9);color:var(--tinta)}
.plantilla-paloma .sec-cuenta .titulo{color:var(--titulo)}.plantilla-paloma .sec-cuenta .eyebrow{color:var(--acento-texto)}
.plantilla-paloma .reloj>div{flex:0 0 auto;min-width:0;padding:0;width:72px;height:72px;border-radius:50%;background:#fff;border:2px solid var(--acento);display:flex;flex-direction:column;align-items:center;justify-content:center}
.plantilla-paloma .reloj span{font-family:var(--f-titulo);color:var(--titulo);font-size:28px}
.plantilla-paloma .reloj small{color:var(--suave);font-size:7.5px;letter-spacing:.02em}
.plantilla-paloma .reloj b{color:var(--acento)}
.plantilla-paloma .sec-cuenta .btn{color:var(--acento2);border-color:var(--acento2)}
@media (max-width:420px){.plantilla-paloma .reloj>div{width:64px;height:64px}.plantilla-paloma .reloj{gap:4px}.plantilla-paloma .reloj span{font-size:22px}}
/* Itinerario */
.plantilla-paloma .evento .icono{border-radius:50%;border-color:var(--acento);background:#fff;color:var(--acento2)}
.plantilla-paloma .evento .hora{font-family:var(--f-titulo);font-style:italic;color:var(--acento-texto)}
/* Lugares con ramita arriba */
.plantilla-paloma .lugar{border:none;border-radius:32px;background:var(--tarjeta);box-shadow:0 10px 30px rgba(70,96,63,.1)}
.plantilla-paloma .lugar-rama{width:150px;margin:0 auto 6px}
.plantilla-paloma .lugar h3{font-family:var(--f-titulo);font-style:italic;font-weight:400;font-size:28px;color:var(--titulo)}
.plantilla-paloma .lugar-hora{color:var(--acento-texto)}
.plantilla-paloma .foto{border-radius:50%;aspect-ratio:1;border:4px solid #fff;box-shadow:0 0 0 2px var(--linea)}
.plantilla-paloma .regalo{border-radius:24px;border-color:var(--linea)}
.plantilla-paloma .btn.solido{background:var(--acento2);border-color:var(--acento2)}
.plantilla-paloma .paloma-pie{width:120px;margin:0 auto 14px}
.plantilla-paloma .pie{background:linear-gradient(180deg,#4f6a45,#3a5233)}
.plantilla-paloma .pie .nombres{font-family:'Allura',cursive;color:#e9f0e4}`
  });
})();
