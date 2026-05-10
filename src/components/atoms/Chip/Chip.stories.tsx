import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import Chip from './Chip';
import React from 'react';
import { Check, X, Clock, AlertTriangle, Info } from 'lucide-react';

/**
 * `Chip` (also known as Badge/StatusChip) is used throughout FlexPrice to indicate
 * the status of entities like plans, invoices, subscriptions, and payments.
 *
 * Supports five semantic variants: `default`, `success`, `warning`, `failed`, and `info`.
 * Custom colors can override variant defaults. Supports icons and trailing content.
 *
 * @example
 * ```tsx
 * <Chip variant="success" label="Active" icon={<Check />} />
 * ```
 */
const meta: Meta<typeof Chip> = {
	title: 'Atoms/Chip',
	component: Chip,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'success', 'warning', 'failed', 'info'],
			description: 'Semantic color variant',
		},
		label: {
			control: 'text',
			description: 'Text content of the chip',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables click interaction and reduces opacity',
		},
		textColor: {
			control: 'color',
			description: 'Custom text color (overrides variant)',
		},
		bgColor: {
			control: 'color',
			description: 'Custom background color (overrides variant)',
		},
		borderColor: {
			control: 'color',
			description: 'Custom border color',
		},
	},
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
	args: {
		label: 'Default',
		variant: 'default',
	},
};

export const Success: Story = {
	args: {
		label: 'Active',
		variant: 'success',
	},
};

export const Warning: Story = {
	args: {
		label: 'Pending',
		variant: 'warning',
	},
};

export const Failed: Story = {
	args: {
		label: 'Failed',
		variant: 'failed',
	},
};

export const InfoVariant: Story = {
	name: 'Info',
	args: {
		label: 'In Progress',
		variant: 'info',
	},
};

export const WithIcon: Story = {
	args: {
		label: 'Active',
		variant: 'success',
		icon: React.createElement(Check, { className: 'size-3' }),
	},
};

export const WithTrailingContent: Story = {
	args: {
		label: 'Expires Soon',
		variant: 'warning',
		childrenAfter: React.createElement(AlertTriangle, { className: 'size-3' }),
	},
};

export const Clickable: Story = {
	args: {
		label: 'Click Me',
		variant: 'info',
		onClick: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByText('Click Me');
		await userEvent.click(chip);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled',
		variant: 'default',
		disabled: true,
		onClick: fn(),
	},
};

export const CustomColors: Story = {
	args: {
		label: 'Custom',
		bgColor: '#F0E6FF',
		textColor: '#7C3AED',
		borderColor: '#DDD6FE',
	},
};

// Domain-specific status chips matching FlexPrice UI
export const PlanActive: Story = {
	name: 'Plan Status: Active',
	args: {
		label: 'Active',
		variant: 'success',
		icon: React.createElement(Check, { className: 'size-3' }),
	},
};

export const PlanArchived: Story = {
	name: 'Plan Status: Archived',
	args: {
		label: 'Archived',
		variant: 'default',
	},
};

export const InvoiceDraft: Story = {
	name: 'Invoice Status: Draft',
	args: {
		label: 'Draft',
		variant: 'default',
		icon: React.createElement(Clock, { className: 'size-3' }),
	},
};

export const InvoiceFinalized: Story = {
	name: 'Invoice Status: Finalized',
	args: {
		label: 'Finalized',
		variant: 'success',
		icon: React.createElement(Check, { className: 'size-3' }),
	},
};

export const InvoiceVoided: Story = {
	name: 'Invoice Status: Voided',
	args: {
		label: 'Void',
		variant: 'default',
		icon: React.createElement(X, { className: 'size-3' }),
	},
};

export const PaymentPending: Story = {
	name: 'Payment: Pending',
	args: {
		label: 'Pending',
		variant: 'warning',
		icon: React.createElement(Clock, { className: 'size-3' }),
	},
};

export const PaymentSucceeded: Story = {
	name: 'Payment: Succeeded',
	args: {
		label: 'Succeeded',
		variant: 'success',
		icon: React.createElement(Check, { className: 'size-3' }),
	},
};

export const PaymentFailed: Story = {
	name: 'Payment: Failed',
	args: {
		label: 'Failed',
		variant: 'failed',
		icon: React.createElement(X, { className: 'size-3' }),
	},
};

export const SubscriptionTrialing: Story = {
	name: 'Subscription: Trialing',
	args: {
		label: 'Trialing',
		variant: 'info',
		icon: React.createElement(Info, { className: 'size-3' }),
	},
};
