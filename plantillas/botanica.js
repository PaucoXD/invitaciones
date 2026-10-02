/* Plantilla: Jardín Botánico — la primera versión: marfil, verde salvia y ramas finas. La más minimalista. */
(function () {
  const RAMA = `<svg viewBox="0 0 240 240" style="color:#8a9a7b">
    <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M30 215C70 170 110 120 205 30"/><path d="M95 140C90 110 100 90 120 75"/><path d="M140 95C160 95 180 100 195 115"/></g>
    <g fill="currentColor">
      <ellipse cx="55" cy="180" rx="16" ry="6" transform="rotate(-70 55 180)" opacity=".75"/><ellipse cx="72" cy="190" rx="16" ry="6" transform="rotate(10 72 190)" opacity=".55"/>
      <ellipse cx="78" cy="152" rx="17" ry="6.5" transform="rotate(-60 78 152)" opacity=".8"/><ellipse cx="100" cy="162" rx="17" ry="6.5" transform="rotate(5 100 162)" opacity=".6"/>
      <ellipse cx="88" cy="118" rx="15" ry="5.5" transform="rotate(-80 88 118)" opacity=".7"/><ellipse cx="110" cy="88" rx="14" ry="5" transform="rotate(-40 110 88)" opacity=".85"/>
      <ellipse cx="124" cy="118" rx="18" ry="6.5" transform="rotate(-50 124 118)" opacity=".7"/><ellipse cx="145" cy="122" rx="17" ry="6" transform="rotate(15 145 122)" opacity=".55"/>
      <ellipse cx="160" cy="88" rx="16" ry="6" transform="rotate(-45 160 88)" opacity=".8"/><ellipse cx="172" cy="96" rx="14" ry="5" transform="rotate(30 172 96)" opacity=".6"/>
      <ellipse cx="188" cy="110" rx="12" ry="4.5" transform="rotate(50 188 110)" opacity=".7"/><ellipse cx="180" cy="55" rx="15" ry="5.5" transform="rotate(-35 180 55)" opacity=".75"/>
      <ellipse cx="196" cy="62" rx="13" ry="5" transform="rotate(25 196 62)" opacity=".55"/><ellipse cx="208" cy="30" rx="12" ry="4.5" transform="rotate(-45 208 30)" opacity=".85"/>
    </g>
    <g fill="#d8c08f"><circle cx="120" cy="74" r="3.2"/><circle cx="126" cy="70" r="2.4"/><circle cx="196" cy="116" r="3"/><circle cx="200" cy="122" r="2.2"/><circle cx="46" cy="200" r="2.6"/></g>
  </svg>`;

  window.Invitacion.registrar({
    id: 'botanica',
    eventos: ['boda'],
    nombre: 'Jardín Botánico',
    descripcion: 'Marfil, verde salvia y ramas finas. Elegante y minimalista.',
    colores: ['#fbf8f2', '#8a9a7b', '#3f4a37', '#b8955a'],
    efecto: null,
    adornos: [{ id: 'rama', nombre: 'Rama', ayuda: 'PNG transparente, rama diagonal (~700×700 px)' }],
    pdf: { slot: 'rama', svg: RAMA, modo: 'esquinas' },
    fuentes: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap',

    render(d, S) {
      const rama = (c) => S.adorno(d, 'rama', RAMA, c);
      const foto = d.fotoPortada;
      return `
${S.sobre(d)}
<main>
  <section class="portada">
    <div class="cuadro rv">
      ${rama('rama tl')}${rama('rama br')}
      ${foto ? `<img class="foto-portada" src="${S.esc(foto)}" alt="">` : ''}
      <p class="intro">${S.esc(d.introPortada)}</p>
      ${S.nombres(d)}
      ${S.fechaBloque(d)}
      ${d.ciudad ? `<p class="ciudad">${S.esc(d.ciudad)}</p>` : ''}
    </div>
    <a href="#frase" class="bajar" aria-label="Bajar">${S.ICONOS.flecha}</a>
  </section>
  ${S.frase(d, { clase: 'alt' })}
  ${S.familia(d)}
  ${S.cuenta(d, { antes: rama('rama-fondo l') + rama('rama-fondo r') })}
  ${S.itinerario(d)}
  ${S.ubicacion(d, { clase: 'alt' })}
  ${S.vestimenta(d)}
  ${S.historia(d, { clase: 'alt' })}
  ${S.regalos(d)}
  ${S.rsvp(d, { clase: 'alt' })}
  ${S.extras(d)}
  ${S.cierre(d, { antes: rama('rama-fondo l') + rama('rama-fondo r') })}
</main>`;
    },

    css: `
body.plantilla-botanica{--acento-texto:#7f673e;--fondo:#fbf8f2;--fondo2:#f5efe4;--tinta:#3a3631;--suave:#716a61;--acento:#b8955a;--acento2:#5d6b52;--linea:#e2d6c0;--oscuro:#3f4a37;--sobre-oscuro:#fbf8f2;--titulo:#3f4a37;
  --f-titulo:'Great Vibes',cursive;--f-texto:'Cormorant Garamond',Georgia,serif;--f-etiqueta:'Montserrat',system-ui,sans-serif;
  --fondo-sobre:radial-gradient(ellipse at center,#fdfaf4 0%,#efe6d6 100%);--sobre-c1:#e2d5bb;--sobre-c2:#efe5d1;--sobre-c3:#f3ebdb;--sello:radial-gradient(circle at 35% 30%,#c9a96e,#9c7b45 60%,#7d5f31);--sello-borde:#a7864f}
.plantilla-botanica .alt{background:var(--fondo2)}
.plantilla-botanica .cuadro{position:relative;width:min(560px,100%);padding:80px 30px 70px;border:1px solid #d8c08f;outline:1px solid #d8c08f;outline-offset:7px;background:rgba(251,248,242,.6)}
.plantilla-botanica .rama{position:absolute;width:230px}
.plantilla-botanica .rama.tl{top:-70px;left:-80px;transform:rotate(-8deg)}
.plantilla-botanica .rama.br{bottom:-70px;right:-80px;transform:rotate(172deg)}
.plantilla-botanica .foto-portada{width:100%;aspect-ratio:4/5;object-fit:cover;margin-bottom:30px}
.plantilla-botanica .intro{font-family:var(--f-etiqueta);font-size:11px;letter-spacing:.45em;text-transform:uppercase;color:var(--suave)}
.plantilla-botanica .nombres .amp{font-family:var(--f-texto);font-style:italic}
.plantilla-botanica .ciudad{margin-top:24px;font-style:italic;font-size:20px;color:var(--acento2)}
.plantilla-botanica .rama-fondo{position:absolute;width:300px;opacity:.1;filter:brightness(3)}
.plantilla-botanica .rama-fondo.l{left:-90px;top:-40px}
.plantilla-botanica .rama-fondo.r{right:-90px;bottom:-40px;transform:rotate(180deg)}
.plantilla-botanica .lugar::before{content:"";position:absolute;inset:8px;border:1px solid var(--linea);pointer-events:none}
.plantilla-botanica .lugar .btn{position:relative;z-index:1}
@media (max-width:640px){
  .plantilla-botanica .rama{width:170px}
  .plantilla-botanica .rama.tl{top:-56px;left:-60px}.plantilla-botanica .rama.br{bottom:-56px;right:-60px}
  .plantilla-botanica .cuadro{padding:70px 18px 60px}
}`
  });
})();
