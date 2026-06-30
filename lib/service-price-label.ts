export type ServicePriceLabelInput = {
  coinCost: number;
  effectiveCoinCost: number;
  freeServicesEnabled?: boolean;
};

export type ServicePriceLabel = {
  coinCost: number;
  effectiveCoinCost: number;
  isFree: boolean;
  compactLabel: string;
};

export function buildServicePriceLabel(input: ServicePriceLabelInput): ServicePriceLabel {
  const isFree = input.freeServicesEnabled ?? input.effectiveCoinCost === 0;
  if (isFree) {
    return {
      coinCost: input.coinCost,
      effectiveCoinCost: 0,
      isFree: true,
      compactLabel: 'Free',
    };
  }
  const coinsWord = input.coinCost === 1 ? 'coin' : 'coins';
  return {
    coinCost: input.coinCost,
    effectiveCoinCost: input.effectiveCoinCost,
    isFree: false,
    compactLabel: `${input.coinCost} ${coinsWord}`,
  };
}
