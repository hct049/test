// ============================================================
//  test-Library 프로젝트
//  라이브러리로 배포되어 다른 프로젝트에서 호출됩니다.
//
//  배포 방법:
//  1. 프로젝트 설정 > 스크립트 ID 메모 (test-Test에서 참조할 ID)
//  2. 배포 > 새 배포 > 유형: 라이브러리
//  3. 버전 번호 메모 (test-Test에서 참조할 버전)
// ============================================================

/**
 * 지정한 스프레드시트에 데이터 행을 추가합니다.
 * @param {string} spreadsheetId - 대상 스프레드시트 ID
 * @param {string} sheetName     - 대상 시트 이름 (없으면 자동 생성)
 * @param {Object} data          - { name, email, message } 형태의 객체
 * @return {Object} { status: 'ok'|'error', message: string }
 */
function appendRowToSheet(spreadsheetId, sheetName, data) {
  try {
    var ss    = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
    }

    var timestamp = data.timestamp || new Date().toISOString();
    sheet.appendRow([timestamp, data.name || '', data.email || '', data.message || '']);

    return { status: 'ok', message: '저장 완료' };
  } catch (err) {
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 라이브러리 연결 확인용 함수
 * @return {string}
 */
function ping() {
  return 'pong from test-Library';
}
