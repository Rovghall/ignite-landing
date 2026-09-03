/**
 * Creator outreach display currency by country.
 * Matches app zones: euro-area → EUR, UK → GBP, else → USD
 * (US, CA, AU and remaining regions use USD amounts).
 */

export type CreatorOutreachCurrency = 'EUR' | 'USD' | 'GBP'

export type CreatorOutreachMoney = {
  currency: CreatorOutreachCurrency
  symbol: string
  /** e.g. €10 / $10 / £10 */
  reward: string
  /** e.g. €44.90 / $44.90 / £44.90 */
  annual: string
  rewardAmount: number
  annualAmount: number
}

const SYMBOL: Record<CreatorOutreachCurrency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
}

const REWARD_AMOUNT = 10
const ANNUAL_AMOUNT = 44.9

/** Official euro-area + EUR-using territories (ISO 3166-1 alpha-2). */
const EUR_REGIONS = new Set([
  'AT',
  'BE',
  'CY',
  'DE',
  'EE',
  'ES',
  'FI',
  'FR',
  'GR',
  'HR',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PT',
  'SI',
  'SK',
  'AD',
  'MC',
  'SM',
  'VA',
  'XK',
  'ME',
])

const GBP_REGIONS = new Set(['GB', 'UK', 'GG', 'JE', 'IM'])

export function isCreatorOutreachCurrency(value: string | null | undefined): value is CreatorOutreachCurrency {
  return value === 'EUR' || value === 'USD' || value === 'GBP'
}

export function currencyForCountry(country: string | null | undefined): CreatorOutreachCurrency {
  const region = (country ?? '').trim().toUpperCase()
  if (EUR_REGIONS.has(region)) return 'EUR'
  if (GBP_REGIONS.has(region)) return 'GBP'
  return 'USD'
}

export function formatCreatorMoney(amount: number, currency: CreatorOutreachCurrency): string {
  const symbol = SYMBOL[currency]
  const formatted =
    Number.isInteger(amount) || Math.abs(amount - Math.round(amount)) < 1e-9
      ? String(Math.round(amount))
      : amount.toFixed(2)
  return `${symbol}${formatted}`
}

export function getCreatorOutreachMoney(currency: CreatorOutreachCurrency): CreatorOutreachMoney {
  return {
    currency,
    symbol: SYMBOL[currency],
    reward: formatCreatorMoney(REWARD_AMOUNT, currency),
    annual: formatCreatorMoney(ANNUAL_AMOUNT, currency),
    rewardAmount: REWARD_AMOUNT,
    annualAmount: ANNUAL_AMOUNT,
  }
}

/** Resolve currency: explicit query override → geo country → EUR fallback for unknown. */
export function resolveCreatorOutreachCurrency(opts: {
  queryCurrency?: string | null
  country?: string | null
}): CreatorOutreachCurrency {
  const raw = opts.queryCurrency?.trim().toUpperCase()
  if (isCreatorOutreachCurrency(raw)) return raw
  if (opts.country) return currencyForCountry(opts.country)
  return 'EUR'
}
