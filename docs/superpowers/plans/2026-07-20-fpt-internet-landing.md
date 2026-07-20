# FPT Internet Landing Page (Multi-Province) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an SEO-optimized, multi-province landing page that sells FPT internet packages, starting with Hải Phòng, where switching/adding a province is a one-config-file change that preserves SEO.

**Architecture:** Astro static site. One `[province].astro` route generates a landing page per active province from a single `provinces.ts` config. Pure logic (config, SEO builders, formatting) lives in `.ts` modules with Vitest unit tests; presentational `.astro` components are verified by `astro build` + a content-assertion script. Output is static HTML/CSS/minimal JS deployable anywhere.

**Tech Stack:** Astro 5, `@astrojs/sitemap`, TypeScript, Vitest, vanilla JS for micro-interactions (mobile menu, FAQ accordion, form).

## Global Constraints

Copied verbatim from the spec — every task implicitly inherits these:

- **Phone:** display `0931.50.55.56`, raw link `tel:0931505556`
- **Zalo:** `https://zalo.me/0931505556`
- **Brand colors:** orange `#ED7D31`, navy `#0B2C5D`; neutrals white/`#f5f7fa`/`#5a6478`
- **Language:** `lang="vi"` on `<html>`; all copy in Vietnamese
- **Site URL (placeholder):** `https://mangfpt.vn` — change in `site.ts` only after the user registers the domain
- **Default province:** `haiphong`
- **Copyright rule:** NO text or images copied from ftel.net.vn. Use only public product facts (package names, speeds, prices). All marketing copy and visuals are original.
- **Prices:** researched 2026-07 from public reseller listings; flag every price with `// VERIFY` and confirm against official FPT rates before launch.
- **Output:** static HTML, near-zero client JS, mobile-first responsive.

---

## File Structure

```
LP2/
├── astro.config.mjs              # site URL + sitemap
├── package.json                  # scripts + deps
├── tsconfig.json                 # astro strict
├── README.md                     # province-switching runbook
├── scripts/
│   └── verify.mjs                # post-build content/SEO assertions
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── og-default.svg
└── src/
    ├── config/
    │   ├── site.ts               # brand, phone, zalo, siteUrl, defaultProvince
    │   └── provinces.ts          # province data + helpers (single source of truth)
    ├── data/
    │   ├── packages.ts           # FPT packages (internet + combo)
    │   └── faq.ts                # FAQ items (rendered + schema)
    ├── lib/
    │   ├── format.ts             # formatVnd, formatVndK
    │   └── seo.ts                # title/meta/schema builders (pure)
    ├── styles/
    │   └── global.css            # tokens, reset, base, shared utilities
    ├── layouts/
    │   └── ProvinceLayout.astro  # <html>/<head> via SEOHead + <slot>
    ├── components/
    │   ├── SEOHead.astro         # all meta + JSON-LD
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── Benefits.astro
    │   ├── Process.astro
    │   ├── Coverage.astro
    │   ├── Packages.astro
    │   ├── ComboTV.astro
    │   ├── FAQ.astro
    │   ├── CTASection.astro
    │   ├── Footer.astro
    │   └── FloatingContact.astro
    └── pages/
        ├── index.astro           # redirect → default province
        └── [province].astro      # generates one page per active province
```

---

## Task 1: Scaffold Astro project + tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/styles/global.css` (empty stub), `README.md` (stub), `src/env.d.ts`

**Interfaces:**
- Produces: a buildable Astro project; `npm run build`, `npm test`, `npm run check` all runnable.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "fpt-internet-landing",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "verify": "astro build && node scripts/verify.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// VERIFY: change to the real registered domain before launch.
const SITE = 'https://mangfpt.vn';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: { format: 'directory' },
});
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 5: Create empty `src/styles/global.css`** with one comment so the file is non-empty:

```css
/* Global styles — populated in Task 7 */
```

- [ ] **Step 6: Create `README.md` stub**

```markdown
# Mạng FPT — Landing Page đa tỉnh

Landing page bán internet FPT, tối ưu SEO, hỗ trợ đổi/thêm tỉnh.

Chi tiết chạy dự án & cách đổi tỉnh xem ở cuối (Task 17 cập nhật đầy đủ).
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: installs astro, sitemap, check, typescript, vitest without fatal errors.

- [ ] **Step 8: Verify build & test harness run**

Run: `npx astro build`
Expected: succeeds, outputs `dist/` (may be near-empty; no pages yet — that's fine).

Run: `npx vitest run`
Expected: "No test files found" / 0 tests, exit 0.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold astro project with sitemap and vitest"
```

---

## Task 2: Site config + currency formatting

**Files:**
- Create: `src/config/site.ts`, `src/lib/format.ts`, `tests/format.test.ts`

**Interfaces:**
- Produces: `site` object (fields: `brand`, `siteUrl`, `phoneDisplay`, `phoneRaw`, `zalo`, `defaultProvince`); `formatVnd(n): string`, `formatVndK(n): string`.

- [ ] **Step 1: Write the failing test `tests/format.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { formatVnd, formatVndK } from '../src/lib/format';

describe('formatVnd', () => {
  it('formats thousands with vi-VN grouping + đ', () => {
    expect(formatVnd(220000)).toBe('220.000đ');
    expect(formatVnd(1450000)).toBe('1.450.000đ');
  });
  it('handles zero', () => {
    expect(formatVnd(0)).toBe('0đ');
  });
});

describe('formatVndK', () => {
  it('returns k shorthand for exact thousands', () => {
    expect(formatVndK(220000)).toBe('220k');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/format.test.ts`
Expected: FAIL — cannot resolve `../src/lib/format`.

- [ ] **Step 3: Create `src/config/site.ts`**

```ts
export const site = {
  brand: 'Mạng FPT',
  /** VERIFY: set to the real registered domain before launch. */
  siteUrl: 'https://mangfpt.vn',
  phoneDisplay: '0931.50.55.56',
  phoneRaw: '0931505556',
  zalo: 'https://zalo.me/0931505556',
  defaultProvince: 'haiphong',
} as const;
```

- [ ] **Step 4: Create `src/lib/format.ts`**

```ts
export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function formatVndK(amount: number): string {
  if (amount % 1000 !== 0) return formatVnd(amount);
  return `${amount / 1000}k`;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/format.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/config/site.ts src/lib/format.ts tests/format.test.ts
git commit -m "feat: add site config and vnd formatting helpers"
```

---

## Task 3: FPT packages data

**Files:**
- Create: `src/data/packages.ts`, `tests/packages.test.ts`

**Interfaces:**
- Produces: type `PackageCategory = 'internet' | 'combo'`; interface `FptPackage`; array `packages`; `getPackagesByCategory(category): FptPackage[]`.

