/*
 * Código para Google Sheets (Apps Script) que recibe las confirmaciones.
 * El editor lo muestra con el botón "Copiar código". Se instala UNA sola vez y sirve para todas las bodas
 * (cada boda se identifica con su "ID de boda").
 *
 * Hojas que crea solo:
 *   Confirmaciones → una fila por respuesta (confirmación, buenos deseos o canción)
 *   Invitados      → la lista que se sincroniza desde el editor (para saber quién falta)
 *   Bodas          → la clave del panel de cada boda
 */
window.CODIGO_SHEETS = String.raw`// ===== Confirmaciones de invitaciones — pegar en Extensiones → Apps Script =====
// Después: Implementar → Nueva implementación → App web → Ejecutar como: Yo → Acceso: Cualquier persona.

var ENC_CONF = ['Fecha', 'Boda', 'Tipo', 'Invitado', 'Asiste', 'Personas', 'Mensaje', 'Lugares', 'Mesa'];
var ENC_INV = ['Boda', 'Invitado', 'Lugares', 'Mesa', 'Teléfono'];
var ENC_BODAS = ['Boda', 'Clave', 'Creada'];

function hoja_(nombre, encabezados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombre);
  if (!h) { h = ss.insertSheet(nombre); h.appendRow(encabezados); h.setFrozenRows(1); h.getRange(1, 1, 1, encabezados.length).setFontWeight('bold'); }
  return h;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function texto_(x, max) {
  // Evita que un texto se interprete como fórmula en la hoja
  return String(x == null ? '' : x).slice(0, max || 500).replace(/^[=+\-@]/, "'$&");
}
function claveCorrecta_(boda, clave, registrar) {
  var h = hoja_('Bodas', ENC_BODAS), v = h.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (String(v[i][0]) === boda) return String(v[i][1]) === String(clave);
  if (registrar && clave) { h.appendRow([boda, String(clave), new Date()]); return true; }
  return false;
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
    var d = JSON.parse(e.postData.contents);
    var boda = texto_(d.boda, 80);
    if (!boda) return json_({ ok: false, error: 'Falta el ID de la boda' });

    if (d.accion === 'invitados') {
      if (!claveCorrecta_(boda, d.clave, true)) return json_({ ok: false, error: 'Clave incorrecta' });
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
  if (p.accion === 'ping') return json_({ ok: true, mensaje: 'Conexión correcta' });
  var boda = texto_(p.boda, 80);
  if (!boda || !claveCorrecta_(boda, p.clave, false)) return json_({ ok: false, error: 'ID de boda o clave incorrectos' });
  return json_({ ok: true, confirmaciones: filas_('Confirmaciones', boda, 1), invitados: filas_('Invitados', boda, 0) });
}
`;
