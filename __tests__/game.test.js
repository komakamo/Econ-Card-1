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

    test('keeps the game active on the final allowed turn', () => {
      const result = evaluateGame({ player: basePlayer, enemy: baseEnemy, difficulty: baseDifficulty, turn: 3 });
      expect(result.status).toBe('ONGOING');
    });

    test('awards victory when reaching target GDP on the last allowed turn', () => {
      const player = { ...basePlayer, gdp: 520 };
      const result = evaluateGame({ player, enemy: baseEnemy, difficulty: baseDifficulty, turn: 3 });

      expect(result.status).toBe('WIN');
      expect(result.reason).toBe('ターゲットGDPを達成しました');
      expect(result.detail).toBe('GDP: 520 / 500');
    });

    test('still awards GDP victory before applying the turn-limit loss', () => {
      const player = { ...basePlayer, gdp: 520 };
      const result = evaluateGame({ player, enemy: baseEnemy, difficulty: baseDifficulty, turn: 4 });

      expect(result.status).toBe('WIN');
      expect(result.reason).toBe('ターゲットGDPを達成しました');
    });

    test('ends the game only after exceeding the maximum turn', () => {
      const result = evaluateGame({ player: basePlayer, enemy: baseEnemy, difficulty: baseDifficulty, turn: 4 });
      expect(result.status).toBe('LOSE');
      expect(result.detail).toBe('Turn: 4 / 3');
    });
  });

  describe('evaluateGame priority handling', () => {
    const difficulty = {
      targetGdp: 300,
      maxTurns: 10,
      debtLimit: 200,
      minimumSupport: 0,
    };

    const enemy = { gdp: 0, debt: 0, support: 100 };

    test('applies loss conditions before GDP victory when simultaneous', () => {
      const player = { gdp: 320, debt: 220, support: 100 };
      const result = evaluateGame({ player, enemy, difficulty, turn: 5 });

      expect(result.status).toBe('LOSE');
      expect(result.reason).toBe('国家債務が限界を超えました');
      expect(result.detail).toBe('Debt: 220 / 200');
    });
  });

  describe('evaluateGame enemy loss conditions', () => {
    const difficulty = {
      targetGdp: 400,
      maxTurns: 15,
      debtLimit: 250,
      minimumSupport: 25,
    };

    const player = { gdp: 0, debt: 0, support: 50 };

    test('declares win when enemy debt exceeds limit', () => {
      const enemy = { gdp: 0, debt: 260, support: 70 };
      const result = evaluateGame({ player, enemy, difficulty, turn: 7 });

      expect(result.status).toBe('WIN');
      expect(result.reason).toBe('敵国の債務が限界を超えました');
      expect(result.detail).toBe('Debt: 260 / 250');
    });

    test('declares win when enemy support falls below threshold', () => {
      const enemy = { gdp: 0, debt: 100, support: 20 };
      const result = evaluateGame({ player, enemy, difficulty, turn: 8 });

      expect(result.status).toBe('WIN');
      expect(result.reason).toBe('敵国の支持率が底をつきました');
      expect(result.detail).toBe('Support: 20%');
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
    const card = await screen.findByTestId('card-Infrastructure Stimulus');
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
    const cardButton = await screen.findByTestId('card-Infrastructure Stimulus');

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

    const englishCard = await screen.findByTestId('card-Infrastructure Stimulus');
    expect(englishCard).toBeInTheDocument();

    // Switch to Japanese and ensure localized text is used
    await act(async () => {
      fireEvent.click(screen.getByTestId('lang-ja'));
    });

    const japaneseCard = await screen.findByTestId('card-社会資本投資');
    expect(japaneseCard).toBeInTheDocument();
  });

  test('playing Infrastructure Stimulus updates GDP/debt and logs the change', async () => {
    render(<EconomicCardGame />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-Infrastructure Stimulus');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    const playerGdp = parseInt(screen.getByTestId('player-gdp').textContent.replace(/[^\d]/g, ''), 10);
    const playerDebt = parseInt(screen.getByTestId('player-debt').textContent.replace(/[^\d]/g, ''), 10);
    const support = parseInt(screen.getByTestId('player-support').textContent.replace(/[^\d]/g, ''), 10);

    expect(playerGdp).toBe(25);
    expect(playerDebt).toBe(65);
    expect(support).toBe(73);

    const logPanel = screen.getByTestId('log-panel');
    expect(logPanel).toHaveTextContent(/Infrastructure Stimulus executed/i);
  });

  test('Cyber Sanctions impacts enemy economy and support', async () => {
    render(<EconomicCardGame />);

    await act(async () => {
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    const cardButton = await screen.findByTestId('card-Cyber Sanctions');

    await act(async () => {
      fireEvent.click(cardButton);
    });

    const enemyMoney = parseInt(screen.getByTestId('enemy-money').textContent.replace(/[^\d]/g, ''), 10);
    const enemyGdp = parseInt(screen.getByTestId('enemy-gdp').textContent.replace(/[^\d]/g, ''), 10);
    const enemySupport = parseInt(screen.getByTestId('enemy-support').textContent.replace(/[^\d]/g, ''), 10);
    const playerSupport = parseInt(screen.getByTestId('player-support').textContent.replace(/[^\d]/g, ''), 10);

    expect(enemyMoney).toBe(90);
    expect(enemyGdp).toBe(0);
    expect(enemySupport).toBe(62);
    expect(playerSupport).toBe(72);
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
    expect(playerDebt).toBe(170);
    expect(targetGdp).toBe(400);
  });

  test('applies ideology debt on top of difficulty debt at game start', async () => {
    render(<EconomicCardGame />);

    const difficultySelect = screen.getByTestId('difficulty-select');

    await act(async () => {
      fireEvent.change(difficultySelect, { target: { value: 'HARD' } });
      fireEvent.click(screen.getByText(/START GAME/i));
    });

    await screen.findByText(/Your Hand/i);

    const playerDebt = parseInt(screen.getByTestId('player-debt').textContent.replace(/[^\d]/g, ''), 10);
    expect(playerDebt).toBe(170);

    const playerMoneyBeforeTurnEnd = parseInt(screen.getByTestId('player-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(playerMoneyBeforeTurnEnd).toBe(100);

    await act(async () => {
      fireEvent.click(screen.getByText(/End Turn/i));
    });

    const playerMoneyAfterTurn = parseInt(screen.getByTestId('player-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(playerMoneyAfterTurn).toBe(116);
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
    expect(turnIndicator).toHaveTextContent('(Remaining: 35)');
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

    const cardButton = await screen.findByTestId('card-Infrastructure Stimulus');

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
    expect(updatedDebt).toBe(250);

    await act(async () => {
      fireEvent.click(screen.getByText(/End Turn/i));
    });

    const moneyAfterInterest = parseInt(screen.getByTestId('player-money').textContent.replace(/[^\d]/g, ''), 10);
    expect(moneyAfterInterest).toBe(132);
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
