import { describe, expect, it } from 'vitest';
import { buildServicePriceLabel } from './service-price-label';

describe('buildServicePriceLabel', () => {
  it('returns Free with strikethrough source when free mode is active', () => {
    const label = buildServicePriceLabel({
      coinCost: 10,
      effectiveCoinCost: 0,
      freeServicesEnabled: true,
    });
    expect(label).toEqual({
      coinCost: 10,
      effectiveCoinCost: 0,
      isFree: true,
      compactLabel: 'Free',
    });
  });

  it('returns coin amount in paid mode', () => {
    const label = buildServicePriceLabel({
      coinCost: 10,
      effectiveCoinCost: 10,
      freeServicesEnabled: false,
    });
    expect(label.compactLabel).toBe('10 coins');
    expect(label.isFree).toBe(false);
  });
});
