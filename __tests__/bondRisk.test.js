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
});
