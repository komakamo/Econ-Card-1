import GameLogic from '../src/logic';

const { applyInflationChange, INFLATION_MIN, INFLATION_MAX } = GameLogic;

describe('applyInflationChange', () => {
    test('returns the same state object when delta is 0', () => {
        const state = { inflation: 2.5, money: 100 };

        expect(applyInflationChange(state, 0)).toBe(state);
    });

    test('applies positive and negative deltas', () => {
        const state = { inflation: 1.5, money: 100 };

        expect(applyInflationChange(state, 2).inflation).toBe(3.5);
        expect(applyInflationChange(state, -1).inflation).toBe(0.5);
    });

    test('clamps inflation to min/max bounds', () => {
        const highState = { inflation: INFLATION_MAX - 0.2 };
        const lowState = { inflation: INFLATION_MIN + 0.1 };

        expect(applyInflationChange(highState, 10).inflation).toBe(INFLATION_MAX);
        expect(applyInflationChange(lowState, -10).inflation).toBe(INFLATION_MIN);
    });
});
