    // --- Localization Helpers ---
    const UI_TEXT = {
        ja: {
            title: "エコノミクス・マスター",
            subtitle: "経済学カードゲーム",
            turn: "TURN",
            goal: "目標",
            start: "Start",
            reset: "Reset",
            startGame: "ゲーム開始",
            playAgain: "もう一度プレイ",
            victory: "VICTORY",
            defeat: "GAME OVER",
            victoryDesc: "経済目標達成",
            defeatDesc: "政権崩壊 / 経済敗北",
            resultReport: "Result Report",
            nextGoal: "Next Goal",
            comboGuide: "Combo Guide (コンボ図鑑)",
            comboHint: "★ ヒント",
            comboHintDesc: "直前にプレイしたカードのタグと噛み合うと\n効果が1.3倍になります！",
            cardInfo: "カード解説",
            cardInfoDesc: "カードにカーソルを合わせると\n詳しい解説が表示されます",
            memo: "経済メモ",
            detail: "効果詳細",
            myCountry: "自国 (あなた)",
            rivalCountry: "ライバル国",
            gdp: "GDP",
            money: "資金残高",
            income: "収支",
            interest: "利払",
            support: "国民支持率",
            debt: "債務残高",
            inflation: "インフレ",
            trillion: "兆",
            selectPlaystyle: "Select Playstyle (思想・派閥)",
            selectDifficulty: "Select Difficulty",
            yourHand: "Your Hand",
            bond: "国債発行",
            endTurn: "ターン終了",
            discard: "Discard / Last Played",
            deck: "DECK",
            noCards: "No cards available",
            log: "Game Log",
            live: "LIVE",
            cost: "Cost",
            successRate: "成功率",
            cardTypeProd: "生産",
            cardTypePolicy: "政策",
            cardTypeAttack: "外交",
            tagInfra: "インフラ",
            tagInfraDesc: "「設備投資」や「公共事業」で付与。生産系カードの効果を高めます。",
            tagEdu: "教育・人材",
            tagEduDesc: "「人材育成」で付与。技術系カードの土台となります。",
            tagInno: "イノベーション",
            tagInnoDesc: "「技術革新」で付与。次の技術投資を大きくブーストします。",
            tagTech: "先端技術",
            tagTechDesc: "スタートアップ等。IT革命期に効果が倍増する強力なタグ。",
            turnSummary: "ターンサマリー",
            highlight: "このターンのハイライト",
            outlook: "次ターンへの注意",
            continue: "続ける",
            ideologyMission: "思想ミッション (Sランク)",
            ideologyMissionDesc: "現在の思想でSランクを獲得するための条件です。",
            encyclopedia: "経済カード図鑑",
            collectionProgress: "収集率",
            unknown: "未発見",
            cardDetail: "カード詳細",
            close: "閉じる",
            tags: "関連タグ",
            playToUnlock: "プレイして解禁",
            insufficientFunds: "資金が足りません",
        },
        en: {
            title: "Economics Master",
            subtitle: "Strategic Card Game",
            turn: "TURN",
            goal: "GOAL",
            start: "Start",
            reset: "Reset",
            startGame: "START GAME",
            playAgain: "Play Again",
            victory: "VICTORY",
            defeat: "GAME OVER",
            victoryDesc: "Economic Goal Achieved",
            defeatDesc: "Administration Collapse / Defeat",
            resultReport: "Result Report",
            nextGoal: "Next Goal",
            comboGuide: "Combo Guide",
            comboHint: "★ Hint",
            comboHintDesc: "Match tags with the last played card\nfor a 1.3x Effect Bonus!",
            cardInfo: "Card Info",
            cardInfoDesc: "Hover over a card to see\ndetailed information.",
            memo: "Econ Memo",
            detail: "Effect Details",
            myCountry: "My Country (YOU)",
            rivalCountry: "Rival Country",
            gdp: "GDP",
            money: "Funds",
            income: "Income",
            interest: "Interest",
            support: "Support",
            debt: "Debt",
            inflation: "Inflation",
            trillion: "T",
            selectPlaystyle: "Select Playstyle",
            selectDifficulty: "Select Difficulty",
            yourHand: "Your Hand",
            bond: "Issue Bonds",
            endTurn: "End Turn",
            discard: "Discard / Last Played",
            deck: "DECK",
            noCards: "No cards available",
            log: "Game Log",
            live: "LIVE",
            cost: "Cost",
            successRate: "Success",
            cardTypeProd: "PROD",
            cardTypePolicy: "POLICY",
            cardTypeAttack: "DIPLO",
            tagInfra: "Infrastructure",
            tagInfraDesc: "Granted by 'Investment' or 'Public Works'. Boosts production cards.",
            tagEdu: "Education",
            tagEduDesc: "Granted by 'Human Capital'. Foundation for technology cards.",
            tagInno: "Innovation",
            tagInnoDesc: "Granted by 'Tech Innovation'. Boosts next tech investment.",
            tagTech: "High-Tech",
            tagTechDesc: "Startups etc. Doubles effect during IT Revolution.",
            turnSummary: "Turn Summary",
            highlight: "This Turn's Highlight",
            outlook: "Next Turn's Outlook",
            continue: "Continue",
            ideologyMission: "Ideology Mission (S Rank)",
            ideologyMissionDesc: "Conditions to achieve S Rank with the current ideology.",
            encyclopedia: "Card Encyclopedia",
            collectionProgress: "Collection",
            unknown: "Unknown",
            cardDetail: "Card Detail",
            close: "Close",
            tags: "Tags",
            playToUnlock: "Play to Unlock",
            insufficientFunds: "Not enough money",
        }
    };

    const getLoc = (obj, key, lang) => {
         if (lang === 'en' && obj[key + '_en']) return obj[key + '_en'];
         return obj[key];
    };

    const t = (key, lang) => {
        return UI_TEXT[lang][key] || UI_TEXT['ja'][key] || key;
    };

    const getCardProvidedTags = (card) => {
        const tags = [];
        if (Array.isArray(card?.providesTags)) {
            tags.push(...card.providesTags);
        }
        if (card?.providesTag) {
            tags.push(card.providesTag);
        }
        return tags;
    };

    // --- Helpers ---
    const INFLATION_MIN = -5;
    const INFLATION_MAX = 15;

    const clampInflation = (value) => Math.min(INFLATION_MAX, Math.max(INFLATION_MIN, Number(value.toFixed(1))));

    const clampSupport = (value = 0) => Math.max(0, Math.min(100, value));

    const calculateInflatedCost = (baseCost, inflationRate = 0, activeEvent = null, era = null) => {
        const inflated = Math.max(0, Math.round(baseCost * (1 + inflationRate / 100)));
        let multiplier = activeEvent?.effect?.costMultiplier || 1;
        if (era?.id === 'STAGNATION') {
            multiplier *= 1.5;
        }
        return Math.max(0, Math.round(inflated * multiplier));
    };

    const applyInflationDrift = (value, target = 0) => {
        const diff = target - value;
        const step = 0.3;
        if (Math.abs(diff) < step) return target;
        return clampInflation(value + (diff > 0 ? step : -step));
    };

    const applyInflationChange = (state, delta = 0) => {
        if (!delta) return state;
        return { ...state, inflation: clampInflation((state.inflation ?? 0) + delta) };
    };

    const RATING_TIERS = [
        { label: 'AAA', threshold: 0, interestMultiplier: 1, eventDamageMultiplier: 1 },
        { label: 'BBB', threshold: 150, interestMultiplier: 1.25, eventDamageMultiplier: 1.1 },
        { label: 'CCC', threshold: 250, interestMultiplier: 1.6, eventDamageMultiplier: 1.25 },
        { label: 'D', threshold: 400, interestMultiplier: 2, eventDamageMultiplier: 1.5 },
    ];

    // Sort logic moved inside helper in index.html, but we can pre-sort here for efficiency
    const RATING_TIERS_DESC = [...RATING_TIERS].sort((a, b) => b.threshold - a.threshold);

    const RATING_MAP = RATING_TIERS.reduce((acc, tier) => {
        acc[tier.label] = tier;
        return acc;
    }, {});

    const getRatingByDebt = (debt = 0) => {
        const found = RATING_TIERS_DESC.find(tier => debt >= tier.threshold);
        return found?.label ?? 'AAA';
    };

    const getRatingInfo = (rating = 'AAA') => RATING_MAP[rating] ?? RATING_TIERS[0];

    const secureRandom = () => {
        const cryptoObj = (typeof window !== 'undefined' && (window.crypto || window.msCrypto)) ||
                          (typeof global !== 'undefined' && global.crypto);

        if (cryptoObj && cryptoObj.getRandomValues) {
            const array = new Uint32Array(1);
            cryptoObj.getRandomValues(array);
            return array[0] / 4294967296;
        }
        throw new Error('Secure PRNG not available');
    };

    const resolveBondRisk = ({ amount, defaultRisk, randomFn = secureRandom, state }) => {
        const rng = typeof randomFn === 'function' ? randomFn : secureRandom;
        let riskLog = '';
        let riskImpact = {};

        if (rng() < defaultRisk) {
            const riskRoll = rng();
            if (riskRoll < 0.34) {
                const penaltyDebt = Math.max(5, Math.round(amount * 0.2));
                riskImpact = { debt: (state?.debt || 0) + penaltyDebt };
                riskLog = ` Default triggered! Debt surged by ${penaltyDebt}.`;
            } else if (riskRoll < 0.67) {
                const interestSpike = Math.max(3, Math.round((state?.debt || 0) * 0.01));
                riskImpact = { interestDue: (state?.interestDue || 0) + interestSpike };
                riskLog = ` Default scare raised interest costs by ${interestSpike} per turn.`;
            } else {
                const supportHit = Math.max(3, Math.round((state?.support ?? 100) * 0.05));
                riskImpact = { support: Math.max(0, (state?.support ?? 100) - supportHit) };
                riskLog = ` Investor panic eroded support by ${supportHit}%.`;
            }
        }

        return { riskImpact, riskLog };
    };

    // --- Game Data ---
    const EVENTS = [
        {
            id: 1,
            name: '原油ショック',
            name_en: 'Oil Shock',
            description: '資源価格高騰であらゆる政策コストが20%上昇します。',
            description_en: 'Resource prices soar, increasing all policy costs by 20%.',
            effect: { costMultiplier: 1.2 },
        },
        {
            id: 2,
            name: '緊縮財政',
            name_en: 'Fiscal Austerity',
            description: '財政再建のため収入が毎ターン3兆円減少します。',
            description_en: 'Income decreases by 3 trillion/turn for fiscal reconstruction.',
            effect: { incomePenalty: 3 },
        },
        {
            id: 3,
            name: '技術革新ブーム',
            name_en: 'Tech Innovation Boom',
            description: 'カードの経済効果が1.3倍に増幅します。',
            description_en: 'Economic effects of cards amplified by 1.3x.',
            effect: { effectMultiplier: 1.3 },
        },
        {
            id: 4,
            name: '景気後退',
            name_en: 'Recession',
            description: 'カードの経済効果が0.7倍に縮小し、資金繰りが厳しくなります。',
            description_en: 'Economic effects reduced by 0.7x, and funding becomes difficult.',
            effect: { effectMultiplier: 0.7, costMultiplier: 1.1 },
        },
    ];

    const ERAS = {
        GROWTH: {
            id: 'GROWTH',
            name: '高度経済成長期',
            name_en: 'High Growth Era',
            description: 'GDP↑ インフレ↑',
            description_en: 'Increased GDP growth, inflation accelerates',
            bgClass: 'bg-orange-900/10',
            effectDesc: 'GDP上昇効果増・インフレ加速',
            effectDesc_en: 'GDP growth bonus, Inflation accelerates'
        },
        STAGNATION: {
            id: 'STAGNATION',
            name: 'バブル崩壊・停滞期',
            name_en: 'Bubble Burst / Stagnation',
            description: 'コスト増・デフレ・収益減',
            description_en: 'Card costs up, income down, deflation',
            bgClass: 'bg-slate-950',
            effectDesc: 'カードコスト増・収益減・デフレ進行',
            effectDesc_en: 'Costs increase, Income decreases, Deflation'
        },
        IT_REV: {
            id: 'IT_REV',
            name: 'IT革命・新時代',
            name_en: 'IT Revolution',
            description: '技術カード効果2倍',
            description_en: 'Technology cards effect doubled',
            bgClass: 'bg-cyan-950/20',
            effectDesc: '技術系カードの効果が2倍',
            effectDesc_en: 'Technology cards effect doubled'
        }
    };

    const IDEOLOGIES = {
        KEYNESIAN: {
            id: 'KEYNESIAN',
            name: 'ケインズ派',
            name_en: 'Keynesian',
            label: '積極財政',
            label_en: 'Active Fiscal',
            description: '不況時は政府支出で需要を創出します。',
            description_en: 'Create demand via government spending during recession.',
            features: ['公共事業・金融緩和 多め', '初期支持率 高', '初期債務 あり'],
            features_en: ['Public Works/Easing', 'High Initial Support', 'Initial Debt'],
            initialStats: { support: 80, debt: 50, money: 120 },
            deckWeights: { 3: 3, 4: 2, 6: 2 },
            rankCriteria: { minGdp: 400, maxInflation: 4, minInflation: 2, maxDebt: 100 },
            title: "大恐慌バスター",
            title_en: "Depression Buster",
            rankCriteria_text: "GDP≥400T, インフレ2-4%, 債務≤100T, 支持率≥60, AAA",
            rankCriteria_text_en: "GDP≥400T, Inf 2-4%, Debt≤100T, Support≥60, AAA"
        },
        MONETARIST: {
            id: 'MONETARIST',
            name: 'マネタリスト',
            name_en: 'Monetarist',
            label: '規律重視',
            label_en: 'Discipline',
            description: '通貨供給を管理し、インフレ抑制を最優先します。',
            description_en: 'Control money supply, prioritize inflation control.',
            features: ['増税・金融引き締め', 'インフレ抑制で高評価', '堅実な運営'],
            features_en: ['Tax Hikes/Tightening', 'High Rating for Low Inf', 'Steady Management'],
            initialStats: { support: 60, debt: 0, money: 70 },
            deckWeights: { 5: 3, 4: 2, 11: 2 },
            rankCriteria: { minGdp: 350, maxInflation: 2, minInflation: -1, maxDebt: 80 },
            bonusCondition: (stats) => stats.inflation >= -1 && stats.inflation <= 2,
            title: "インフレハンター",
            title_en: "Inflation Hunter",
            rankCriteria_text: "GDP≥350T, インフレ-1-2%, 債務≤80T, 支持率≥60, AAA",
            rankCriteria_text_en: "GDP≥350T, Inf -1-2%, Debt≤80T, Support≥60, AAA"
        },
        SUPPLY_SIDE: {
            id: 'SUPPLY_SIDE',
            name: 'サプライサイド',
            name_en: 'Supply-Side',
            label: '成長戦略',
            label_en: 'Growth Strategy',
            description: '規制緩和と投資で供給力を高め、GDP成長を促します。',
            description_en: 'Deregulation and investment to boost supply and GDP.',
            features: ['設備投資・技術革新', 'GDP重視', '大器晩成'],
            features_en: ['Investment/Innovation', 'GDP Focus', 'Late Bloomer'],
            initialStats: { support: 70, debt: 20, money: 100 },
            deckWeights: { 1: 3, 2: 3, 8: 3 },
            rankCriteria: { minGdp: 450, maxInflation: 6, minInflation: 0, maxDebt: 150 },
            title: "成長の魔術師",
            title_en: "Growth Magician",
            rankCriteria_text: "GDP≥450T, インフレ0-6%, 債務≤150T, 支持率≥60, AAA",
            rankCriteria_text_en: "GDP≥450T, Inf 0-6%, Debt≤150T, Support≥60, AAA"
        },
        MMT: {
            id: 'MMT',
            name: 'MMT派',
            name_en: 'MMT School',
            label: '現代貨幣理論',
            label_en: 'Modern Monetary Theory',
            description: '「自国通貨建ての国債は破綻しない」とし、インフレを上限に積極財政を行います。',
            description_en: 'Spend aggressively, constrained only by inflation, assuming sovereign debt won\'t default.',
            features: ['財政赤字容認', '高インフレ許容', '雇用重視'],
            features_en: ['Deficit OK', 'High Inflation OK', 'Job Focus'],
            initialStats: { support: 70, debt: 100, money: 150 },
            deckWeights: { 3: 4, 10: 2, 4: 3 },
            rankCriteria: { minGdp: 500, maxInflation: 8, minInflation: 2, maxDebt: Number.MAX_SAFE_INTEGER, ignoreRating: true },
            title: "財政の解放者",
            title_en: "Fiscal Liberator",
            rankCriteria_text: "GDP≥500T, インフレ2-8%, 債務不問, 支持率≥60",
            rankCriteria_text_en: "GDP≥500T, Inf 2-8%, Any Debt, Support≥60",
            unlockCondition: (progress) => (progress.monetarist_rank_a_count || 0) >= 3,
            unlockHint: "マネタリストでAランク以上を3回獲得",
            unlockHint_en: "Achieve A Rank 3 times with Monetarist"
        }
    };

    const ACHIEVEMENTS = {
        HIGH_SUPPORT: {
            id: 'HIGH_SUPPORT',
            name: '圧倒的支持',
            name_en: 'Overwhelming Support',
            description: '支持率90%以上でクリア',
            description_en: 'Clear with over 90% support',
            check: (player, isWin) => isWin && player.support >= 90,
            iconName: 'IconStar', // Changed from component to string ID
            unlocksCard: 201,
        },
    };

    const CARD_DATA = {
        UNIVERSAL_HEALTH_CARE: {
            ID: 201,
            COST: 50,
            SUPPORT_CHANGE: 15,
            INCOME_PENALTY: 10,
            DURATION: 5,
            GDP_BOOST: 10,
            SUPPORT_BOOST: 1
        }
    };

    const ALL_CARDS = [
        {
            id: CARD_DATA.UNIVERSAL_HEALTH_CARE.ID,
            name: '国民皆保険制度',
            name_en: 'Universal Health Care',
            cost: CARD_DATA.UNIVERSAL_HEALTH_CARE.COST,
            type: 'POLICY',
            supportChange: CARD_DATA.UNIVERSAL_HEALTH_CARE.SUPPORT_CHANGE,
            effect: (me, opp) => ({
                ...me,
                income: Math.max(0, me.income - CARD_DATA.UNIVERSAL_HEALTH_CARE.INCOME_PENALTY),
                activeEffects: [...(me.activeEffects || []), {
                    name: '健康増進',
                    name_en: 'Health Boost',
                    turnsLeft: CARD_DATA.UNIVERSAL_HEALTH_CARE.DURATION,
                    effect: (s) => ({ ...s, gdp: s.gdp + CARD_DATA.UNIVERSAL_HEALTH_CARE.GDP_BOOST, support: s.support + CARD_DATA.UNIVERSAL_HEALTH_CARE.SUPPORT_BOOST })
                }]
            }),
            description: '全国民に医療保険を提供します。財政負担は大きいですが、長期的に見て国民の幸福度と生産性を高めます。',
            description_en: 'Provide health insurance to all citizens. A heavy fiscal burden, but increases long-term happiness and productivity.',
            tip: '【社会保障】充実した社会保障は、国民の生活満足度を高め、安定した社会の基盤となります。',
            tip_en: '[Social Security] A robust social security system enhances citizen well-being and forms the foundation of a stable society.',
            requiredAchievement: 'HIGH_SUPPORT',
        },
        {
            id: 1,
            name: '設備投資',
            name_en: 'Capital Investment',
            cost: 30,
            type: 'PRODUCTION',
            effect: (me, opp) => ({ ...me, income: me.income + 5, gdp: me.gdp + 10 }),
            description: '工場の機械などを購入し、生産能力を高めます。',
            description_en: 'Purchase factory machinery to increase production capacity.',
            tip: '【投資の乗数効果】投資は将来の生産力と所得を増やします。',
            tip_en: '[Multiplier Effect] Investment increases future production capacity and income.',
            providesTag: 'infrastructure',
            combosWith: ['infrastructure']
        },
        {
            id: 2,
            name: '技術革新',
            name_en: 'Tech Innovation',
            cost: 60,
            type: 'PRODUCTION',
            effect: (me, opp) => ({ ...me, income: me.income + 10, gdp: me.gdp + 30 }),
            description: 'AIやロボットなどの新技術を導入し、効率を劇的に上げます。',
            description_en: 'Adopt AI/robots to dramatically increase efficiency.',
            tip: '【イノベーション】技術進歩は経済成長の最大の要因の一つです。',
            tip_en: '[Innovation] Tech progress is a major growth factor.',
            providesTags: ['innovation', 'tech'],
            combosWith: ['education', 'infrastructure']
        },
        {
            id: 3,
            name: '公共事業',
            name_en: 'Public Works',
            cost: 40,
            type: 'POLICY',
            inflationChange: 2,
            supportChange: 8,
            effect: (me, opp) => ({
                ...me,
                gdp: me.gdp + 40,
                activeEffects: [...(me.activeEffects || []), {
                    name: '公共事業の維持費',
                    name_en: 'Maintenance Cost',
                    turnsLeft: 3,
                    effect: (s) => ({ ...s, income: Math.max(0, s.income - 5) })
                }]
            }),
            description: '大規模なインフラ整備を行います。GDPは大きく伸びますが、将来の維持費がかさみます。',
            description_en: 'Large-scale infrastructure. Boosts GDP but increases maintenance costs.',
            tip: '【財政政策】政府支出は即効性がありますが、将来の財政硬直化（維持費増大）を招くリスクもあります。',
            tip_en: '[Fiscal Policy] Quick impact, but risks future fiscal rigidity.',
            providesTag: 'infrastructure'
        },
        {
            id: 10,
            name: 'ポピュリズム政策',
            name_en: 'Populist Policy',
            cost: 10,
            type: 'POLICY',
            supportChange: 20,
            inflationChange: 1,
            effect: (me, opp) => ({
                ...me,
                gdp: Math.max(0, me.gdp - 15),
                activeEffects: [...(me.activeEffects || []), {
                    name: 'バラマキのツケ',
                    name_en: 'Cost of Populism',
                    turnsLeft: 2,
                    effect: (s) => ({ ...s, inflation: s.inflation + 3 })
                }]
            }),
            description: '現金給付などで支持率を爆上げしますが、成長を阻害し、近い将来インフレを招きます。',
            description_en: 'Cash handouts boost support, but hinder growth and cause inflation.',
            tip: '【ポピュリズム】短期的な人気取り政策は、長期的には経済の基礎的条件（ファンダメンタルズ）を悪化させることがあります。',
            tip_en: '[Populism] Short-term popularity often harms long-term fundamentals.'
        },
        {
            id: 11,
            name: '大規模構造改革',
            name_en: 'Structural Reform',
            cost: 30,
            type: 'POLICY',
            supportChange: -15,
            effect: (me, opp) => ({
                ...me,
                activeEffects: [...(me.activeEffects || []), {
                    name: '改革の成果',
                    name_en: 'Reform Success',
                    turnsLeft: 3,
                    effect: (s) => ({ ...s, gdp: s.gdp + 50 })
                }]
            }),
            description: '既得権益を打破します。国民の反発を招きますが、数ターン後に大きな成長をもたらします。',
            description_en: 'Break vested interests. Unpopular now, but brings huge growth later.',
            tip: '【構造改革】規制緩和や市場開放は、短期的には痛み（失業や反発）を伴いますが、長期的には生産性を向上させます。',
            tip_en: '[Structural Reform] Deregulation causes short-term pain but long-term gain.'
        },
        {
            id: 4,
            name: '金融緩和',
            name_en: 'Monetary Easing',
            cost: 0,
            type: 'POLICY',
            inflationChange: 1.5,
            supportChange: 2,
            effect: (me, opp) => ({ ...me, money: me.money + 40 }),
            description: '市場にお金を流し込み、一時的に資金を潤沢にします。',
            description_en: 'Supply money to the market for liquidity.',
            tip: '【マネタリーベース】金利を下げたりお金の供給量を増やし、投資を促します。',
            tip_en: '[Monetary Base] Lowering rates promotes investment.'
        },
        {
            id: 5,
            name: '増税',
            name_en: 'Tax Hike',
            cost: 0,
            type: 'POLICY',
            inflationChange: -1,
            supportChange: -12,
            baseSuccessRate: 90,
            effect: (me, opp) => ({ ...me, money: me.money + 60, gdp: me.gdp - 10 }),
            description: '税率を上げ資金を確保しますが、景気は少し冷え込みます。',
            description_en: 'Raise taxes to secure funds, cooling the economy.',
            tip: '【緊縮財政】財源確保には有効ですが、消費や投資を抑制する副作用があります。',
            tip_en: '[Fiscal Austerity] Secures revenue but suppresses consumption.',
            onFailure: (me) => ({ ...me, support: Math.max(0, me.support - 10) })
        },
        {
            id: 6,
            name: 'スタートアップ支援',
            name_en: 'Startup Support',
            cost: 20,
            type: 'PRODUCTION',
            supportChange: 4,
            effect: (me, opp) => ({ ...me, income: me.income + 8 }),
            description: '起業家を支援し、新たなビジネスを育てます。',
            description_en: 'Support entrepreneurs to nurture new business.',
            tip: '【新産業創出】新しい企業は将来の大きな税収源となります。',
            tip_en: '[New Industry] New firms become future tax sources.',
            providesTags: ['tech'],
            combosWith: ['innovation', 'education']
        },
        {
            id: 7,
            name: '関税引き上げ',
            name_en: 'Tariff Hike',
            cost: 15,
            type: 'ATTACK',
            targetSupportChange: -5,
            targetEffect: (opp) => ({ ...opp, income: Math.max(0, opp.income - 5), money: Math.max(0, opp.money - 10) }),
            description: '輸入品に税金をかけ、相手国の輸出産業にダメージを与えます。',
            description_en: 'Tax imports to damage rival export industries.',
            tip: '【保護貿易】自国産業を守る一方で、貿易戦争のリスクがあります。',
            tip_en: '[Protectionism] Protects domestic industry but risks trade war.'
        },
        {
            id: 8,
            name: '人材育成',
            name_en: 'Human Capital',
            cost: 25,
            type: 'PRODUCTION',
            supportChange: 5,
            effect: (me, opp) => ({ ...me, income: me.income + 3, gdp: me.gdp + 15 }),
            description: '教育に投資し、労働者のスキルを向上させます。',
            description_en: 'Invest in education to improve skills.',
            tip: '【人的資本】教育レベルの向上は、長期的な経済成長に不可欠です。',
            tip_en: '[Human Capital] Education is essential for long-term growth.',
            providesTag: 'education'
        },
        {
            id: 9,
            name: '大規模金融緩和',
            name_en: 'Massive Easing',
            cost: 0,
            type: 'POLICY',
            inflationChange: 3,
            supportChange: 5,
            baseSuccessRate: 80,
            effect: (me, opp) => ({ ...me, money: me.money + 100 }),
            description: '異次元の金融緩和を行い、市場に大量の資金を供給します。',
            description_en: 'Unprecedented easing. High risk of losing market confidence.',
            tip: '【リスク】失敗すると市場の信認を失い、支持率が急落します。',
            tip_en: '[Risk] Failure crashes support rate.',
            onFailure: (me) => ({ ...me, support: Math.max(0, me.support - 20) })
        },
        // --- Mission Reward Cards ---
        {
            id: 101,
            name: '緊急利下げ',
            name_en: 'Emergency Rate Cut',
            cost: 0,
            type: 'POLICY',
            effect: (me, opp) => ({ ...me, inflation: Math.max(-2, me.inflation - 3), gdp: me.gdp + 20 }),
            description: '【ミッション報酬】金融政策を総動員し、インフレを強力に抑制しつつ景気を刺激します。',
            description_en: '[Mission Reward] Mobilize monetary policy to strongly curb inflation while stimulating the economy.',
            tip: '【非伝統的金融政策】危機対応時には、通常の政策の枠を超えた大胆な措置が取られることがあります。',
            tip_en: '[Unconventional Monetary Policy] In a crisis, bold measures beyond normal policy may be taken.',
        },
        {
            id: 102,
            name: '国債買いオペ',
            name_en: 'QE Operation',
            cost: 0,
            type: 'POLICY',
            effect: (me, opp) => ({ ...me, debt: Math.max(0, me.debt - 50), money: me.money + 50, inflation: clampInflation(me.inflation + 1) }),
            description: '【ミッション報酬】中央銀行が国債を買い取り、政府債務を圧縮しつつ市場に資金を供給します。',
            description_en: '[Mission Reward] The central bank buys government bonds, reducing debt while supplying funds to the market.',
            tip: '【量的緩和】市場に資金を供給することで金利を下げ、経済を活性化させる効果が期待されますが、インフレ圧力も生みます。',
            tip_en: '[Quantitative Easing] Expected to lower interest rates and stimulate the economy, but also creates inflationary pressure.',
        },
        {
            id: 999,
            name: 'ヘリコプターマネー',
            name_en: 'Helicopter Money',
            cost: 0,
            type: 'POLICY',
            inflationChange: 5,
            supportChange: 10,
            effect: (me, opp) => ({ ...me, money: me.money + 200 }),
            description: '国民に直接現金を配ります。超強力な景気刺激策ですが、激しいインフレを招きます。',
            description_en: 'Direct cash handout. Huge stimulus, but causes severe inflation.',
            tip: '【禁じ手】中央銀行が紙幣を刷ってばら撒く政策。ハイパーインフレのリスクがあります。',
            tip_en: '[Last Resort] Printing money to distribute. Risks hyperinflation.',
            unlockCondition: (progress) => (progress.total_inflation_combos || 0) >= 10,
            unlockHint: "インフレコンボ（カードコンボ）を累計10回行う",
            unlockHint_en: "Perform 10 Inflation Combos total"
        }
    ];

    const MISSIONS = [
        {
            id: 'INFLATION_CRISIS',
            name: 'インフレ危機',
            name_en: 'Inflation Crisis',
            trigger: (player) => player.inflation >= 5 && player.inflation < 8,
            objective: (player) => player.inflation < 5,
            objective_text: '3ターン以内にインフレを 5% 未満にせよ',
            objective_text_en: 'Reduce inflation below 5% within 3 turns',
            turns: 3,
            rewardCardId: 101,
        },
        {
            id: 'DEBT_SPIRAL',
            name: '債務スパイラル懸念',
            name_en: 'Debt Spiral Risk',
            trigger: (player) => player.debt >= 150 && player.debt < 250,
            objective: (player) => player.debt < 150,
            objective_text: '3ターン以内に債務を 150兆 以下に戻せ',
            objective_text_en: 'Reduce debt below 150T within 3 turns',
            turns: 3,
            rewardCardId: 102,
        }
    ];

    const DIFFICULTY_SETTINGS = {
        BEGINNER: {
            id: 'BEGINNER',
            label: 'ビギナー',
            label_en: 'Beginner',
            targetGdp: 200,
            maxTurns: 40,
            initialMoney: 120,
            initialDebt: 0,
            eventDamageMultiplier: 0.5,
            description: '勝利条件GDPが低く、初期資金が多い。イベントの悪影響も半減します。',
            description_en: 'Low target GDP, high initial funds. Event damage halved.'
        },
        NORMAL: {
            id: 'NORMAL',
            label: 'ノーマル',
            label_en: 'Normal',
            targetGdp: 300,
            maxTurns: 40,
            initialMoney: 80,
            initialDebt: 0,
            eventDamageMultiplier: 1.0,
            description: '標準的なバランスです。',
            description_en: 'Standard balance.'
        },
        HARD: {
            id: 'HARD',
            label: 'ハード',
            label_en: 'Hard',
            targetGdp: 400,
            maxTurns: 40,
            initialMoney: 60,
            initialDebt: 30,
            eventDamageMultiplier: 1.5,
            description: '目標GDPが高く、初期債務を抱えた状態からスタート。イベントの悪影響も強まります。',
            description_en: 'High target GDP, start with debt. Stronger event damage.'
        }
    };

    // AI Logic Constants
    const MAX_STANDARD_CARD_ID = 100; // AI only plays cards with ID < 100

    const getPotentialActions = ({
        money,
        inflation,
        activeEvent = null,
        era = null,
        cards = ALL_CARDS,
        maxStandardCardId = MAX_STANDARD_CARD_ID,
    }) => {
        return cards.filter(
            (card) =>
                card.id < maxStandardCardId &&
                calculateInflatedCost(card.cost, inflation, activeEvent, era) <= money
        );
    };

    const getGameStatus = (player, enemy, difficulty, turn) => {
        const target = difficulty.targetGdp || 300;
        const maxTurns = difficulty.maxTurns || 40;
        if (player.gdp >= target) return { status: 'WIN', reason_ja: '経済目標達成！', reason_en: 'Economic Goal Achieved!' };
        if (enemy.gdp >= target) return { status: 'LOSE', reason_ja: 'ライバル国に敗北...', reason_en: 'Defeated by Rival...' };
        if (player.support <= 0) return { status: 'LOSE', reason_ja: '支持率低下により政権崩壊', reason_en: 'Administration collapsed due to low support' };
        if (enemy.support <= 0) return { status: 'WIN', reason_ja: 'ライバル国が自滅！', reason_en: 'Rival administration collapsed!' };
        if (turn >= maxTurns) return { status: 'LOSE', reason_ja: '制限ターンに到達して敗北', reason_en: 'Defeat: Turn limit reached' };
        return { status: 'ONGOING' };
    };

    const evaluateGame = (player, difficulty, isWin, ideology = null, lang = 'ja', completedMissionCount = 0) => {
        // 1. Basic Stats
        const gdp = player.gdp;
        const inflation = player.inflation;
        const debt = player.debt;
        const support = player.support;
        const rating = player.rating;

        // 2. Comments
        let comments = [];
        let nextGoals = [];

        const isEn = lang === 'en';

        // Ideology Rank Criteria (Defaults to Standard/Keynesian if null)
        const criteria = ideology?.rankCriteria || { minGdp: 400, maxInflation: 4, minInflation: 2, maxDebt: 100 };

        // Inflation Eval
        let inflationEval = isEn ? "Optimal" : "適正";
        if (inflation < 0) {
            inflationEval = isEn ? "Deflationary" : "デフレ気味";
            comments.push(isEn ? "Need to escape deflation" : "デフレ脱却が必要です");
        }
        else if (inflation < criteria.minInflation) { inflationEval = isEn ? "Low" : "やや低い"; }
        else if (inflation <= criteria.maxInflation) { inflationEval = isEn ? "Ideal" : "理想的"; }
        else if (inflation <= 8) { inflationEval = isEn ? "High" : "やや高い"; }
        else {
            inflationEval = isEn ? "Dangerous" : "危険水域";
            comments.push(isEn ? "Control inflation immediately" : "インフレ抑制を最優先に");
        }

        // Rank Logic
        let rank = 'C';
        let rankColor = 'text-slate-400';
        let rankLabel = 'NORMAL';

        if (!isWin) {
            rank = 'E';
            rankLabel = 'FAILED';
            rankColor = 'text-gray-500';
            nextGoals.push(isEn ? "Try to clear the game first!" : "まずはクリアを目指しましょう！");
        } else {
            // Check S (Ideology Specific)
            // Default S: GDP 400, Inf 2-4, Debt 100, AAA, Support 60
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

            // Monetarist Bonus: If inflation is perfectly managed, boost rank
            const bonusAchieved = ideology?.bonusCondition && ideology.bonusCondition(player);
            const effectiveRank = isS ? 'S' : (isA ? 'A' : 'B');

            // Mission Bonus: 1+ completed missions can boost an A rank to S
            const missionBonus = completedMissionCount > 0;

            if (isS || (isA && bonusAchieved && effectiveRank !== 'S') || (isA && missionBonus)) {
                rank = 'S';
                rankLabel = 'LEGENDARY';
                rankColor = 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]';
                if(missionBonus && !isS) {
                    nextGoals.unshift(isEn ? "Crisis Averted! A rank promoted to S." : "危機回避ボーナスでAランクから昇格！");
                }
                if(bonusAchieved) nextGoals.push(isEn ? "Bonus Goal (Inflation Control) Achieved!" : "ボーナス目標（インフレ抑制）も達成！");
                nextGoals.push(isEn ? "Perfect Management! No higher title exists." : "完璧な手腕です！これ以上の称号はありません。");
            } else if (isA) {
                rank = 'A';
                rankLabel = 'EXCELLENT';
                rankColor = 'text-emerald-400';
                // Advice for S
                if (gdp < criteria.minGdp) {
                    nextGoals.push(isEn ? `Aim for GDP ${criteria.minGdp}T next` : `次はGDP ${criteria.minGdp}兆円を目指そう`);
                }
                if (inflation < criteria.minInflation || inflation > criteria.maxInflation) {
                    nextGoals.push(
                        isEn
                            ? `Keep Inflation ${criteria.minInflation}-${criteria.maxInflation}%`
                            : `インフレ率 ${criteria.minInflation}-${criteria.maxInflation}% を目指そう`
                    );
                }
                if (debt > criteria.maxDebt) {
                    nextGoals.push(isEn ? `Keep Debt under ${criteria.maxDebt}T` : `債務 ${criteria.maxDebt}兆円以下の健全財政を目指そう`);
                }
                if (completedMissionCount === 0) {
                    nextGoals.push(isEn ? "Complete a mission for a rank bonus!" : "ミッション達成でランクボーナス！");
                }
            } else {
                rank = 'B';
                rankLabel = 'GOOD';
                rankColor = 'text-cyan-400';
                    // Advice for A
                if (inflation > 6) nextGoals.push(isEn ? "Keep Inflation under 5% for Rank A" : "インフレを 5%以下 に抑えてAランクを目指そう");
                if (debt > 200) nextGoals.push(isEn ? "Reduce Debt to maintain Rating" : "債務を減らして格付けを維持しよう");
                if (support < 50) nextGoals.push(isEn ? "Keep Support above 50%" : "支持率 50%以上 をキープしよう");
            }
        }

        // Default advice if empty
        if (nextGoals.length === 0) nextGoals.push(isEn ? "Aim for even greater heights..." : "さらなる高みを目指して...");

        return {
            rank,
            rankLabel,
            rankColor,
            stats: [
                { label: lang === 'en' ? 'Final GDP' : '最終GDP', value: `${gdp}${t('trillion', lang)}`, note: gdp >= 400 ? (lang === 'en' ? 'S Rank' : 'S基準達成') : '' },
                { label: lang === 'en' ? 'Inflation' : 'インフレ率', value: `${inflation.toFixed(1)}%`, note: inflationEval },
                { label: lang === 'en' ? 'Debt' : '債務残高', value: `${debt}${t('trillion', lang)}`, note: `${lang === 'en' ? 'Rating' : '格付'}:${rating}` },
                { label: lang === 'en' ? 'Support' : '支持率', value: `${support}%`, note: support >= 60 ? (lang === 'en' ? 'High' : '高支持') : '' },
            ],
            nextGoal: nextGoals[0]
        };
    };

const GameLogic = {
        UI_TEXT,
        getLoc,
        t,
        INFLATION_MIN,
        INFLATION_MAX,
        clampInflation,
        clampSupport,
        applyInflationDrift,
        applyInflationChange,
        RATING_TIERS,
        RATING_TIERS_DESC,
        getRatingByDebt,
        getRatingInfo,
        secureRandom,
        resolveBondRisk,
        EVENTS,
        ERAS,
        IDEOLOGIES,
        ACHIEVEMENTS,
        CARD_DATA,
        ALL_CARDS,
        MISSIONS,
        DIFFICULTY_SETTINGS,
        MAX_STANDARD_CARD_ID,
        getPotentialActions,
        getGameStatus,
        evaluateGame,
        calculateInflatedCost,
        getCardProvidedTags,
    };

export default GameLogic;
