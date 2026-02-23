
import { getRatingByDebt, RATING_TIERS } from '../src/Game';

describe('Credit Rating Logic', () => {
  describe('Structure Integrity', () => {
    test('RATING_TIERS has correct thresholds', () => {
      const thresholds = RATING_TIERS.map(t => ({ label: t.label, threshold: t.threshold }));
      expect(thresholds).toEqual(expect.arrayContaining([
        { label: 'AAA', threshold: 0 },
        { label: 'BBB', threshold: 150 },
        { label: 'CCC', threshold: 250 },
        { label: 'D', threshold: 400 },
      ]));
    });
  });

  describe('getRatingByDebt', () => {
    test('returns AAA by default (debt = 0)', () => {
      expect(getRatingByDebt(0)).toBe('AAA');
    });

    test('returns AAA for negative debt (surplus)', () => {
      expect(getRatingByDebt(-100)).toBe('AAA');
    });

    test('returns AAA for debt inside AAA range', () => {
      expect(getRatingByDebt(50)).toBe('AAA');
      expect(getRatingByDebt(149)).toBe('AAA');
    });

    test('returns BBB at exactly 150', () => {
      expect(getRatingByDebt(150)).toBe('BBB');
    });

    test('returns BBB for debt inside BBB range', () => {
      expect(getRatingByDebt(200)).toBe('BBB');
      expect(getRatingByDebt(249)).toBe('BBB');
    });

    test('returns CCC at exactly 250', () => {
      expect(getRatingByDebt(250)).toBe('CCC');
    });

    test('returns CCC for debt inside CCC range', () => {
      expect(getRatingByDebt(300)).toBe('CCC');
      expect(getRatingByDebt(399)).toBe('CCC');
    });

    test('returns D at exactly 400', () => {
      expect(getRatingByDebt(400)).toBe('D');
    });

    test('returns D for debt above 400', () => {
      expect(getRatingByDebt(500)).toBe('D');
      expect(getRatingByDebt(1000)).toBe('D');
    });

    test('handles undefined input gracefully (defaults to 0)', () => {
      expect(getRatingByDebt(undefined)).toBe('AAA');
    });
  });
});
