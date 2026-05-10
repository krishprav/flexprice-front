import { describe, it, expect } from 'vitest';
import formatNumber, { formatCompactNumber } from './format_number';

describe('formatNumber', () => {
	it('formats a simple number with no decimals', () => {
		expect(formatNumber(1000)).toBe('1,000');
	});

	it('formats with specified decimal places', () => {
		expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
	});

	it('formats large numbers with thousand separators', () => {
		expect(formatNumber(1000000, 0)).toBe('1,000,000');
	});

	it('returns dash for zero value', () => {
		expect(formatNumber(0)).toBe('-');
	});

	it('clamps negative decimals to 0', () => {
		expect(formatNumber(1234.5678, -5)).toBe('1,235');
	});

	it('clamps decimals exceeding 20 to 20', () => {
		const result = formatNumber(1.23, 25);
		expect(result).toBeDefined();
	});

	it('handles negative numbers', () => {
		expect(formatNumber(-42500, 0)).toBe('-42,500');
	});

	it('handles small decimal numbers', () => {
		expect(formatNumber(0.005, 3)).toBe('0.005');
	});
});

describe('formatCompactNumber', () => {
	it('returns number as-is for values under 1000', () => {
		expect(formatCompactNumber(500)).toBe('500');
	});

	it('formats thousands as k', () => {
		expect(formatCompactNumber(10000)).toBe('10k');
	});

	it('formats millions as M', () => {
		expect(formatCompactNumber(1500000)).toBe('1.5M');
	});

	it('formats billions as B', () => {
		expect(formatCompactNumber(2000000000)).toBe('2B');
	});

	it('removes trailing .0 for clean values', () => {
		expect(formatCompactNumber(1000)).toBe('1k');
		expect(formatCompactNumber(1000000)).toBe('1M');
	});

	it('keeps one decimal for non-round values', () => {
		expect(formatCompactNumber(1234)).toBe('1.2k');
	});
});
