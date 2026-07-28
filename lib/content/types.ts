export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }

export type LegalSection = {
  title: string
  blocks: LegalBlock[]
}

export type LegalDoc = {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

export type LegalBundle = {
  privacyPolicy: LegalDoc
  termsOfUse: LegalDoc
}

export type BlogPost = {
  slug: string
  title: string
  date: string
  description: string
  sections: { heading?: string; body: string[] }[]
}
