import axios from "axios"
import { errAsync, okAsync, ResultAsync } from "neverthrow"
import type { Term, TranslationsServiceClient } from "../TranslationsServiceClient"
import { ExtractedMessages } from "../formatjs"
import {
  Configuration,
  ProjectsApi,
  ProjectsExportTypeEnum,
  TermsApi,
  TranslationsApi,
} from "./api.generated"
import {
  DownloadTermsError,
  DownloadTranslationsError,
  GetTranslationsInDefaultLanguageError,
  RemoveTermsError,
  UploadTermsError,
  UploadTranslationsError,
} from "./POEditorError"

export interface POEditorClientConfig {
  apiToken: string
  projectId: number
}

export class POEditorClient implements TranslationsServiceClient {
  private apiToken
  private projectId
  private axiosInstance
  private projectsApi
  private termsApi
  private translationsApi

  constructor(config: POEditorClientConfig) {
    this.apiToken = config.apiToken
    this.projectId = config.projectId

    this.axiosInstance = axios.create({
      baseURL: "https://api.poeditor.com/v2",
    })

    const apiConfig = new Configuration({
      apiKey: config.apiToken,
    })

    this.projectsApi = new ProjectsApi(apiConfig, undefined, this.axiosInstance)
    this.termsApi = new TermsApi(apiConfig, undefined, this.axiosInstance)
    this.translationsApi = new TranslationsApi(apiConfig, undefined, this.axiosInstance)
  }

  downloadTranslations(language: string): ResultAsync<Record<string, string>, DownloadTranslationsError> {
    return ResultAsync.fromPromise(
      this.projectsApi.projectsExport(
        this.projectId,
        language,
        ProjectsExportTypeEnum.KeyValueJson,
        this.apiToken,
      ),
      (cause): DownloadTranslationsError => ({ kind: "downloadTranslationsFailed", language, cause }),
    ).andThen(response => {
      const url = response.data.result?.url
      if (!url) {
        return errAsync<Record<string, string>, DownloadTranslationsError>({ kind: "noDownloadUrl", language })
      }
      return ResultAsync.fromPromise(
        this.axiosInstance.get<Record<string, string>>(url),
        (cause): DownloadTranslationsError => ({ kind: "downloadTranslationsContentFailed", language, url, cause }),
      ).map(translationsResponse => translationsResponse.data || {})
    })
  }

  uploadTerms(messages: ExtractedMessages): ResultAsync<void, UploadTermsError> {
    const terms: Term[] = Object.entries(messages).map(([key, details]) => ({
      term: key,
      context: details.description,
      reference: details.file,
      comment: `Default: ${details.defaultMessage}`,
    }))

    return ResultAsync.fromPromise(
      this.termsApi.termsAdd(this.projectId, JSON.stringify(terms), this.apiToken),
      (cause): UploadTermsError => ({ kind: "uploadTermsFailed", cause }),
    ).map(() => {})
  }

  uploadTranslations(messages: ExtractedMessages, language: string): ResultAsync<void, UploadTranslationsError> {
    const translations = Object.entries(messages).map(([term, details]) => ({
      term,
      translation: {
        content: details.defaultMessage,
        fuzzy: 0,
      },
    }))

    return ResultAsync.fromPromise(
      this.translationsApi.translationsAdd(this.projectId, language, JSON.stringify(translations), this.apiToken),
      (cause): UploadTranslationsError => ({ kind: "uploadTranslationsFailed", language, cause }),
    ).map(() => {})
  }

  downloadTerms(): ResultAsync<Term[], DownloadTermsError> {
    return ResultAsync.fromPromise(
      this.termsApi.termsList(this.projectId, this.apiToken),
      (cause): DownloadTermsError => ({ kind: "downloadTermsFailed", cause }),
    ).map(response =>
      (response.data.result?.terms ?? []).map(term => ({
        term: term.term || "",
        context: term.context || "",
        reference: term.reference || "",
        comment: term.comment || "",
      })),
    )
  }

  removeTerms(terms: Pick<Term, "context" | "term">[]): ResultAsync<void, RemoveTermsError> {
    return ResultAsync.fromPromise(
      this.termsApi.termsDelete(this.projectId, JSON.stringify(terms), this.apiToken),
      (cause): RemoveTermsError => ({ kind: "removeTermsFailed", cause }),
    ).map(() => {})
  }

  getTranslationsInDefaultLanguage(
    terms: Term[],
  ): ResultAsync<{ term: string; translation: string }[], GetTranslationsInDefaultLanguageError> {
    return ResultAsync.fromPromise(
      this.projectsApi.projectsView(this.projectId, this.apiToken),
      (cause): GetTranslationsInDefaultLanguageError => ({ kind: "viewProjectFailed", cause }),
    ).andThen(response => {
      const referenceLanguage = response.data.result?.project?.reference_language
      if (!referenceLanguage) {
        return errAsync<{ term: string; translation: string }[], GetTranslationsInDefaultLanguageError>({
          kind: "noReferenceLanguage",
        })
      }
      return this.downloadTranslations(referenceLanguage).andThen(translations =>
        okAsync(
          terms.map(term => ({
            term: term.term,
            translation: translations[term.term] || "",
          })),
        ),
      )
    })
  }
}
