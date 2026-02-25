import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame, { SoundManagerInstance as SoundManager } from '../src/Game';

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

const startTitle = async () => {
    await act(async () => {
        fireEvent.click(screen.getByText(/START GAME/i));
    });
};

const startSetup = async () => {
    const setupStarts = await screen.findAllByText(/START GAME/i);
    await act(async () => {
        fireEvent.click(setupStarts[setupStarts.length - 1]);
    });
};

describe('EconomicCardGame Repay Debt', () => {
    test('Repay button exists and is disabled initially (if debt is low or money is low)', async () => {
        render(<EconomicCardGame />);
        await startTitle();
        await startSetup();

        const repayButton = await screen.findByText(/Repay|償還/i);
        expect(repayButton).toBeInTheDocument();
    });

    test('Repay button should be enabled when user has enough money and debt', async () => {
        render(<EconomicCardGame />);
        await startTitle();

        // Switch to Hard mode to have initial debt
        await act(async () => {
            fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'HARD' } });
        });
        await startSetup();

        const repayButton = await screen.findByText(/Repay|償還/i);
        expect(repayButton).not.toBeDisabled();
    });

    test('Clicking Repay reduces money and debt', async () => {
        render(<EconomicCardGame />);
        await startTitle();

        // Start Hard mode
        await act(async () => {
            fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'HARD' } });
        });
        await startSetup();

        const repayButton = await screen.findByText(/Repay|償還/i);

        await act(async () => {
            fireEvent.click(repayButton);
        });

        const moneyEl = screen.getByTestId('player-money');
        const debtEl = screen.getByTestId('player-debt');

        const moneyVal = parseInt(moneyEl.textContent.replace(/[^\d]/g, ''), 10);
        const debtVal = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);

        // Initial Hard: Money 60, Debt 170 (30 Diff + 50 Ideology = 80? Wait.)
        // HARD: initialMoney 60, initialDebt 30.
        // Keynesian: debt 50, money 120 (base).
        // Combined:
        // Debt: 50 + 30 = 80.
        // Money: 100 (base keynesian) + (60 - 80) = 80.
        // Wait, logic in startGame:
        // money: (ideology.initialStats.money || 100) + (difficulty.initialMoney - DIFFICULTY_SETTINGS.NORMAL.initialMoney)
        // Keynesian money: 120.
        // Normal money: 80.
        // Hard money: 60.
        // Delta: 60 - 80 = -20.
        // Result: 120 - 20 = 100.

        // Initial Debt: 80.
        // Repay 50.
        // Money: 100 - 50 = 50.
        // Debt: 80 - 50 = 30.

        expect(moneyVal).toBe(50);
        expect(debtVal).toBe(30);
    });

    test('Repay button disabled if debt is 0', async () => {
        render(<EconomicCardGame />);
        await startTitle();

        await act(async () => {
             fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'NORMAL' } });
        });
        await startSetup();

        const repayButton = await screen.findByText(/Repay|償還/i);

        // Check initial state
        let debtEl = screen.getByTestId('player-debt');
        let debtVal = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        // Normal: Debt 0 + 50 = 50.
        expect(debtVal).toBe(50);

        // Repay once (50 -> 0)
        await act(async () => {
            fireEvent.click(repayButton);
        });

        // Now debt should be 0.
        debtEl = screen.getByTestId('player-debt');
        debtVal = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
        expect(debtVal).toBe(0);

        // Button should now be disabled because debt is 0.
        expect(repayButton).toBeDisabled();
    });
});
