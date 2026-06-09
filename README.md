# Spreadsheet DB 테스트 페이지

라이브러리 없이 스프레드시트에 직접 저장하는 테스트 구성입니다.

## 구조

```
Vercel (jtrg0044) → GitHub → Apps Script (jtrg0044, 라이브러리 없음) → Spreadsheet (jtrg0044)
```

## 배포 순서

### 1. Apps Script 배포

1. [script.google.com](https://script.google.com) 접속 (jtrg0044 계정)
2. 새 프로젝트 생성
3. `appscript/Code.gs` 내용 붙여넣기
4. `SPREADSHEET_ID` 변수를 본인 스프레드시트 ID로 교체
5. **배포 > 새 배포** 클릭
   - 유형: 웹 앱
   - 다음 사용자로 실행: 나 (나의 계정)
   - 액세스 권한: 모든 사용자 (익명 포함)
6. 배포 후 **웹 앱 URL** 복사

### 2. Vercel 배포

1. GitHub에 push
2. Vercel에서 이 레포 연결 → 자동 배포

### 3. 테스트

배포된 Vercel URL 접속 후 두 가지 방법으로 Apps Script URL 설정:

**방법 A)** `index.html`의 `GAS_URL` 변수에 직접 입력 후 재배포

**방법 B)** URL 파라미터로 전달 (재배포 없이 즉시 테스트 가능):
```
https://your-vercel-url.vercel.app/?gasUrl=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## Apps Script 직접 테스트

스크립트 에디터에서 `testAppend()` 함수를 직접 실행하면 라이브러리 없이 스프레드시트에 저장되는지 확인할 수 있습니다.
