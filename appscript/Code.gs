// ============================================================
//  test-Test 프로젝트
//  test-Library 프로젝트를 라이브러리로 참조합니다.
//
//  라이브러리 추가 방법 (스크립트 에디터):
//  1. 왼쪽 패널 '라이브러리' 옆 + 클릭
//  2. 스크립트 ID: test-Library 프로젝트의 스크립트 ID 입력
//  3. 버전 선택 (배포한 버전 번호)
//  4. 식별자(Identifier): SpreadLib  ← 아래 코드와 반드시 일치
//  5. 추가 클릭
// ============================================================

var SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
var SHEET_NAME     = 'Sheet1';

// ── GET 핸들러 (연결 테스트용) ────────────────────────────
function doGet(e) {
  var pingResult = '';
  var pingError  = '';
  try {
    pingResult = SpreadLib.ping();
  } catch (err) {
    pingError = err.toString();
  }

  var output = {
    status:      'ok',
    message:     'Apps Script 정상 작동 중',
    libraryPing: pingResult,
    pingError:   pingError
  };
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── POST 핸들러 (라이브러리 함수로 데이터 저장) ───────────
function doPost(e) {
  try {
    var params = e.parameter || {};

    var data = {
      name:      params.name      || '',
      email:     params.email     || '',
      message:   params.message   || '',
      timestamp: params.timestamp || new Date().toISOString()
    };

    // 라이브러리 함수 호출
    var result = SpreadLib.appendRowToSheet(SPREADSHEET_ID, SHEET_NAME, data);

    return buildResponse(result);
  } catch (err) {
    return buildResponse({ status: 'error', message: err.toString() });
  }
}

// ── CORS 헤더 포함 응답 생성 ──────────────────────────────
function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 라이브러리 연결 확인 테스트 ───────────────────────────
function testLibraryPing() {
  var result = SpreadLib.ping();
  Logger.log('ping 결과: ' + result);
}

// ── 스프레드시트 저장 테스트 ──────────────────────────────
function testAppend() {
  var data = {
    name:      '테스트 이름',
    email:     'test@example.com',
    message:   '라이브러리를 통해 저장한 테스트',
    timestamp: new Date().toISOString()
  };
  var result = SpreadLib.appendRowToSheet(SPREADSHEET_ID, SHEET_NAME, data);
  Logger.log(JSON.stringify(result));
}
