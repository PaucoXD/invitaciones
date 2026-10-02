/* Plantilla: Confeti — cumpleaños. Fiesta moderna: negro, rosa y dorado, letras gigantes, foquitos de marquesina y textos alineados a la izquierda. */
(function () {
  let nUid = 0;
  const uniq = (svg) => { nUid++; return svg.replace(/(id="|url\(#)([\w-]+)/g, (m, a, id) => a + id + '-' + nUid); };

  // ---------- Ilustraciones (se reemplazan por PNG propios desde el editor) ----------
  const C = ['#ff3d7f', '#f2c14e', '#ffffff', '#7b61ff', '#2ee6c5'];
  let semilla = 7; const azar = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
  let piezas = '';
  for (let i = 0; i < 46; i++) {
    const x = azar() * 300, y = azar() * 200, c = C[i % C.length], r = azar() * 360;
    piezas += i % 3 === 0 ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2 + azar() * 3).toFixed(1)}" fill="${c}"/>`
      : i % 3 === 1 ? `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(4 + azar() * 6).toFixed(1)}" height="3" fill="${c}" transform="rotate(${r.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`
      : `<path d="M${x.toFixed(1)} ${y.toFixed(1)}q4 -6 8 0t8 0" stroke="${c}" stroke-width="2" fill="none" transform="rotate(${r.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  const CONFETI = `<svg viewBox="0 0 300 200">${piezas}</svg>`;
  const BRINDIS = `<svg viewBox="0 0 120 120" fill="none" stroke="#f2c14e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M30 20h26l-3 30a10 10 0 01-20 0z"/><path d="M43 60v32M33 92h20"/><path d="M64 20h26l-3 30a10 10 0 01-20 0z" transform="rotate(14 77 40)"/><path d="M80 60l-6 31M68 90l20 4" />
    <path d="M57 14l3-8M66 16l7-5M48 13l-3-8" stroke="#ff3d7f"/><circle cx="40" cy="38" r="1.5" fill="#f2c14e"/><circle cx="76" cy="40" r="1.5" fill="#f2c14e"/></svg>`;
  const FORRO = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 60"><rect width="100" height="60" fill="#1d1d1d"/>${piezas.replace(/cx="([\d.]+)"/g, (m, x) => `cx="${(x / 3).toFixed(1)}"`).replace(/cy="([\d.]+)"/g, (m, y) => `cy="${(y / 3.3).toFixed(1)}"`).replace(/<rect[^>]*>|<path[^>]*>/g, '')}</svg>`;

  window.Invitacion.registrar({
    id: 'confeti',
    eventos: ['cumple'],
    nombre: 'Confeti',
    descripcion: 'Fiesta moderna: negro, rosa y dorado, número gigante y foquitos de marquesina.',
    colores: ['#121212', '#ff3d7f', '#f2c14e', '#ffffff'],
    efecto: 'confeti',
    efectoColores: C,
    adornos: [
      { id: 'confeti', nombre: 'Confeti', ayuda: 'PNG transparente horizontal (~900×600 px)' },
      { id: 'brindis', nombre: 'Copas', ayuda: 'PNG transparente cuadrado (~360×360 px)' }
    ],
    pdf: { slot: 'confeti', svg: CONFETI, modo: 'arriba' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Yellowtail&display=swap',

    render(d, S) {
      const confeti = (c) => S.adorno(d, 'confeti', uniq(CONFETI), c);
      const brindis = (c) => S.adorno(d, 'brindis', BRINDIS, c);
      const f = S.fechaInfo(d), foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada ${foto ? 'con-foto' : ''}">
    ${foto ? `<div class="foto-fondo"><img src="${S.esc(foto)}" alt=""></div>` : ''}
    ${confeti('confeti-arriba')}
    <div class="marquesina rv">
      <p class="grande">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      <div class="fecha-linea"><span>${f.diaSemana}</span><b>${f.dia}.${f.mesNum}.${f.anio}</b><span>${S.esc(d.hora)} hrs</span></div>
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'rosa' })}
  ${S.familia(d)}
  ${S.cuenta(d, { antes: confeti('confeti-fondo') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { decoLugar: () => brindis('brindis') })}
  ${S.vestimenta(d)}
  ${S.historia(d)}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'rosa' })}
  ${S.extras(d)}
  ${S.cierre(d, { antes: confeti('confeti-pie') })}
</main>`;
    },

    css: `
body.plantilla-confeti{--fondo:#121212;--fondo2:#1b1b1b;--tinta:#f4f1ea;--suave:#bdb6aa;--acento:#f2c14e;--acento-texto:#f2c14e;--acento2:#ff3d7f;--linea:#3a3a3a;--oscuro:#000;--sobre-oscuro:#f4f1ea;--titulo:#ffffff;--tarjeta:#1d1d1d;--radio-btn:6px;
  --f-titulo:'Anton',Impact,sans-serif;--f-texto:'DM Sans',system-ui,sans-serif;--f-etiqueta:'DM Sans',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(circle at 50% 35%,#2a2a2a 0%,#0b0b0b 100%);--sobre-c1:#262626;--sobre-c2:#2e2e2e;--sobre-c3:#333;--sello:radial-gradient(circle at 35% 30%,#ff7aa6,#ff3d7f 55%,#c41f5a);--sello-texto:#fff;--sello-borde:#d42a66}
body.plantilla-confeti{font-size:17px}
.plantilla-confeti .sobre-carta{background:#1d1d1d;color:#f2c14e}
.plantilla-confeti .sobre-para strong{font-family:'Yellowtail',cursive;color:#ff3d7f}
/* Todo a la izquierda, títulos gigantes en mayúsculas con raya de color */
.plantilla-confeti .sec{text-align:left;padding:84px 24px;border-top:1px solid #222}
.plantilla-confeti .cont{max-width:760px}
.plantilla-confeti .titulo{font-size:clamp(48px,13vw,92px);text-transform:uppercase;line-height:.95;letter-spacing:.01em;margin-bottom:26px;position:relative;padding-bottom:16px}
.plantilla-confeti .titulo::after{content:"";position:absolute;left:0;bottom:0;width:90px;height:8px;background:linear-gradient(90deg,#ff3d7f,#f2c14e)}
.plantilla-confeti .eyebrow{font-weight:700;letter-spacing:.25em;color:var(--acento2)}
.plantilla-confeti .lead{margin:0;font-style:normal;color:var(--suave)}
.plantilla-confeti .rosa{background:#ff3d7f;color:#fff}
.plantilla-confeti .rosa .titulo,.plantilla-confeti .rosa .eyebrow{color:#121212}.plantilla-confeti .rosa .titulo::after{background:#121212}
.plantilla-confeti .rosa .lead,.plantilla-confeti .rosa .limite{color:#2b0b17}
.plantilla-confeti .sec-frase blockquote{font-family:var(--f-titulo);font-style:normal;text-transform:uppercase;font-size:clamp(32px,8vw,54px);line-height:1.05;color:#121212}
.plantilla-confeti .sec-frase cite{color:#121212}
/* Portada: número gigante con foquitos */
.plantilla-confeti .portada{background:radial-gradient(circle at 50% 40%,#2a1b22 0%,#121212 70%);text-align:center}
.plantilla-confeti .foto-fondo{position:absolute;inset:0}.plantilla-confeti .foto-fondo img{width:100%;height:100%;object-fit:cover}
.plantilla-confeti .foto-fondo::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(18,18,18,.55),rgba(18,18,18,.92))}
.plantilla-confeti .confeti-arriba{position:absolute;top:0;left:50%;width:max(640px,100%);transform:translateX(-50%);opacity:.9;z-index:1}
.plantilla-confeti .marquesina{position:relative;z-index:2;width:min(520px,100%);padding:44px 26px 38px;border-radius:18px;
  background:linear-gradient(#121212,#121212) padding-box,radial-gradient(circle,#ffe7a0 0 3px,transparent 4px) 0 0/22px 22px border-box;border:11px solid transparent;
  box-shadow:0 0 0 2px #f2c14e,0 0 40px rgba(242,193,78,.25)}
.plantilla-confeti .marquesina::before{content:"";position:absolute;inset:-11px;border-radius:18px;padding:11px;background:radial-gradient(circle,#ff7aa6 0 3px,transparent 4px) 11px 11px/22px 22px;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:foquitos 1.2s steps(2) infinite;pointer-events:none}
@keyframes foquitos{50%{opacity:.35}}
.plantilla-confeti .grande{font-family:'Anton',sans-serif;text-transform:uppercase;font-size:clamp(88px,30vw,170px);line-height:.9;
  background:linear-gradient(100deg,#ff3d7f 0%,#ff7aa6 30%,#f2c14e 70%,#ffe7a0 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.plantilla-confeti .nombres{font-family:'Yellowtail',cursive;font-size:clamp(54px,15vw,86px);color:#fff;margin:6px 0 4px}
.plantilla-confeti .fecha-linea{display:flex;justify-content:center;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;font-size:13px;color:var(--suave)}
.plantilla-confeti .fecha-linea b{font-family:'Anton',sans-serif;font-weight:400;font-size:30px;letter-spacing:.04em;color:#f2c14e}
.plantilla-confeti .ciudad{margin-top:12px;color:#fff;font-weight:500}
/* Cuenta regresiva en bloques */
.plantilla-confeti .sec-cuenta{background:#0b0b0b}
.plantilla-confeti .confeti-fondo{position:absolute;inset:0;opacity:.35}.plantilla-confeti .confeti-fondo svg{width:100%;height:100%}
.plantilla-confeti .reloj{justify-content:flex-start;gap:8px;flex-wrap:nowrap}
.plantilla-confeti .reloj>div{background:#1d1d1d;border:2px solid #333;border-radius:10px;padding:12px 6px 10px;flex:1 1 0;min-width:0;max-width:110px;text-align:center}
.plantilla-confeti .reloj span{font-family:'Anton',sans-serif;font-weight:400;color:#f2c14e;font-size:clamp(32px,9vw,58px)}
.plantilla-confeti .reloj b{display:none}
.plantilla-confeti .oscura .btn{border-color:#f2c14e;color:#f2c14e}
/* Itinerario como lista con horas grandes */
.plantilla-confeti .linea{margin:10px 0 0;max-width:none}.plantilla-confeti .linea::before{display:none}
.plantilla-confeti .evento,.plantilla-confeti .evento:nth-child(even){grid-template-columns:120px 40px 1fr;margin:0;padding:16px 0;border-bottom:1px dashed #333}
.plantilla-confeti .evento .hora,.plantilla-confeti .evento:nth-child(even) .hora{order:0;text-align:left;font-family:'Anton',sans-serif;font-size:34px;color:#ff3d7f}
.plantilla-confeti .evento .icono,.plantilla-confeti .evento:nth-child(even) .icono{order:1;border:none;background:none;color:#f2c14e;width:34px;height:34px}
.plantilla-confeti .evento .que,.plantilla-confeti .evento:nth-child(even) .que{order:2;text-align:left;font-weight:700;font-size:19px}
/* Lugares y regalos en tarjetas con borde de color */
.plantilla-confeti .lugares{grid-template-columns:1fr}
.plantilla-confeti .lugar{text-align:left;background:#1d1d1d;border:none;border-left:6px solid #ff3d7f;border-radius:6px;padding:26px 24px}
.plantilla-confeti .lugar:nth-child(even){border-left-color:#f2c14e}
.plantilla-confeti .brindis{float:right;width:70px;margin:-6px 0 0 10px}
.plantilla-confeti .lugar h3{font-family:'Anton',sans-serif;font-size:34px;text-transform:uppercase;color:#fff}
.plantilla-confeti .lugar-hora{color:#f2c14e}
.plantilla-confeti .regalos{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
.plantilla-confeti .regalo{background:#1d1d1d;border:2px solid #333;border-radius:8px;text-align:left;padding:22px}
.plantilla-confeti .regalo svg{margin:0 0 10px;color:#ff3d7f}
.plantilla-confeti .banco{text-align:left}
.plantilla-confeti .figuras{justify-content:flex-start;color:#f2c14e}
.plantilla-confeti .paleta{justify-content:flex-start}
.plantilla-confeti .padres{text-align:left}
.plantilla-confeti .galeria{max-width:none}
.plantilla-confeti .foto{border-radius:8px}
.plantilla-confeti .btn{font-weight:700;letter-spacing:.14em}
.plantilla-confeti .btn.solido{background:linear-gradient(100deg,#ff3d7f,#f2c14e);border:none;color:#121212}
.plantilla-confeti .rosa .btn.solido{background:#121212;color:#fff}
.plantilla-confeti .pase{background:#121212;color:#fff;border:2px dashed #f2c14e;border-radius:10px;display:block;max-width:420px}
.plantilla-confeti .pase strong{font-family:'Yellowtail',cursive;color:#f2c14e}
.plantilla-confeti #form-rsvp{margin:0}
.plantilla-confeti .rosa #form-rsvp label{color:#2b0b17}
.plantilla-confeti #form-rsvp input[type=text],.plantilla-confeti #form-rsvp select,.plantilla-confeti #form-rsvp textarea{background:#fff;color:#121212;border:none;border-radius:6px}
.plantilla-confeti #form-rsvp .opciones label{background:#fff;color:#121212;border:none}
.plantilla-confeti #form-rsvp .opciones input:checked+label{background:#121212;color:#fff}
.plantilla-confeti .form-whats{margin-left:0}
.plantilla-confeti .form-whats input,.plantilla-confeti .form-whats textarea{background:#1d1d1d;color:#fff;border-color:#333;border-radius:6px}
.plantilla-confeti .contactos{justify-content:flex-start}
.plantilla-confeti .acceso-tarjeta{margin-left:0;text-align:center}
.plantilla-confeti .pie{background:#000;text-align:left}
.plantilla-confeti .pie .nombres{font-family:'Yellowtail',cursive;color:#ff3d7f}
.plantilla-confeti .confeti-pie{position:absolute;inset:0;opacity:.4}.plantilla-confeti .confeti-pie svg{width:100%;height:100%}
.plantilla-confeti .pie>*:not(.confeti-pie){position:relative}
@media (max-width:640px){
  .plantilla-confeti .evento,.plantilla-confeti .evento:nth-child(even){grid-template-columns:96px 34px 1fr}
  .plantilla-confeti .evento .hora,.plantilla-confeti .evento:nth-child(even) .hora{font-size:28px}
}`
  });
})();
