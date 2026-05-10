import React, { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
	/** Placeholder text */
	placeholder?: string;
	/** Current search value */
	value?: string;
	/** Called with the debounced search value */
	onChange: (value: string) => void;
	/** Debounce delay in milliseconds */
	debounceMs?: number;
	/** Called when the clear button is clicked */
	onClear?: () => void;
	/** Additional CSS class */
	className?: string;
	/** Disable the search bar */
	disabled?: boolean;
}

/**
 * `SearchBar` provides a search input with built-in debounce and clear functionality.
 *
 * Used throughout FlexPrice for filtering tables (customers, invoices, plans).
 * The onChange callback is debounced to avoid excessive API calls or re-renders
 * on every keystroke.
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search customers..."
 *   debounceMs={300}
 *   onChange={handleSearch}
 * />
 * ```
 */
const SearchBar: React.FC<SearchBarProps> = ({
	placeholder = 'Search...',
	value: controlledValue,
	onChange,
	debounceMs = 300,
	onClear,
	className,
	disabled = false,
}) => {
	const [internalValue, setInternalValue] = useState(controlledValue ?? '');
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isControlled = controlledValue !== undefined;
	const displayValue = isControlled ? controlledValue : internalValue;

	useEffect(() => {
		if (isControlled) {
			setInternalValue(controlledValue);
		}
	}, [controlledValue, isControlled]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			setInternalValue(newValue);

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				onChange(newValue);
			}, debounceMs);
		},
		[onChange, debounceMs],
	);

	const handleClear = useCallback(() => {
		setInternalValue('');
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		onChange('');
		onClear?.();
	}, [onChange, onClear]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<div
			className={cn(
				'flex items-center gap-2 h-10 px-3 rounded-[6px] border border-input bg-background transition-colors',
				'focus-within:border-black focus-within:ring-1 focus-within:ring-ring',
				disabled && 'opacity-50 cursor-not-allowed',
				className,
			)}
		>
			<Search className="size-4 text-muted-foreground shrink-0" />
			<input
				type="text"
				value={displayValue}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				className={cn(
					'flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground',
					disabled && 'cursor-not-allowed',
				)}
			/>
			{displayValue && !disabled && (
				<button
					type="button"
					onClick={handleClear}
					className="shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
					aria-label="Clear search"
				>
					<X className="size-3.5 text-muted-foreground" />
				</button>
			)}
		</div>
	);
};

export default SearchBar;
