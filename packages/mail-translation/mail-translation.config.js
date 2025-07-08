/**
 * Example configuration file for @leancodepl/mail-translation
 *
 * Copy this file to one of the following locations:
 * - .mailtranslationrc.js
 * - mail-translation.config.js
 * - .mailtranslationrc.json (convert to JSON format)
 * - package.json (under "@leancodepl/mail-translation" key)
 */

module.exports = {
    // Path to the directory containing translation JSON files
    translationsPath: "./__tests__/translations",

    // Path to the directory containing MJML template files
    mailsPath: "./__tests__/mails",

    // Path where translated files will be saved
    outputPath: "./__tests__/output",

    // Output mode: 'kratos' or 'razor'
    // - 'kratos': Single .gotmpl file with all languages for Ory Kratos
    // - 'razor': .cshtml files with language-specific naming for ASP.NET
    outputMode: "razor",

    // Default language to use as fallback and for naming conventions
    defaultLanguage: "en",

    // Specific languages to process (optional)
    // If not specified, all available languages will be processed
    languages: ["en", "pl"],

    // CLI-specific options
    verbose: false,
    watch: false,

    // MJML compilation options
    mjmlOptions: {
        // Beautify the HTML output
        beautify: false,

        // Minify the HTML output
        minify: false,

        // MJML validation level
        // 'strict' - Strict validation, fails on any error
        // 'soft' - Soft validation, shows warnings but continues
        // 'skip' - Skip validation entirely
        validationLevel: "soft",

        // Keep HTML comments in output
        keepComments: false,
    },
}

// Alternative JSON format (.mailtranslationrc.json):
/*
{
  "translationsPath": "./translations",
  "mailsPath": "./mails",
  "outputPath": "./output",
  "outputMode": "kratos",
  "defaultLanguage": "en",
  "languages": ["en", "pl", "fr"],
  "verbose": false,
  "watch": false,
  "mjmlOptions": {
    "beautify": false,
    "minify": false,
    "validationLevel": "soft",
    "keepComments": false
  }
}
*/

// Alternative package.json format:
/*
{
  "name": "your-project",
  "version": "1.0.0",
  "@leancodepl/mail-translation": {
    "translationsPath": "./translations",
    "mailsPath": "./mails",
    "outputPath": "./output",
    "outputMode": "kratos",
    "defaultLanguage": "en",
    "mjmlOptions": {
      "beautify": true,
      "validationLevel": "soft"
    }
  }
}
*/

// Examples for different output modes:

// Kratos mode configuration:
/*
module.exports = {
  translationsPath: './translations',
  mailsPath: './mails',
  outputPath: './kratos-templates',
  outputMode: 'kratos',
  defaultLanguage: 'en',
  languages: ['en', 'fr', 'de'],
};
// Results in: email_verification_code.gotmpl with all languages
*/

// Razor mode configuration:
/*
module.exports = {
  translationsPath: './translations',
  mailsPath: './mails',
  outputPath: './Views/Email',
  outputMode: 'razor',
  defaultLanguage: 'en',
  languages: ['en', 'de', 'fr'],
};
// Results in: 
// - email_verification_code.cshtml (default language)
// - email_verification_code.de.cshtml
// - email_verification_code.fr.cshtml
*/

// For testing with the provided examples:
/*
module.exports = {
  translationsPath: './__tests__/translations',
  mailsPath: './__tests__/mails',
  outputPath: './output',
  outputMode: 'kratos',
  defaultLanguage: 'en',
};
*/
