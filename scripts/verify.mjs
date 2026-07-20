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
