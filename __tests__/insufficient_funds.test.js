import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame from '../src/Game';

// Mocking requestAnimationFrame for Jest
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

describe('Insufficient Funds Error', () => {
    test('shows error message when clicking unaffordable card', async () => {
        // High cost card that player cannot afford (initial money is usually 80-120)
        const expensiveCard = {
            id: 9999,
            name: 'Expensive Card',
            name_en: 'Expensive Card',
            cost: 9999,
            type: 'PRODUCTION',
            description: 'Very expensive',
            description_en: 'Very expensive',
            effect: (s) => s
        };

        render(<EconomicCardGame initialDeck={[expensiveCard]} />);

        // 1. Switch to English
        const engButton = screen.getByTestId('lang-en');
        await act(async () => {
            fireEvent.click(engButton);
        });

        // 2. Start Game
        const titleStart = screen.getByText(/START GAME/i);
        await act(async () => {
            fireEvent.click(titleStart);
        });

        const setupStart = await screen.findAllByText(/START GAME/i);
        await act(async () => {
            fireEvent.click(setupStart[setupStart.length - 1]);
        });

        // 3. Find the card button
        const cardButton = await screen.findByTestId('card-Expensive Card');

        // 4. Click the card button
        // Note: Currently the button might be disabled, preventing the click event in a real browser.
        // However, we are testing the requirement to show an error message, which implies
        // the button should be interactable or we simulate the interaction.
        await act(async () => {
            fireEvent.click(cardButton);
        });

        // 5. Assert the error message appears in the log
        const logPanel = screen.getByTestId('log-panel');
        expect(logPanel).toHaveTextContent('Not enough money');
    });
});
