import GameLogic from '../src/logic';

const { getRatingByDebt, getRatingInfo, RATING_TIERS } = GameLogic;

describe('Rating Logic', () => {
    describe('getRatingByDebt', () => {
        test('should return AAA for debt below 150', () => {
            expect(getRatingByDebt(0)).toBe('AAA');
            expect(getRatingByDebt(50)).toBe('AAA');
            expect(getRatingByDebt(149)).toBe('AAA');
        });

        test('should return BBB for debt between 150 and 249', () => {
            expect(getRatingByDebt(150)).toBe('BBB');
            expect(getRatingByDebt(200)).toBe('BBB');
            expect(getRatingByDebt(249)).toBe('BBB');
        });

        test('should return CCC for debt between 250 and 399', () => {
            expect(getRatingByDebt(250)).toBe('CCC');
            expect(getRatingByDebt(300)).toBe('CCC');
            expect(getRatingByDebt(399)).toBe('CCC');
        });

        test('should return D for debt 400 and above', () => {
            expect(getRatingByDebt(400)).toBe('D');
            expect(getRatingByDebt(500)).toBe('D');
            expect(getRatingByDebt(1000)).toBe('D');
        });

        test('should handle negative debt by returning AAA', () => {
            expect(getRatingByDebt(-10)).toBe('AAA');
            expect(getRatingByDebt(-1000)).toBe('AAA');
        });

        test('should default to 0 debt and return AAA if no argument provided', () => {
            expect(getRatingByDebt()).toBe('AAA');
        });
    });

    describe('getRatingInfo', () => {
        test('should return correct info for valid rating labels', () => {
            expect(getRatingInfo('AAA')).toEqual(RATING_TIERS[0]);
            expect(getRatingInfo('BBB')).toEqual(RATING_TIERS[1]);
            expect(getRatingInfo('CCC')).toEqual(RATING_TIERS[2]);
            expect(getRatingInfo('D')).toEqual(RATING_TIERS[3]);
        });

        test('should return AAA info for invalid rating labels', () => {
            expect(getRatingInfo('INVALID')).toEqual(RATING_TIERS[0]);
            expect(getRatingInfo(null)).toEqual(RATING_TIERS[0]);
            expect(getRatingInfo()).toEqual(RATING_TIERS[0]);
        });
    });
});
