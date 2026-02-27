import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import GameLogic from './logic.js';
import { SETTINGS_STORAGE_KEY, loadAndApplySettings, saveSettingsToStorage } from './settingsValidation.js';

// --- Game Logic Constants ---
const {
    t, getLoc,
    EVENTS, ERAS, IDEOLOGIES,
    ALL_CARDS, MISSIONS, DIFFICULTY_SETTINGS,
    INFLATION_MIN, INFLATION_MAX,
    getRatingByDebt, getRatingInfo,
    clampInflation, applyInflationDrift, applyInflationChange,
    MAX_STANDARD_CARD_ID, getPotentialActions,
    getGameStatus, evaluateGame, resolveBondRisk,
    secureRandom, calculateInflatedCost
} = GameLogic;

// --- Mocks ---
const SoundManager = {
    init: () => {},
    isMuted: false,
    setMuted(value) { this.isMuted = Boolean(value); },
    setVolume: () => {},
    toggleMute() { this.setMuted(!this.isMuted); },
    playTone: () => {},
    playClick: () => {},
    playError: () => {},
    playCoin: () => {},
    playSuccess: () => {},
    playCard: () => {},
    playGameEnd: () => {},
    playCrisis: () => {},
    playDoom: () => {},
};

// --- Icons ---
const IconZap = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconShield = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconAlertCircle = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconBookOpen = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IconVolume2 = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const IconVolumeX = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
const IconX = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconSettings = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconStar = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

// --- Config (UI) ---
const CARD_TYPES = {
    PRODUCTION: {
        label: '生産',
        label_en: 'PROD',
        baseStyle: 'bg-slate-800 border-cyan-800 hover:border-cyan-400 hover:shadow-cyan-500/20 text-cyan-100',
        headerStyle: 'bg-cyan-950/50 text-cyan-400 border-b border-cyan-900',
        icon: <IconZap size={14} className="text-cyan-400" />
    },
    POLICY: {
        label: '政策',
        label_en: 'POLICY',
        baseStyle: 'bg-slate-800 border-emerald-800 hover:border-emerald-400 hover:shadow-emerald-500/20 text-emerald-100',
        headerStyle: 'bg-emerald-950/50 text-emerald-400 border-b border-emerald-900',
        icon: <IconBookOpen size={14} className="text-emerald-400" />
    },
    ATTACK: {
        label: '外交',
        label_en: 'DIPLO',
        baseStyle: 'bg-slate-800 border-rose-800 hover:border-rose-400 hover:shadow-rose-500/20 text-rose-100',
        headerStyle: 'bg-rose-950/50 text-rose-400 border-b border-rose-900',
        icon: <IconShield size={14} className="text-rose-400" />
    },
};

// --- Visual Components ---
const BackgroundEffects = () => <div />; // Stub for tests
const Confetti = () => <div />; // Stub for tests

const ComboOverlay = ({ message, show }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none animate-fade-in">
            <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pop-in">
                {message}
            </div>
        </div>
    );
};

const NumberCounter = ({ value }) => <span>{value}</span>; // Simplified for tests

const TurnOverlay = ({ turn, show }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900/90 text-cyan-400 text-6xl font-black px-12 py-6 rounded-2xl border-4 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-pop-in">
                TURN {turn}
            </div>
        </div>
    );
};

const CrisisOverlay = ({ message, show, type = 'danger' }) => {
     if (!show) return null;
     const color = type === 'danger' ? 'text-red-500 border-red-600 bg-red-950/90' : 'text-amber-500 border-amber-600 bg-amber-950/90';

     return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
            <div className={`px-12 py-8 rounded-xl border-4 shadow-2xl animate-pop-in flex flex-col items-center ${color}`}>
                 <IconAlertCircle size={64} className="mb-4 animate-bounce" />
                 <h2 className="text-5xl font-black tracking-tighter uppercase mb-2 text-center whitespace-pre-wrap">{message}</h2>
                 <p className="text-xl font-bold opacity-80 uppercase tracking-widest">EMERGENCY ALERT</p>
            </div>
        </div>
     );
};

const TurnSummaryPanel = ({ data, onContinue, lang }) => {
    if (!data) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-pop-in">
                <h2 className="text-2xl font-black text-white mb-6 tracking-tighter">{t('turnSummary', lang).toUpperCase()} {data.turn}</h2>
                <button onClick={onContinue}>{t('continue', lang)}</button>
            </div>
        </div>
    );
};

const CardInfoPanel = ({ card, lang }) => {
    if (!card) return null;
    const typeInfo = CARD_TYPES[card.type];
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-fade-in shadow-lg">
            <div className={`px-4 py-3 border-b border-slate-800 flex items-center gap-2 ${typeInfo?.headerStyle?.replace('bg-', 'bg-opacity-20 bg-')}`}>
                 {typeInfo?.icon}
                 <span className="font-bold text-sm tracking-wider">{getLoc(card, 'name', lang)}</span>
            </div>
            <div className="p-4 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">{getLoc(card, 'description', lang)}</p>
            </div>
        </div>
    );
};

