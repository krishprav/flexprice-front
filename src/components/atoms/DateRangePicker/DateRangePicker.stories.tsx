import type { Meta, StoryObj } from '@storybook/react';
import DateRangePicker from './DateRangePicker';
import { expect, fn, userEvent, within } from '@storybook/test';
import React from 'react';

/**
 * `DateRangePicker` provides a two-month calendar popover for selecting date ranges.
 *
 * Used throughout FlexPrice for analytics filtering, invoice date ranges,
 * and subscription period selection. Supports timezone switching (local/UTC),
 * min/max date constraints, and programmatic value control.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   startDate={startDate}
 *   endDate={endDate}
 *   onChange={({ startDate, endDate }) => setRange({ startDate, endDate })}
 * />
 * ```
 */
const meta: Meta<typeof DateRangePicker> = {
	title: 'Atoms/DateRangePicker',
	component: DateRangePicker,
	tags: ['autodocs'],
	argTypes: {
		placeholder: {
			control: 'text',
			description: 'Placeholder text when no dates are selected',
		},
		disabled: {
			control: 'boolean',
			description: 'Disables the picker',
		},
		title: {
			control: 'text',
			description: 'Label displayed above the picker',
		},
	},
	args: {
		onChange: fn(),
	},
	decorators: [
		(Story) =>
			React.createElement('div', { style: { minHeight: 400 } }, React.createElement(Story)),
	],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
	args: {
		placeholder: 'Select date range',
	},
};

export const WithTitle: Story = {
	args: {
		title: 'Billing Period',
		placeholder: 'Select range',
	},
};

export const WithPreselectedRange: Story = {
	args: {
		title: 'Invoice Period',
		startDate: new Date(2025, 0, 1),
		endDate: new Date(2025, 0, 31),
	},
};

export const Disabled: Story = {
	args: {
		placeholder: 'Select range',
		disabled: true,
	},
};

export const WithMinMaxDates: Story = {
	args: {
		title: 'Constrained Range',
		minDate: new Date(2025, 0, 1),
		maxDate: new Date(2025, 11, 31),
		placeholder: '2025 only',
	},
};

export const OpenCalendarInteraction: Story = {
	args: {
		placeholder: 'Select date range',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: /select date range/i }));

		const body = within(canvasElement.ownerDocument.body);
		await expect(await body.findAllByRole('grid')).not.toHaveLength(0);
	},
};
