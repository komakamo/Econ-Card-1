
// Minimal reproduction of the bug (Fixed version)
const log = [];
let state = {
    gameDeck: [],
    discardPile: ['OLD_CARD_1', 'OLD_CARD_2'], // Simulating state from previous game
    playerHand: []
};

// Mock React useState setters
const setGameDeck = (val) => {
    state.gameDeck = typeof val === 'function' ? val(state.gameDeck) : val;
};
const setDiscardPile = (val) => {
    state.discardPile = typeof val === 'function' ? val(state.discardPile) : val;
};
const setPlayerHand = (val) => {
    state.playerHand = typeof val === 'function' ? val(state.playerHand) : val;
};
const addLog = (msg) => log.push(msg);

const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

// Simplified drawCards (WITH FIX)
const drawCards = (count, sourceDeck = null, sourceDiscard = null) => {
    let deck = sourceDeck ? [...sourceDeck] : [...state.gameDeck];
    let discarded = sourceDiscard ? [...sourceDiscard] : [...state.discardPile]; // <--- FIXED: uses sourceDiscard if provided
    const drawnCards = [];

    for (let i = 0; i < count; i++) {
        if (deck.length === 0) {
            if (discarded.length === 0) {
               break;
            }
            deck = shuffleArray(discarded);
            discarded = [];
        }

        const [card] = deck.splice(-1, 1);
        drawnCards.push({ ...card, uniqueId: Math.random() });
    }

    if (drawnCards.length > 0) {
        setPlayerHand(prev => [...prev, ...drawnCards]);
    }

    setGameDeck(deck);
    setDiscardPile(discarded);
};


function Component() {
    const discardPile = state.discardPile;
    const gameDeck = state.gameDeck;

    const drawCardsLocal = (count, sourceDeck = null, sourceDiscard = null) => {
        let deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
        let discarded = sourceDiscard ? [...sourceDiscard] : [...discardPile]; // Uses captured discardPile or explicit source
        const drawnCards = [];

        for (let i = 0; i < count; i++) {
             // ... logic ...
             const [card] = deck.splice(-1, 1);
             drawnCards.push(card);
        }

        setGameDeck(deck);
        setDiscardPile(discarded);
    };

    const startGameLocal = () => {
        const newDeck = ['NEW_1', 'NEW_2', 'NEW_3', 'NEW_4'];

        setGameDeck(newDeck);
        setDiscardPile([]);

        // Passing [] as sourceDiscard to fix the bug
        drawCardsLocal(3, newDeck, []);
    };

    return { startGameLocal };
}

// Run the reproduction
console.log("Initial Discard Pile:", state.discardPile);
const { startGameLocal } = Component();
startGameLocal();
console.log("Final Discard Pile (should be empty):", state.discardPile);

if (state.discardPile.length === 0) {
    console.log("SUCCESS: Discard pile is empty!");
} else {
    console.log("FAILURE: Discard pile not cleared!");
}
