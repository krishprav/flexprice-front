import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import SidebarNav from './SidebarNav';
import React from 'react';
import {
	Home,
	Layers2,
	Landmark,
	BarChart3,
	Settings,
	CodeXml,
	Puzzle,
	GalleryHorizontalEnd,
} from 'lucide-react';
import type { NavItemConfig } from './SidebarNav';

const flexpricNavItems: NavItemConfig[] = [
	{ label: 'Home', href: '/dashboard', icon: Home },
	{
		label: 'Product Catalog',
		href: '/catalog/features',
		icon: Layers2,
		children: [
			{ label: 'Features', href: '/catalog/features' },
			{ label: 'Plans', href: '/catalog/plans' },
			{ label: 'Coupons', href: '/catalog/coupons' },
			{ label: 'Addons', href: '/catalog/addons' },
			{ label: 'Price Units', href: '/catalog/price-units' },
		],
	},
	{
		label: 'Billing',
		href: '/billing/customers',
		icon: Landmark,
		children: [
			{ label: 'Customers', href: '/billing/customers' },
			{ label: 'Subscriptions', href: '/billing/subscriptions' },
			{ label: 'Invoices', href: '/billing/invoices' },
			{ label: 'Credit Notes', href: '/billing/credit-notes' },
			{ label: 'Payments', href: '/billing/payments' },
		],
	},
	{ label: 'Revenue', href: '/revenue', icon: BarChart3 },
	{
		label: 'Tools',
		href: '/tools/imports',
		icon: Settings,
		children: [
			{ label: 'Imports', href: '/tools/imports' },
			{ label: 'Exports', href: '/tools/exports' },
		],
	},
	{
		label: 'Developers',
		href: '/developers/events',
		icon: CodeXml,
		children: [
			{ label: 'Events Debugger', href: '/developers/events' },
			{ label: 'API Keys', href: '/developers/api-keys' },
			{ label: 'Webhooks', href: '/developers/webhooks' },
		],
	},
	{ label: 'Integrations', href: '/integrations', icon: Puzzle },
	{ label: 'Pricing Widget', href: '/pricing', icon: GalleryHorizontalEnd },
];

const meta: Meta<typeof SidebarNav> = {
	title: 'Organisms/SidebarNav',
	component: SidebarNav,
	tags: ['autodocs'],
	argTypes: {
		activeHref: {
			control: 'text',
			description: 'Currently active route path',
		},
		defaultCollapsed: {
			control: 'boolean',
			description: 'Start in collapsed mode',
		},
	},
	args: {
		onNavigate: fn(),
	},
	decorators: [
		(Story) =>
			React.createElement(
				'div',
				{ style: { height: 600, display: 'flex' } },
				React.createElement(Story),
			),
	],
};

export default meta;
type Story = StoryObj<typeof SidebarNav>;

export const Default: Story = {
	args: {
		items: flexpricNavItems,
		activeHref: '/dashboard',
	},
};

export const WithActiveSubItem: Story = {
	name: 'Active Sub-Item (Invoices)',
	args: {
		items: flexpricNavItems,
		activeHref: '/billing/invoices',
	},
};

export const Collapsed: Story = {
	args: {
		items: flexpricNavItems,
		activeHref: '/dashboard',
		defaultCollapsed: true,
	},
};

export const WithHeader: Story = {
	args: {
		items: flexpricNavItems,
		activeHref: '/dashboard',
		header: React.createElement(
			'div',
			{ className: 'flex items-center gap-2' },
			React.createElement(
				'div',
				{ className: 'w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold' },
				'FP',
			),
			React.createElement('span', { className: 'font-semibold text-sm' }, 'FlexPrice'),
		),
	},
};

export const WithHeaderAndFooter: Story = {
	args: {
		items: flexpricNavItems,
		activeHref: '/billing/customers',
		header: React.createElement(
			'div',
			{ className: 'flex items-center gap-2' },
			React.createElement(
				'div',
				{ className: 'w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold' },
				'FP',
			),
			React.createElement('span', { className: 'font-semibold text-sm' }, 'FlexPrice'),
		),
		footer: React.createElement(
			'div',
			{ className: 'flex items-center gap-2 text-sm text-muted-foreground' },
			React.createElement(
				'div',
				{ className: 'w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold' },
				'JD',
			),
			React.createElement('span', null, 'John Doe'),
		),
	},
};

export const DisabledItem: Story = {
	args: {
		items: [
			...flexpricNavItems.slice(0, 3),
			{ ...flexpricNavItems[3], disabled: true },
			...flexpricNavItems.slice(4),
		],
		activeHref: '/dashboard',
	},
};

export const CollapseInteraction: Story = {
	args: {
		items: flexpricNavItems,
		activeHref: '/dashboard',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /collapse sidebar/i }));
		await expect(canvas.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();
	},
};
