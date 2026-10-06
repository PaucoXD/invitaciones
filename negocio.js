/*
 * ===================== DATOS DE TU NEGOCIO =====================
 * Cambia aquí tu nombre, WhatsApp, redes, precios y paquetes.
 * La página de ventas (index.html) y el aviso de privacidad se actualizan solos.
 * Los precios son EJEMPLOS: ajústalos a tu mercado.
 */
window.NEGOCIO = {
  marca: 'Tu Fecha',                          // nombre de tu negocio
  lema: 'Invitaciones digitales para tu gran día',
  whatsapp: '528123412206',                             // con código de país, sin espacios: 5215512345678
  correo: '',                                 // opcional: hola@tumarca.com
  instagram: '',                              // opcional: usuario sin @
  tiktok: '',                                 // opcional: usuario sin @
  ciudad: 'México',
  moneda: 'MXN',
  entrega: '48 horas',                        // tiempo de entrega promedio
  anticipo: '50%',                            // anticipo para apartar

  // Promoción (aparece arriba de la página y en los precios). Para quitarla: activa: false
  promo: {
    activa: true,
    descuento: 15,                            // % de descuento en los paquetes
    texto: 'Lanzamiento: 15% de descuento a nuestros primeros 10 clientes',
    nota: 'A cambio de tu opinión en Google cuando recibas tu invitación.'
  },

  // Pago del anticipo: aparece al cliente cuando envía el formulario (y en el "Enlace de pago" de Mis bodas).
  // Deja vacío lo que no uses. El enlace de Mercado Pago se crea en tu cuenta: Cobrar → Link de pago.
  // Si quieres un link distinto por paquete, agrega linkPago: 'https://mpago.la/…' a cada paquete de abajo.
  pago: {
    mercadoPago: '',                          // link de pago general (opcional)
    banco: 'Mercado Pago W',                          // ej. BBVA
    clabe: '722969010533654785',                          // 18 dígitos
    titular: 'Paulo Carlo Castañeda Cortez',                          // nombre de quien recibe
    nota: 'Escribe tu folio en el concepto de la transferencia.'
  },

  // Dirección pública de tu sitio (termina en /). Cuando tengas dominio propio cámbiala, por ejemplo:
  // sitio: 'https://tudominio.com/',   (manual, sección 4.5)
  sitio: 'https://paucoxd.github.io/invitaciones/',
  // Almacén de fotos (opcional, recomendado): las fotos de los pedidos y de las invitaciones se suben a un
  // servidor de fotos y los pedidos abren al instante. Usa Cloudinary (recomendado) o Supabase. Manual, sección 2.4.
  fotos: { cloudinaryCloud: 'zmmwt2zw', cloudinaryPreset: 'yp8lispy', supabaseUrl: '', supabaseKey: '', bucket: 'fotos' },

  // Analítica (opcional): cuántas personas visitan tu página (manual, sección 7).
  //   goatcounter: tu código de goatcounter.com (gratis, sin cookies, no necesita aviso)
  //   ga4: tu ID de Google Analytics, ej. 'G-AB12CD34' (usa cookies: aparece un aviso para aceptar)
  analitica: { goatcounter: '', ga4: '' },
  // Repositorio donde el botón "🌐 Publicar" del editor sube las invitaciones (carpeta i/)
  github: { usuario: 'PaucoXD', repo: 'invitaciones', rama: 'main', carpeta: 'i' },

  // Dirección de tu app de Google para confirmaciones (termina en /exec). Se pone UNA vez y sirve para todas las bodas:
  // así los novios entran a su panel solo con su código y clave.
  hojaConfirmaciones: 'https://script.google.com/macros/s/AKfycbzBNchkRqstwXF31RO4tGv38apvbSu14B8-AepNKcMX9DRieMhzax7MEiRrR8DS_DQFXA/exec',

  paquetes: [
    {
      nombre: 'Esencial', precio: 590, nota: 'Ideal para bodas sencillas',
      incluye: ['1 diseño a elegir', 'Sobre animado y música', 'Cuenta regresiva y calendario', 'Ubicaciones con mapa', 'Itinerario, vestimenta y mesa de regalos', 'Confirmación por WhatsApp', '2 rondas de cambios']
    },
    {
      nombre: 'Personalizada', precio: 1290, destacado: true, nota: 'La más elegida',
      incluye: ['Todo lo del paquete Esencial', 'Enlace con el nombre de cada familia', 'Lugares reservados por invitación', 'Fotos de la pareja y galería', 'Invitación en PDF para imprimir o enviar', 'Código QR', 'Hospedaje, buenos deseos y canciones', 'Cambios ilimitados hasta la boda']
    },
    {
      nombre: 'Premium', precio: 2490, nota: 'Para no preocuparte de nada',
      incluye: ['Todo lo del paquete Personalizada', 'Confirmaciones automáticas', 'Panel de los novios con quién confirmó y quién falta', 'Recordatorios por WhatsApp', 'Plano de mesas y mesa de cada invitado', 'Lista por mesa para el salón', 'Un PDF personalizado por familia', 'Pase de entrada con QR y registro en la puerta']
    }
  ],

  extras: [
    { nombre: 'Plano de mesas', precio: 350 },
    { nombre: 'Confirmaciones automáticas con panel', precio: 450 },
    { nombre: 'PDF personalizado por familia', precio: 250 },
    { nombre: 'Pase de entrada con QR y registro en la puerta', precio: 400 },
    { nombre: 'Libro de recuerdos en PDF (buenos deseos, canciones y asistentes)', precio: 350 },
    { nombre: 'Aparta la fecha (página + imagen para estados)', precio: 250 },
    { nombre: 'Video para estados (15 segundos con música)', precio: 250 },
    { nombre: 'Entrega exprés en 24 horas', precio: 200 },
    { nombre: 'Diseño con tus colores', precio: 300 }
  ],

  // Opiniones de tus clientes. La sección solo aparece cuando hay al menos una.
  // Usa opiniones REALES (con permiso del cliente). Ejemplo:
  //   { nombre: 'Ana y Luis', evento: 'Boda · marzo 2027', texto: 'Nuestros invitados no dejaban de hablar del sobre.', foto: '' },
  testimonios: [
  ],

  // Preguntas frecuentes (puedes agregar o quitar)
  preguntas: [
    ['¿Mis invitados necesitan descargar una app?', 'No. Es un enlace que se abre en cualquier celular o computadora, como una página web. Se envía por WhatsApp, Messenger o correo.'],
    ['¿Cuánto tarda?', 'Te enviamos la primera versión en {entrega} después de recibir tus datos y fotos. Puedes pedir cambios antes de enviarla.'],
    ['¿Puedo cambiar algo después de enviarla?', 'Sí. Como es digital, los cambios (hora, lugar, texto) se ven al instante en el mismo enlace, sin volver a mandarla.'],
    ['¿Cómo confirman mis invitados?', 'Desde la invitación, con un botón. En el paquete Premium las confirmaciones llegan solas a tu panel, donde ves quién va, cuántas personas y quién falta.'],
    ['¿Y los invitados que no usan internet?', 'Incluimos una versión en PDF para imprimir o mandar por WhatsApp, con su nombre y un código QR.'],
    ['¿Cómo pago?', 'Con un anticipo del {anticipo} por transferencia o depósito para apartar, y el resto al entregarte tu invitación.'],
    ['¿También hacen XV años?', 'Sí. Tenemos diseños especiales para XV años (Princesa Rosa, Mariposas Lila y Noche de Gala) con las mismas funciones: sobre animado, nombre de cada familia, confirmaciones, mesas y PDF.'],
    ['¿Hacen bautizos, primera comunión, baby shower o cumpleaños?', 'Sí. Tenemos diseños para cada evento con su propio estilo: Paloma y Cáliz para bautizo y primera comunión, Globos y Cielo Tierno para baby shower, Confeti para cumpleaños con las mismas funciones: sobre, nombre de cada familia, confirmaciones y PDF.']
  ]
};

/** Precio con la promoción (redondeado a decenas). Sin promoción activa, el mismo precio. */
window.NEGOCIO.conPromo = function (n) {
  const p = this.promo || {};
  return p.activa && p.descuento ? Math.round(n * (1 - p.descuento / 100) / 10) * 10 : n;
};
