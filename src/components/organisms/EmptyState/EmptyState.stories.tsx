import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import EmptyState from './EmptyState';
import React from 'react';
import { Users, FileText, CreditCard, Package, BarChart3, Inbox } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
	title: 'Organisms/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	argTypes: {
		headline: { control: 'text' },
		subtext: { control: 'text' },
		ctaLabel: { control: 'text' },
	},
	args: {
		onCtaClick: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
	args: {
		headline: 'No data available',
		subtext: 'There is nothing to display here yet.',
	},
};

export const NoCustomers: Story = {
	name: 'No Customers',
	args: {
		icon: Users,
		headline: 'No customers yet',
		subtext: 'Create your first customer to start managing subscriptions and billing.',
		ctaLabel: 'Add Customer',
	},
};

export const NoInvoices: Story = {
	name: 'No Invoices',
	args: {
		icon: FileText,
		headline: 'No invoices found',
		subtext: 'Invoices will appear here once your customers have active subscriptions.',
		ctaLabel: 'Create Invoice',
	},
};

export const NoPlans: Story = {
	name: 'No Plans',
	args: {
		icon: Package,
		headline: 'No plans created',
		subtext: 'Set up your first pricing plan to start accepting subscriptions.',
		ctaLabel: 'Create Plan',
	},
};

export const NoPayments: Story = {
	name: 'No Payments',
	args: {
		icon: CreditCard,
		headline: 'No payments recorded',
		subtext: 'Payments will show up here as invoices are settled.',
	},
};

export const NoRevenue: Story = {
	name: 'No Revenue Data',
	args: {
		icon: BarChart3,
		headline: 'No revenue data',
		subtext: 'Revenue metrics will appear once you have paying customers.',
	},
};

export const WithoutCTA: Story = {
	args: {
		icon: Inbox,
		headline: 'All caught up',
		subtext: 'There are no pending items that require your attention.',
	},
};

export const CTAClickInteraction: Story = {
	args: {
		icon: Users,
		headline: 'No customers',
		subtext: 'Get started by adding your first customer.',
		ctaLabel: 'Add Customer',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: 'Add Customer' });
		await userEvent.click(button);
		await expect(args.onCtaClick).toHaveBeenCalledTimes(1);
	},
};
