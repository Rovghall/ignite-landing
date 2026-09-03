export type DisplayCurrency = 'EUR' | 'USD' | 'GBP'

export type SubscriptionTier = {
  id: string
  name: string
  price: number
  durationMonths: number
  creatorPayout: number
  subscribers: number
}

export type UnitEconomicsInputs = {
  tiers: SubscriptionTier[]
  storeFeePercent: number
  /** API cost per meal analysis, stored in USD internally */
  apiCostUsd: number
  mealsPerDay: number
  /** Fixed Supabase bill (USD / month) */
  supabaseMonthlyUsd: number
  /** Namecheap / email hosting (USD / year) */
  emailYearlyUsd: number
  currency: DisplayCurrency
  usdToEur: number
  usdToGbp: number
  campaignConversions: number
}

export type TierComputed = SubscriptionTier & {
  storeCut: number
  netAfterStore: number
  netAfterCreator: number
  netPerMonth: number
  monthlyGross: number
  monthlyNetAfterStore: number
  monthlyNetAfterCreator: number
  monthlyApiCost: number
  monthlyInfraCost: number
  monthlyMargin: number
  /** Run-rate anual com fee creator amortizado (≈ 1.º ano) */
  annualMargin: number
  /** Run-rate anual sem fee creator (renovação / 2.º ano) */
  annualMarginYear2: number
}

export type YearBreakdown = {
  storeFee: number
  creatorPayout: number
  apiCost: number
  infraCost: number
  netProfit: number
  grossRevenue: number
}

export type UnitEconomicsResult = {
  tiers: TierComputed[]
  totalSubscribers: number
  weightedNetPerMonth: number
  apiCostPerUserMonth: number
  infraPerUserMonth: number
  fixedInfraMonthlyTotal: number
  marginPerUserMonth: number
  marginPerUserYear: number
  monthlyOperatingMargin: number
  annualOperatingMargin: number
  /** Total run-rate anual sem payouts de creator (renovação) */
  annualOperatingMarginYear2: number
  year1PerUser: YearBreakdown
  year2PerUser: YearBreakdown
  /** Per subscriber on the creator tier (12m) — 1.ª subscrição vs renovação */
  creatorPlanYear1: YearBreakdown | null
  creatorPlanYear2: YearBreakdown | null
  campaignNetProfit: number
}

export const DEFAULT_TIERS: SubscriptionTier[] = [
  { id: '3m', name: '3 meses', price: 24.9, durationMonths: 3, creatorPayout: 0, subscribers: 150 },
  { id: '6m', name: '6 meses', price: 34.9, durationMonths: 6, creatorPayout: 0, subscribers: 200 },
  {
    id: '12m-std',
    name: '12 meses (paywall)',
    price: 59.9,
    durationMonths: 12,
    creatorPayout: 0,
    subscribers: 350,
  },
  {
    id: '12m-down',
    name: '12 meses (downsell)',
    price: 49.9,
    durationMonths: 12,
    creatorPayout: 0,
    subscribers: 200,
  },
  {
    id: '12m-creator',
    name: '12 meses (creator)',
    price: 44.9,
    durationMonths: 12,
    creatorPayout: 10,
    subscribers: 100,
  },
]

export const DEFAULT_INPUTS: UnitEconomicsInputs = {
  tiers: DEFAULT_TIERS,
  storeFeePercent: 15,
  /** ~0.6¢ measured (gpt-4o-mini); editable — e.g. 0.06 for 6¢ */
  apiCostUsd: 0.006,
  mealsPerDay: 2.5,
  supabaseMonthlyUsd: 25,
  emailYearlyUsd: 70,
  currency: 'EUR',
  usdToEur: 0.92,
  usdToGbp: 0.79,
  campaignConversions: 50,
}

export function convertFromUsd(amountUsd: number, currency: DisplayCurrency, rates: Pick<UnitEconomicsInputs, 'usdToEur' | 'usdToGbp'>): number {
  if (currency === 'USD') return amountUsd
  if (currency === 'EUR') return amountUsd * rates.usdToEur
  return amountUsd * rates.usdToGbp
}

