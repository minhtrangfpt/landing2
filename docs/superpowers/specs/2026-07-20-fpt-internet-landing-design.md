# Spec — Landing Page Bán Internet FPT (Đa tỉnh, tối ưu SEO)

- **Ngày:** 2026-07-20
- **Trạng thái:** Chờ user review
- **Tech:** Astro (xuất HTML tĩnh)
- **SĐT:** 0931.50.55.56 — Zalo: https://zalo.me/0931505556

---

## 1. Mục tiêu

Xây dựng **landing page** bán các gói internet FPT, mục tiêu **lên top Google** cho các tìm kiếm kiểu *"lắp mạng FPT tại Hải Phòng"*. Yêu cầu cốt lõi: **có thể đổi/ thêm tỉnh khác dễ dàng mà không làm hỏng SEO** (khi thị trường bão hòa, chuyển sang tỉnh tiềm năng hơn).

## 2. Giới hạn & nguyên tắc

- **Bản quyền:** KHÔNG copy text/hình ảnh có bản quyền của ftel.net.vn. Chỉ dùng **thông tin gói cước công khai** (tên gói, tốc độ, tính năng). Phần mô tả, hình ảnh, thiết kế **tự làm mới 100%** (unique content — đây chính là điều kiện tiên quyết để lên top, vì Google phạt nội dung trùng).
- **Đa tỉnh:** mọi nội dung phụ thuộc tỉnh nằm trong **1 file config**. Đổi/ thêm tỉnh = sửa config + build.
- **SEO-first:** xuất HTML tĩnh, 0 JS render nội dung, Core Web Vitals tối đa.
- **Thông tin liên hệ:** chỉ hiện SĐT + Zalo (theo yêu cầu), xuất hiện ở nhiều vị trí click-to-action.

## 3. Công nghệ

**Astro** — static site generator. Lý do chọn:
- Sinh nhiều trang tỉnh từ data (1 template → N trang) — đáp ứng yêu cầu đa tỉnh.
- Xuất HTML tĩnh thuần, mặc định 0 JS → SEO + tốc độ tải tối đa.
- Có sẵn integration `@astrojs/sitemap`.
- Deploy output tĩnh mọi nơi (Vercel/Netlify/hosting tĩnh), miễn phí.

**Không dùng** framework SPA (React-only client render) vì h hại SEO. Component Astro OK nhưng nội dung phải ở HTML tĩnh.

## 4. Tên miền & URL

- **Domain:** kiểu thương hiệu, KHÔNG chứa tên tỉnh → tích lũy uy tín (domain authority) vĩnh viễn khi đổi tỉnh. Đề xuất `mangfpt.vn` (top), backup `lapmangfpt.vn`, `dangkymangfpt.vn`, `fptinternet.vn`. Domain là biến `SITE_URL` trong config.
- **Cấu trúc URL:** mỗi tỉnh 1 đường dẫn ổn định, không bao giờ dời/xóa:
  - `mangfpt.vn/haiphong/` — trang Hải Phòng (mặc định lúc này)
  - `mangfpt.vn/danang/` — khi thêm Đà Nẵng sau này
  - `mangfpt.vn/` — 301 redirect về tỉnh đang hoạt động (`defaultProvince` trong config)
- **Canonical:** mỗi trang tỉnh tự canonical về chính nó (tránh duplicate).
- **Sitemap:** liệt kê các tỉnh đang `active`.

## 5. Kiến trúc "1 nguồn sự thật" (config-driven)

### 5.1 Cấu trúc thư mục
```
LP2/
├── src/
│   ├── config/
│   │   ├── site.ts          # brand, SĐT, Zalo, SITE_URL, defaultProvince
│   │   └── provinces.ts     # dữ liệu từng tỉnh (single source of truth)
│   ├── data/
│   │   └── packages.ts      # gói cước FPT (dùng chung mọi tỉnh)
│   ├── components/          # Header, Hero, Benefits, Packages, ComboTV,
│   │                        # Process, Coverage, FAQ, CTA, Footer,
│   │                        # FloatingContact, SEOHead
│   ├── layouts/
│   │   └── ProvinceLayout.astro   # bọc tất cả section + inject province + SEO
│   └── pages/
│       ├── index.astro      # redirect → default province
│       └── [province].astro # sinh /haiphong, /danang... từ config
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-default.svg        # ảnh share mặc định
├── astro.config.mjs          # SITE_URL + sitemap integration
├── package.json
└── README.md                 # runbook đổi/ thêm tỉnh
```

