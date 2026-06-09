// ============================================================
//  [test-Library 프로젝트에 붙여넣기]
//  배포: 배포 > 새 배포 > 유형: 라이브러리
// ============================================================

/**
 * 범용 디스패처 — action과 params를 받아 해당 함수를 실행합니다.
 * test-Test는 이 함수만 호출하며 내부 함수 목록을 알 필요가 없습니다.
 * @param {string} spreadsheetId
 * @param {string} sheetName
 * @param {string} action
 * @param {Object} params
 */
function dispatch(spreadsheetId, sheetName, action, params) {
  params = params || {};
  switch (action) {
    case 'ping':
      return { status: 'ok', libraryPing: _ping(), pingError: '' };
    case 'appendRow':
      return appendRowToSheet(spreadsheetId, sheetName, params);
    case 'deleteLastRow':
      return deleteLastRow(spreadsheetId, sheetName);
    case 'appendRandomRow':
      return appendRandomRow(spreadsheetId, sheetName);
    case 'clearAllData':
      return clearAllData(spreadsheetId, sheetName);
    case 'getData':
      return getData(spreadsheetId, sheetName);
    default:
      return { status: 'error', message: '알 수 없는 action: ' + action };
  }
}

function _ping() {
  return 'pong from test-Library';
}

/**
 * 스프레드시트에 행 추가
 * @param {string} spreadsheetId
 * @param {string} sheetName
 * @param {Object} data - { name, email, message, timestamp }
 */
function appendRowToSheet(spreadsheetId, sheetName, data) {
  try {
    var sheet = _getOrCreateSheet(spreadsheetId, sheetName);
    _ensureHeader(sheet);
    var timestamp = data.timestamp || new Date().toISOString();
    sheet.appendRow([timestamp, data.name || '', data.email || '', data.message || '']);
    return { status: 'ok', message: '저장 완료' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 마지막 데이터 행 삭제 (헤더 제외)
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
function deleteLastRow(spreadsheetId, sheetName) {
  try {
    var sheet   = _getOrCreateSheet(spreadsheetId, sheetName);
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { status: 'ok', message: '삭제할 데이터 행이 없습니다.' };
    }
    sheet.deleteRow(lastRow);
    return { status: 'ok', message: lastRow + '번째 행 삭제 완료' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 랜덤 10글자 데이터로 행 추가
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
function appendRandomRow(spreadsheetId, sheetName) {
  try {
    var sheet = _getOrCreateSheet(spreadsheetId, sheetName);
    _ensureHeader(sheet);
    var name    = _randomString(10);
    var email   = _randomString(6) + '@test.com';
    var message = _randomString(10);
    var ts      = new Date().toISOString();
    sheet.appendRow([ts, name, email, message]);
    return { status: 'ok', message: '랜덤 데이터 입력 완료', data: { name: name, email: email, message: message } };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 헤더를 제외한 전체 데이터 행 삭제
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
function clearAllData(spreadsheetId, sheetName) {
  try {
    var sheet   = _getOrCreateSheet(spreadsheetId, sheetName);
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { status: 'ok', message: '삭제할 데이터가 없습니다.' };
    }
    sheet.deleteRows(2, lastRow - 1);
    return { status: 'ok', message: (lastRow - 1) + '개 행 전체 삭제 완료' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 시트의 전체 데이터를 배열로 반환 (헤더 제외)
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
function getData(spreadsheetId, sheetName) {
  try {
    var sheet   = _getOrCreateSheet(spreadsheetId, sheetName);
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { status: 'ok', rows: [] };
    var values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    var rows = values.map(function(r) {
      return { timestamp: r[0] ? r[0].toString() : '', name: r[1], email: r[2], message: r[3] };
    });
    return { status: 'ok', rows: rows };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

// ── 내부 유틸 ─────────────────────────────────────────────

function _getOrCreateSheet(spreadsheetId, sheetName) {
  var ss    = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) sheet = ss.insertSheet(sheetName);
  return sheet;
}

function _ensureHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
  }
}

function _randomString(len) {
  var chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
