import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import SearchBar from './SearchBar';
import React from 'react';

const meta: Meta<typeof SearchBar> = {
	title: 'Molecules/SearchBar',
	component: SearchBar,
	tags: ['autodocs'],
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text',
		},
		debounceMs: {
			control: { type: 'number', min: 0, max: 2000, step: 50 },
			description: 'Debounce delay in milliseconds',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the search bar',
		},
	},
	args: {
		onChange: fn(),
		onClear: fn(),
	},
	decorators: [
		(Story) =>
			React.createElement('div', { style: { maxWidth: 400 } }, React.createElement(Story)),
	],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
	args: {
		placeholder: 'Search customers...',
	},
};

export const WithValue: Story = {
	args: {
		placeholder: 'Search...',
		value: 'Acme Corp',
	},
};

export const CustomDebounce: Story = {
	name: 'Long Debounce (1s)',
	args: {
		placeholder: 'Debounced search (1s)...',
		debounceMs: 1000,
	},
};

export const NoDebounce: Story = {
	args: {
		placeholder: 'Instant search...',
		debounceMs: 0,
	},
};

export const Disabled: Story = {
	args: {
		placeholder: 'Search disabled',
		disabled: true,
	},
};

export const InvoiceSearch: Story = {
	args: {
		placeholder: 'Search by invoice number...',
	},
};

export const PlanSearch: Story = {
	args: {
		placeholder: 'Search plans...',
	},
};

export const TypingInteraction: Story = {
	args: {
		placeholder: 'Type to search...',
		debounceMs: 0,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Type to search...');
		await userEvent.type(input, 'test query');
		// With 0 debounce, onChange should fire for each character
		await expect(args.onChange).toHaveBeenCalled();
	},
};

export const ClearInteraction: Story = {
	args: {
		placeholder: 'Search invoices...',
		value: 'INV-1001',
		debounceMs: 0,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /clear search/i }));
		await expect(args.onChange).toHaveBeenCalledWith('');
		await expect(args.onClear).toHaveBeenCalled();
	},
};
