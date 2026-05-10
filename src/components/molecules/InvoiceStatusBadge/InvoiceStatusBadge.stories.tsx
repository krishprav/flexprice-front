import type { Meta, StoryObj } from '@storybook/react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import React from 'react';

/**
 * `InvoiceStatusBadge` maps FlexPrice invoice status strings to consistently
 * coloured chips with icons. Handles DRAFT, FINALIZED, VOIDED, and SKIPPED statuses.
 */
const meta: Meta<typeof InvoiceStatusBadge> = {
	title: 'Molecules/InvoiceStatusBadge',
	component: InvoiceStatusBadge,
	tags: ['autodocs'],
	argTypes: {
		status: {
			control: 'select',
			options: ['DRAFT', 'FINALIZED', 'VOIDED', 'SKIPPED', 'UNKNOWN'],
			description: 'Invoice status string',
		},
	},
};

export default meta;
type Story = StoryObj<typeof InvoiceStatusBadge>;

export const Default: Story = {
	args: {
		status: 'FINALIZED',
	},
};

export const Draft: Story = {
	args: { status: 'DRAFT' },
};

export const Finalized: Story = {
	args: { status: 'FINALIZED' },
};

export const Voided: Story = {
	args: { status: 'VOIDED' },
};

export const Skipped: Story = {
	args: { status: 'SKIPPED' },
};

export const UnknownStatus: Story = {
	args: { status: 'UNKNOWN' },
};

export const CaseInsensitive: Story = {
	name: 'Case Insensitive (lowercase input)',
	args: { status: 'finalized' },
};

export const AllStatuses: Story = {
	render: () =>
		React.createElement(
			'div',
			{ className: 'flex flex-wrap gap-3 items-center' },
			React.createElement(InvoiceStatusBadge, { status: 'DRAFT' }),
			React.createElement(InvoiceStatusBadge, { status: 'FINALIZED' }),
			React.createElement(InvoiceStatusBadge, { status: 'VOIDED' }),
			React.createElement(InvoiceStatusBadge, { status: 'SKIPPED' }),
		),
};
