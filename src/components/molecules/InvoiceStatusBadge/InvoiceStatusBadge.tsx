import React from 'react';
import Chip from '@/components/atoms/Chip/Chip';
import { Check, X, Clock, SkipForward } from 'lucide-react';

type InvoiceStatus = 'DRAFT' | 'FINALIZED' | 'VOIDED' | 'SKIPPED';

interface InvoiceStatusBadgeProps {
	/** The invoice status string to map to a coloured chip */
	status: InvoiceStatus | string;
	/** Additional CSS class name */
	className?: string;
}

type StatusConfig = {
	label: string;
	variant: 'default' | 'success' | 'warning' | 'failed' | 'info';
	icon: React.ReactNode;
};

const STATUS_MAP: Record<string, StatusConfig> = {
	DRAFT: {
		label: 'Draft',
		variant: 'default',
		icon: React.createElement(Clock, { className: 'size-3' }),
	},
	FINALIZED: {
		label: 'Finalized',
		variant: 'success',
		icon: React.createElement(Check, { className: 'size-3' }),
	},
	VOIDED: {
		label: 'Void',
		variant: 'failed',
		icon: React.createElement(X, { className: 'size-3' }),
	},
	SKIPPED: {
		label: 'Skipped',
		variant: 'default',
		icon: React.createElement(SkipForward, { className: 'size-3' }),
	},
};

/**
 * `InvoiceStatusBadge` maps invoice status strings to coloured chips with icons.
 *
 * This component encapsulates the FlexPrice invoice status display logic,
 * providing a consistent visual representation across all invoice-related views.
 *
 * @example
 * ```tsx
 * <InvoiceStatusBadge status="FINALIZED" />
 * <InvoiceStatusBadge status="DRAFT" />
 * ```
 */
const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status, className }) => {
	const normalizedStatus = status.toUpperCase();
	const config = STATUS_MAP[normalizedStatus];

	if (!config) {
		return React.createElement(Chip, {
			variant: 'default',
			label: status || 'Unknown',
			className,
		});
	}

	return React.createElement(Chip, {
		variant: config.variant,
		label: config.label,
		icon: config.icon,
		className,
	});
};

export default InvoiceStatusBadge;
