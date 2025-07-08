import * as path from 'path';
import { getDefaultConfig, mergeWithDefaults, validateConfig } from '../src/lib/configLoader';
import { MailTranslator } from '../src/lib/mailTranslator';
import { compileMjml } from '../src/lib/mjmlCompiler';
import { processTemplate } from '../src/lib/templateProcessor';
import { loadTranslations } from '../src/lib/translationLoader';

describe('Mail Translation', () => {
  const testTranslationsPath = path.join(__dirname, 'translations');
  const testMailsPath = path.join(__dirname, 'mails');

  describe('loadTranslations', () => {
    it('should load translation files', async () => {
      const translations = await loadTranslations(testTranslationsPath);
      
      expect(translations).toBeDefined();
      expect(translations.en).toBeDefined();
      expect(translations.pl).toBeDefined();
      expect(translations.en.email_verification_title).toBe('Email Verification');
      expect(translations.pl.email_verification_title).toBe('Weryfikacja Email');
    });
  });

  describe('processTemplate', () => {
    it('should replace translation keys with translations', () => {
      const template = '<mj-text>{{t "email_verification_title"}}</mj-text>';
      const translations = {
        email_verification_title: 'Test Title'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('Test Title');
      expect(result).not.toContain('{{t "email_verification_title"}}');
    });

    it('should handle single quotes in translation keys', () => {
      const template = "<mj-text>{{t 'welcome_message'}}</mj-text>";
      const translations = {
        welcome_message: 'Welcome!'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('Welcome!');
      expect(result).not.toContain("{{t 'welcome_message'}}");
    });

    it('should preserve all other templating (Ory Kratos)', () => {
      const template = `
        <mj-text>{{t "welcome"}}</mj-text>
        <mj-button href="{{ .VerificationURL }}">Click</mj-button>
        <mj-text>{{ .VerificationCode }}</mj-text>
        <mj-text>{{ .Identity.traits.email }}</mj-text>
        <mj-raw>{{- if .Condition -}}content{{- end -}}</mj-raw>
      `;
      const translations = {
        welcome: 'Hello!'
      };
      
      const result = processTemplate(template, translations);
      
      // Translation should be processed
      expect(result).toContain('Hello!');
      expect(result).not.toContain('{{t "welcome"}}');
      
      // All Kratos templating should remain unchanged
      expect(result).toContain('{{ .VerificationURL }}');
      expect(result).toContain('{{ .VerificationCode }}');
      expect(result).toContain('{{ .Identity.traits.email }}');
      expect(result).toContain('{{- if .Condition -}}content{{- end -}}');
    });

    it('should handle missing translations gracefully', () => {
      const template = '<mj-text>{{t "missing_key"}}</mj-text>';
      const translations = {};
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('missing_key'); // Should fallback to key name
    });

    it('should handle whitespace in translation calls', () => {
      const template = '<mj-text>{{ t  "spaced_key"  }}</mj-text>';
      const translations = {
        spaced_key: 'Spaced Value'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('Spaced Value');
      expect(result).not.toContain('{{ t  "spaced_key"  }}');
    });
  });

  describe('compileMjml', () => {
    it('should compile MJML to HTML', () => {
      const mjml = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello World</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `;
      
      const result = compileMjml(mjml);
      
      expect(result.html).toBeDefined();
      expect(result.html).toContain('Hello World');
      expect(result.html).toContain('<!doctype html>');
    });
  });

  describe('Configuration', () => {
    describe('getDefaultConfig', () => {
      it('should return default configuration', () => {
        const config = getDefaultConfig();
        
        expect(config.translationsPath).toBe('./translations');
        expect(config.mailsPath).toBe('./mails');
        expect(config.outputPath).toBe('./output');
        expect(config.outputMode).toBe('kratos');
        expect(config.defaultLanguage).toBe('en');
        expect(config.verbose).toBe(false);
        expect(config.mjmlOptions?.validationLevel).toBe('soft');
      });
    });

    describe('validateConfig', () => {
      it('should validate valid configuration', () => {
        const config = {
          translationsPath: './translations',
          mailsPath: './mails',
        };
        
        expect(() => validateConfig(config)).not.toThrow();
      });

      it('should throw error for missing translationsPath', () => {
        const config = {
          mailsPath: './mails',
        } as any;
        
        expect(() => validateConfig(config)).toThrow('Configuration must specify translationsPath');
      });

      it('should throw error for missing mailsPath', () => {
        const config = {
          translationsPath: './translations',
        } as any;
        
        expect(() => validateConfig(config)).toThrow('Configuration must specify mailsPath');
      });

      it('should throw error for invalid validation level', () => {
        const config = {
          translationsPath: './translations',
          mailsPath: './mails',
          mjmlOptions: {
            validationLevel: 'invalid' as any
          }
        };
        
        expect(() => validateConfig(config)).toThrow('Invalid validationLevel');
      });
    });

    describe('mergeWithDefaults', () => {
      it('should merge configuration with defaults', () => {
        const config = {
          translationsPath: './custom-translations',
          mjmlOptions: {
            beautify: true
          }
        };
        
        const merged = mergeWithDefaults(config);
        
        expect(merged.translationsPath).toBe('./custom-translations');
        expect(merged.mailsPath).toBe('./mails'); // from defaults
        expect(merged.mjmlOptions?.beautify).toBe(true);
        expect(merged.mjmlOptions?.validationLevel).toBe('soft'); // from defaults
      });
    });
  });

  describe('MailTranslator', () => {
    let translator: MailTranslator;

    beforeEach(() => {
      translator = new MailTranslator({
        translationsPath: testTranslationsPath,
        mailsPath: testMailsPath
      });
    });

    it('should initialize and load translations', async () => {
      await translator.initialize();
      
      const languages = translator.getAvailableLanguages();
      expect(languages).toContain('en');
      expect(languages).toContain('pl');
    });

    it('should translate a template', async () => {
      await translator.initialize();
      
      const templates = await translator.loadTemplates();
      const templateName = 'email_verification_code';
      
      if (templates[templateName]) {
        const result = translator.translateTemplate(
          templateName,
          templates[templateName],
          'en'
        );
        
        expect(result.name).toBe(templateName);
        expect(result.language).toBe('en');
        expect(result.html).toBeDefined();
        expect(result.html).toContain('Email Verification');
        expect(result.html).toContain('.RecoveryCode');
      }
    });
  });
}); 