### 5.2 Schema province config
```ts
// src/config/provinces.ts
export const provinces = {
  haiphong: {
    active: true,
    name: 'Hải Phòng',
    region: 'Đồng bằng sông Hồng',
    districts: ['Hồng Bàng','Lê Chân','Ngô Quyền','Hải An','Kiến An',
                'Đồ Sơn','Dương Kinh','Thủy Nguyên','An Dương','An Lão',
                'Kiến Thụy','Tiên Lãng','Vĩnh Bảo','Cát Hải','Bạch Long Vĩ'],
    metaTitle: 'Lắp mạng FPT tại Hải Phòng — Wi-Fi 6 miễn phí, lắp trong ngày | 0931.50.55.56',
    metaDescription: 'Đăng ký lắp mạng FPT tại Hải Phòng: modem Wi-Fi 6 miễn phí, lắp đặt nhanh trong ngày, hỗ trợ 24/7. Gọi ngay 0931.50.55.56 nhận ưu đãi.',
    heroHeadline: 'Lắp mạng FPT tại Hải Phòng',
    intro: '...',  // đoạn giới thiệu riêng, NỘI DUNG UNIQUE theo tỉnh (quan trọng cho SEO)
    phone: '0931505556',      // mặc định lấy từ site.ts, có thể override/tỉnh
    zalo: 'https://zalo.me/0931505556',
  },
  // danang: { active:false, ... }  ← thêm 1 block là có trang mới
}
```

### 5.3 Runbook đổi/ thêm tỉnh (chi tiết tại README.md)
- **Thêm tỉnh:** thêm 1 block vào `provinces.ts` → `npm run build` → trang + sitemap tự sinh.
- **Đổi tỉnh mặc định:** sửa `defaultProvince` trong `site.ts`.
- **Bỏ hẳn 1 tỉnh (Kịch bản B):** set `active:false` + cấu hình **301 redirect** `/tinhcu/` → `/tinhmoi/` (chuyển link equity, không mất điểm SEO).
- **Mở rộng (Kịch bản A — khuyến nghị):** giữ tỉnh cũ active, thêm tỉnh mới, **liên kết chéo** giữa các tỉnh → truyền uy tín lẫn nhau.

## 6. Cấu trúc trang (10 sections)

Tất cả section nhận dữ liệu province từ layout → render HTML tĩnh.

1. **Header** — Brand "Mạng FPT" + Hotline (click-to-call) + nút Zalo.
2. **Hero** — H1 chứa từ khóa chính (`{heroHeadline}`) + cam kết (Wi-Fi 6 miễn phí, lắp trong ngày) + 2 nút CTA lớn: **GỌI NGAY** + **CHAT ZALO**.
3. **Lợi ích** — 4–6 điểm: lắp nhanh trong ngày, modem Wi-Fi 6 miễn phí, hỗ trợ 24/7, giá ưu đãi, kỹ thuật tận nhà, ưu đãi đăng ký online.
4. **Gói cước Internet cá nhân** — GIGA / SKY / META / F-GAME / AN TÂM: giá + tính năng + nút "Đăng ký" (mỗi gói).
5. **Combo Internet + Truyền hình FPT Play** — Combo GIGA / SKY / META / F-GAME / AN TÂM.
6. **Quy trình đăng ký** — 4 bước: Gọi → Khảo sát → Lắp đặt → Hỗ trợ.
7. **Khu vực phủ sóng** — liệt kê đầy đủ quận/huyện của tỉnh (từ config) — **local SEO quan trọng**.
8. **FAQ** — 6–8 câu hỏi thường gặp + **schema FAQPage** (cơ hội Featured Snippet).
9. **CTA cuối** — hotline + Zalo + form đăng ký nhẹ (tên + SĐT → mở Zalo/tel, không cần backend).
10. **Footer** — liên hệ, bản quyền, internal link các tỉnh.

**Component nổi:** `FloatingContact` — nút Zalo trượt + thanh Call/Zalo dính (sticky) trên mobile, luôn hiện khi cuộn.

## 7. Chiến lược SEO

### 7.1 Từ khóa
- **Chính:** `lắp mạng FPT {tỉnh}`, `internet FPT {tỉnh}`, `đăng ký mạng FPT {tỉnh}`.
- **Phụ:** `lắp wifi FPT {tỉnh}`, `combo FPT Play {tỉnh}`, `FPT Telecom {tỉnh}`, `mạng FPT {quận}`.
- Tự nhiên trong H1/H2/H3, văn bản gốc ~1500–2000 từ/trang, **không nhồi nhét**.

