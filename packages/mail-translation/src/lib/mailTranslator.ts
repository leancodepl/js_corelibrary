import * as fs from 'fs-extra';
import * as path from 'path';
import { OutputMode } from './configLoader';
import { compileMjml, MjmlCompileOptions } from './mjmlCompiler';
import { createOutputProcessor } from './outputProcessors';
import { processTemplate } from './templateProcessor';
import { getTranslationsForLanguage, loadTranslations, TranslationData } from './translationLoader';

export interface MailTranslatorOptions {
  translationsPath: string;
  mailsPath: string;
  outputPath?: string;
  outputMode?: OutputMode;
  defaultLanguage?: string;
  mjmlOptions?: MjmlCompileOptions;
}

export interface TranslatedMail {
  name: string;
  language: string;
  mjml: string;
  html: string;
  errors: Array<{
    line: number;
    message: string;
    tagName: string;
  }>;
}

export class MailTranslator {
  private translationData: TranslationData = {};
  private options: MailTranslatorOptions;

  constructor(options: MailTranslatorOptions) {
    this.options = {
      outputMode: 'kratos',
      defaultLanguage: 'en',
      ...options
    };
  }

  /**
   * Initialize the translator by loading all translations
   */
  async initialize(): Promise<void> {
    this.translationData = await loadTranslations(this.options.translationsPath);
  }

  /**
   * Load all MJML templates from the mails directory
   */
  async loadTemplates(): Promise<{ [name: string]: string }> {
    const templates: { [name: string]: string } = {};
    
    try {
      const exists = await fs.pathExists(this.options.mailsPath);
      if (!exists) {
        throw new Error(`Mails directory not found: ${this.options.mailsPath}`);
      }

      const files = await fs.readdir(this.options.mailsPath);
      const mjmlFiles = files.filter(file => path.extname(file) === '.mjml');

      for (const file of mjmlFiles) {
        const templateName = path.basename(file, '.mjml');
        const filePath = path.join(this.options.mailsPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        templates[templateName] = content;
      }

      return templates;
    } catch (error) {
      throw new Error(`Failed to load templates: ${error}`);
    }
  }

  /**
   * Translate a single template for a specific language
   */
  translateTemplate(
    templateName: string,
    templateContent: string,
    language: string
  ): TranslatedMail {
    const translations = getTranslationsForLanguage(this.translationData, language);
    const outputMode = this.options.outputMode || 'kratos';
    const processedMjml = processTemplate(templateContent, translations, language, outputMode);
    const compileResult = compileMjml(processedMjml, this.options.mjmlOptions);

    return {
      name: templateName,
      language,
      mjml: processedMjml,
      html: compileResult.html,
      errors: compileResult.errors
    };
  }

  /**
   * Translate all templates for a specific language
   */
  async translateAllTemplates(
    language: string
  ): Promise<TranslatedMail[]> {
    const templates = await this.loadTemplates();
    const translatedMails: TranslatedMail[] = [];

    for (const [templateName, templateContent] of Object.entries(templates)) {
      const translatedMail = this.translateTemplate(
        templateName,
        templateContent,
        language
      );
      translatedMails.push(translatedMail);
    }

    return translatedMails;
  }

  /**
   * Translate all templates for all available languages
   */
  async translateAllTemplatesAllLanguages(): Promise<{ [language: string]: TranslatedMail[] }> {
    const templates = await this.loadTemplates();
    const result: { [language: string]: TranslatedMail[] } = {};

    for (const language of Object.keys(this.translationData)) {
      result[language] = [];
      
      for (const [templateName, templateContent] of Object.entries(templates)) {
        const translatedMail = this.translateTemplate(
          templateName,
          templateContent,
          language
        );
        result[language].push(translatedMail);
      }
    }

    return result;
  }

  /**
   * Save translated mails using the configured output processor
   */
  async saveTranslatedMails(
    translatedMails: { [language: string]: TranslatedMail[] }
  ): Promise<void> {
    if (!this.options.outputPath) {
      throw new Error('Output path not specified');
    }

    const outputMode = this.options.outputMode || 'kratos';
    const defaultLanguage = this.options.defaultLanguage || 'en';
    
    const processor = createOutputProcessor(outputMode);
    await processor.process(translatedMails, this.options.outputPath, defaultLanguage);

    // Log errors if any
    for (const [language, mails] of Object.entries(translatedMails)) {
      for (const mail of mails) {
        if (mail.errors.length > 0) {
          console.warn(`Errors in ${mail.name} (${language}):`, mail.errors);
        }
      }
    }
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): string[] {
    return Object.keys(this.translationData);
  }
} 