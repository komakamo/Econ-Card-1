import React from 'react';
import { render } from '@testing-library/react';
import EconomicCardGame from '../src/Game';

describe('EconomicCardGame Performance', () => {
  it('should render fast without excessive object allocations', () => {
    const start = performance.now();

    // Render the setup screen multiple times to see the impact
    for (let i = 0; i < 100; i++) {
      const { unmount, getByText } = render(<EconomicCardGame />);
      getByText('START GAME').click(); // Enter SETUP state
      unmount();
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`Render 100 times took ${duration}ms`);
  });
});
