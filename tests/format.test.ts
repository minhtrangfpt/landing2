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
