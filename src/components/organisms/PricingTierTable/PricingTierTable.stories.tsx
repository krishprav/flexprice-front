import type { Meta, StoryObj } from '@storybook/react';
import PricingTierTable from './PricingTierTable';
import React from 'react';

const meta: Meta<typeof PricingTierTable> = {
	title: 'Organisms/PricingTierTable',
	component: PricingTierTable,
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: 'radio',
			options: ['volume', 'slab'],
			description: 'Pricing model: volume or slab (graduated)',
		},
		currencySymbol: {
			control: 'text',
			description: 'Currency symbol prefix',
		},
	},
	decorators: [
		(Story) =>
			React.createElement('div', { style: { maxWidth: 600 } }, React.createElement(Story)),
	],
};

export default meta;
type Story = StoryObj<typeof PricingTierTable>;

export const Default: Story = {
	args: {
		tiers: [
			{ from: 0, to: 1000, unitAmount: '0.10' },
			{ from: 1001, to: 10000, unitAmount: '0.08' },
			{ from: 10001, to: null, unitAmount: '0.05' },
		],
		currencySymbol: '$',
		mode: 'volume',
	},
};

export const SlabPricing: Story = {
	name: 'Slab (Graduated) Pricing',
	args: {
		tiers: [
			{ from: 0, to: 100, unitAmount: '0.50' },
			{ from: 101, to: 500, unitAmount: '0.30' },
			{ from: 501, to: 2000, unitAmount: '0.15' },
			{ from: 2001, to: null, unitAmount: '0.08' },
		],
		currencySymbol: '$',
		mode: 'slab',
	},
};

export const WithFlatFees: Story = {
	args: {
		tiers: [
			{ from: 0, to: 100, unitAmount: '0.10', flatAmount: '10.00' },
			{ from: 101, to: 1000, unitAmount: '0.08', flatAmount: '5.00' },
			{ from: 1001, to: null, unitAmount: '0.05', flatAmount: '0.00' },
		],
		currencySymbol: '$',
		mode: 'slab',
	},
};

export const SingleTier: Story = {
	args: {
		tiers: [{ from: 0, to: null, unitAmount: '0.25' }],
		currencySymbol: '$',
		mode: 'volume',
	},
};

export const ManyTiers: Story = {
	args: {
		tiers: [
			{ from: 0, to: 100, unitAmount: '1.00' },
			{ from: 101, to: 500, unitAmount: '0.80' },
			{ from: 501, to: 1000, unitAmount: '0.60' },
			{ from: 1001, to: 5000, unitAmount: '0.40' },
			{ from: 5001, to: 10000, unitAmount: '0.25' },
			{ from: 10001, to: 50000, unitAmount: '0.15' },
			{ from: 50001, to: null, unitAmount: '0.10' },
		],
		currencySymbol: '$',
		mode: 'slab',
	},
};

export const EuroCurrency: Story = {
	args: {
		tiers: [
			{ from: 0, to: 500, unitAmount: '0.12' },
			{ from: 501, to: 5000, unitAmount: '0.09' },
			{ from: 5001, to: null, unitAmount: '0.06' },
		],
		currencySymbol: '\u20AC',
		mode: 'volume',
	},
};
