import type { Meta, StoryObj } from '@storybook/react';
import UsageBar from './UsageBar';
import React from 'react';

/**
 * `UsageBar` shows a labelled progress bar for metered usage vs entitlement.
 * Automatically applies warning (amber) and danger (red) colors at thresholds.
 */
const meta: Meta<typeof UsageBar> = {
	title: 'Molecules/UsageBar',
	component: UsageBar,
	tags: ['autodocs'],
	argTypes: {
		used: {
			control: { type: 'number', min: 0 },
			description: 'Units consumed',
		},
		entitled: {
			control: { type: 'number', min: 0 },
			description: 'Total entitled units',
		},
		label: {
			control: 'text',
		},
		unit: {
			control: 'text',
		},
		indicatorColor: {
			control: 'text',
			description: 'Tailwind bg class override (e.g. bg-green-500)',
		},
	},
	decorators: [
		(Story) =>
			React.createElement('div', { style: { maxWidth: 500 } }, React.createElement(Story)),
	],
};

export default meta;
type Story = StoryObj<typeof UsageBar>;

export const Default: Story = {
	args: {
		used: 3500,
		entitled: 10000,
		label: 'API Calls',
		unit: 'calls',
	},
};

export const NearLimit: Story = {
	args: {
		used: 8500,
		entitled: 10000,
		label: 'API Calls',
		unit: 'calls',
	},
};

export const Exceeded: Story = {
	args: {
		used: 12500,
		entitled: 10000,
		label: 'API Calls',
		unit: 'calls',
	},
};

export const Empty: Story = {
	args: {
		used: 0,
		entitled: 10000,
		label: 'Storage',
		unit: 'GB',
	},
};

export const Full: Story = {
	args: {
		used: 10000,
		entitled: 10000,
		label: 'Requests',
		unit: 'requests',
	},
};

export const HalfUsed: Story = {
	args: {
		used: 5000,
		entitled: 10000,
		label: 'Events',
		unit: 'events',
	},
};

export const CustomColor: Story = {
	args: {
		used: 4000,
		entitled: 10000,
		label: 'Custom Color',
		unit: 'units',
		indicatorColor: 'bg-purple-500',
	},
};

export const MultipleMeters: Story = {
	render: () =>
		React.createElement(
			'div',
			{ className: 'space-y-4' },
			React.createElement(UsageBar, {
				used: 3500,
				entitled: 10000,
				label: 'API Calls',
				unit: 'calls',
			}),
			React.createElement(UsageBar, {
				used: 45,
				entitled: 50,
				label: 'Storage',
				unit: 'GB',
			}),
			React.createElement(UsageBar, {
				used: 12000,
				entitled: 10000,
				label: 'Compute Hours',
				unit: 'hours',
			}),
		),
};
