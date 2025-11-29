import React, { useState, useEffect, useRef } from 'react';

// This file is a self-contained module for testing the EconomicCardGame component.
// It includes all necessary sub-components, constants, and helper functions.

// --- Mocks for global objects that would normally be in index.html ---
const SoundManager = {
  init: () => {},
  isMuted: false,
  setMuted(value) {
    this.isMuted = Boolean(value);
  },
  toggleMute() {
    this.setMuted(!this.isMuted);
  },
  playTone: () => {},
  playClick: () => {},
  playError: () => {},
  playSuccess: () => {},
  playCard: () => {},
  playGameEnd: () => {},
  playCrisis: () => {},
  playDoom: () => {},
};

// --- Icon Components ---
const IconWallet = ({ size = 24, className = "" }) => <svg/>;
const IconTrendingUp = ({ size = 24, className = "" }) => <svg/>;
const IconZap = ({ size = 24, className = "" }) => <svg/>;
const IconShield = ({ size = 24, className = "" }) => <svg/>;
const IconAlertCircle = ({ size = 24, className = "" }) => <svg/>;
const IconArrowRight = ({ size = 24, className = "" }) => <svg/>;
const IconRefreshCw = ({ size = 24, className = "" }) => <svg/>;
const IconBookOpen = ({ size = 24, className = "" }) => <svg/>;
const IconVolume2 = ({ size = 24, className = "" }) => <svg/>;
const IconVolumeX = ({ size = 24, className = "" }) => <svg/>;
const IconGlobe = ({ size = 24, className = "" }) => <svg/>;

// --- Helper Functions and Constants ---
const UI_TEXT = {
    ja: {
        startGame: "ゲーム開始",
        yourHand: "Your Hand",
        endTurn: "ターン終了",
        myCountry: "自国 (あなた)",
        rivalCountry: "敵国",
        insufficientFunds: "資金が足りません",
    },
    en: {
        startGame: "START GAME",
        yourHand: "Your Hand",
        endTurn: "End Turn",
        myCountry: "My Country (YOU)",
        rivalCountry: "Rival Country",
        insufficientFunds: "Not enough money",
    },
};
const t = (key, lang) => UI_TEXT[lang][key] || key;
const getLoc = (obj, key, lang) => {
    const primaryKey = lang === 'en' ? `${key}_en` : key;
    const fallbackKey = lang === 'en' ? key : `${key}_en`;

    return (obj && (obj[primaryKey] || obj[fallbackKey])) || '';
};
const EVENTS = [{
    id: 1,
    name: '財政刺激策',
    name_en: 'Fiscal Stimulus',
    description: '短期的に資金を注入するが、債務が増加する。',
    description_en: 'Injects short-term funds while adding new debt.',
    effect: ({ player }) => ({
        player: { money: (player.money || 0) + 40, debt: (player.debt || 0) + 30 },
        logMessages: 'Fiscal stimulus applied: +40 money, +30 debt.',
    }),
}];
const ERAS = { GROWTH: { id: 'GROWTH', name: 'Growth', name_en: 'Growth', bgClass: '' }, STAGNATION: { id: 'STAGNATION' }, IT_REV: { id: 'IT_REV' } };
const IDEOLOGIES = {
  KEYNESIAN: { id: 'KEYNESIAN', name: 'Keynesian', name_en: 'Keynesian', label: 'Keynesian', label_en: 'Keynesian', description: 'desc', description_en: 'desc', features: [], features_en: [], initialStats: { support: 70, debt: 50, money: 120 }, deckWeights: {1: 1}, rankCriteria: {} },
};
const DEFAULT_CARD_EFFECT = (state) => state;
const withDefaultEffect = (card) => ({ ...card, effect: typeof card?.effect === 'function' ? card.effect : DEFAULT_CARD_EFFECT });

