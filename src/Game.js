
import React, { useState } from 'react';

// --- ゲームデータ定義 (Copied from index.html for testing) ---
// Simplified for testing logic

const EVENTS = [
    {
        id: 1,
        name: '原油ショック',
        description: '資源価格高騰であらゆる政策コストが20%上昇します。',
        effect: { costMultiplier: 1.2 },
    },
    // ... other events simplified or omitted if not needed for logic test
];

const INITIAL_DECK = [
    {
        id: 1,
        name: '設備投資',
        cost: 30,
        type: 'PRODUCTION',
        effect: (me, opp) => ({ ...me, income: me.income + 5, gdp: me.gdp + 10 }),
        description: '工場の機械などを購入し、生産能力を高めます。',
        tip: '【投資の乗数効果】投資は将来の生産力と所得を増やします。',
        providesTag: 'infrastructure',
        combosWith: ['infrastructure']
    },
    // ... other cards simplified
];

const WINNING_GDP = 300;
const INFLATION_MIN = -5;
const INFLATION_MAX = 15;

const RATING_TIERS = [
    { label: 'AAA', threshold: 0, interestMultiplier: 1, eventDamageMultiplier: 1 },
    { label: 'BBB', threshold: 150, interestMultiplier: 1.25, eventDamageMultiplier: 1.1 },
    { label: 'CCC', threshold: 250, interestMultiplier: 1.6, eventDamageMultiplier: 1.25 },
    { label: 'D', threshold: 400, interestMultiplier: 2, eventDamageMultiplier: 1.5 },
];

const getRatingByDebt = (debt = 0) => {
    const sorted = [...RATING_TIERS].sort((a, b) => b.threshold - a.threshold);
    const found = sorted.find(tier => debt >= tier.threshold);
    return found?.label ?? 'AAA';
};

const getRatingInfo = (rating = 'AAA') => RATING_TIERS.find(tier => tier.label === rating) ?? RATING_TIERS[0];

const clampInflation = (value) => Math.min(INFLATION_MAX, Math.max(INFLATION_MIN, Number(value.toFixed(1))));

const applyInflationDrift = (value) => {
    const drifted = value > 0 ? value - 0.3 : value < 0 ? value + 0.3 : 0;
    if (Math.abs(drifted) < 0.2) return 0;
    return clampInflation(drifted);
};

const applyInflationChange = (state, delta = 0) => {
    if (!delta) return state;
    return { ...state, inflation: clampInflation((state.inflation ?? 0) + delta) };
};

const calculateInflatedCost = (baseCost, inflationRate = 0) => {
    return Math.max(0, Math.round(baseCost * (1 + inflationRate / 100)));
};


