Tôi cần refactor UI cho landing page Astro (mangfpt.vn) để giảm mật độ 
thông tin và số CTA cạnh tranh nhau. Thực hiện đúng 4 việc sau, giữ 
nguyên toàn bộ logic data/props hiện có, chỉ sửa CSS và markup tối thiểu.

### 1. Thống nhất màu accent — chỉ dùng cam làm màu CTA chính
File: src/styles/global.css
- Đổi `.callband__zalo`, `.dock__btn--zalo`, `.fab--zalo` trong 
  CallBand.astro và FloatingContact.astro: đổi background từ #0a77f7 
  sang biến `--orange` nhạt hơn hoặc dùng outline style (border cam, 
  nền trắng/trong suốt), không dùng xanh dương làm nền đặc.
- Icon Zalo 💬 giữ nguyên nhưng nút Zalo nên là "secondary style" 
  (viền cam, chữ cam, nền trắng) — nút Gọi ngay là "primary style" 
  (nền cam đặc, chữ trắng) duy nhất nổi bật nhất trên mỗi section.
- Áp dụng quy tắc: mỗi section chỉ có 1 nút primary (cam đặc), 
  các nút còn lại là secondary (outline).

### 2. Giảm mật độ card gói cước
File: src/components/Packages.astro, src/components/GamerSection.astro
- Bỏ dòng `tagline` ra khỏi card hiển thị (giữ trong data để dùng chỗ 
  khác nếu cần, ví dụ alt text).
- Tăng `padding` của `.pkg__body` từ `18px 20px 20px` lên `24px 20px 28px`.
- Tăng `gap` giữa các dòng trong `.pkg__features li` — thêm 
  `line-height: 1.6; margin-bottom: 6px;` cho từng item.
- Giới hạn hiển thị tối đa 3 features quan trọng nhất trên card 
  (ẩn phần còn lại vào nút "Xem chi tiết" đã có sẵn).
- Tăng `font-size` của `.pkg__amount` (giá) và giữ khoảng cách với 
  `.pkg__unit` rõ ràng hơn để giá là điểm nhìn đầu tiên.

### 3. Giảm số CTA cạnh tranh trong Hero
File: src/components/Hero.astro
- Đổi `.hero__cta` chỉ còn 1 nút chính là "📞 Hotline: {phone}" 
  (dùng style .btn--call, nền trắng nổi trên cam).
- Nút "📝 Đăng ký nhận ưu đãi" đổi thành text link nhỏ hơn bên dưới 
  nút hotline (kiểu underline, không phải button to), ví dụ: 
  "hoặc để lại số điện thoại, chúng tôi gọi lại →" link tới #dang-ky.
- Trên mobile, FloatingContact (dock) đã có Gọi/Zalo rồi — không cần 
  lặp lại cả 2 hành động này quá rõ trong Hero, tập trung Hero vào 
  1 CTA gọi điện là chính.

### 4. Tăng contrast phần feature strip trong Hero
File: src/components/Hero.astro (phần .hero__perks)
- Đổi background của `.hero__perks li` từ 
  `rgba(255,255,255,0.15)` sang nền trắng đặc `#fff` với chữ màu cam 
  đậm `var(--orange-dark)`, thêm `font-weight: 700`.
- Tăng `font-size` từ `.9rem` lên `1rem` trên desktop, giữ `.85rem` 
  trên mobile qua media query.
- Tăng padding từ `6px 12px` lên `8px 16px` để dễ đọc hơn trên nền cam.

Sau khi sửa xong, chạy `npm run verify` để đảm bảo không phá vỡ các 
check hiện có (nếu có check liên quan tới nội dung cũ đã bị xóa như 
tagline hiển thị, cần cập nhật lại scripts/verify.mjs tương ứng).

Không đổi cấu trúc data (packages.ts, provinces.ts), không đổi 
schema SEO, chỉ sửa phần UI/CSS/markup như trên.