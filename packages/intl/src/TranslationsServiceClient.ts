import { ResultAsync } from "neverthrow"
import type { ExtractedMessages } from "./formatjs"
import type {
  DownloadTermsError,
  DownloadTranslationsError,
  GetTranslationsInDefaultLanguageError,
  RemoveTermsError,
  UploadTermsError,
  UploadTranslationsError,
} from "./poeditor/POEditorError"

export interface Term {
  term: string
  context?: string
  reference?: string
  comment?: string
}

type TermToRemove = Pick<Term, "context" | "term">

export interface TranslationsServiceClient {
  downloadTranslations(language: string): ResultAsync<Record<string, string>, DownloadTranslationsError>
  uploadTerms(messages: ExtractedMessages): ResultAsync<void, UploadTermsError>
  uploadTranslations(messages: ExtractedMessages, language: string): ResultAsync<void, UploadTranslationsError>
  downloadTerms(): ResultAsync<Term[], DownloadTermsError>
  removeTerms(terms: TermToRemove[]): ResultAsync<void, RemoveTermsError>
  getTranslationsInDefaultLanguage(
    terms: Term[],
  ): ResultAsync<{ term: string; translation: string }[], GetTranslationsInDefaultLanguageError>
}