function EconomicCardGame({ initialGdpForTest = 0 }) {
    const [turn, setTurn] = useState(1);
    const [gameState, setGameState] = useState('START'); // START, PLAYING, WON, LOST
    const [logs, setLogs] = useState(['ゲーム開始！目標：GDP 300兆円到達']);
    const [activeEvent, setActiveEvent] = useState(null);
    const [lastTags, setLastTags] = useState([]);

    // プレイヤー状態
    const [player, setPlayer] = useState({
        name: 'あなた',
        money: 100,
        income: 10,
        gdp: initialGdpForTest,
        inflation: 0,
        support: 70,
        debt: 0,
        rating: 'AAA',
        interestDue: 0,
    });
    const [playerHand, setPlayerHand] = useState([]);

    // AI状態
    const [enemy, setEnemy] = useState({
        name: 'ライバル国',
        money: 100,
        income: 10,
        gdp: 0,
        inflation: 0,
        support: 70,
        debt: 0,
        rating: 'AAA',
        interestDue: 0,
    });

    const addLog = (msg) => {
        setLogs(prev => [msg, ...prev].slice(0, 5));
    };

    const chooseRandomEvent = () => EVENTS[Math.floor(Math.random() * EVENTS.length)];

    const selectTurnEvent = () => {
        const event = chooseRandomEvent();
        setActiveEvent(event);
        addLog(`📢 今ターンのイベント: 「${event.name}」 - ${event.description}`);
    };

    // 初期化
    const startGame = () => {
        const event = chooseRandomEvent();
        setActiveEvent(event);
        setPlayer({ money: 80, income: 20, gdp: initialGdpForTest, inflation: 0, support: 70, debt: 0, rating: 'AAA', interestDue: 0 });
        setEnemy({ money: 80, income: 20, gdp: 0, inflation: 0, support: 70, debt: 0, rating: 'AAA', interestDue: 0 });
        setPlayerHand([]);
        setLastTags([]);
        setTurn(1);
        setLogs([`📢 今ターンのイベント: 「${event.name}」 - ${event.description}`, 'ゲーム開始！GDP 300兆円を目指せ！']);
        setGameState('PLAYING');
        drawCards(3);
    };

    // カードドロー機能
    const drawCards = (count) => {
        const newCards = [];
        for (let i = 0; i < count; i++) {
            const randomCard = INITIAL_DECK[Math.floor(Math.random() * INITIAL_DECK.length)];
            newCards.push({ ...randomCard, uniqueId: Math.random() });
        }
        setPlayerHand(prev => [...prev, ...newCards]);
    };

    const applyEventMultiplier = (prevState, nextState) => {
        if (!activeEvent?.effect?.effectMultiplier) return nextState;
        const multiplier = activeEvent.effect.effectMultiplier;
        const applyScale = (key) => {
            const delta = nextState[key] - prevState[key];
            return prevState[key] + Math.round(delta * multiplier);
        };
        return {
            ...nextState,
            money: applyScale('money'),
            income: applyScale('income'),
            gdp: applyScale('gdp'),
        };
    };

    const COMBO_MULTIPLIER = 1.3;

    const applyComboBonus = (prevState, nextState, matchedTags = []) => {
        if (!matchedTags.length) return nextState;
        const applyScale = (key) => {
            const delta = nextState[key] - prevState[key];
            return prevState[key] + Math.round(delta * COMBO_MULTIPLIER);
        };
        return {
            ...nextState,
            money: applyScale('money'),
            income: applyScale('income'),
            gdp: applyScale('gdp'),
        };
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

    const withEventMultiplier = (setter) => (updater) => setter(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return applyEventMultiplier(prev, next);
    });

    const calculateAdjustedCost = (baseCost, inflationRate = 0) => {
        const inflated = calculateInflatedCost(baseCost, inflationRate);
        if (!activeEvent?.effect?.costMultiplier) return inflated;
        return Math.max(0, Math.round(inflated * activeEvent.effect.costMultiplier));
    };

    const applySupportChange = (state, delta = 0, actorLabel, reason) => {
        if (!delta) return state;
        const prevSupport = state.support ?? 0;
        const nextSupport = Math.min(100, Math.max(0, prevSupport + delta));
        addLog(`${actorLabel}: ${reason}で支持率が${prevSupport}% → ${nextSupport}%に変化`);
        return { ...state, support: nextSupport };
    };

    const applyUnrestPenalty = (state, actorLabel) => {
        if (state.inflation < 8) return state;

        const angerLevel = state.inflation >= 12 ? '臨界' : state.inflation >= 10 ? '高まり' : '上昇';
        const incomePenalty = state.inflation >= 12 ? 4 : 2;
        const gdpPenalty = state.inflation >= 10 ? 5 : 0;
        const penalizedState = {
            ...state,
            income: Math.max(0, state.income - incomePenalty),
            gdp: Math.max(0, state.gdp - gdpPenalty),
        };

        addLog(`${actorLabel}: インフレ高騰により「国民の不満」が${angerLevel}、所得-${incomePenalty}${gdpPenalty ? ` / GDP-${gdpPenalty}` : ''}`);
        return penalizedState;
    };

    // プレイヤーのターン処理
    const playCard = (card) => {
        if (gameState !== 'PLAYING') return;

        const adjustedCost = calculateAdjustedCost(card.cost, player.inflation);
        const comboReadyTags = (card.combosWith ?? []).filter(tag => lastTags.includes(tag));
        const providedTags = getCardProvidedTags(card);

        let updatedEnemyState = null;

        if (player.money < adjustedCost) {
            addLog(`資金不足です（必要: ${adjustedCost}兆円、インフレ影響を反映）`);
            return;
        }

        const afterCost = { ...player, money: player.money - adjustedCost };

        let nextPlayerState = null;

        if (card.type === 'ATTACK') {
            const afterSupport = applySupportChange(afterCost, card.supportChange, 'あなた', `「${card.name}」の政治的影響`);
            nextPlayerState = afterSupport;
        } else {
            const afterEffect = card.effect(afterCost, enemy);
            const comboBoosted = applyComboBonus(afterCost, afterEffect, comboReadyTags);
            const afterEvent = applyEventMultiplier(afterCost, comboBoosted);
            const afterInflation = applyInflationChange(afterEvent, card.inflationChange);
            const afterUnrest = applyUnrestPenalty(afterInflation, 'あなた');
            const afterSupport = applySupportChange(afterUnrest, card.supportChange, 'あなた', `「${card.name}」の効果`);
            nextPlayerState = afterSupport;
        }

        setPlayer(nextPlayerState);

        // 効果発動
        if (card.type === 'ATTACK') {
            const eventAwareSetEnemy = withEventMultiplier(setEnemy);
            eventAwareSetEnemy(prev => {
                const effected = card.targetEffect ? card.targetEffect(prev, nextPlayerState) : prev;
                const comboBoosted = applyComboBonus(prev, effected, comboReadyTags);
                const unrested = applyUnrestPenalty(comboBoosted, 'ライバル');
                const withSupport = applySupportChange(unrested, card.targetSupportChange, 'ライバル', `「${card.name}」の影響`);
                updatedEnemyState = withSupport;
                return withSupport;
            });
        }

        // 手札から削除
        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));

        if (providedTags.length > 0) {
            setLastTags(prev => Array.from(new Set([...prev, ...providedTags])));
        }

        // FIXED: Check win condition with the NEW state
        return checkWinCondition(nextPlayerState, updatedEnemyState ?? enemy);
    };

    const checkWinCondition = (nextPlayer = player, nextEnemy = enemy) => {
        if (gameState !== 'PLAYING') return false;

        if (nextPlayer.gdp >= WINNING_GDP) {
            setGameState('WON');
            return true;
        }

        if (nextEnemy.gdp >= WINNING_GDP) {
            setGameState('LOST');
            return true;
        }

        return false;
    };

    return (
        <div>
            {gameState === 'START' && <button onClick={startGame}>Start Game</button>}
            {gameState === 'WON' && <div data-testid="victory-message">VICTORY!</div>}
            {gameState === 'PLAYING' && (
                 <div>
                     <div data-testid="player-gdp">{player.gdp}</div>
                     {playerHand.map(card => (
                         <button key={card.uniqueId} onClick={() => playCard(card)} data-testid="card">
                             {card.name}
                         </button>
                     ))}
                 </div>
            )}
        </div>
    );
}

export default EconomicCardGame;
