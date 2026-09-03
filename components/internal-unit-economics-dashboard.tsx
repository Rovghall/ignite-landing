'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
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

function clampNumber(value: number, min?: number, max?: number): number {
  let next = value
  if (min != null && next < min) next = min
  if (max != null && next > max) next = max
  return next
}

/** Custom stepper column — native browser spinners cannot be spaced reliably. */
function EconomicsNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  size = 'default',
  className,
  inputClassName,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  size?: 'default' | 'compact'
  className?: string
  inputClassName?: string
}) {
  const compact = size === 'compact'

  function bump(direction: 1 | -1) {
    const raw = value + direction * step
    const rounded =
      step < 1 ? Math.round(raw * 10000) / 10000 : Math.round(raw * 100) / 100
    onChange(clampNumber(rounded, min, max))
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-stretch overflow-hidden rounded-lg border border-zinc-700',
        compact ? 'h-[34px] w-full bg-zinc-950' : 'h-[38px] w-[6.5rem] bg-zinc-900',
        className,
      )}
    >
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const parsed = Number(e.target.value)
          if (Number.isFinite(parsed)) onChange(clampNumber(parsed, min, max))
        }}
        className={cn(
          'min-w-0 flex-1 border-0 bg-transparent py-0 pl-2.5 pr-2 text-right text-sm font-medium tabular-nums text-white outline-none',
          '[appearance:textfield] [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          inputClassName,
        )}
      />
      <div className="flex w-[22px] shrink-0 flex-col border-l border-zinc-700/80">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Aumentar valor"
          onClick={() => bump(1)}
          className="flex flex-1 items-center justify-center text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ChevronUp className="size-3" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Diminuir valor"
          onClick={() => bump(-1)}
          className="flex flex-1 items-center justify-center border-t border-zinc-700/80 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ChevronDown className="size-3" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

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
        <EconomicsNumberInput
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        {suffix ? <span className="w-8 text-xs text-zinc-500">{suffix}</span> : null}
      </div>
    </label>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-1 border-zinc-700/80 px-4 first:pl-0 last:pr-0 sm:border-r sm:last:border-r-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500">{label}</p>
      <p className="text-xl font-semibold tabular-nums tracking-normal text-white sm:text-2xl">{value}</p>
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
    { key: 'infra', label: 'Infra fixa', value: breakdown.infraCost, color: 'bg-violet-400' },
    { key: 'profit', label: 'Lucro líq.', value: Math.max(0, breakdown.netProfit), color: 'bg-lime-500' },
  ].filter((s) => s.value > 0.001)

  const total = Math.max(breakdown.grossRevenue, 0.01)
  const widthPct = Math.min(100, (total / maxValue) * 100)

  return (
    <div className="grid grid-cols-[88px_1fr_auto] items-center gap-3">
      <p className="text-sm font-semibold text-zinc-300">{label}</p>
      <div className="h-9 overflow-hidden rounded-md bg-zinc-800/80">
        <div className="flex h-full" style={{ width: `${widthPct}%` }}>
          {segments.map((seg) => {
            const pct = (seg.value / total) * 100
            const minW = seg.key === 'creator' && seg.value > 0 ? '6px' : undefined
            return (
              <div
                key={seg.key}
                className={cn('h-full min-w-0', seg.color)}
                style={{ width: `${pct}%`, minWidth: minW }}
                title={`${seg.label}: ${formatMoney(seg.value, currency)}`}
              />
            )
          })}
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
  const chartMax = Math.max(
    result.year1PerUser.grossRevenue,
    result.year2PerUser.grossRevenue,
    result.creatorPlanYear1?.grossRevenue ?? 0,
    result.creatorPlanYear2?.grossRevenue ?? 0,
    1,
  )
  const creatorTier = inputs.tiers.find((t) => t.id === '12m-creator')
  const creatorRenewalGain =
    result.creatorPlanYear1 && result.creatorPlanYear2
      ? result.creatorPlanYear2.netProfit - result.creatorPlanYear1.netProfit
      : 0

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

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#0f1115] text-zinc-100 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="border-b border-zinc-800 px-5 py-5 sm:px-8 sm:py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Unit economics · simulador
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-white sm:text-2xl">
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
                Mix total — receita vs custos / user / ano
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

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Média ponderada de todos os tiers ({result.totalSubscribers.toLocaleString()} subs).
              Payout creator dilui-se: ex. 100 creator / 1.000 subs → ~€1/user/ano, não €10 — por isso
              Ano 1 e Ano 2 parecem quase iguais aqui.
            </p>

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
                <span className="h-2.5 w-2.5 rounded-sm bg-violet-400" /> Infra fixa
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-lime-500" /> Lucro
              </span>
            </div>
          </div>

          {result.creatorPlanYear1 && result.creatorPlanYear2 && creatorTier ? (
            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-emerald-400/90">
                  Plano creator — {formatMoney(creatorTier.price, inputs.currency)}/ano · 1 sub
                </h3>
                <p className="text-xs font-semibold text-emerald-300">
                  Renovação +{formatMoney(creatorRenewalGain, inputs.currency)}/ano
                </p>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-zinc-400">
                1.ª subscrição: pagas {formatMoney(creatorTier.creatorPayout, inputs.currency)} ao creator
                (ficas com {formatMoney(creatorTier.price - creatorTier.creatorPayout, inputs.currency)} antes
                da loja). Renovação: {formatMoney(creatorTier.price, inputs.currency)} sem novo payout — recebes
                os {formatMoney(creatorTier.creatorPayout, inputs.currency)} a mais.
              </p>
              <div className="space-y-4">
                <StackedBar
                  label="1.ª sub"
                  breakdown={result.creatorPlanYear1}
                  currency={inputs.currency}
                  maxValue={chartMax}
                />
                <StackedBar
                  label="Renovação"
                  breakdown={result.creatorPlanYear2}
                  currency={inputs.currency}
                  maxValue={chartMax}
                />
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Lucro mix ano 1 / user"
              value={formatMoney(result.year1PerUser.netProfit, inputs.currency)}
            />
            <KpiCard
              label="Lucro mix ano 2 / user"
              value={formatMoney(result.year2PerUser.netProfit, inputs.currency)}
            />
            {result.creatorPlanYear1 && result.creatorPlanYear2 ? (
              <KpiCard
                label="Creator: renovação − 1.ª sub"
                value={formatMoney(creatorRenewalGain, inputs.currency)}
              />
            ) : null}
            <KpiCard
              label="Campanha (conversões)"
              value={formatMoney(result.campaignNetProfit, inputs.currency)}
            />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.1em] text-zinc-400">
              Resultado dos tiers
            </h3>
            <p className="mb-4 text-xs text-zinc-500">
              Ano 1 inclui fee do creator amortizado. Ano 2 = renovação sem novo payout.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                    <th className="pb-3 pr-3 font-semibold">Tier</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Subs</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Margem/mês</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Ano 1</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Ano 2</th>
                    <th className="pb-3 font-semibold text-right">API/ano</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tiers.map((tier) => (
                    <tr key={tier.id} className="border-b border-zinc-800/70 last:border-0">
                      <td className="py-3 pr-3 font-semibold text-white">{tier.name}</td>
                      <td className="py-3 pr-3 text-right tabular-nums text-zinc-300">
                        {tier.subscribers.toLocaleString()}
                      </td>
                      <td className="py-3 pr-3 text-right tabular-nums text-zinc-200">
                        {formatMoney(tier.monthlyMargin, inputs.currency)}
                      </td>
                      <td className="py-3 pr-3 text-right tabular-nums text-lime-400">
                        {formatMoney(tier.annualMargin, inputs.currency)}
                      </td>
                      <td className="py-3 pr-3 text-right tabular-nums text-emerald-300">
                        {formatMoney(tier.annualMarginYear2, inputs.currency)}
                      </td>
                      <td className="py-3 text-right tabular-nums text-orange-300">
                        {formatMoney(tier.monthlyApiCost * 12, inputs.currency)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-900/50">
                    <td className="py-3 pr-3 font-bold text-white">Total</td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-white">
                      {result.totalSubscribers.toLocaleString()}
                    </td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-white">
                      {formatMoney(result.monthlyOperatingMargin, inputs.currency)}
                    </td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-lime-400">
                      {formatMoney(result.annualOperatingMargin, inputs.currency)}
                    </td>
                    <td className="py-3 pr-3 text-right font-bold tabular-nums text-emerald-300">
                      {formatMoney(result.annualOperatingMarginYear2, inputs.currency)}
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
              label="Supabase ($/mês)"
              value={inputs.supabaseMonthlyUsd}
              min={0}
              max={200}
              step={1}
              onChange={(v) => patchInputs({ supabaseMonthlyUsd: v })}
            />
            <SliderField
              label="Email Namecheap ($/ano)"
              value={inputs.emailYearlyUsd}
              min={0}
              max={500}
              step={5}
              onChange={(v) => patchInputs({ emailYearlyUsd: v })}
            />
            <p className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2.5 text-xs leading-relaxed text-zinc-400">
              Infra fixa total:{' '}
              <span className="font-semibold text-zinc-200">
                {formatMoney(result.fixedInfraMonthlyTotal, inputs.currency)}/mês
              </span>{' '}
              (Supabase + email ÷ 12). Repartida por{' '}
              <span className="font-semibold text-zinc-200">
                {result.totalSubscribers.toLocaleString()} subs
              </span>
              :{' '}
              <span className="font-semibold text-violet-300">
                {formatMoney(result.infraPerUserMonth, inputs.currency, 3)}/user/mês
              </span>
              .
            </p>
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
                <EconomicsNumberInput
                  size="compact"
                  step={0.01}
                  value={inputs.usdToEur}
                  onChange={(v) => patchInputs({ usdToEur: v })}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-xs text-zinc-400">
                USD → GBP
                <EconomicsNumberInput
                  size="compact"
                  step={0.01}
                  value={inputs.usdToGbp}
                  onChange={(v) => patchInputs({ usdToGbp: v })}
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
                          {formatMoney(computed.monthlyMargin, inputs.currency)}/mês margem
                        </p>
                      ) : null}
                    </div>
                    <div
                      className={cn(
                        'grid grid-cols-2 gap-2',
                        tier.id === '12m-creator' ? 'sm:grid-cols-4' : 'sm:grid-cols-3',
                      )}
                    >
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Preço ({inputs.currency})
                        <EconomicsNumberInput
                          size="compact"
                          step={0.1}
                          value={tier.price}
                          onChange={(v) => patchTier(tier.id, { price: v })}
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Meses
                        <EconomicsNumberInput
                          size="compact"
                          min={1}
                          step={1}
                          value={tier.durationMonths}
                          onChange={(v) => patchTier(tier.id, { durationMonths: v })}
                        />
                      </label>
                      {tier.id === '12m-creator' ? (
                        <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                          Creator (1×)
                          <EconomicsNumberInput
                            size="compact"
                            step={1}
                            value={tier.creatorPayout}
                            onChange={(v) => patchTier(tier.id, { creatorPayout: v })}
                          />
                        </label>
                      ) : null}
                      <label className="flex flex-col gap-1 text-[10px] uppercase text-zinc-500">
                        Subscritores
                        <EconomicsNumberInput
                          size="compact"
                          min={0}
                          step={1}
                          value={tier.subscribers}
                          onChange={(v) => patchTier(tier.id, { subscribers: v })}
                          inputClassName="font-semibold text-lime-300"
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
