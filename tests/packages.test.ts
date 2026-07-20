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
