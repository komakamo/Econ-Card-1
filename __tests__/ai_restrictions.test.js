
// --- Mock Game Data ---
// Matches the structure in index.html to ensure the test is relevant
const ALL_CARDS = [
    {
        id: 1,
        name: 'Standard Card',
        cost: 10,
        type: 'PRODUCTION',
        effect: (me) => ({ ...me, gdp: me.gdp + 10 }),
        supportChange: 0,
        inflationChange: 0,
    },
    {
        id: 101, // Mission Reward
        name: 'Mission Reward Card',
        cost: 0,
        type: 'POLICY',
        effect: (me) => ({ ...me, gdp: me.gdp + 20 }),
        supportChange: 0,
        inflationChange: 0,
    },
    {
        id: 999, // Unlockable
        name: 'Unlockable Card',
        cost: 0,
        type: 'POLICY',
        effect: (me) => ({ ...me, money: me.money + 100 }),
        supportChange: 0,
        inflationChange: 0,
        unlockCondition: () => false // Locked
    }
];

// Constants (mirroring index.html)
const MAX_STANDARD_CARD_ID = 100;

// Mock Helper functions
const calculateInflatedCost = (cost, inflation) => cost;

// --- The AI Turn Logic Under Test ---
// This function mimics the corrected logic in index.html
const getPotentialActions = (money, inflation) => {
    return ALL_CARDS.filter(c => c.id < MAX_STANDARD_CARD_ID && calculateInflatedCost(c.cost, inflation) <= money);
};

// --- Jest Test Suite ---
describe('AI Restrictions Logic', () => {
    test('AI ignores restricted cards even with enough money', () => {
        const money = 1000;
        const inflation = 0;
        const actions = getPotentialActions(money, inflation);

        const hasStandard = actions.some(c => c.id === 1);
        const hasMissionReward = actions.some(c => c.id === 101);
        const hasUnlockable = actions.some(c => c.id === 999);

        expect(hasStandard).toBe(true);
        expect(hasMissionReward).toBe(false);
        expect(hasUnlockable).toBe(false);
    });

    test('AI respects cost restrictions for allowed cards', () => {
        const money = 0;
        const inflation = 0;
        const actions = getPotentialActions(money, inflation);

        const hasStandard = actions.some(c => c.id === 1); // Cost 10
        expect(hasStandard).toBe(false);
    });
});
