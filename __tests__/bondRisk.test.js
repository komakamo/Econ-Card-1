import { resolveBondRisk } from '../src/Game';

const createSeededRandom = (seed) => {
  let value = seed;
  return () => {
    value = (value * 48271) % 0x7fffffff;
    return value / 0x7fffffff;
  };
};

describe('resolveBondRisk', () => {
  const baseState = { debt: 120, interestDue: 12, support: 80 };

  test('produces deterministic risk outcomes with the same seed', () => {
    const runWithSeed = (seed) => {
      const rng = createSeededRandom(seed);
      return [
        resolveBondRisk({ amount: 50, defaultRisk: 1, randomFn: rng, state: baseState }),
        resolveBondRisk({ amount: 50, defaultRisk: 1, randomFn: rng, state: baseState }),
      ];
    };

    const firstRun = runWithSeed(123);
    const secondRun = runWithSeed(123);
    expect(firstRun).toEqual(secondRun);
  });

  test('different seeds yield different risk patterns', () => {
    const firstRun = resolveBondRisk({ amount: 50, defaultRisk: 1, randomFn: createSeededRandom(1), state: baseState });
    const secondRun = resolveBondRisk({ amount: 50, defaultRisk: 1, randomFn: createSeededRandom(123), state: baseState });

    expect(firstRun).not.toEqual(secondRun);
  });

  test('does not trigger risk when rng() >= defaultRisk', () => {
    const rng = jest.fn().mockReturnValue(0.9);
    const result = resolveBondRisk({ amount: 50, defaultRisk: 0.5, randomFn: rng, state: baseState });
    expect(result.riskImpact).toEqual({});
    expect(result.riskLog).toBe('');
    expect(rng).toHaveBeenCalledTimes(1);
  });

  test('triggers debt penalty branch when riskRoll < 0.34', () => {
    const rng = jest.fn()
      .mockReturnValueOnce(0.1) // < defaultRisk (0.5)
      .mockReturnValueOnce(0.2); // < 0.34
    const result = resolveBondRisk({ amount: 100, defaultRisk: 0.5, randomFn: rng, state: baseState });

    // penaltyDebt = Math.max(5, Math.round(100 * 0.2)) = 20
    expect(result.riskImpact).toEqual({ debt: baseState.debt + 20 });
    expect(result.riskLog).toContain('Default triggered! Debt surged by 20');
  });

  test('triggers interest spike branch when 0.34 <= riskRoll < 0.67', () => {
    const rng = jest.fn()
      .mockReturnValueOnce(0.1) // < defaultRisk (0.5)
      .mockReturnValueOnce(0.5); // 0.34 <= 0.5 < 0.67
    const result = resolveBondRisk({ amount: 100, defaultRisk: 0.5, randomFn: rng, state: baseState });

    // interestSpike = Math.max(3, Math.round(120 * 0.01)) = Math.max(3, 1.2 -> 1) = 3
    expect(result.riskImpact).toEqual({ interestDue: baseState.interestDue + 3 });
    expect(result.riskLog).toContain('Default scare raised interest costs by 3');
  });

  test('triggers support hit branch when riskRoll >= 0.67', () => {
    const rng = jest.fn()
      .mockReturnValueOnce(0.1) // < defaultRisk (0.5)
      .mockReturnValueOnce(0.8); // >= 0.67
    const result = resolveBondRisk({ amount: 100, defaultRisk: 0.5, randomFn: rng, state: baseState });

    // supportHit = Math.max(3, Math.round(80 * 0.05)) = Math.max(3, 4) = 4
    expect(result.riskImpact).toEqual({ support: baseState.support - 4 });
    expect(result.riskLog).toContain('Investor panic eroded support by 4%');
  });
});
