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

describe('EconomicCardGame Repay Debt', () => {
    test('Repay button exists and is disabled initially (if debt is low or money is low)', async () => {
        render(<EconomicCardGame />);

        await act(async () => {
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        const repayButton = await screen.findByText(/Repay|償還/i);
        expect(repayButton).toBeInTheDocument();
    });

    test('Repay button should be enabled when user has enough money and debt', async () => {
        render(<EconomicCardGame />);

        // Switch to Hard mode to have initial debt
        await act(async () => {
            fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'HARD' } });
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        const repayButton = await screen.findByText(/Repay|償還/i);
        expect(repayButton).not.toBeDisabled();
    });

    test('Clicking Repay reduces money and debt', async () => {
        render(<EconomicCardGame />);

        // Start Hard mode
        await act(async () => {
            fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'HARD' } });
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        const repayButton = await screen.findByText(/Repay|償還/i);

        await act(async () => {
            fireEvent.click(repayButton);
        });

        const moneyEl = screen.getByTestId('player-money');
        const debtEl = screen.getByTestId('player-debt');

        const moneyVal = parseInt(moneyEl.textContent.replace(/[^\d]/g, ''), 10);
        const debtVal = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);

        // Initial Hard: Money 100, Debt 170 (120 Diff + 50 Ideology)
        // After Repay: Money 50, Debt 120.
        expect(moneyVal).toBe(50);
        expect(debtVal).toBe(120);
    });

    test('Repay button disabled if debt is 0', async () => {
        render(<EconomicCardGame />);

        // Normal difficulty defaults.
        // Initial Money: 100 (Normal) + 20 (Keynesian adjustment) = 120.
        // Initial Debt: 0 (Normal) + 50 (Keynesian) = 50.

        await act(async () => {
             fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'NORMAL' } });
             fireEvent.click(screen.getByText(/START GAME/i));
        });

        const repayButton = await screen.findByText(/Repay|償還/i);

        // Check initial state
        let debtEl = screen.getByTestId('player-debt');
        let debtVal = parseInt(debtEl.textContent.replace(/[^\d]/g, ''), 10);
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

    test('Muted players do not hear error sound when repayment fails', async () => {
        SoundManager.playError.mockClear();

        render(<EconomicCardGame />);

        await act(async () => {
            fireEvent.click(screen.getByTestId('mute-toggle'));
            fireEvent.change(screen.getByTestId('difficulty-select'), { target: { value: 'HARD' } });
            fireEvent.click(screen.getByText(/START GAME/i));
        });

        const repayButton = await screen.findByText(/Repay|償還/i);

        await act(async () => {
            fireEvent.click(repayButton);
        });

        await act(async () => {
            fireEvent.click(repayButton);
        });

        await act(async () => {
            repayButton.disabled = false;
            fireEvent.click(repayButton);
        });

        expect(SoundManager.playError).not.toHaveBeenCalled();
    });
});