const MissionStatusContent = ({ activeMission, player, lang }) => {
    if (!activeMission) {
        return <p data-testid="mission-status-empty">{lang === 'en' ? 'No active mission' : '進行中ミッションなし'}</p>;
    }

    const isObjectiveMet = activeMission.objective(player);
    const missionName = getLoc(activeMission, 'name', lang);
    const objectiveText = getLoc(activeMission, 'objective_text', lang);

    return (
        <div data-testid="mission-status-active">
            <div data-testid="mission-name">{missionName}</div>
            <div data-testid="mission-turns">{lang === 'en' ? 'Turns left' : '残りターン'}: {activeMission.turnsRemaining}</div>
            <div data-testid="mission-objective">{objectiveText}</div>
            <div data-testid="mission-progress">{lang === 'en' ? 'Achievable now' : '現在達成可能'}: {isObjectiveMet ? '✅' : '❌'}</div>
        </div>
    );
};

const IdeologyMissionPanel = ({ activeMission, player, lang }) => (
    <div data-testid="ideology-mission-panel">
        <h4>{t('ideologyMission', lang)}</h4>
        <MissionStatusContent activeMission={activeMission} player={player} lang={lang} />
    </div>
);

const MissionPanel = ({ activeMission, player, completedMissionCount, lang }) => (
    <div data-testid="mission-panel">
        <h4>{lang === 'en' ? 'Mission' : 'ミッション'}</h4>
        <div data-testid="completed-mission-count">{lang === 'en' ? 'Completed' : '達成数'}: {completedMissionCount}</div>
        <MissionStatusContent activeMission={activeMission} player={player} lang={lang} />
    </div>
);
const FONT_SIZE_OPTIONS = ['small', 'medium', 'large'];

const SettingsModal = ({ isOpen, onClose, settings, onChange }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4" data-testid="settings-modal"> 
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3"> 
                <div className="flex items-center justify-between"> 
                    <h3 className="text-lg font-bold">Settings</h3>
                    <button onClick={onClose} aria-label="Close settings"><IconX size={18} /></button>
                </div>
                <label className="block"> 
                    Language
                    <select
                        value={settings.lang}
                        onChange={(event) => onChange('lang', event.target.value)}
                        data-testid="settings-lang"
                    >
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                    </select>
                </label>
                <label className="block"> 
                    Font size
                    <select
                        value={settings.fontSizeLevel}
                        onChange={(event) => onChange('fontSizeLevel', event.target.value)}
                        data-testid="settings-font-size"
                    >
                        {FONT_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                </label>
                <label className="block"> 
                    Master volume: {settings.masterVolume}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={settings.masterVolume}
                        onChange={(event) => onChange('masterVolume', Number(event.target.value))}
                        data-testid="settings-master-volume"
                    />
                </label>
                <label className="flex items-center gap-2"> 
                    <input
                        type="checkbox"
                        checked={settings.skipTurnSummary}
                        onChange={(event) => onChange('skipTurnSummary', event.target.checked)}
                        data-testid="settings-skip-summary"
                    />
                    Skip turn summary
                </label>
                <label className="flex items-center gap-2"> 
                    <input
                        type="checkbox"
                        checked={settings.isMuted}
                        onChange={(event) => onChange('isMuted', event.target.checked)}
                        data-testid="settings-muted"
                    />
                    Mute audio
                </label>
            </div>
        </div>
    );
};

const StatusPanel = ({ data, isEnemy }) => {
    if (!data) return <div className="p-4 border rounded text-red-500">Error: No Data</div>;
    return (
        <div className={`relative overflow-hidden p-6 rounded-3xl border transition-all duration-300`}>
            <div data-testid={isEnemy ? 'enemy-gdp' : 'player-gdp'}>GDP: <NumberCounter value={data.gdp} /></div>
            <div data-testid={isEnemy ? 'enemy-money' : 'player-money'}>¥<NumberCounter value={data.money} /></div>
            <div data-testid={isEnemy ? 'enemy-debt' : 'player-debt'}>Debt: <NumberCounter value={data.debt} /></div>
            <div data-testid={isEnemy ? 'enemy-inflation' : 'player-inflation'}>Inflation: {data.inflation?.toFixed(1)}%</div>
            <div data-testid={isEnemy ? 'enemy-support' : 'player-support'}>Support: <NumberCounter value={data.support} /></div>
        </div>
    );
};

// Pure Helpers extracted for performance
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


