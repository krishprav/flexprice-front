import { describe, it, expect, beforeEach, vi } from 'vitest';
import useFilterStore from './useFilterStore';

describe('useFilterStore', () => {
	beforeEach(() => {
		// Clear store and mock sessionStorage before each test
		const store = useFilterStore.getState();
		store.resetFilters('test-route');
		sessionStorage.clear();
		vi.clearAllMocks();
	});

	it('should set and get filters for a route', () => {
		const store = useFilterStore.getState();
		store.setFilter('test-route', 'status', 'active');
		
		const filters = store.getFilters('test-route');
		expect(filters.status).toBe('active');
	});

	it('should persist filters to sessionStorage', () => {
		const store = useFilterStore.getState();
		store.setFilter('test-route', 'search', 'acme');
		
		const stored = sessionStorage.getItem('filters:test-route');
		expect(stored).toContain('"search":"acme"');
	});

	it('should calculate the correct fingerprint (active filter count)', () => {
		const store = useFilterStore.getState();
		store.setFilter('test-route', 'status', 'active');
		store.setFilter('test-route', 'page', 1);
		store.setFilter('test-route', 'empty', ''); // Should not count
		
		const count = store.getFingerprint('test-route');
		expect(count).toBe(2);
	});

	it('should reset filters for a route', () => {
		const store = useFilterStore.getState();
		store.setFilter('test-route', 'status', 'active');
		store.resetFilters('test-route');
		
		const filters = store.getFilters('test-route');
		expect(filters).toEqual({});
		expect(sessionStorage.getItem('filters:test-route')).toBeNull();
	});

	it('should hydrate from sessionStorage on first access', () => {
		// Manually populate session storage
		const initialState = { category: 'billing' };
		sessionStorage.setItem('filters:new-route', JSON.stringify(initialState));
		
		const store = useFilterStore.getState();
		const filters = store.getFilters('new-route');
		
		expect(filters.category).toBe('billing');
	});
});
