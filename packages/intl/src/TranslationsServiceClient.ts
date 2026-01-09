import type { ExtractedMessages } from "./formatjs"

export interface Term {
  term: string
  context?: string
  reference?: string
  comment?: string
}

type TermToRemove = Pick<Term, "context" | "term">

export interface TranslationsServiceClient {
  downloadTranslations(language: string): Promise<Record<string, string>>
  uploadTerms(messages: ExtractedMessages): Promise<void>
  uploadTranslations(messages: ExtractedMessages, language: string): Promise<void>
  downloadTerms(): Promise<Term[]>
  removeTerms(terms: TermToRemove[]): Promise<void>
  getTranslationsInDefaultLanguage(terms: Term[]): Promise<{ term: string; translation: string }[]>
}
