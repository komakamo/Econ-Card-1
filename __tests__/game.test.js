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

describe('EconomicCardGame', () => {
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
});
