import type { Locale } from '../locales'
import type { Messages } from './en'
import { en } from './en'
import { pt } from './pt'
import { ptBr } from './pt-br'
import { es } from './es'
import { fr } from './fr'
import { de } from './de'
import { it } from './it'
import { nl } from './nl'
import { no } from './no'
import { sv } from './sv'
import { ja } from './ja'
import { ko } from './ko'
import { zh } from './zh'

export const messages: Record<Locale, Messages> = {
  en,
  pt,
  'pt-br': ptBr,
  es,
  fr,
  de,
  it,
  nl,
  no,
  sv,
  ja,
  ko,
  zh,
}

export type { Messages }
export { en }
