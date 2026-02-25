import GameLogic from '../src/logic';

const { calculateInflatedCost, EVENTS, ERAS } = GameLogic;

describe('calculateInflatedCost', () => {
    test('returns base cost when inflation is 0 and no effects', () => {
        expect(calculateInflatedCost(100, 0)).toBe(100);
        expect(calculateInflatedCost(50, 0)).toBe(50);
        expect(calculateInflatedCost(0, 0)).toBe(0);
    });

    test('applies inflation correctly', () => {
        // 10% inflation -> 1.1x
        expect(calculateInflatedCost(100, 10)).toBe(110);
        // 5% inflation -> 1.05x
        expect(calculateInflatedCost(100, 5)).toBe(105);
        // -10% inflation -> 0.9x
        expect(calculateInflatedCost(100, -10)).toBe(90);
    });

    test('handles rounding correctly', () => {
        // 100 * 1.03 = 103
        expect(calculateInflatedCost(100, 3)).toBe(103);
        // 50 * 1.03 = 51.5 -> 52
        expect(calculateInflatedCost(50, 3)).toBe(52);
        // 30 * 1.03 = 30.9 -> 31
        expect(calculateInflatedCost(30, 3)).toBe(31);
    });

    test('applies event cost multiplier', () => {
        const oilShock = EVENTS.find(e => e.id === 1); // Oil Shock: costMultiplier 1.2
        expect(oilShock).toBeDefined();

        // 100 * 1.0 (inf) * 1.2 (event) = 120
        expect(calculateInflatedCost(100, 0, oilShock)).toBe(120);

        // 100 * 1.1 (inf) * 1.2 (event) = 110 * 1.2 = 132
        expect(calculateInflatedCost(100, 10, oilShock)).toBe(132);
    });

    test('applies era cost multiplier (Stagnation)', () => {
        const stagnation = ERAS.STAGNATION; // Multiplier 1.5
        expect(stagnation).toBeDefined();

        // 100 * 1.0 * 1.5 = 150
        expect(calculateInflatedCost(100, 0, null, stagnation)).toBe(150);

        // 100 * 1.1 * 1.5 = 110 * 1.5 = 165
        expect(calculateInflatedCost(100, 10, null, stagnation)).toBe(165);
    });

    test('applies combined effects (Inflation + Event + Era)', () => {
        const oilShock = EVENTS.find(e => e.id === 1); // 1.2
        const stagnation = ERAS.STAGNATION; // 1.5

        // 100 * 1.1 (inf) = 110
        // Multiplier = 1.2 * 1.5 = 1.8
        // Result = 110 * 1.8 = 198

        // Wait, logic is:
        // multiplier = activeEvent?.effect?.costMultiplier || 1;
        // if (era?.id === 'STAGNATION') multiplier *= 1.5;
        // inflated = round(base * (1 + inf/100))
        // return round(inflated * multiplier)

        // inflated = 110
        // multiplier = 1.2 * 1.5 = 1.8
        // 110 * 1.8 = 198

        expect(calculateInflatedCost(100, 10, oilShock, stagnation)).toBe(198);
    });

    test('cost does not drop below 0', () => {
        expect(calculateInflatedCost(100, -200)).toBe(0);
    });

    test('Recession event cost multiplier', () => {
        const recession = EVENTS.find(e => e.id === 4); // Recession: costMultiplier 1.1
        expect(recession).toBeDefined();

        // 100 * 1.0 * 1.1 = 110
        expect(calculateInflatedCost(100, 0, recession)).toBe(110);
    });
});
