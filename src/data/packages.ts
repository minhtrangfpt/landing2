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
  /** Detail popup image (gamer packages). */
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
    priceMonthly: 195000, // VERIFY (trang cũ)
    image: '/images/giga.jpg',
    detailImage: '/images/giga-detail.png',
    features: ['Trang bị modem Wi-Fi 6', 'Kết nối ≥ 10 thiết bị'],
  },
  {
    id: 'combo-sky',
    group: 'family',
    name: 'Combo Internet + Truyền hình Sky',
    tagline: 'Internet + FPT Play cho gia đình',
    speed: 'Tốc độ 1000/1000 Mbps',
    priceMonthly: 209000, // VERIFY (ndsua mục 8)
    image: '/images/sky.jpg',
    detailImage: '/images/sky-detail.png',
    features: [
      'Trang bị modem Wi-Fi 6, kết nối ≥ 15 thiết bị',
      'Tặng FPT Play Box xem truyền hình chất lượng cao',
    ],
    highlight: true,
    badge: 'Phổ biến',
  },
  {
    id: 'combo-ngoai-hang-anh',
    group: 'family',
    name: 'Combo Internet Ngoại hạng Anh',
    tagline: 'Xem Ngoại hạng Anh bản quyền',
    speed: 'Tốc độ 1000/1000 Mbps',
    priceMonthly: 239000, // VERIFY (trang cũ)
    image: '/images/ngoai-hang-anh.jpg',
    detailImage: '/images/ngoai-hang-anh-detail.png',
    features: [
      'Modem Wi-Fi 6 + FPT Play Box, kết nối ≥ 15 thiết bị',
      'Xem Ngoại hạng Anh bản quyền trên 2 thiết bị',
    ],
  },
  // ---------- Gói Doanh nghiệp ----------
  {
    id: 'super300-biz',
    group: 'business',
    name: 'Gói Super300 Biz',
    tagline: 'Phù hợp văn phòng nhỏ',
    speed: 'Tốc độ 300 Mbps',
    priceMonthly: 450000, // VERIFY (trang cũ)
    image: '/images/biz-300.jpg',
    detailImage: '/images/biz-300-detail.png',
    features: ['Trang bị Modem MikroTik + Access Point', 'Phù hợp văn phòng nhỏ'],
  },
  {
    id: 'lux500',
    group: 'business',
    name: 'Gói Lux500',
    tagline: 'Băng thông lớn cho công ty',
    speed: 'Tốc độ 500 Mbps',
    priceMonthly: 800000, // VERIFY (trang cũ)
    image: '/images/biz-500.jpg',
    detailImage: '/images/biz-500-detail.png',
    features: ['Wi-Fi 6 + Access Point', 'Phủ sóng lên đến 125 thiết bị'],
  },
  {
    id: 'combo-lux800',
    group: 'business',
    name: 'Combo Lux800',
    tagline: 'Internet + Truyền hình doanh nghiệp',
    speed: 'Tốc độ 800 Mbps',
    priceMonthly: 1075600, // VERIFY (trang cũ)
    image: '/images/biz-800.jpg',
    detailImage: '/images/biz-800-detail.png',
    features: [
      'Wi-Fi 6 + Access Point, gần 120 kênh FPT Play',
      'Kết nối lên đến 160 thiết bị',
    ],
  },
  // ---------- Gói Internet cho game thủ ----------
  // VERIFY: details from https://fpt.vn/internet/game-thu
  {
    id: 'gamer-meta',
    group: 'gamer',
    name: 'Internet Meta',
    tagline: 'Băng thông đối xứng 1 Gbps',
    speed: '1 Gbps / 1 Gbps',
    priceMonthly: 295000, // VERIFY
    image: '/gamer/meta.jpg',
    detailImage: '/gamer/detail-meta.png',
    features: ['Modem Wi-Fi 6', 'Kết nối đến 25 thiết bị', 'Phù hợp chơi game, livestream'],
  },
  {
    id: 'gamer-fgame',
    group: 'gamer',
    name: 'Internet F-Game',
    tagline: 'Ultra Fast — giảm độ trễ tối đa',
    speed: '1 Gbps / 300 Mbps',
    priceMonthly: 225000, // VERIFY
    image: '/gamer/fgame.jpg',
    detailImage: '/gamer/detail-fgame.png',
    features: ['Modem Wi-Fi 6', 'Ultra Fast hỗ trợ 50+ tựa game', 'Giảm độ trễ tới 16ms'],
    badge: 'GAME',
  },
  {
    id: 'gamer-combo-meta',
    group: 'gamer',
    name: 'Combo Meta',
    tagline: 'Internet Meta + FPT Play Box',
    speed: '1 Gbps / 1 Gbps',
    priceMonthly: 320000, // VERIFY
    image: '/gamer/combo-meta.jpg',
    detailImage: '/gamer/detail-combo-meta.png',
    features: ['Modem Wi-Fi 6 + FPT Play Box', 'Gần 120 kênh truyền hình', 'Bản quyền AFF ASEAN Hyundai Cup 2026'],
  },
  {
    id: 'gamer-combo-fgame',
    group: 'gamer',
    name: 'Combo F-Game',
    tagline: 'Internet F-Game + FPT Play + Ultra Fast',
    speed: '1 Gbps / 300 Mbps',
    priceMonthly: 270000, // VERIFY
    image: '/gamer/combo-fgame.jpg',
    detailImage: '/gamer/detail-combo-fgame.png',
    features: ['Modem Wi-Fi 6 + FPT Play Box', 'Ultra Fast 50+ tựa game', 'Kho phim 4K'],
    badge: 'GAME',
  },
];

export function getPackagesByGroup(group: PackageGroup): FptPackage[] {
  return packages.filter((p) => p.group === group);
}
