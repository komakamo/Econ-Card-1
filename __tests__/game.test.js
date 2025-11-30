import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame, { SoundManagerInstance as SoundManager, evaluateGame } from '../src/Game';

// Mocking requestAnimationFrame for Jest
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

describe('EconomicCardGame', () => {
  describe('evaluateGame turn limit', () => {
    const baseDifficulty = {
      targetGdp: 500,
      maxTurns: 3,
      debtLimit: 999,
      minimumSupport: 0,
    };

    const basePlayer = { gdp: 0, debt: 0, support: 50 };
    const baseEnemy = { gdp: 0, debt: 0, support: 50 };

    test('continues before reaching max turns', () => {
      const result = evaluateGame({ player: basePlayer, enemy: baseEnemy, difficulty: baseDifficulty, turn: 2 });
      expect(result.status).toBe('ONGOING');
    });

    test('ends the game when hitting the maximum turn', () => {
      const result = evaluateGame({ player: basePlayer, enemy: baseEnemy, difficulty: baseDifficulty, turn: 3 });
      expect(result.status).toBe('LOSE');
      expect(result.detail).toBe('Turn: 3 / 3');
    });
  });

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

  test('shows turn indicator using the difficulty max turn setting', async () => {
    render(<EconomicCardGame />);

    const difficultySelect = screen.getByTestId('difficulty-select');

    await act(async () => {
      fireEvent.change(difficultySelect, { target: { value: 'HARD' } });
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const turnIndicator = await screen.findByTestId('turn-indicator');
    expect(turnIndicator).toHaveTextContent('Turn: 1 / 35');
    expect(turnIndicator).toHaveTextContent('(Remaining: 34)');
  });

  test('playing a card without an effect does not crash the game', async () => {
    const deckWithoutEffect = [
      {
        id: 'no-effect',
        name: 'No Effect',
        name_en: 'No Effect',
        cost: 0,
        type: 'PRODUCTION',
        description: 'desc',
        description_en: 'desc',
      },
    ];

    render(<EconomicCardGame initialDeck={deckWithoutEffect} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-No Effect');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    expect(screen.getByTestId('player-money')).toBeInTheDocument();
  });

  test('playing Tariff Hike attack card does not crash the game', async () => {
    const tariffHike = {
      id: 'tariff-hike',
      name: '関税引き上げ',
      name_en: 'Tariff Hike',
      cost: 15,
      type: 'ATTACK',
      targetSupportChange: -5,
      targetEffect: (opp) => ({
        ...opp,
        income: Math.max(0, opp.income - 5),
        money: Math.max(0, opp.money - 10),
      }),
      description: '輸入品に税金をかけ、相手国の輸出産業にダメージを与えます。',
      description_en: 'Tax imports to damage rival export industries.',
      tip: '[Protectionism] Protects domestic industry but risks trade war.',
      tip_en: '[Protectionism] Protects domestic industry but risks trade war.',
    };

    render(<EconomicCardGame initialDeck={[tariffHike]} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-Tariff Hike');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    expect(screen.getByTestId('enemy-money')).toBeInTheDocument();
  });

  test('enemy debt changes update rating and interest calculation', async () => {
    const debtBomb = {
      id: 'debt-bomb',
      name: '負債爆弾',
      name_en: 'Debt Bomb',
      cost: 0,
      type: 'ATTACK',
      targetEffect: (opp) => ({
        ...opp,
        debt: (opp.debt || 0) + 200,
      }),
      description: '敵国の債務を急増させる。',
      description_en: 'Rapidly increases enemy debt.',
    };

    render(<EconomicCardGame initialDeck={[debtBomb]} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-Debt Bomb');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    const endTurnButton = screen.getByText(/End Turn/i);

    await act(async () => {
      fireEvent.click(endTurnButton);
    });

    const enemyMoney = parseInt(screen.getByTestId('enemy-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(enemyMoney).toBe(101);
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

  test('updates rating and interest after debt-changing card is played', async () => {
    const debtCard = {
      id: 'debt-builder',
      name: 'Debt Builder',
      name_en: 'Debt Builder',
      cost: 0,
      type: 'POLICY',
      description: 'desc',
      description_en: 'desc',
      effect: (state) => ({
        ...state,
        debt: (state.debt || 0) + 200,
      }),
    };

    render(<EconomicCardGame initialDeck={[debtCard]} />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-Debt Builder');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    const updatedDebt = parseInt(screen.getByTestId('player-debt').textContent.replace(/[^\d]/g, ''), 10);
    expect(updatedDebt).toBe(200);

    await act(async () => {
      fireEvent.click(screen.getByText(/End Turn/i));
    });

    const moneyAfterInterest = parseInt(screen.getByTestId('player-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(moneyAfterInterest).toBe(135);
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
