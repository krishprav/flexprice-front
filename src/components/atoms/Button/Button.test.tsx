import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Button from './Button';

describe('Button', () => {
	it('renders children text', () => {
		render(React.createElement(Button, null, 'Save'));
		expect(screen.getByRole('button')).toHaveTextContent('Save');
	});

	it('fires onClick handler', () => {
		const onClick = vi.fn();
		render(React.createElement(Button, { onClick }, 'Click'));
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('is disabled when isLoading is true', () => {
		render(React.createElement(Button, { isLoading: true }, 'Loading'));
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('is disabled when disabled prop is true', () => {
		render(React.createElement(Button, { disabled: true }, 'Disabled'));
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('does not fire onClick when disabled', () => {
		const onClick = vi.fn();
		render(React.createElement(Button, { disabled: true, onClick }, 'Disabled'));
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();
	});

	it('shows loading spinner when isLoading', () => {
		const { container } = render(React.createElement(Button, { isLoading: true }, 'Save'));
		const svg = container.querySelector('svg');
		expect(svg).toBeTruthy();
		expect(svg?.classList.contains('animate-spin')).toBe(true);
	});

	it('renders prefix icon', () => {
		const icon = React.createElement('span', { 'data-testid': 'prefix' }, '+');
		render(React.createElement(Button, { prefixIcon: icon }, 'Add'));
		expect(screen.getByTestId('prefix')).toBeInTheDocument();
	});

	it('renders suffix icon', () => {
		const icon = React.createElement('span', { 'data-testid': 'suffix' }, '>');
		render(React.createElement(Button, { suffixIcon: icon }, 'Next'));
		expect(screen.getByTestId('suffix')).toBeInTheDocument();
	});
});
