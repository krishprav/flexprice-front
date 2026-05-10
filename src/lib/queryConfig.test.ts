import { describe, it, expect } from 'vitest';
import { createQueryConfig, QUERY_PRESETS, REALTIME, DEFAULT, STATIC } from './queryConfig';

describe('createQueryConfig', () => {
	const mockQueryFn = () => Promise.resolve({ data: [] });

	describe('presets', () => {
		it('REALTIME preset has staleTime of 0', () => {
			expect(REALTIME.staleTime).toBe(0);
			expect(REALTIME.gcTime).toBe(1 * 60 * 1000);
		});

		it('DEFAULT preset has 5 min staleTime and 10 min gcTime', () => {
			expect(DEFAULT.staleTime).toBe(5 * 60 * 1000);
			expect(DEFAULT.gcTime).toBe(10 * 60 * 1000);
		});

		it('STATIC preset has 30 min staleTime and 60 min gcTime', () => {
			expect(STATIC.staleTime).toBe(30 * 60 * 1000);
			expect(STATIC.gcTime).toBe(60 * 60 * 1000);
		});

		it('exports QUERY_PRESETS with all three presets', () => {
			expect(QUERY_PRESETS.REALTIME).toBe(REALTIME);
			expect(QUERY_PRESETS.DEFAULT).toBe(DEFAULT);
			expect(QUERY_PRESETS.STATIC).toBe(STATIC);
		});
	});

	describe('default behaviour', () => {
		it('uses DEFAULT preset when no preset is specified', () => {
			const config = createQueryConfig({
				queryKey: ['invoices'],
				queryFn: mockQueryFn,
			});

			expect(config.staleTime).toBe(5 * 60 * 1000);
			expect(config.gcTime).toBe(10 * 60 * 1000);
		});

		it('preserves queryKey and queryFn', () => {
			const queryKey = ['customers', 'cust_123'] as const;
			const config = createQueryConfig({
				queryKey,
				queryFn: mockQueryFn,
			});

			expect(config.queryKey).toBe(queryKey);
			expect(config.queryFn).toBe(mockQueryFn);
		});

		it('passes through enabled flag', () => {
			const config = createQueryConfig({
				queryKey: ['plans'],
				queryFn: mockQueryFn,
				enabled: false,
			});

			expect(config.enabled).toBe(false);
		});
	});

	describe('preset selection', () => {
		it('uses REALTIME preset when specified', () => {
			const config = createQueryConfig({
				queryKey: ['events'],
				queryFn: mockQueryFn,
				preset: QUERY_PRESETS.REALTIME,
			});

			expect(config.staleTime).toBe(0);
			expect(config.gcTime).toBe(1 * 60 * 1000);
		});

		it('uses STATIC preset when specified', () => {
			const config = createQueryConfig({
				queryKey: ['plans'],
				queryFn: mockQueryFn,
				preset: QUERY_PRESETS.STATIC,
			});

			expect(config.staleTime).toBe(30 * 60 * 1000);
			expect(config.gcTime).toBe(60 * 60 * 1000);
		});
	});

	describe('per-call overrides', () => {
		it('overrides staleTime while keeping preset gcTime', () => {
			const config = createQueryConfig({
				queryKey: ['invoices'],
				queryFn: mockQueryFn,
				overrides: { staleTime: 0 },
			});

			expect(config.staleTime).toBe(0);
			expect(config.gcTime).toBe(10 * 60 * 1000); // DEFAULT gcTime
		});

		it('overrides gcTime while keeping preset staleTime', () => {
			const config = createQueryConfig({
				queryKey: ['invoices'],
				queryFn: mockQueryFn,
				overrides: { gcTime: 30 * 60 * 1000 },
			});

			expect(config.staleTime).toBe(5 * 60 * 1000); // DEFAULT staleTime
			expect(config.gcTime).toBe(30 * 60 * 1000);
		});

		it('overrides both staleTime and gcTime', () => {
			const config = createQueryConfig({
				queryKey: ['custom'],
				queryFn: mockQueryFn,
				overrides: { staleTime: 1000, gcTime: 2000 },
			});

			expect(config.staleTime).toBe(1000);
			expect(config.gcTime).toBe(2000);
		});

		it('overrides take precedence over preset values', () => {
			const config = createQueryConfig({
				queryKey: ['events'],
				queryFn: mockQueryFn,
				preset: QUERY_PRESETS.STATIC,
				overrides: { staleTime: 0 },
			});

			expect(config.staleTime).toBe(0); // Override wins
			expect(config.gcTime).toBe(60 * 60 * 1000); // STATIC gcTime preserved
		});
	});
});
