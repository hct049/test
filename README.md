# Spreadsheet DB 테스트

## 환경 변수 (Vercel 프로젝트 설정에 등록)

| 변수 | 설명 |
|------|------|
| `GAS_URL` | Apps Script 웹앱 배포 URL |
| `ADMIN_ID` | 로그인 아이디 |
| `ADMIN_PASSWORD` | 로그인 비밀번호 |
| `SESSION_SECRET` | 세션 쿠키 서명 키 (랜덤 문자열) |

## 구조

```
브라우저
  └─ /api/proxy (Vercel — GAS_URL은 여기서만 사용, 클라이언트에 노출 없음)
       └─ Apps Script (test-Test) → SpreadLib.dispatch() → Spreadsheet
```

## Apps Script 배포 순서

1. **test-Library**: `appscript/library_Code.gs` 붙여넣기 → 새 배포 > 라이브러리
2. **test-Test**: `appscript/Test_Code.gs` 붙여넣기 → 라이브러리 추가 (식별자: `SpreadLib`) → 새 배포 > 웹앱

## 기능

- 미로그인: 시트 데이터 게시판 조회만 가능
- 로그인 후: 데이터 입력 / 랜덤 입력 / 마지막 행 삭제 / 전체 삭제
