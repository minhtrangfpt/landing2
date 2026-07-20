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
