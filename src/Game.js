import React, { useState, useEffect } from 'react';

// This file is a self-contained module for testing the EconomicCardGame component.
// It includes all necessary sub-components, constants, and helper functions.

// --- Mocks for global objects that would normally be in index.html ---
const SoundManager = {
  init: () => {},
  playTone: () => {},
  playClick: () => {},
  playError: () => {},
  playSuccess: () => {},
  playCard: () => {},
  playGameEnd: () => {},
  playCrisis: () => {},
  playDoom: () => {},
  isMuted: false,
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
  },
  en: {
    startGame: "START GAME",
    yourHand: "Your Hand",
    endTurn: "End Turn",
    myCountry: "My Country (YOU)",
    rivalCountry: "Rival Country",
  },
};
const t = (key, lang) => UI_TEXT[lang][key] || key;
const getLoc = (obj, key, lang) => {
    const primaryKey = lang === 'en' ? `${key}_en` : key;
    const fallbackKey = lang === 'en' ? key : `${key}_en`;

    return (obj && (obj[primaryKey] || obj[fallbackKey])) || '';
};
const EVENTS = [{ id: 1, name: 'Test Event', name_en: 'Test Event', description: 'Test', description_en: 'Test', effect: {} }];
const ERAS = { GROWTH: { id: 'GROWTH', name: 'Growth', name_en: 'Growth', bgClass: '' }, STAGNATION: { id: 'STAGNATION' }, IT_REV: { id: 'IT_REV' } };
const IDEOLOGIES = {
  KEYNESIAN: { id: 'KEYNESIAN', name: 'Keynesian', name_en: 'Keynesian', label: 'Keynesian', label_en: 'Keynesian', description: 'desc', description_en: 'desc', features: [], features_en: [], initialStats: { support: 70, debt: 50, money: 120 }, deckWeights: {1: 1}, rankCriteria: {} },
};
const ALL_CARDS = [
  { id: 1, name: 'テストカード', name_en: 'Test Card', cost: 10, type: 'PRODUCTION', description: 'desc', description_en: 'desc', effect: (me) => me, combosWith: [] },
];
const CARD_TYPES = {
  PRODUCTION: { label: 'PROD', baseStyle: '', headerStyle: '', icon: <IconZap/> },
  POLICY: { label: 'POLICY', baseStyle: '', headerStyle: '', icon: <IconBookOpen/> },
  ATTACK: { label: 'DIPLO', baseStyle: '', headerStyle: '', icon: <IconShield/> },
};
const DIFFICULTY_SETTINGS = {
  NORMAL: { id: 'NORMAL', label: 'Normal', label_en: 'Normal', description: 'desc', description_en: 'desc', targetGdp: 300, initialMoney: 100, initialDebt: 0 },
};
const getRatingByDebt = () => 'AAA';
const getRatingInfo = () => ({});
const calculateInflatedCost = (cost) => cost;
const calculateSuccessRate = () => 100;
const evaluateGame = () => ({});
const applyInflationChange = (state) => state;
const applyInflationDrift = (val) => val;

// --- Visual Components ---
const NumberCounter = ({ value }) => <span>{value}</span>;
const TurnOverlay = () => null;
const CrisisOverlay = () => null;
const Confetti = () => null;
const CardInfoPanel = () => <div />;
const ComboGuidePanel = () => <div />;
const StatusPanel = ({ data, isEnemy, interest, isShaking, lang }) => (
    <div>
        <h3>{isEnemy ? t('rivalCountry', lang) : t('myCountry', lang)}</h3>
        <div>GDP: <NumberCounter value={data.gdp} /></div>
        <div className="font-mono" data-testid={isEnemy ? 'enemy-money' : 'player-money'}>¥<NumberCounter value={data.money} /></div>
    </div>
);

// --- Main Game Component ---
function EconomicCardGame() {
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
    const [player, setPlayer] = useState({ money: 100, gdp: 0, inflation: 0, support: 70, debt: 0, rating: 'AAA', income: 10 });
    const [enemy, setEnemy] = useState({ money: 100, gdp: 0, inflation: 0, support: 70, debt: 0, rating: 'AAA', income: 10 });
    const [playerHand, setPlayerHand] = useState([]);

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const addLog = (msg) => setLogs(prev => [msg, ...prev]);
    const getInterestForTurn = () => 0;

    const startGame = () => {
        const difficulty = DIFFICULTY_SETTINGS[selectedDifficulty];
        const ideology = IDEOLOGIES[selectedIdeology];
        const initialPlayerState = {
            money: (ideology.initialStats.money || 100) + (difficulty.initialMoney - DIFFICULTY_SETTINGS.NORMAL.initialMoney),
            income: 20, gdp: 0, inflation: 0, support: ideology.initialStats.support || 70, debt: 0, rating: 'AAA',
        };
        setPlayer(initialPlayerState);
        setEnemy({ money: difficulty.initialMoney, income: 20, gdp: 0, inflation: 0, support: 70, debt: 0, rating: 'AAA' });
        setGameState('PLAYING');
        drawCards(3, ALL_CARDS, []);
    };

    const drawCards = (count, sourceDeck = null, sourceDiscard = null) => {
        let deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
        const drawnCards = [];
        for (let i = 0; i < count; i++) {
            if (deck.length > 0) {
                const [card] = deck.splice(-1, 1);
                drawnCards.push({ ...card, uniqueId: Math.random() });
            }
        }
        setPlayerHand(prev => [...prev, ...drawnCards]);
        setGameDeck(deck);
    };

    const playCard = (card, e) => {
        if (gameState !== 'PLAYING') return;
        const cost = calculateAdjustedCost(card.cost, player.inflation);
        if (player.money < cost) return;

        let nextPlayerState = { ...player, money: player.money - cost };
        nextPlayerState = card.effect(nextPlayerState, enemy);
        setPlayer(nextPlayerState);

        setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    };

    const calculateAdjustedCost = (baseCost, inflationRate = 0) => {
        return Math.max(0, Math.round(baseCost * (1 + inflationRate / 100)));
    };

    const endTurn = () => {};
    const issueBonds = () => {};
    const getCardProvidedTags = () => [];

    return (
        <div className={`min-h-screen ${era.bgClass}`}>
            <div>
                <button onClick={() => setLang('en')} data-testid="lang-en">English</button>
                <button onClick={() => setLang('ja')} data-testid="lang-ja">日本語</button>
            </div>
            {gameState === 'START' && (
                <div>
                    <button onClick={startGame}>{t('startGame', lang)}</button>
                </div>
            )}
            {gameState === 'PLAYING' && (
                <div>
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
                        <button onClick={endTurn}>{t('endTurn', lang)}</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EconomicCardGame;
