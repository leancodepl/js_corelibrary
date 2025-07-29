import axios, { AxiosInstance } from "axios"
import { ExtractedMessages } from "../formatjs"
import {
  Configuration,
  ProjectsApi,
  ProjectsExportTypeEnum,
  TermsApi,
  TranslationsApi,
} from "../poeditor/api.generated"
import type { Term, TranslationsServiceClient } from "../TranslationsServiceClient"

export interface POEditorClientConfig {
  token: string
  projectId: number
}

export class POEditorClient implements TranslationsServiceClient {
  private token: string
  private projectId: number
  private axiosInstance: AxiosInstance
  private projectsApi: ProjectsApi
  private termsApi: TermsApi
  private translationsApi: TranslationsApi

  constructor(config: POEditorClientConfig) {
    this.token = config.token
    this.projectId = config.projectId

    this.axiosInstance = axios.create({
      baseURL: "https://api.poeditor.com/v2",
    })

    const apiConfig = new Configuration({
      apiKey: config.token,
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
        this.token,
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

      await this.termsApi.termsAdd(this.projectId, JSON.stringify(terms), this.token)
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

      await this.translationsApi.translationsAdd(this.projectId, language, JSON.stringify(translations), this.token)
    } catch (error) {
      throw new Error(`Failed to upload translations for ${language}: ${error}`)
    }
  }

  async downloadTerms(): Promise<Term[]> {
    try {
      const response = await this.termsApi.termsList(this.projectId, this.token)

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
}
