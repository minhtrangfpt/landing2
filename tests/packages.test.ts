import { describe, it, expect } from 'vitest';
import { packages, getPackagesByGroup } from '../src/data/packages';

describe('packages', () => {
  it('has 3 family packages incl. Giga and Combo Sky', () => {
    const family = getPackagesByGroup('family');
    const ids = family.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(['giga', 'combo-sky', 'combo-ngoai-hang-anh']));
    expect(family.length).toBe(3);
  });
  it('has 3 business packages', () => {
    expect(getPackagesByGroup('business').length).toBe(3);
  });
  it('has 4 gamer packages', () => {
    expect(getPackagesByGroup('gamer').length).toBe(4);
  });
  it('every package has name, priceMonthly > 0, image, and ≥2 features', () => {
    for (const p of packages) {
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.priceMonthly).toBeGreaterThan(0);
      expect(p.image?.length).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThanOrEqual(2);
    }
  });
});
