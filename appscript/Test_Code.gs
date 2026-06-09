// ============================================================
//  [test-Test 프로젝트에 붙여넣기]
//  라이브러리 식별자: SpreadLib
//  함수 종류는 라이브러리 내부에 캡슐화되어 있습니다.
// ============================================================

var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME     = 'Sheet1';

// ── 범용 실행 함수 ────────────────────────────────────────
// action 문자열을 라이브러리에 그대로 위임합니다.
// 어떤 함수가 있는지는 이 파일에서 알 수 없습니다.
function execute(action, params) {
  return SpreadLib.dispatch(SPREADSHEET_ID, SHEET_NAME, action, params || {});
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
  var result;
  try {
    result = execute(params.action || 'appendRow', params);
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
function testAppendRow()     { Logger.log(JSON.stringify(execute('appendRow', { name: '테스트', email: 'test@test.com', message: '직접실행' }))); }
function testDeleteLastRow() { Logger.log(JSON.stringify(execute('deleteLastRow'))); }
function testAppendRandom()  { Logger.log(JSON.stringify(execute('appendRandomRow'))); }
function testClearAllData()  { Logger.log(JSON.stringify(execute('clearAllData'))); }
