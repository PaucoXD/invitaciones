/*
 * Código para Google Sheets (Apps Script) que recibe las confirmaciones.
 * El editor lo muestra con el botón "Copiar código". Se instala UNA sola vez y sirve para todas las bodas
 * (cada boda se identifica con su "ID de boda").
 *
 * Hojas que crea solo:
 *   Confirmaciones → una fila por respuesta (confirmación, buenos deseos o canción)
 *   Invitados      → la lista que se sincroniza desde el editor (para saber quién falta)
 *   Bodas          → la clave del panel, nombres y fecha de cada boda
 *   Entradas       → quién llegó el día del evento (registro con el pase QR desde entrada.html)
 *   Pedidos        → los datos que mandan los clientes desde pedido.html (el archivo completo,
 *                    con fotos, se guarda en la carpeta "Pedidos de invitaciones" de tu Google Drive)
 * La clave de "Mis bodas" (tu panel de administrador) se guarda en las propiedades del script, no en la hoja.
 */
window.CODIGO_SHEETS = String.raw`// ===== Confirmaciones de invitaciones — pegar en Extensiones → Apps Script =====
// Después: Implementar → Nueva implementación → App web → Ejecutar como: Yo → Acceso: Cualquier persona.
// ¿Actualizando? Implementar → Administrar implementaciones → ✏️ → Versión: "Nueva versión" → Implementar (la URL no cambia).

var VERSION = 4;

var ENC_CONF = ['Fecha', 'Boda', 'Tipo', 'Invitado', 'Asiste', 'Personas', 'Mensaje', 'Lugares', 'Mesa'];
var ENC_INV = ['Boda', 'Invitado', 'Lugares', 'Mesa', 'Teléfono'];
var ENC_BODAS = ['Boda', 'Clave', 'Creada', 'Nombres', 'Fecha'];
var ENC_ENT = ['Fecha', 'Boda', 'Invitado', 'Personas', 'Registró'];
var ENC_PED = ['Recibido', 'Pedido', 'Cliente', 'WhatsApp', 'Evento', 'Nombres', 'Fecha del evento', 'Diseño', 'Paquete', 'Archivo', 'Estado'];
var CARPETA_PEDIDOS = 'Pedidos de invitaciones';

function hoja_(nombre, encabezados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombre);
  if (!h) { h = ss.insertSheet(nombre); h.appendRow(encabezados); h.setFrozenRows(1); h.getRange(1, 1, 1, encabezados.length).setFontWeight('bold'); }
  else if (h.getLastColumn() < encabezados.length) h.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight('bold'); // hoja de una versión anterior
  return h;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function texto_(x, max) {
  // Evita que un texto se interprete como fórmula en la hoja
  return String(x == null ? '' : x).slice(0, max || 500).replace(/^[=+\-@]/, "'$&");
}
function claveCorrecta_(boda, clave, registrar, info) {
  var h = hoja_('Bodas', ENC_BODAS), v = h.getDataRange().getValues();
  info = info || {};
  for (var i = 1; i < v.length; i++) if (String(v[i][0]) === boda) {
    var ok = String(v[i][1]) === String(clave);
    if (ok && registrar && (info.nombres || info.fecha)) h.getRange(i + 1, 4, 1, 2).setValues([[texto_(info.nombres, 120), texto_(info.fecha, 20)]]);
    return ok;
  }
  if (registrar && clave) { h.appendRow([boda, String(clave), new Date(), texto_(info.nombres, 120), texto_(info.fecha, 20)]); return true; }
  return false;
}
function norm_(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim(); }
/** Clave de "Mis bodas": la primera vez que entras se guarda la que elijas (mínimo 6 caracteres). */
function adminCorrecto_(clave) {
  var props = PropertiesService.getScriptProperties(), guardada = props.getProperty('CLAVE_ADMIN');
  if (!guardada) { if (String(clave || '').length < 6) return false; props.setProperty('CLAVE_ADMIN', String(clave)); return true; }
  return guardada === String(clave);
}
/** Resumen de todas las bodas para el panel del administrador. */
function resumen_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), bodas = {}, orden = [];
  function b(id) { if (!bodas[id]) { bodas[id] = { boda: id, clave: '', nombres: '', fecha: '', creada: '', invitaciones: 0, lugares: 0, respondidas: 0, confirmadas: 0, personas: 0, no: 0, pendientes: 0, deseos: 0, canciones: 0, ultima: '', _inv: {}, _rsvp: {} }; orden.push(id); } return bodas[id]; }
  var hb = ss.getSheetByName('Bodas');
  if (hb) hb.getDataRange().getValues().slice(1).forEach(function (r) { var x = b(String(r[0])); x.clave = String(r[1]); x.creada = r[2] instanceof Date ? r[2].toISOString() : String(r[2] || ''); x.nombres = String(r[3] || ''); x.fecha = r[4] instanceof Date ? Utilities.formatDate(r[4], 'GMT', 'yyyy-MM-dd') : String(r[4] || ''); });
  var hi = ss.getSheetByName('Invitados');
  if (hi) hi.getDataRange().getValues().slice(1).forEach(function (r) { var x = b(String(r[0])); x.invitaciones++; x.lugares += Number(r[2]) || 0; x._inv[norm_(r[1])] = true; });
  var hc = ss.getSheetByName('Confirmaciones');
  if (hc) hc.getDataRange().getValues().slice(1).forEach(function (r) {
    var x = b(String(r[1])), f = r[0] instanceof Date ? r[0].toISOString() : String(r[0]);
    if (f > x.ultima) x.ultima = f;
    if (r[2] === 'deseo') x.deseos++; else if (r[2] === 'cancion') x.canciones++; else x._rsvp[norm_(r[3])] = { asiste: r[4], personas: Number(r[5]) || 0 };
  });
  var he = ss.getSheetByName('Entradas');
  if (he) he.getDataRange().getValues().slice(1).forEach(function (r) { var x = b(String(r[1])); x._ent = x._ent || {}; x._ent[norm_(r[2])] = Number(r[3]) || 0; });
  return orden.map(function (id) {
    var x = bodas[id];
    Object.keys(x._rsvp).forEach(function (k) { var r = x._rsvp[k]; x.respondidas++; if (r.asiste === 'No') x.no++; else { x.confirmadas++; x.personas += r.personas; } });
    var enLista = Object.keys(x._rsvp).filter(function (k) { return x._inv[k]; }).length;
    x.pendientes = Math.max(0, x.invitaciones - enLista);
    x.llegaron = 0; Object.keys(x._ent || {}).forEach(function (k) { x.llegaron += x._ent[k]; });
    delete x._inv; delete x._rsvp; delete x._ent;
    return x;
  });
}
/** Pedido del formulario del cliente: el archivo con fotos va a Drive y una fila a la hoja "Pedidos". */
function guardarPedido_(texto) {
  if (texto.length > 40 * 1024 * 1024) return { ok: false, error: 'El pedido es demasiado grande. Manda menos fotos.' };
  var p = JSON.parse(texto);
  if (!p || p.tipo !== 'pedido-invitacion' || !p.datos) return { ok: false, error: 'Pedido no válido' };
  var c = p.cliente || {}, d = p.datos || {};
  if (!c.nombre || !c.tel) return { ok: false, error: 'Falta tu nombre o tu WhatsApp' };
  var id = Utilities.formatDate(new Date(), 'GMT', 'yyMMdd') + '-' + Utilities.getUuid().slice(0, 4);
  var it = DriveApp.getFoldersByName(CARPETA_PEDIDOS);
  var carpeta = it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA_PEDIDOS);
  var archivo = carpeta.createFile('pedido-' + id + '.json', texto, 'application/json');
  var nombres = d.evento === 'xv' ? 'XV años de ' + (d.festejada || '') : (d.novia || '') + ' & ' + (d.novio || '');
  hoja_('Pedidos', ENC_PED).appendRow([new Date(), id, texto_(c.nombre, 120), texto_(c.tel, 30), d.evento === 'xv' ? 'XV años' : 'Boda',
    texto_(nombres, 120), texto_(d.fecha, 20), texto_(d.plantilla, 40), texto_(c.paquete, 60), archivo.getId(), 'Nuevo']);
  return { ok: true, pedido: id };
}
function pedidos_() {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pedidos');
  if (!h) return [];
  return h.getDataRange().getValues().slice(1).map(function (r) {
    return { recibido: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), pedido: String(r[1]), cliente: String(r[2]), tel: String(r[3]), evento: String(r[4]),
      nombres: String(r[5]), fecha: r[6] instanceof Date ? Utilities.formatDate(r[6], 'GMT', 'yyyy-MM-dd') : String(r[6] || ''), plantilla: String(r[7]), paquete: String(r[8]), estado: String(r[10] || 'Nuevo') };
  }).reverse();
}
function leerPedido_(id) {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Pedidos');
  if (!h) return null;
  var v = h.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (String(v[i][1]) === String(id)) {
    if (String(v[i][10]) === 'Nuevo') h.getRange(i + 1, 11).setValue('Abierto');
    return JSON.parse(DriveApp.getFileById(String(v[i][9])).getBlob().getDataAsString());
  }
  return null;
}
function filas_(nombre, boda, colBoda) {
  var h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nombre);
  if (!h) return [];
  var v = h.getDataRange().getValues(), enc = v[0], out = [];
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][colBoda]) !== boda) continue;
    var o = {};
    for (var j = 0; j < enc.length; j++) o[enc[j]] = v[i][j] instanceof Date ? v[i][j].toISOString() : v[i][j];
    out.push(o);
  }
  return out;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (e.postData.contents.indexOf('"tipo":"pedido-invitacion"') >= 0 && e.postData.contents.indexOf('"tipo":"pedido-invitacion"') < 40) return json_(guardarPedido_(e.postData.contents));
    var d = JSON.parse(e.postData.contents);
    var boda = texto_(d.boda, 80);
    if (!boda) return json_({ ok: false, error: 'Falta el ID de la boda' });

    if (d.accion === 'entrada') {
      // Registro en la puerta: la última fila de cada invitado es la que vale (0 = se deshizo)
      if (!claveCorrecta_(boda, d.clave, false)) return json_({ ok: false, error: 'Clave incorrecta' });
      hoja_('Entradas', ENC_ENT).appendRow([new Date(), boda, texto_(d.nombre, 120), Math.max(0, Number(d.personas) || 0), texto_(d.quien, 60)]);
      return json_({ ok: true });
    }

    if (d.accion === 'invitados') {
      if (!claveCorrecta_(boda, d.clave, true, d.info)) return json_({ ok: false, error: 'Clave incorrecta' });
      var h = hoja_('Invitados', ENC_INV), v = h.getDataRange().getValues();
      for (var i = v.length - 1; i >= 1; i--) if (String(v[i][0]) === boda) h.deleteRow(i + 1);
      var lista = (d.invitados || []).slice(0, 2000), filas = [];
      for (var k = 0; k < lista.length; k++) {
        var x = lista[k];
        if (x && x.nombre) filas.push([boda, texto_(x.nombre, 120), Number(x.pases) || '', texto_(x.mesa, 40), texto_(x.tel, 30)]);
      }
      if (filas.length) h.getRange(h.getLastRow() + 1, 1, filas.length, ENC_INV.length).setValues(filas);
      return json_({ ok: true, invitados: filas.length });
    }

    var tipo = ['rsvp', 'deseo', 'cancion'].indexOf(d.tipo) >= 0 ? d.tipo : 'rsvp';
    hoja_('Confirmaciones', ENC_CONF).appendRow([
      new Date(), boda, tipo, texto_(d.nombre, 120),
      tipo === 'rsvp' ? (d.asiste === false ? 'No' : 'Sí') : '',
      tipo === 'rsvp' && d.asiste !== false ? (Number(d.personas) || 1) : '',
      texto_(d.mensaje, 1000), Number(d.pases) || '', texto_(d.mesa, 40)
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var p = e.parameter || {};
  if (p.accion === 'ping') return json_({ ok: true, mensaje: 'Conexión correcta', version: VERSION });
  if (p.accion === 'admin') {
    if (!adminCorrecto_(p.clave)) return json_({ ok: false, error: 'Clave de administrador incorrecta' });
    return json_({ ok: true, version: VERSION, bodas: resumen_(), pedidos: pedidos_() });
  }
  if (p.accion === 'pedido') {
    if (!adminCorrecto_(p.clave)) return json_({ ok: false, error: 'Clave de administrador incorrecta' });
    var ped = leerPedido_(p.id);
    return json_(ped ? { ok: true, pedido: ped } : { ok: false, error: 'No se encontró ese pedido' });
  }
  var boda = texto_(p.boda, 80);
  if (!boda || !claveCorrecta_(boda, p.clave, false)) return json_({ ok: false, error: 'ID de boda o clave incorrectos' });
  return json_({ ok: true, version: VERSION, confirmaciones: filas_('Confirmaciones', boda, 1), invitados: filas_('Invitados', boda, 0), entradas: filas_('Entradas', boda, 1) });
}
`;
