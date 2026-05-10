import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import FlexPriceSelect from './Select';
import SearchableSelect from './SearchableSelect';

/**
 * `Select` is a single-select dropdown built on Radix Select primitives.
 *
 * Used throughout FlexPrice for choosing billing models, currencies, plan types,
 * and filter values. Supports label, description, error state, radio mode,
 * disabled options, prefix/suffix icons, and custom trigger content.
 *
 * @example
 * ```tsx
 * <Select
 *   label="Billing Model"
 *   options={[
 *     { value: 'FLAT_FEE', label: 'Flat Fee' },
 *     { value: 'TIERED', label: 'Tiered' },
 *   ]}
 *   value={model}
 *   onChange={setModel}
 * />
 * ```
 */
const meta: Meta<typeof FlexPriceSelect> = {
	title: 'Atoms/Select',
	component: FlexPriceSelect,
	tags: ['autodocs'],
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text when no value is selected',
		},
		label: {
			control: 'text',
			description: 'Label displayed above the select',
		},
		description: {
			control: 'text',
			description: 'Helper text displayed below',
		},
		error: {
			control: 'text',
			description: 'Error message displayed below',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the select',
		},
		required: {
			control: 'boolean',
			description: 'Shows required indicator on the label',
		},
		isRadio: {
			control: 'boolean',
			description: 'Uses radio-style selection indicators',
		},
	},
	args: {
		onChange: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof FlexPriceSelect>;

const billingModelOptions = [
	{ value: 'FLAT_FEE', label: 'Flat Fee', description: 'Fixed amount per billing period' },
	{ value: 'TIERED', label: 'Tiered', description: 'Different rates at different volume levels' },
	{ value: 'PACKAGE', label: 'Package', description: 'Fixed price per bundle of units' },
];

const currencyOptions = [
	{ value: 'USD', label: 'USD - US Dollar' },
	{ value: 'EUR', label: 'EUR - Euro' },
	{ value: 'GBP', label: 'GBP - British Pound' },
	{ value: 'INR', label: 'INR - Indian Rupee' },
	{ value: 'JPY', label: 'JPY - Japanese Yen' },
];

const statusOptions = [
	{ value: 'ACTIVE', label: 'Active' },
	{ value: 'ARCHIVED', label: 'Archived' },
	{ value: 'DRAFT', label: 'Draft' },
];

export const Default: Story = {
	args: {
		label: 'Billing Model',
		options: billingModelOptions,
		placeholder: 'Select billing model',
	},
};

export const WithValue: Story = {
	args: {
		label: 'Currency',
		options: currencyOptions,
		value: 'USD',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'Billing Model',
		options: billingModelOptions,
		description: 'Determines how usage is calculated and billed',
	},
};

export const WithError: Story = {
	args: {
		label: 'Plan Status',
		options: statusOptions,
		error: 'Please select a status',
	},
};

export const Required: Story = {
	args: {
		label: 'Currency',
		options: currencyOptions,
		required: true,
		placeholder: 'Select currency',
	},
};

export const RadioMode: Story = {
	args: {
		label: 'Billing Model',
		options: billingModelOptions,
		isRadio: true,
		placeholder: 'Choose a model',
	},
};

export const WithDisabledOptions: Story = {
	args: {
		label: 'Plan Type',
		options: [
			{ value: 'standard', label: 'Standard' },
			{ value: 'enterprise', label: 'Enterprise', disabled: true, description: 'Contact sales' },
			{ value: 'custom', label: 'Custom' },
		],
	},
};

export const SearchableDropdown: Story = {
	render: (args) => (
		<SearchableSelect
			{...args}
			options={currencyOptions}
			label="Searchable Currency"
			placeholder="Search or select currency"
			searchPlaceholder="Search currencies..."
		/>
	),
	args: {
		onChange: fn(),
	},
};

export const Disabled: Story = {
	args: {
		label: 'Locked Selection',
		options: currencyOptions,
		value: 'USD',
		disabled: true,
	},
};

export const NoOptions: Story = {
	args: {
		label: 'Empty Select',
		options: [],
		noOptionsText: 'No items available',
	},
};

export const SelectionInteraction: Story = {
	args: {
		label: 'Billing Model',
		options: billingModelOptions,
		placeholder: 'Select billing model',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('combobox'));

		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(await body.findByText('Tiered'));
		await expect(args.onChange).toHaveBeenCalledWith('TIERED');
	},
};

export const SearchInteraction: Story = {
	render: (args) => (
		<SearchableSelect
			{...args}
			options={currencyOptions}
			label="Searchable Currency"
			placeholder="Search or select currency"
			searchPlaceholder="Search currencies..."
		/>
	),
	args: {
		onChange: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /search or select currency/i }));

		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(await body.findByPlaceholderText('Search currencies...'), 'Indian');
		await userEvent.click(await body.findByText('INR - Indian Rupee'));
		await expect(args.onChange).toHaveBeenCalledWith('INR');
	},
};
