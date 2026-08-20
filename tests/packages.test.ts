import { describe, it, expect } from 'vitest';
import { packages, getPackagesByGroup } from '../src/data/packages';

describe('packages', () => {
  it('has 3 family packages incl. Giga and V.VIP combos', () => {
    const family = getPackagesByGroup('family');
    const ids = family.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(['giga', 'combo-giga-vvip', 'combo-sky-vvip']));
    expect(family.length).toBe(3);
  });
  it('has 3 business packages', () => {
    expect(getPackagesByGroup('business').length).toBe(3);
  });
  it('has 3 gamer packages (F-Game + Meta V.VIP + Meta V.VIP F1)', () => {
    const ids = getPackagesByGroup('gamer').map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(['gamer-fgame', 'gamer-combo-meta-vvip', 'gamer-combo-meta-vvip-f1']));
    expect(getPackagesByGroup('gamer').length).toBe(3);
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
