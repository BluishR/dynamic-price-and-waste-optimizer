export type PricingRecommendation = 'promo' | 'increase' | 'decrease' | 'markdown' | 'no_change' | 'price_change' | 'manual_review';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type SimulationScenario = 'Current price' | 'Optimized Price' | 'Promo' | 'percentage_discount' | 'bundle_offer' | 'loyalty_points';

export interface SimulationRow {
  scenario: SimulationScenario;
  price: number | string;
  revenue: string;
  margin: string; // e.g. "22%"
  waste: string;  // e.g. "28%"
}

export interface PricingProduct {
  id: string;
  itemId: number | string;
  description: string;
  imageUrl: string;
  action: PricingRecommendation;
  recommendedScope: { level: 'national' | 'state' | 'store'; region: string; store: string | null };
  currentPrice: string;
  finalRecommendedPrice: string;
  reasonSignals: string;
  expectedImpact?: string;
  confidence?: ConfidenceLevel;
  explanation?: string;
  simulation?: SimulationRow[];
  // Optional metrics produced by optimization engine
  metrics?: {
    weeklyRevenueDeltaOptimized: number | string;
    weeklyProfitDeltaOptimized: number | string;
    wasteReductionPctOptimized: number | string;
    weeklyRevenueDeltaPromo?: number | string;
    weeklyProfitDeltaPromo?: number | string;
    wasteReductionPctPromo?: number | string;
  };
  policyCheck?: { passed: boolean; failedRules: string[] };
  riskLevel?: 'Low' | 'Medium' | 'High' | string;
  autopilotApproved?: boolean;
  notes?: string;
}

export interface PricingProductsResponse {
  products: PricingProduct[];
}

