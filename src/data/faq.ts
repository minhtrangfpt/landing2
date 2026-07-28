import type { Province } from '../config/provinces';

export interface FaqItem {
  q: string;
  a: string;
}

export function getFaqs(province: Province): FaqItem[] {
  return [
    {
      q: 'Lắp mạng Wifi FPT mất bao lâu thì tôi có thể sử dụng?',
      a: 'Thời gian triển khai lắp mạng, hoà mạng FPT dự kiến như sau: khu vực nội thành triển khai nhanh trong ngày; khu vực ngoại thành từ 24 giờ đến 48 giờ. Sau khi ký hợp đồng, kỹ thuật viên sẽ gọi điện xác nhận lịch hẹn cụ thể để phù hợp nhất với thời gian biểu của bạn.',
    },
    {
      q: 'Tổng chi phí lắp đặt mạng Wifi Internet FPT là bao nhiêu?',
      a: 'FPT cung cấp các gói cước wifi Internet đa dạng với giá chỉ từ 195.000 VND/tháng. Chi phí lắp đặt internet FPT ban đầu thường là 299.000 VND, bao gồm: phí hoà mạng và công lắp đặt thiết bị; trang bị miễn phí Modem Wi-Fi 6 thế hệ mới nhất; kích hoạt dịch vụ và hỗ trợ cấu hình hệ thống. Lưu ý: mức phí có thể thay đổi nhẹ tùy khu vực hoặc chương trình khuyến mãi — hãy gọi hotline để nhận báo giá chính xác nhất cho địa chỉ của bạn.',
    },
    {
      q: 'Có những hình thức thanh toán cước Internet FPT nào?',
      a: 'Để thuận tiện nhất cho khách hàng, FPT hỗ trợ đa kênh thanh toán: qua ứng dụng Hi FPT (khuyên dùng); Internet Banking, Mobile Banking hoặc các ví điện tử (MoMo, ZaloPay, ShopeePay); thanh toán trực tiếp tại các cửa hàng, phòng giao dịch FPT trên toàn quốc.',
    },
    {
      q: 'Mạng Wifi FPT có nhanh và ổn định không?',
      a: 'Mạng FPT được đánh giá là một trong những nhà cung cấp Internet nhanh và ổn định hàng đầu Việt Nam, với hạ tầng 100% cáp quang (FTTH) cùng công nghệ Wi-Fi 6/7 tiên tiến. Ưu điểm nổi bật: tốc độ vượt trội, độ trễ tối thiểu — lý tưởng cho chơi game (Ultra Fast) và livestream; gói Combo tích hợp FPT Play bản quyền Ngoại hạng Anh và kho nội dung 4K; thiết bị thế hệ mới xuyên thấu tốt, chịu tải cao, ổn định tại khu đô thị và nhà cao tầng; thủ tục đơn giản, lắp trong 24h và hỗ trợ kỹ thuật 24/7 qua ứng dụng Hi FPT.',
    },
  ];
}
