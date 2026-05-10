import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import Input from './Input';
import React from 'react';
import { DollarSign, Percent, Search } from 'lucide-react';

/**
 * `Input` is the primary text/number input used across FlexPrice forms.
 *
 * Supports text, number, formatted-number, and integer variants with automatic
 * thousand-separator formatting. Includes label, description, error state,
 * prefix/suffix elements, and multiple size presets.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Price"
 *   variant="formatted-number"
 *   inputPrefix={<DollarSign />}
 *   value={amount}
 *   onChange={setAmount}
 *   error={errors.amount}
 * />
 * ```
 */
const meta: Meta<typeof Input> = {
	title: 'Atoms/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['text', 'number', 'formatted-number', 'integer'],
			description: 'Input type variant controlling validation and formatting',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'default', 'lg', 'icon'],
			description: 'Size preset',
		},
		label: {
			control: 'text',
			description: 'Label displayed above the input',
		},
		error: {
			control: 'text',
			description: 'Error message displayed below the input',
		},
		description: {
			control: 'text',
			description: 'Helper text displayed below the input',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder text',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the input',
		},
	},
	args: {
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: {
		label: 'Plan Name',
		placeholder: 'Enter plan name',
		variant: 'text',
	},
};

export const WithValue: Story = {
	args: {
		label: 'Plan Name',
		value: 'Enterprise Plan',
		variant: 'text',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'External ID',
		placeholder: 'e.g. plan_enterprise_v2',
		description: 'A unique identifier used to reference this plan via the API',
	},
};

export const WithError: Story = {
	args: {
		label: 'Plan Name',
		value: '',
		error: 'Plan name is required',
		placeholder: 'Enter plan name',
	},
};

export const CurrencyPrefix: Story = {
	name: 'With Currency Prefix ($)',
	args: {
		label: 'Price Amount',
		variant: 'formatted-number',
		placeholder: '0.00',
		inputPrefix: React.createElement(DollarSign, { className: 'size-4 text-muted-foreground' }),
	},
};

export const WithSuffix: Story = {
	args: {
		label: 'Discount',
		variant: 'number',
		placeholder: '0',
		suffix: React.createElement(Percent, { className: 'size-4' }),
	},
};

export const SearchInput: Story = {
	args: {
		placeholder: 'Search customers...',
		inputPrefix: React.createElement(Search, { className: 'size-4 text-muted-foreground' }),
		variant: 'text',
	},
};

export const NumberInput: Story = {
	args: {
		label: 'Quantity',
		variant: 'number',
		placeholder: '0',
	},
};

export const FormattedNumber: Story = {
	args: {
		label: 'Revenue',
		variant: 'formatted-number',
		value: '1234567',
		inputPrefix: React.createElement(DollarSign, { className: 'size-4 text-muted-foreground' }),
	},
};

export const IntegerOnly: Story = {
	args: {
		label: 'Max Users',
		variant: 'integer',
		placeholder: '100',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Locked Field',
		value: 'Cannot edit',
		disabled: true,
	},
};

export const SmallSize: Story = {
	args: {
		label: 'Small Input',
		placeholder: 'sm size',
		size: 'sm',
	},
};

export const LargeSize: Story = {
	args: {
		label: 'Large Input',
		placeholder: 'lg size',
		size: 'lg',
	},
};

export const TypingInteraction: Story = {
	args: {
		label: 'Customer Name',
		placeholder: 'Type here...',
		variant: 'text',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'Acme Corp');
		await expect(args.onChange).toHaveBeenCalled();
	},
};
