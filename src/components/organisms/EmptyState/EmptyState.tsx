import React from 'react';
import { cn } from '@/lib/utils';
import { FileX2, type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
	/** Lucide icon component to display */
	icon?: LucideIcon;
	/** Main headline text */
	headline: string;
	/** Supporting description text */
	subtext?: string;
	/** CTA button label */
	ctaLabel?: string;
	/** CTA button click handler */
	onCtaClick?: () => void;
	/** Additional class */
	className?: string;
}

/**
 * `EmptyState` renders a full-width empty state panel with icon, headline,
 * description, and optional call-to-action button.
 *
 * Used across FlexPrice when a page or table has no data to display -
 * e.g. no customers yet, no invoices found, no plans created.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Users}
 *   headline="No customers yet"
 *   subtext="Create your first customer to start billing"
 *   ctaLabel="Add Customer"
 *   onCtaClick={() => openDrawer()}
 * />
 * ```
 */
const EmptyState: React.FC<EmptyStateProps> = ({
	icon: Icon = FileX2,
	headline,
	subtext,
	ctaLabel,
	onCtaClick,
	className,
}) => {
	return (
		<div
			className={cn(
				'bg-[#fafafa] border border-[#E9E9E9] rounded-[6px] w-full flex flex-col items-center justify-center py-16 px-8',
				className,
			)}
		>
			<div className="mb-6 p-3 rounded-full bg-gray-100">
				<Icon className="size-8 text-gray-400" strokeWidth={1.5} />
			</div>

			<h3 className="font-medium text-xl text-gray-700 mb-3 text-center">{headline}</h3>

			{subtext && (
				<p className="text-base text-gray-400 mb-8 text-center max-w-sm">{subtext}</p>
			)}

			{ctaLabel && onCtaClick && (
				<button
					onClick={onCtaClick}
					className={cn(
						'px-5 py-2.5 rounded-[7px] text-sm font-medium transition-colors',
						'bg-[#092E44] text-white hover:opacity-90',
						'border border-[#092E44] shadow-sm',
					)}
				>
					{ctaLabel}
				</button>
			)}
		</div>
	);
};

export default EmptyState;
export type { EmptyStateProps };
