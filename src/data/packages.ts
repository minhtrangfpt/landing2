export type PackageCategory = 'internet' | 'combo';

export interface FptPackage {
  id: string;
  category: PackageCategory;
  name: string;
  tagline: string;
  speed?: string;
  /** VNĐ/month, VAT included. VERIFY against official FPT rates before launch. */
  priceMonthly: number;
  originalPrice?: number;
  features: string[];
  highlight?: boolean;
  badge?: string;
  savings?: string;
}

export const packages: FptPackage[] = [
  // ---------- Internet cá nhân ----------
  {
    id: 'giga',
    category: 'internet',
    name: 'Internet GIGA',
    tagline: 'Phù hợp hộ gia đình nhỏ',
    speed: 'Tốc độ tối đa 1Gbps',
    priceMonthly: 220000, // VERIFY
    originalPrice: 275000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6',
      'Tặng thêm tháng cước sử dụng',
      'Hỗ trợ lắp đặt nhanh trong ngày',
    ],
    highlight: true,
    badge: 'HOT',
  },
  {
    id: 'sky',
    category: 'internet',
    name: 'Internet SKY',
    tagline: 'Phù hợp hộ gia đình lớn',
    speed: 'Tốc độ tối đa 1Gbps',
    priceMonthly: 235000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6',
      'Tặng thêm tháng cước sử dụng',
      'Hỗ trợ lắp nhanh trong ngày',
    ],
  },
  {
    id: 'meta',
    category: 'internet',
    name: 'Internet META',
    tagline: 'Phù hợp văn phòng, hộ gia đình lớn',
    speed: 'Băng thông lớn, ổn định',
    priceMonthly: 340000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6',
      'Tặng thêm tháng cước sử dụng',
      'Miễn phí lắp đặt tại nhà',
    ],
  },
  {
    id: 'fgame',
    category: 'internet',
    name: 'Internet F-GAME',
    tagline: 'Dành cho game thủ, streamer',
    speed: 'Ưu tiên độ trễ thấp',
    priceMonthly: 255000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6',
      'Tặng thêm tháng cước sử dụng',
      'Tích hợp ULTRAFAST hỗ trợ +50 tựa game',
      'Hỗ trợ lắp đặt nhanh trong ngày',
    ],
    badge: 'GAME',
  },
  {
    id: 'antam',
    category: 'internet',
    name: 'Internet AN TÂM',
    tagline: 'Bảo mật F-Safe an tâm kết nối',
    speed: 'Tốc độ tối đa 1Gbps',
    priceMonthly: 245000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6',
      'Ngăn chặn trang web độc hại và lừa đảo',
      'Ngăn chặn theo dõi trực tuyến',
      'Giới hạn thời gian sử dụng Internet của trẻ',
    ],
    badge: 'NEW',
  },
  // ---------- Combo Internet + Truyền hình ----------
  {
    id: 'combo-giga',
    category: 'combo',
    name: 'Combo GIGA',
    tagline: 'Internet + FPT Play cho gia đình nhỏ',
    priceMonthly: 240000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6 & FPT Play',
      'Hơn 180 kênh truyền hình trong và ngoài nước',
      'Tặng thêm tháng cước sử dụng',
      'Lắp đặt nhanh trong ngày',
    ],
    savings: 'Tiết kiệm 590.000đ khi mua lẻ',
    highlight: true,
    badge: 'HOT',
  },
  {
    id: 'combo-sky',
    category: 'combo',
    name: 'Combo SKY',
    tagline: 'Internet + FPT Play cho gia đình vừa',
    priceMonthly: 260000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6 & FPT Play',
      'Hơn 180 kênh truyền hình',
      'Tặng thêm tháng cước sử dụng',
      'Lắp đặt nhanh trong ngày',
    ],
    savings: 'Tiết kiệm 590.000đ khi mua lẻ',
  },
  {
    id: 'combo-fgame',
    category: 'combo',
    name: 'Combo F-GAME',
    tagline: 'Internet + FPT Play cho gamer/streamer',
    priceMonthly: 295000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6 & FPT Play',
      'Hơn 180 kênh truyền hình',
      'Tích hợp ULTRAFAST hỗ trợ +50 tựa game',
      'Lắp đặt nhanh trong ngày',
    ],
    savings: 'Tiết kiệm 1.450.000đ khi mua lẻ',
    badge: 'GAME',
  },
  {
    id: 'combo-antam',
    category: 'combo',
    name: 'Combo AN TÂM',
    tagline: 'Internet + FPT Play + bảo mật F-Safe',
    priceMonthly: 280000, // VERIFY
    features: [
      'Miễn phí modem Wi-Fi 6 & FPT Play',
      'Bảo mật F-Safe: chặn web độc hại, lừa đảo',
      'Gần 130 kênh truyền hình đặc sắc',
      'Kết nối nhanh, ổn định, bảo vệ mọi thiết bị',
    ],
    badge: 'NEW',
  },
];

export function getPackagesByCategory(category: PackageCategory): FptPackage[] {
  return packages.filter((p) => p.category === category);
}
