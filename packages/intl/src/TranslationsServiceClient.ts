import type { ExtractedMessages } from "./formatjs"

export interface Term {
  term: string
  context?: string
  reference?: string
  plural?: string
}

export interface TranslationsServiceClient {
  downloadTranslations(language: string): Promise<Record<string, string>>
  uploadTerms(messages: ExtractedMessages): Promise<void>
  uploadTranslations(messages: ExtractedMessages, language: string): Promise<void>
  downloadTerms(): Promise<Term[]>
}
