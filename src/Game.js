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
  playCoin: () => {},
  playSuccess: () => {},
  playCard: () => {},
  playGameEnd: () => {},
  playCrisis: () => {},
  playDoom: () => {},
};

// --- Icon Components ---
const IconWallet = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 7h16a2 2 0 0 1 2 2v7a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2Z" />
    <path d="M4 10V7a2 2 0 0 1 2-2h12" />
    <path d="M16 13h2" />
  </svg>
);

const IconTrendingUp = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconZap = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconShield = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const IconAlertCircle = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconArrowRight = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconRefreshCw = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
    <path d="M20.49 15A9 9 0 0 1 6.36 18.36L1 14" />
  </svg>
);

const IconBookOpen = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 4h7a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2Z" />
    <path d="M22 4h-7a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h8Z" />
  </svg>
);

const IconVolume2 = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeX = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

const IconGlobe = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
  </svg>
);

// --- Helper Functions and Constants ---
const UI_TEXT = {
    ja: {
        startGame: "ゲーム開始",
        yourHand: "手札",
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
}, {
    id: 2,
    name: '景気後退',
    name_en: 'Recession',
    description: '需要減退で成長が鈍化し、支持率が下落する。',
    description_en: 'Demand collapses, dragging growth and public support.',
    effect: ({ player, enemy }) => {
        const playerGdpLoss = Math.max(5, Math.round((player.gdp || 0) * 0.15));
        const enemyGdpLoss = Math.max(5, Math.round((enemy.gdp || 0) * 0.12));
        return {
            player: { gdp: Math.max(0, (player.gdp || 0) - playerGdpLoss), support: (player.support || 0) - 6 },
            enemy: { gdp: Math.max(0, (enemy.gdp || 0) - enemyGdpLoss), support: (enemy.support || 0) - 4 },
            logMessages: [
                `Recession hit: Player GDP -${playerGdpLoss}, support -6%.`,
                `Enemy GDP -${enemyGdpLoss}, support -4%.`,
            ],
        };
    },
}, {
    id: 3,
    name: '資源ブーム',
    name_en: 'Commodity Boom',
    description: '資源価格の高騰で税収が増え、インフレ圧力も高まる。',
    description_en: 'Soaring commodity prices boost revenue but fuel inflation.',
    effect: ({ player, enemy }) => {
        const playerWindfall = 35;
        const enemyWindfall = 20;
        return {
            player: { money: (player.money || 0) + playerWindfall, inflationChange: 0.6 },
            enemy: { money: (enemy.money || 0) + enemyWindfall, inflationChange: 0.4 },
            logMessages: [
                `Commodity boom delivered +${playerWindfall} money and lifted inflation for you.`,
                `Rival gained +${enemyWindfall} money amid rising prices.`,
            ],
        };
    },
}, {
    id: 4,
    name: '政局不安',
    name_en: 'Political Crisis',
    description: '政府の混乱で支持率が急落し、借入コストも跳ね上がる。',
    description_en: 'Government turmoil sinks approval and spikes borrowing costs.',
    effect: ({ player, enemy }) => {
        const supportHit = 10;
        const debtShock = Math.max(8, Math.round((player.debt || 0) * 0.08));
        return {
            player: { support: (player.support || 0) - supportHit, debt: (player.debt || 0) + debtShock, interestDue: (player.interestDue || 0) + 3 },
            enemy: { support: (enemy.support || 0) + 2 },
            logMessages: [
                `Political crisis: -${supportHit}% support, +${debtShock} debt, interest costs rise.`,
                'Rival capitalizes on your chaos with a small support bump.',
            ],
        };
    },
}, {
    id: 5,
    name: '技術革新',
    name_en: 'Tech Breakthrough',
    description: '生産性が向上し、経済に新たな追い風が吹く。',
    description_en: 'Productivity leaps forward, invigorating the economy.',
    effect: ({ player, enemy }) => {
        const playerGrowth = 18;
        const enemyGrowth = 12;
        return {
            player: { gdp: (player.gdp || 0) + playerGrowth, support: (player.support || 0) + 5, inflationChange: 0.2 },
            enemy: { gdp: (enemy.gdp || 0) + enemyGrowth },
            logMessages: [
                `Tech breakthrough: +${playerGrowth} GDP, +5% support, slight inflation uptick.`,
                `Rival economy follows with +${enemyGrowth} GDP.`,
            ],
        };
    },
}];
const ERAS = { GROWTH: { id: 'GROWTH', name: 'Growth', name_en: 'Growth', bgClass: '' }, STAGNATION: { id: 'STAGNATION' }, IT_REV: { id: 'IT_REV' } };
const IDEOLOGIES = {
  KEYNESIAN: { id: 'KEYNESIAN', name: 'Keynesian', name_en: 'Keynesian', label: 'Keynesian', label_en: 'Keynesian', description: 'desc', description_en: 'desc', features: [], features_en: [], initialStats: { support: 70, debt: 50, money: 120 }, deckWeights: {1: 1}, rankCriteria: {} },
};
const DEFAULT_CARD_EFFECT = (state) => state;
const applyStateChange = (prevState, changes = {}) => {
  const { inflationChange, inflation, support, ...rest } = changes || {};
  let nextState = { ...prevState, ...rest };

  if (typeof inflationChange === 'number') {
    nextState = applyInflationChange(nextState, inflationChange);
  } else if (typeof inflation === 'number') {
    nextState = { ...nextState, inflation: clampInflation(inflation) };
  }

  if (typeof support === 'number') {
    nextState = { ...nextState, support: clampSupport(support) };
  }

  return nextState;
};
const withDefaultEffect = (card) => ({ ...card, effect: typeof card?.effect === 'function' ? card.effect : DEFAULT_CARD_EFFECT });

