/* Plantilla: Elegante Negro y Dorado — art déco, letras con brillo de foil y destellos. */
(function () {
  const G = '#d4af6a';
  const ESQUINA = `<svg viewBox="0 0 120 120" fill="none" stroke="${G}" stroke-width="1.2">
    <path d="M4 116V4h112"/><path d="M14 116V14h102"/><path d="M24 70V24h46"/>
    <path d="M24 24l22 22M34 24v12h12"/><rect x="40" y="40" width="10" height="10" transform="rotate(45 45 45)" fill="${G}"/>
    <circle cx="14" cy="14" r="3" fill="${G}"/><path d="M4 60h10M60 4v10"/></svg>`;
  let rayos = '';
  for (let i = 0; i <= 16; i++) { const a = Math.PI + i * Math.PI / 16; rayos += `<path d="M150 110L${150 + Math.cos(a) * 100} ${110 + Math.sin(a) * 100}"/>`; }
  const ABANICO = `<svg viewBox="0 0 300 120" fill="none" stroke="${G}" stroke-width="1">
    ${rayos}<path d="M40 110A110 110 0 0 1 260 110"/><path d="M60 110A90 90 0 0 1 240 110"/><path d="M110 110A40 40 0 0 1 190 110" fill="#0f0e0c"/>
    <path d="M0 110h300" stroke-width="1.4"/><circle cx="150" cy="110" r="5" fill="${G}"/></svg>`;
  const SEPARADOR = `<svg viewBox="0 0 260 30" fill="none" stroke="${G}" stroke-width="1"><path d="M0 15h100M160 15h100M20 10h70M170 10h70M20 20h70M170 20h70"/>
    <rect x="120" y="5" width="20" height="20" transform="rotate(45 130 15)"/><rect x="125" y="10" width="10" height="10" transform="rotate(45 130 15)" fill="${G}"/></svg>`;
  const FORRO = `<svg viewBox="0 0 100 60" preserveAspectRatio="none" width="100%" height="100%"><defs><pattern id="do-forro" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12A6 6 0 0 1 12 12M3 12A3 3 0 0 1 9 12M6 6V0" stroke="${G}" stroke-width=".6" fill="none" opacity=".8"/></pattern></defs><rect width="100" height="60" fill="#14120e"/><rect width="100" height="60" fill="url(#do-forro)"/></svg>`;

  window.Invitacion.registrar({
    id: 'dorada',
    nombre: 'Elegante Negro y Dorado',
    descripcion: 'Art déco de gala: fondo negro, letras con brillo dorado y destellos.',
    colores: ['#0f0e0c', '#d4af6a', '#f3e2b3', '#2a2620'],
    efecto: 'destellos',
    efectoColores: ['#f3d98f', '#d4af6a', '#fff3cf'],
    adornos: [
      { id: 'esquina', nombre: 'Esquina art déco', ayuda: 'PNG transparente cuadrado, esquina superior izquierda (~500×500 px)' },
      { id: 'abanico', nombre: 'Abanico superior', ayuda: 'PNG transparente horizontal (~900×360 px)' },
      { id: 'separador', nombre: 'Separador', ayuda: 'PNG transparente horizontal pequeño (~700×80 px)' }
    ],
    pdf: { slot: 'esquina', svg: ESQUINA, modo: 'cuatro' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Pinyon+Script&display=swap',

    render(d, S) {
      const f = S.fechaInfo(d);
      const esq = (c) => S.adorno(d, 'esquina', ESQUINA, 'esq ' + c);
      const marco = esq('tl') + esq('tr') + esq('bl') + esq('br');
      const sep = S.adorno(d, 'separador', SEPARADOR, 'separador rv');
      const foto = d.fotoPortada;
      return `
${S.sobre(d, { forro: FORRO })}
<main>
  <section class="portada ${foto ? 'con-foto' : ''}">
    ${foto ? `<div class="foto-fondo"><img src="${S.esc(foto)}" alt=""></div>` : ''}
    <div class="marco rv">
      ${marco}
      ${S.adorno(d, 'abanico', ABANICO, 'abanico')}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      ${sep}
      <div class="fecha-deco"><span>${f.diaSemana}</span><b>${f.dia}</b><span>${f.mes}</span><b class="anio">${f.anio}</b></div>
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt', arriba: sep })}
  ${S.familia(d, { arriba: sep })}
  ${S.cuenta(d, { antes: marco })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt' })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt' })}
  ${S.extras(d)}
  ${S.cierre(d, { separador: sep, antes: marco })}
</main>`;
    },

    css: `
body.plantilla-dorada{--fondo:#0f0e0c;--fondo2:#16140f;--tinta:#efe6d2;--suave:#a89c84;--acento:#d4af6a;--acento2:#d4af6a;--linea:rgba(212,175,106,.35);--oscuro:#070706;--sobre-oscuro:#efe6d2;--titulo:#e7c98a;--tarjeta:#14120e;--radio-btn:0;
  --f-titulo:'Pinyon Script',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Cinzel',Georgia,serif;
  --fondo-sobre:radial-gradient(ellipse at center,#1d1a14 0%,#070706 100%);--sobre-c1:#1a1813;--sobre-c2:#211e17;--sobre-c3:#26221a;--sello:radial-gradient(circle at 35% 30%,#f3d98f,#c9a14a 55%,#8e6b26);--sello-texto:#2a2010;--sello-borde:#b8913f}
.plantilla-dorada .sello{text-shadow:0 1px 0 rgba(255,255,255,.4)}
.plantilla-dorada .sobre-atras,.plantilla-dorada .sobre-frente{outline:1px solid rgba(212,175,106,.4)}
.plantilla-dorada .sobre-carta{background:#14120e;color:var(--acento)}
.plantilla-dorada .eyebrow{font-size:12px;letter-spacing:.35em}
.plantilla-dorada .titulo,.plantilla-dorada .nombres,.plantilla-dorada .sobre-para strong,.plantilla-dorada .pase strong,.plantilla-dorada .lugar h3,.plantilla-dorada .fecha-deco b{
  background:linear-gradient(100deg,#a8802f 0%,#f3d98f 22%,#c9a14a 40%,#fff1c4 50%,#c9a14a 60%,#f3d98f 78%,#a8802f 100%);background-size:250% 100%;
  -webkit-background-clip:text;background-clip:text;color:transparent;animation:foil 6s ease-in-out infinite}
@keyframes foil{0%,100%{background-position:0% 0}50%{background-position:100% 0}}
.plantilla-dorada .alt{background:var(--fondo2)}
.plantilla-dorada .sec{border-top:1px solid rgba(212,175,106,.12)}
.plantilla-dorada .portada{background:radial-gradient(ellipse at 50% 40%,#1f1b13 0%,#0f0e0c 70%)}
.plantilla-dorada .foto-fondo{position:absolute;inset:0;z-index:0}.plantilla-dorada .foto-fondo img{width:100%;height:100%;object-fit:cover}
.plantilla-dorada .foto-fondo::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(10,9,7,.72),rgba(10,9,7,.85))}
.plantilla-dorada .portada .marco{z-index:1}
.plantilla-dorada .marco{position:relative;width:min(520px,100%);padding:120px 40px 80px;border:1px solid var(--linea);outline:1px solid rgba(212,175,106,.18);outline-offset:-14px}
.plantilla-dorada .esq{position:absolute;width:90px;z-index:1}
.plantilla-dorada .esq.tl{top:-1px;left:-1px}
.plantilla-dorada .esq.tr{top:-1px;right:-1px;transform:scaleX(-1)}
.plantilla-dorada .esq.bl{bottom:-1px;left:-1px;transform:scaleY(-1)}
.plantilla-dorada .esq.br{bottom:-1px;right:-1px;transform:scale(-1)}
.plantilla-dorada .sec-cuenta .esq,.plantilla-dorada .pie .esq{width:70px;opacity:.7}
.plantilla-dorada .sec-cuenta .esq.tl,.plantilla-dorada .pie .esq.tl{top:16px;left:16px}
.plantilla-dorada .sec-cuenta .esq.tr,.plantilla-dorada .pie .esq.tr{top:16px;right:16px}
.plantilla-dorada .sec-cuenta .esq.bl,.plantilla-dorada .pie .esq.bl{bottom:16px;left:16px}
.plantilla-dorada .sec-cuenta .esq.br,.plantilla-dorada .pie .esq.br{bottom:16px;right:16px}
.plantilla-dorada .abanico{position:absolute;top:24px;left:50%;width:220px;transform:translateX(-50%)}
.plantilla-dorada .intro{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.5em;text-transform:uppercase;color:var(--acento);margin-top:10px}
.plantilla-dorada .nombres{font-size:clamp(60px,16vw,104px);padding:0 .1em}
.plantilla-dorada .nombres .amp{font-family:var(--f-etiqueta);font-size:.24em;letter-spacing:.3em;margin:10px 0}
.plantilla-dorada .separador{width:230px;margin:10px auto 22px}
.plantilla-dorada .fecha-deco{display:grid;grid-template-columns:1fr auto 1fr;grid-template-rows:auto auto;align-items:center;gap:4px 18px;max-width:300px;margin:0 auto}
.plantilla-dorada .fecha-deco span{font-family:var(--f-etiqueta);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--tinta);border-top:1px solid var(--linea);border-bottom:1px solid var(--linea);padding:8px 0}
.plantilla-dorada .fecha-deco b{font-family:var(--f-etiqueta);font-weight:400;font-size:60px;line-height:1;grid-row:1;grid-column:2}
.plantilla-dorada .fecha-deco span:first-child{grid-column:1;grid-row:1}
.plantilla-dorada .fecha-deco span:nth-of-type(2){grid-column:3;grid-row:1}
.plantilla-dorada .fecha-deco .anio{grid-row:2;grid-column:1/4;font-size:22px;letter-spacing:.6em;padding-left:.6em;margin-top:8px}
.plantilla-dorada .ciudad{margin-top:26px;font-style:italic;color:var(--suave);font-size:20px}
.plantilla-dorada .lugar{border-color:var(--linea)}
.plantilla-dorada .lugar::before{content:"";position:absolute;inset:8px;border:1px solid rgba(212,175,106,.18);pointer-events:none}
.plantilla-dorada .lugar .btn{position:relative;z-index:1}
.plantilla-dorada .lugar h3{font-size:44px}
.plantilla-dorada .evento .icono{transform:rotate(45deg);border-radius:0;width:44px;height:44px}
.plantilla-dorada .evento .icono svg{transform:rotate(-45deg)}
.plantilla-dorada .foto{border:1px solid var(--linea);padding:8px;background:transparent}
.plantilla-dorada .foto img{filter:grayscale(.25) contrast(1.05)}
.plantilla-dorada .reloj span{font-family:var(--f-etiqueta);font-weight:400;color:var(--titulo)}
.plantilla-dorada .btn.solido{background:linear-gradient(100deg,#a8802f,#f3d98f,#c9a14a);border:none;color:#1a140a;font-weight:600}
.plantilla-dorada .paleta span{border-color:var(--fondo)}
.plantilla-dorada #form-rsvp .opciones input:checked+label{color:#1a140a}
.plantilla-dorada .pie{border-top:1px solid var(--linea)}
@media (max-width:640px){
  .plantilla-dorada .marco{padding:110px 20px 70px}
  .plantilla-dorada .esq{width:64px}
  .plantilla-dorada .abanico{width:180px}
  .plantilla-dorada .fecha-deco b{font-size:48px}
}`
  });
})();
