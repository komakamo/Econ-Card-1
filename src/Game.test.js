
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EconomicCardGame from './Game';
import '@testing-library/jest-dom';

test('Player wins immediately when GDP reaches 300 via card play', () => {
    // Start with 290 GDP, so +10 from card should trigger win
    render(<EconomicCardGame initialGdpForTest={290} />);

    // Click start
    fireEvent.click(screen.getByText('Start Game'));

    // Find a card that increases GDP. The mocked INITIAL_DECK has '設備投資' (+10 GDP).
    // Note: Since cards are random, we might need to mock Math.random or ensure the deck has only winning cards.
    // In the Game.js mock above, I reduced the deck to just that card to make testing deterministic.

    const card = screen.getAllByTestId('card')[0];
    fireEvent.click(card);

    // Expect victory message to appear immediately
    expect(screen.getByTestId('victory-message')).toBeInTheDocument();
});
