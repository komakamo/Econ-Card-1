import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import GameLogic from './logic';

// --- Game Logic Constants ---
const {
    UI_TEXT, t, getLoc,
    EVENTS, ERAS, IDEOLOGIES, ACHIEVEMENTS,
    ALL_CARDS, MISSIONS, DIFFICULTY_SETTINGS,
    INFLATION_MIN, INFLATION_MAX,
    RATING_TIERS, getRatingByDebt, getRatingInfo,
    clampInflation, applyInflationDrift, applyInflationChange,
    MAX_STANDARD_CARD_ID,
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
const IconWallet = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>;
const IconTrendingUp = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const IconZap = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconShield = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconAlertCircle = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const IconArrowRight = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconRefreshCw = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const IconBookOpen = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const IconVolume2 = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const IconVolumeX = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
const IconX = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconSettings = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconGlobe = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconAward = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>;
const IconStar = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconLock = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const IconType = ({ size = 24, className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>;

const ICON_MAP = {
    IconStar: IconStar,
};

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

const ComboGuidePanel = () => <div />;

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
const CardEncyclopediaPanel = ({ onClose }) => <button onClick={onClose}>Close</button>;
const SettingsModal = ({ isOpen, onClose, settings, onChange }) => isOpen ? <button onClick={onClose}>Close</button> : null;

const StatusPanel = ({ data, isEnemy, interest, isShaking, lang }) => {
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

const CardButton = memo(({ card, onPlay, onHover, player, gameState, lastTags, lang, activeEvent, era }) => {
     const typeInfo = CARD_TYPES[card.type];
     const inflatedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
     const canAfford = player.money >= inflatedCost;

     return (
        <button
            onClick={(e) => onPlay(card, e)}
            onMouseEnter={() => onHover(card)}
            onMouseLeave={() => onHover(null)}
            disabled={gameState !== 'PLAYING'}
            data-testid={`card-${getLoc(card, 'name', lang)}`}
            className={`card-button ${typeInfo.baseStyle}`}
        >
            <div className={`px-3 py-2 flex justify-between items-center ${typeInfo.headerStyle}`}>
                <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    {typeInfo.icon} {typeInfo.label}
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
    const [era, setEra] = useState(ERAS.GROWTH);
    const [gameState, setGameState] = useState('TITLE'); // TITLE, SETUP, PLAYING, WON, LOST
    const [skipTurnSummary, setSkipTurnSummary] = useState(false);
    const [autoProceed, setAutoProceed] = useState(false);
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
    const [lang, setLang] = useState('ja');
    const [comboMessage, setComboMessage] = useState(null);
    const [comboChain, setComboChain] = useState({ tag: null, count: 0 });
    const [activeMission, setActiveMission] = useState(null);
    const [completedMissionCount, setCompletedMissionCount] = useState(0);
    const [turnSummaryData, setTurnSummaryData] = useState(null);
    const [showTurnSummary, setShowTurnSummary] = useState(false);
    const [turnHighlight, setTurnHighlight] = useState({ gdpGain: 0, text: '' });
    const [earnedTitles, setEarnedTitles] = useState({});
    const [unlockedAchievements, setUnlockedAchievements] = useState({});
    const [discoveredCards, setDiscoveredCards] = useState({});
    const [showEncyclopedia, setShowEncyclopedia] = useState(false);
    const [gameProgress, setGameProgress] = useState({
        monetarist_rank_a_count: 0,
        total_inflation_combos: 0,
    });
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

    const addFloatingText = () => {}; // Stub

    const applyUnrestPenalty = (state, actorLabel) => {
        if (state.inflation < 8) return state;
        const incomePenalty = state.inflation >= 12 ? 4 : 2;
        const gdpPenalty = state.inflation >= 10 ? 5 : 0;
        return {
            ...state,
            income: Math.max(0, state.income - incomePenalty),
            gdp: Math.max(0, state.gdp - gdpPenalty),
        };
    };

    const applySupportChange = (state, delta = 0, actorLabel, reason) => {
        if (!delta) return state;
        const prevSupport = state.support ?? 0;
        const nextSupport = Math.min(100, Math.max(0, prevSupport + delta));
        return { ...state, support: nextSupport };
    };

    const applyRatingUpdate = (state, actorLabel) => {
        const nextRating = getRatingByDebt(state.debt ?? 0);
        return { ...state, rating: nextRating };
    };

    const getInterestForTurn = (state) => {
        const ratingInfo = getRatingInfo(state.rating);
        return Math.max(0, Math.round((state.interestDue ?? 0) * ratingInfo.interestMultiplier));
    };

    const applyInterestPayment = (state, actorLabel) => {
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

    const issueBonds = (e) => {
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

    const repayDebt = (e) => {
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

    const withEventMultiplier = (setter) => (updater) => setter(prev => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return applyEventMultiplier(prev, next);
    });

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

    const playCard = useCallback((card, e) => {
        if (gameState !== 'PLAYING') return;

        const adjustedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
        const comboReadyTags = (card.combosWith ?? []).filter(tag => lastTags.includes(tag));
        const providedTags = getCardProvidedTags(card);

        const isTech = providedTags.includes('tech');
        const eraMultiplier = (era.id === 'IT_REV' && isTech) ? 2 : 1;

        let updatedEnemyState = null;

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
            setLastPlayedCard(card);
            setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
            const { uniqueId: _, ...baseCard } = card;
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
            nextPlayerState = afterSupport;
        } else {
            const baseState = card.effect(afterCost, enemy);
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
            nextPlayerState = afterSupport;
        }

        const gdpGain = nextPlayerState.gdp - player.gdp;
        if (gdpGain > turnHighlight.gdpGain) {
            setTurnHighlight({ gdpGain, text: 'gain' });
        }
        setPlayer(nextPlayerState);

        if (card.type === 'ATTACK') {
            const eventAwareSetEnemy = withEventMultiplier(setEnemy);
            eventAwareSetEnemy(prev => {
                const effected = card.targetEffect ? card.targetEffect(prev, nextPlayerState) : prev;
                const comboBoosted = applyComboBonus(prev, effected, comboMultiplier);
                const unrested = applyUnrestPenalty(comboBoosted, 'ライバル');
                const withSupport = applySupportChange(unrested, card.targetSupportChange, 'ライバル');
                updatedEnemyState = withSupport;
                return withSupport;
            });
        }

        if (card.tip) {
            addLog(`Memo: ${getLoc(card, 'tip', lang)}`);
        }

        setLastPlayedCard(card);
        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
        const { uniqueId: _, ...baseCard } = card;
        setDiscardPile(prev => [...prev, baseCard]);

        if (providedTags.length > 0) {
            setLastTags(providedTags);
        } else {
            setLastTags([]);
        }

        checkForNewMission(nextPlayerState);
        return checkWinCondition(nextPlayerState, updatedEnemyState ?? enemy);
    }, [gameState, player, enemy, lang, activeEvent, era, lastTags, gameDeck, discardPile, discoveredCards, gameProgress, comboChain, turnHighlight, checkForNewMission, checkWinCondition, addLog, unlockedAchievements, earnedTitles, currentDifficulty, selectedIdeology, completedMissionCount]);

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

        const potentialActions = ALL_CARDS.filter(c => c.id < MAX_STANDARD_CARD_ID && calculateInflatedCost(c.cost, unrestAdjusted.inflation, activeEvent, era) <= unrestAdjusted.money);

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
        const interestPaid = getInterestForTurn(playerAfterIncome);
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
        <div className={`min-h-screen ${era.bgClass}`}>
            <div>
                <button onClick={() => setLang('en')} data-testid="lang-en">English</button>
                <button onClick={() => setLang('ja')} data-testid="lang-ja">日本語</button>
                <button onClick={() => setIsMuted(prev => !prev)} data-testid="mute-toggle">
                    {isMuted ? 'Unmute' : 'Mute'}
                </button>
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
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            data-testid="difficulty-select"
                        >
                            {Object.values(DIFFICULTY_SETTINGS).map(diff => (
                                <option key={diff.id} value={diff.id}>{diff.label}</option>
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
                                <CardButton key={card.uniqueId} card={card} onPlay={playCard} onHover={setHoveredCard} player={player} gameState={gameState} lastTags={lastTags} lang={lang} activeEvent={activeEvent} era={era} />
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
        </div>
    );
}

export default EconomicCardGame;
export { SoundManager as SoundManagerInstance, evaluateGame, resolveBondRisk, clampInflation, INFLATION_MIN, INFLATION_MAX, CrisisOverlay, applyInflationDrift, secureRandom, getGameStatus };
