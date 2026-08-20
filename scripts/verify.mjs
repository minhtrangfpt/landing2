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
  check('zalo link (>=2 occurrences)', (html.match(/zalo\.me\/0931505556/g) || []).length >= 2);
  check('package: Internet Giga', html.includes('Internet Giga'));
  check('family: Combo Giga V.VIP', html.includes('Combo Giga V.VIP'));
  check('family: Combo Sky V.VIP', html.includes('Combo Sky V.VIP'));
  check('family price 220.000đ (Giga V.VIP)', html.includes('220.000đ'));
  check('feature: Ngoại hạng Anh 4K', html.includes('Ngoại hạng Anh 4K'));
  check('feature: Camera miễn phí', html.includes('Camera miễn phí'));
  check('lead form mailto', html.includes('trangntm35@fpt.com'));
  check('business group: Gói Doanh nghiệp', html.includes('Gói Doanh nghiệp'));
  check('business: Super300 Biz', html.includes('Super300 Biz'));
  check('district: Lê Chân', html.includes('Lê Chân'));
  check('floating dock', html.includes('class="dock"'));
  // ---- rev1 ----
  check('voucher 300.000đ (hero)', html.includes('Tặng Voucher tiền mặt 300.000đ'));
  check('packages heading (cá nhân gia đình)', html.includes('Gói Internet cá nhân gia đình'));
  check('family subtitle (giá tốt cho gia đình)', html.includes('Giá tốt cho gia đình'));
  check('gamer: Combo Meta V.VIP F1', html.includes('Combo Meta V.VIP F1'));
  check('gamer section heading', html.includes('Gói Internet cho game thủ'));
  check('gamer price 339.000đ (Meta V.VIP)', html.includes('339.000đ'));
  check('Xem chi tiết button', html.includes('Xem chi tiết'));
  check('offices column', html.includes('Các trụ sở giao dịch'));
  check('office: FPT Telecom Kiến An', html.includes('FPT Telecom Kiến An'));
  check('FAQ subtitle', html.includes('Bạn cần biết thêm gì'));
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
