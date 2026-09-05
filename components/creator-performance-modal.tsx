'use client'

import { useState, type ReactNode } from 'react'
import { getCreatorOutreachMoney, type CreatorOutreachCurrency } from '@/lib/creator-outreach-currency'
import { convertFromUsd, DEFAULT_INPUTS, type DisplayCurrency } from '@/lib/unit-economics-model'
import { cn } from '@/lib/utils'

const ANALYSIS_COST_USD = DEFAULT_INPUTS.apiCostUsd
const USAGE_CURRENCIES: { id: DisplayCurrency; label: string }[] = [
  { id: 'USD', label: 'USD' },
  { id: 'EUR', label: 'EUR' },
  { id: 'GBP', label: 'GBP' },
]

export type CreatorPerformanceUsage = {
  linked: boolean
  snap_track: number
  snap_cook: number
  total: number
  last_snap_at: string | null
  vip_start: string | null
  vip_end: string | null
}

export type CreatorPerformanceCodeStats = {
  codeUsers: number
  annualPending: number
  annualCleared: number
  cancellations: number
}

function formatMoney(amountUsd: number, currency: DisplayCurrency) {
  const amount = convertFromUsd(amountUsd, currency, DEFAULT_INPUTS)
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
  if (amount === 0) return `${symbol}0`
  if (amount < 1) return `${symbol}${amount.toFixed(3)}`
  return `${symbol}${amount.toFixed(2)}`
}

function formatListMoney(amount: number, currency: DisplayCurrency) {
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'
  if (amount === 0) return `${symbol}0`
  if (Math.abs(amount) < 1) return `${symbol}${amount.toFixed(3)}`
  return `${symbol}${amount.toFixed(2)}`
}

export function CreatorPerformanceModal({
  name,
  code,
  contracted,
  approved,
  usage,
  codeStats,
  loading,
  error,
  formatDate,
  extraStatus,
  onClose,
}: {
  name: string
  code?: string | null
  contracted?: boolean
  approved?: boolean
  usage: CreatorPerformanceUsage | null
  codeStats: CreatorPerformanceCodeStats
  loading?: boolean
  error?: string | null
  formatDate: (iso: string | null) => string
  extraStatus?: ReactNode
  onClose: () => void
}) {
  const [currency, setCurrency] = useState<DisplayCurrency>('EUR')

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight">{name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Análises, código e dinheiro deste creator. A moeda só muda a visualização.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {USAGE_CURRENCIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrency(item.id)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-bold',
                    currency === item.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-card',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold"
          >
            Fechar
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">A carregar…</p>
        ) : error ? (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        ) : usage ? (
          <div className="space-y-4">
            <section>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  Estado
                </p>
                {extraStatus}
                {contracted ? (
                  <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-800">
                    Contratado
                  </span>
                ) : null}
                {approved ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" aria-hidden>
                      <path
                        d="M3.2 8.2 6.4 11.4 12.8 4.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Aprovado
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                VIP {formatDate(usage.vip_start)} → {formatDate(usage.vip_end)}
                {usage.last_snap_at ? ` · último snap ${formatDate(usage.last_snap_at)}` : ''}
                {code ? ` · código ${code}` : ''}
              </p>
            </section>

            <section>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Análises (custo teu)
              </p>
              {usage.linked ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Snap Track
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">{usage.snap_track}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatMoney(usage.snap_track * ANALYSIS_COST_USD, currency)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Snap Cook
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tabular-nums">{usage.snap_cook}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatMoney(usage.snap_cook * ANALYSIS_COST_USD, currency)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatMoney(ANALYSIS_COST_USD, currency)} por análise · {usage.total} no total ·{' '}
                    {formatMoney(usage.total * ANALYSIS_COST_USD, currency)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sem conta da app ligada. Não dá para contar snaps.
                </p>
              )}
            </section>

            <section>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                Código e referrals
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Usaram o código
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.codeUsers}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Cancelamentos
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.cancellations}</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Anual pendente
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.annualPending}</p>
                  <p className="text-[11px] text-muted-foreground">Ainda na window de refund</p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Anual pago
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums">{codeStats.annualCleared}</p>
                  <p className="text-[11px] text-muted-foreground">Já fora da window</p>
                </div>
              </div>
            </section>

            {(() => {
              const pack = getCreatorOutreachMoney(currency as CreatorOutreachCurrency)
              const estimatedAnnuals = codeStats.annualPending + codeStats.annualCleared
              const snapCost = convertFromUsd(usage.total * ANALYSIS_COST_USD, currency, DEFAULT_INPUTS)
              const estimatedRevenue = estimatedAnnuals * pack.annualAmount
              const estimatedPayout = estimatedAnnuals * pack.rewardAmount
              const estimatedProfit = estimatedRevenue - estimatedPayout - snapCost
              const realRevenue = codeStats.annualCleared * pack.annualAmount
              const realPayout = codeStats.annualCleared * pack.rewardAmount
              const realProfit = realRevenue - realPayout - snapCost
              return (
                <section>
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Dinheiro
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Receita estimada
                      </p>
                      <p className="mt-1 text-lg font-extrabold tabular-nums">
                        {formatListMoney(estimatedRevenue, currency)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {estimatedAnnuals} × {pack.annual} (com pendentes)
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Receita real
                      </p>
                      <p className="mt-1 text-lg font-extrabold tabular-nums">
                        {formatListMoney(realRevenue, currency)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {codeStats.annualCleared} × {pack.annual} (fora da window)
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Payout estimado
                      </p>
                      <p className="mt-1 text-lg font-extrabold tabular-nums">
                        {formatListMoney(estimatedPayout, currency)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {estimatedAnnuals} × {pack.reward}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/30 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Payout real
                      </p>
                      <p className="mt-1 text-lg font-extrabold tabular-nums">
                        {formatListMoney(realPayout, currency)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {codeStats.annualCleared} × {pack.reward}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-foreground/15 bg-foreground px-3 py-3 text-background">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-background/70">
                        Lucro estimado
                      </p>
                      <p className="mt-1 text-xl font-extrabold tabular-nums">
                        {formatListMoney(estimatedProfit, currency)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800">
                        Lucro real
                      </p>
                      <p className="mt-1 text-xl font-extrabold tabular-nums text-emerald-950">
                        {formatListMoney(realProfit, currency)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                    Estimado inclui anuais ainda na window de refund. Real só depois da window.
                    Ambos: anuais − {pack.reward} por anual − análises. Sem taxas da store.
                  </p>
                </section>
              )
            })()}
          </div>
        ) : null}
      </div>
    </div>
  )
}
