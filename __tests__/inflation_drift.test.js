import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame from '../src/Game';
import GameLogic from '../src/logic';

const { applyInflationDrift } = GameLogic;

// Mocking requestAnimationFrame for Jest
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

describe('applyInflationDrift', () => {
    test('drifts down towards 0 by 0.3 when positive', () => {
        expect(applyInflationDrift(5.0)).toBe(4.7);
        expect(applyInflationDrift(1.0)).toBe(0.7);
    });

    test('drifts up towards 0 by 0.3 when negative', () => {
        expect(applyInflationDrift(-5.0)).toBe(-4.7);
        expect(applyInflationDrift(-1.0)).toBe(-0.7);
    });

    test('snaps to 0 when within 0.3 range', () => {
        expect(applyInflationDrift(0.2)).toBe(0);
        expect(applyInflationDrift(-0.2)).toBe(0);
        expect(applyInflationDrift(0.29)).toBe(0);
        expect(applyInflationDrift(-0.29)).toBe(0);
    });

    test('remains 0 when 0', () => {
        expect(applyInflationDrift(0)).toBe(0);
    });
});

describe('Inflation Drift Integration', () => {
    test('inflation drifts towards 0 over turns', async () => {
        const setInflationCard = {
            id: 'set-inflation',
            name: 'Set Inflation',
            name_en: 'Set Inflation',
            cost: 0,
            type: 'POLICY',
            description: 'Sets inflation to 5.0%.',
            description_en: 'Sets inflation to 5.0%.',
            effect: (state) => ({ ...state, inflation: 5.0 })
        };

        // Provide enough cards for multiple turns
        const initialDeck = [setInflationCard, setInflationCard, setInflationCard, setInflationCard, setInflationCard];

        render(<EconomicCardGame initialDeck={initialDeck} />);

        // Switch to English
        await act(async () => {
            fireEvent.click(screen.getByTestId('lang-en'));
        });

        // Start Game (Title -> Setup -> Playing)
        await act(async () => {
            fireEvent.click(screen.getByText(/START GAME/i));
        });
        const setupStarts = await screen.findAllByText(/START GAME/i);
        await act(async () => {
            fireEvent.click(setupStarts[setupStarts.length - 1]);
        });

        // Verify initial inflation is 0.0%
        const inflationEl = screen.getByTestId('player-inflation');
        expect(inflationEl).toHaveTextContent('Inflation: 0.0%');

        // Play the card to set inflation to 5.0%
        const cardButtons = await screen.findAllByTestId('card-Set Inflation');
        await act(async () => {
            fireEvent.click(cardButtons[0]);
        });

        expect(inflationEl).toHaveTextContent('Inflation: 5.0%');

        // End Turn 1 -> Drift to 4.7%
        const endTurnButton = screen.getByText(/End Turn/i);
        await act(async () => {
            fireEvent.click(endTurnButton);
        });

        expect(inflationEl).toHaveTextContent('Inflation: 4.7%');

        // Click Continue on Summary
        const continueButton = await screen.findByText(/Continue/i);
        await act(async () => {
            fireEvent.click(continueButton);
        });

        // End Turn 2 -> Drift to 4.4%
        await act(async () => {
            fireEvent.click(endTurnButton);
        });

        expect(inflationEl).toHaveTextContent('Inflation: 4.4%');
    });
});