const ALL_CARDS = [
  { id: 1, name: 'テストカード', name_en: 'Test Card', cost: 10, type: 'PRODUCTION', description: 'desc', description_en: 'desc', combosWith: [] },
  { id: 2, name: '資源開発', name_en: 'Resource Development', cost: 8, type: 'PRODUCTION', description: 'desc', description_en: 'desc', combosWith: [] },
  { id: 3, name: '教育投資', name_en: 'Education Investment', cost: 12, type: 'POLICY', description: 'desc', description_en: 'desc', combosWith: [] },
].map(withDefaultEffect);
const CARD_TYPES = {
  PRODUCTION: { label: 'PROD', baseStyle: '', headerStyle: '', icon: <IconZap/> },
  POLICY: { label: 'POLICY', baseStyle: '', headerStyle: '', icon: <IconBookOpen/> },
  ATTACK: { label: 'DIPLO', baseStyle: '', headerStyle: '', icon: <IconShield/> },
};
const DIFFICULTY_SETTINGS = {
  NORMAL: { id: 'NORMAL', label: 'Normal', label_en: 'Normal', description: 'desc', description_en: 'desc', targetGdp: 300, initialMoney: 100, initialDebt: 0 },
  HARD: { id: 'HARD', label: 'Hard', label_en: 'Hard', description: 'desc', description_en: 'desc', targetGdp: 400, initialMoney: 80, initialDebt: 120 },
};

const getDifficultyById = (id) => DIFFICULTY_SETTINGS[id] || DIFFICULTY_SETTINGS.NORMAL;
const RATING_TIERS = [
  { label: 'AAA', threshold: 0, interestMultiplier: 1 },
  { label: 'BBB', threshold: 150, interestMultiplier: 1.25 },
  { label: 'CCC', threshold: 250, interestMultiplier: 1.6 },
  { label: 'D', threshold: 400, interestMultiplier: 2 },
];
const getRatingByDebt = (debt = 0) => {
  const sorted = [...RATING_TIERS].sort((a, b) => b.threshold - a.threshold);
  const found = sorted.find(tier => debt >= tier.threshold);
  return found?.label ?? 'AAA';
};
const getRatingInfo = (rating = 'AAA') => RATING_TIERS.find(tier => tier.label === rating) ?? RATING_TIERS[0];

const INFLATION_MIN = -5;
const INFLATION_MAX = 15;
const clampInflation = (value) => Math.min(INFLATION_MAX, Math.max(INFLATION_MIN, Number(value.toFixed(1))));

const calculateInflatedCost = (baseCost, inflationRate = 0) => {
    return Math.max(0, Math.round(baseCost * (1 + inflationRate / 100)));
};
const calculateSuccessRate = () => 100;
const evaluateGame = ({ player, enemy, difficulty, turn }) => {
    if (!player || !enemy || !difficulty) return { status: 'ONGOING' };

    const targetGdp = difficulty.targetGdp ?? Infinity;
    const maxTurns = difficulty.maxTurns ?? 40;
    const debtLimit = difficulty.debtLimit ?? 600;
    const minimumSupport = difficulty.minimumSupport ?? 1;

    if ((player.gdp ?? 0) >= targetGdp) {
        return {
            status: 'WIN',
            reason: 'ターゲットGDPを達成しました',
            detail: `GDP: ${player.gdp} / ${targetGdp}`,
            turn,
        };
    }

    if ((enemy.gdp ?? 0) >= targetGdp) {
        return {
            status: 'LOSE',
            reason: '敵国が先にターゲットGDPに到達しました',
            detail: `Enemy GDP: ${enemy.gdp} / ${targetGdp}`,
            turn,
        };
    }

    if ((player.debt ?? 0) >= debtLimit) {
        return {
            status: 'LOSE',
            reason: '国家債務が限界を超えました',
            detail: `Debt: ${player.debt} / ${debtLimit}`,
            turn,
        };
    }

    if ((player.support ?? 100) < minimumSupport) {
        return {
            status: 'LOSE',
            reason: '支持率が底をつきました',
            detail: `Support: ${player.support}%`,
            turn,
        };
    }

    if (turn > maxTurns) {
        return {
            status: 'LOSE',
            reason: 'ターン制限に到達しました',
            detail: `Turn: ${turn} / ${maxTurns}`,
            turn,
        };
    }

    return { status: 'ONGOING' };
};
const applyInflationChange = (state, delta = 0) => {
    if (!delta) return state;
    const nextInflation = clampInflation((state.inflation ?? 0) + delta);
    return { ...state, inflation: nextInflation };
};
const applyInflationDrift = (value, target = 0) => {
    const diff = target - value;
    const step = 0.3;
    if (Math.abs(diff) < step) return target;
    return clampInflation(value + (diff > 0 ? step : -step));
};

