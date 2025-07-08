import IntlMessageFormat from 'intl-messageformat';
import { OutputMode } from './configLoader';
import { Translations } from './translationLoader';

/**
 * Processes a template string by replacing {{t 'key'}} and {{t 'key', (params)}} translation calls
 * All other {{ }} templating (like Ory Kratos) remains completely untouched
 * @param template - The template string (MJML content)
 * @param translations - Translation object for the target language
 * @param locale - The locale for message formatting (defaults to 'en')
 * @param outputMode - The output mode ('kratos' or 'razor') to determine parameter format
 * @returns Processed template string with only translations replaced
 */

export function processTemplate(
  template: string,
  translations: Translations,
  locale = 'en',
  outputMode: OutputMode = 'kratos'
): string {
  // Regular expression to match {{t 'key'}} or {{t "key"}} patterns (without parameters)
  const simpleTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"]\s*\}\}/g;
  
  // Regular expression to match {{t 'key', (param1: "value1", param2: "value2")}} patterns
  const parameterizedTranslationRegex = /\{\{\s*t\s+['"]([^'"]+)['"],\s*\(([^)]+)\)\s*\}\}/g;
  
  // First, replace parameterized translation calls
  let processedTemplate = template.replace(parameterizedTranslationRegex, (match, key, paramString) => {
    const translationPattern = translations[key];
    if (!translationPattern) {
      return key; // Return key if translation not found
    }
    
    try {
      // Parse parameters from the string like "name: 'John', age: 30"
      const params = parseParameters(paramString, outputMode);
      
      // Use IntlMessageFormat for ICU message formatting
      const formatter = new IntlMessageFormat(translationPattern, locale);
      return formatter.format(params);
    } catch (error) {
      console.warn(`Error formatting message for key "${key}":`, error);
      return key; // Return key if formatting fails
    }
  });
  
  // Then, replace simple translation calls
  processedTemplate = processedTemplate.replace(simpleTranslationRegex, (match, key) => {
    // Return the translation if found, otherwise return the original key
    return translations[key] || key;
  });
  
  return processedTemplate;
}

/**
 * Parses parameter string like "name: 'John', age: 30" into an object
 * For Razor mode: handles "@Model.Name" format
 * For Kratos mode: handles "{{ .RecoveryCode }}" format
 * @param paramString - String containing parameters
 * @param outputMode - The output mode to determine parameter format
 * @returns Object with parsed parameters
 */
function parseParameters(paramString: string, outputMode: OutputMode): Record<string, any> {
  const params: Record<string, any> = {};
  
  // Split by comma and process each parameter
  const paramPairs = paramString.split(',').map(pair => pair.trim());
  
  for (const pair of paramPairs) {
    const colonIndex = pair.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = pair.substring(0, colonIndex).trim();
    const valueStr = pair.substring(colonIndex + 1).trim();
    
    // Parse the value - handle strings, numbers, booleans, and template expressions
    let value: any;
    
    // Handle quoted strings (both single and double quotes)
    if ((valueStr.startsWith('"') && valueStr.endsWith('"')) ||
        (valueStr.startsWith("'") && valueStr.endsWith("'"))) {
      const rawValue = valueStr.slice(1, -1);
      
      // For Razor mode, check if it's a template expression like "@Model.Name"
      if (outputMode === 'razor' && rawValue.startsWith('@')) {
        value = rawValue; // Keep as-is for Razor template processing
      }
      // For Kratos mode, check if it's a template expression like "{{ .RecoveryCode }}"
      else if (outputMode === 'kratos' && rawValue.includes('{{') && rawValue.includes('}}')) {
        value = rawValue; // Keep as-is for Kratos template processing
      } else {
        value = rawValue; // Regular string
      }
    } 
    // Handle boolean values
    else if (valueStr === 'true') {
      value = true;
    } else if (valueStr === 'false') {
      value = false;
    } 
    // Handle numeric values
    else if (!isNaN(Number(valueStr))) {
      value = Number(valueStr);
    } 
    // Handle template expressions without quotes
    else if (outputMode === 'razor' && valueStr.startsWith('@')) {
      value = valueStr; // Keep as-is for Razor template processing
    } else if (outputMode === 'kratos' && valueStr.includes('{{') && valueStr.includes('}}')) {
      value = valueStr; // Keep as-is for Kratos template processing
    } 
    // Default to string if parsing fails
    else {
      value = valueStr;
    }
    
    params[key] = value;
  }
  
  return params;
}

/**
 * Processes multiple templates with the same translations
 * @param templates - Object containing template names and their content
 * @param translations - Translation object for the target language
 * @param locale - The locale for message formatting (defaults to 'en')
 * @param outputMode - The output mode ('kratos' or 'razor') to determine parameter format
 * @returns Object containing processed templates
 */
export function processTemplates(
  templates: { [name: string]: string },
  translations: Translations,
  locale = 'en',
  outputMode: OutputMode = 'kratos'
): { [name: string]: string } {
  const processedTemplates: { [name: string]: string } = {};
  
  for (const [name, template] of Object.entries(templates)) {
    processedTemplates[name] = processTemplate(template, translations, locale, outputMode);
  }
  
  return processedTemplates;
} 