export type PackageGroup = 'family' | 'business' | 'gamer';

export interface FptPackage {
  id: string;
  group: PackageGroup;
  name: string;
  tagline: string;
  speed?: string;
  /** VNĐ/month. VERIFY against the live site / official FPT rates before launch. */
  priceMonthly: number;
  features: string[];
  /** Card image (path under /public). */
  image?: string;
  highlight?: boolean;
  badge?: string;
  savings?: string;
  /** Detail popup image. */
  detailImage?: string;
}

export const packages: FptPackage[] = [
  // ---------- Gói Gia đình ----------
  {
    id: 'giga',
    group: 'family',
    name: 'Gói Internet Giga',
    tagline: 'Phù hợp hộ gia đình nhỏ',
    speed: 'Tốc độ 1000/300 Mbps',
    priceMonthly: 195000, // VERIFY
    image: '/images/giga.jpg',
    features: ['Modem Wi-Fi 6', 'Kết nối ≥ 10 thiết bị'],
  },
  {
    id: 'combo-giga-vvip',
    group: 'family',
    name: 'Combo Giga V.VIP',
    tagline: 'Xem Ngoại hạng Anh 4K + Tặng Camera',
    speed: 'Tốc độ 300/300 Mbps',
    priceMonthly: 220000, // VERIFY (yeucau5)
    image: '/images/combo-giga-vvip.jpg',
    detailImage: '/images/detail-combo-giga-vvip.png',
    features: [
      'Modem Wi-Fi 6, kết nối ≥ 10 thiết bị',
      'Xem trọn vẹn Ngoại hạng Anh 4K sắc nét',
      'Nhận thêm Camera miễn phí',
    ],
    highlight: true,
    badge: 'Phổ biến',
  },
  {
    id: 'combo-sky-vvip',
    group: 'family',
    name: 'Combo Sky V.VIP',
    tagline: 'Xem Ngoại hạng Anh 4K + Tặng Camera',
    speed: 'Tốc độ 1000/1000 Mbps',
    priceMonthly: 239000, // VERIFY (yeucau5)
    image: '/images/combo-sky-vvip.jpg',
    detailImage: '/images/detail-combo-sky-vvip.png',
    features: [
      'Modem Wi-Fi 6, kết nối ≥ 15 thiết bị',
      'Xem trọn vẹn Ngoại hạng Anh 4K sắc nét',
      'Nhận thêm Camera miễn phí',
    ],
  },
  // ---------- Gói Doanh nghiệp ----------
  {
    id: 'super300-biz',
    group: 'business',
    name: 'Gói Super300 Biz',
    tagline: 'Phù hợp văn phòng nhỏ',
    speed: 'Tốc độ 300 Mbps',
    priceMonthly: 450000, // VERIFY
    image: '/images/biz-300.jpg',
    features: ['Modem MikroTik + Access Point', 'Phù hợp văn phòng nhỏ'],
  },
  {
    id: 'lux500',
    group: 'business',
    name: 'Gói Lux500',
    tagline: 'Băng thông lớn cho công ty',
    speed: 'Tốc độ 500 Mbps',
    priceMonthly: 800000, // VERIFY
    image: '/images/biz-500.jpg',
    features: ['Wi-Fi 6 + Access Point', 'Phủ sóng lên đến 125 thiết bị'],
  },
  {
    id: 'combo-lux800',
    group: 'business',
    name: 'Combo Lux800',
    tagline: 'Internet + Truyền hình doanh nghiệp',
    speed: 'Tốc độ 800 Mbps',
    priceMonthly: 1075600, // VERIFY
    image: '/images/biz-800.jpg',
    features: ['Wi-Fi 6 + Access Point, gần 120 kênh FPT Play', 'Kết nối lên đến 160 thiết bị'],
  },
  // ---------- Gói Internet cho game thủ ----------
  {
    id: 'gamer-fgame',
    group: 'gamer',
    name: 'Internet F-Game',
    tagline: 'Ultra Fast — giảm độ trễ tối đa',
    speed: '1000 Mbps / 300 Mbps',
    priceMonthly: 230000, // VERIFY (yeucau5)
    image: '/images/fgame-new.jpg',
    detailImage: '/images/detail-fgame-vvip.jpg',
    features: ['Modem Wi-Fi 6', 'Ultra Fast, giảm độ trễ 16ms'],
  },
  {
    id: 'gamer-combo-meta-vvip',
    group: 'gamer',
    name: 'Combo Meta V.VIP',
    tagline: 'Ngoại hạng Anh 4K + Tặng Camera',
    speed: '1000 Mbps / 1000 Mbps',
    priceMonthly: 339000, // VERIFY (yeucau5)
    image: '/images/combo-meta-vvip.jpg',
    detailImage: '/images/detail-combo-meta-vvip.png',
    features: [
      'Modem Wi-Fi 6 tốc độ 1 Gbps',
      'Xem trọn vẹn Ngoại hạng Anh 4K sắc nét',
      'Nhận thêm Camera miễn phí',
    ],
    highlight: true,
    badge: 'Phổ biến',
  },
  {
    id: 'gamer-combo-meta-vvip-f1',
    group: 'gamer',
    name: 'Combo Meta V.VIP F1',
    tagline: 'Ngoại hạng Anh 4K + Camera + Mesh',
    speed: '1000 Mbps / 1000 Mbps',
    priceMonthly: 259000, // VERIFY (yeucau5)
    image: '/images/combo-meta-vvip-f1.jpg',
    detailImage: '/images/detail-combo-meta-vvip-f1.png',
    features: [
      'Modem Wi-Fi 6 tốc độ 1 Gbps + 1 Mesh',
      'Xem trọn vẹn Ngoại hạng Anh 4K sắc nét',
      'Nhận thêm Camera miễn phí',
    ],
  },
];

export function getPackagesByGroup(group: PackageGroup): FptPackage[] {
  return packages.filter((p) => p.group === group);
}
