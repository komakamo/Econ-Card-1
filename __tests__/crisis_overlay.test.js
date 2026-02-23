import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CrisisOverlay } from '../src/Game';

describe('CrisisOverlay', () => {
  const mockEvent = {
    name: 'Test Event',
    name_en: 'Test Event EN',
    description: 'Test Description',
    description_en: 'Test Description EN',
  };

  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when no event is provided', () => {
    const { container } = render(
      <CrisisOverlay event={null} onClose={mockOnClose} onConfirm={mockOnConfirm} lang="en" />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders event details in English', () => {
    render(
      <CrisisOverlay event={mockEvent} onClose={mockOnClose} onConfirm={mockOnConfirm} lang="en" />
    );

    expect(screen.getByText('Test Event EN')).toBeInTheDocument();
    expect(screen.getByText('Test Description EN')).toBeInTheDocument();
  });

  test('renders event details in Japanese (or default)', () => {
    render(
      <CrisisOverlay event={mockEvent} onClose={mockOnClose} onConfirm={mockOnConfirm} lang="ja" />
    );

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('calls onClose when Close button is clicked', () => {
    render(
      <CrisisOverlay event={mockEvent} onClose={mockOnClose} onConfirm={mockOnConfirm} lang="en" />
    );

    const closeButton = screen.getByTestId('event-close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  test('calls onConfirm when Confirm button is clicked', () => {
    render(
      <CrisisOverlay event={mockEvent} onClose={mockOnClose} onConfirm={mockOnConfirm} lang="en" />
    );

    const confirmButton = screen.getByTestId('event-confirm');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
