# Google Sheets 문의 폼 연동

`sheets-config.js`의 `endpoint`에 Google Apps Script 웹앱 URL을 넣으면 문의 폼을 스프레드시트로 보낼 수 있습니다.

## 1. 구글 시트 만들기

첫 행에 아래 컬럼을 만드세요.

```text
timestamp, name, email, organization, type, message, page
```

## 2. Apps Script 만들기

구글 시트에서 `확장 프로그램 > Apps Script`를 열고 아래 코드를 붙여 넣으세요.

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.organization || "",
    data.type || "",
    data.message || "",
    data.page || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. 웹앱 배포

`배포 > 새 배포 > 웹 앱`을 선택하고 다음처럼 설정하세요.

```text
실행 사용자: 나
액세스 권한: 모든 사용자
```

배포 후 생성된 웹앱 URL을 `sheets-config.js`에 넣으면 됩니다.

```javascript
window.PRX_SHEETS_CONFIG = {
  endpoint: "여기에 Apps Script 웹앱 URL",
  demoMessage: "현재는 데모 모드입니다.",
};
```
