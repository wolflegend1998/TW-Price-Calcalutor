export interface PricingRules {
  linePrices: {
    [key: string]: {
      portIn: number;
      newNumber: number;
    };
  };
  deviceTypes: {
    [key: string]: {
      name: string;
      deviceCost: number;
      monthlyAddOn: number;
    };
  };
  plans: {
    [key: string]: {
      name: string;
      monthlyPrice: number;
    };
  };
  homeInternet: {
    monthlyPrice: number;
    discount: number;
  };
  autoPay: {
    discount: number;
  };
  taxRate: number;
  processingFee: number;
}

export interface CalculatorState {
  numberOfLines: string;
  customerType: 'portIn' | 'newNumber';
  deviceType: string;
  plan: string;
  homeInternet: boolean;
  autoPay: boolean;
  includeTaxes: boolean;
}

export interface QuoteResult {
  monthlyPrice: number;
  dueToday: number;
  breakdown: {
    linesCost: number;
    deviceCost: number;
    monthlyDeviceAddOn: number;
    planCost: number;
    homeInternetCost: number;
    autoPayDiscount: number;
    homeInternetDiscount: number;
    subtotal: number;
    taxes: number;
    processingFee: number;
  };
}
