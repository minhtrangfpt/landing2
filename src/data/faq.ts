import type { Province } from '../config/provinces';

export interface FaqItem {
  q: string;
  a: string;
}

export function getFaqs(province: Province): FaqItem[] {
  return [
    {
      q: `Lắp mạng FPT tại ${province.name} mất bao lâu?`,
      a: 'Sau khi tiếp nhận yêu cầu, kỹ thuật viên sẽ liên hệ khảo sát và lắp đặt trong vòng vài giờ, đa số khách hàng được sử dụng mạng ngay trong ngày đăng ký (trong giờ hành chính).',
    },
    {
      q: 'Lắp mạng FPT có mất phí lắp đặt không?',
      a: 'Đang có chương trình hỗ trợ miễn phí lắp đặt cho khách hàng đăng ký mới. Phí hòa mạng (nếu có) được báo rõ trước khi thi công, tuyệt đối không phát sinh phụ phí ẩn.',
    },
    {
      q: 'Modem Wi-Fi 6 có phải trả tiền thuê không?',
      a: 'Không. Khi đăng ký các gói internet FPT, khách hàng được trang bị miễn phí modem Wi-Fi 6 mới, sóng khỏe, phủ rộng nhiều thiết bị cùng lúc.',
    },
    {
      q: `Khu vực nào tại ${province.name} được lắp đặt?`,
      a: `Chúng tôi lắp mạng FPT trên toàn bộ ${province.name}: ${province.districts.join(', ')}.`,
    },
    {
      q: 'Thủ tục đăng ký cần chuẩn bị gì?',
      a: 'Chỉ cần cung cấp địa chỉ lắp đặt và số CMND/CCCD. Nhân viên sẽ đến tận nhà tư vấn gói phù hợp, ký hợp đồng và thi công — bạn không cần ra cửa hàng.',
    },
    {
      q: 'Thanh toán cước như thế nào?',
      a: 'Khách hàng thanh toán cước hàng tháng theo hình thức trả sau (qua chuyển khoản, ứng dụng ngân hàng hoặc điểm thu FPT). Có ưu đãi giảm giá khi thanh toán trước 6-12 tháng.',
    },
    {
      q: 'Khi gặp sự cố mạng, có được hỗ trợ không?',
      a: 'Có. Khách hàng được hỗ trợ kỹ thuật 24/7 qua hotline. Khi có sự cố, đội ngũ kỹ thuật tiếp nhận và xử lý nhanh chóng để đảm bảo kết nối ổn định.',
    },
  ];
}
