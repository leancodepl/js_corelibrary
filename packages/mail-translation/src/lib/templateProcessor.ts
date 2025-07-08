import { Translations } from './translationLoader';

/**
 * Processes a template string by replacing only {{t 'key'}} translation calls
 * All other {{ }} templating (like Ory Kratos) remains completely untouched
 * @param template - The template string (MJML content)
 * @param translations - Translation object for the target language
 * @returns Processed template string with only translations replaced
 */
export function processTemplate(
  template: string,
  translations: Translations
): string {
  // Regular expression to match {{t 'key'}} or {{t "key"}} patterns
  const translationRegex = /\{\{\s*t\s+['"]([^'"]+)['"]\s*\}\}/g;
  
  // Replace only translation helper calls
  return template.replace(translationRegex, (match, key) => {
    // Return the translation if found, otherwise return the original key
    return translations[key] || key;
  });
}

/**
 * Processes multiple templates with the same translations
 * @param templates - Object containing template names and their content
 * @param translations - Translation object for the target language
 * @returns Object containing processed templates
 */
export function processTemplates(
  templates: { [name: string]: string },
  translations: Translations
): { [name: string]: string } {
  const processedTemplates: { [name: string]: string } = {};
  
  for (const [name, template] of Object.entries(templates)) {
    processedTemplates[name] = processTemplate(template, translations);
  }
  
  return processedTemplates;
} 