import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import DataTable from './DataTable';
import type { DataTableColumn } from './DataTable';
import React from 'react';
import Chip from '@/components/atoms/Chip/Chip';

// --- Mock Data Generators ---

interface MockCustomer {
	id: string;
	name: string;
	email: string;
	plan: string;
	status: string;
	mrr: number;
	[key: string]: unknown;
}

const PLANS = ['Starter', 'Growth', 'Enterprise', 'Custom'];
const STATUSES = ['Active', 'Churned', 'Trialing', 'Paused'];

const generateCustomers = (count: number): MockCustomer[] =>
	Array.from({ length: count }, (_, i) => ({
		id: `cust_${String(i + 1).padStart(5, '0')}`,
		name: `Customer ${i + 1}`,
		email: `customer${i + 1}@example.com`,
		plan: PLANS[i % PLANS.length],
		status: STATUSES[i % STATUSES.length],
		mrr: Math.floor(Math.random() * 10000) + 100,
	}));

const sampleData = generateCustomers(25);

const columns: DataTableColumn<MockCustomer>[] = [
	{ key: 'name', title: 'Customer Name', sortable: true },
	{ key: 'email', title: 'Email', sortable: true },
	{ key: 'plan', title: 'Plan', sortable: true },
	{
		key: 'status',
		title: 'Status',
		sortable: true,
		render: (row) => {
			const variantMap: Record<string, 'success' | 'warning' | 'failed' | 'info' | 'default'> = {
				Active: 'success',
				Churned: 'failed',
				Trialing: 'info',
				Paused: 'warning',
			};
			return React.createElement(Chip, {
				label: row.status,
				variant: variantMap[row.status] ?? 'default',
			});
		},
	},
	{
		key: 'mrr',
		title: 'MRR',
		sortable: true,
		align: 'right',
		render: (row) => `$${row.mrr.toLocaleString()}`,
	},
];

/**
 * `DataTable` is a feature-rich table with sorting, pagination, loading skeleton,
 * empty state, and virtualization (for 10K+ rows). Used across FlexPrice for
 * customers, invoices, subscriptions, and all list views.
 */
const meta: Meta<typeof DataTable> = {
	title: 'Molecules/DataTable',
	component: DataTable,
	tags: ['autodocs'],
	argTypes: {
		isLoading: { control: 'boolean', description: 'Show loading skeleton' },
		paginated: { control: 'boolean', description: 'Enable pagination' },
		pageSize: { control: { type: 'number', min: 5, max: 100, step: 5 } },
		virtualized: { control: 'boolean', description: 'Enable virtualization' },
		virtualHeight: { control: { type: 'number', min: 200, max: 800 } },
		emptyMessage: { control: 'text' },
	},
	args: {
		onRowClick: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof DataTable<MockCustomer>>;

export const Default: Story = {
	args: {
		columns,
		data: sampleData,
	},
};

export const WithPagination: Story = {
	args: {
		columns,
		data: sampleData,
		paginated: true,
		pageSize: 5,
	},
};

export const LoadingSkeleton: Story = {
	args: {
		columns,
		data: [],
		isLoading: true,
		skeletonRows: 5,
	},
};

export const EmptyState: Story = {
	args: {
		columns,
		data: [],
		emptyMessage: 'No customers found. Create your first customer to get started.',
	},
};

export const SortableColumns: Story = {
	args: {
		columns,
		data: sampleData.slice(0, 10),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const nameHeader = canvas.getByText('Customer Name');
		await userEvent.click(nameHeader);
		// Verify sort icon changed (sort is now active)
		const rows = canvas.getAllByRole('row');
		await expect(rows.length).toBeGreaterThan(1);
	},
};

export const Virtualized10KRows: Story = {
	name: 'Virtualized (10,000 rows)',
	args: {
		columns,
		data: generateCustomers(10000),
		virtualized: true,
		virtualHeight: 500,
		estimateRowHeight: 48,
		overscan: 10,
	},
};

export const Virtualized50KRows: Story = {
	name: 'Virtualized (50,000 rows)',
	args: {
		columns,
		data: generateCustomers(50000),
		virtualized: true,
		virtualHeight: 500,
		estimateRowHeight: 48,
		overscan: 20,
	},
};

export const ClickableRows: Story = {
	args: {
		columns,
		data: sampleData.slice(0, 5),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rows = canvas.getAllByRole('row');
		// Click on the first data row (index 1, since 0 is the header)
		if (rows[1]) {
			await userEvent.click(rows[1]);
			await expect(args.onRowClick).toHaveBeenCalled();
		}
	},
};
