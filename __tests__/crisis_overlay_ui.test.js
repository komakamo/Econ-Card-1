import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CrisisOverlay } from '../src/Game';

describe('CrisisOverlay UI Tests', () => {
    test('does not render anything when show is false', () => {
        const { container } = render(<CrisisOverlay show={false} message="Invisible Message" />);
        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByText('Invisible Message')).toBeNull();
    });

    test('renders message and correct styles when show is true with default type danger', () => {
        const { container } = render(<CrisisOverlay show={true} message="Global Meltdown" />);

        // Assert message and static text are visible
        expect(screen.getByText('Global Meltdown')).toBeInTheDocument();
        expect(screen.getByText('EMERGENCY ALERT')).toBeInTheDocument();

        // Find the inner div that should have the styling
        // The outer div has "fixed inset-0", inner div has the color classes
        const innerDiv = container.querySelector('.animate-pop-in');
        expect(innerDiv).toBeInTheDocument();

        // Verify 'danger' classes are applied
        expect(innerDiv.className).toContain('text-red-500');
        expect(innerDiv.className).toContain('border-red-600');
        expect(innerDiv.className).toContain('bg-red-950/90');
    });

    test('renders correctly with warning type', () => {
        const { container } = render(<CrisisOverlay show={true} message="Minor Inconvenience" type="warning" />);

        expect(screen.getByText('Minor Inconvenience')).toBeInTheDocument();

        const innerDiv = container.querySelector('.animate-pop-in');
        expect(innerDiv).toBeInTheDocument();

        // Verify 'warning' classes are applied
        expect(innerDiv.className).toContain('text-amber-500');
        expect(innerDiv.className).toContain('border-amber-600');
        expect(innerDiv.className).toContain('bg-amber-950/90');
    });
});
