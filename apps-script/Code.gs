/**
 * RSVP receiver for Hana & Farhaan's engagement invitation.
 *
 * Paste this into Extensions → Apps Script of the RSVP Google Sheet, then deploy as a Web app
 * (Execute as: Me · Who has access: Anyone). See apps-script/SETUP.md for the full walkthrough.
 *
 * The website POSTs JSON as text/plain: { name, attendance, phone, wish, type, userAgent }.
 * Each valid reply is appended as one row on the "RSVP" tab.
 */

var SHEET_NAME = 'RSVP';
var HEADERS = ['Timestamp', 'Guest name', 'Attendance', 'Phone', 'Wish', 'Type'];
var ATTENDANCE = ['Yes', 'No', 'Later'];
var PHONE_RE = /^[0-9+()\-\s]{6,20}$/;

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    if (raw.length > 5000) return json_({ ok: false, error: 'Reply is too long.' });

    var data;
    try {
      data = JSON.parse(raw || '{}');
    } catch (parseError) {
      return json_({ ok: false, error: 'Could not read the reply.' });
    }

    var name = clean_(data.name, 100);
    if (!name) return json_({ ok: false, error: 'Please write your name.' });

    var attendance = String(data.attendance || '');
    if (ATTENDANCE.indexOf(attendance) === -1) {
      return json_({ ok: false, error: 'Please choose whether you can come.' });
    }

    var phone = String(data.phone || '').trim();
    if (phone && !PHONE_RE.test(phone)) return json_({ ok: false, error: 'Please check the phone number.' });

    var wish = clean_(data.wish, 500);
    var type = data.type === 'update' ? 'update' : 'new';

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      // A leading apostrophe keeps "+91…" as text instead of a formula or number.
      sheet_().appendRow([new Date(), name, attendance, phone ? "'" + phone : '', wish, type]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'The reply could not be saved. Please try again.' });
  }
}

/** Health check: open the Web app URL in a browser to confirm it's live. */
function doGet() {
  return json_({ ok: true, service: 'rsvp', sheet: SHEET_NAME });
}

/** Trims, removes control characters and strips leading = + - @ so text can't run as a formula. */
function clean_(value, max) {
  var s = String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .replace(/^[=+\-@\t\r]+/, '')
    .trim();
  return s.slice(0, max);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
