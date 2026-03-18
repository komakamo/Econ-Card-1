import GameLogic from '../src/logic';

const { getRatingInfo, RATING_TIERS } = GameLogic;

describe('getRatingInfo', () => {
    test('should return correct info for valid rating labels', () => {
        expect(getRatingInfo('AAA')).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo('BBB')).toEqual(RATING_TIERS[1]);
        expect(getRatingInfo('CCC')).toEqual(RATING_TIERS[2]);
        expect(getRatingInfo('D')).toEqual(RATING_TIERS[3]);
    });

    test('should return AAA info (default) for invalid rating labels', () => {
        expect(getRatingInfo('INVALID')).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo('XYZ')).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo('123')).toEqual(RATING_TIERS[0]);
    });

    test('should return AAA info (default) when no argument is provided', () => {
        expect(getRatingInfo()).toEqual(RATING_TIERS[0]);
    });

    test('should return AAA info (default) for null or undefined arguments', () => {
        expect(getRatingInfo(null)).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo(undefined)).toEqual(RATING_TIERS[0]);
    });

    test('should return AAA info (default) for non-string arguments', () => {
        expect(getRatingInfo(123)).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo(true)).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo({})).toEqual(RATING_TIERS[0]);
        expect(getRatingInfo([])).toEqual(RATING_TIERS[0]);
    });
});
