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

    it('should handle parameterized translations with simple parameters', () => {
      const template = '<mj-text>{{t "welcome_user", (name: "John")}}</mj-text>';
      const translations = {
        welcome_user: 'Welcome {name}!'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('Welcome John!');
      expect(result).not.toContain('{{t "welcome_user"');
    });

    it('should handle parameterized translations with Kratos template expressions', () => {
      const template = '<mj-text>{{t "recovery_code_message", (code: "{{ .RecoveryCode }}")}}</mj-text>';
      const translations = {
        recovery_code_message: 'Your recovery code is: {code}'
      };
      
      const result = processTemplate(template, translations, 'en', 'kratos');
      
      expect(result).toContain('Your recovery code is: {{ .RecoveryCode }}');
      expect(result).not.toContain('{{t "recovery_code_message"');
    });

    it('should handle parameterized translations with Razor template expressions', () => {
      const template = '<mj-text>{{t "greeting_with_name", (name: "@Model.UserName")}}</mj-text>';
      const translations = {
        greeting_with_name: 'Hello {name}, welcome to our platform!'
      };
      
      const result = processTemplate(template, translations, 'en', 'razor');
      
      expect(result).toContain('Hello @Model.UserName, welcome to our platform!');
      expect(result).not.toContain('{{t "greeting_with_name"');
    });

    it('should handle parameterized translations with multiple parameters', () => {
      const template = '<mj-text>{{t "multi_param", (name: "John", age: 25, active: true)}}</mj-text>';
      const translations = {
        multi_param: 'User {name} is {age} years old and is {active, select, true {active} false {inactive} other {unknown}}'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('User John is 25 years old and is active');
    });

    it('should handle ICU plural formatting', () => {
      const template = '<mj-text>{{t "photo_count", (count: 5)}}</mj-text>';
      const translations = {
        photo_count: 'You have {count, plural, =0 {no photos} =1 {one photo} other {# photos}}.'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('You have 5 photos.');
    });

    it('should handle parameterized translations with missing translation key', () => {
      const template = '<mj-text>{{t "missing_key", (name: "John")}}</mj-text>';
      const translations = {};
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('missing_key'); // Should fallback to key name
    });

    it('should handle parameterized translations with malformed parameters', () => {
      const template = '<mj-text>{{t "welcome_user", (invalid_param_format)}}</mj-text>';
      const translations = {
        welcome_user: 'Welcome {name}!'
      };
      
      const result = processTemplate(template, translations);
      
      // Should fallback to key name when parameter parsing fails
      expect(result).toContain('welcome_user');
    });

    it('should handle mixed simple and parameterized translations', () => {
      const template = `
        <mj-text>{{t "email_verification_title"}}</mj-text>
        <mj-text>{{t "greeting_with_name", (name: "John")}}</mj-text>
        <mj-text>{{t "email_verification_footer"}}</mj-text>
      `;
      const translations = {
        email_verification_title: 'Email Verification',
        greeting_with_name: 'Hello {name}, welcome!',
        email_verification_footer: 'Thank you.'
      };
      
      const result = processTemplate(template, translations);
      
      expect(result).toContain('Email Verification');
      expect(result).toContain('Hello John, welcome!');
      expect(result).toContain('Thank you.');
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