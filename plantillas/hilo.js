/* Plantillas "Hilo": papel crema con un hilo de color que cruza la invitación (portada, fecha e itinerario),
   tira de días con corazón, bandas de borde ondulado y títulos en letra manuscrita. Una paleta por diseño. */
(function () {
  const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const PAPEL = url(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .35  0 0 0 .18 0"/></filter><rect width="260" height="260" filter="url(#p)"/></svg>`);
  // Papel arrugado para las bandas de color
  const ARRUGA = url(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="8" stitchTiles="stitch"/><feDiffuseLighting lighting-color="#fff" surfaceScale="2.2"><feDistantLight azimuth="45" elevation="58"/></feDiffuseLighting><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .5 0 0 0 -.38"/></filter><rect width="400" height="400" filter="url(#a)"/></svg>`);
  // Bordes ondulados (arriba y abajo) para las bandas
  const OLA_ARRIBA = url('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 22C70 2 130 2 200 18S330 40 400 12V40H0Z"/></svg>');
  const OLA_ABAJO = url('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 0H400V24C330 6 270 4 200 22S70 40 0 18Z"/></svg>');
  const CORAZON = '<svg viewBox="0 0 40 36" aria-hidden="true"><path d="M20 35S2 23.8 2 12A9.4 9.4 0 0120 7.6 9.4 9.4 0 0138 12C38 23.8 20 35 20 35z" fill="currentColor"/></svg>';
  const hilo = (d, clase) => `<svg class="hl-hilo ${clase}" viewBox="0 0 390 300" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>`;

  const VARIANTES = [
    { id: 'hilo-vino', nombre: 'Hilo Vino', desc: 'Crema y rojo vino con un hilo que une la fecha y el itinerario.',
      c: { papel: '#fbf6f1', papel2: '#f3ebe3', acento: '#7d1426', acentoOsc: '#5e0e1c', tinta: '#3b2a2a', suave: '#6e5c5a', linea: '#e3d3cc' } },
    { id: 'hilo-azul', nombre: 'Hilo Azul', desc: 'Crema y azul tinta con un hilo que une la fecha y el itinerario.',
      c: { papel: '#f8f6f2', papel2: '#eeebe5', acento: '#1f3a5f', acentoOsc: '#152a46', tinta: '#26303f', suave: '#5d6676', linea: '#d6dbe3' } },
    { id: 'hilo-olivo', nombre: 'Hilo Olivo', desc: 'Crema y verde olivo con un hilo que une la fecha y el itinerario.',
      c: { papel: '#f8f6ef', papel2: '#eeeadd', acento: '#4b5a32', acentoOsc: '#374425', tinta: '#2f3427', suave: '#62695a', linea: '#d9dccb' } }
  ];

  function render(V, d, S) {
    const e = S.esc, f = S.fechaInfo(d), oc = d.ocultar;
    const gal = (d.historia.fotos || []).filter(x => x && x.src);
    const foto = (src, c = '') => src ? `<figure class="hl-foto ${c} rv" data-zoom="${e(src)}"><img src="${e(src)}" alt="" loading="lazy"></figure>` : '';
    const fotoVacia = (c) => `<figure class="hl-foto vacia ${c} rv"><span>${S.ICONOS.foto}Foto</span></figure>`;

    // ---- Portada: nombres manuscritos, hilo que cruza y dos fotos ----
    const portada = `<header class="hl-portada">
      ${hilo('M-10 150C80 120 150 60 230 70S330 140 280 160 210 110 290 80 380 60 400 70', 'hp')}
      <h1 class="hl-nombres rv"><span>${e(d.novia)}</span><i>&amp;</i><span>${e(d.novio)}</span></h1>
      <p class="hl-intro rv">${e(d.introPortada)}</p>
      <div class="hl-dos">${d.fotoPortada ? foto(d.fotoPortada, 'p1') : fotoVacia('p1')}${gal[0] ? foto(gal[0].src, 'p2') : fotoVacia('p2')}</div>
    </header>`;

    // ---- Tira de días con corazón ----
    const [yy, mm, dd] = String(d.fecha || '2027-01-01').split('-').map(Number);
    const dias = [-2, -1, 0, 1, 2].map(k => new Date(yy, mm - 1, dd + k).getDate());
    const tira = `<p class="hl-mes rv">nuestro ${e(String(f.mes).toLowerCase())}</p>
      <div class="hl-dias rv">${dias.map((n, i) => i === 2 ? `<span class="hoy">${CORAZON}<b>${n}</b></span>` : `<span class="${i % 4 ? 'cerca' : ''}">${n}</span>`).join('')}</div>`;

    // ---- Itinerario sobre el hilo ----
    const it = (d.itinerario || []).filter(x => S.hay(x.evento));
    let itin = '';
    if (it.length && !oc.itinerario) {
      let p = 'M50 0';
      it.forEach((_, i) => { const x = i % 2 ? 4 : 96, y = i * 100; p += ` C${x} ${y + 15} ${x} ${y + 85} 50 ${y + 100}`; });
      itin = `<div class="hl-itin">
        <svg class="hl-hilo hi" viewBox="0 0 100 ${it.length * 100}" preserveAspectRatio="none" aria-hidden="true"><path d="${p}" vector-effect="non-scaling-stroke"/></svg>
        ${it.map((x, i) => `<div class="hl-ev ${i % 2 ? 'der' : 'izq'} rv"><p class="hl-hora">${e(x.hora)}</p><h3>${e(x.evento)}</h3>${S.hay(x.detalle) ? `<p>${e(x.detalle)}</p>` : ''}</div>`).join('')}
      </div>`;
    }
    const frase = S.hay(d.frase) && !oc.frase ? `<blockquote class="hl-frase rv">${S.br(d.frase)}${S.hay(d.fraseAutor) ? `<cite>${e(d.fraseAutor)}</cite>` : ''}</blockquote>` : '';
    const dia = `<section id="itinerario" class="sec hl-dia">${frase}${tira}${itin}</section>`;

    // ---- Cuenta regresiva con foto ----
    const cuenta = oc.cuenta ? '' : `<section id="cuenta" class="sec hl-cuenta">
      ${gal[1] ? foto(gal[1].src, 'c1') : ''}
      <p class="hl-script rv">nos diremos que sí en…</p>
      ${S.reloj()}
      <a class="btn rv" target="_blank" rel="noopener" href="${e(S.enlaceCalendario(d))}">${S.ICONOS.calendario}Agendar en calendario</a>
    </section>`;

    // Banda con el corazón sobre el hilo y la firma
    const firma = `<div class="hl-corazon rv">${hilo('M0 160C90 200 150 120 195 150S300 200 390 140', 'hc')}<span>${CORAZON}</span></div>
      <p class="hl-firma rv">Con amor,<br>${e(d.novia)} y ${e(d.novio)}</p>`;
    const historia = S.historia(Object.assign({}, d, { historia: Object.assign({}, d.historia, { fotos: gal.slice(3) }) }), { clase: '' });

    return `
${S.sobre(d)}
<main class="hl">
  ${portada}
  ${dia}
  ${S.ubicacion(d, { clase: 'hl-tarjeta' })}
  ${gal[2] ? `<div class="hl-ancha">${foto(gal[2].src, 'ancha')}</div>` : ''}
  ${S.familia(d, { clase: 'hl-banda', despues: firma })}
  ${cuenta}
  ${S.vestimenta(d)}
  ${historia}
  ${S.regalos(d, { clase: 'hl-banda' })}
  ${S.rsvp(d)}
  ${S.extras(d)}
  ${S.cierre(d, { clase: 'hl-pie', antes: `<div class="hl-cierre-corazon">${CORAZON}</div>` })}
</main>`;
  }

  function css(V) {
    const c = V.c, id = V.id;
    return `
body.plantilla-${id}{--fondo:${c.papel};--fondo2:${c.papel2};--tinta:${c.tinta};--suave:${c.suave};--acento:${c.acento};--acento2:${c.acento};--linea:${c.linea};--titulo:${c.acento};
  --oscuro:${c.acento};--sobre-oscuro:#fff;--tarjeta:#fffdfa;--banda:${c.acento};
  --f-titulo:'Marck Script',cursive;--f-texto:'Jost',system-ui,sans-serif;--f-etiqueta:'Jost',system-ui,sans-serif;
  --fondo-sobre:${c.papel};--sobre-c1:${c.acento};--sobre-c2:${c.acentoOsc};--sobre-c3:${c.acento};
  --sello:radial-gradient(circle at 35% 30%,#fff 0,#f1e7e2 55%,#d8c8c2);--sello-texto:${c.acento};--sello-borde:#e6d9d3;
  font-size:16px;background:${c.papel} ${PAPEL};line-height:1.6;font-weight:300}
.hl{overflow:hidden}
.hl .sec{padding:56px 26px;text-align:center;position:relative}
.hl .cont{max-width:520px}
.hl .eyebrow{font-family:var(--f-etiqueta);font-size:12px;font-weight:400;letter-spacing:.28em;text-transform:uppercase;color:var(--suave);margin-bottom:4px}
.hl .titulo,.hl-script{font-family:var(--f-titulo);font-weight:400;font-size:clamp(34px,9.5vw,44px);line-height:1.15;color:var(--titulo);margin-bottom:12px}
.hl .lead{font-size:15px;font-style:normal;color:var(--suave)}
.hl .btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--f-texto);font-size:13px;font-weight:400;letter-spacing:.06em;text-transform:none;padding:9px 22px;border-radius:4px;border:1px solid var(--acento);background:transparent;color:var(--acento);text-decoration:none;box-shadow:none}
.hl .btn.solido,.hl .btn:hover{background:var(--acento);color:#fff}
.hl .btn svg{width:15px;height:15px}
.hl .rv{transform:translateY(16px)}.hl .rv.vis{transform:none}

/* Hilo */
.hl-hilo{position:absolute;pointer-events:none;overflow:visible}
.hl-hilo path{fill:none;stroke:var(--acento);stroke-width:1.6;stroke-linecap:round}

/* Portada */
.hl-portada{position:relative;padding:58px 22px 30px;text-align:center}
.hl-portada .hp{left:0;top:40px;width:100%;height:300px;z-index:0}
.hl-nombres{position:relative;z-index:1;font-family:var(--f-titulo);font-weight:400;font-size:clamp(46px,14vw,64px);line-height:1;color:var(--acento);display:flex;flex-direction:column;align-items:center}
.hl-nombres span:first-child{margin-right:22%}.hl-nombres span:last-child{margin-left:22%}
.hl-nombres i{font-style:normal;font-size:.6em;margin:-.1em 0}
.hl-intro{position:relative;z-index:1;font-family:var(--f-titulo);font-size:24px;color:var(--tinta);transform:rotate(-6deg);margin:18px 0 26px}
.hl-dos{position:relative;z-index:1;display:grid;grid-template-columns:1.25fr 1fr;gap:8px;align-items:end}
.hl-foto{position:relative;margin:0;border-radius:12px;overflow:hidden;cursor:zoom-in;box-shadow:0 10px 22px -14px rgba(0,0,0,.45)}
.hl-foto img{width:100%;height:100%;object-fit:cover;display:block}
.hl-dos .p1 img{aspect-ratio:4/4.4;filter:grayscale(1) contrast(1.05)}
.hl-dos .p2 img{aspect-ratio:3/4.4}
.hl-foto.vacia{display:flex;align-items:center;justify-content:center;aspect-ratio:3/4;background:var(--fondo2);cursor:default}
.hl-foto.vacia span{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--suave)}
.hl-foto.vacia svg{width:30px;height:30px}

/* Frase, tira de días e itinerario */
.hl-dia{padding-top:34px!important;padding-bottom:20px!important}
.hl-frase{font-size:15px;color:var(--suave);max-width:320px;margin:0 auto 30px}
.hl-frase cite{display:block;font-style:normal;font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin-top:8px}
.hl-mes{font-family:var(--f-titulo);font-size:30px;color:var(--acento);margin-bottom:12px}
.hl-dias{display:flex;justify-content:center;align-items:center;gap:10px;position:relative;z-index:1}
.hl-dias span{width:30px;height:34px;border:1px solid var(--linea);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--suave);background:var(--fondo)}
.hl-dias span.cerca{width:36px;height:40px;font-size:15px;border-color:color-mix(in srgb,var(--acento) 45%,var(--linea));color:var(--tinta)}
.hl-dias .hoy{width:62px;height:58px;border:none;background:none;position:relative;color:var(--acento)}
.hl-dias .hoy svg{position:absolute;inset:0;width:100%;height:100%}
.hl-dias .hoy b{position:relative;color:#fff;font-size:22px;font-weight:500;margin-top:-6px}
.hl-itin{position:relative;margin:-10px auto 0;max-width:420px;padding-top:24px}
.hl-itin .hi{left:0;top:0;width:100%;height:100%}
.hl-ev{position:relative;width:57%;min-height:150px;padding:34px 0 0;text-align:left}
.hl-ev.der{margin-left:auto;text-align:right;padding-right:4%}
.hl-ev.der .hl-hora{margin:0 40% 0 0}
.hl-ev.izq{padding-left:4px}
.hl-hora{font-family:var(--f-titulo);font-size:28px;color:var(--acento);line-height:1;margin-left:40%}
.hl-ev h3{font-family:var(--f-titulo);font-weight:400;font-size:27px;line-height:1.1;color:var(--tinta);margin:4px 0 6px}
.hl-ev p:not(.hl-hora){font-size:14px;color:var(--suave);line-height:1.5}

/* Bandas de color con borde ondulado y papel arrugado */
.hl .hl-banda{background:${c.acento} ${ARRUGA};color:#fff;--acento:#fff;--titulo:#fff;--suave:rgba(255,255,255,.85);--linea:rgba(255,255,255,.35);padding-top:84px;padding-bottom:84px;margin:10px 0;
  -webkit-mask:${OLA_ARRIBA} top/100% 40px no-repeat,linear-gradient(#000,#000) center/100% calc(100% - 78px) no-repeat,${OLA_ABAJO} bottom/100% 40px no-repeat;
  mask:${OLA_ARRIBA} top/100% 40px no-repeat,linear-gradient(#000,#000) center/100% calc(100% - 78px) no-repeat,${OLA_ABAJO} bottom/100% 40px no-repeat}
.hl .hl-banda .eyebrow{color:rgba(255,255,255,.8)}
.hl .hl-banda .btn{background:#fff;color:${c.acento};border-color:#fff}
.hl .hl-banda h3{color:rgba(255,255,255,.75)}
.hl .hl-banda .regalo{background:none;border:none}
.hl .hl-banda .regalo svg,.hl .hl-banda .banco code{color:#fff}
.hl-corazon{position:relative;height:90px;margin:22px -26px 6px;color:#fff}
.hl-corazon .hc{left:0;top:-110px;width:100%;height:300px}
.hl-corazon .hc path{stroke:#fff}
.hl-corazon span{position:absolute;left:50%;top:18px;width:52px;transform:translateX(-50%)}
.hl-firma{font-size:13px;letter-spacing:.2em;text-transform:uppercase;line-height:1.8}

/* Ubicación en tarjeta de color */
.hl .hl-tarjeta .cont{background:${c.acento} ${ARRUGA};color:#fff;--acento:#fff;border-radius:6px;padding:40px 22px 34px;box-shadow:0 14px 30px -18px rgba(0,0,0,.5);--titulo:#fff;--suave:rgba(255,255,255,.85)}
.hl .hl-tarjeta .eyebrow{color:rgba(255,255,255,.8)}
.hl .hl-tarjeta .lugar{background:none;border:none;padding:0}
.hl .hl-tarjeta .lugar-icono{color:#fff}
.hl .hl-tarjeta .lugar h3{font-family:var(--f-titulo);font-size:30px;font-weight:400;text-transform:none;letter-spacing:0}
.hl .hl-tarjeta .lugar-hora,.hl .hl-tarjeta .lugar-nombre{color:#fff}
.hl .hl-tarjeta .btn{background:#fff;color:${c.acento};border-color:#fff}
.hl .lugares{gap:34px;margin-top:14px}
.hl .lugar-nombre{font-weight:500;letter-spacing:.04em}
.hl .lugar-dir{font-size:14px;margin-bottom:12px}

/* Fotos */
.hl-ancha .ancha{border-radius:0;box-shadow:none}
.hl-ancha .ancha img{aspect-ratio:4/3.6;filter:grayscale(1) contrast(1.05)}
.hl-cuenta .c1{max-width:300px;margin:0 auto 22px;border-radius:16px}
.hl-cuenta .c1 img{aspect-ratio:4/4.6}
.hl .reloj{margin:4px 0 20px;gap:6px}
.hl .reloj span{font-family:var(--f-texto);font-weight:300;font-size:clamp(34px,10vw,44px);color:var(--tinta)}
.hl .reloj small{font-size:10px;letter-spacing:.12em;color:var(--suave)}
.hl .reloj b{font-size:30px;font-weight:300;color:var(--tinta)}

/* Secciones del motor */
.hl .padres{gap:18px;margin-top:18px}
.hl .padres h3,.hl .padrinos h3{font-size:12px;letter-spacing:.2em}
.hl .padres p,.hl .padrinos p{font-size:15px}
.hl .figuras svg{color:var(--acento)}
.hl .regalos{gap:12px;margin-top:16px}
.hl .regalo{background:var(--tarjeta);border:1px solid var(--linea);border-radius:6px}
.hl .pase{border:1px solid var(--linea);border-radius:6px;background:var(--tarjeta)}
.hl .pase strong{font-family:var(--f-titulo);font-size:30px;color:var(--acento)}
.hl #form-rsvp input[type=text],.hl #form-rsvp select,.hl #form-rsvp textarea,.hl .form-whats input,.hl .form-whats textarea{border-radius:6px;background:#fffdfa;font-size:16px}
.hl #form-rsvp .opciones label{border-radius:6px}
.hl #form-rsvp .opciones input:checked+label{background:var(--acento);border-color:var(--acento);color:#fff}
.hl .hotel,.hl .lugar{border-radius:6px}
.hl .sec-compartir .hashtag{font-size:18px;letter-spacing:.06em;color:var(--acento)}
.hl .pie,.hl .hl-pie{background:none;color:var(--tinta);padding:20px 24px 120px}
.hl .pie>p:first-of-type{font-size:12px;letter-spacing:.26em;text-transform:uppercase;margin-top:14px}
.hl .pie .nombres{font-family:var(--f-titulo);font-size:42px;color:var(--acento);margin:6px 0 2px}
.hl .pie .nombres span{display:inline}.hl .pie .nombres .amp{margin:0 8px;font-size:.7em}
.hl .pie .pie-fecha{color:var(--suave)}
.hl-cierre-corazon{width:40px;margin:0 auto;color:var(--acento)}
body.plantilla-${id} .firma-tf{color:var(--tinta)}
@media (min-width:700px){
  body.plantilla-${id}{background:color-mix(in srgb,${c.acento} 16%,${c.papel}) fixed}
  .hl{max-width:500px;margin:0 auto;background:${c.papel} ${PAPEL};box-shadow:0 30px 70px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.04)}
  body.plantilla-${id} .firma-tf{max-width:500px;margin-left:auto;margin-right:auto}
}`;
  }

  VARIANTES.forEach(V => {
    window.Invitacion.registrar({
      id: V.id,
      eventos: ['boda'],
      nombre: V.nombre,
      descripcion: V.desc,
      colores: [V.c.papel, V.c.acento, V.c.tinta, V.c.papel2],
      efecto: null,
      adornos: [],
      fuentes: 'https://fonts.googleapis.com/css2?family=Marck+Script&family=Jost:wght@300;400;500&display=swap',
      // Fotos de muestra (Pixabay, uso libre) para las demos. ruta: '' desde la raíz del sitio, '../' desde demos/
      fotosEjemplo: (d, ruta) => {
        const m = (n) => `${ruta}fotos/muestra/${n}.jpg`;
        return { fotoPortada: m('byn'), historia: Object.assign({}, d.historia, { fotos: ['jardin', 'abrazo', 'auto', 'anillos'].map(n => ({ src: m(n), pie: '' })) }) };
      },
      render: (d, S) => render(V, d, S),
      css: css(V)
    });
  });
})();
