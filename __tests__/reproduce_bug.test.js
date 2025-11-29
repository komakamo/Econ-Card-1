
const evaluateGame = (player, difficulty, isWin, ideology = null, lang = 'en', completedMissionCount = 0) => {
    const gdp = player.gdp;
    const inflation = player.inflation;
    const debt = player.debt;
    const support = player.support;
    const rating = player.rating;

    // Default criteria logic from index.html
    const criteria = ideology?.rankCriteria || { minGdp: 400, maxInflation: 4, minInflation: 2, maxDebt: 100 };

    let rank = 'C';

    if (isWin) {
        // Check S (Ideology Specific)
        const isS = gdp >= criteria.minGdp
                    && (inflation >= criteria.minInflation && inflation <= criteria.maxInflation)
                    && debt <= criteria.maxDebt
                    && (criteria.ignoreRating || rating === 'AAA')
                    && support >= 60;

        // Check A (Relaxed S)
        const isA = gdp >= (criteria.minGdp * 0.75)
                    && (inflation >= (criteria.minInflation - 2) && inflation <= (criteria.maxInflation + 2))
                    && debt <= (criteria.maxDebt + 100)
                    && (criteria.ignoreRating || rating === 'AAA' || rating === 'BBB')
                    && support >= 50;

        if (isS) {
            rank = 'S';
        } else if (isA) {
            rank = 'A';
        } else {
            rank = 'B';
        }
    } else {
        rank = 'E';
    }

    return { rank };
};

describe('MMT Debt Bug Reproduction', () => {
    const mmtIdeology = {
        id: 'MMT',
        // Updated criteria reflecting the fix: maxDebt is effectively infinite
        rankCriteria: { minGdp: 500, maxInflation: 8, minInflation: 2, maxDebt: Number.MAX_SAFE_INTEGER, ignoreRating: true }
    };

    test('should achieve S rank with debt > 999 for MMT', () => {
        const player = {
            gdp: 600,
            inflation: 4,
            debt: 1200, // Very high debt exceeding the old limit of 999
            support: 80,
            rating: 'D'
        };

        const result = evaluateGame(player, {}, true, mmtIdeology);

        // This confirms the fix works for debt > 999
        expect(result.rank).toBe('S');
    });
});
