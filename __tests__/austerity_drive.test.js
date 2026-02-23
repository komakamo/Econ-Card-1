import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame from '../src/Game';

// Mocking requestAnimationFrame for Jest
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock SoundManager
jest.mock('../src/Game', () => {
    const originalModule = jest.requireActual('../src/Game');
    const soundManager = originalModule.SoundManagerInstance;
    soundManager.playClick = jest.fn();
    soundManager.playError = jest.fn();
    soundManager.playCoin = jest.fn();
    soundManager.playCard = jest.fn();
    return {
        __esModule: true,
        ...originalModule,
        SoundManagerInstance: soundManager,
    };
});

describe('EconomicCardGame - Austerity Drive', () => {
    test('Austerity Drive reduces debt, support, GDP, and inflation', async () => {
        render(<EconomicCardGame />);

        // Ensure English
        await act(async () => {
            fireEvent.click(screen.getByTestId('lang-en'));
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        // Verify "Austerity Drive" is in the hand
        const cardButton = await screen.findByTestId('card-Austerity Drive');
        expect(cardButton).toBeInTheDocument();

        // Get Initial State
        const debtEl = screen.getByTestId('player-debt');
        const supportEl = screen.getByTestId('player-support');
        const gdpEl = screen.getByTestId('player-gdp');
        const inflationEl = screen.getByTestId('player-inflation');

        const initialDebt = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        const initialSupport = parseInt(supportEl.textContent.replace(/[^\d]/g, ''), 10);
        const initialGdp = parseInt(gdpEl.textContent.replace(/[^\d]/g, ''), 10);
        const initialInflation = parseFloat(inflationEl.textContent.replace(/[^\d.-]/g, ''));

        // Play "Austerity Drive"
        await act(async () => {
            fireEvent.click(cardButton);
        });

        // Get Updated State
        const updatedDebt = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        const updatedSupport = parseInt(supportEl.textContent.replace(/[^\d]/g, ''), 10);
        const updatedGdp = parseInt(gdpEl.textContent.replace(/[^\d]/g, ''), 10);
        const updatedInflation = parseFloat(inflationEl.textContent.replace(/[^\d.-]/g, ''));

        // Expected Changes:
        // Debt: -25 (but clamped to 0)
        // Support: -8
        // GDP: -5 (but clamped to 0)
        // Inflation: -0.5

        const expectedDebt = Math.max(0, initialDebt - 25);
        const expectedSupport = Math.max(0, initialSupport - 8);
        const expectedGdp = Math.max(0, initialGdp - 5);
        const expectedInflation = initialInflation - 0.5;

        expect(updatedDebt).toBe(expectedDebt);
        expect(updatedSupport).toBe(expectedSupport);
        expect(updatedGdp).toBe(expectedGdp);
        expect(updatedInflation).toBeCloseTo(expectedInflation, 1);
    });

    test('Austerity Drive does not reduce debt below zero', async () => {
        render(<EconomicCardGame />);

        // Ensure English
        await act(async () => {
            fireEvent.click(screen.getByTestId('lang-en'));
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        // Repay Debt to 0 first (Initial Debt is 50, Repay is 50)
        const repayButton = await screen.findByText(/Repay/i);
        await act(async () => {
            fireEvent.click(repayButton);
        });

        const debtEl = screen.getByTestId('player-debt');
        const initialDebt = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        expect(initialDebt).toBe(0);

        // Find and Play "Austerity Drive"
        const cardButton = await screen.findByTestId('card-Austerity Drive');
        await act(async () => {
            fireEvent.click(cardButton);
        });

        const updatedDebt = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        expect(updatedDebt).toBe(0);
    });

    test('Austerity Drive does not reduce GDP below zero', async () => {
        render(<EconomicCardGame />);

         // Ensure English
        await act(async () => {
            fireEvent.click(screen.getByTestId('lang-en'));
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        const gdpEl = screen.getByTestId('player-gdp');
        const initialGdp = parseInt(gdpEl.textContent.replace(/[^\d]/g, ''), 10);
        expect(initialGdp).toBe(0); // Assuming start is 0

        // Find and Play "Austerity Drive"
        const cardButton = await screen.findByTestId('card-Austerity Drive');
        await act(async () => {
            fireEvent.click(cardButton);
        });

        const updatedGdp = parseInt(gdpEl.textContent.replace(/[^\d]/g, ''), 10);
        expect(updatedGdp).toBe(0);
    });
});
