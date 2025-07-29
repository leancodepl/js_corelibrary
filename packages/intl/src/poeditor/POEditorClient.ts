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
  poeditorApiToken: string
  poeditorProjectId: number
}

export class POEditorClient implements TranslationsServiceClient {
  private poeditorApiToken: string
  private poeditorProjectId: number
  private axiosInstance: AxiosInstance
  private projectsApi: ProjectsApi
  private termsApi: TermsApi
  private translationsApi: TranslationsApi

  constructor(config: POEditorClientConfig) {
    this.poeditorApiToken = config.poeditorApiToken
    this.poeditorProjectId = config.poeditorProjectId

    this.axiosInstance = axios.create({
      baseURL: "https://api.poeditor.com/v2",
    })

    const apiConfig = new Configuration({
      apiKey: config.poeditorApiToken,
    })

    this.projectsApi = new ProjectsApi(apiConfig, undefined, this.axiosInstance)
    this.termsApi = new TermsApi(apiConfig, undefined, this.axiosInstance)
    this.translationsApi = new TranslationsApi(apiConfig, undefined, this.axiosInstance)
  }

  async downloadTranslations(language: string): Promise<Record<string, string>> {
    try {
      const response = await this.projectsApi.projectsExport(
        this.poeditorProjectId,
        language,
        ProjectsExportTypeEnum.KeyValueJson,
        this.poeditorApiToken,
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
      const terms = Object.entries(messages).map(([key, message]) => ({
        term: key,
        context: message.description || "",
        reference: message.file || "",
        plural: "",
      }))

      await this.termsApi.termsAdd(this.poeditorProjectId, JSON.stringify(terms), this.poeditorApiToken)
    } catch (error) {
      throw new Error(`Failed to upload terms: ${error}`)
    }
  }

  async uploadTranslations(messages: ExtractedMessages, language: string): Promise<void> {
    try {
      const translations = Object.entries(messages).map(([key, message]) => ({
        term: key,
        definition: message.defaultMessage,
      }))

      await this.translationsApi.translationsAdd(
        this.poeditorProjectId,
        language,
        JSON.stringify(translations),
        this.poeditorApiToken,
      )
    } catch (error) {
      throw new Error(`Failed to upload translations for ${language}: ${error}`)
    }
  }

  async downloadTerms(): Promise<Term[]> {
    try {
      const response = await this.termsApi.termsList(this.poeditorProjectId, this.poeditorApiToken)

      if (response.data.result?.terms) {
        return response.data.result.terms.map((term: any) => ({
          term: term.term || "",
          context: term.context || "",
          reference: term.reference || "",
          plural: term.plural || "",
        }))
      }

      return []
    } catch (error) {
      throw new Error(`Failed to get terms: ${error}`)
    }
  }
}
