// Datos de ejemplo de los demás tipos de evento (ficticios). La boda está en ejemplo.js y los XV en ejemplo-xv.js.
(function () {
  const lugar = (tipo, hora, nombre, direccion, icono) => ({ tipo, hora, nombre, direccion, mapa: '', icono });
  const it = (l) => l.map(([hora, evento, icono, detalle]) => ({ hora, evento, detalle: detalle || '', icono }));
  const base = {
    zonaHoraria: '-06:00', iniciales: '', fotoPortada: '', fraseAutor: '', padresNovio: '', hospedaje: [], musica: 'melodia', adornos: {}, ocultar: {},
    mesas: { activo: false, texto: '', lista: [], elementos: [] },
    invitados: [{ nombre: 'Familia López', pases: 4, mesa: '' }, { nombre: 'Tía Carmen', pases: 1, mesa: '' }, { nombre: 'Familia Ortiz', pases: 3, mesa: '' }]
  };
  window.EJEMPLOS = {
    bautizo: Object.assign({}, base, {
      evento: 'bautizo', plantilla: 'paloma', festejada: 'Mateo', fecha: '2027-04-17', hora: '12:00', ciudad: 'Querétaro, Querétaro',
      introPortada: 'Mi bautizo', frase: 'Antes de formarte en el vientre, ya te conocía.', fraseAutor: 'Jeremías 1:5',
      tituloFamilia: 'Con la bendición de Dios y el amor de mis papás', textoFamilia: 'te invito a celebrar mi bautizo',
      padresNovia: 'Daniel Torres Medina\nPaola Salinas de Torres',
      padrinos: [{ rol: 'Padrinos', nombres: 'Jorge & Mariana Salinas' }],
      itinerario: it([['12:00', 'Misa de bautizo', 'iglesia', 'Parroquia de Santiago'], ['14:00', 'Recepción', 'copa', 'Jardín Las Palmas'], ['15:00', 'Comida', 'cena'], ['17:00', 'Pastel', 'pastel']]),
      lugares: [lugar('Misa', '12:00', 'Parroquia de Santiago Apóstol', 'Av. Madero 12, Centro\nQuerétaro, Qro.', 'iglesia'), lugar('Recepción', '14:00', 'Jardín Las Palmas', 'Camino a Juriquilla km 3\nQuerétaro, Qro.', 'hacienda')],
      vestimenta: { tipo: 'Casual elegante', texto: 'Colores claros y pastel.', colores: ['#a9cbe6', '#f3c3cf', '#f6efe2'], nota: '' },
      historia: { titulo: 'Mis primeros momentos', texto: 'Llegué para llenar de alegría a mi familia.', fotos: [{ src: '', pie: 'Mi llegada' }, { src: '', pie: 'Con mis papás' }] },
      regalos: { titulo: 'Tu presencia es mi mejor regalo', texto: 'pero si deseas obsequiarme algo, aquí algunas opciones', opciones: [{ nombre: 'Liverpool', detalle: 'Evento #51234567', enlace: '', icono: 'regalo' }, { nombre: 'Lluvia de sobres', detalle: 'El día del evento', enlace: '', icono: 'sobre' }], banco: '', titular: '', clabe: '' },
      rsvp: { whatsapp: '5214421234567', fechaLimite: '2027-04-01', pases: 2, texto: '' },
      contactos: { novia: '5214421234567', novio: '' }, hashtag: '#BautizoDeMateo', nota: '', despedida: 'Gracias por acompañarme en este día tan especial'
    }),
    comunion: Object.assign({}, base, {
      evento: 'comunion', plantilla: 'caliz', festejada: 'Regina', fecha: '2027-05-22', hora: '11:00', ciudad: 'Puebla, Puebla',
      introPortada: 'Mi primera comunión', frase: 'Dejen que los niños vengan a mí.', fraseAutor: 'Mateo 19:14',
      tituloFamilia: 'Con la bendición de Dios y de mis papás', textoFamilia: 'te invito a celebrar mi primera comunión',
      padresNovia: 'Luis Herrera Campos\nAna Gómez de Herrera',
      padrinos: [{ rol: 'Padrinos', nombres: 'Ricardo & Lucía Gómez' }],
      itinerario: it([['11:00', 'Misa de primera comunión', 'iglesia'], ['13:30', 'Recepción', 'copa'], ['14:30', 'Comida', 'cena'], ['16:30', 'Pastel', 'pastel']]),
      lugares: [lugar('Misa', '11:00', 'Templo de San Francisco', 'Blvd. 5 de Mayo 1201\nPuebla, Pue.', 'iglesia'), lugar('Recepción', '13:30', 'Salón Jardín Azul', 'Calle 21 Sur 3302\nPuebla, Pue.', 'hacienda')],
      vestimenta: { tipo: 'Formal', texto: '', colores: [], nota: 'El color blanco está reservado para Regina.' },
      historia: { titulo: 'Mis momentos', texto: '', fotos: [] },
      regalos: { titulo: 'Tu presencia es mi mejor regalo', texto: 'pero si deseas obsequiarme algo, aquí algunas opciones', opciones: [{ nombre: 'Lluvia de sobres', detalle: 'El día del evento', enlace: '', icono: 'sobre' }], banco: '', titular: '', clabe: '' },
      rsvp: { whatsapp: '5212221234567', fechaLimite: '2027-05-08', pases: 2, texto: '' },
      contactos: { novia: '5212221234567', novio: '' }, hashtag: '', nota: '', despedida: 'Gracias por acompañarme en este día tan especial'
    }),
    babyshower: Object.assign({}, base, {
      evento: 'babyshower', plantilla: 'globos', festejada: 'Emilia', fecha: '2027-02-13', hora: '16:00', ciudad: 'Monterrey, Nuevo León',
      introPortada: 'Baby shower', frase: 'Un pedacito de cielo está por llegar.',
      tituloFamilia: 'Con mucha ilusión', textoFamilia: 'te invitamos a celebrar la próxima llegada de nuestro bebé',
      padresNovia: 'Carla Rivera\nAlejandro Núñez', padrinos: [],
      itinerario: it([['16:00', 'Bienvenida', 'copa'], ['17:00', 'Juegos', 'corazon'], ['18:00', 'Abrir regalos', 'regalo'], ['18:30', 'Pastel', 'pastel']]),
      lugares: [lugar('Lugar', '16:00', 'Casa de la familia Núñez', 'Río Danubio 230, Del Valle\nSan Pedro Garza García, N.L.', 'hacienda')],
      vestimenta: { tipo: '', texto: '', colores: [], nota: '' },
      historia: { titulo: 'Esperándote', texto: '', fotos: [] },
      regalos: { titulo: 'Tu presencia es nuestro mejor regalo', texto: 'pero si deseas obsequiarnos algo, aquí algunas opciones', opciones: [{ nombre: 'Amazon', detalle: 'Lista “Bebé Emilia”', enlace: '', icono: 'bolsa' }, { nombre: 'Pañales', detalle: 'Etapa 1 y 2', enlace: '', icono: 'regalo' }], banco: '', titular: '', clabe: '' },
      rsvp: { whatsapp: '5218112345678', fechaLimite: '2027-02-06', pases: 1, texto: '' },
      contactos: { novia: '5218112345678', novio: '' }, hashtag: '#BabyEmilia', nota: '', despedida: 'Gracias por celebrar con nosotros la llegada de nuestro bebé'
    }),
    cumple: Object.assign({}, base, {
      evento: 'cumple', plantilla: 'confeti', festejada: 'Andrea', fecha: '2027-08-28', hora: '20:00', ciudad: 'Ciudad de México',
      introPortada: 'Mis 30', frase: 'Los mejores años están por venir.',
      tituloFamilia: '¡Vamos a celebrar!', textoFamilia: 'te invito a festejar conmigo un año más de vida',
      padresNovia: '', padrinos: [],
      itinerario: it([['20:00', 'Recepción', 'copa'], ['21:00', 'Cena', 'cena'], ['22:00', 'Pastel', 'pastel'], ['22:30', '¡A bailar!', 'musica']]),
      lugares: [lugar('Fiesta', '20:00', 'Terraza Roma', 'Colima 160, Roma Norte\nCiudad de México', 'copa')],
      vestimenta: { tipo: 'Cóctel', texto: 'Toque dorado bienvenido.', colores: ['#d4af6a', '#111111'], nota: '' },
      historia: { titulo: 'Mis momentos', texto: '', fotos: [] },
      regalos: { titulo: 'Tu presencia es mi mejor regalo', texto: '', opciones: [], banco: '', titular: '', clabe: '' },
      rsvp: { whatsapp: '5215512345678', fechaLimite: '2027-08-20', pases: 2, texto: '' },
      contactos: { novia: '5215512345678', novio: '' }, hashtag: '#Andrea30', nota: 'Evento solo para adultos', despedida: 'Gracias por celebrar conmigo'
    })
  };
  /** Ejemplo para cualquier tipo de evento */
  window.ejemploDe = (ev) => ev === 'xv' ? window.INVITACION_XV : ev && ev !== 'boda' ? window.EJEMPLOS[ev] : window.INVITACION;
})();
