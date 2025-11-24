
// Minimal reproduction of the bug
const log = [];
let state = {
    gameDeck: [],
    discardPile: ['OLD_CARD_1', 'OLD_CARD_2'], // Simulating state from previous game
    playerHand: []
};

// Mock React useState setters
const setGameDeck = (val) => {
    state.gameDeck = typeof val === 'function' ? val(state.gameDeck) : val;
    // console.log('setGameDeck:', state.gameDeck);
};
const setDiscardPile = (val) => {
    state.discardPile = typeof val === 'function' ? val(state.discardPile) : val;
    // console.log('setDiscardPile:', state.discardPile);
};
const setPlayerHand = (val) => {
    state.playerHand = typeof val === 'function' ? val(state.playerHand) : val;
    // console.log('setPlayerHand:', state.playerHand);
};
const addLog = (msg) => log.push(msg);

// Logic extracted from index.html

const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

// Simplified drawCards (mirroring the one in index.html)
const drawCards = (count, sourceDeck = null) => {
    // Current state access (simulating closure capture or state access)
    // In React component, `discardPile` would be the value from the render scope.
    // Since startGame calls this synchronously, it sees the same state as startGame.

    let deck = sourceDeck ? [...sourceDeck] : [...state.gameDeck];
    let discarded = [...state.discardPile]; // <--- This reads the CURRENT (stale) state
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
    setDiscardPile(discarded); // <--- This overwrites the previous setDiscardPile([])
};

// Simplified startGame
const startGame = () => {
    console.log("Starting Game...");

    // 1. Setup new deck
    const newDeck = ['NEW_CARD_1', 'NEW_CARD_2', 'NEW_CARD_3', 'NEW_CARD_4'];
    const shuffledDeck = shuffleArray(newDeck);

    setGameDeck(shuffledDeck);
    setDiscardPile([]); // Intention: Clear discard pile.

    // ... other initializations ...

    // Draw initial cards
    // React state updates are async, so 'state.discardPile' here is still the old one
    // if we assume this function runs in one 'render' or event loop tick.
    // In this simulation, state is updated immediately by our mock setters,
    // BUT the bug relies on the fact that `drawCards` reads `discardPile`
    // which in a React component would be const `discardPile` from the start of the function.

    // To accurately simulate React, `drawCards` needs to read the variable `discardPile`
    // which is defined in the component scope.

    drawCards(3, shuffledDeck);
};

// To simulate React Closure behavior:
// We need to pass the 'captured' state to the functions or setup a context where
// the state variables are constant for the duration of the 'render' (or function execution).

function Component() {
    // Current state provided by "React"
    const discardPile = state.discardPile;
    const gameDeck = state.gameDeck;

    const drawCardsLocal = (count, sourceDeck = null) => {
        let deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
        let discarded = [...discardPile]; // Uses captured discardPile
        const drawnCards = [];

        for (let i = 0; i < count; i++) {
             // ... logic ...
             const [card] = deck.splice(-1, 1);
             drawnCards.push(card);
        }

        setGameDeck(deck);
        setDiscardPile(discarded); // Writes back the captured (old) discardPile
    };

    const startGameLocal = () => {
        const newDeck = ['NEW_1', 'NEW_2', 'NEW_3', 'NEW_4'];

        setGameDeck(newDeck);
        setDiscardPile([]); // Schedules update to []

        // In React, this doesn't update 'discardPile' variable in this scope immediately.

        drawCardsLocal(3, newDeck);
    };

    return { startGameLocal };
}

// Run the reproduction
console.log("Initial Discard Pile:", state.discardPile);
const { startGameLocal } = Component();
startGameLocal();
console.log("Final Discard Pile (should be empty):", state.discardPile);

if (state.discardPile.length > 0) {
    console.log("BUG REPRODUCED: Discard pile not cleared!");
} else {
    console.log("Bug not reproduced.");
}
