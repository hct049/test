// ============================================================
//  test-Library 프로젝트
//  배포: 배포 > 새 배포 > 유형: 라이브러리
// ============================================================

/** 라이브러리 연결 확인 */
function ping() {
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
