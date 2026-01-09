import axios from "axios"
import type { Term, TranslationsServiceClient } from "../TranslationsServiceClient"
import { ExtractedMessages } from "../formatjs"
import { Configuration, LanguagesApi, ProjectsApi, ProjectsExportTypeEnum, TermsApi, TranslationsApi } from "./api.generated"
import type { Term, TranslationsServiceClient } from "../TranslationsServiceClient"

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

  async downloadTranslations(language: string): Promise<Record<string, string>> {
    try {
      const response = await this.projectsApi.projectsExport(
        this.projectId,
        language,
        ProjectsExportTypeEnum.KeyValueJson,
        this.apiToken,
      )

      if (response.data.result?.url) {
        const translationsResponse = await this.axiosInstance.get(response.data.result.url)
        return translationsResponse.data || {}
      }

      throw new Error("No download URL received from POEditor")
    } catch (error) {
      throw new Error(`Failed to download translations for ${language}: ${error}`)
    }
  }

  async uploadTerms(messages: ExtractedMessages): Promise<void> {
    try {
      const terms: Term[] = Object.entries(messages).map(([key, details]) => ({
        term: key,
        context: details.description,
        reference: details.file,
        comment: `Default: ${details.defaultMessage}`,
      }))

      await this.termsApi.termsAdd(this.projectId, JSON.stringify(terms), this.apiToken)
    } catch (error) {
      throw new Error(`Failed to upload terms: ${error}`)
    }
  }

  async uploadTranslations(messages: ExtractedMessages, language: string): Promise<void> {
    try {
      const translations = Object.entries(messages).map(([term, details]) => ({
        term,
        translation: {
          content: details.defaultMessage,
          fuzzy: 0,
        },
      }))

      await this.translationsApi.translationsAdd(this.projectId, language, JSON.stringify(translations), this.apiToken)
    } catch (error) {
      throw new Error(`Failed to upload translations for ${language}: ${error}`)
    }
  }

  async downloadTerms(): Promise<Term[]> {
    try {
      const response = await this.termsApi.termsList(this.projectId, this.apiToken)

      if (response.data.result?.terms) {
        return response.data.result.terms.map(term => ({
          term: term.term || "",
          context: term.context || "",
          reference: term.reference || "",
          comment: term.comment || "",
        }))
      }

      return []
    } catch (error) {
      throw new Error(`Failed to get terms: ${error}`)
    }
  }

  async removeTerms(terms: Pick<Term, "context" | "term">[]): Promise<void> {
    try {
      await this.termsApi.termsDelete(this.projectId, JSON.stringify(terms), this.apiToken)
    } catch (error) {
      throw new Error(`Failed to remove terms: ${error}`)
    }
  }

  async getTranslationsInDefaultLanguage(terms: Term[]): Promise<{ term: string; translation: string }[]> {
    try {
      let referenceLanguage: string | undefined
      const response = await this.projectsApi.projectsView(this.projectId, this.apiToken)
      if (response.data.result?.project) {
        referenceLanguage = response.data.result.project.reference_language
      }

      if (!referenceLanguage) {
        throw new Error("No reference language found")
      }

      const translations = await this.downloadTranslations(referenceLanguage)
      return terms.map(term => ({
        term: term.term,
        translation: translations[term.term] || "",
      }))
    } catch (error) {
      throw new Error(`Failed to get translations in default language: ${error}`)
    }
  }
}