export const mockPricingProducts: PricingProductsResponse = {
  products: [
  {
      id: 'SCENARIO_PROMO_SCOPE_NATIONAL',
      itemId: 1013948,
      description: 'HOMEBRAND FINEST CLOUDY APPLE JUICE 500ML (PROMO + NATIONAL SCOPE)',
      recommendedScope: { level: 'national', region: 'NATIONAL', store: null },
      action: 'promo',
      currentPrice: '2.15',
      finalRecommendedPrice: '2.15',
      imageUrl: '/homebrand_apple_juice.png',
      simulation: [
        {scenario: 'percentage_discount', price: '1.61', revenue: '₱778', margin: '25%', waste: '11%'},
        {scenario: 'bundle_offer', price: 1.70, revenue: '₱751', margin: '21%', waste: '15%' },
        {scenario: 'loyalty_points', price: 2.09, revenue: '₱646', margin: '3%', waste: '28%'}
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 0,
        weeklyProfitDeltaOptimized: 0,
        wasteReductionPctOptimized: 0,
        weeklyRevenueDeltaPromo: 132,
        weeklyProfitDeltaPromo: 185,
        wasteReductionPctPromo: 17
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: "Promos will drive high revenue and reduce waste with low risk.",
      reasonSignals: 'competitor higher ,expiry risk, high stock, demand below forecast'
    },
  {
      id: 'SCENARIO_INCREASE_SCOPE_NATIONAL',
      itemId: 210590,
      description: 'WESTERN STAR DAIRY BUTTER 250G',
      imageUrl: '/western_star_dairy_butter.png',
      recommendedScope: { level: 'national', region: 'NATIONAL', store: null },
      action: 'price_change',
      currentPrice: '5.2',
      finalRecommendedPrice: '5.46',
      simulation: [
        { scenario: 'Current price', price: '5.2', revenue: '₱494', margin: '12%', waste: '28%' },
        { scenario: 'Optimized Price', price: '5.46', revenue: '₱468', margin: '15%', waste: '28%' }],
      metrics: {
        weeklyRevenueDeltaOptimized: '-26',
        weeklyProfitDeltaOptimized: -1,
        wasteReductionPctOptimized: 0,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: 'Low',
      confidence: 'High',
      autopilotApproved: true,
      notes: 'Small profit decrease, no policy risks, low risk action.',
      reasonSignals: 'Competitor higher'
    },

     {
      id: 'SCENARIO_MARKDOWN_SCOPE_STORE',
      itemId: 123011,
      description: 'COCA-COLA CLASSIC 1.25L',
      imageUrl: '/classic_coca_cola.png',
      recommendedScope: { level: 'store', region: 'null', store: '560' },
      action: 'markdown',
      currentPrice: '2.99',
      finalRecommendedPrice: '2.39',
      simulation: [
        {
          scenario: 'Current price',
          price: '2.99',
          revenue: '₱60',
          margin: '21%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: '2.39',
          revenue: '₱72',
          margin: '24%',
          waste: '16%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 12,
        weeklyProfitDeltaOptimized: 4,
        wasteReductionPctOptimized: 12,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: 'Markdown drives profit and waste reduction with low risk.',
      reasonSignals: 'Competitor higher, Expiry risk, High stock'
    },
    {
      id: 'SCENARIO_MARKDOWN_SCOPE_STORE_YOGHURT',
      itemId: 1198468,
      description: 'DAIRY FARMERS STRAWBERRY YOGHURT',
      imageUrl: '/dairy_farmers_strawberry_yhogurt.png',
      recommendedScope: { level: 'store', region: 'null', store: '823' },
      action: 'markdown',
      currentPrice:'2.95',
      finalRecommendedPrice: '2.07',
      simulation: [
        {
          scenario: 'Current price',
          price: '2.95',
          revenue: '₱12',
          margin: '22%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: 2.07,
          revenue: '₱18',
          margin: '28%',
          waste: '19%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 6,
        weeklyProfitDeltaOptimized: 4,
        wasteReductionPctOptimized: 9,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: "Markdown increases profit and reduces waste with low risk.",
      reasonSignals: 'Competitor higher, Expiry risk, High stock'
    },
    {
      id: 'SCENARIO_DECREASE_SCOPE_NATIONAL',
      itemId: 1405700,
      description: 'LOTUS BISCOFF BISCUITS 124G',
      imageUrl: '/lotus_biscoff_biscuit.png',
      recommendedScope: { level: 'national', region: 'NATIONAL', store: null },
      action: 'price_change',
      currentPrice: '2.75',
      finalRecommendedPrice: '2.61',
      simulation: [
        {
          scenario: 'Current price',
          price: '2.75',
          revenue: '₱1,430',
          margin: '12%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: '2.61',
          revenue: '₱1,480',
          margin: '11%',
          waste: '27%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 50,
        weeklyProfitDeltaOptimized: -2,
        wasteReductionPctOptimized: 1,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: "Slight revenue gain, tiny profit decline, policy compliant, low risk.",
      reasonSignals:
        'Competitor lower, High stock'
    },
    {
      id: "SCENARIO_KEEP_SCOPE_NATIONAL",
      itemId: 1068870,
      description: "CADBURY DAIRY MILK 315G",
      imageUrl: '/cadbury_dairy_milk.png',
      recommendedScope: { level: 'national', region: 'NATIONAL', store: null },
      action: 'no_change',
      currentPrice: '8.25',
      finalRecommendedPrice: '8.25',
      simulation: [
        {
          scenario: 'Current price',
          price: '8.25',
          revenue: '₱2,475',
          margin: '13%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: '8.25',
          revenue: '₱2,475',
          margin: '13%',
          waste: '28%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 0,
        weeklyProfitDeltaOptimized: 0,
        wasteReductionPctOptimized: 0,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: "No action—metrics unchanged, low risk, full compliance.",
      reasonSignals: 'Competitor higher'
    },
    {
      id: 'SCENARIO_KEEP_HOMEBRAND_SCOPE_NATIONAL',
      itemId: 1301192,
      description: 'HOMEBRAND FROZEN STRAWBERRIES 500G (KEEP + HOMEBRAND PARITY)',
      imageUrl: '/frozen_strawberries.png',
      recommendedScope: { level: 'national', region: 'NATIONAL', store: null },
      action: "no_change",
      currentPrice: '7',
      finalRecommendedPrice: '7',
      simulation: [
        {
          scenario: 'Current price',
          price: '7',
          revenue: '₱9,100',
          margin: '11%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: '7',
          revenue: '₱9,100',
          margin: '11%',
          waste: '28%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 0,
        weeklyProfitDeltaOptimized: 0,
        wasteReductionPctOptimized: 0,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: true,
        failedRules: []
      },
      riskLevel: "Low",
      confidence: "High",
      autopilotApproved: true,
      notes: "No action required—parity maintained, low risk.",
      reasonSignals: 'Price parity, Expiry risk'
    },
     {
      id: 'SCENARIO_REVIEW_OUTLIER_SCOPE_STORE',
      itemId: 9917524,
      description: 'HOMEBRAND LAMB LOIN CHOPS PER KG',
      imageUrl: '/lamb_loin_chops.png',
      recommendedScope: { level: 'store', region: 'null', store: '823' },
      action: 'manual_review',
      currentPrice: '1.15',
      finalRecommendedPrice: '1.15',
      simulation: [
        {
          scenario: 'Current price',
          price: '1.15',
          revenue: '₱20',
          margin: '0%',
          waste: '28%'
        },
        {
          scenario: 'Optimized Price',
          price: 1.15,
          revenue: '₱20',
          margin: '0%',
          waste: '28%'
        }
      ],
      metrics: {
        weeklyRevenueDeltaOptimized: 0,
        weeklyProfitDeltaOptimized: 0,
        wasteReductionPctOptimized: 0,
        weeklyRevenueDeltaPromo: 0,
        weeklyProfitDeltaPromo: 0,
        wasteReductionPctPromo: 0
      },
      policyCheck: {
        passed: false,
        failedRules: [
          'data_quality_outlier'
        ]
      },
      riskLevel: 'High',
      confidence: 'Low',
      autopilotApproved: false,
      notes: 'Manual review required due to data quality outlier.',
      reasonSignals: 'Competitor lower, Expiry risk, Data quality outlier'
    }
]
};
