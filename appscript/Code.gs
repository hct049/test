// ============================================================
//  test-Test 프로젝트
//  라이브러리 식별자: SpreadLib
//  모든 요청은 execute() 범용 함수 하나를 통해 처리됩니다.
// ============================================================

var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME     = 'Sheet1';

// ── 범용 실행 함수 ────────────────────────────────────────
// action에 따라 라이브러리 함수를 호출합니다.
// 새 기능 추가 시 이 함수에 case만 추가하면 됩니다.
function execute(action, params) {
  params = params || {};
  switch (action) {
    case 'ping':
      return { status: 'ok', libraryPing: SpreadLib.ping(), pingError: '' };

    case 'appendRow':
      return SpreadLib.appendRowToSheet(SPREADSHEET_ID, SHEET_NAME, params);

    case 'deleteLastRow':
      return SpreadLib.deleteLastRow(SPREADSHEET_ID, SHEET_NAME);

    case 'appendRandomRow':
      return SpreadLib.appendRandomRow(SPREADSHEET_ID, SHEET_NAME);

    case 'clearAllData':
      return SpreadLib.clearAllData(SPREADSHEET_ID, SHEET_NAME);

    default:
      return { status: 'error', message: '알 수 없는 action: ' + action };
  }
}

// ── GET 핸들러 ────────────────────────────────────────────
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  var result;
  try {
    result = execute(action, e ? e.parameter : {});
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }
  return buildResponse(result);
}

// ── POST 핸들러 ───────────────────────────────────────────
function doPost(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var action = params.action || 'appendRow';
  var result;
  try {
    result = execute(action, params);
  } catch (err) {
    result = { status: 'error', message: err.toString() };
  }
  return buildResponse(result);
}

// ── 응답 생성 ─────────────────────────────────────────────
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 에디터 직접 실행용 테스트 ─────────────────────────────
function testPing()          { Logger.log(JSON.stringify(execute('ping'))); }
function testAppendRow()     { Logger.log(JSON.stringify(execute('appendRow',  { name: '테스트', email: 'test@test.com', message: '직접실행' }))); }
function testDeleteLastRow() { Logger.log(JSON.stringify(execute('deleteLastRow'))); }
function testAppendRandom()  { Logger.log(JSON.stringify(execute('appendRandomRow'))); }
function testClearAllData()  { Logger.log(JSON.stringify(execute('clearAllData'))); }
