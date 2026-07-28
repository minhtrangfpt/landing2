# Mạng FPT — Landing Page đa tỉnh

Landing page bán internet FPT, tối ưu SEO, **đổi/thêm tỉnh chỉ sửa 1 file config**.

## Yêu cầu
- Node.js 18+

## Chạy dự án
```bash
npm install
npm run dev      # phát triển: http://localhost:4321
npm run build    # xuất HTML tĩnh vào dist/
npm run preview  # xem bản build
npm test         # chạy unit tests (vitest)
npm run verify   # build + kiểm tra nội dung/SEO
```

## Đổi/ thêm tỉnh (single source of truth)

Mọi dữ liệu tỉnh nằm trong `src/config/provinces.ts`.

### Thêm một tỉnh mới (Kịch bản A — mở rộng, KHÔNG mất SEO)
1. Mở `src/config/provinces.ts`, copy block `haiphong` và đổi: `slug`, `name`, `region`, `districts`, `metaTitle`, `metaDescription`, `heroHeadline`, `intro`. Đặt `active: true`.
2. (Tuỳ chọn) đổi `defaultProvince` trong `src/config/site.ts` nếu muốn trang `/` trỏ sang tỉnh mới.
3. `npm run build`. Trang `/tinh-moi/` và sitemap tự sinh. Trang tỉnh cũ vẫn giữ nguyên → xếp hạng không đổi.

### Rời bỏ hẳn một tỉnh (Kịch bản B — chuyển điểm SEO)
1. Trong `src/config/provinces.ts`, đặt `active: false` cho tỉnh cũ.
2. Thêm redirect 301 trong hosting (Vercel/Netlify: file config redirect; Cloudflare/Nginx: rewrite rule) từ `/tinh-cu/` → `/tinh-moi/`. 301 chuyển toàn bộ "link equity" → không mất điểm SEO.
3. `npm run build`.

### Đổi tên miền
Đổi `siteUrl` trong `src/config/site.ts` (nguồn sự thật duy nhất). Toàn bộ canonical / sitemap / robots.txt / schema tự cập nhật.

## Cập nhật giá cước
Sửa `src/data/packages.ts` (mỗi giá có cờ `// VERIFY`). Sau khi đổi, chạy `npm run verify`.

## Cấu trúc chính
- `src/config/site.ts` — thương hiệu, SĐT, Zalo, domain, tỉnh mặc định.
- `src/config/provinces.ts` — dữ liệu từng tỉnh (single source of truth).
- `src/data/packages.ts` — gói cước FPT + giá.
- `src/data/faq.ts` — câu hỏi thường gặp (hiển thị + schema).
- `src/lib/seo.ts` — meta + JSON-LD schema.
- `src/components/` — các section của trang.

## SEO đã tích hợp
- `<title>`/meta description tối ưu theo tỉnh, canonical, Open Graph + Twitter card.
- JSON-LD: `Organization`, `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`.
- `sitemap-index.xml` + `robots.txt`.
- Local SEO: liệt kê đầy đủ quận/huyện từng tỉnh.

## Khuyến nghị ngoài website
- Tạo **Google Business Profile** cho từng tỉnh (kênh local SEO #1).
- Submit sitemap tại **Google Search Console** sau khi trỏ domain.
