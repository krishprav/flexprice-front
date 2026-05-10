import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import Tooltip from './Tooltip';
import React from 'react';
import { Info, HelpCircle } from 'lucide-react';

/**
 * `Tooltip` wraps Radix UI's tooltip primitives to provide contextual
 * information on hover. Used throughout FlexPrice for explaining pricing
 * concepts, field descriptions, and action hints.
 *
 * @example
 * ```tsx
 * <Tooltip content="Total revenue including all subscriptions" side="top">
 *   <Info className="size-4 text-muted-foreground cursor-help" />
 * </Tooltip>
 * ```
 */
const meta: Meta<typeof Tooltip> = {
	title: 'Atoms/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	argTypes: {
		side: {
			control: 'select',
			options: ['top', 'right', 'bottom', 'left'],
			description: 'Which side of the trigger to show the tooltip',
		},
		align: {
			control: 'select',
			options: ['start', 'center', 'end'],
			description: 'Alignment of the tooltip relative to the trigger',
		},
		delayDuration: {
			control: { type: 'number', min: 0, max: 2000, step: 100 },
			description: 'Delay in ms before showing the tooltip',
		},
		sideOffset: {
			control: { type: 'number', min: 0, max: 20 },
			description: 'Offset from the trigger in pixels',
		},
	},
	parameters: {
		docs: {
			description: {
				component: 'Hover over the trigger element to see the tooltip.',
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	args: {
		content: 'Total Monthly Recurring Revenue',
		side: 'top',
		children: React.createElement(
			'span',
			{ className: 'inline-flex items-center gap-1 text-sm text-muted-foreground cursor-help' },
			'MRR',
			React.createElement(Info, { className: 'size-4' }),
		),
	},
};

export const TopPlacement: Story = {
	args: {
		content: 'Shown above the trigger',
		side: 'top',
		children: React.createElement(
			'button',
			{ className: 'px-3 py-1 border rounded text-sm' },
			'Hover (Top)',
		),
	},
};

export const RightPlacement: Story = {
	args: {
		content: 'Shown to the right',
		side: 'right',
		children: React.createElement(
			'button',
			{ className: 'px-3 py-1 border rounded text-sm' },
			'Hover (Right)',
		),
	},
};

export const BottomPlacement: Story = {
	args: {
		content: 'Shown below the trigger',
		side: 'bottom',
		children: React.createElement(
			'button',
			{ className: 'px-3 py-1 border rounded text-sm' },
			'Hover (Bottom)',
		),
	},
};

export const LeftPlacement: Story = {
	args: {
		content: 'Shown to the left',
		side: 'left',
		children: React.createElement(
			'button',
			{ className: 'px-3 py-1 border rounded text-sm ml-32' },
			'Hover (Left)',
		),
	},
};

export const LongDelay: Story = {
	args: {
		content: 'This tooltip has a 1 second delay',
		delayDuration: 1000,
		children: React.createElement(
			'span',
			{ className: 'inline-flex items-center gap-1 text-sm cursor-help' },
			'Delayed tooltip',
			React.createElement(HelpCircle, { className: 'size-4 text-muted-foreground' }),
		),
	},
};

export const NoDelay: Story = {
	args: {
		content: 'Appears instantly',
		delayDuration: 0,
		children: React.createElement(
			'span',
			{ className: 'inline-flex items-center gap-1 text-sm cursor-help' },
			'Instant tooltip',
			React.createElement(Info, { className: 'size-4 text-muted-foreground' }),
		),
	},
};

export const RichContent: Story = {
	args: {
		content: React.createElement(
			'div',
			{ className: 'space-y-1' },
			React.createElement('p', { className: 'font-medium' }, 'Tiered Pricing'),
			React.createElement(
				'p',
				{ className: 'text-xs text-muted-foreground' },
				'Different rates apply at different usage levels. The price per unit changes as usage increases.',
			),
		),
		children: React.createElement(
			'span',
			{ className: 'inline-flex items-center gap-1 text-sm text-blue-600 cursor-help underline decoration-dotted' },
			'What is tiered pricing?',
		),
	},
};

export const HoverInteraction: Story = {
	args: {
		content: 'Tooltip appears on hover',
		delayDuration: 0,
		children: React.createElement(
			'button',
			{ className: 'px-3 py-1 border rounded text-sm' },
			'Hover Me',
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByText('Hover Me');
		await userEvent.hover(trigger);
		
		const body = within(canvasElement.ownerDocument.body);
		await expect(await body.findByText('Tooltip appears on hover')).toBeInTheDocument();
	},
};