- [ ] **Step 1: Write the failing test `tests/packages.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { packages, getPackagesByCategory } from '../src/data/packages';

describe('packages', () => {
  it('includes the 5 personal internet tiers', () => {
    const internet = getPackagesByCategory('internet');
    const names = internet.map((p) => p.id);
    expect(names).toEqual(expect.arrayContaining(['giga', 'sky', 'meta', 'fgame', 'antam']));
    expect(internet.length).toBeGreaterThanOrEqual(5);
  });
  it('includes combo packages', () => {
    const combos = getPackagesByCategory('combo');
    expect(combos.length).toBeGreaterThanOrEqual(3);
  });
  it('every package has name, priceMonthly > 0, and at least 2 features', () => {
    for (const p of packages) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.priceMonthly).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThanOrEqual(2);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/packages.test.ts`
Expected: FAIL — cannot resolve `../src/data/packages`.

- [ ] **Step 3: Create `src/data/packages.ts`**

Prices researched 2026-07 from public FPT reseller listings; VERIFY before launch.

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/packages.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/packages.ts tests/packages.test.ts
git commit -m "feat: add FPT package catalog with researched prices"
```

---

## Task 4: Province config + helpers (single source of truth)

**Files:**
- Create: `src/config/provinces.ts`, `tests/provinces.test.ts`

**Interfaces:**
- Produces: interface `Province`; record `provinces`; `getProvince(slug): Province` (throws if missing), `getActiveProvinces(): Province[]`, `getProvinceSlugs(): string[]`, `getDefaultProvince(): Province`.

- [ ] **Step 1: Write the failing test `tests/provinces.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import {
  provinces,
  getProvince,
  getActiveProvinces,
  getProvinceSlugs,
  getDefaultProvince,
} from '../src/config/provinces';

