import React, { useState, useMemo, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';

// --- Types ---

export interface DataTableColumn<T> {
	/** Unique key for the column */
	key: string;
	/** Column header title */
	title: string;
	/** How to render the cell value. Falls back to row[key] */
	render?: (row: T) => React.ReactNode;
	/** Enable sorting on this column */
	sortable?: boolean;
	/** Column width (CSS value) */
	width?: string;
	/** Text alignment */
	align?: 'left' | 'center' | 'right';
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
	key: string;
	direction: SortDirection;
}

interface DataTableProps<T extends Record<string, unknown>> {
	/** Column definitions */
	columns: DataTableColumn<T>[];
	/** Data rows */
	data: T[];
	/** Show loading skeleton */
	isLoading?: boolean;
	/** Number of skeleton rows to show */
	skeletonRows?: number;
	/** Enable client-side pagination */
	paginated?: boolean;
	/** Rows per page when paginated */
	pageSize?: number;
	/** Enable virtualization for large datasets */
	virtualized?: boolean;
	/** Height of the virtualized container */
	virtualHeight?: number;
	/** Estimated row height for virtualization */
	estimateRowHeight?: number;
	/** Overscan count for virtualization */
	overscan?: number;
	/** Row click handler */
	onRowClick?: (row: T) => void;
	/** Custom empty state message */
	emptyMessage?: string;
	/** Additional class */
	className?: string;
}

// --- Skeleton Row ---

const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => (
	<tr className="border-b border-[#E2E8F0] animate-pulse">
		{Array.from({ length: columns }).map((_, i) => (
			<td key={i} className="px-4 py-3">
				<div className="h-4 bg-gray-200 rounded w-3/4" />
			</td>
		))}
	</tr>
);

/**
 * `DataTable` is a feature-rich table component for FlexPrice.
 *
 * Supports sortable columns, loading skeletons, empty state, pagination,
 * and virtualization (via @tanstack/react-virtual) for rendering tens of
 * thousands of rows efficiently.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: 'name', title: 'Customer Name', sortable: true },
 *     { key: 'email', title: 'Email' },
 *     { key: 'plan', title: 'Plan', sortable: true },
 *   ]}
 *   data={customers}
 *   paginated
 *   pageSize={25}
 * />
 * ```
 */
function DataTable<T extends Record<string, unknown>>({
	columns,
	data,
	isLoading = false,
	skeletonRows = 5,
	paginated = false,
	pageSize = 10,
	virtualized = false,
	virtualHeight = 500,
	estimateRowHeight = 48,
	overscan = 10,
	onRowClick,
	emptyMessage = 'No data available',
	className,
}: DataTableProps<T>) {
	const [sort, setSort] = useState<SortState>({ key: '', direction: null });
	const [currentPage, setCurrentPage] = useState(0);
	const parentRef = useRef<HTMLDivElement>(null);

	// Sorting logic
	const handleSort = useCallback((key: string) => {
		setSort((prev) => {
			if (prev.key !== key) return { key, direction: 'asc' };
			if (prev.direction === 'asc') return { key, direction: 'desc' };
			if (prev.direction === 'desc') return { key: '', direction: null };
			return { key, direction: 'asc' };
		});
		setCurrentPage(0);
	}, []);

	const sortedData = useMemo(() => {
		if (!sort.key || !sort.direction) return data;
		return [...data].sort((a, b) => {
			const aVal = a[sort.key];
			const bVal = b[sort.key];
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;
			const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
			return sort.direction === 'desc' ? -cmp : cmp;
		});
	}, [data, sort]);

	// Pagination logic
	const totalPages = paginated ? Math.ceil(sortedData.length / pageSize) : 1;
	const displayData = paginated
		? sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
		: sortedData;

	// Render sort icon
	const renderSortIcon = (key: string) => {
		if (sort.key !== key) return <ArrowUpDown className="size-3.5 text-muted-foreground" />;
		if (sort.direction === 'asc') return <ArrowUp className="size-3.5" />;
		return <ArrowDown className="size-3.5" />;
	};

	// Loading state
	if (isLoading) {
		return (
			<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
				<table className="w-full text-sm">
					<thead className="bg-muted">
						<tr className="border-b border-[#E2E8F0]">
							{columns.map((col) => (
								<th key={col.key} className="h-10 px-4 text-left text-[14px] font-medium text-[#64748B]">
									{col.title}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: skeletonRows }).map((_, i) => (
							<SkeletonRow key={i} columns={columns.length} />
						))}
					</tbody>
				</table>
			</div>
		);
	}

	// Empty state
	if (data.length === 0) {
		return (
			<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
				<table className="w-full text-sm">
					<thead className="bg-muted">
						<tr className="border-b border-[#E2E8F0]">
							{columns.map((col) => (
								<th key={col.key} className="h-10 px-4 text-left text-[14px] font-medium text-[#64748B]">
									{col.title}
								</th>
							))}
						</tr>
					</thead>
				</table>
				<div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
					<p className="text-sm">{emptyMessage}</p>
				</div>
			</div>
		);
	}

	// Virtualized rendering
	if (virtualized) {
		return (
			<VirtualizedTable
				columns={columns}
				data={sortedData}
				sort={sort}
				onSort={handleSort}
				renderSortIcon={renderSortIcon}
				onRowClick={onRowClick}
				virtualHeight={virtualHeight}
				estimateRowHeight={estimateRowHeight}
				overscan={overscan}
				className={className}
			/>
		);
	}

	// Standard rendering
	return (
		<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
			<table className="w-full text-sm">
				<thead className="bg-muted">
					<tr className="border-b border-[#E2E8F0]">
						{columns.map((col) => (
							<th
								key={col.key}
								className={cn(
									'h-10 px-4 text-[14px] font-medium text-[#64748B]',
									col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
									col.align ? `text-${col.align}` : 'text-left',
								)}
								style={{ width: col.width }}
								onClick={col.sortable ? () => handleSort(col.key) : undefined}
							>
								<span className="inline-flex items-center gap-1">
									{col.title}
									{col.sortable && renderSortIcon(col.key)}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{displayData.map((row, rowIndex) => (
						<tr
							key={rowIndex}
							className={cn(
								'border-b border-[#E2E8F0] transition-colors hover:bg-muted/50',
								onRowClick && 'cursor-pointer',
								rowIndex === displayData.length - 1 && 'border-b-0',
							)}
							onClick={() => onRowClick?.(row)}
						>
							{columns.map((col) => (
								<td
									key={col.key}
									className={cn(
										'px-4 py-3 text-[14px]',
										col.align ? `text-${col.align}` : 'text-left',
									)}
								>
									{col.render ? col.render(row) : String(row[col.key] ?? '--')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{paginated && totalPages > 1 && (
				<div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] bg-white">
					<span className="text-sm text-muted-foreground">
						Page {currentPage + 1} of {totalPages} ({sortedData.length} rows)
					</span>
					<div className="flex items-center gap-1">
						<button
							className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
							disabled={currentPage === 0}
							onClick={() => setCurrentPage((p) => p - 1)}
							aria-label="Previous page"
						>
							<ChevronLeft className="size-4" />
						</button>
						<button
							className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
							disabled={currentPage >= totalPages - 1}
							onClick={() => setCurrentPage((p) => p + 1)}
							aria-label="Next page"
						>
							<ChevronRight className="size-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

// --- Virtualized Table (Challenge B) ---

interface VirtualizedTableProps<T extends Record<string, unknown>> {
	columns: DataTableColumn<T>[];
	data: T[];
	sort: SortState;
	onSort: (key: string) => void;
	renderSortIcon: (key: string) => React.ReactNode;
	onRowClick?: (row: T) => void;
	virtualHeight: number;
	estimateRowHeight: number;
	overscan: number;
	className?: string;
}

function VirtualizedTable<T extends Record<string, unknown>>({
	columns,
	data,
	sort,
	onSort,
	renderSortIcon,
	onRowClick,
	virtualHeight,
	estimateRowHeight,
	overscan,
	className,
}: VirtualizedTableProps<T>) {
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: data.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => estimateRowHeight,
		overscan,
	});

	return (
		<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
			{/* Fixed header */}
			<table className="w-full text-sm table-fixed">
				<thead className="bg-muted">
					<tr className="border-b border-[#E2E8F0]">
						{columns.map((col) => (
							<th
								key={col.key}
								className={cn(
									'h-10 px-4 text-[14px] font-medium text-[#64748B]',
									col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
									col.align ? `text-${col.align}` : 'text-left',
								)}
								style={{ width: col.width }}
								onClick={col.sortable ? () => onSort(col.key) : undefined}
							>
								<span className="inline-flex items-center gap-1">
									{col.title}
									{col.sortable && renderSortIcon(col.key)}
								</span>
							</th>
						))}
					</tr>
				</thead>
			</table>

			{/* Scrollable body */}
			<div
				ref={parentRef}
				className="overflow-auto"
				style={{ height: virtualHeight }}
			>
				<div
					style={{
						height: virtualizer.getTotalSize(),
						width: '100%',
						position: 'relative',
					}}
				>
					{virtualizer.getVirtualItems().map((virtualRow) => {
						const row = data[virtualRow.index];
						return (
							<div
								key={virtualRow.index}
								ref={virtualizer.measureElement}
								data-index={virtualRow.index}
								className={cn(
									'absolute w-full flex border-b border-[#E2E8F0] hover:bg-muted/50 transition-colors',
									onRowClick && 'cursor-pointer',
								)}
								style={{
									top: virtualRow.start,
									height: virtualRow.size,
								}}
								onClick={() => onRowClick?.(row)}
							>
								{columns.map((col) => (
									<div
										key={col.key}
										className={cn(
											'px-4 py-3 text-[14px] flex items-center overflow-hidden',
											col.align ? `justify-${col.align}` : 'justify-start',
										)}
										style={{ width: col.width, flex: col.width ? 'none' : 1 }}
									>
										<span className="truncate">
											{col.render ? col.render(row) : String(row[col.key] ?? '--')}
										</span>
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>

			<div className="px-4 py-2 border-t border-[#E2E8F0] bg-white text-sm text-muted-foreground">
				{data.length.toLocaleString()} rows (virtualized)
			</div>
		</div>
	);
}

export default DataTable;
export type { DataTableProps, DataTableColumn };
