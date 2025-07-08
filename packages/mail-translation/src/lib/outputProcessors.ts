import * as fs from 'fs-extra';
import * as path from 'path';
import { OutputMode } from './configLoader';
import { TranslatedMail } from './mailTranslator';

export interface OutputProcessor {
  process(
    translatedMails: { [language: string]: TranslatedMail[] },
    outputPath: string,
    defaultLanguage: string
  ): Promise<void>;
}

/**
 * Razor Output Processor - saves .cshtml files with language-specific naming
 */
export class RazorOutputProcessor implements OutputProcessor {
  async process(
    translatedMails: { [language: string]: TranslatedMail[] },
    outputPath: string,
    defaultLanguage: string
  ): Promise<void> {
    await fs.ensureDir(outputPath);

    // Group mails by template name
    const mailsByTemplate: { [templateName: string]: { [language: string]: TranslatedMail } } = {};
    
    for (const [language, mails] of Object.entries(translatedMails)) {
      for (const mail of mails) {
        if (!mailsByTemplate[mail.name]) {
          mailsByTemplate[mail.name] = {};
        }
        mailsByTemplate[mail.name][language] = mail;
      }
    }

    // Save each template
    for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
      // Save default language file without language suffix
      if (languageMails[defaultLanguage]) {
        const defaultPath = path.join(outputPath, `${templateName}.cshtml`);
        await fs.writeFile(defaultPath, languageMails[defaultLanguage].html, 'utf8');
      }

      // Save other languages with language suffix
      for (const [language, mail] of Object.entries(languageMails)) {
        if (language !== defaultLanguage) {
          const languagePath = path.join(outputPath, `${templateName}.${language}.cshtml`);
          await fs.writeFile(languagePath, mail.html, 'utf8');
        }
      }
    }
  }
}

/**
 * Kratos Output Processor - saves single .gotmpl file with all languages
 */
export class KratosOutputProcessor implements OutputProcessor {
  async process(
    translatedMails: { [language: string]: TranslatedMail[] },
    outputPath: string,
    defaultLanguage: string
  ): Promise<void> {
    await fs.ensureDir(outputPath);

    // Group mails by template name
    const mailsByTemplate: { [templateName: string]: { [language: string]: TranslatedMail } } = {};
    
    for (const [language, mails] of Object.entries(translatedMails)) {
      for (const mail of mails) {
        if (!mailsByTemplate[mail.name]) {
          mailsByTemplate[mail.name] = {};
        }
        mailsByTemplate[mail.name][language] = mail;
      }
    }

    // Generate Kratos template for each mail template
    for (const [templateName, languageMails] of Object.entries(mailsByTemplate)) {
      const kratosTemplate = this.generateKratosTemplate(languageMails, defaultLanguage);
      const kratosPath = path.join(outputPath, `${templateName}.gotmpl`);
      await fs.writeFile(kratosPath, kratosTemplate, 'utf8');
    }
  }

  private generateKratosTemplate(
    languageMails: { [language: string]: TranslatedMail },
    defaultLanguage: string
  ): string {
    const languages = Object.keys(languageMails);
    let template = '';

    // Generate template definitions for each language
    for (const language of languages) {
      const mail = languageMails[language];
      template += `{{define "${language}"}}\n`;
      template += mail.html;
      template += '\n{{end}}\n\n';
    }

    // Generate conditional logic for language selection
    template += '{{- if eq .Identity.traits.lang "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" -}}\n';
    template += '{{ template "' + languages.filter(lang => lang !== defaultLanguage)[0] + '" . }}\n';
    
    // Add conditions for other non-default languages
    for (const language of languages.filter(lang => lang !== defaultLanguage).slice(1)) {
      template += '{{- else if eq .Identity.traits.lang "' + language + '" -}}\n';
      template += '{{ template "' + language + '" . }}\n';
    }
    
    // Default fallback
    template += '{{- else -}}\n';
    template += '{{ template "' + defaultLanguage + '" . }}\n';
    template += '{{- end -}}\n';

    return template;
  }
}

/**
 * Factory function to create the appropriate output processor
 */
export function createOutputProcessor(mode: OutputMode): OutputProcessor {
  switch (mode) {
    case 'razor':
      return new RazorOutputProcessor();
    case 'kratos':
      return new KratosOutputProcessor();
    default:
      throw new Error(`Unsupported output mode: ${mode}`);
  }
} 