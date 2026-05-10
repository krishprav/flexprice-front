import { create } from 'zustand';

// --- Types ---

type FilterValue = string | number | boolean | Date | string[] | null;

interface FilterState {
	[key: string]: FilterValue;
}

interface FilterStore {
	/** Get all filters for a given route */
	getFilters: (routeKey: string) => FilterState;
	/** Set a single filter value for a route */
	setFilter: (routeKey: string, key: string, value: FilterValue) => void;
	/** Reset all filters for a route */
	resetFilters: (routeKey: string) => void;
	/** Get a shallow fingerprint (filter count) for URL syncing */
	getFingerprint: (routeKey: string) => number;
}

// --- Session Storage Helpers ---

const STORAGE_PREFIX = 'filters:';

const loadFromSession = (routeKey: string): FilterState => {
	const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${routeKey}`);
	if (!raw) return {};
	try {
		return JSON.parse(raw) as FilterState;
	} catch {
		return {};
	}
};

const saveToSession = (routeKey: string, state: FilterState): void => {
	sessionStorage.setItem(`${STORAGE_PREFIX}${routeKey}`, JSON.stringify(state));
};

const clearSession = (routeKey: string): void => {
	sessionStorage.removeItem(`${STORAGE_PREFIX}${routeKey}`);
};

const getActiveFilterCount = (filters: FilterState): number =>
	Object.keys(filters).filter((key) => {
		const value = filters[key];
		if (value === null || value === undefined || value === '') return false;
		if (Array.isArray(value) && value.length === 0) return false;
		return true;
	}).length;

const syncFingerprintToUrl = (filters: FilterState): void => {
	if (typeof window === 'undefined') return;

	const fingerprint = getActiveFilterCount(filters);
	const url = new URL(window.location.href);
	if (fingerprint > 0) {
		url.searchParams.set('fc', String(fingerprint));
	} else {
		url.searchParams.delete('fc');
	}

	window.history.replaceState(window.history.state, '', url.toString());
};

// --- Store ---

interface StoreState {
	filters: Record<string, FilterState>;
}

/**
 * `useFilterStore` is a Zustand-based hook for persisting multi-dimensional
 * table filter state per route in sessionStorage.
 *
 * **Why not URL query strings?**
 * Large filter objects (date ranges, multiple statuses, sort column + direction)
 * create unwieldy URLs and waste CPU on every render for URL parsing/serialisation.
 *
 * **Design:**
 * - Full filter state stored in `sessionStorage` keyed by route (e.g. `filters:invoices`).
 * - Only a shallow fingerprint (active filter count) synced to URL for bookmarkability.
 * - Clean API: `setFilter(key, value)`, `resetFilters()`, `getFilters()`.
 *
 * @example
 * ```tsx
 * const store = useFilterStore();
 * const filters = store.getFilters('invoices');
 *
 * store.setFilter('invoices', 'status', 'FINALIZED');
 * store.setFilter('invoices', 'dateRange', [startDate, endDate]);
 *
 * // Sync fingerprint to URL
 * const count = store.getFingerprint('invoices');
 * searchParams.set('fc', String(count));
 * ```
 */
const useFilterStore = create<StoreState & FilterStore>((set, get) => ({
	filters: {},

	getFilters: (routeKey: string): FilterState => {
		const storeFilters = get().filters[routeKey];
		if (storeFilters) return storeFilters;

		// Hydrate from sessionStorage on first access
		const sessionFilters = loadFromSession(routeKey);
		if (Object.keys(sessionFilters).length > 0) {
			set((state) => ({
				filters: { ...state.filters, [routeKey]: sessionFilters },
			}));
			return sessionFilters;
		}

		return {};
	},

	setFilter: (routeKey: string, key: string, value: FilterValue): void => {
		set((state) => {
			const current = state.filters[routeKey] ?? loadFromSession(routeKey);

			// Remove null/undefined values using rest destructuring (cleaner immutability)
			let updated = { ...current, [key]: value };
			if (value === null || value === undefined) {
				const { [key]: _, ...rest } = updated;
				updated = rest;
			}

			saveToSession(routeKey, updated);
			syncFingerprintToUrl(updated);

			return {
				filters: { ...state.filters, [routeKey]: updated },
			};
		});
	},

	resetFilters: (routeKey: string): void => {
		clearSession(routeKey);
		syncFingerprintToUrl({});
		set((state) => ({
			filters: { ...state.filters, [routeKey]: {} },
		}));
	},

	getFingerprint: (routeKey: string): number => {
		const filters = get().getFilters(routeKey);
		return getActiveFilterCount(filters);
	},
}));

export default useFilterStore;
export type { FilterValue, FilterState, FilterStore };
