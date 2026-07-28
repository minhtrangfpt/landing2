import { describe, it, expect } from 'vitest';
import { getFaqs } from '../src/data/faq';
import { getProvince } from '../src/config/provinces';

const faqs = getFaqs(getProvince('haiphong'));

describe('faqs', () => {
  it('has 4-10 items', () => {
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    expect(faqs.length).toBeLessThanOrEqual(10);
  });
  it('every item has a question and a non-empty answer', () => {
    for (const f of faqs) {
      expect(f.q.length).toBeGreaterThan(5);
      expect(f.a.length).toBeGreaterThan(10);
    }
  });
});
