
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EconomicCardGame, { SoundManagerInstance } from '../src/Game';

global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

test('Log rendering performance benchmark', async () => {
  // Mock sound manager methods to avoid errors
  jest.spyOn(SoundManagerInstance, 'playCrisis').mockImplementation(() => {});
  jest.spyOn(SoundManagerInstance, 'playClick').mockImplementation(() => {});
  jest.spyOn(SoundManagerInstance, 'playCard').mockImplementation(() => {});

  const startTime = performance.now();

  render(<EconomicCardGame />);

  // Wait for initial render
  await screen.findByText(/START GAME/i);

  await act(async () => {
    fireEvent.click(screen.getByText(/START GAME/i));
  });

  // Find trigger event button
  const triggerButton = await screen.findByTestId('trigger-event');

  // Trigger many log updates
  const iterations = 100;

  await act(async () => {
    for (let i = 0; i < iterations; i++) {
       fireEvent.click(triggerButton);
    }
  });

  const endTime = performance.now();
  console.log(`Time taken for ${iterations} log updates: ${endTime - startTime}ms`);

  jest.restoreAllMocks();
});
