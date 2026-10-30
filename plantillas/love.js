/* Plantillas "Love": diseño tipográfico. "LOVE" gigante cruzado por una cinta de "it's Love" en letra manuscrita,
   fecha en números enormes, fotos tipo polaroid y horarios grandes rodeados por una línea curva. Una paleta por diseño. */
(function () {
  const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  const PAPEL = url(`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .38  0 0 0 0 .33  0 0 0 .12 0"/></filter><rect width="260" height="260" filter="url(#p)"/></svg>`);

  const VARIANTES = [
    { id: 'love-rojo', nombre: 'Love Rojo', desc: 'Tipográfica: LOVE gigante en rojo, fecha enorme y fotos polaroid.',
      c: { papel: '#faf6ee', papel2: '#f2ece0', acento: '#a10f17', tinta: '#2a2524', suave: '#5f5755', linea: '#e4d9cb' } },
    { id: 'love-negro', nombre: 'Love Negro', desc: 'Tipográfica en negro sobre crema: LOVE gigante, fecha enorme y polaroids.',
      c: { papel: '#f7f5f0', papel2: '#ece9e2', acento: '#1c1c1c', tinta: '#1c1c1c', suave: '#5a5855', linea: '#dcd8cf' } },
    { id: 'love-rosa', nombre: 'Love Rosa', desc: 'Tipográfica en rosa frambuesa: LOVE gigante, fecha enorme y polaroids.',
      c: { papel: '#fbf5f3', papel2: '#f5e9e6', acento: '#c2416b', tinta: '#2e2427', suave: '#665a5d', linea: '#ecd9d6' } }
  ];

  // Cinta de "it's Love" repetido (filas desfasadas)
  const cinta = (filas, clase) => `<div class="lv-cinta ${clase}" aria-hidden="true">${Array.from({ length: filas }, (_, i) =>
    `<p style="margin-left:${-(i % 2) * 46}px">${"its Love ".repeat(9)}</p>`).join('')}</div>`;

  function render(V, d, S) {
    const e = S.esc, f = S.fechaInfo(d), oc = d.ocultar;
    const gal = (d.historia.fotos || []).filter(x => x && x.src);
    const polaroid = (src, c) => src
      ? `<figure class="lv-pola ${c} rv" data-zoom="${e(src)}"><img src="${e(src)}" alt="" loading="lazy"></figure>`
      : `<figure class="lv-pola ${c} vacia rv"><span>${S.ICONOS.foto}</span></figure>`;
    const [yy, mm, dd] = String(d.fecha || '2027-01-01').split('-').map(Number);

    const portada = `<header class="lv-portada">
      <p class="lv-pareja rv">${e(d.novia)} &amp; ${e(d.novio)}</p>
      <div class="lv-love rv" aria-label="Love">
        <span class="l">L</span><span class="o">O</span><span class="v">V</span><span class="e">E</span>
        ${cinta(5, 'c1')}
      </div>
      <p class="lv-fecha-larga rv">${f.dia} de ${e(String(f.mes).toLowerCase())} ${f.anio}</p>
    </header>`;

    const frase = S.hay(d.frase) && !oc.frase ? `<blockquote class="lv-frase rv">${S.br(d.frase)}${S.hay(d.fraseAutor) ? `<cite>${e(d.fraseAutor)}</cite>` : ''}</blockquote>` : '';

    const fechaGrande = `<section id="cuenta" class="sec lv-fecha">
      <div class="lv-num rv" aria-label="${e(f.corta)}"><span>${String(dd).padStart(2, '0')}</span><span>${String(mm).padStart(2, '0')}</span><span>${String(yy).slice(-2)}</span></div>
      ${oc.cuenta ? '' : `<p class="eyebrow rv">Faltan</p>${S.reloj()}<a class="btn rv" target="_blank" rel="noopener" href="${e(S.enlaceCalendario(d))}">${S.ICONOS.calendario}Agendar en calendario</a>`}
    </section>`;

    const fotos = `<section class="sec lv-fotos">
      ${cinta(12, 'c2')}
      ${polaroid(d.fotoPortada, 'p1')}${polaroid(gal[0] && gal[0].src, 'p2')}
    </section>`;

    // Itinerario: horas grandes que se alternan, con una línea curva que las rodea
    const it = (d.itinerario || []).filter(x => S.hay(x.evento));
    let itin = '';
    if (it.length && !oc.itinerario) {
      // Cada horario queda dentro de un arco que se abre hacia el lado contrario del texto
      let p = 'M-4 4C30 0 44 6 50 10';
      it.forEach((_, i) => { const y = i * 100 + 10, x = i % 2 ? -14 : 114; p += ` C${x} ${y + 4} ${x} ${y + 96} 50 ${y + 100}`; });
      p += ` C${it.length % 2 ? 60 : 40} ${it.length * 100 + 14} ${it.length % 2 ? 90 : 10} ${it.length * 100 + 12} ${it.length % 2 ? 104 : -4} ${it.length * 100 + 16}`;
      itin = `<section id="itinerario" class="sec lv-itin">
        <p class="eyebrow rv">Itinerario</p><h2 class="titulo rv">del día</h2>
        <div class="lv-horas">
          <svg class="lv-linea" viewBox="0 0 100 ${it.length * 100 + 20}" preserveAspectRatio="none" aria-hidden="true"><path d="${p}" vector-effect="non-scaling-stroke"/></svg>
          ${it.map((x, i) => `<div class="lv-ev ${i % 2 ? 'der' : 'izq'} rv"><p class="lv-hora">${e(x.hora)}</p><h3>${e(x.evento)}</h3>${S.hay(x.detalle) ? `<p>${e(x.detalle)}</p>` : ''}</div>`).join('')}
        </div>
      </section>`;
    }
    const historia = S.historia(Object.assign({}, d, { historia: Object.assign({}, d.historia, { fotos: gal.slice(1) }) }), {});

    return `
${S.sobre(d)}
<main class="lv">
  ${portada}
  ${frase ? `<section class="sec lv-sfrase">${frase}</section>` : ''}
  ${S.familia(d)}
  ${fechaGrande}
  ${fotos}
  ${itin}
  ${S.ubicacion(d)}
  ${S.vestimenta(d)}
  ${historia}
  ${S.regalos(d)}
  ${S.rsvp(d)}
  ${S.extras(d)}
  ${S.cierre(d, { clase: 'lv-pie', antes: '<p class="lv-mini" aria-hidden="true">LO<br>VE</p>' })}
</main>`;
  }

  function css(V) {
    const c = V.c, id = V.id;
    return `
body.plantilla-${id}{--fondo:${c.papel};--fondo2:${c.papel2};--tinta:${c.tinta};--suave:${c.suave};--acento:${c.acento};--acento2:${c.acento};--linea:${c.linea};--titulo:${c.acento};
  --oscuro:${c.acento};--sobre-oscuro:#fff;--tarjeta:#fffdf9;
  --f-titulo:'Bodoni Moda',Didot,serif;--f-texto:'Old Standard TT',Georgia,serif;--f-etiqueta:'Old Standard TT',Georgia,serif;--f-script:'Mrs Saint Delafield',cursive;
  --fondo-sobre:${c.papel};--sobre-c1:${c.papel2};--sobre-c2:#e6dfd2;--sobre-c3:#efe9de;
  --sello:radial-gradient(circle at 35% 30%,color-mix(in srgb,${c.acento} 70%,#fff),${c.acento} 60%,color-mix(in srgb,${c.acento} 70%,#000));--sello-texto:#fff;--sello-borde:${c.acento};
  font-size:16px;background:${c.papel} ${PAPEL};line-height:1.6}
.lv{overflow:hidden}
.lv .sec{padding:60px 26px;text-align:center;position:relative}
.lv .cont{max-width:520px}
/* Títulos en dos letras: palabra en serif mayúscula y debajo otra en manuscrita */
.lv .eyebrow{font-family:var(--f-titulo);font-weight:400;font-size:clamp(26px,7.6vw,36px);letter-spacing:.02em;text-transform:uppercase;color:var(--tinta);line-height:1;margin:0}
.lv .titulo{font-family:var(--f-script);font-weight:400;font-size:clamp(34px,10vw,46px);color:var(--acento);line-height:1.1;margin:-.02em 0 18px;padding-left:20%;text-transform:lowercase}
.lv .titulo:first-child{padding-left:0;font-size:clamp(40px,12vw,54px);margin-top:0}
.lv .lead{font-size:15px;font-style:normal;color:var(--suave)}
.lv .btn{display:inline-flex;align-items:center;gap:8px;font-family:var(--f-texto);font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding:10px 20px;border-radius:0;border:1px solid var(--acento);background:transparent;color:var(--acento);box-shadow:none}
.lv .btn.solido,.lv .btn:hover{background:var(--acento);color:#fff}
.lv .btn svg{width:14px;height:14px}
.lv .rv{transform:translateY(16px)}.lv .rv.vis{transform:none}

.lv .sec-familia .eyebrow{font-size:clamp(22px,6.2vw,28px)}
/* Portada */
.lv-portada{padding:62px 16px 40px;text-align:center}
.lv-pareja{font-family:var(--f-titulo);font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:var(--tinta)}
.lv-love{position:relative;width:300px;height:430px;margin:26px auto 22px;font-family:var(--f-titulo);font-weight:400;color:var(--acento);line-height:.8}
.lv-love span{position:absolute;font-size:200px;z-index:2}
.lv-love .l{left:22px;top:0}
.lv-love .o{left:118px;top:96px;font-size:184px}
.lv-love .v{left:58px;top:212px;font-size:170px}
.lv-love .e{left:150px;top:276px;font-size:178px}
.lv-cinta{position:absolute;pointer-events:none;color:var(--acento);font-family:var(--f-script);white-space:nowrap;overflow:hidden}
.lv-cinta p{font-size:24px;line-height:1.25}
.lv-cinta.c1{left:-130px;right:-130px;top:170px;transform:rotate(-14deg);z-index:3;text-shadow:0 0 3px var(--fondo),0 0 6px var(--fondo)}
.lv-fecha-larga{font-family:var(--f-titulo);font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:var(--tinta)}

/* Frase */
.lv-sfrase{padding-top:20px!important;padding-bottom:10px!important}
.lv-frase{font-size:16px;color:var(--suave);max-width:330px;margin:0 auto}
.lv-frase cite{display:block;font-style:normal;font-family:var(--f-script);font-size:30px;color:var(--acento);margin-top:6px}

/* Fecha enorme */
.lv-num{position:relative;height:380px;max-width:320px;margin:0 auto 30px;font-family:var(--f-titulo);font-weight:400;color:var(--acento);line-height:.8}
.lv-num span{position:absolute;font-size:150px;letter-spacing:-.04em}
.lv-num span:nth-child(1){left:0;top:0}
.lv-num span:nth-child(2){left:150px;top:112px}
.lv-num span:nth-child(3){left:30px;top:236px}
.lv .lv-fecha .eyebrow{font-size:14px;letter-spacing:.3em;font-family:var(--f-texto);color:var(--suave)}
.lv .reloj{margin:6px 0 20px;gap:6px}
.lv .reloj span{font-family:var(--f-titulo);font-weight:400;font-size:clamp(36px,11vw,48px);color:var(--tinta)}
.lv .reloj small{font-size:10px;letter-spacing:.14em;color:var(--suave)}
.lv .reloj b{font-size:30px;font-weight:400;color:var(--acento)}

/* Polaroids */
.lv-fotos{height:560px;padding:0!important}
.lv-cinta.c2{left:-80px;right:-80px;top:120px;transform:rotate(-12deg);opacity:.9}
.lv-pola{position:absolute;margin:0;background:#fbfaf7;padding:12px 12px 46px;box-shadow:0 14px 30px -14px rgba(0,0,0,.45);cursor:zoom-in;width:62%;max-width:290px;z-index:1}
.lv-pola img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;filter:grayscale(1) contrast(1.06)}
.lv-pola.p1{left:8%;top:20px;rotate:-5deg}
.lv-pola.p2{right:6%;top:250px;rotate:6deg}
.lv-pola.vacia span{display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;background:var(--fondo2);color:var(--suave)}
.lv-pola.vacia svg{width:34px;height:34px}

/* Itinerario */
.lv-horas{position:relative;margin:10px auto 0;max-width:420px}
.lv-linea{position:absolute;left:-26px;top:0;width:calc(100% + 52px);height:100%;overflow:visible;pointer-events:none}
.lv-linea path{fill:none;stroke:var(--acento);stroke-width:1.3}
.lv-ev{position:relative;width:72%;padding:26px 0;text-align:left}
.lv-ev.der{margin-left:auto;text-align:right;padding-right:6%}
.lv-ev.izq{padding-left:6%}
.lv-hora{font-family:var(--f-titulo);font-size:56px;line-height:1;letter-spacing:-.03em;color:var(--acento)}
.lv-ev h3{font-family:var(--f-texto);font-weight:700;font-size:15px;letter-spacing:.04em;margin:8px 0 2px;color:var(--tinta)}
.lv-ev p:not(.lv-hora){font-size:14px;color:var(--suave);line-height:1.5}

/* Secciones del motor */
.lv .padres{gap:18px;margin-top:18px}
.lv .padres h3,.lv .padrinos h3{font-family:var(--f-texto);font-size:12px;letter-spacing:.2em;color:var(--acento)}
.lv .padres p,.lv .padrinos p{font-size:16px}
.lv .lugares{gap:36px;margin-top:10px}
.lv .lugar{background:none;border:none;border-top:1px solid var(--linea);padding:26px 0 0;border-radius:0}
.lv .lugar-icono{color:var(--acento)}
.lv .lugar h3{font-family:var(--f-script);font-weight:400;font-size:40px;color:var(--acento);text-transform:none;letter-spacing:0}
.lv .lugar-hora{font-family:var(--f-titulo);font-size:22px;color:var(--tinta)}
.lv .lugar-nombre{font-family:var(--f-titulo);font-size:18px;text-transform:uppercase;letter-spacing:.04em}
.lv .lugar-dir{font-size:14px;margin-bottom:14px}
.lv .figuras svg{color:var(--acento)}
.lv .regalos{gap:12px;margin-top:16px}
.lv .regalo{background:none;border:1px solid var(--linea);border-radius:0}
.lv .regalo svg{color:var(--acento)}
.lv .pase{border:1px solid var(--acento);border-radius:0;background:transparent}
.lv .pase strong{font-family:var(--f-script);font-size:38px;color:var(--acento)}
.lv #form-rsvp input[type=text],.lv #form-rsvp select,.lv #form-rsvp textarea,.lv .form-whats input,.lv .form-whats textarea{border-radius:0;background:#fffdf9;font-size:16px}
.lv #form-rsvp .opciones label{border-radius:0}
.lv #form-rsvp .opciones input:checked+label{background:var(--acento);border-color:var(--acento);color:#fff}
.lv .hotel{border-radius:0}
.lv .sec-compartir .hashtag{font-family:var(--f-titulo);font-size:20px;color:var(--acento)}
.lv .pie,.lv .lv-pie{background:none;color:var(--tinta);padding:20px 24px 120px}
.lv .pie .lv-mini{font-family:var(--f-titulo);font-size:84px;line-height:.78;color:var(--acento);letter-spacing:-.02em;margin-bottom:18px}
.lv .pie p.nombres{font-style:normal;font-family:var(--f-titulo);font-size:26px;text-transform:uppercase;letter-spacing:.06em;color:var(--tinta);margin:8px 0 2px}
.lv .pie .nombres span{display:inline}.lv .pie .nombres .amp{margin:0 8px;font-size:.8em}
.lv .pie .pie-fecha{color:var(--suave)}
body.plantilla-${id} .firma-tf{color:var(--tinta)}
@media (max-width:360px){.lv-love{transform:scale(.88);transform-origin:top center;margin-bottom:-30px}.lv-num{transform:scale(.9);transform-origin:top center}}
@media (min-width:700px){
  body.plantilla-${id}{background:color-mix(in srgb,${c.acento} 12%,${c.papel}) fixed}
  .lv{max-width:500px;margin:0 auto;background:${c.papel} ${PAPEL};box-shadow:0 30px 70px -20px rgba(0,0,0,.3),0 0 0 1px rgba(0,0,0,.04)}
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
      fuentes: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Mrs+Saint+Delafield&display=swap',
      // Fotos de muestra (Pixabay, uso libre) para las demos. ruta: '' desde la raíz del sitio, '../' desde demos/
      fotosEjemplo: (d, ruta) => {
        const m = (n) => `${ruta}fotos/muestra/${n}.jpg`;
        return { fotoPortada: m('byn'), historia: Object.assign({}, d.historia, { fotos: ['abrazo', 'jardin', 'anillos', 'auto'].map(n => ({ src: m(n), pie: '' })) }) };
      },
      render: (d, S) => render(V, d, S),
      css: css(V)
    });
  });
})();
