# BẢN YÊU CẦU CHỈNH SỬA GIAO DIỆN WEBSITE 
**Dự án:** Landing2-3uy.pages.dev
**Mục tiêu:** Cập nhật UI/UX và tối ưu chuyển đổi (Dành cho AI / Developer)

## 1. Global UI & Typography (Thiết lập chung)
*   (đã xong)

## 2. Header & Footer (Đầu trang & Cuối trang)
*   **Sticky Header (Thanh điều hướng cố định trên cùng):**
    *   **Góc trái:** Xóa đoạn text phụ ("Tổng đài đăng ký lắp mạng..." và "Đại lý phân phối..."), chỉ giữ lại Logo FPT Telecom chính thức.
    *   **Góc phải:** Thay thế bằng một nút Call-To-Action (CTA) có nội dung `Hotline: 0931.50.55.56`. Gắn liên kết `tel:0931505556` để hỗ trợ tính năng Click-to-call.
*   **Footer (Phần liên hệ cuối trang):**
    *   Xóa dòng chữ "Chat Zalo tư vấn" nằm dưới số điện thoại.
    *   Bổ sung trường Email: `trangntm35@fpt.com`.
    *   Bổ sung trường Địa chỉ trụ sở: `Đường Bùi Viện, Phường Lê Chân, Hải Phòng`.

## 3. Hero Section (Khu vực Ảnh Cover & Màn hình chính)
*   (đã xong)
*   **Hero CTA Button:** Ở vị trí chính giữa màn hình (Hero Content), chỉ đặt một nút CTA duy nhất là "Hotline: 0931.50.55.56" (có gắn link gọi điện). Bỏ nút "Chat Zalo tư vấn" ở khu vực này.

## 4. Modal & Floating Action Buttons (Cửa sổ bật lên & Nút nổi)
*   **On-load Modal:** Lập trình sự kiện ngay khi người dùng truy cập trang (On-load) sẽ kích hoạt một Popup/Modal chứa Form điền thông tin khách hàng ở góc màn hình.
*   **Floating Zalo Icon:** Thêm một biểu tượng Zalo dạng hình tròn, ghim cố định (Fixed/Sticky) ở góc dưới cùng bên phải màn hình.
*   **Pulse Animation Button:** Chuyển đổi nút "Đăng ký nhận ưu đãi" thành một Icon hội thoại hình tròn, ghim ở cuối màn hình và thêm hiệu ứng nhấp nháy (Pulse/Ripple animation) để thu hút sự chú ý.

## 5. Body Components & Layout (Nội dung trang & Bố cục)
*   **Badge/Icon (Gói Combo Sky):** Thay thế Icon "Ngọn lửa" đang dùng ở gói Combo Sky bằng một asset/vector mới có thiết kế hiện đại và thẩm mỹ hơn.
*   **Grid Layout (Khung dịch vụ):** CSS lại các thẻ dịch vụ (Service Cards) để chúng có chiều cao và chiều rộng bằng nhau (Equal-height cards). Căn chỉnh lại thuộc tính hiển thị ảnh (ví dụ: dùng `object-fit: cover` hoặc chuẩn hóa kích thước ảnh gốc) để ảnh không bị thừa, thiếu hay lệch tỷ lệ.
*   **Image Alignment (Ảnh lắp đặt & Ưu đãi):**
    *   Scale (thay đổi kích thước) bức ảnh "Lắp đặt internet trong 24 giờ" và ảnh "Ưu đãi khi đăng ký online" để chúng có kích thước hiển thị to bằng nhau.
    *   Thiết lập màu nền của container chứa 2 ảnh này thành màu trắng (#FFFFFF) đồng nhất, loại bỏ các hiệu ứng phân lớp nền (multi-layered backgrounds) gây rối mắt.

## 6. Section "Internet Game Thủ"
*   Xóa bỏ đường link "Tham khảo tại fpt.vn →".
*   Bổ sung bảng tóm tắt thông số kỹ thuật trực tiếp vào bên trong các khung (Cards). Cấu trúc dữ liệu theo bảng sau:

| Thông số | Internet Meta | Internet F-Game | Combo Meta | Combo F-Game |
| :--- | :--- | :--- | :--- | :--- |
| **Giá cước** | 295.000đ/tháng | 225.000đ/tháng | 320.000đ/tháng | 270.000đ/tháng |
| **Tốc độ (DL/UL)** | 1000 Mbps/1000 Mbps | 1000 Mbps/300 Mbps | 1000 Mbps/1000 Mbps | 1000 Mbps/300 Mbps |
| **Thiết bị & Tiện ích** | Modem Wi‑Fi 6. Kết nối đến 25 thiết bị | Modem Wi‑Fi 6. Ultra Fast, giảm độ trễ 16ms | Modem Wi‑Fi 6 + FPT Play Box. Xem AFF ASEAN Hyundai Cup 2026 trên FPT Play | Modem Wi‑Fi 6 + FPT Play Box. Xem AFF ASEAN Hyundai Cup 2026 trên FPT Play |

## 7. Interactive Elements (Thành phần tương tác khu vực)
*   **Color-coded Map/List:** Thiết kế khu vực hiển thị các quận/huyện lắp mạng, trong đó gán mỗi quận/huyện một mã màu (Color) khác nhau.
*   **Data Filter:** Loại bỏ "Cát Hải" và "Bạch Long Vĩ" khỏi danh sách hiển thị.
*   **On-click Event:** Gắn sự kiện (Event Listener) cho tất cả các nút/thẻ quận huyện này: Khi người dùng click vào bất kỳ quận/huyện nào, hệ thống sẽ mở ra Popup Form điền thông tin khách hàng.
