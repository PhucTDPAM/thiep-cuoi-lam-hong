/**
 * Google Apps Script cho thiệp cưới – lưu xác nhận tham dự & lời chúc vào Google Sheets
 * và trả danh sách lời chúc về cho thiệp (để mọi khách cùng thấy).
 *
 * Cách dùng: xem README.md, mục "Lời chúc dùng chung qua Google Sheets".
 */

const SHEET_NAME = "LoiChuc";
const STATS_NAME = "ThongKe";
const HEADERS = ["Thời gian", "Tên", "Lời chúc", "Khách của", "Ngày dự", "Ăn cỗ", "Link mời", "Ẩn (gõ x để ẩn)"];

/** Chạy hàm này 1 lần trong trình soạn Apps Script để tạo sheet & bảng thống kê. */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold").setBackground("#DDF0E2");
  sh.setFrozenRows(1);
  sh.setColumnWidth(3, 380);

  const st = ss.getSheetByName(STATS_NAME) || ss.insertSheet(STATS_NAME);
  st.clear();
  const L = "'" + SHEET_NAME + "'!";
  const rows = [
    ["THỐNG KÊ XÁC NHẬN THAM DỰ", ""],
    ["Tổng số phản hồi", `=COUNTA(${L}B2:B)`],
    ["", ""],
    ["Khách nhà trai", `=COUNTIF(${L}D2:D,"Nhà trai")`],
    ["Khách nhà gái", `=COUNTIF(${L}D2:D,"Nhà gái")`],
    ["Khách cả hai bên", `=COUNTIF(${L}D2:D,"Cả hai")`],
    ["", ""],
    ["Dự 16/01 (Ăn hỏi – nhà gái)", `=COUNTIF(${L}E2:E,"16/01*")`],
    ["Dự 17/01 (Thành hôn – nhà trai)", `=COUNTIF(${L}E2:E,"17/01*")`],
    ["Dự cả hai ngày", `=COUNTIF(${L}E2:E,"Cả hai ngày")`],
    ["Không tham dự được", `=COUNTIF(${L}E2:E,"Không*")`],
    ["", ""],
    ["Ở lại ăn cỗ", `=COUNTIF(${L}F2:F,"Có")`],
    ["Không ăn cỗ", `=COUNTIF(${L}F2:F,"Không")`],
    ["", ""],
    ["Ăn cỗ – khách nhà gái", `=COUNTIFS(${L}F2:F,"Có",${L}D2:D,"Nhà gái")`],
    ["Ăn cỗ – khách nhà trai", `=COUNTIFS(${L}F2:F,"Có",${L}D2:D,"Nhà trai")`],
    ["Ăn cỗ – khách cả hai bên", `=COUNTIFS(${L}F2:F,"Có",${L}D2:D,"Cả hai")`]
  ];
  st.getRange(1, 1, rows.length, 2).setValues(rows);
  st.getRange("A1").setFontWeight("bold").setFontSize(13);
  st.setColumnWidth(1, 300);
}

/** Thiệp gửi xác nhận + lời chúc lên đây. */
function doPost(e) {
  const p = (e && e.parameter) || {};
  const clean = (v, max) => String(v || "").replace(/^[=+\-@]/, "'$&").slice(0, max); // chặn chèn công thức
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sh.appendRow([new Date(), clean(p.name, 60), clean(p.message, 500), clean(p.side, 20),
      clean(p.days, 40), clean(p.feast, 10), clean(p.guestLink, 80), ""]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

/** Thiệp đọc danh sách lời chúc (mới nhất trước). Dòng có cột "Ẩn" = x sẽ không hiện. */
function doGet(e) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const last = sh.getLastRow();
  const rows = last > 1 ? sh.getRange(2, 1, last - 1, HEADERS.length).getValues() : [];
  const wishes = rows
    .filter((r) => r[1] && r[2] && String(r[7]).trim().toLowerCase() !== "x")
    .map((r) => ({ name: String(r[1]), message: String(r[2]), side: String(r[3]) }))
    .reverse()
    .slice(0, 300);
  return ContentService.createTextOutput(JSON.stringify({ wishes })).setMimeType(ContentService.MimeType.JSON);
}
