# Thiệp cưới online – Trần Lâm & Vũ Hồng

Web tĩnh thuần HTML/CSS/JS, không cần build.

## Chạy thử trên máy
```
npx serve .        # hoặc: python -m http.server 8080
```
Mở `http://localhost:8080/?to=Anh%20Minh` → phong bì và lời mời ghi "Anh Minh" thay cho "Quý khách".

## Sửa nội dung
Mọi thông tin nằm trong **`config.js`**: tên, ngày giờ, địa điểm, lịch trình, ảnh, lời chúc mẫu, số tài khoản…

| Mục trong config.js | Ý nghĩa |
|---|---|
| `theme` | Màu thiệp: `"green"` (xanh lá pastel) hoặc `"pink"` (hồng pastel) |
| `themePicker` | Hiện nút chọn màu ở góc trên để so sánh – chốt màu xong đổi thành `false` |
| `autoScroll` | Tự cuộn mặc định (khách bấm ⏸ để cuộn tay) |
| `opener.enabled` | Màn hình phong bì "Chạm để mở thiệp" (false = vào thẳng thiệp) |
| `opener.autoScrollDelay` | Mở thiệp xong chờ bao lâu (ms) rồi mới tự cuộn |
| `events[].duration` | Số giờ của sự kiện – dùng cho nút "Thêm vào lịch" |
| `guestbook.googleScriptUrl` | URL Apps Script để lưu & chia sẻ lời chúc (xem bên dưới) |
| `guestbook.showSamples` | Hiện 20 lời chúc mẫu – đổi thành `false` khi đã có lời chúc thật |
| `stickers` | Sticker nhân vật chibi (false = tắt) |

- **Ảnh**: `images/` (đã nén JPG). Ảnh gốc PNG do Codex tạo ở `images/gen/` – không cần đưa lên host.
- **Sticker**: `images/stickers/*.webp` (nền trong suốt).
- **Bản đồ**: trên Google Maps ghim đúng nhà → Chia sẻ → Sao chép liên kết → dán vào `mapUrl`.
- **Nhạc**: `music.mp3` (15 phút đầu bản giao hưởng, 96kbps). Nhạc bật khi khách chạm mở phong bì.
- **QR mừng cưới**: `images/qr-mung-cuoi.webp` (tài khoản chung MB Bank) – sửa STK trong `gifts`, lời dặn trong `giftNote`.
- **Ảnh chia sẻ Zalo/Messenger**: sửa `og:image`, `og:url` trong `index.html` thành URL tuyệt đối sau khi đưa lên host (`images/og-cover.jpg` đã có sẵn 1200×630).

## Lời chúc dùng chung qua Google Sheets
Khi nối Google Sheets: lời chúc của mọi khách hiện cho tất cả mọi người (danh sách + bong bóng góc dưới trái), và bạn có bảng thống kê xác nhận tham dự.

1. Tạo một Google Sheet mới.
2. **Tiện ích mở rộng → Apps Script**, xoá code mẫu, dán toàn bộ nội dung file **`google-apps-script.gs`**, bấm Lưu.
3. Chọn hàm **`setup`** ở thanh trên → **Chạy** → cấp quyền. Sheet sẽ có 2 trang: `LoiChuc` và `ThongKe`.
4. **Triển khai → Tùy chọn triển khai mới → Ứng dụng web**:
   - Thực thi với tư cách: **Tôi**
   - Người có quyền truy cập: **Bất kỳ ai**
5. Sao chép URL dạng `https://script.google.com/macros/s/.../exec` → dán vào `guestbook.googleScriptUrl` trong `config.js`.
6. Khi đã có lời chúc thật, đặt `guestbook.showSamples: false`.

- Trang **ThongKe** tự đếm: khách nhà trai / nhà gái, ai dự 16/01, 17/01, cả hai ngày, bao nhiêu người ăn cỗ mỗi bên.
- Muốn **ẩn** một lời chúc không phù hợp: gõ `x` vào cột "Ẩn" của dòng đó.
- Sửa code Apps Script thì phải **Triển khai → Quản lý triển khai → Chỉnh sửa → Phiên bản mới** mới có hiệu lực.

## Tính năng
- Phong bì mở thiệp có tên khách, chạm để mở → bật nhạc → tự cuộn.
- Nút tự cuộn (dưới đĩa nhạc), tạm dừng khi khách tự vuốt, cuộn tiếp sau 4 giây.
- Thêm sự kiện vào Google Calendar / lịch iPhone, Outlook (.ics, nhắc trước 1 ngày và 2 giờ).
- Lời chúc nhảy liên tục ở góc dưới trái, sổ lưu bút + xác nhận tham dự (bên nào, hôm nào, ăn cỗ).
- Sticker chibi nhảy khi chạm, tim bung khi chạm, tim bay trên ảnh bìa, chạm đúp ảnh album để thả tim.
- Bố cục điện thoại (dọc) và máy tính (ngang 16:9).

## Đưa lên mạng (miễn phí)
Kéo thả thư mục (bỏ `images/gen`, `characters`) vào https://app.netlify.com/drop, hoặc dùng GitHub Pages / Vercel.