export function convertToUsd(amount: number, currency: DisplayCurrency, rates: Pick<UnitEconomicsInputs, 'usdToEur' | 'usdToGbp'>): number {
  if (currency === 'USD') return amount
  if (currency === 'EUR') return rates.usdToEur > 0 ? amount / rates.usdToEur : amount
  return rates.usdToGbp > 0 ? amount / rates.usdToGbp : amount
}

export function fixedInfraMonthlyUsd(inputs: Pick<UnitEconomicsInputs, 'supabaseMonthlyUsd' | 'emailYearlyUsd'>): number {
  return inputs.supabaseMonthlyUsd + inputs.emailYearlyUsd / 12
}

export function infraPerUserMonthFromInputs(
  inputs: UnitEconomicsInputs,
  totalSubscribers: number,
): { fixedInfraMonthlyTotal: number; infraPerUserMonth: number } {
  const fixedInfraMonthlyTotal = convertFromUsd(fixedInfraMonthlyUsd(inputs), inputs.currency, inputs)
  const infraPerUserMonth =
    totalSubscribers > 0 ? fixedInfraMonthlyTotal / totalSubscribers : fixedInfraMonthlyTotal
  return { fixedInfraMonthlyTotal, infraPerUserMonth }
}

function computeTier(
  tier: SubscriptionTier,
  storeFeePercent: number,
  apiCostPerUserMonth: number,
  infraPerUserMonth: number,
): TierComputed {
  const storeCut = tier.price * (storeFeePercent / 100)
  const netAfterStore = tier.price - storeCut
  const netAfterCreator = netAfterStore - tier.creatorPayout
  const netPerMonth = netAfterCreator / tier.durationMonths
  const netPerMonthYear2 = netAfterStore / tier.durationMonths
  const monthlyGross = (tier.price / tier.durationMonths) * tier.subscribers
  const monthlyNetAfterStore = (netAfterStore / tier.durationMonths) * tier.subscribers
  const monthlyNetAfterCreator = netPerMonth * tier.subscribers
  const monthlyApiCost = apiCostPerUserMonth * tier.subscribers
  const monthlyInfraCost = infraPerUserMonth * tier.subscribers
  const monthlyMargin = monthlyNetAfterCreator - monthlyApiCost - monthlyInfraCost
  const monthlyMarginYear2 = netPerMonthYear2 * tier.subscribers - monthlyApiCost - monthlyInfraCost

  return {
    ...tier,
    storeCut,
    netAfterStore,
    netAfterCreator,
    netPerMonth,
    monthlyGross,
    monthlyNetAfterStore,
    monthlyNetAfterCreator,
    monthlyApiCost,
    monthlyInfraCost,
    monthlyMargin,
    annualMargin: monthlyMargin * 12,
    annualMarginYear2: monthlyMarginYear2 * 12,
  }
}

function weightedAverage(values: { weight: number; value: number }[]): number {
  const totalWeight = values.reduce((s, v) => s + v.weight, 0)
  if (totalWeight <= 0) return 0
  return values.reduce((s, v) => s + v.weight * v.value, 0) / totalWeight
}

/** One subscription period (e.g. 12 months) for a single tier — not blended across the mix. */
export function yearBreakdownForTier(
  tier: SubscriptionTier,
  storeFeePercent: number,
  apiCostPerUserMonth: number,
  infraPerUserMonth: number,
  includeCreatorPayout: boolean,
): YearBreakdown {
  const storeCut = tier.price * (storeFeePercent / 100)
  const creatorPayout = includeCreatorPayout ? tier.creatorPayout : 0
  const apiCost = apiCostPerUserMonth * 12
  const infraCost = infraPerUserMonth * 12
  return {
    grossRevenue: tier.price,
    storeFee: storeCut,
    creatorPayout,
    apiCost,
    infraCost,
    netProfit: tier.price - storeCut - creatorPayout - apiCost - infraCost,
  }
}