// --- Visual Components ---
const NumberCounter = ({ value }) => <span>{value}</span>;
const TurnOverlay = () => null;
const CrisisOverlay = ({ event, onClose, onConfirm, lang }) => {
    if (!event) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50" role="dialog" aria-modal="true">
            <div className="bg-white text-black p-6 rounded shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">{getLoc(event, 'name', lang)}</h2>
                <p className="mb-4">{getLoc(event, 'description', lang)}</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 border rounded" data-testid="event-close">
                        Close
                    </button>
                    <button onClick={onConfirm} className="px-3 py-1 bg-blue-600 text-white rounded" data-testid="event-confirm">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
const Confetti = () => null;
const CardInfoPanel = () => <div />;
const ComboGuidePanel = () => <div />;
const StatusPanel = ({ data, isEnemy, interest, isShaking, lang }) => {
    const inflationDisplay = Number.isFinite(data?.inflation) ? data.inflation.toFixed(1) : '0.0';
    const inflationTestId = isEnemy ? 'enemy-inflation' : 'player-inflation';

    return (
        <div>
            <h3>{isEnemy ? t('rivalCountry', lang) : t('myCountry', lang)}</h3>
            <div>GDP: <NumberCounter value={data.gdp} /></div>
            <div className="font-mono" data-testid={isEnemy ? 'enemy-money' : 'player-money'}>¥<NumberCounter value={data.money} /></div>
            <div className="font-mono" data-testid={isEnemy ? 'enemy-debt' : 'player-debt'}>Debt: <NumberCounter value={data.debt} /></div>
            <div className="font-mono" data-testid={inflationTestId}>Inflation: {inflationDisplay}%</div>
        </div>
    );
};

// --- Main Game Component ---
function EconomicCardGame({ initialDeck = ALL_CARDS }) {
    const [turn, setTurn] = useState(1);
    const [era, setEra] = useState(ERAS.GROWTH);
    const [gameState, setGameState] = useState('START');
    const [logs, setLogs] = useState([]);
    const [activeEvent, setActiveEvent] = useState(null);
    const [lastTags, setLastTags] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [lastPlayedCard, setLastPlayedCard] = useState(null);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [showTurnOverlay, setShowTurnOverlay] = useState(false);
    const [shake, setShake] = useState({ player: false, enemy: false });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [crisisAlert, setCrisisAlert] = useState(null);
    const [evaluation, setEvaluation] = useState(null);
    const [lang, setLang] = useState('en');
    const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL.id);
    const [currentDifficulty, setCurrentDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL);
    const [selectedIdeology, setSelectedIdeology] = useState(IDEOLOGIES.KEYNESIAN.id);
    const [gameDeck, setGameDeck] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const errorTimeoutRef = useRef(null);

    useEffect(() => {
        SoundManager.setMuted(isMuted);
    }, [isMuted]);
    const buildInitialPlayerState = (difficulty, ideology) => {
        const baseMoney = ideology.initialStats.money ?? DIFFICULTY_SETTINGS.NORMAL.initialMoney;
        const adjustedMoney = baseMoney + ((difficulty.initialMoney ?? DIFFICULTY_SETTINGS.NORMAL.initialMoney) - DIFFICULTY_SETTINGS.NORMAL.initialMoney);
        const initialDebt = difficulty.initialDebt ?? 0;
        return {
            money: adjustedMoney,
            gdp: 0,
            inflation: 0,
            support: ideology.initialStats.support || 70,
            debt: initialDebt,
            rating: getRatingByDebt(initialDebt),
            income: 20,
        };
    };
    const [player, setPlayer] = useState(() => buildInitialPlayerState(currentDifficulty, IDEOLOGIES[selectedIdeology]));
    const [enemy, setEnemy] = useState(() => ({ money: currentDifficulty.initialMoney, gdp: 0, inflation: 0, support: 70, debt: currentDifficulty.initialDebt, rating: getRatingByDebt(currentDifficulty.initialDebt), income: 20 }));
    const [playerHand, setPlayerHand] = useState([]);

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const addLog = (msg) => setLogs(prev => [msg, ...prev]);

    const clearErrorMessage = () => {
        if (errorTimeoutRef.current) {
            clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = null;
        }
        setErrorMessage('');
    };

    const showErrorMessage = (message) => {
        clearErrorMessage();
        setErrorMessage(message);
        errorTimeoutRef.current = setTimeout(() => {
            setErrorMessage('');
            errorTimeoutRef.current = null;
        }, 3000);
        if (!SoundManager.isMuted && typeof SoundManager.playError === 'function') {
            SoundManager.playError();
        }
    };

    const startGame = () => {
        const difficulty = getDifficultyById(selectedDifficulty);
        const ideology = IDEOLOGIES[selectedIdeology];
        const baseDeck = shuffleArray((initialDeck || ALL_CARDS).map(withDefaultEffect));
        const initialPlayerState = buildInitialPlayerState(difficulty, ideology);
        const initialDebt = difficulty.initialDebt ?? 0;
        setTurn(1);
        setLastTags([]);
        setFloatingTexts([]);
        setEvaluation(null);
        setShowTurnOverlay(false);
        setCrisisAlert(null);
        setHoveredCard(null);
        setShake({ player: false, enemy: false });
        setLastPlayedCard(null);
        clearErrorMessage();
        setPlayerHand([]);
        setDiscardPile([]);
        setGameDeck(baseDeck);
        setLogs([]);
        setActiveEvent(null);
        setCurrentDifficulty(difficulty);
        setPlayer(initialPlayerState);
        setEnemy({ money: difficulty.initialMoney, income: 20, gdp: 0, inflation: 0, support: 70, debt: initialDebt, rating: getRatingByDebt(initialDebt) });
        setGameState('PLAYING');
        drawCards(3, baseDeck, []);
    };

    const drawCards = (count, sourceDeck = null, sourceDiscard = null) => {
        let deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
        let discarded = sourceDiscard ? [...sourceDiscard] : [...discardPile];
        const drawnCards = [];
        for (let i = 0; i < count; i++) {
            if (deck.length === 0 && discarded.length > 0) {
                deck = shuffleArray(discarded);
                discarded = [];
                addLog('Discard pile reshuffled into deck.');
            }
            if (deck.length > 0) {
                const [card] = deck.splice(-1, 1);
                drawnCards.push({ ...card, uniqueId: Math.random() });
            }
        }
        if (drawnCards.length > 0) {
            setPlayerHand(prev => [...prev, ...drawnCards]);
        }
        setGameDeck(deck);
        setDiscardPile(discarded);
    };

    const playCard = (card, e) => {
        if (gameState !== 'PLAYING') return;
        const cost = calculateInflatedCost(card.cost, player.inflation);
        if (player.money < cost) {
            showErrorMessage(t('insufficientFunds', lang));
            return;
        }

        if (!SoundManager.isMuted) {
            SoundManager.playCard();
        }

        clearErrorMessage();
        let nextPlayerState = { ...player, money: player.money - cost };
        const cardEffect = typeof card?.effect === 'function' ? card.effect : DEFAULT_CARD_EFFECT;
        nextPlayerState = cardEffect(nextPlayerState, enemy);

        const playerInflationDelta = card.inflationChange || 0;
        const playerInflationBefore = nextPlayerState.inflation ?? 0;
        nextPlayerState = applyInflationChange(nextPlayerState, playerInflationDelta);
        if (nextPlayerState.inflation !== playerInflationBefore) {
            addLog(`Inflation adjusted to ${nextPlayerState.inflation.toFixed(1)}%.`);
        }

        const updatedRating = getRatingByDebt(nextPlayerState.debt);
        setPlayer({ ...nextPlayerState, rating: updatedRating });

        let nextEnemyState = enemy;
        let enemyWasTargeted = false;
        if (typeof card?.targetEffect === 'function') {
            nextEnemyState = card.targetEffect(nextEnemyState, nextPlayerState);
            enemyWasTargeted = true;
        }

        if (typeof card?.targetInflationChange === 'number') {
            const enemyInflationBefore = nextEnemyState.inflation ?? 0;
            nextEnemyState = applyInflationChange(nextEnemyState, card.targetInflationChange);
            if (nextEnemyState.inflation !== enemyInflationBefore) {
                addLog(`Enemy inflation adjusted to ${nextEnemyState.inflation.toFixed(1)}%.`);
            }
        }

        if (typeof card?.targetSupportChange === 'number') {
            const updatedSupport = Math.max(0, Math.min(100, (nextEnemyState.support ?? 0) + card.targetSupportChange));
            nextEnemyState = { ...nextEnemyState, support: updatedSupport };
            enemyWasTargeted = true;
        }

        if (enemyWasTargeted || nextEnemyState !== enemy) {
            setEnemy({ ...nextEnemyState });
            addLog(`${getLoc(card, 'name', lang)} impacted the enemy.`);
        }

        const providedTags = getCardProvidedTags(card);
        if (providedTags.length > 0) {
            setLastTags(providedTags);
        }

        const { uniqueId: _, ...discardedCard } = card;
        setDiscardPile(prev => [...prev, discardedCard]);
        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
        addLog(`${getLoc(card, 'name', lang)} played.`);
    };

    const getInterestForTurn = (state = player) => {
        const ratingInfo = getRatingInfo(state.rating);
        const baseInterest = state.interestDue ?? Math.round((state.debt ?? 0) * 0.02);
        return Math.max(0, Math.round(baseInterest * (ratingInfo?.interestMultiplier || 1)));
    };

    const endTurn = () => {
        if (gameState !== 'PLAYING') return;

        clearErrorMessage();

        setPlayer(prev => {
            const driftedInflation = applyInflationDrift(prev.inflation ?? 0, 0);
            if (driftedInflation !== (prev.inflation ?? 0)) {
                addLog(`Inflation drift: ${(prev.inflation ?? 0).toFixed(1)}% → ${driftedInflation.toFixed(1)}%.`);
            }
            const afterIncome = { ...prev, money: prev.money + (prev.income || 0), inflation: driftedInflation };
            const interest = getInterestForTurn(afterIncome);
            const afterInterest = { ...afterIncome, money: Math.max(0, afterIncome.money - interest) };
            if (interest > 0) {
                addLog(`Interest payment: -${interest}`);
            }
            addLog('Income received.');
            return afterInterest;
        });

        setEnemy(prev => {
            const driftedInflation = applyInflationDrift(prev.inflation ?? 0, 0);
            if (driftedInflation !== (prev.inflation ?? 0)) {
                addLog(`Enemy inflation drift: ${(prev.inflation ?? 0).toFixed(1)}% → ${driftedInflation.toFixed(1)}%.`);
            }
            const next = { ...prev, money: prev.money + (prev.income || 0), inflation: driftedInflation };
            addLog('Enemy acted.');
            return next;
        });

        drawCards(1);
        setTurn(prev => prev + 1);
    };

    const issueBonds = (amount = 50, interestRate = 0.1, defaultRisk = 0.02) => {
        if (gameState !== 'PLAYING') return;
        const interestDelta = Math.round(amount * interestRate);
        setPlayer(prev => {
            const updated = {
                ...prev,
                money: prev.money + amount,
                debt: (prev.debt || 0) + amount,
                interestDue: (prev.interestDue || 0) + interestDelta,
            };
            const nextRating = getRatingByDebt(updated.debt);
            addLog(`Issued bonds: +${amount} money, +${interestDelta}/turn interest, default risk ${Math.round(defaultRisk * 100)}%`);
            return { ...updated, rating: nextRating };
        });
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

    useEffect(() => {
        if (activeEvent && !SoundManager.isMuted) {
            SoundManager.playCrisis();
        }
    }, [activeEvent]);

    const resolveActiveEvent = () => {
        if (!activeEvent) return;

        const effectFn = typeof activeEvent.effect === 'function' ? activeEvent.effect : null;
        const result = effectFn ? effectFn({ player, enemy }) : {};
        const { player: playerChanges, enemy: enemyChanges, logMessages } = result || {};

        if (playerChanges) {
            setPlayer(prev => {
                const next = { ...prev, ...playerChanges };
                const rating = getRatingByDebt(next.debt ?? prev.debt);
                return { ...next, rating };
            });
        }

        if (enemyChanges) {
            setEnemy(prev => ({ ...prev, ...enemyChanges }));
        }

        const eventName = getLoc(activeEvent, 'name', lang);
        const eventLogs = [`Event triggered: ${eventName}`];
        if (playerChanges) {
            eventLogs.push('Player state updated by event.');
        }
        if (enemyChanges) {
            eventLogs.push('Enemy state updated by event.');
        }

        if (Array.isArray(logMessages)) {
            eventLogs.push(...logMessages.filter(Boolean));
        } else if (logMessages) {
            eventLogs.push(logMessages);
        }

        eventLogs.forEach(addLog);
        setActiveEvent(null);
    };

    useEffect(() => {
        if (gameState !== 'PLAYING') return;
        const result = evaluateGame({ player, enemy, difficulty: currentDifficulty, turn });
        if (result.status && result.status !== 'ONGOING') {
            setEvaluation(result);
            setGameState('END');
            if (!SoundManager.isMuted && typeof SoundManager.playGameEnd === 'function') {
                SoundManager.playGameEnd();
            }
        }
    }, [player, enemy, turn, currentDifficulty, gameState]);

    useEffect(() => {
        return () => clearErrorMessage();
    }, []);

    return (
        <div className={`min-h-screen ${era.bgClass}`}>
            <div>
                <button onClick={() => setLang('en')} data-testid="lang-en">English</button>
                <button onClick={() => setLang('ja')} data-testid="lang-ja">日本語</button>
                <button onClick={() => setIsMuted(prev => !prev)} data-testid="mute-toggle">
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
            </div>
            {gameState === 'START' && (
                <div>
                    <label>
                        Difficulty:
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            data-testid="difficulty-select"
                        >
                            {Object.values(DIFFICULTY_SETTINGS).map(diff => (
                                <option key={diff.id} value={diff.id}>{diff.label}</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={startGame}>{t('startGame', lang)}</button>
                </div>
            )}
            {gameState === 'PLAYING' && (
                <div>
                    <div>
                        <span data-testid="current-difficulty">Difficulty: {currentDifficulty.label}</span>
                        <span data-testid="target-gdp">Target GDP: <NumberCounter value={currentDifficulty.targetGdp} /></span>
                    </div>
                    <StatusPanel data={enemy} isEnemy={true} lang={lang} />
                    <StatusPanel data={player} isEnemy={false} lang={lang} />
                    <div>
                        <h3>{t('yourHand', lang)}</h3>
                        <div>
                            {playerHand.map(card => (
                                <button key={card.uniqueId} onClick={() => playCard(card)} data-testid={`card-${getLoc(card, 'name', lang)}`}>
                                    <h4>{getLoc(card, 'name', lang)}</h4>
                                </button>
                            ))}
                        </div>
                        {errorMessage && (
                            <div role="alert" className="text-red-600" data-testid="error-message">
                                {errorMessage}
                            </div>
                        )}
                        <button onClick={endTurn}>{t('endTurn', lang)}</button>
                        <button
                            onClick={() => setActiveEvent({ ...EVENTS[0], instanceId: Math.random() })}
                            data-testid="trigger-event"
                        >
                            Trigger Event
                        </button>
                    </div>
                </div>
            )}
            {gameState === 'END' && (
                <div data-testid="game-result">
                    <h2>Game End</h2>
                    <div>Result: {evaluation?.status || 'N/A'}</div>
                    <div>Reason: {evaluation?.reason || 'No evaluation'}</div>
                    {evaluation?.detail && <div>Detail: {evaluation.detail}</div>}
                    <div>Turns: {evaluation?.turn ?? turn}</div>
                    <button onClick={() => setGameState('START')}>Back to Start</button>
                    <button onClick={startGame}>Play Again</button>
                </div>
            )}
            <CrisisOverlay
                event={activeEvent}
                onClose={() => setActiveEvent(null)}
                onConfirm={resolveActiveEvent}
                lang={lang}
            />
        </div>
    );
}

export default EconomicCardGame;
export { SoundManager as SoundManagerInstance };
