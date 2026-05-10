import { describe, it, expect } from 'vitest';
import { getBillingModelLabel, getTierModeLabel, formatPriceDisplay } from './price_helpers';
import { BILLING_MODEL, TIER_MODE, PRICE_UNIT_TYPE } from '@/models/Price';
import type { NormalizedPriceDisplay } from './price_helpers';

describe('getBillingModelLabel', () => {
	it('returns Flat Fee for FLAT_FEE', () => {
		expect(getBillingModelLabel(BILLING_MODEL.FLAT_FEE)).toBe('Flat Fee');
	});

	it('returns Package for PACKAGE', () => {
		expect(getBillingModelLabel(BILLING_MODEL.PACKAGE)).toBe('Package');
	});

	it('returns Volume Tiered for TIERED', () => {
		expect(getBillingModelLabel(BILLING_MODEL.TIERED)).toBe('Volume Tiered');
	});

	it('returns Slab Tiered for SLAB_TIERED', () => {
		expect(getBillingModelLabel('SLAB_TIERED')).toBe('Slab Tiered');
	});

	it('returns the raw value for unknown models', () => {
		expect(getBillingModelLabel('CUSTOM' as BILLING_MODEL)).toBe('CUSTOM');
	});
});

describe('getTierModeLabel', () => {
	it('returns Volume for VOLUME', () => {
		expect(getTierModeLabel(TIER_MODE.VOLUME)).toBe('Volume');
	});

	it('returns Slab for SLAB', () => {
		expect(getTierModeLabel(TIER_MODE.SLAB)).toBe('Slab');
	});

	it('returns raw value for unknown modes', () => {
		expect(getTierModeLabel('CUSTOM' as TIER_MODE)).toBe('CUSTOM');
	});
});

describe('formatPriceDisplay', () => {
	it('formats flat fee correctly', () => {
		const normalized: NormalizedPriceDisplay = {
			amount: '100',
			symbol: '$',
			tiers: null,
			billingModel: BILLING_MODEL.FLAT_FEE,
			tierMode: TIER_MODE.VOLUME,
			transformQuantity: null,
			priceUnitType: PRICE_UNIT_TYPE.FIAT,
		};
		expect(formatPriceDisplay(normalized)).toBe('$100');
	});

	it('formats package pricing with divide_by', () => {
		const normalized: NormalizedPriceDisplay = {
			amount: '50',
			symbol: '$',
			tiers: null,
			billingModel: BILLING_MODEL.PACKAGE,
			tierMode: TIER_MODE.VOLUME,
			transformQuantity: { divide_by: 10 },
			priceUnitType: PRICE_UNIT_TYPE.FIAT,
		};
		const result = formatPriceDisplay(normalized);
		expect(result).toContain('$50');
		expect(result).toContain('10 units');
	});

	it('formats tiered pricing with starting price', () => {
		const normalized: NormalizedPriceDisplay = {
			amount: '0',
			symbol: '$',
			tiers: [
				{ unit_amount: '0.10', flat_amount: '0', first_unit: 0, last_unit: 100 },
				{ unit_amount: '0.05', flat_amount: '0', first_unit: 101, last_unit: null },
			],
			billingModel: BILLING_MODEL.TIERED,
			tierMode: TIER_MODE.VOLUME,
			transformQuantity: null,
			priceUnitType: PRICE_UNIT_TYPE.FIAT,
		};
		const result = formatPriceDisplay(normalized);
		expect(result).toContain('starts at');
		expect(result).toContain('$0.10');
		expect(result).toContain('per unit');
	});
});