export function computeUnitEconomics(inputs: UnitEconomicsInputs): UnitEconomicsResult {
  const apiCostDisplay = convertFromUsd(inputs.apiCostUsd, inputs.currency, inputs)
  const apiCostPerUserMonth = inputs.mealsPerDay * 30 * apiCostDisplay
  const totalSubscribers = inputs.tiers.reduce((s, t) => s + t.subscribers, 0)
  const { fixedInfraMonthlyTotal, infraPerUserMonth } = infraPerUserMonthFromInputs(
    inputs,
    totalSubscribers,
  )
  const tiers = inputs.tiers.map((tier) =>
    computeTier(tier, inputs.storeFeePercent, apiCostPerUserMonth, infraPerUserMonth),
  )

  const weights = tiers.map((t) => ({ weight: t.subscribers, value: t.netPerMonth }))
  const weightedNetPerMonth = weightedAverage(weights)
  const marginPerUserMonth = weightedNetPerMonth - apiCostPerUserMonth - infraPerUserMonth
  const marginPerUserYear = marginPerUserMonth * 12

  const monthlyOperatingMargin = tiers.reduce((s, t) => s + t.monthlyMargin, 0)
  const annualOperatingMargin = monthlyOperatingMargin * 12
  const annualOperatingMarginYear2 = tiers.reduce((s, t) => s + t.annualMarginYear2, 0)

  const weightedCreatorFirstYear = weightedAverage(
    tiers.map((t) => ({ weight: t.subscribers, value: t.creatorPayout })),
  )
  const weightedGrossYear = weightedAverage(
    tiers.map((t) => ({ weight: t.subscribers, value: t.price * (12 / t.durationMonths) })),
  )
  const weightedStoreYear = weightedAverage(
    tiers.map((t) => ({ weight: t.subscribers, value: t.storeCut * (12 / t.durationMonths) })),
  )
  const apiYear = apiCostPerUserMonth * 12
  const infraYear = infraPerUserMonth * 12

  const year1PerUser: YearBreakdown = {
    grossRevenue: weightedGrossYear,
    storeFee: weightedStoreYear,
    creatorPayout: weightedCreatorFirstYear,
    apiCost: apiYear,
    infraCost: infraYear,
    netProfit: weightedGrossYear - weightedStoreYear - weightedCreatorFirstYear - apiYear - infraYear,
  }

  const year2PerUser: YearBreakdown = {
    grossRevenue: weightedGrossYear,
    storeFee: weightedStoreYear,
    creatorPayout: 0,
    apiCost: apiYear,
    infraCost: infraYear,
    netProfit: weightedGrossYear - weightedStoreYear - apiYear - infraYear,
  }

  const campaignNetProfit = inputs.campaignConversions * year1PerUser.netProfit

  const creatorTier = inputs.tiers.find((t) => t.id === '12m-creator') ?? null
  const creatorPlanYear1 = creatorTier
    ? yearBreakdownForTier(
        creatorTier,
        inputs.storeFeePercent,
        apiCostPerUserMonth,
        infraPerUserMonth,
        true,
      )
    : null
  const creatorPlanYear2 = creatorTier
    ? yearBreakdownForTier(
        creatorTier,
        inputs.storeFeePercent,
        apiCostPerUserMonth,
        infraPerUserMonth,
        false,
      )
    : null

  return {
    tiers,
    totalSubscribers,
    weightedNetPerMonth,
    apiCostPerUserMonth,
    infraPerUserMonth,
    fixedInfraMonthlyTotal,
    marginPerUserMonth,
    marginPerUserYear,
    monthlyOperatingMargin,
    annualOperatingMargin,
    annualOperatingMarginYear2,
    year1PerUser,
    year2PerUser,
    creatorPlanYear1,
    creatorPlanYear2,
    campaignNetProfit,
  }
}

export function formatMoney(value: number, currency: DisplayCurrency, decimals = 2): string {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${symbol}${formatted}`
}
