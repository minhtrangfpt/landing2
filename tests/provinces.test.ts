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
