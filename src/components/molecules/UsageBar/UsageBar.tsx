import React from 'react';
import Progress from '@/components/atoms/Progress/Progress';
import { cn } from '@/lib/utils';

interface UsageBarProps {
	/** Number of units consumed */
	used: number;
	/** Total entitled units */
	entitled: number;
	/** Label for the metric */
	label: string;
	/** Unit name displayed after the numbers (e.g. "API calls", "GB") */
	unit?: string;
	/** Custom color class for the progress indicator (Tailwind bg class) */
	indicatorColor?: string;
	/** Additional CSS class */
	className?: string;
}

/**
 * `UsageBar` displays a labelled progress bar showing consumed vs entitled units.
 *
 * Used in FlexPrice subscription and entitlement views to visualize
 * how much of a metered resource a customer has consumed relative to their limit.
 *
 * Automatically applies warning colors when usage exceeds 80% and
 * danger colors when usage exceeds 100%.
 *
 * @example
 * ```tsx
 * <UsageBar
 *   used={7500}
 *   entitled={10000}
 *   label="API Calls"
 *   unit="calls"
 * />
 * ```
 */
const UsageBar: React.FC<UsageBarProps> = ({
	used,
	entitled,
	label,
	unit = 'units',
	indicatorColor,
	className,
}) => {
	const percentage = entitled > 0 ? Math.min((used / entitled) * 100, 100) : 0;
	const isOverLimit = used > entitled;
	const isNearLimit = percentage >= 80 && !isOverLimit;

	const resolvedColor =
		indicatorColor ??
		(isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-blue-500');

	const formattedUsed = new Intl.NumberFormat('en-US').format(used);
	const formattedEntitled = new Intl.NumberFormat('en-US').format(entitled);

	return React.createElement(
		'div',
		{ className: cn('w-full space-y-2', className) },
		React.createElement(
			'div',
			{ className: 'flex items-center justify-between' },
			React.createElement(
				'span',
				{ className: 'text-sm font-medium text-gray-700' },
				label,
			),
			React.createElement(
				'span',
				{
					className: cn(
						'text-sm tabular-nums',
						isOverLimit ? 'text-red-600 font-medium' : 'text-muted-foreground',
					),
				},
				`${formattedUsed} / ${formattedEntitled} ${unit}`,
			),
		),
		React.createElement(Progress, {
			value: percentage,
			indicatorColor: resolvedColor,
			className: 'h-2',
		}),
		isOverLimit &&
			React.createElement(
				'p',
				{ className: 'text-xs text-red-600' },
				`Exceeded by ${new Intl.NumberFormat('en-US').format(used - entitled)} ${unit}`,
			),
	);
};

export default UsageBar;
