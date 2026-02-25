import GameLogic from '../src/logic';

const {
    ALL_CARDS,
    MAX_STANDARD_CARD_ID,
    getPotentialActions,
} = GameLogic;

describe('AI Restrictions Logic', () => {
    test('getPotentialActions excludes restricted cards (mission rewards / unlockables) even with enough money', () => {
        const actions = getPotentialActions({
            money: 1000,
            inflation: 0,
            cards: ALL_CARDS,
            maxStandardCardId: MAX_STANDARD_CARD_ID,
        });

        const hasStandard = actions.some((card) => card.id === 1);
        const hasMissionReward = actions.some((card) => card.id === 101);
        const hasUnlockable = actions.some((card) => card.id === 999);

        expect(hasStandard).toBe(true);
        expect(hasMissionReward).toBe(false);
        expect(hasUnlockable).toBe(false);
    });

    test('getPotentialActions respects cost restrictions for allowed cards', () => {
        const actions = getPotentialActions({
            money: 0,
            inflation: 0,
            cards: ALL_CARDS,
            maxStandardCardId: MAX_STANDARD_CARD_ID,
        });

        const hasStandard = actions.some((card) => card.id === 1);
        expect(hasStandard).toBe(false);
    });
});
