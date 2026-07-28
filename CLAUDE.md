# CLAUDE.md — Mạng FPT Landing (LP2)

Bản hướng dẫn nhanh cho Claude Code trên **bất kỳ máy nào**. Runbook đầy đủ xem `README.md`.

## Dự án là gì
Landing page tạo **lead** cho đăng ký internet FPT (+ combo FPT Play), theo mô hình **SEO địa phương từng tỉnh**. Mục tiêu: xếp hạng từ khóa *"lắp mạng FPT tại [tỉnh]"*, chuyển đổi qua **gọi điện / Zalo**. Site tĩnh **Astro** (KHÔNG phải Next.js/React).

## Kiến trúc & nguồn dữ liệu (single source of truth)
- `src/config/provinces.ts` — dữ liệu từng tỉnh. **Thêm tỉnh = copy block + `active:true`** (xem README "Đổi/thêm tỉnh", Kịch bản A/B).
- `src/config/site.ts` — brand, SĐT `0931505556`, Zalo, `siteUrl`, `defaultProvince: 'haiphong'`.
- `src/data/packages.ts` — gói cước + giá. **Mỗi giá có cờ `// VERIFY`** → phải đối chiếu giá FPT chính thức trước launch.
- `src/data/faq.ts` — FAQ theo tỉnh (hiển thị + schema).
- `src/lib/seo.ts` — meta + 5 JSON-LD (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList).
- `src/pages/[province].astro` — sinh 1 trang/province; `index.astro` redirect 301 → tỉnh mặc định.
- Thứ tự section (phễu): Header → Hero → Benefits → Packages → ComboTV → Process → Coverage → FAQ → CTA → Footer → FloatingContact.

## Lệnh
- `npm run dev` (4321) · `build` (xuất `dist/`) · `test` (vitest) · `check` (astro check)
- `npm run verify` — build + `scripts/verify.mjs` kiểm tra nội dung/SEO/giá. **Luôn chạy trước khi xong task.**

## Quy ước quan trọng
- **Form đăng ký trong CTASection KHÔNG có backend** — nó ghép tên+SĐT rồi mở Zalo với lời nhắn sẵn (`window.open`). Đừng thêm API/fetch mà không hỏi user.
- **Chưa có province switcher** trong Header → user đến tỉnh khác chỉ qua URL.
- **Ảnh OG đang là `.svg`** (FB/Zalo không render SVG) — cần đổi PNG/JPG 1200×630 trước khi launch.
- Mới **1 tỉnh active** (Hải Phòng); Đà Nẵng chỉ là ví dụ comment.
- Màu thương hiệu: navy + cam FPT (`--orange` ≈ #ed7d31).

## Trạng thái (2026-07-27)
Công việc chính đã commit (HEAD `89b721a` — "province-aware FAQ, dedupe literals"). **Chưa có task kế tiếp cụ thể — hỏi user ưu tiên** (launch readiness / mở rộng đa tỉnh / tăng chuyển đổi / sâu SEO).

## Lưu ý môi trường
Dự án nằm trong OneDrive và **chưa có git remote** — phụ thuộc OneDrive để đồng bộ. Cảnh giác: không sửa đồng thời 2 máy; nên push lên git remote (GitHub) làm nguồn sự thật, và tránh để OneDrive sync lỗi thư mục `.git`.
