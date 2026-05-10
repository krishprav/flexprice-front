import { describe, it, expect } from 'vitest';
import {
	toSentenceCase,
	formatDateShort,
	calculateCouponDiscount,
	calculateTotalCouponDiscount,
	formatBillingModel,
	formatBillingPeriodForPrice,
	formatBillingPeriodForDisplay,
	getPriceTypeLabel,
	formatEntityType,
} from './helper_functions';

describe('toSentenceCase', () => {
	it('capitalizes the first letter and lowercases the rest', () => {
		expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
	});

	it('handles single character', () => {
		expect(toSentenceCase('a')).toBe('A');
	});

	it('returns empty string for empty input', () => {
		expect(toSentenceCase('')).toBe('');
	});

	it('handles already sentence-cased input', () => {
		expect(toSentenceCase('Hello')).toBe('Hello');
	});
});

describe('formatDateShort', () => {
	it('formats an ISO date string to short format', () => {
		const result = formatDateShort('2025-01-15T00:00:00Z');
		expect(result).toContain('Jan');
		expect(result).toContain('15');
		expect(result).toContain('2025');
	});

	it('formats another date correctly', () => {
		const result = formatDateShort('2025-12-25T12:00:00Z');
		expect(result).toContain('Dec');
		expect(result).toContain('25');
	});
});

describe('calculateCouponDiscount', () => {
	it('calculates fixed amount discount', () => {
		const result = calculateCouponDiscount(
			{ type: 'fixed', amount_off: '10' },
			100,
		);
		expect(result).toBe(10);
	});

	it('caps fixed discount at original amount', () => {
		const result = calculateCouponDiscount(
			{ type: 'fixed', amount_off: '150' },
			100,
		);
		expect(result).toBe(100);
	});

	it('calculates percentage discount', () => {
		const result = calculateCouponDiscount(
			{ type: 'percentage', percentage_off: '25' },
			200,
		);
		expect(result).toBe(50);
	});

	it('returns 0 for unknown coupon type', () => {
		const result = calculateCouponDiscount({ type: 'unknown' }, 100);
		expect(result).toBe(0);
	});

	it('returns 0 when amount_off is missing for fixed type', () => {
		const result = calculateCouponDiscount({ type: 'fixed' }, 100);
		expect(result).toBe(0);
	});
});

describe('calculateTotalCouponDiscount', () => {
	it('sums discounts from multiple coupons', () => {
		const coupons = [
			{ type: 'fixed', amount_off: '10' },
			{ type: 'percentage', percentage_off: '10' },
		];
		const result = calculateTotalCouponDiscount(coupons, 100);
		expect(result).toBe(20); // 10 fixed + 10% of 100
	});

	it('returns 0 for empty coupon array', () => {
		expect(calculateTotalCouponDiscount([], 100)).toBe(0);
	});
});

describe('formatBillingModel', () => {
	it('formats FLAT_FEE', () => {
		expect(formatBillingModel('FLAT_FEE')).toBe('Flat Fee');
	});

	it('formats TIERED', () => {
		expect(formatBillingModel('TIERED')).toBe('Tiered');
	});

	it('formats PACKAGE', () => {
		expect(formatBillingModel('PACKAGE')).toBe('Package');
	});

	it('returns -- for unknown model', () => {
		expect(formatBillingModel('UNKNOWN')).toBe('--');
	});
});

describe('formatBillingPeriodForPrice', () => {
	it('formats MONTHLY as month', () => {
		expect(formatBillingPeriodForPrice('MONTHLY')).toBe('month');
	});

	it('formats ANNUAL as year', () => {
		expect(formatBillingPeriodForPrice('ANNUAL')).toBe('year');
	});

	it('returns -- for unknown period', () => {
		expect(formatBillingPeriodForPrice('UNKNOWN')).toBe('--');
	});
});

describe('formatBillingPeriodForDisplay', () => {
	it('formats MONTHLY as Monthly', () => {
		expect(formatBillingPeriodForDisplay('MONTHLY')).toBe('Monthly');
	});

	it('formats ANNUAL as Annually', () => {
		expect(formatBillingPeriodForDisplay('ANNUAL')).toBe('Annually');
	});
});

describe('getPriceTypeLabel', () => {
	it('returns Fixed charge for FIXED', () => {
		expect(getPriceTypeLabel('FIXED')).toBe('Fixed charge');
	});

	it('returns Usage Based for USAGE', () => {
		expect(getPriceTypeLabel('USAGE')).toBe('Usage Based');
	});

	it('returns -- for undefined', () => {
		expect(getPriceTypeLabel(undefined)).toBe('--');
	});

	it('returns -- for empty string', () => {
		expect(getPriceTypeLabel('')).toBe('--');
	});
});

describe('formatEntityType', () => {
	it('formats events', () => {
		expect(formatEntityType('events')).toBe('Events');
	});

	it('formats credit_topups', () => {
		expect(formatEntityType('credit_topups')).toBe('Credit Top-ups');
	});

	it('formats generic underscore-separated strings', () => {
		expect(formatEntityType('billing_model')).toBe('Billing Model');
	});

	it('returns empty string for empty input', () => {
		expect(formatEntityType('')).toBe('');
	});
});
