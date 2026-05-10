import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import DataTable from '@/components/molecules/DataTable/DataTable';
import type { DataTableColumn } from '@/components/molecules/DataTable/DataTable';
import useFilterStore from '@/hooks/useFilterStore';
import SearchBar from '@/components/molecules/SearchBar/SearchBar';
import Chip from '@/components/atoms/Chip/Chip';

// --- Mock Invoice Data ---

interface MockInvoice {
	id: string;
	invoiceNumber: string;
	customerName: string;
	amount: number;
	status: string;
	dueDate: string;
	[key: string]: unknown;
}

const STATUSES = ['DRAFT', 'FINALIZED', 'VOIDED', 'SKIPPED'];

const mockInvoices: MockInvoice[] = Array.from({ length: 50 }, (_, i) => ({
	id: `inv_${i + 1}`,
	invoiceNumber: `INV-${String(i + 1).padStart(4, '0')}`,
	customerName: `Customer ${(i % 10) + 1}`,
	amount: Math.floor(Math.random() * 5000) + 50,
	status: STATUSES[i % STATUSES.length],
	dueDate: new Date(2025, i % 12, (i % 28) + 1).toISOString().slice(0, 10),
}));

// --- Filter Demo Component ---

const FilterDemoComponent: React.FC = () => {
	const { getFilters, setFilter, resetFilters, getFingerprint } = useFilterStore();
	const routeKey = 'invoices';
	const filters = getFilters(routeKey);
	const fingerprint = getFingerprint(routeKey);

	const [filteredData, setFilteredData] = useState(mockInvoices);

	useEffect(() => {
		let result = mockInvoices;

		const search = filters.search as string | undefined;
		if (search) {
			const lower = search.toLowerCase();
			result = result.filter(
				(inv) =>
					inv.invoiceNumber.toLowerCase().includes(lower) ||
					inv.customerName.toLowerCase().includes(lower),
			);
		}

		const statusFilter = filters.status as string | undefined;
		if (statusFilter) {
			result = result.filter((inv) => inv.status === statusFilter);
		}

		setFilteredData(result);
	}, [filters]);

	const columns: DataTableColumn<MockInvoice>[] = [
		{ key: 'invoiceNumber', title: 'Invoice #', sortable: true },
		{ key: 'customerName', title: 'Customer', sortable: true },
		{
			key: 'amount',
			title: 'Amount',
			sortable: true,
			align: 'right',
			render: (row) => `$${row.amount.toLocaleString()}`,
		},
		{
			key: 'status',
			title: 'Status',
			sortable: true,
			render: (row) => {
				const variantMap: Record<string, 'success' | 'failed' | 'default'> = {
					FINALIZED: 'success',
					VOIDED: 'failed',
					DRAFT: 'default',
					SKIPPED: 'default',
				};
				return React.createElement(Chip, {
					label: row.status,
					variant: variantMap[row.status] ?? 'default',
				});
			},
		},
		{ key: 'dueDate', title: 'Due Date', sortable: true },
	];

	return React.createElement(
		'div',
		{ className: 'space-y-4 p-4' },
		// Filter controls
		React.createElement(
			'div',
			{ className: 'flex items-center gap-3 flex-wrap' },
			React.createElement(SearchBar, {
				placeholder: 'Search invoices...',
				value: (filters.search as string) ?? '',
				onChange: (v: string) => setFilter(routeKey, 'search', v || null),
				debounceMs: 200,
				className: 'w-64',
			}),
			// Status filter chips
			...STATUSES.map((s) =>
				React.createElement(Chip, {
					key: s,
					label: s,
					variant: filters.status === s ? 'info' : 'default',
					onClick: () => setFilter(routeKey, 'status', filters.status === s ? null : s),
				}),
			),
			React.createElement(
				'button',
				{
					className: 'text-sm text-muted-foreground hover:text-foreground transition-colors',
					onClick: () => resetFilters(routeKey),
				},
				'Reset',
			),
		),
		// Fingerprint display
		React.createElement(
			'div',
			{ className: 'text-xs text-muted-foreground' },
			`URL fingerprint: ?fc=${fingerprint} | Filters in sessionStorage: filters:${routeKey}`,
		),
		// Table
		React.createElement(DataTable, {
			columns,
			data: filteredData,
			paginated: true,
			pageSize: 10,
		}),
	);
};

/**
 * Demonstrates the `useFilterStore` hook wired to a `DataTable`.
 * Filters persist in sessionStorage and expose a shallow fingerprint for URL syncing.
 */
const meta: Meta = {
	title: 'Advanced/FilterPersistence',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Challenge A: Filter state is persisted in sessionStorage per route. ' +
					'Only a shallow fingerprint (active filter count) is synced to the URL. ' +
					'Try filtering, then refresh - state is restored from sessionStorage.',
			},
		},
	},
};

export default meta;

export const FilteredDataTable: StoryObj = {
	render: () => React.createElement(FilterDemoComponent),
};