const ALL_CARDS = [
  {
    id: 1,
    name: '社会資本投資',
    name_en: 'Infrastructure Stimulus',
    cost: 10,
    type: 'PRODUCTION',
    description: '公共事業でGDPを押し上げるが、国債発行が増える。',
    description_en: 'Public works lift GDP but require new bond issuance.',
    effect: (state) => {
      const gdpGain = 25;
      const debtRise = 15;
      const supportGain = 3;
      return {
        player: {
          gdp: (state.gdp || 0) + gdpGain,
          debt: (state.debt || 0) + debtRise,
          support: (state.support || 0) + supportGain,
        },
        logMessages: `Infrastructure Stimulus executed: +${gdpGain} GDP, +${supportGain}% support, +${debtRise} debt.`,
      };
    },
    combosWith: [],
  },
  {
    id: 2,
    name: '緊縮財政',
    name_en: 'Austerity Drive',
    cost: 8,
    type: 'POLICY',
    description: '歳出削減で債務を抑えるが、支持率が低下し景気も冷え込む。',
    description_en: 'Cut spending to slow debt growth at the cost of popularity and momentum.',
    effect: (state) => {
      const debtCut = Math.min(25, state.debt || 0);
      const supportHit = 8;
      const gdpDrag = 5;
      return {
        player: {
          debt: Math.max(0, (state.debt || 0) - debtCut),
          support: (state.support || 0) - supportHit,
          gdp: Math.max(0, (state.gdp || 0) - gdpDrag),
          inflationChange: -0.5,
        },
        logMessages: `Austerity tightened the budget: -${debtCut} debt, -${supportHit}% support, -${gdpDrag} GDP, inflation cooled slightly.`,
      };
    },
    combosWith: [],
  },
  {
    id: 3,
    name: 'サイバー制裁',
    name_en: 'Cyber Sanctions',
    cost: 9,
    type: 'ATTACK',
    description: '敵国の金融網を狙い、資金と支持を削ぐ。',
    description_en: 'Disrupt rival financial networks to sap funds and morale.',
    effect: (state, opponent) => {
      const enemyGdpHit = 15;
      const enemyMoneyHit = 10;
      const enemySupportHit = 8;
      return {
        player: { support: (state.support || 0) + 2 },
        enemy: {
          gdp: Math.max(0, (opponent?.gdp || 0) - enemyGdpHit),
          money: Math.max(0, (opponent?.money || 0) - enemyMoneyHit),
          support: clampSupport((opponent?.support || 0) - enemySupportHit),
        },
        logMessages: `Cyber Sanctions drained enemy resources: -${enemyMoneyHit} money, -${enemyGdpHit} GDP, -${enemySupportHit}% support.`,
      };
    },
    combosWith: [],
  },
].map(withDefaultEffect);
const CARD_TYPES = {
  PRODUCTION: { label: 'PROD', baseStyle: '', headerStyle: '', icon: <IconZap/> },
  POLICY: { label: 'POLICY', baseStyle: '', headerStyle: '', icon: <IconBookOpen/> },
  ATTACK: { label: 'DIPLO', baseStyle: '', headerStyle: '', icon: <IconShield/> },
};
const DIFFICULTY_SETTINGS = {
  NORMAL: { id: 'NORMAL', label: 'Normal', label_en: 'Normal', description: 'desc', description_en: 'desc', targetGdp: 300, initialMoney: 100, initialDebt: 0, maxTurns: 40 },
  HARD: { id: 'HARD', label: 'Hard', label_en: 'Hard', description: 'desc', description_en: 'desc', targetGdp: 400, initialMoney: 80, initialDebt: 120, maxTurns: 35 },
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
const clampSupport = (value = 0) => Math.max(0, Math.min(100, value));

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

    if ((enemy.debt ?? 0) >= debtLimit) {
        return {
            status: 'WIN',
            reason: '敵国の債務が限界を超えました',
            detail: `Debt: ${enemy.debt} / ${debtLimit}`,
            turn,
        };
    }

    if ((enemy.support ?? 100) < minimumSupport) {
        return {
            status: 'WIN',
            reason: '敵国の支持率が底をつきました',
            detail: `Support: ${enemy.support}%`,
            turn,
        };
    }

    const playerReachedTarget = (player.gdp ?? 0) >= targetGdp;
    const enemyReachedTarget = (enemy.gdp ?? 0) >= targetGdp;

    if (playerReachedTarget && enemyReachedTarget) {
        return {
            status: 'DRAW',
            reason: '双方が同時にターゲットGDPに到達しました',
            detail: `Player GDP: ${player.gdp} / ${targetGdp}, Enemy GDP: ${enemy.gdp} / ${targetGdp}`,
            turn,
        };
    }

    if (enemyReachedTarget) {
        return {
            status: 'LOSE',
            reason: '敵国が先にターゲットGDPに到達しました',
            detail: `Enemy GDP: ${enemy.gdp} / ${targetGdp}`,
            turn,
        };
    }

    if (playerReachedTarget) {
        return {
            status: 'WIN',
            reason: 'ターゲットGDPを達成しました',
            detail: `GDP: ${player.gdp} / ${targetGdp}`,
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
            <div data-testid={isEnemy ? 'enemy-gdp' : 'player-gdp'}>GDP: <NumberCounter value={data.gdp} /></div>
            <div className="font-mono" data-testid={isEnemy ? 'enemy-money' : 'player-money'}>¥<NumberCounter value={data.money} /></div>
            <div className="font-mono" data-testid={isEnemy ? 'enemy-debt' : 'player-debt'}>Debt: <NumberCounter value={data.debt} /></div>
            <div className="font-mono" data-testid={inflationTestId}>Inflation: {inflationDisplay}%</div>
            <div className="font-mono" data-testid={isEnemy ? 'enemy-support' : 'player-support'}>Support: <NumberCounter value={data.support} />%</div>
        </div>
    );
};

// --- Main Game Component ---
const resolveBondRisk = ({ amount, defaultRisk, randomFn = Math.random, state }) => {
    const rng = typeof randomFn === 'function' ? randomFn : Math.random;
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

function EconomicCardGame({ initialDeck = ALL_CARDS, randomFn = Math.random }) {
    const [turn, setTurn] = useState(1);
    const [era, setEra] = useState(ERAS.GROWTH);
    const [gameState, setGameState] = useState('START');
    const [logs, setLogs] = useState([]);
    const [activeEvent, setActiveEvent] = useState(null);
    const [eventQueue, setEventQueue] = useState([]);
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
        const ideologyDebt = ideology.initialStats.debt ?? 0;
        const difficultyDebt = difficulty.initialDebt ?? 0;
        const combinedDebt = ideologyDebt + difficultyDebt;
        return {
            money: adjustedMoney,
            gdp: 0,
            inflation: 0,
            support: ideology.initialStats.support || 70,
            debt: combinedDebt,
            rating: getRatingByDebt(combinedDebt),
            income: 20,
        };
    };
    const [player, setPlayer] = useState(() => buildInitialPlayerState(currentDifficulty, IDEOLOGIES[selectedIdeology]));
    const [enemy, setEnemy] = useState(() => ({ money: currentDifficulty.initialMoney, gdp: 0, inflation: 0, support: 70, debt: currentDifficulty.initialDebt, rating: getRatingByDebt(currentDifficulty.initialDebt), income: 20 }));
    const [playerHand, setPlayerHand] = useState([]);
    const [isResolvingTurn, setIsResolvingTurn] = useState(false);

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
        setDiscardPile([]);
        setGameDeck(baseDeck);
        setLogs([]);
        setActiveEvent(null);
        setEventQueue([]);
        setCurrentDifficulty(difficulty);
        setPlayer(initialPlayerState);
        setEnemy({ money: difficulty.initialMoney, income: 20, gdp: 0, inflation: 0, support: 70, debt: initialDebt, rating: getRatingByDebt(initialDebt) });
        setGameState('PLAYING');
        drawCards(3, baseDeck, [], { replaceHand: true });
    };

    const drawCards = (count, sourceDeck = null, sourceDiscard = null, options = {}) => {
        const { replaceHand = false } = options;
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
        if (replaceHand) {
            setPlayerHand(drawnCards);
        } else if (drawnCards.length > 0) {
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
        const effectResult = cardEffect(nextPlayerState, enemy);
        let logMessages = [];
        let nextEnemyState = enemy;
        let enemyWasTargeted = false;

        if (effectResult && (effectResult.player || effectResult.enemy || effectResult.logMessages)) {
            const { player: playerChanges, enemy: enemyChanges, logMessages: effectLogs } = effectResult;
            if (playerChanges) {
                nextPlayerState = applyStateChange(nextPlayerState, playerChanges);
            }
            if (enemyChanges) {
                nextEnemyState = applyStateChange(nextEnemyState, enemyChanges);
                enemyWasTargeted = true;
            }
            if (Array.isArray(effectLogs)) {
                logMessages = effectLogs.filter(Boolean);
            } else if (effectLogs) {
                logMessages = [effectLogs];
            }
        } else if (effectResult) {
            nextPlayerState = effectResult;
        }

        const clampedSupport = Math.max(0, Math.min(100, nextPlayerState.support ?? 0));
        nextPlayerState = { ...nextPlayerState, support: clampedSupport };

        const playerInflationDelta = card.inflationChange || 0;
        const playerInflationBefore = nextPlayerState.inflation ?? 0;
        nextPlayerState = applyInflationChange(nextPlayerState, playerInflationDelta);
        if (nextPlayerState.inflation !== playerInflationBefore) {
            addLog(`Inflation adjusted to ${nextPlayerState.inflation.toFixed(1)}%.`);
        }

        const updatedRating = getRatingByDebt(nextPlayerState.debt);
        setPlayer({ ...nextPlayerState, rating: updatedRating });

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
            const enemyRating = getRatingByDebt(nextEnemyState.debt);
            setEnemy({ ...nextEnemyState, rating: enemyRating });
            addLog(`${getLoc(card, 'name', lang)} impacted the enemy.`);
        }

        const providedTags = getCardProvidedTags(card);
        if (providedTags.length > 0) {
            setLastTags(providedTags);
        }

        const { uniqueId: _, ...discardedCard } = card;
        setDiscardPile(prev => [...prev, discardedCard]);
        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
        logMessages.forEach(addLog);
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
        setIsResolvingTurn(true);

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

            const incomeGain = prev.income || 0;
            const afterIncome = { ...prev, money: prev.money + incomeGain, inflation: driftedInflation };
            if (incomeGain > 0) {
                addLog(`Enemy collected income: +${incomeGain} money.`);
            }

            const interest = getInterestForTurn(afterIncome);
            const afterInterest = { ...afterIncome, money: Math.max(0, afterIncome.money - interest) };
            if (interest > 0) {
                addLog(`Enemy interest payment: -${interest} money.`);
            }

            const turnsRemaining = Math.max(1, (currentDifficulty.maxTurns ?? 40) - turn + 1);
            const targetGdp = currentDifficulty.targetGdp ?? 0;
            const requiredGrowth = Math.max(0, targetGdp - (afterInterest.gdp ?? 0));
            const neededPerTurn = Math.ceil(requiredGrowth / turnsRemaining);
            const spendableFunds = afterInterest.money ?? 0;
            const investmentEfficiency = 0.6;
            const growthCapacityFromFunds = Math.round(Math.max(0, spendableFunds) * investmentEfficiency);
            const incomeSupport = Math.round(incomeGain * 0.25);
            let gdpGain = Math.min(Math.max(growthCapacityFromFunds + incomeSupport, 0), neededPerTurn);
            let investmentSpent = 0;

            if (gdpGain > 0) {
                investmentSpent = Math.min(spendableFunds, Math.ceil(gdpGain / investmentEfficiency));
            } else if (spendableFunds <= 0) {
                const contraction = requiredGrowth > 0 ? -Math.max(2, Math.round(neededPerTurn * 0.5)) : 0;
                gdpGain = incomeGain > 0 ? 0 : contraction;
            }

            const remainingMoney = Math.max(0, spendableFunds - investmentSpent);
            const nextGdp = (afterInterest.gdp ?? 0) + gdpGain;

            if (gdpGain > 0) {
                addLog(`Enemy invested ${investmentSpent} money for +${gdpGain} GDP (total ${nextGdp}).`);
            } else if (gdpGain === 0) {
                addLog('Enemy lacked spendable funds for growth this turn.');
            } else {
                addLog(`Enemy economy contracted: ${gdpGain} GDP (total ${nextGdp}).`);
            }
            addLog('Enemy completed its turn.');

            return { ...afterInterest, money: remainingMoney, gdp: nextGdp };
        });

        drawCards(1);
        setTurn(prev => prev + 1);

        if (randomFn() < 0.35) {
            const randomIndex = Math.floor(randomFn() * EVENTS.length);
            enqueueEvent(EVENTS[randomIndex]);
        }
    };

    const triggerRandomEvent = () => {
        const randomIndex = Math.floor(randomFn() * EVENTS.length);
        const instance = enqueueEvent(EVENTS[randomIndex]);
        if (activeEvent && !isMuted && typeof SoundManager.playCrisis === 'function') {
            SoundManager.playCrisis();
            addLog(`Event alert: ${getLoc(instance, 'name', lang)} queued.`);
        }
    };

    useEffect(() => {
        if (!isResolvingTurn) return;
        // Ensure turn resolution completes (player + enemy updates and turn increment)
        // before allowing win/lose evaluation to run.
        setIsResolvingTurn(false);
    }, [player, enemy, turn, isResolvingTurn]);

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

            const { riskImpact, riskLog } = resolveBondRisk({
                amount,
                defaultRisk,
                randomFn,
                state: { debt: updated.debt, interestDue: updated.interestDue, support: prev.support },
            });

            const nextState = { ...updated, ...riskImpact };
            const nextRating = getRatingByDebt(nextState.debt);
            addLog(`Issued bonds: +${amount} money, +${interestDelta}/turn interest, default risk ${Math.round(defaultRisk * 100)}%${riskLog}`);
            return { ...nextState, rating: nextRating };
        });
    };

    const repayDebt = (e) => {
        if (gameState !== 'PLAYING') return;

        const currentDebt = player.debt || 0;
        if (currentDebt <= 0) {
            addLog(lang === 'en' ? 'No debt to repay.' : '償還すべき債務がありません。');
            return;
        }

        const repaymentAmount = Math.min(currentDebt, 50);
        if (player.money < repaymentAmount) {
            if (!SoundManager.isMuted && typeof SoundManager.playError === 'function') {
                SoundManager.playError();
            }
            addLog(lang === 'en' ? `Not enough funds to repay debt (Need ${repaymentAmount}T)` : `国債償還の資金が足りません (必要: ${repaymentAmount}兆)`);
            return;
        }

        if (!SoundManager.isMuted) {
            SoundManager.playCoin();
        }

        setPlayer(prev => {
             const adjustedRepayment = Math.min(prev.debt || 0, 50);
             const interestReduction = (5 * adjustedRepayment) / 50;
             const updatedDebt = Math.max(0, (prev.debt || 0) - adjustedRepayment);
             const updated = {
                 ...prev,
                 money: prev.money - adjustedRepayment,
                 debt: updatedDebt,
                 interestDue: Math.max(0, (prev.interestDue || 0) - interestReduction),
             };
             const rated = { ...updated, rating: getRatingByDebt(updated.debt) };
             addLog(lang === 'en' ? `Repaid Debt: -${adjustedRepayment} Money, -${adjustedRepayment} Debt` : `国債償還！資金-${adjustedRepayment}兆 / 債務-${adjustedRepayment}兆`);
             return rated;
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

    const enqueueEvent = (eventTemplate) => {
        const instance = eventTemplate?.instanceId ? eventTemplate : { ...eventTemplate, instanceId: Math.random() };
        setEventQueue(prev => [...prev, instance]);
        return instance;
    };

    useEffect(() => {
        if (!activeEvent && eventQueue.length > 0) {
            const [nextEvent, ...rest] = eventQueue;
            setEventQueue(rest);
            setActiveEvent(nextEvent);
            addLog(`New event queued: ${getLoc(nextEvent, 'name', lang)}`);
        }
    }, [activeEvent, eventQueue, lang]);

    const normalizeEventUpdate = (prevState, changes = {}) => {
        if (!changes) return prevState;

        const { inflationChange, inflation, support, ...rest } = changes;
        let nextState = { ...prevState, ...rest };

        if (typeof inflationChange === 'number') {
            nextState = applyInflationChange(nextState, inflationChange);
        } else if (typeof inflation === 'number') {
            nextState = { ...nextState, inflation: clampInflation(inflation) };
        }

        if (typeof support === 'number') {
            nextState = { ...nextState, support: clampSupport(support) };
        }

        const rating = getRatingByDebt(nextState.debt ?? prevState.debt);
        return { ...nextState, rating };
    };

    const resolveActiveEvent = () => {
        if (!activeEvent) return;

        const effectFn = typeof activeEvent.effect === 'function' ? activeEvent.effect : null;
        const result = effectFn ? effectFn({ player, enemy }) : {};
        const { player: playerChanges, enemy: enemyChanges, logMessages } = result || {};

        if (playerChanges) {
            setPlayer(prev => normalizeEventUpdate(prev, playerChanges));
        }

        if (enemyChanges) {
            setEnemy(prev => normalizeEventUpdate(prev, enemyChanges));
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
        if (gameState !== 'PLAYING' || isResolvingTurn) return;
        const result = evaluateGame({ player, enemy, difficulty: currentDifficulty, turn });
        if (result.status && result.status !== 'ONGOING') {
            setEvaluation(result);
            setGameState('END');
            if (!SoundManager.isMuted && typeof SoundManager.playGameEnd === 'function') {
                SoundManager.playGameEnd();
            }
        }
    }, [player, enemy, turn, currentDifficulty, gameState, isResolvingTurn]);

    useEffect(() => {
        return () => clearErrorMessage();
    }, []);

    const maxTurns = currentDifficulty.maxTurns ?? 40;
    const calculateRemainingTurns = (turnNumber) => Math.max(0, maxTurns - turnNumber + 1);
    const turnsRemaining = calculateRemainingTurns(turn);

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
                        <span data-testid="turn-indicator">Turn: {turn} / {maxTurns} (Remaining: {turnsRemaining})</span>
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
                        <button
                            onClick={repayDebt}
                            disabled={gameState !== 'PLAYING' || Math.min(player.debt || 0, 50) <= 0 || player.money < Math.min(player.debt || 0, 50)}
                        >
                            {lang === 'en' ? 'Repay' : '償還'}
                        </button>
                        <button onClick={endTurn}>{t('endTurn', lang)}</button>
                        <button
                            onClick={triggerRandomEvent}
                            data-testid="trigger-event"
                        >
                            Trigger Event
                        </button>
                    </div>
                    <div data-testid="log-panel">
                        <h4>Activity Log</h4>
                        <ul>
                            {logs.map((entry, index) => (
                                <li key={`${entry}-${index}`}>{entry}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {gameState === 'END' && (
                <div data-testid="game-result">
                    <h2>Game End</h2>
                    <div>Result: {evaluation?.status || 'N/A'}</div>
                    <div>Reason: {evaluation?.reason || 'No evaluation'}</div>
                    {evaluation?.detail && <div>Detail: {evaluation.detail}</div>}
                    <div data-testid="turn-summary">Turns: {evaluation?.turn ?? turn} / {maxTurns} (Remaining: {calculateRemainingTurns(evaluation?.turn ?? turn)})</div>
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
export { SoundManager as SoundManagerInstance, evaluateGame, resolveBondRisk };