const calculateSuccessRate = (card, support) => {
    const base = card.baseSuccessRate ?? 100;
    if (base >= 100) return 100;
    const bonus = (support - 50) * 0.5;
    return Math.min(100, Math.max(0, Math.round(base + bonus)));
};

const CardButton = memo(({ card, onPlay, player, gameState, lang, activeEvent, era }) => {
     const typeInfo = CARD_TYPES[card.type];
     const typeLabel = lang === 'en' ? typeInfo.label_en : typeInfo.label;
     const inflatedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
     return (
        <button
            onClick={() => onPlay(card)}
            disabled={gameState !== 'PLAYING'}
            data-testid={`card-${getLoc(card, 'name', lang)}`}
            className={`card-button ${typeInfo.baseStyle}`}
        >
            <div className={`px-3 py-2 flex justify-between items-center ${typeInfo.headerStyle}`}>
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    {typeInfo.icon} {typeLabel}
                </span>
                <span className="font-mono text-lg font-black tracking-tighter">¥{inflatedCost}</span>
            </div>
            <h4 className="font-bold text-slate-200 text-sm mb-1.5 min-h-[2.5em] flex items-center leading-snug">
                {getLoc(card, 'name', lang)}
            </h4>
        </button>
     );
});

function EconomicCardGame({ initialDeck = null, randomFn = secureRandom }) {
    const rng = typeof randomFn === 'function' ? randomFn : secureRandom;
    const randomInt = (max) => Math.floor(rng() * max);
    const createRandomId = () => randomInt(Number.MAX_SAFE_INTEGER);
    const missionProcessedTurnRef = useRef(0);
    const [turn, setTurn] = useState(1);
    const [era] = useState(ERAS.GROWTH);
    const [gameState, setGameState] = useState('TITLE'); // TITLE, SETUP, PLAYING, WON, LOST
    const [skipTurnSummary, setSkipTurnSummary] = useState(false);
    const [autoProceed, setAutoProceed] = useState(false);
    const [logs, setLogs] = useState([]);
    const [activeEvent, setActiveEvent] = useState(null);
    const [lastTags, setLastTags] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [lang, setLang] = useState('ja');
    const [activeMission, setActiveMission] = useState(null);
    const [completedMissionCount, setCompletedMissionCount] = useState(0);
    const [turnSummaryData, setTurnSummaryData] = useState(null);
    const [showTurnSummary, setShowTurnSummary] = useState(false);
    const [turnHighlight, setTurnHighlight] = useState({ gdpGain: 0, text: '' });
    const [unlockedAchievements] = useState({});
    const [fontSizeLevel, setFontSizeLevel] = useState('medium');
    const [masterVolume, setMasterVolume] = useState(50);
    const [showSettings, setShowSettings] = useState(false);

    // Mock localStorage for tests if needed (useEffect handles it)

    // Difficulty State
    const [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL.id);
    const [currentDifficulty, setCurrentDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL);
    const [selectedIdeology, setSelectedIdeology] = useState(IDEOLOGIES.KEYNESIAN.id);
    const [gameDeck, setGameDeck] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [bondIssuedThisTurn, setBondIssuedThisTurn] = useState(false);

    const shuffleArray = (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = randomInt(i + 1);
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    useEffect(() => {
        if (typeof localStorage === 'undefined') return;
        loadAndApplySettings({
            setLang,
            setFontSizeLevel,
            setSkipTurnSummary,
            setIsMuted,
            setMasterVolume,
        }, localStorage, SETTINGS_STORAGE_KEY);
    }, []);

    useEffect(() => {
        if (typeof localStorage === 'undefined') return;
        saveSettingsToStorage(localStorage, {
            lang,
            fontSizeLevel,
            skipTurnSummary,
            isMuted,
            masterVolume,
        }, SETTINGS_STORAGE_KEY);
    }, [lang, fontSizeLevel, skipTurnSummary, isMuted, masterVolume]);

    useEffect(() => {
        SoundManager.setMuted(isMuted);
        SoundManager.setVolume(masterVolume / 100);
    }, [isMuted, masterVolume]);

    useEffect(() => {
        if (autoProceed) {
            setAutoProceed(false);
            proceedToNextTurn();
        }
    }, [autoProceed]);

    const [player, setPlayer] = useState({
        name: 'あなた',
        money: 100,
        income: 10,
        gdp: 0,
        inflation: 0,
        support: 70,
        debt: 0,
        rating: 'AAA',
        interestDue: 0,
    });
    const [playerHand, setPlayerHand] = useState([]);

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

    const applyUnrestPenalty = (state) => {
        if (!state) return state;
        if (state.inflation < 8) return state;
        const incomePenalty = state.inflation >= 12 ? 4 : 2;
        const gdpPenalty = state.inflation >= 10 ? 5 : 0;
        return {
            ...state,
            income: Math.max(0, state.income - incomePenalty),
            gdp: Math.max(0, state.gdp - gdpPenalty),
        };
    };

    const applySupportChange = (state, delta = 0) => {
        if (!delta) return state;
        const prevSupport = state.support ?? 0;
        const nextSupport = Math.min(100, Math.max(0, prevSupport + delta));
        return { ...state, support: nextSupport };
    };

    const applyRatingUpdate = (state) => {
        const nextRating = getRatingByDebt(state.debt ?? 0);
        return { ...state, rating: nextRating };
    };

    const getInterestForTurn = (state) => {
        const ratingInfo = getRatingInfo(state.rating);
        return Math.max(0, Math.round((state.interestDue ?? 0) * ratingInfo.interestMultiplier));
    };

    const applyInterestPayment = (state) => {
        const interest = getInterestForTurn(state);
        if (!interest) return state;
        return { ...state, money: Math.max(0, state.money - interest) };
    };

    const startGame = () => {
        const difficulty = DIFFICULTY_SETTINGS[selectedDifficulty];
        setCurrentDifficulty(difficulty);
        const ideology = IDEOLOGIES[selectedIdeology];

        let shuffledDeck;
        if (initialDeck) {
            shuffledDeck = shuffleArray([...initialDeck]);
        } else {
            const deckSource = ALL_CARDS;
            const availableCards = deckSource.filter(card => !card.requiredAchievement || unlockedAchievements[card.requiredAchievement]);

            const newDeck = [];
            availableCards.forEach(card => {
                const weight = ideology.deckWeights[card.id] || 1;
                for(let i=0; i<weight; i++) newDeck.push(card);
            });
            shuffledDeck = shuffleArray(newDeck);
        }
        setGameDeck(shuffledDeck);
        setDiscardPile([]);

        const event = EVENTS[0]; // Simple event for testing
        setActiveEvent(event);

        const initialDebt = (ideology.initialStats.debt || 0) + (difficulty.initialDebt || 0);
        const initialPlayerState = {
            money: (ideology.initialStats.money || 100) + (difficulty.initialMoney - DIFFICULTY_SETTINGS.NORMAL.initialMoney),
            income: 20,
            gdp: 0,
            inflation: 0,
            support: ideology.initialStats.support || 70,
            debt: initialDebt,
            rating: getRatingByDebt(initialDebt),
            interestDue: Math.round(initialDebt * 0.1),
            activeEffects: []
        };

        const initialEnemyState = {
            money: difficulty.initialMoney,
            income: 20,
            gdp: 0,
            inflation: 0,
            support: 70,
            debt: difficulty.initialDebt,
            rating: getRatingByDebt(difficulty.initialDebt),
            interestDue: Math.round(difficulty.initialDebt * 0.1),
            activeEffects: []
        };

        setPlayer(initialPlayerState);
        setEnemy({ ...initialEnemyState, name: 'ライバル国', activeEffects: [] });
        setPlayerHand([]);
        setLastTags([]);
        setTurn(1);
        setGameState('PLAYING');
        setActiveMission(null);
        setCompletedMissionCount(0);
        setBondIssuedThisTurn(false);
        missionProcessedTurnRef.current = 0;

        drawCards(3, shuffledDeck, []);
    };

    const addLog = useCallback((msg) => {
        setLogs(prev => [{ id: createRandomId(), message: msg }, ...prev].slice(0, 10));
    }, [randomFn]);

    const drawCards = (count, sourceDeck = null, sourceDiscard = null) => {
        let deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
        let discarded = sourceDiscard ? [...sourceDiscard] : [...discardPile];
        const drawnCards = [];

        for (let i = 0; i < count; i++) {
            if (deck.length === 0) {
                if (discarded.length === 0) break;
                deck = shuffleArray(discarded);
                discarded = [];
            }
            const [card] = deck.splice(-1, 1);
            drawnCards.push({ ...card, uniqueId: createRandomId() });
        }

        if (drawnCards.length > 0) {
            setPlayerHand(prev => [...prev, ...drawnCards]);
        }
        setGameDeck(deck);
        setDiscardPile(discarded);
    };

    const issueBonds = () => {
        if (gameState !== 'PLAYING') return;
        if (bondIssuedThisTurn) return;
        setPlayer(prev => {
            const updated = {
                ...prev,
                money: prev.money + 50,
                debt: (prev.debt ?? 0) + 50,
                interestDue: (prev.interestDue ?? 0) + 5,
            };
            return applyRatingUpdate(updated, 'あなた');
        });
        setBondIssuedThisTurn(true);
        addLog(lang === 'en' ? 'Issued bonds: Funds +50, Debt +50, Interest +5' : '国債発行: 資金+50、債務+50、利払+5');
    };

    const repayDebt = () => {
        if (gameState !== 'PLAYING') return;
        if (player.money < 50) return;
        if ((player.debt || 0) <= 0) return;

        setPlayer(prev => {
            const updated = {
                ...prev,
                money: prev.money - 50,
                debt: Math.max(0, (prev.debt ?? 0) - 50),
                interestDue: Math.max(0, (prev.interestDue ?? 0) - 5),
            };
            return applyRatingUpdate(updated, 'あなた');
        });
    };

    const applyEventMultiplier = (prevState, nextState) => {
        const evtMultiplier = activeEvent?.effect?.effectMultiplier || 1;
        const difficultyMult = currentDifficulty.eventDamageMultiplier || 1;

        const applyScale = (key) => {
            const delta = nextState[key] - prevState[key];
            let scaledDelta = Math.round(delta * evtMultiplier);
            if (scaledDelta < 0) scaledDelta = Math.round(scaledDelta * difficultyMult);
            return prevState[key] + scaledDelta;
        };

        if (evtMultiplier === 1 && difficultyMult === 1) return nextState;

        return {
            ...nextState,
            money: applyScale('money'),
            income: applyScale('income'),
            gdp: applyScale('gdp'),
        };
    };

    const applyComboBonus = (prevState, nextState, multiplier = 1) => {
        const normalizedMultiplier = Number.isFinite(multiplier) ? multiplier : Number(multiplier) || 1;
        if (normalizedMultiplier <= 1.0) return nextState;
        const applyScale = (key) => {
            const delta = nextState[key] - prevState[key];
            if (delta <= 0) return prevState[key];
            return prevState[key] + Math.round(delta * normalizedMultiplier);
        };
        return {
            ...nextState,
            money: applyScale('money'),
            income: applyScale('income'),
            gdp: applyScale('gdp'),
        };
    };


    const computeEnemyAfterAttack = (enemyState, cardState, nextPlayerState, comboMultiplier) => {
        const effected = cardState.targetEffect ? cardState.targetEffect(enemyState, nextPlayerState) : enemyState;
        const comboBoosted = applyComboBonus(enemyState, effected, comboMultiplier);
        const unrested = applyUnrestPenalty(comboBoosted, 'ライバル');
        return applySupportChange(unrested, cardState.targetSupportChange, 'ライバル');
    };

    const checkForNewMission = useCallback((playerState) => {
        if (activeMission) return;

        const foundMission = MISSIONS.find((mission) => mission.trigger(playerState));
        if (!foundMission) return;

        setActiveMission({
            ...foundMission,
            turnsRemaining: foundMission.turns,
        });
        addLog(`${lang === 'en' ? 'New mission:' : '新規ミッション:'} ${getLoc(foundMission, 'name', lang)}`);
    }, [activeMission, addLog, lang]);

    const processMissionAtTurnEnd = useCallback((playerState) => {
        if (!activeMission) {
            checkForNewMission(playerState);
            return;
        }

        const missionCompleted = activeMission.objective(playerState);
        if (missionCompleted) {
            const rewardCard = ALL_CARDS.find((card) => card.id === activeMission.rewardCardId);
            if (rewardCard) {
                setPlayerHand((prev) => [...prev, { ...rewardCard, uniqueId: createRandomId() }]);
                addLog(`${lang === 'en' ? 'Mission complete! Reward card added:' : 'ミッション達成！報酬カード獲得:'} ${getLoc(rewardCard, 'name', lang)}`);
            } else {
                addLog(lang === 'en' ? 'Mission complete!' : 'ミッション達成！');
            }
            setCompletedMissionCount((prev) => prev + 1);
            setActiveMission(null);
            checkForNewMission(playerState);
            return;
        }

        const turnsRemaining = activeMission.turnsRemaining - 1;
        if (turnsRemaining <= 0) {
            addLog(`${lang === 'en' ? 'Mission failed:' : 'ミッション失敗:'} ${getLoc(activeMission, 'name', lang)}`);
            setActiveMission(null);
            checkForNewMission(playerState);
            return;
        }

        setActiveMission((prev) => (prev ? { ...prev, turnsRemaining } : prev));
    }, [activeMission, checkForNewMission, addLog, lang]);

    const checkWinCondition = useCallback((nextPlayer = player, nextEnemy = enemy, currentTurn = turn) => {
        if (gameState !== 'PLAYING') return false;

        const gameStatus = getGameStatus(nextPlayer, nextEnemy, currentDifficulty, currentTurn);
        if (gameStatus.status === 'ONGOING') return false;

        const isWin = gameStatus.status === 'WIN';
        setGameState(isWin ? 'WON' : 'LOST');
        SoundManager.playGameEnd(isWin);

        const result = evaluateGame(nextPlayer, currentDifficulty, isWin, IDEOLOGIES[selectedIdeology], lang, completedMissionCount);
        setEvaluation(result);
        return true;
    }, [gameState, player, enemy, currentDifficulty, turn, lang, completedMissionCount, selectedIdeology]);

    const playCard = useCallback((card) => {
        if (gameState !== 'PLAYING') return;

        const adjustedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
        const comboReadyTags = (card.combosWith ?? []).filter(tag => lastTags.includes(tag));
        const providedTags = getCardProvidedTags(card);

        const isTech = providedTags.includes('tech');
        const eraMultiplier = (era.id === 'IT_REV' && isTech) ? 2 : 1;

        if (player.money < adjustedCost) {
            addLog(t('insufficientFunds', lang));
            return;
        }

        const successRate = calculateSuccessRate(card, player.support);
        const roll = rng() * 100;
        const isSuccess = roll < successRate;

        const afterCost = { ...player, money: player.money - adjustedCost };
        let nextPlayerState = null;

        if (!isSuccess) {
            let penaltyState = afterCost;
            if (card.onFailure) penaltyState = card.onFailure(penaltyState);
            nextPlayerState = penaltyState;
            setPlayer(nextPlayerState);
                setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
            const { uniqueId: _discardedUniqueId, ...baseCard } = card;
            setDiscardPile(prev => [...prev, baseCard]);
            setLastTags([]);
            return checkWinCondition(nextPlayerState, enemy);
        }

        let comboMultiplier = 1.0;
        if (comboReadyTags.length > 0) {
            comboMultiplier = 1.3;
        }

        if (card.type === 'ATTACK') {
            const afterSupport = applySupportChange(afterCost, card.supportChange, 'あなた');
            nextPlayerState = afterSupport || afterCost;
        } else {
            const baseState = card.effect(afterCost, enemy) || afterCost;
            let boostedState = baseState;
            if (eraMultiplier > 1) {
                 const keys = ['money', 'income', 'gdp'];
                 const boosted = { ...baseState };
                 keys.forEach(key => {
                     const delta = baseState[key] - afterCost[key];
                     if (delta !== 0) boosted[key] = afterCost[key] + delta * eraMultiplier;
                 });
                 boostedState = boosted;
            }
            if (era.id === 'GROWTH') {
                const currentGdp = boostedState ? boostedState.gdp : afterCost.gdp;
                const deltaGdp = currentGdp - afterCost.gdp;
                if (deltaGdp > 0 && boostedState) {
                    boostedState.gdp = afterCost.gdp + Math.round(deltaGdp * 1.5);
                }
            }
            const comboBoosted = applyComboBonus(afterCost, boostedState, comboMultiplier);
            const afterEvent = applyEventMultiplier(afterCost, comboBoosted);
            let inflationDelta = card.inflationChange || 0;
            if (era.id === 'GROWTH' && inflationDelta > 0) inflationDelta += 1;
            const afterInflation = applyInflationChange(afterEvent, inflationDelta);
            const afterUnrest = applyUnrestPenalty(afterInflation, 'あなた');
            const afterSupport = applySupportChange(afterUnrest, card.supportChange, 'あなた');
            nextPlayerState = afterSupport || afterCost;
        }

        const gdpGain = nextPlayerState.gdp - player.gdp;
        if (gdpGain > turnHighlight.gdpGain) {
            setTurnHighlight({ gdpGain, text: 'gain' });
        }
        setPlayer(nextPlayerState);

        let nextEnemyState = enemy;
        if (card.type === 'ATTACK') {
            nextEnemyState = computeEnemyAfterAttack(enemy, card, nextPlayerState, comboMultiplier);
            setEnemy(nextEnemyState);
        }

        if (card.tip) {
            addLog(`Memo: ${getLoc(card, 'tip', lang)}`);
        }

        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
        const { uniqueId: _discardedUniqueId, ...baseCard } = card;
        setDiscardPile(prev => [...prev, baseCard]);

        if (providedTags.length > 0) {
            setLastTags(providedTags);
        } else {
            setLastTags([]);
        }

        checkForNewMission(nextPlayerState);
        return checkWinCondition(nextPlayerState, nextEnemyState);
    }, [gameState, player, enemy, lang, activeEvent, era, lastTags, gameDeck, discardPile, turnHighlight, checkForNewMission, checkWinCondition, addLog]);

    const aiTurn = () => {
        let driftTarget = 0;
        let eraIncomePenalty = 0;
        if (era.id === 'STAGNATION') {
            driftTarget = -2;
            eraIncomePenalty = 5;
        }
        let currentEnemyState = { ...enemy };
        const drifted = applyInflationDrift(currentEnemyState.inflation, driftTarget);
        const afterDrift = { ...currentEnemyState, inflation: drifted };
        const ratingInfo = getRatingInfo(afterDrift.rating);
        const incomePenalty = Math.round((activeEvent?.effect?.incomePenalty ?? 0) * ratingInfo.eventDamageMultiplier + eraIncomePenalty);
        const aiIncomeGain = Math.max(0, afterDrift.income - incomePenalty);
        let afterIncome = { ...afterDrift, money: afterDrift.money + aiIncomeGain };
        afterIncome = applyInterestPayment(afterIncome, 'ライバル');
        const ratedEnemy = applyRatingUpdate(afterIncome, 'ライバル');
        const unrestAdjusted = applyUnrestPenalty(ratedEnemy, 'ライバル');

        const potentialActions = getPotentialActions({
            money: unrestAdjusted.money,
            inflation: unrestAdjusted.inflation,
            activeEvent,
            era,
            cards: ALL_CARDS,
            maxStandardCardId: MAX_STANDARD_CARD_ID,
        });

        if (potentialActions.length === 0) {
            setEnemy(unrestAdjusted);
            return checkWinCondition(player, unrestAdjusted);
        }

        const aiCard = potentialActions[randomInt(potentialActions.length)];
        const inflatedCost = calculateInflatedCost(aiCard.cost, unrestAdjusted.inflation, activeEvent, era);
        let afterPayment = { ...unrestAdjusted, money: unrestAdjusted.money - inflatedCost };

        if (aiCard.type === 'ATTACK') {
            const afterSupport = applySupportChange(afterPayment, aiCard.supportChange, 'ライバル');
            const effected = aiCard.targetEffect ? aiCard.targetEffect(player, afterSupport) : player;
            const unrested = applyUnrestPenalty(effected, 'あなた');
            const finalPreEvent = applySupportChange(unrested, aiCard.targetSupportChange, 'あなた');
            const finalPlayer = applyEventMultiplier(player, finalPreEvent);
            setEnemy(afterSupport);
            setPlayer(finalPlayer);
            return checkWinCondition(finalPlayer, afterSupport);
        }

        const afterEffect = applyEventMultiplier(afterPayment, aiCard.effect(afterPayment, player));
        const afterInflation = applyInflationChange(afterEffect, aiCard.inflationChange);
        const unrested = applyUnrestPenalty(afterInflation, 'ライバル');
        const afterSupport = applySupportChange(unrested, aiCard.supportChange, 'ライバル');
        setEnemy(afterSupport);
        return checkWinCondition(player, afterSupport);
    };

    const proceedToNextTurn = () => {
        setShowTurnSummary(false);
        if (missionProcessedTurnRef.current !== turn) {
            processMissionAtTurnEnd(player);
            missionProcessedTurnRef.current = turn;
        }
        if (checkWinCondition(player, enemy, turn)) return;
        const aiEndedGame = aiTurn();
        if (!aiEndedGame) {
            const nextTurn = turn + 1;
            if (checkWinCondition(player, enemy, nextTurn)) return;
            setTurn(nextTurn);
            drawCards(1);
        }
        setLastTags([]);
        setTurnHighlight({ gdpGain: 0, text: '' });
    };

    const updateSetting = (key, value) => {
        const handlers = {
            lang: setLang,
            fontSizeLevel: setFontSizeLevel,
            skipTurnSummary: setSkipTurnSummary,
            isMuted: setIsMuted,
            masterVolume: setMasterVolume,
        };
        const handler = handlers[key];
        if (handler) {
            handler(value);
        }
    };

    const fontSizeClass = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    }[fontSizeLevel] ?? 'text-base';

    const endTurn = () => {
        if (gameState !== 'PLAYING' || showTurnSummary) return;
        setBondIssuedThisTurn(false);
        let currentPlayerState = { ...player };
        let driftTarget = 0;
        let eraIncomePenalty = 0;
        if (era.id === 'STAGNATION') {
            driftTarget = -2;
            eraIncomePenalty = 5;
        }
        const diffMult = currentDifficulty.eventDamageMultiplier || 1;
        const driftedInflation = applyInflationDrift(currentPlayerState.inflation, driftTarget);
        const ratingInfo = getRatingInfo(currentPlayerState.rating);
        let basePenalty = (activeEvent?.effect?.incomePenalty ?? 0) * ratingInfo.eventDamageMultiplier + eraIncomePenalty;
        const incomePenalty = Math.round(basePenalty * diffMult);
        const playerIncomeGain = Math.max(0, currentPlayerState.income - incomePenalty);
        let playerAfterIncome = {
            ...currentPlayerState,
            money: currentPlayerState.money + playerIncomeGain,
            inflation: driftedInflation,
        };
        playerAfterIncome = applyInterestPayment(playerAfterIncome, 'あなた');
        const ratedPlayer = applyRatingUpdate(playerAfterIncome, 'あなた');
        const unrestApplied = applyUnrestPenalty(ratedPlayer, 'あなた');
        setPlayer(unrestApplied);
        processMissionAtTurnEnd(unrestApplied);
        missionProcessedTurnRef.current = turn;

        const summary = {
            turn,
            highlight: turnHighlight.text || 'turn end',
            warnings: []
        };
        setTurnSummaryData(summary);
        if (skipTurnSummary) {
            setAutoProceed(true);
        } else {
            setShowTurnSummary(true);
        }
    };

    return (
        <div className={`min-h-screen ${era.bgClass} ${fontSizeClass}`}>
            <div className="flex items-center gap-2"> 
                <button onClick={() => setLang('en')} data-testid="lang-en">English</button>
                <button onClick={() => setLang('ja')} data-testid="lang-ja">日本語</button>
                <button onClick={() => setIsMuted(prev => !prev)} data-testid="mute-toggle" className="inline-flex items-center gap-1">
                    {isMuted ? <IconVolumeX size={16} /> : <IconVolume2 size={16} />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>
                <button onClick={() => setShowSettings(true)} data-testid="open-settings"><IconSettings size={16} /></button>
            </div>
            {gameState === 'TITLE' && (
                <div>
                    <button onClick={() => setGameState('SETUP')}>START GAME</button>
                </div>
            )}
            {gameState === 'SETUP' && (
                <div>
                    <label>
                        Difficulty:
                        <select
                            value={selectedDifficulty}
                            onChange={(event) => setSelectedDifficulty(event.target.value)}
                            data-testid="difficulty-select"
                        >
                            {Object.values(DIFFICULTY_SETTINGS).map(diff => (
                                <option key={diff.id} value={diff.id}>{diff.label}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Ideology:
                        <select
                            value={selectedIdeology}
                            onChange={(event) => setSelectedIdeology(event.target.value)}
                            data-testid="ideology-select"
                        >
                            {Object.values(IDEOLOGIES).map((ideology) => (
                                <option key={ideology.id} value={ideology.id}>{getLoc(ideology, 'name', lang)}</option>
                            ))}
                        </select>
                    </label>
                    <button onClick={startGame}>START GAME</button>
                </div>
            )}
            {gameState === 'PLAYING' && (
                <div>
                    <div>
                        <span data-testid="current-difficulty">Difficulty: {currentDifficulty.label}</span>
                        <span data-testid="target-gdp">Target GDP: <NumberCounter value={currentDifficulty.targetGdp} /></span>
                        <span data-testid="turn-indicator">Turn: {turn} / {currentDifficulty.maxTurns} (Remaining: {Math.max(0, currentDifficulty.maxTurns - turn)})</span>
                    </div>
                    <StatusPanel data={enemy} isEnemy={true} lang={lang} />
                    <StatusPanel data={player} isEnemy={false} lang={lang} />
                    <MissionPanel activeMission={activeMission} player={player} completedMissionCount={completedMissionCount} lang={lang} />
                    <IdeologyMissionPanel activeMission={activeMission} player={player} lang={lang} />
                    <div>
                        <h3>{t('yourHand', lang)}</h3>
                        <div>
                            {playerHand.map(card => (
                                <CardButton key={card.uniqueId} card={card} onPlay={playCard} player={player} gameState={gameState} lang={lang} activeEvent={activeEvent} era={era} />
                            ))}
                        </div>
                        <button onClick={repayDebt} disabled={gameState !== 'PLAYING' || (player.debt || 0) <= 0 || player.money < 50}>Repay</button>
                        <button onClick={issueBonds} disabled={gameState !== 'PLAYING' || bondIssuedThisTurn}>{t('bond', lang)}</button>
                        <button onClick={endTurn}>{t('endTurn', lang)}</button>
                        <button onClick={() => setActiveEvent(EVENTS[0])} data-testid="trigger-event">Trigger Event</button>
                    </div>
                    <div data-testid="log-panel">
                        <h4>Activity Log</h4>
                        <ul>
                            {logs.map((entry) => (
                                <li key={entry.id}>{entry.message}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {gameState === 'WON' || gameState === 'LOST' ? (
                <div data-testid="game-result">
                    <h2>Game End</h2>
                    <div>Result: {gameState}</div>
                    <div>Reason: {evaluation?.rankLabel}</div>
                    <button onClick={() => setGameState('TITLE')}>Back to Start</button>
                </div>
            ) : null}
            <TurnSummaryPanel data={turnSummaryData} onContinue={proceedToNextTurn} lang={lang} />
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={{ lang, fontSizeLevel, skipTurnSummary, isMuted, masterVolume }}
                onChange={updateSetting}
            />
        </div>
    );
}

export default EconomicCardGame;
export { SoundManager as SoundManagerInstance, evaluateGame, resolveBondRisk, clampInflation, INFLATION_MIN, INFLATION_MAX, CrisisOverlay, applyInflationDrift, secureRandom, getGameStatus };