describe('province config', () => {
  it('has Hải Phòng active by default', () => {
    expect(provinces.haiphong.active).toBe(true);
  });
  it('returns province by slug', () => {
    expect(getProvince('haiphong').name).toBe('Hải Phòng');
  });
  it('throws on unknown slug', () => {
    expect(() => getProvince('mars')).toThrow();
  });
  it('lists only active provinces', () => {
    const slugs = getProvinceSlugs();
    expect(slugs).toContain('haiphong');
    expect(getActiveProvinces().length).toBe(slugs.length);
  });
  it('default province is Hải Phòng', () => {
    expect(getDefaultProvince().slug).toBe('haiphong');
  });
  it('Hải Phòng lists districts including Lê Chân', () => {
    expect(provinces.haiphong.districts).toContain('Lê Chân');
    expect(provinces.haiphong.districts.length).toBeGreaterThanOrEqual(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/provinces.test.ts`
Expected: FAIL — cannot resolve `../src/config/provinces`.

- [ ] **Step 3: Create `src/config/provinces.ts`**

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/provinces.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/config/provinces.ts tests/provinces.test.ts
git commit -m "feat: add province config as single source of truth"
```

---

## Task 5: FAQ data

**Files:**
- Create: `src/data/faq.ts`, `tests/faq.test.ts`

**Interfaces:**
- Produces: interface `FaqItem`; array `faqs` (used by both `FAQ.astro` and the FAQPage schema in Task 6).

- [ ] **Step 1: Write the failing test `tests/faq.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { faqs } from '../src/data/faq';

describe('faqs', () => {
  it('has 6-10 items', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(6);
    expect(faqs.length).toBeLessThanOrEqual(10);
  });
  it('every item has a question and a non-empty answer', () => {
    for (const f of faqs) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/faq.test.ts`
Expected: FAIL — cannot resolve `../src/data/faq`.

- [ ] **Step 3: Create `src/data/faq.ts`**

```ts
export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'Lắp mạng FPT tại Hải Phòng mất bao lâu?',
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
    q: 'Khu vực nào tại Hải Phòng được lắp đặt?',
    a: 'Chúng tôi lắp mạng FPT trên toàn bộ Hải Phòng: các quận nội thành Hồng Bàng, Lê Chân, Ngô Quyền, Hải An, Kiến An, Đồ Sơn, Dương Kinh và các huyện Thủy Nguyên, An Dương, An Lão, Kiến Thụy, Tiên Lãng, Vĩnh Bảo, Cát Hải, Bạch Long Vĩ.',
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/faq.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/faq.ts tests/faq.test.ts
git commit -m "feat: add FAQ dataset"
```

---

## Task 6: SEO builders (title, meta, schema)

**Files:**
- Create: `src/lib/seo.ts`, `tests/seo.test.ts`

**Interfaces:**
- Consumes: `Province` from `src/config/provinces.ts`, `faqs` from `src/data/faq.ts`, `site` from `src/config/site.ts`.
- Produces: `canonicalUrl(province)`, `localBusinessSchema(province)`, `serviceSchema(province)`, `faqSchema()`, `breadcrumbSchema(province)`, `organizationSchema()`.

- [ ] **Step 1: Write the failing test `tests/seo.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { getProvince } from '../src/config/provinces';
import {
  canonicalUrl,
  localBusinessSchema,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
  organizationSchema,
} from '../src/lib/seo';

const hp = getProvince('haiphong');

describe('seo builders', () => {
  it('canonical ends with /haiphong/', () => {
    expect(canonicalUrl(hp)).toBe('https://mangfpt.vn/haiphong/');
  });
  it('LocalBusiness has name, telephone, areaServed', () => {
    const s = localBusinessSchema(hp);
    expect(s['@type']).toBe('LocalBusiness');
    expect(s.telephone).toBe('0931505556');
    expect(s.areaServed).toBe('Hải Phòng');
    expect(s.url).toBe(canonicalUrl(hp));
  });
  it('Service mentions FPT and the province', () => {
    const s = serviceSchema(hp);
    expect(s['@type']).toBe('Service');
    expect(JSON.stringify(s)).toContain('Hải Phòng');
    expect(JSON.stringify(s)).toContain('FPT');
  });
  it('faqSchema is FAQPage with matching item count', () => {
    const s = faqSchema();
    expect(s['@type']).toBe('FAQPage');
    expect(s.mainEntity.length).toBeGreaterThan(0);
  });
  it('breadcrumb includes province as last item', () => {
    const s = breadcrumbSchema(hp);
    expect(s['@type']).toBe('BreadcrumbList');
    const last = s.itemListElement[s.itemListElement.length - 1];
    expect(JSON.stringify(last)).toContain('Hải Phòng');
  });
  it('organizationSchema is Organization with brand', () => {
    const s = organizationSchema();
    expect(s['@type']).toBe('Organization');
    expect(s.name).toBe('Mạng FPT');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/seo.test.ts`
Expected: FAIL — cannot resolve `../src/lib/seo`.

- [ ] **Step 3: Create `src/lib/seo.ts`**

```ts
import { site } from '../config/site';
import type { Province } from '../config/provinces';
import { faqs } from '../data/faq';

export function canonicalUrl(province: Province): string {
  return `${site.siteUrl}/${province.slug}/`;
}

export function localBusinessSchema(province: Province) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${site.brand} ${province.name}`,
    description: province.metaDescription,
    telephone: site.phoneRaw,
    url: canonicalUrl(province),
    areaServed: province.name,
    address: {
      '@type': 'PostalAddress',
      addressRegion: province.name,
      addressCountry: 'VN',
    },
  };
}

export function serviceSchema(province: Province) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Lắp mạng FPT tại ${province.name}`,
    provider: {
      '@type': 'LocalBusiness',
      name: `${site.brand} ${province.name}`,
      telephone: site.phoneRaw,
      areaServed: province.name,
    },
    areaServed: province.name,
    description: `Đăng ký, lắp đặt internet FPT và combo truyền hình FPT Play tại ${province.name}. Miễn phí modem Wi-Fi 6, lắp trong ngày, hỗ trợ 24/7.`,
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(province: Province) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: site.siteUrl + '/' },
      { '@type': 'ListItem', position: 2, name: province.name, item: canonicalUrl(province) },
    ],
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brand,
    url: site.siteUrl + '/',
    telephone: site.phoneRaw,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phoneRaw,
      contactType: 'sales',
      availableLanguage: ['Vietnamese'],
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/seo.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts tests/seo.test.ts
git commit -m "feat: add SEO title/meta and JSON-LD schema builders"
```

---

## Task 7: Global styles + design tokens

**Files:**
- Modify: `src/styles/global.css` (replace stub)

**Interfaces:**
- Produces: CSS custom properties (brand colors, spacing, radius, shadows), reset, base typography, shared utilities (`.container`, `.btn`, `.btn--call`, `.btn--zalo`, `.section`).

- [ ] **Step 1: Replace `src/styles/global.css` with the full stylesheet**

```css
/* ---------- Design tokens ---------- */
:root {
  --orange: #ed7d31;
  --orange-dark: #d56a23;
  --navy: #0b2c5d;
  --navy-light: #1a4a8a;
  --ink: #14202e;
  --muted: #5a6478;
  --bg: #ffffff;
  --bg-soft: #f5f7fa;
  --line: #e3e8ef;
  --white: #ffffff;
  --radius: 14px;
  --radius-sm: 10px;
  --shadow: 0 6px 24px rgba(11, 44, 93, 0.08);
  --shadow-lg: 0 14px 40px rgba(11, 44, 93, 0.14);
  --container: 1140px;
  --font: 'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* ---------- Reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font);
  color: var(--ink);
  background: var(--bg);
  line-height: 1.6;
  font-size: 16px;
}
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; padding: 0; }
h1, h2, h3 { line-height: 1.25; color: var(--navy); font-weight: 800; }
h1 { font-size: clamp(1.9rem, 5vw, 3rem); }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.1rem); }
h3 { font-size: 1.2rem; }

/* ---------- Layout ---------- */
.container { width: 100%; max-width: var(--container); margin: 0 auto; padding: 0 20px; }
.section { padding: 64px 0; }
.section--soft { background: var(--bg-soft); }
.section__head { text-align: center; max-width: 720px; margin: 0 auto 40px; }
.section__head p { color: var(--muted); margin-top: 10px; }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-weight: 700; padding: 14px 24px; border-radius: 999px;
  cursor: pointer; border: 2px solid transparent; transition: transform .15s ease, box-shadow .15s ease;
  font-size: 1rem;
}
.btn:hover { transform: translateY(-2px); }
.btn--call { background: var(--orange); color: var(--white); box-shadow: var(--shadow); }
.btn--call:hover { background: var(--orange-dark); }
.btn--zalo { background: var(--white); color: var(--navy); border-color: var(--navy); }
.btn--zalo:hover { background: var(--navy); color: var(--white); }
.btn--lg { padding: 16px 30px; font-size: 1.05rem; }

/* ---------- Badge ---------- */
.badge {
  display: inline-block; font-size: .72rem; font-weight: 800; letter-spacing: .03em;
  padding: 4px 10px; border-radius: 999px; background: var(--orange); color: var(--white);
}

/* ---------- Card ---------- */
.card { background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }

/* ---------- Utility ---------- */
.text-center { text-align: center; }
.visually-hidden {
  position: absolute !important; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
@media (max-width: 720px) {
  .section { padding: 44px 0; }
}
```

- [ ] **Step 2: Verify the project still builds**

Run: `npx astro check && npx astro build`
Expected: succeeds, no type/style errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global styles and design tokens"
```

---

## Task 8: SEOHead + ProvinceLayout + minimal province page

**Files:**
- Create: `src/components/SEOHead.astro`, `src/layouts/ProvinceLayout.astro`, `src/pages/[province].astro`
- Interfaces produced: `ProvinceLayout` accepts a `province` prop and a default `<slot />`.

- [ ] **Step 1: Create `src/components/SEOHead.astro`**

```astro
---
import type { Province } from '../config/provinces';
import { site } from '../config/site';
import {
  canonicalUrl,
  localBusinessSchema,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
  organizationSchema,
} from '../lib/seo';

interface Props { province: Province; }
const { province } = Astro.props;
const canonical = canonicalUrl(province);
const ogImage = `${site.siteUrl}/og-default.svg`;
const schemas = [
  organizationSchema(),
  localBusinessSchema(province),
  serviceSchema(province),
  faqSchema(),
  breadcrumbSchema(province),
];
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{province.metaTitle}</title>
<meta name="description" content={province.metaDescription} />
<link rel="canonical" href={canonical} />
<meta name="robots" content="index, follow, max-image-preview:large" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:locale" content="vi_VN" />
<meta property="og:site_name" content={site.brand} />
<meta property="og:title" content={province.metaTitle} />
<meta property="og:description" content={province.metaDescription} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={ogImage} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={province.metaTitle} />
<meta name="twitter:description" content={province.metaDescription} />
<meta name="twitter:image" content={ogImage} />

<meta name="theme-color" content="#ed7d31" />
{
  schemas.map((schema) => (
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  ))
}
```

- [ ] **Step 2: Create `src/layouts/ProvinceLayout.astro`**

```astro
---
import '../styles/global.css';
import SEOHead from '../components/SEOHead.astro';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
---
<!doctype html>
<html lang="vi">
  <head>
    <SEOHead province={province} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Create `src/pages/[province].astro`** (minimal body; components added in later tasks)

```astro
---
import ProvinceLayout from '../layouts/ProvinceLayout.astro';
import { getActiveProvinces } from '../config/provinces';

export function getStaticPaths() {
  return getActiveProvinces().map((p) => ({
    params: { province: p.slug },
    props: { province: p },
  }));
}
const { province } = Astro.props;
---
<ProvinceLayout province={province}>
  <main class="container section">
    <p>Components go here.</p>
  </main>
</ProvinceLayout>
```

- [ ] **Step 4: Build and verify the province page + SEO output**

Run: `npx astro build`
Expected: outputs `dist/haiphong/index.html`.

Run: `grep -c "Lắp mạng FPT tại Hải Phòng" dist/haiphong/index.html`
Expected: prints a number ≥ 1 (title + OG + schema contain it).

Run: `grep -o '"@type":"LocalBusiness"' dist/haiphong/index.html`
Expected: prints `"@type":"LocalBusiness"`.

- [ ] **Step 5: Commit**

```bash
git add src/components/SEOHead.astro src/layouts/ProvinceLayout.astro src/pages/[province].astro
git commit -m "feat: add SEOHead, province layout, and dynamic province route"
```

---

## Task 9: Header component

**Files:**
- Create: `src/components/Header.astro`
- Modify: `src/pages/[province].astro` (add `<Header />`)

**Interfaces:**
- Consumes: `site` from `src/config/site.ts`, `province.name`.

- [ ] **Step 1: Create `src/components/Header.astro`**

```astro
---
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
---
<header class="hdr">
  <div class="container hdr__row">
    <a href="/" class="hdr__brand" aria-label={`${site.brand} ${province.name}`}>
      <span class="hdr__logo">FPT</span>
      <span class="hdr__brandtext">{site.brand} {province.name}</span>
    </a>
    <div class="hdr__cta">
      <a class="btn btn--zalo" href={site.zalo} target="_blank" rel="noopener">Chat Zalo</a>
      <a class="btn btn--call" href={`tel:${site.phoneRaw}`}>Gọi {site.phoneDisplay}</a>
    </div>
  </div>
</header>

<style>
.hdr { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.hdr__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 20px; }
.hdr__brand { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--navy); }
.hdr__logo { background: var(--orange); color: #fff; padding: 6px 10px; border-radius: 8px; font-weight: 900; letter-spacing: .04em; }
.hdr__brandtext { font-size: 1rem; }
.hdr__cta { display: flex; gap: 8px; }
.hdr__cta .btn { padding: 10px 16px; font-size: .92rem; }
@media (max-width: 560px) {
  .hdr__brandtext { display: none; }
  .hdr__cta .btn--zalo { display: none; }
}
</style>
```

- [ ] **Step 2: Add the Header to the page — modify the `<main>` in `src/pages/[province].astro`**

Replace the `<main>...</main>` block with:

```astro
<Header province={province} />
<main class="container section">
  <p>Components go here.</p>
</main>
```

And add the import at the top of the frontmatter:

```ts
import Header from '../components/Header.astro';
```

- [ ] **Step 3: Build and verify the hotline is present**

Run: `npx astro build`
Run: `grep -o "tel:0931505556" dist/haiphong/index.html | head -1`
Expected: prints `tel:0931505556`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/pages/[province].astro
git commit -m "feat: add sticky header with call and zalo CTAs"
```

---

## Task 10: Hero component

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/[province].astro` (add `<Hero />`)

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
const perks = [
  'Miễn phí modem Wi-Fi 6',
  'Lắp đặt nhanh trong ngày',
  'Hỗ trợ kỹ thuật 24/7',
];
---
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__copy">
      <span class="badge">Đăng ký online — ưu đãi tốt nhất</span>
      <h1>{province.heroHeadline}</h1>
      <p class="hero__sub">{province.intro}</p>
      <ul class="hero__perks">
        {perks.map((p) => <li>✓ {p}</li>)}
      </ul>
      <div class="hero__cta">
        <a class="btn btn--call btn--lg" href={`tel:${site.phoneRaw}`}>📞 Gọi ngay {site.phoneDisplay}</a>
        <a class="btn btn--zalo btn--lg" href={site.zalo} target="_blank" rel="noopener">💬 Chat Zalo tư vấn</a>
      </div>
    </div>
    <div class="hero__art" aria-hidden="true">
      <div class="hero__circle">Wi-Fi 6</div>
      <div class="hero__speed">1 Gbps</div>
    </div>
  </div>
</section>

<style>
.hero { background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%); color: #fff; padding: 64px 0; }
.hero__inner { display: grid; grid-template-columns: 1.3fr .7fr; gap: 32px; align-items: center; }
.hero h1 { color: #fff; }
.hero__sub { margin: 16px 0 14px; color: #dfe7f3; max-width: 60ch; }
.hero__perks { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-bottom: 24px; color: #fff; font-weight: 600; }
.hero__cta { display: flex; flex-wrap: wrap; gap: 12px; }
.hero__cta .btn--zalo { background: #fff; color: var(--navy); }
.hero__art { position: relative; height: 240px; display: grid; place-items: center; }
.hero__circle { width: 170px; height: 170px; border-radius: 50%; background: var(--orange); display: grid; place-items: center; font-weight: 900; font-size: 1.6rem; box-shadow: var(--shadow-lg); }
.hero__speed { position: absolute; bottom: 6px; right: 8px; background: #fff; color: var(--navy); font-weight: 800; padding: 8px 14px; border-radius: 999px; box-shadow: var(--shadow); }
@media (max-width: 820px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__art { order: -1; height: 180px; }
  .hero__circle { width: 130px; height: 130px; }
}
</style>
```

- [ ] **Step 2: Add the Hero to `src/pages/[province].astro`**

Add the import: `import Hero from '../components/Hero.astro';`

Replace `<main class="container section"><p>Components go here.</p></main>` with:

```astro
<Hero province={province} />
<main class="container section">
  <p>Components go here.</p>
</main>
```

- [ ] **Step 3: Build and verify the H1 keyword**

Run: `npx astro build`
Run: `grep -o "<h1[^>]*>Lắp mạng FPT tại Hải Phòng</h1>" dist/haiphong/index.html | head -1`
Expected: prints the `<h1>` opening with the keyword. (If Astro wraps attributes differently, fall back to: `grep -o "Lắp mạng FPT tại Hải Phòng" dist/haiphong/index.html | wc -l` ≥ 3.)

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/[province].astro
git commit -m "feat: add hero section with primary keyword and CTAs"
```

---

## Task 11: Benefits + Process + Coverage components

**Files:**
- Create: `src/components/Benefits.astro`, `src/components/Process.astro`, `src/components/Coverage.astro`
- Modify: `src/pages/[province].astro` (replace the placeholder `<main>` with these three sections)

- [ ] **Step 1: Create `src/components/Benefits.astro`**

```astro
---
const benefits = [
  { icon: '⚡', title: 'Lắp nhanh trong ngày', text: 'Tiếp nhận trong vài phút, kỹ thuật đến khảo sát và lắp trong ngày.' },
  { icon: '📶', title: 'Modem Wi-Fi 6 miễn phí', text: 'Trang bị modem Wi-Fi 6 thế hệ mới, sóng khỏe, phủ rộng.' },
  { icon: '🕐', title: 'Hỗ trợ 24/7', text: 'Hotline hỗ trợ kỹ thuật xuyên suốt, xử lý sự cố nhanh chóng.' },
  { icon: '🎁', title: 'Ưu đãi đăng ký online', text: 'Tặng tháng cước, miễn phí lắp đặt cho khách đăng ký mới.' },
  { icon: '🏠', title: 'Thi công tận nhà', text: 'Nhân viên đến tận địa chỉ tư vấn và lắp đặt, không cần ra cửa hàng.' },
  { icon: '🛡️', title: 'Kết nối an toàn', text: 'Gói AN TÂM tích hợp bảo mật F-Safe bảo vệ cả gia đình.' },
];
---
<section class="section section--soft" id="loi-ich" aria-labelledby="benefits-title">
  <div class="container">
    <div class="section__head">
      <h2 id="benefits-title">Vì sao chọn lắp mạng FPT cùng chúng tôi?</h2>
      <p>Quy trình nhanh, chi phí tối ưu, hỗ trợ trọn đời.</p>
    </div>
    <div class="grid">
      {benefits.map((b) => (
        <article class="card benefit">
          <div class="benefit__icon">{b.icon}</div>
          <h3>{b.title}</h3>
          <p>{b.text}</p>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.benefit { padding: 24px; text-align: center; }
.benefit__icon { font-size: 2rem; margin-bottom: 8px; }
.benefit h3 { margin-bottom: 6px; }
.benefit p { color: var(--muted); font-size: .95rem; }
@media (max-width: 820px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 540px) { .grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Create `src/components/Process.astro`**

```astro
---
const steps = [
  { n: 1, title: 'Gọi hotline', text: 'Gọi 0931.50.55.56 hoặc chat Zalo để được tư vấn gói phù hợp.' },
  { n: 2, title: 'Khảo sát & tư vấn', text: 'Kỹ thuật đến tận nhà kiểm tra hạ tầng, tư vấn gói tối ưu.' },
  { n: 3, title: 'Lắp đặt trong ngày', text: 'Thi công nhanh gọn, trang bị modem Wi-Fi 6 miễn phí.' },
  { n: 4, title: 'Hỗ trợ 24/7', text: 'Bảo hành, hỗ trợ kỹ thuật xuyên suốt thời gian sử dụng.' },
];
---
<section class="section" id="quy-trinh" aria-labelledby="process-title">
  <div class="container">
    <div class="section__head">
      <h2 id="process-title">Quy trình đăng ký chỉ 4 bước</h2>
      <p>Nhanh gọn — sử dụng mạng trong ngày.</p>
    </div>
    <ol class="steps">
      {steps.map((s) => (
        <li class="card step">
          <span class="step__n">{s.n}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; counter-reset: step; }
.step { padding: 22px; position: relative; }
.step__n { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--orange); color: #fff; font-weight: 800; margin-bottom: 10px; }
.step h3 { margin-bottom: 6px; }
.step p { color: var(--muted); font-size: .93rem; }
@media (max-width: 820px) { .steps { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .steps { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Create `src/components/Coverage.astro`**

```astro
---
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
---
<section class="section section--soft" id="khu-vuc" aria-labelledby="coverage-title">
  <div class="container">
    <div class="section__head">
      <h2 id="coverage-title">Khu vực lắp mạng FPT tại {province.name}</h2>
      <p>Chúng tôi phục vụ lắp đặt trên toàn bộ các quận/huyện tại {province.name}.</p>
    </div>
    <ul class="districts">
      {province.districts.map((d) => <li class="districts__item">{d}</li>)}
    </ul>
  </div>
</section>

<style>
.districts { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.districts__item { background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; font-weight: 600; color: var(--navy); }
</style>
```

- [ ] **Step 4: Wire the three sections into `src/pages/[province].astro`**

Add imports:
```ts
import Benefits from '../components/Benefits.astro';
import Process from '../components/Process.astro';
import Coverage from '../components/Coverage.astro';
```

Replace the placeholder `<main class="container section"><p>Components go here.</p></main>` with:

```astro
<Benefits />
<Process />
<Coverage />
```

- [ ] **Step 5: Build and verify content**

Run: `npx astro build`
Run: `grep -o "Lê Chân" dist/haiphong/index.html | head -1`
Expected: prints `Lê Chân` (from district list).

- [ ] **Step 6: Commit**

```bash
git add src/components/Benefits.astro src/components/Process.astro src/components/Coverage.astro src/pages/[province].astro
git commit -m "feat: add benefits, process, and coverage sections"
```

---

## Task 12: Packages + ComboTV components

**Files:**
- Create: `src/components/Packages.astro`, `src/components/ComboTV.astro`
- Modify: `src/pages/[province].astro` (insert both sections)

- [ ] **Step 1: Create `src/components/Packages.astro`**

```astro
---
import { getPackagesByCategory } from '../data/packages';
import { formatVnd } from '../lib/format';
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
const internet = getPackagesByCategory('internet');
---
<section class="section" id="goi-cuoc" aria-labelledby="packages-title">
  <div class="container">
    <div class="section__head">
      <h2 id="packages-title">Bảng giá các gói internet FPT tại {province.name}</h2>
      <p>Giá đã bao gồm VAT. Miễn phí modem Wi-Fi 6. <em>(Giá tham khảo, vui lòng xác nhận khi đăng ký.)</em></p>
    </div>
    <div class="pkg-grid">
      {internet.map((p) => (
        <article class:list={['card', 'pkg', { 'pkg--hl': p.highlight }]}>
          {p.badge && <span class="badge pkg__badge">{p.badge}</span>}
          <h3>{p.name}</h3>
          <p class="pkg__tag">{p.tagline}</p>
          {p.speed && <p class="pkg__speed">{p.speed}</p>}
          <div class="pkg__price">
            <span class="pkg__amount">{formatVnd(p.priceMonthly)}</span>
            {p.originalPrice && <span class="pkg__old">{formatVnd(p.originalPrice)}</span>}
            <span class="pkg__unit">/tháng</span>
          </div>
          <ul class="pkg__features">
            {p.features.map((f) => <li>✓ {f}</li>)}
          </ul>
          <a class="btn btn--call pkg__cta" href={`tel:${site.phoneRaw}`}>Đăng ký {p.name}</a>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
.pkg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.pkg { padding: 24px; display: flex; flex-direction: column; position: relative; }
.pkg--hl { border: 2px solid var(--orange); }
.pkg__badge { position: absolute; top: 14px; right: 14px; }
.pkg__tag { color: var(--muted); font-size: .92rem; }
.pkg__speed { font-weight: 700; color: var(--navy-light); margin: 4px 0; }
.pkg__price { margin: 14px 0; }
.pkg__amount { font-size: 1.7rem; font-weight: 900; color: var(--orange); }
.pkg__old { text-decoration: line-through; color: var(--muted); font-size: .9rem; margin-left: 8px; }
.pkg__unit { color: var(--muted); }
.pkg__features { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; flex: 1; }
.pkg__features li { font-size: .93rem; }
.pkg__cta { width: 100%; }
@media (max-width: 900px) { .pkg-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .pkg-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 2: Create `src/components/ComboTV.astro`**

```astro
---
import { getPackagesByCategory } from '../data/packages';
import { formatVnd } from '../lib/format';
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
const combos = getPackagesByCategory('combo');
---
<section class="section section--soft" id="combo" aria-labelledby="combo-title">
  <div class="container">
    <div class="section__head">
      <h2 id="combo-title">Combo Internet + Truyền hình FPT Play tại {province.name}</h2>
      <p>Một gói có cả mạng và TV — tiết kiệm hơn mua lẻ.</p>
    </div>
    <div class="combo-grid">
      {combos.map((c) => (
        <article class:list={['card', 'combo', { 'combo--hl': c.highlight }]}>
          {c.badge && <span class="badge">{c.badge}</span>}
          <h3>{c.name}</h3>
          <p class="combo__tag">{c.tagline}</p>
          <div class="combo__price">
            <span class="combo__amount">{formatVnd(c.priceMonthly)}</span>
            <span class="combo__unit">/tháng</span>
          </div>
          {c.savings && <p class="combo__save">🎁 {c.savings}</p>}
          <ul class="combo__features">
            {c.features.map((f) => <li>✓ {f}</li>)}
          </ul>
          <a class="btn btn--call" href={`tel:${site.phoneRaw}`}>Đăng ký {c.name}</a>
        </article>
      ))}
    </div>
  </div>
</section>

<style>
.combo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.combo { padding: 22px; display: flex; flex-direction: column; }
.combo--hl { border: 2px solid var(--orange); }
.combo__tag { color: var(--muted); font-size: .9rem; }
.combo__price { margin: 10px 0 6px; }
.combo__amount { font-size: 1.5rem; font-weight: 900; color: var(--orange); }
.combo__unit { color: var(--muted); }
.combo__save { color: var(--navy); font-weight: 700; font-size: .88rem; margin-bottom: 10px; }
.combo__features { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; flex: 1; font-size: .88rem; }
.combo .btn { width: 100%; }
@media (max-width: 1000px) { .combo-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .combo-grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Insert both into `src/pages/[province].astro`** — add imports and place them between `<Packages />`-equivalent. The final main content order: `Benefits, Packages, ComboTV, Process, Coverage`.

Add imports:
```ts
import Packages from '../components/Packages.astro';
import ComboTV from '../components/ComboTV.astro';
```

Set the section order in the page body to:
```astro
<Benefits />
<Packages province={province} />
<ComboTV province={province} />
<Process />
<Coverage province={province} />
```

- [ ] **Step 4: Build and verify package names + prices render**

Run: `npx astro build`
Run: `grep -o "Internet GIGA" dist/haiphong/index.html | head -1`
Expected: prints `Internet GIGA`.
Run: `grep -o "220.000đ" dist/haiphong/index.html | head -1`
Expected: prints `220.000đ` (the GIGA price).

- [ ] **Step 5: Commit**

```bash
git add src/components/Packages.astro src/components/ComboTV.astro src/pages/[province].astro
git commit -m "feat: add internet packages and combo TV sections"
```

---

## Task 13: FAQ accordion component

**Files:**
- Create: `src/components/FAQ.astro`
- Modify: `src/pages/[province].astro` (add `<FAQ />` after `<Coverage />`)

- [ ] **Step 1: Create `src/components/FAQ.astro`**

```astro
---
import { faqs } from '../data/faq';
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
---
<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    <div class="section__head">
      <h2 id="faq-title">Câu hỏi thường gặp khi lắp mạng FPT tại {province.name}</h2>
      <p>Còn thắc mắc? Gọi <a href={`tel:${site.phoneRaw}`}>{site.phoneDisplay}</a> để được giải đáp ngay.</p>
    </div>
    <div class="faqs">
      {faqs.map((f, i) => (
        <details class="card faq" open={i === 0}>
          <summary class="faq__q">
            <span>{f.q}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </summary>
          <p class="faq__a">{f.a}</p>
        </details>
      ))}
    </div>
  </div>
</section>

<style>
.container--narrow { max-width: 820px; }
.faqs { display: flex; flex-direction: column; gap: 12px; }
.faq { padding: 0 18px; }
.faq__q { list-style: none; cursor: pointer; padding: 16px 0; display: flex; justify-content: space-between; gap: 12px; align-items: center; font-weight: 700; color: var(--navy); }
.faq__q::-webkit-details-marker { display: none; }
.faq__icon { position: relative; width: 16px; height: 16px; flex: none; }
.faq__icon::before, .faq__icon::after { content: ''; position: absolute; background: var(--orange); border-radius: 2px; }
.faq__icon::before { top: 7px; left: 0; width: 16px; height: 2px; }
.faq__icon::after { left: 7px; top: 0; width: 2px; height: 16px; transition: transform .2s ease; }
.faq[open] .faq__icon::after { transform: scaleY(0); }
.faq__a { padding: 0 0 16px; color: var(--muted); }
</style>
```

- [ ] **Step 2: Add the FAQ to `src/pages/[province].astro`** — import `FAQ` and place `<FAQ province={province} />` after `<Coverage province={province} />`.

- [ ] **Step 3: Build and verify**

Run: `npx astro build`
Run: `grep -o "Câu hỏi thường gặp" dist/haiphong/index.html | head -1`
Expected: prints `Câu hỏi thường gặp`.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.astro src/pages/[province].astro
git commit -m "feat: add FAQ accordion section"
```

---

## Task 14: CTA section + Footer + FloatingContact

**Files:**
- Create: `src/components/CTASection.astro`, `src/components/Footer.astro`, `src/components/FloatingContact.astro`
- Modify: `src/pages/[province].astro` (add CTA + Footer; FloatingContact inside layout body)

- [ ] **Step 1: Create `src/components/CTASection.astro`**

```astro
---
import { site } from '../config/site';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
---
<section class="section cta-band" id="dang-ky" aria-labelledby="cta-title">
  <div class="container cta-band__inner">
    <div>
      <h2 id="cta-title">Đăng ký lắp mạng FPT tại {province.name} ngay hôm nay</h2>
      <p>Để lại thông tin hoặc gọi trực tiếp — kỹ thuật viên sẽ liên hệ tư vấn và lắp trong ngày.</p>
    </div>
    <form class="cta-form" id="leadForm">
      <input class="cta-form__input" type="text" name="name" placeholder="Họ và tên" required autocomplete="name" />
      <input class="cta-form__input" type="tel" name="phone" placeholder="Số điện thoại" required autocomplete="tel" />
      <button class="btn btn--call" type="submit">Gửi đăng ký qua Zalo</button>
    </form>
    <div class="cta-band__direct">
      <a class="btn btn--call btn--lg" href={`tel:${site.phoneRaw}`}>📞 {site.phoneDisplay}</a>
      <a class="btn btn--zalo btn--lg" href={site.zalo} target="_blank" rel="noopener">💬 Zalo</a>
    </div>
  </div>
</section>

<script is:inline>
  document.getElementById('leadForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = this.name.value.trim();
    var phone = this.phone.value.trim();
    var msg = encodeURIComponent('Tôi muốn đăng ký lắp mạng FPT. Tên: ' + name + ', SĐT: ' + phone);
    window.open('https://zalo.me/0931505556?src=' + msg, '_blank');
  });
</script>

<style>
.cta-band { background: linear-gradient(135deg, var(--orange), var(--orange-dark)); color: #fff; }
.cta-band__inner { display: grid; gap: 20px; }
.cta-band h2 { color: #fff; }
.cta-band p { color: #fff5ee; }
.cta-form { display: flex; flex-wrap: wrap; gap: 10px; }
.cta-form__input { flex: 1; min-width: 200px; padding: 14px 16px; border-radius: 999px; border: 0; font-size: 1rem; }
.cta-band__direct { display: flex; flex-wrap: wrap; gap: 12px; }
.cta-band__direct .btn--zalo { background: #fff; color: var(--navy); }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
import { site } from '../config/site';
import { getActiveProvinces } from '../config/provinces';
import type { Province } from '../config/provinces';
interface Props { province: Province; }
const { province } = Astro.props;
const provinces = getActiveProvinces();
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container footer__grid">
    <div>
      <div class="footer__brand"><span class="hdr__logo">FPT</span> {site.brand}</div>
      <p>Dịch vụ đăng ký, lắp đặt internet FPT và combo truyền hình FPT Play tại {province.name}.</p>
    </div>
    <div>
      <h3>Liên hệ</h3>
      <p><a href={`tel:${site.phoneRaw}`}>📞 {site.phoneDisplay}</a></p>
      <p><a href={site.zalo} target="_blank" rel="noopener">💬 Chat Zalo</a></p>
    </div>
    {provinces.length > 1 && (
      <div>
        <h3>Khu vực phục vụ</h3>
        <ul>
          {provinces.map((p) => <li><a href={`/${p.slug}/`}>{p.name}</a></li>)}
        </ul>
      </div>
    )}
  </div>
  <div class="footer__bar">
    <div class="container">© {year} {site.brand}. Nội dung mang tính tham khảo, giá cước vui lòng xác nhận khi đăng ký.</div>
  </div>
</footer>

<style>
.footer { background: var(--navy); color: #cdd8ea; padding: 48px 0 0; }
.footer__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding-bottom: 32px; }
.footer h3 { color: #fff; font-size: 1rem; margin-bottom: 10px; }
.footer a { color: #fff; }
.footer a:hover { color: var(--orange); }
.footer__brand { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.footer__bar { border-top: 1px solid rgba(255,255,255,.12); padding: 14px 0; font-size: .85rem; }
.hdr__logo { background: var(--orange); color: #fff; padding: 6px 10px; border-radius: 8px; font-weight: 900; }
@media (max-width: 720px) { .footer__grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Create `src/components/FloatingContact.astro`**

```astro
---
import { site } from '../config/site';
---
<a class="fab fab--zalo" href={site.zalo} target="_blank" rel="noopener" aria-label="Chat Zalo">💬</a>

<div class="dock" role="navigation" aria-label="Liên hệ nhanh">
  <a class="dock__btn dock__btn--call" href={`tel:${site.phoneRaw}`}>📞 Gọi ngay</a>
  <a class="dock__btn dock__btn--zalo" href={site.zalo} target="_blank" rel="noopener">💬 Zalo</a>
</div>

<style>
.fab { position: fixed; right: 16px; bottom: 84px; width: 56px; height: 56px; border-radius: 50%; background: #0a77f7; color: #fff; display: grid; place-items: center; font-size: 1.5rem; box-shadow: var(--shadow-lg); z-index: 60; }
.dock { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 8px; padding: 8px; background: rgba(255,255,255,.96); border-top: 1px solid var(--line); z-index: 60; }
.dock__btn { flex: 1; text-align: center; padding: 12px; border-radius: var(--radius-sm); font-weight: 800; }
.dock__btn--call { background: var(--orange); color: #fff; }
.dock__btn--zalo { background: #0a77f7; color: #fff; }
@media (min-width: 821px) {
  .dock { display: none; }
  .fab { bottom: 24px; }
}
</style>
```

- [ ] **Step 4: Wire CTA + Footer + FloatingContact into `src/pages/[province].astro`**

Add imports:
```ts
import CTASection from '../components/CTASection.astro';
import Footer from '../components/Footer.astro';
import FloatingContact from '../components/FloatingContact.astro';
```

Body becomes (final order):
```astro
<Header province={province} />
<Hero province={province} />
<Benefits />
<Packages province={province} />
<ComboTV province={province} />
<Process />
<Coverage province={province} />
<FAQ province={province} />
<CTASection province={province} />
<Footer province={province} />
<FloatingContact />
```

(Remove the leftover placeholder `<main>` wrapper entirely.)

- [ ] **Step 5: Build and verify tel/zalo links and Zalo dock**

Run: `npx astro build`
Run: `grep -c "zalo.me/0931505556" dist/haiphong/index.html`
Expected: a number ≥ 4 (header, hero, cta, footer, fab, dock).
Run: `grep -o 'class="dock"' dist/haiphong/index.html | head -1`
Expected: prints `class="dock"`.

- [ ] **Step 6: Commit**

```bash
git add src/components/CTASection.astro src/components/Footer.astro src/components/FloatingContact.astro src/pages/[province].astro
git commit -m "feat: add CTA lead form, footer, and floating contact"
```

---

## Task 15: Index redirect to default province

**Files:**
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/pages/index.astro`**

```astro
---
import { getDefaultProvince } from '../config/provinces';
const target = `/${getDefaultProvince().slug}/`;
return Astro.redirect(target, 301);
---
```

- [ ] **Step 2: Build and verify the redirect**

Run: `npx astro build`
Expected: outputs `dist/index.html` containing a meta refresh / canonical pointing to `/haiphong/`.
Run: `grep -o "/haiphong/" dist/index.html | head -1`
Expected: prints `/haiphong/`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: redirect homepage to default province"
```

---

## Task 16: robots.txt, favicon, OG image, sitemap wiring

**Files:**
- Create: `public/robots.txt`, `public/favicon.svg`, `public/og-default.svg`

- [ ] **Step 1: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://mangfpt.vn/sitemap-index.xml
```

- [ ] **Step 2: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#ed7d31"/>
  <text x="32" y="42" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="#fff" text-anchor="middle">FPT</text>
</svg>
```

- [ ] **Step 3: Create `public/og-default.svg`** (1200×630-ish social card via SVG)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b2c5d"/>
      <stop offset="1" stop-color="#1a4a8a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="60" y="60" width="150" height="64" rx="14" fill="#ed7d31"/>
  <text x="135" y="104" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#fff" text-anchor="middle">FPT</text>
  <text x="60" y="300" font-family="Arial, sans-serif" font-size="74" font-weight="900" fill="#fff">Lắp mạng FPT</text>
  <text x="60" y="384" font-family="Arial, sans-serif" font-size="50" font-weight="700" fill="#ed7d31">Wi-Fi 6 miễn phí — lắp trong ngày</text>
  <text x="60" y="500" font-family="Arial, sans-serif" font-size="46" font-weight="800" fill="#fff">📞 0931.50.55.56</text>
</svg>
```

- [ ] **Step 4: Build and confirm sitemap is generated**

Run: `npx astro build`
Expected: outputs `dist/sitemap-index.xml` and `dist/sitemap-0.xml`, and copies the three `public/` files into `dist/`.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt public/favicon.svg public/og-default.svg
git commit -m "feat: add robots, favicon, OG image; sitemap via integration"
```

---

## Task 17: README province-switching runbook

**Files:**
- Modify: `README.md` (replace stub with full docs)

- [ ] **Step 1: Replace `README.md` with the full content**

````markdown
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
Đổi `siteUrl` trong `src/config/site.ts` và `SITE` trong `astro.config.mjs`. Toàn bộ canonical / sitemap / schema tự cập nhật.

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
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add full README with province-switching runbook"
```

---

## Task 18: Build verification script + final SEO/content checklist

**Files:**
- Create: `scripts/verify.mjs`

- [ ] **Step 1: Create `scripts/verify.mjs`**

```js
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const checks = [];
const check = (name, cond) => checks.push({ name, ok: !!cond });

const hp = join(dist, 'haiphong', 'index.html');
check('built /haiphong/index.html', existsSync(hp));

if (existsSync(hp)) {
  const html = readFileSync(hp, 'utf8');
  check('html lang="vi"', html.includes('lang="vi"'));
  check('<title> present', /<title>[^<]{8,}<\/title>/.test(html));
  check('meta description', html.includes('name="description"'));
  check('canonical link', html.includes('rel="canonical"'));
  check('H1 keyword: Lắp mạng FPT tại Hải Phòng', html.includes('Lắp mạng FPT tại Hải Phòng'));
  check('Open Graph title', html.includes('property="og:title"'));
  check('schema Organization', html.includes('"@type":"Organization"'));
  check('schema LocalBusiness', html.includes('"@type":"LocalBusiness"'));
  check('schema Service', html.includes('"@type":"Service"'));
  check('schema FAQPage', html.includes('"@type":"FAQPage"'));
  check('schema BreadcrumbList', html.includes('"@type":"BreadcrumbList"'));
  check('tel: link', html.includes('tel:0931505556'));
  check('zalo link (>=4 occurrences)', (html.match(/zalo\.me\/0931505556/g) || []).length >= 4);
  check('package: Internet GIGA', html.includes('Internet GIGA'));
  check('combo section present', html.includes('Combo'));
  check('district: Lê Chân', html.includes('Lê Chân'));
  check('floating dock', html.includes('class="dock"'));
}

check('sitemap-index.xml generated', existsSync(join(dist, 'sitemap-index.xml')));
check('robots.txt generated', existsSync(join(dist, 'robots.txt')));
check('favicon.svg generated', existsSync(join(dist, 'favicon.svg')));
check('og-default.svg generated', existsSync(join(dist, 'og-default.svg')));
check('index redirect present', existsSync(join(dist, 'index.html')));

for (const c of checks) console.log(`${c.ok ? '✓' : '✗'} ${c.name}`);
const failed = checks.filter((c) => !c.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) FAILED.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed.`);
```

- [ ] **Step 2: Run full verification**

Run: `npm test`
Expected: all unit tests pass (format, packages, provinces, faq, seo).

Run: `npm run verify`
Expected: build succeeds and prints "All N checks passed." (exit 0).

- [ ] **Step 3: Manual checklist (tick after `npm run dev` visual review)**

- [ ] Hero H1 shows "Lắp mạng FPT tại Hải Phòng" + 2 CTA buttons work (call + zalo).
- [ ] All 5 internet packages render with prices + "Đăng ký" buttons.
- [ ] All combos render under the combo section.
- [ ] Coverage lists Hải Phòng districts.
- [ ] FAQ accordion expands/collapses.
- [ ] CTA form opens Zalo with name + phone pre-filled.
- [ ] Mobile sticky dock (Call | Zalo) shows under 821px; floating Zalo button shows on desktop.
- [ ] Header is sticky; call + zalo buttons work.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify.mjs
git commit -m "test: add build verification script and SEO content checks"
```

---

## Province-switch demo (sanity check, optional, not committed)

To prove the multi-province design works, temporarily:
1. Uncomment the `danang` block in `src/config/provinces.ts`.
2. `npm run build` → confirm `dist/danang/index.html` exists and `dist/sitemap-0.xml` lists both provinces.
3. Revert the change (`git checkout src/config/provinces.ts`).

This confirms adding a province is a pure config edit with no other code changes.

---

## Spec coverage map

| Spec section | Tasks |
|---|---|
| Tech (Astro static) | 1, 8 |
| Domain (configurable) | 2 (`siteUrl`), 17 (runbook) |
| URL structure `/[province]/` + redirect | 8, 15 |
| Single-source-of-truth config | 4 |
| Province-switch runbook (Scenarios A & B) | 4 (data), 17 (docs) |
| 10 page sections | 9 Header, 10 Hero, 11 Benefits/Process/Coverage, 12 Packages/ComboTV, 13 FAQ, 14 CTA/Footer/Floating |
| Contact at 6 positions (tel + zalo) | 9, 10, 12, 14, 16 |
| SEO on-page (title/meta/OG/H1) | 6, 8 |
| SEO technical (sitemap, robots, canonical, lang) | 6, 8, 16 |
| SEO schema (Organization/LocalBusiness/Service/FAQ/Breadcrumb) | 6, 8 |
| Local SEO (district list) | 4, 11 |
| Visual design (FPT colors, mobile-first) | 7 + scoped styles each component |
| Performance (static, minimal JS) | 1, 7, 13/14 (inline JS only) |
| Pricing (researched, VERIFY flag) | 3 |
| No copyrighted text/images (original copy + SVG) | all |
| Deploy-ready static output | 18 |
