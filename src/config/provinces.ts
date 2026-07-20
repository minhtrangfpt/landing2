import { site } from './site';

export interface Province {
  slug: string;
  active: boolean;
  name: string;
  region: string;
  districts: string[];
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  intro: string;
}

export const provinces: Record<string, Province> = {
  haiphong: {
    slug: 'haiphong',
    active: true,
    name: 'Hải Phòng',
    region: 'Đồng bằng sông Hồng',
    districts: [
      'Hồng Bàng', 'Lê Chân', 'Ngô Quyền', 'Hải An', 'Kiến An',
      'Đồ Sơn', 'Dương Kinh', 'Thủy Nguyên', 'An Dương', 'An Lão',
      'Kiến Thụy', 'Tiên Lãng', 'Vĩnh Bảo', 'Cát Hải', 'Bạch Long Vĩ',
    ],
    metaTitle: 'Lắp mạng FPT tại Hải Phòng — Wi-Fi 6 miễn phí, lắp trong ngày | 0931.50.55.56',
    metaDescription:
      'Đăng ký lắp mạng FPT tại Hải Phòng: modem Wi-Fi 6 miễn phí, lắp đặt nhanh trong ngày, hỗ trợ 24/7. Gọi ngay 0931.50.55.56 để nhận ưu đãi.',
    heroHeadline: 'Lắp mạng FPT tại Hải Phòng',
    intro:
      'Bạn đang tìm đơn vị lắp mạng FPT tại Hải Phòng nhanh, uy tín, giá tốt? Chúng tôi hỗ trợ đăng ký và lắp đặt internet FPT trên toàn bộ các quận, huyện tại Hải Phòng — từ nội thành Lê Chân, Hồng Bàng, Ngô Quyền đến các huyện Thủy Nguyên, An Dương, Kiến Thụy. Modem Wi-Fi 6 miễn phí, kỹ thuật viên đến tận nhà khảo sát và lắp trong ngày.',
  },
  // To add a province: copy this block, change slug/name/districts/meta, set active:true.
  // Example (disabled):
  // danang: {
  //   slug: 'danang', active: false, name: 'Đà Nẵng', region: 'Duyên hải Nam Trung Bộ',
  //   districts: ['Hải Châu','Thanh Khê','Sơn Trà','Ngũ Hành Sơn','Liên Chiểu','Cẩm Lệ','Hòa Vang','Hoàng Sa'],
  //   metaTitle: 'Lắp mạng FPT tại Đà Nẵng — Wi-Fi 6 miễn phí, lắp trong ngày | 0931.50.55.56',
  //   metaDescription: 'Đăng ký lắp mạng FPT tại Đà Nẵng: modem Wi-Fi 6 miễn phí, lắp đặt nhanh trong ngày. Gọi ngay 0931.50.55.56.',
  //   heroHeadline: 'Lắp mạng FPT tại Đà Nẵng',
  //   intro: 'Lắp mạng FPT tại Đà Nẵng nhanh, uy tín, giá tốt. Hỗ trợ lắp đặt trên toàn các quận huyện Đà Nẵng...',
  // },
};

export function getProvince(slug: string): Province {
  const p = provinces[slug];
  if (!p) throw new Error(`Province not found: ${slug}`);
  return p;
}

export function getActiveProvinces(): Province[] {
  return Object.values(provinces).filter((p) => p.active);
}

export function getProvinceSlugs(): string[] {
  return getActiveProvinces().map((p) => p.slug);
}

export function getDefaultProvince(): Province {
  return getProvince(site.defaultProvince);
}
