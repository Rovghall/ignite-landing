'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  computeUnitEconomics,
  convertFromUsd,
  convertToUsd,
  DEFAULT_INPUTS,
  formatMoney,
  type DisplayCurrency,
  type SubscriptionTier,
  type UnitEconomicsInputs,
  type YearBreakdown,
} from '@/lib/unit-economics-model'

function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-700 accent-white"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 text-right text-sm font-semibold text-white outline-none focus:border-zinc-500"
        />
        {suffix ? <span className="w-8 text-xs text-zinc-500">{suffix}</span> : null}
      </div>
    </label>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 border-zinc-700/80 px-4 first:pl-0 last:pr-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
      <p className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{value}</p>
    </div>
  )
}

function StackedBar({
  label,
  breakdown,
  currency,
  maxValue,
}: {
  label: string
  breakdown: YearBreakdown
  currency: DisplayCurrency
  maxValue: number
}) {
  const segments = [
    { key: 'store', label: 'Loja / web', value: breakdown.storeFee, color: 'bg-sky-500' },
    { key: 'creator', label: 'Creator', value: breakdown.creatorPayout, color: 'bg-emerald-400' },
    { key: 'api', label: 'API', value: breakdown.apiCost, color: 'bg-orange-400' },
    { key: 'infra', label: 'Infra', value: breakdown.infraCost, color: 'bg-violet-400' },
    { key: 'profit', label: 'Lucro líq.', value: Math.max(0, breakdown.netProfit), color: 'bg-lime-500' },
  ].filter((s) => s.value > 0.001)

  const total = Math.max(breakdown.grossRevenue, 0.01)
  const widthPct = Math.min(100, (total / maxValue) * 100)

  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-3">
      <p className="text-sm font-semibold text-zinc-300">{label}</p>
      <div className="h-9 overflow-hidden rounded-md bg-zinc-800/80">
        <div className="flex h-full" style={{ width: `${widthPct}%` }}>
          {segments.map((seg) => (
            <div
              key={seg.key}
              className={cn('h-full min-w-0', seg.color)}
              style={{ width: `${(seg.value / total) * 100}%` }}
              title={`${seg.label}: ${formatMoney(seg.value, currency)}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm font-bold tabular-nums text-white">{formatMoney(breakdown.netProfit, currency)}</p>
    </div>
  )
}

export function InternalUnitEconomicsDashboard() {
  const [inputs, setInputs] = useState<UnitEconomicsInputs>(DEFAULT_INPUTS)

  const result = useMemo(() => computeUnitEconomics(inputs), [inputs])

  const apiCostInCurrency = convertFromUsd(inputs.apiCostUsd, inputs.currency, inputs)
  const chartMax = Math.max(result.year1PerUser.grossRevenue, result.year2PerUser.grossRevenue, 1)

  function patchInputs(patch: Partial<UnitEconomicsInputs>) {
    setInputs((prev) => ({ ...prev, ...patch }))
  }

  function patchTier(id: string, patch: Partial<SubscriptionTier>) {
    setInputs((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }

  function setCurrency(next: DisplayCurrency) {
    setInputs((prev) => ({ ...prev, currency: next }))
  }

  function setApiCostInDisplayCurrency(value: number) {
    setInputs((prev) => ({
      ...prev,
      apiCostUsd: convertToUsd(value, prev.currency, prev),
    }))
  }

  const scaleRows = [100, 500, 1000, 1500, 2000, 2500]

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#0f1115] text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-zinc-800 px-5 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Unit economics · simulador
        </p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Estimativa de ganhos & conversão
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Ajusta tiers, subscritores, comissão das lojas e custo por análise. Valores em{' '}
          {inputs.currency}; API convertida a partir de USD.
        </p>
      </div>

      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
                Receita vs custos / utilizador / ano
              </h3>
              <div className="flex gap-1 rounded-full border border-zinc-700 p-1">
                {(['EUR', 'USD', 'GBP'] as DisplayCurrency[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-bold transition-colors',
                      inputs.currency === c
                        ? 'bg-white text-zinc-900'
                        : 'text-zinc-400 hover:text-white',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <StackedBar
                label="Ano 1"
                breakdown={result.year1PerUser}
                currency={inputs.currency}
                maxValue={chartMax}
              />
              <StackedBar
                label="Ano 2"
                breakdown={result.year2PerUser}
                currency={inputs.currency}
                maxValue={chartMax}
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-sky-500" /> Loja
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /> Creator
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-orange-400" /> API
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-400" /> Infra
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-lime-500" /> Lucro
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:flex-row">
            <KpiCard
              label="Lucro ano 1 / user"
              value={formatMoney(result.year1PerUser.netProfit, inputs.currency)}
            />
            <KpiCard
              label="Lucro ano 2 / user"
              value={formatMoney(result.year2PerUser.netProfit, inputs.currency)}
            />
            <KpiCard
              label="Campanha (conversões)"
              value={formatMoney(result.campaignNetProfit, inputs.currency)}
            />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
              Escala de subscritores (cenário actual)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                    <th className="pb-3 pr-3 font-semibold">Subscritores</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Margem/mês</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Margem/ano</th>
                    <th className="pb-3 font-semibold text-right">API/ano</th>
                  </tr>
                </thead>
                <tbody>
                  {scaleRows.map((n) => {
                    const factor = result.totalSubscribers > 0 ? n / result.totalSubscribers : 0
                    const marginMonth = result.monthlyOperatingMargin * factor
                    const marginYear = marginMonth * 12
                    const apiYear =
                      result.apiCostPerUserMonth * n * 12
                    return (
                      <tr key={n} className="border-b border-zinc-800/70 last:border-0">
                        <td className="py-3 pr-3 font-semibold text-white">{n.toLocaleString()}</td>
                        <td className="py-3 pr-3 text-right tabular-nums text-zinc-200">
                          {formatMoney(marginMonth, inputs.currency)}
                        </td>
                        <td className="py-3 pr-3 text-right tabular-nums text-lime-400">
                          {formatMoney(marginYear, inputs.currency)}
                        </td>
                        <td className="py-3 text-right tabular-nums text-orange-300">
                          {formatMoney(apiYear, inputs.currency)}
                        </td>
                      </tr>
                    )
                  })}
                  <tr className="bg-zinc-900/50">
                    <td className="py-3 pr-3 font-bold text-white">
                      Total tiers ({result.totalSubscribers.toLocaleString()})
                    </td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-white">
                      {formatMoney(result.monthlyOperatingMargin, inputs.currency)}
                    </td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-lime-400">
                      {formatMoney(result.annualOperatingMargin, inputs.currency)}
                    </td>
                    <td className="py-3 text-right font-bold tabular-nums text-orange-300">
                      {formatMoney(
                        result.apiCostPerUserMonth * result.totalSubscribers * 12,
                        inputs.currency,
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-5">
            <SliderField
              label="Comissão loja / web (%)"
              value={inputs.storeFeePercent}
              min={0}
              max={30}
              step={0.5}
              onChange={(v) => patchInputs({ storeFeePercent: v })}
              suffix="%"
            />
            <SliderField
              label={`Custo API / análise (${inputs.currency})`}
              value={Number(apiCostInCurrency.toFixed(4))}
              min={0.0001}
              max={0.2}
              step={0.0001}
              onChange={setApiCostInDisplayCurrency}
            />
            <SliderField
              label="Análises / dia / user"
              value={inputs.mealsPerDay}
              min={0.5}
              max={8}
              step={0.1}
              onChange={(v) => patchInputs({ mealsPerDay: v })}
            />
            <SliderField
              label="Infra + suporte / user / mês"
              value={inputs.infraPerUserMonth}
              min={0}
              max={5}
              step={0.1}
              onChange={(v) => patchInputs({ infraPerUserMonth: v })}
            />
            <SliderField
              label="Conversões (campanha)"
              value={inputs.campaignConversions}
              min={0}
              max={5000}
              step={1}
              onChange={(v) => patchInputs({ campaignConversions: v })}
            />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="col-span-2 flex flex-wrap gap-2">
                <span className="text-[10px] uppercase tracking-[0.08em] text-zinc-500">Presets API</span>
                <div className="flex w-full flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => patchInputs({ apiCostUsd: 0.006 })}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
                  >
                    0.6¢ (prod mini)
                  </button>
                  <button
                    type="button"
                    onClick={() => patchInputs({ apiCostUsd: 0.06 })}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
                  >
                    6¢
                  </button>
                </div>
              </div>
              <label className="flex flex-col gap-1.5 text-xs text-zinc-400">
                USD → EUR
                <input
                  type="number"
                  step={0.01}
                  value={inputs.usdToEur}
                  onChange={(e) => patchInputs({ usdToEur: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 text-sm text-white"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-zinc-400">
                USD → GBP
                <input
                  type="number"
                  step={0.01}
                  value={inputs.usdToGbp}
                  onChange={(e) => patchInputs({ usdToGbp: Number(e.target.value) })}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 text-sm text-white"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">Tiers & subscritores</h3>
              <p className="text-xs text-zinc-500">
                Margem/user/mês:{' '}
                <span className="font-bold text-lime-400">
                  {formatMoney(result.marginPerUserMonth, inputs.currency)}
                </span>
              </p>
            </div>
            <div className="space-y-3">
              {inputs.tiers.map((tier) => {
                const computed = result.tiers.find((t) => t.id === tier.id)
                return (
                  <div
                    key={tier.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3.5"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-white">{tier.name}</p>
                      {computed ? (
                        <p className="text-xs tabular-nums text-zinc-400">
                          {formatMoney(computed.monthlyMargin, inputs.currency)}/mês
                        </p>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Preço ({inputs.currency})
                        <input
                          type="number"
                          step={0.1}
                          value={tier.price}
                          onChange={(e) => patchTier(tier.id, { price: Number(e.target.value) })}
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Meses
                        <input
                          type="number"
                          min={1}
                          value={tier.durationMonths}
                          onChange={(e) =>
                            patchTier(tier.id, { durationMonths: Number(e.target.value) })
                          }
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Creator (1×)
                        <input
                          type="number"
                          step={1}
                          value={tier.creatorPayout}
                          onChange={(e) =>
                            patchTier(tier.id, { creatorPayout: Number(e.target.value) })
                          }
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Subscritores
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={tier.subscribers}
                          onChange={(e) =>
                            patchTier(tier.id, { subscribers: Number(e.target.value) })
                          }
                          className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm font-bold text-lime-300"
                        />
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
