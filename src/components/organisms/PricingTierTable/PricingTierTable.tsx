import React from 'react';
import { cn } from '@/lib/utils';

interface PricingTier {
	/** Lower bound (inclusive). Use 0 for the first tier. */
	from: number;
	/** Upper bound (inclusive). Use Infinity or null for the last tier. */
	to: number | null;
	/** Price per unit in this tier */
	unitAmount: string;
	/** Flat amount for this tier (optional, used in some models) */
	flatAmount?: string;
}

type TierMode = 'volume' | 'slab';

interface PricingTierTableProps {
	/** Array of pricing tier definitions */
	tiers: PricingTier[];
	/** Currency symbol to display (e.g. "$", "EUR") */
	currencySymbol?: string;
	/** Pricing model: volume (entire usage at highest tier rate) or slab (each unit at its tier rate) */
	mode?: TierMode;
	/** Additional class */
	className?: string;
}

/**
 * `PricingTierTable` displays tiered or graduated pricing in a readable table format.
 *
 * Used in FlexPrice plan configuration and pricing display views to show
 * how pricing changes at different usage levels. Supports both volume
 * (all units at the highest applicable rate) and slab (each unit charged
 * at its own tier rate) pricing models.
 *
 * @example
 * ```tsx
 * <PricingTierTable
 *   tiers={[
 *     { from: 0, to: 100, unitAmount: '0.10' },
 *     { from: 101, to: 1000, unitAmount: '0.08' },
 *     { from: 1001, to: null, unitAmount: '0.05' },
 *   ]}
 *   currencySymbol="$"
 *   mode="slab"
 * />
 * ```
 */
const PricingTierTable: React.FC<PricingTierTableProps> = ({
	tiers,
	currencySymbol = '$',
	mode = 'volume',
	className,
}) => {
	const formatRange = (from: number, to: number | null): string => {
		if (to === null || to === Infinity) return `${from.toLocaleString()}+`;
		if (from === to) return from.toLocaleString();
		return `${from.toLocaleString()} - ${to.toLocaleString()}`;
	};

	const formatAmount = (amount: string): string => {
		const num = parseFloat(amount);
		if (isNaN(num)) return amount;
		return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
	};

	return (
		<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
			{/* Mode badge */}
			<div className="px-4 py-2.5 bg-muted border-b border-[#E2E8F0] flex items-center justify-between">
				<span className="text-[13px] font-medium text-[#64748B]">
					{mode === 'volume' ? 'Volume Pricing' : 'Slab (Graduated) Pricing'}
				</span>
				<span
					className={cn(
						'text-[11px] font-medium px-2 py-0.5 rounded-full',
						mode === 'volume'
							? 'bg-blue-50 text-blue-700 border border-blue-200'
							: 'bg-purple-50 text-purple-700 border border-purple-200',
					)}
				>
					{mode === 'volume' ? 'All units at highest tier rate' : 'Each unit at its own tier rate'}
				</span>
			</div>

			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-[#E2E8F0] bg-[#FAFAFA]">
						<th className="text-left px-4 py-2.5 text-[13px] font-medium text-[#64748B]">Tier</th>
						<th className="text-left px-4 py-2.5 text-[13px] font-medium text-[#64748B]">Unit Range</th>
						<th className="text-right px-4 py-2.5 text-[13px] font-medium text-[#64748B]">Per Unit</th>
						{tiers.some((t) => t.flatAmount) && (
							<th className="text-right px-4 py-2.5 text-[13px] font-medium text-[#64748B]">Flat Fee</th>
						)}
					</tr>
				</thead>
				<tbody>
					{tiers.map((tier, index) => {
						const isLast = index === tiers.length - 1;
						return (
							<tr
								key={index}
								className={cn(
									'transition-colors hover:bg-muted/30',
									!isLast && 'border-b border-[#E2E8F0]',
								)}
							>
								<td className="px-4 py-3 text-[13px] text-muted-foreground font-medium">
									Tier {index + 1}
								</td>
								<td className="px-4 py-3 text-[14px] text-foreground">
									{formatRange(tier.from, tier.to)}
									{tier.to === null && (
										<span className="ml-1.5 text-[11px] text-muted-foreground">(unlimited)</span>
									)}
								</td>
								<td className="px-4 py-3 text-[14px] text-foreground text-right font-medium tabular-nums">
									{currencySymbol}{formatAmount(tier.unitAmount)}
								</td>
								{tiers.some((t) => t.flatAmount) && (
									<td className="px-4 py-3 text-[14px] text-foreground text-right tabular-nums">
										{tier.flatAmount
											? `${currencySymbol}${formatAmount(tier.flatAmount)}`
											: '--'}
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default PricingTierTable;
export type { PricingTier, PricingTierTableProps, TierMode };
