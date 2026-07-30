# BẢN YÊU CẦU CHỈNH SỬA GIAO DIỆN WEBSITE (CẬP NHẬT MỚI)
**Dự án:** Landing2-3uy.pages.dev
**Phiên bản:** Cập nhật lần 3 (Dành cho AI / Developer)

## 1. Header & Navigation (Đầu trang & Điều hướng)
*   done

## 2. Popup & Form (Cửa sổ bật lên & Biểu mẫu)
*   **On-load Modal (Popup điền thông tin):**
    *   Thiết lập sự kiện kích hoạt Popup chứa Form điền thông tin (Lead Generation Form) khi kéo đến cuối trang.
    *   **Position:** Giữa trang
    *   **Copywriting (Nội dung Form):** Bổ sung đoạn text: "Quý khách hãy để lại thông tin, kỹ thuật viên sẽ tư vấn và lắp đặt trong ngày. Hotline: 0931.50.55.56".

## 3. Floating Actions & Icons (Nút tương tác nổi & Biểu tượng)
*   **Custom Assets:** Thay đổi hình ảnh/icon của nút Zalo và nút CTA bằng hình ảnh icon zalo và icon tin nhắn

## 4. Main Body & Layout (Nội dung trang & Bố cục)
*   **Callband section:** Xóa bỏ callband zalo, chỉ giữ lại callband_call
*   **class="districts": Loại bỏ "Cát Hải" và "Bạch Long Vĩ" khỏi danh sách hiển thị.
*   **Event Listener (Tương tác Map):** Gắn sự kiện `onClick` cho các nút quận/huyện; khi click vào bất kỳ quận/huyện nào sẽ tự động popup Bảng điền thông tin khách hàng.


## 5. Footer Form Section (Khu vực Form cuối trang)
*   **Submit Button (Nút gửi biểu mẫu):** Sửa text của nút submit từ "Gửi đăng ký qua zalo" thành "Gửi đăng ký ngay".
*   **Cleanup (Dọn dẹp UI):** Xóa toàn bộ các nút thừa bao gồm: "Chat Zalo tư vấn", "Zalo", và nút số điện thoại "0931.50.55.56".
*   **Xóa toàn bộ class="section callband callband--blink"