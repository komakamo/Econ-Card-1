import GameLogic from '../src/logic';

const { getRatingByDebt, getRatingInfo } = GameLogic;

describe('Rating Logic', () => {
    describe('getRatingByDebt', () => {
        test('returns "AAA" for 0 debt', () => {
            expect(getRatingByDebt(0)).toBe('AAA');
        });

        test('returns "AAA" for debt just below 150', () => {
            expect(getRatingByDebt(149)).toBe('AAA');
        });

        test('returns "BBB" for debt of 150', () => {
            expect(getRatingByDebt(150)).toBe('BBB');
        });

        test('returns "BBB" for debt just below 250', () => {
            expect(getRatingByDebt(249)).toBe('BBB');
        });

        test('returns "CCC" for debt of 250', () => {
            expect(getRatingByDebt(250)).toBe('CCC');
        });

        test('returns "CCC" for debt just below 400', () => {
            expect(getRatingByDebt(399)).toBe('CCC');
        });

        test('returns "D" for debt of 400', () => {
            expect(getRatingByDebt(400)).toBe('D');
        });

        test('returns "D" for debt above 400', () => {
            expect(getRatingByDebt(1000)).toBe('D');
        });

        test('returns "AAA" for negative debt', () => {
            expect(getRatingByDebt(-10)).toBe('AAA');
        });

        test('returns "AAA" for undefined debt (default)', () => {
            expect(getRatingByDebt()).toBe('AAA');
        });
    });

    describe('getRatingInfo', () => {
        test('returns correct tier for "AAA"', () => {
            const info = getRatingInfo('AAA');
            expect(info.label).toBe('AAA');
            expect(info.threshold).toBe(0);
        });

        test('returns correct tier for "D"', () => {
            const info = getRatingInfo('D');
            expect(info.label).toBe('D');
            expect(info.threshold).toBe(400);
        });

        test('returns default "AAA" tier for unknown rating', () => {
            const info = getRatingInfo('UNKNOWN');
            expect(info.label).toBe('AAA');
            expect(info.threshold).toBe(0);
        });
    });
});
