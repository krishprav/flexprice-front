import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import Button from './Button';
import { Plus, Download, Trash2 } from 'lucide-react';
import React from 'react';

/**
 * `Button` is the primary interactive element in FlexPrice.
 *
 * Built on Radix `Slot` with `class-variance-authority` for variant management.
 * Supports multiple visual variants, sizes, loading state, and prefix/suffix icons.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="default" onClick={handleClick}>
 *   Create Plan
 * </Button>
 * ```
 */
const meta: Meta<typeof Button> = {
	title: 'Atoms/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'black', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
			description: 'Visual style variant of the button',
		},
		size: {
			control: 'select',
			options: ['default', 'sm', 'lg', 'icon', 'xs'],
			description: 'Size preset for the button',
		},
		isLoading: {
			control: 'boolean',
			description: 'Shows a spinner and disables the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Prevents interaction',
		},
		asChild: {
			control: 'boolean',
			description: 'Merge props onto the child element instead of rendering a <button>',
		},
	},
	args: {
		onClick: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		children: 'Create Plan',
		variant: 'default',
		size: 'default',
	},
};

export const Primary: Story = {
	args: {
		children: 'Save Changes',
		variant: 'default',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Cancel',
		variant: 'secondary',
	},
};

export const Ghost: Story = {
	args: {
		children: 'View Details',
		variant: 'ghost',
	},
};

export const Danger: Story = {
	args: {
		children: 'Delete Plan',
		variant: 'destructive',
		prefixIcon: React.createElement(Trash2, { className: 'size-4' }),
	},
};

export const Outline: Story = {
	args: {
		children: 'Export CSV',
		variant: 'outline',
		prefixIcon: React.createElement(Download, { className: 'size-4' }),
	},
};

export const Link: Story = {
	args: {
		children: 'Learn More',
		variant: 'link',
	},
};

export const Small: Story = {
	args: {
		children: 'Small',
		size: 'sm',
	},
};

export const Large: Story = {
	args: {
		children: 'Large Button',
		size: 'lg',
	},
};

export const ExtraSmall: Story = {
	args: {
		children: 'XS',
		size: 'xs',
	},
};

export const WithPrefixIcon: Story = {
	args: {
		children: 'Add Customer',
		prefixIcon: React.createElement(Plus, { className: 'size-4' }),
	},
};

export const WithSuffixIcon: Story = {
	args: {
		children: 'Download',
		variant: 'outline',
		suffixIcon: React.createElement(Download, { className: 'size-4' }),
	},
};

export const Loading: Story = {
	args: {
		children: 'Saving...',
		isLoading: true,
	},
};

export const Disabled: Story = {
	args: {
		children: 'Unavailable',
		disabled: true,
	},
};

export const ClickInteraction: Story = {
	args: {
		children: 'Click Me',
		variant: 'default',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};

export const LoadingPreventsClick: Story = {
	args: {
		children: 'Saving...',
		isLoading: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');
		await expect(button).toBeDisabled();
		await userEvent.click(button);
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