### 7.2 On-page
- `<title>` ≤60 ký tự (chứa từ khóa chính + SĐT), meta description ≤155 ký tự.
- Thẻ H phân cấp chuẩn (1 H1, nhiều H2/H3).
- Open Graph + Twitter Card (đẹp khi share Facebook/Zalo).
- `lang="vi"`, canonical từng trang, alt text đầy đủ.

### 7.3 Kỹ thuật
- `sitemap.xml` (auto, liệt kê tỉnh active) + `robots.txt`.
- HTML ngữ nghĩa (semantic), mobile-first responsive.
- Ảnh SVG/WebP tối ưu, lazy-load ảnh dưới fold.
- Core Web Vitals: LCP <1s, CLS ~0 (mục tiêu điểm 90+).

### 7.4 Schema.org (JSON-LD)
- `LocalBusiness` (doanh nghiệp địa phương, kèm areaServed = tỉnh).
- `Service` (dịch vụ lắp mạng FPT).
- `FAQPage` (FAQ).
- `BreadcrumbList`.
- `Organization`.

### 7.5 Local SEO
- Liệt kê **đầy đủ quận/huyện/phường lớn** của tỉnh (từ config → tự render).
- **Khuyến nghị ngoài website (note trong README):** tạo **Google Business Profile** cho từng tỉnh — đây là kênh #1 cho local SEO, mình sẽ hướng dẫn riêng.

## 8. Thông tin liên hệ (xuất hiện 6 vị trí)
- Header hotline, Hero CTA, nút mỗi gói cước, CTA cuối, FloatingContact, Footer.
- Gọi: `tel:0931505556` → hiển thị **0931.50.55.56**.
- Zalo: `https://zalo.me/0931505556`.
- Form đăng ký: nhập tên + SĐT → nút gửi mở Zalo/tel (không backend, không lộ dữ liệu).

## 9. Phong cách thiết kế
- **Màu FPT:** cam `#ED7D31` + navy `#0B2C5D` + trắng/trắng xám nền. Gắn thương hiệu FPT → tăng tin tưởng.
- Hiện đại, sạch, bo góc, đổ bóng nhẹ, spacing thoáng.
- **Mobile-first** (đa số tìm "lắp mạng" bằng điện thoại).
- **Icon & đồ họa:** inline SVG + CSS gradient (không ảnh ngoài → nhanh, sạch bản quyền). Chừa placeholder để user thêm ảnh thật (thợ lắp, router thật) sau — ảnh thật tăng trust + SEO.

## 10. Hiệu năng
- Xuất HTML tĩnh, CSS gộp/min, JS tối thiểu (chỉ tương tác nhỏ: menu mobile, accordion FAQ, sticky).
- Font hệ thống hoặc 1 web-font self-host tối thiểu.
- Ảnh SVG inline; ảnh thật (nếu có) WebP + lazy load + kích thước cố định (chống CLS).

## 11. Giá cước (cần verify)
- User chọn **hiện giá chính xác**. Mình sẽ **tra giá niêm yết mới nhất của FPT** trong giai đoạn implement và điền.
- Giá có thể thay đổi theo khuyến mãi → đánh dấu `// VERIFY` trong `packages.ts`; README nhắc user xác nhận lại trước launch.

## 12. Deploy
- Output tĩnh (`dist/`) deploy lên: Vercel / Netlify / hosting tĩnh / Cloudflare Pages.
- Cấu hình 301 redirect ở tầng hosting/edge (hoặc Astro middleware) cho Kịch bản B.

## 13. Ngoài phạm vi (sau này)
- Trang phụ: bảng giá riêng, giới thiệu, blog tin tức (giúp SEO dài hạn).
- Google Business Profile, Google Search Console, Analytics.
- A/B test CTA.
- Đánh giá khách hàng (review schema).

## 14. Quyết định đã chốt (2026-07-20)
1. **Giá cước:** mình tự tra giá niêm yết mới nhất của FPT và điền; user xác nhận lại trước launch. Đánh dấu `// VERIFY` trong `packages.ts`.
2. **Đánh giá khách hàng:** **KHÔNG** thêm ở phase này (chưa có review thật → đặt bừa phản tác dụng). Để phase sau khi đã có review thật + schema Review.
3. **Banner khuyến mãi đếm ngược:** **KHÔNG** (tránh cảm giác "ép", giữ tone tin tưởng).
4. **Git:** có khởi tạo repo tại `LP2/` để quản lý phiên bản.

---

**Bước tiếp theo:** sau khi user duyệt spec này → invoke skill `superpowers:writing-plans` để lập kế hoạch implement chi tiết.
