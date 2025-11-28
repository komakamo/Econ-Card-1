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

describe('EconomicCardGame', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should start the game and display the player hand', async () => {
    render(<EconomicCardGame />);

    // The game starts with a setup screen
    const startGameButton = screen.getByText(/START GAME/i);
    expect(startGameButton).toBeInTheDocument();

    // Click the start button
    await act(async () => {
      fireEvent.click(startGameButton);
    });

    // After starting, the main game board should be visible
    const yourHand = await screen.findByText(/Your Hand/i);
    expect(yourHand).toBeInTheDocument();

    // Check that there is at least one card in the hand
    const card = await screen.findByTestId('card-Test Card');
    expect(card).toBeInTheDocument();
  });

  test('playing a card should deduct money', async () => {
    render(<EconomicCardGame />);

    // Start the game
    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    // Wait for the game to be in the "PLAYING" state
    await screen.findByText(/Your Hand/i);

    // Get the initial money value
    const initialMoneyElement = screen.getByTestId('player-money');
    const initialMoney = parseInt(initialMoneyElement.textContent.replace('¥', ''));

    // Find the first card and play it
    const cardButton = await screen.findByTestId('card-Test Card');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    // Get the new money value
    const newMoneyElement = screen.getByTestId('player-money');
    const newMoney = parseInt(newMoneyElement.textContent.replace('¥', ''));

    // Check if money was deducted correctly
    expect(newMoney).toBe(initialMoney - 10);
  });

  test('renders English and Japanese card names based on language selection', async () => {
    render(<EconomicCardGame />);

    // Start game in English
    await act(async () => {
      fireEvent.click(screen.getByTestId('lang-en'));
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const englishCard = await screen.findByTestId('card-Test Card');
    expect(englishCard).toBeInTheDocument();

    // Switch to Japanese and ensure localized text is used
    await act(async () => {
      fireEvent.click(screen.getByTestId('lang-ja'));
    });

    const japaneseCard = await screen.findByTestId('card-テストカード');
    expect(japaneseCard).toBeInTheDocument();
  });

  test('recalculates deck and finances when changing difficulty', async () => {
    render(<EconomicCardGame />);

    const difficultySelect = screen.getByTestId('difficulty-select');

    await act(async () => {
      fireEvent.change(difficultySelect, { target: { value: 'HARD' } });
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    await screen.findByText(/Your Hand/i);

    const cards = await screen.findAllByTestId(/card-/);
    expect(cards).toHaveLength(3);

    const playerMoney = parseInt(screen.getByTestId('player-money').textContent.replace(/[^\d]/g, ''), 10);
    const enemyMoney = parseInt(screen.getByTestId('enemy-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(playerMoney).toBe(100);
    expect(enemyMoney).toBe(80);

    const playerDebt = parseInt(screen.getByTestId('player-debt').textContent.replace(/[^\d]/g, ''), 10);
    const targetGdp = parseInt(screen.getByTestId('target-gdp').textContent.replace(/[^\d]/g, ''), 10);
    expect(playerDebt).toBe(120);
    expect(targetGdp).toBe(400);
  });

  test('mute toggle updates SoundManager and prevents card sound when muted', async () => {
    render(<EconomicCardGame />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const muteToggle = screen.getByTestId('mute-toggle');
    const cardSoundSpy = jest.spyOn(SoundManager, 'playCard');

    await act(async () => {
      fireEvent.click(muteToggle);
    });

    expect(SoundManager.isMuted).toBe(true);

    const cardButton = await screen.findByTestId('card-Test Card');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    expect(cardSoundSpy).not.toHaveBeenCalled();
  });

  test('event playback respects mute state', async () => {
    render(<EconomicCardGame />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const muteToggle = screen.getByTestId('mute-toggle');
    const eventSoundSpy = jest.spyOn(SoundManager, 'playCrisis');
    const eventButton = await screen.findByTestId('trigger-event');

    await act(async () => {
      fireEvent.click(muteToggle);
    });

    await act(async () => {
      fireEvent.click(eventButton);
    });

    expect(eventSoundSpy).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(muteToggle);
    });

    await act(async () => {
      fireEvent.click(eventButton);
    });

    expect(eventSoundSpy).toHaveBeenCalled();
  });
});
