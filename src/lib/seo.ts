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
