// ============================================================
//  Spreadsheet DB 테스트용 Apps Script
//  - 외부 라이브러리 의존 없음 (순수 GAS 코드)
//  - 배포: 웹앱으로 배포 > 액세스 권한: 모든 사용자
// ============================================================

// 스프레드시트 ID (본인 스프레드시트의 ID로 교체하세요)
// URL에서 /d/SPREADSHEET_ID/edit 부분의 ID
var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME     = 'Sheet1'; // 사용할 시트 이름

// ── GET 핸들러 (연결 테스트용) ────────────────────────────
function doGet(e) {
  var output = { status: 'ok', message: 'Apps Script가 정상 작동 중입니다.' };
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST 핸들러 (데이터 저장) ─────────────────────────────
function doPost(e) {
  try {
    var params = e.parameter || {};

    var name      = params.name      || '';
    var email     = params.email     || '';
    var message   = params.message   || '';
    var timestamp = params.timestamp || new Date().toISOString();

    appendRow(timestamp, name, email, message);

    var result = { status: 'ok', message: '저장 완료' };
    return buildResponse(result);
  } catch (err) {
    var result = { status: 'error', message: err.toString() };
    return buildResponse(result);
  }
}

// ── 스프레드시트에 행 추가 ────────────────────────────────
function appendRow(timestamp, name, email, message) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  // 시트가 없으면 새로 생성
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // 첫 행이 비어 있으면 헤더 추가
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
  }

  sheet.appendRow([timestamp, name, email, message]);
}

// ── CORS 헤더 포함 응답 생성 ──────────────────────────────
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 로컬 테스트용 함수 ────────────────────────────────────
function testAppend() {
  appendRow(
    new Date().toISOString(),
    '테스트 이름',
    'test@example.com',
    '스크립트 에디터에서 직접 실행한 테스트'
  );
  Logger.log('testAppend 완료');
}
