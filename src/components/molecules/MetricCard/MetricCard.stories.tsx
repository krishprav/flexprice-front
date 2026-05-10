import type { Meta, StoryObj } from '@storybook/react';
import MetricCard from '../MetricCard';
import React from 'react';

/**
 * `MetricCard` displays a KPI metric with its title, formatted value, and
 * optional trend indicator. Used on the FlexPrice dashboard to show
 * revenue, customer count, MRR, and other key business metrics.
 *
 * Supports currency formatting, percentage display, and positive/negative
 * trend indicators (up/down arrows).
 *
 * @example
 * ```tsx
 * <MetricCard
 *   title="Monthly Recurring Revenue"
 *   value={45230}
 *   currency="USD"
 *   showChangeIndicator
 * />
 * ```
 */
const meta: Meta<typeof MetricCard> = {
	title: 'Molecules/MetricCard',
	component: MetricCard,
	tags: ['autodocs'],
	argTypes: {
		title: {
			control: 'text',
			description: 'Label for the metric',
		},
		value: {
			control: 'number',
			description: 'Numeric value to display',
		},
		currency: {
			control: 'text',
			description: 'ISO currency code (e.g. USD, EUR) for symbol formatting',
		},
		isPercent: {
			control: 'boolean',
			description: 'Display value as a percentage',
		},
		showChangeIndicator: {
			control: 'boolean',
			description: 'Show trending up/down arrow',
		},
		isNegative: {
			control: 'boolean',
			description: 'Indicates negative trend (shows red down arrow)',
		},
	},
	decorators: [
		(Story) =>
			React.createElement(
				'div',
				{ style: { maxWidth: 300 } },
				React.createElement(Story),
			),
	],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
	args: {
		title: 'Total Revenue',
		value: 125400,
		currency: 'USD',
	},
};

export const WithTrendUp: Story = {
	args: {
		title: 'Monthly Recurring Revenue',
		value: 45230,
		currency: 'USD',
		showChangeIndicator: true,
		isNegative: false,
	},
};

export const WithTrendDown: Story = {
	args: {
		title: 'Churn Rate',
		value: 3200,
		currency: 'USD',
		showChangeIndicator: true,
		isNegative: true,
	},
};

export const Percentage: Story = {
	args: {
		title: 'Conversion Rate',
		value: 12.5,
		isPercent: true,
	},
};

export const PercentageWithTrend: Story = {
	args: {
		title: 'Growth Rate',
		value: 8.3,
		isPercent: true,
		showChangeIndicator: true,
		isNegative: false,
	},
};

export const LargeValue: Story = {
	args: {
		title: 'Annual Revenue',
		value: 1543200,
		currency: 'USD',
	},
};

export const EurosCurrency: Story = {
	args: {
		title: 'EU Revenue',
		value: 89750,
		currency: 'EUR',
	},
};

export const ZeroValue: Story = {
	args: {
		title: 'Pending Invoices',
		value: 0,
	},
};

export const DashboardGrid: Story = {
	render: () =>
		React.createElement(
			'div',
			{ className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' },
			React.createElement(MetricCard, {
				title: 'Total Revenue',
				value: 125400,
				currency: 'USD',
				showChangeIndicator: true,
			}),
			React.createElement(MetricCard, {
				title: 'Active Subscriptions',
				value: 342,
			}),
			React.createElement(MetricCard, {
				title: 'MRR',
				value: 45230,
				currency: 'USD',
				showChangeIndicator: true,
			}),
			React.createElement(MetricCard, {
				title: 'Churn Rate',
				value: 2.4,
				isPercent: true,
				showChangeIndicator: true,
				isNegative: true,
			}),
		),
};

export const DashboardOverview: Story = {
	render: () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#F8FAFC]">
			<MetricCard
				title="Total Revenue"
				value={128450}
				currency="USD"
				trend={{ value: 12.5, isUp: true }}
			/>
			<MetricCard
				title="Active Subscriptions"
				value={1240}
				trend={{ value: 3.2, isUp: true }}
			/>
			<MetricCard
				title="Churn Rate"
				value={2.4}
				format="percentage"
				trend={{ value: 0.5, isUp: false }}
			/>
			<MetricCard
				title="Avg. Revenue Per User"
				value={103.5}
				currency="USD"
				trend={{ value: 1.2, isUp: true }}
			/>
		</div>
	),
};

