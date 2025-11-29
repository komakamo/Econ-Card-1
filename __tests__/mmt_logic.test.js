
const evaluateGame = (player, difficulty, isWin, ideology = null, lang = 'en', completedMissionCount = 0) => {
    const gdp = player.gdp;
    const inflation = player.inflation;
    const debt = player.debt;
    const support = player.support;
    const rating = player.rating;

    const criteria = ideology?.rankCriteria || { minGdp: 400, maxInflation: 4, minInflation: 2, maxDebt: 100 };

    let rank = 'C';

    if (isWin) {
        // MODIFIED LOGIC BEING TESTED
        const isS = gdp >= criteria.minGdp
                    && (inflation >= criteria.minInflation && inflation <= criteria.maxInflation)
                    && debt <= criteria.maxDebt
                    && (criteria.ignoreRating || rating === 'AAA')
                    && support >= 60;

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

describe('MMT Rank Verification', () => {
    const mmtCriteria = {
        minGdp: 500,
        maxInflation: 8,
        minInflation: 2,
        maxDebt: 999,
        ignoreRating: true
    };

    const mmtIdeology = {
        id: 'MMT',
        rankCriteria: mmtCriteria
    };

    test('should achieve S rank with high debt (CCC rating) for MMT', () => {
        const player = {
            gdp: 600,
            inflation: 4,
            debt: 300, // High debt, likely CCC or lower
            support: 80,
            rating: 'CCC'
        };

        const result = evaluateGame(player, {}, true, mmtIdeology);
        expect(result.rank).toBe('S');
    });

    test('should achieve A rank with high debt (CCC rating) for MMT if GDP slightly lower', () => {
        const player = {
            gdp: 400, // 80% of 500
            inflation: 4,
            debt: 300,
            support: 80,
            rating: 'CCC'
        };

        const result = evaluateGame(player, {}, true, mmtIdeology);
        expect(result.rank).toBe('A');
    });

    test('should fail S rank if rating is bad for standard ideology', () => {
        const standardIdeology = {
            rankCriteria: { minGdp: 400, maxInflation: 4, minInflation: 2, maxDebt: 100 } // No ignoreRating
        };

        const player = {
            gdp: 500,
            inflation: 3,
            debt: 50,
            support: 70,
            rating: 'BBB' // S requires AAA
        };

        const result = evaluateGame(player, {}, true, standardIdeology);
        expect(result.rank).not.toBe('S');
        expect(result.rank).toBe('A'); // A allows BBB
    });
});
