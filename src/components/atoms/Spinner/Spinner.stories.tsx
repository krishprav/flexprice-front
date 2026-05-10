import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';
import React from 'react';

/**
 * `Spinner` provides a circular loading indicator used throughout FlexPrice
 * for async operations like data fetching, form submission, and page loading.
 *
 * @example
 * ```tsx
 * <Spinner size={24} className="text-blue-600" />
 * ```
 */
const meta: Meta<typeof Spinner> = {
	title: 'Atoms/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'number', min: 12, max: 64, step: 4 },
			description: 'Width and height of the spinner in pixels',
		},
		className: {
			control: 'text',
			description: 'Additional CSS classes for color overrides',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
	args: {
		size: 24,
	},
};

export const Small: Story = {
	args: {
		size: 16,
	},
};

export const Large: Story = {
	args: {
		size: 48,
	},
};

export const BlueColor: Story = {
	args: {
		size: 24,
		className: 'text-blue-600',
	},
};

export const DestructiveColor: Story = {
	args: {
		size: 24,
		className: 'text-red-500',
	},
};

export const InlineWithText: Story = {
	render: (args) =>
		React.createElement(
			'div',
			{ className: 'flex items-center gap-2 text-sm text-muted-foreground' },
			React.createElement(Spinner, args),
			'Loading invoices...',
		),
	args: {
		size: 16,
		className: 'text-muted-foreground',
	},
};

export const CenteredFullPage: Story = {
	render: (args) =>
		React.createElement(
			'div',
			{ className: 'flex flex-col items-center justify-center h-64 gap-3' },
			React.createElement(Spinner, args),
			React.createElement('p', { className: 'text-sm text-muted-foreground' }, 'Loading dashboard...'),
		),
	args: {
		size: 32,
	},
};
