import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Chip from './Chip';

describe('Chip', () => {
	it('renders label text', () => {
		render(React.createElement(Chip, { label: 'Active' }));
		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('applies success variant colors', () => {
		const { container } = render(React.createElement(Chip, { label: 'Active', variant: 'success' }));
		const chip = container.querySelector('span');
		expect(chip?.style.backgroundColor).toBe('rgb(236, 251, 228)'); // #ECFBE4
	});

	it('applies failed variant colors', () => {
		const { container } = render(React.createElement(Chip, { label: 'Failed', variant: 'failed' }));
		const chip = container.querySelector('span');
		expect(chip?.style.backgroundColor).toBe('rgb(254, 226, 226)'); // #FEE2E2
	});

	it('renders icon when provided', () => {
		const icon = React.createElement('span', { 'data-testid': 'icon' }, 'X');
		render(React.createElement(Chip, { label: 'Error', icon }));
		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('fires onClick handler', () => {
		const onClick = vi.fn();
		render(React.createElement(Chip, { label: 'Clickable', onClick }));
		fireEvent.click(screen.getByText('Clickable'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not fire onClick when disabled', () => {
		const onClick = vi.fn();
		render(React.createElement(Chip, { label: 'Disabled', onClick, disabled: true }));
		fireEvent.click(screen.getByText('Disabled'));
		expect(onClick).not.toHaveBeenCalled();
	});

	it('applies disabled styling', () => {
		const { container } = render(React.createElement(Chip, { label: 'Disabled', disabled: true }));
		const chip = container.querySelector('span');
		expect(chip?.getAttribute('aria-disabled')).toBe('true');
	});

	it('renders childrenAfter content', () => {
		const after = React.createElement('span', { 'data-testid': 'after' }, '!');
		render(React.createElement(Chip, { label: 'Warning', childrenAfter: after }));
		expect(screen.getByTestId('after')).toBeInTheDocument();
	});

	it('uses custom colors when provided', () => {
		const { container } = render(
			React.createElement(Chip, {
				label: 'Custom',
				bgColor: '#FF0000',
				textColor: '#FFFFFF',
			}),
		);
		const chip = container.querySelector('span');
		expect(chip?.style.backgroundColor).toBe('rgb(255, 0, 0)');
		expect(chip?.style.color).toBe('rgb(255, 255, 255)');
	});
});
