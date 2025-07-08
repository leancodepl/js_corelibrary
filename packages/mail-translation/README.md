# Mail Translation Tool

A Node.js command-line tool for translating MJML email templates using Handlebars and multiple language support.

## Features

- 🌐 Load translations from JSON files in a `/translations` folder
- 📧 Process MJML templates with Handlebars for dynamic content
- 🔄 Replace translation keys with localized text
- 🏗️ Compile MJML templates to HTML
- 🗣️ Support for multiple languages
- 📁 Multiple output modes: Kratos and Razor
- ⚙️ Flexible configuration with lilconfig
- 🖥️ Command-line interface with rich options

## Output Modes

The tool supports two different output modes to fit various use cases:

### 🔐 **Kratos Mode** (Default)
Generates single `.gotmpl` files with all languages for Ory Kratos integration. Each template contains language-specific definitions and conditional logic based on `{{ .Identity.traits.lang }}`.

```bash
npx mail-translation --output-mode kratos --default-language en
```

**Output structure:**
```
output/
└── email_verification_code.gotmpl
```

**Example Kratos template:**
```go
{{define "en"}}
Hi,

Please enter the following code to recover your account:

{{ .RecoveryCode }}
{{end}}

{{define "fr"}}
Bonjour,

Veuillez entrer le code suivant pour récupérer votre compte:

{{ .RecoveryCode }}
{{end}}

{{- if eq .Identity.traits.lang "fr" -}}
{{ template "fr" . }}
{{- else -}}
{{ template "en" . }}
{{- end -}}
```

### 🔷 **Razor Mode**
Generates `.cshtml` files for ASP.NET applications with language-specific naming conventions.

```bash
npx mail-translation --output-mode razor --default-language en
```

**Output structure:**
```
output/
├── email_verification_code.cshtml        (default language)
├── email_verification_code.pl.cshtml     (Polish)
└── email_verification_code.fr.cshtml     (French)
```

## Installation

Install the required dependencies:

```bash
npm install mjml handlebars fs-extra lilconfig commander
npm install --save-dev @types/fs-extra @types/mjml
```

## Usage

### Command Line Interface

The tool provides a command-line interface for easy usage:

```bash
# Translate all templates for all languages (Kratos mode)
npx mail-translation translate

# Or simply (translate is the default command)
npx mail-translation

# Translate specific language
npx mail-translation translate --language en

# Translate multiple languages
npx mail-translation translate --languages en,pl,fr

# Use Kratos output mode (default)
npx mail-translation translate --output-mode kratos --default-language en

# Use Razor output mode  
npx mail-translation translate --output-mode razor --default-language en

# Use custom paths
npx mail-translation translate \
  --translations-path ./my-translations \
  --mails-path ./my-mails \
  --output-path ./my-output \
  --output-mode kratos

# Use configuration file
npx mail-translation translate --config ./my-config.json

# Enable verbose output
npx mail-translation translate --verbose

# Beautify HTML output
npx mail-translation translate --beautify

# Show help
npx mail-translation --help
```

### Configuration

The tool supports multiple configuration formats using lilconfig. Copy the example configuration file and customize it for your needs:

```bash
# Copy the example configuration file
cp node_modules/@leancodepl/mail-translation/mail-translation.config.example.js .mailtranslationrc.js
```

**Supported configuration file locations:**
- `package.json` (under `@leancodepl/mail-translation` key)
- `.mailtranslationrc`
- `.mailtranslationrc.json`
- `.mailtranslationrc.js`
- `mail-translation.config.js`

**Example configuration** (`.mailtranslationrc.json`):

```json
{
  "translationsPath": "./translations",
  "mailsPath": "./mails",
  "outputPath": "./output",
  "outputMode": "kratos",
  "defaultLanguage": "en",
  "languages": ["en", "pl", "fr"],
  "mjmlOptions": {
    "beautify": true,
    "validationLevel": "soft",
    "keepComments": false
  }
}
```

**Example JavaScript configuration** (`mail-translation.config.js`):

```javascript
module.exports = {
  translationsPath: './translations',
  mailsPath: './mails',
  outputPath: './output',
  outputMode: 'kratos',
  defaultLanguage: 'en',
  mjmlOptions: {
    beautify: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    validationLevel: 'soft',
  },
};
```

**Example package.json configuration:**

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "@leancodepl/mail-translation": {
    "translationsPath": "./translations",
    "mailsPath": "./mails",
    "outputPath": "./output",
    "outputMode": "razor",
    "defaultLanguage": "en",
    "mjmlOptions": {
      "beautify": true,
      "validationLevel": "soft"
    }
  }
}
```

### Programmatic Usage

You can also use the tool programmatically:

```typescript
import { MailTranslator } from '@leancodepl/mail-translation';

const translator = new MailTranslator({
  translationsPath: './src/translations',
  mailsPath: './src/mails',
  outputPath: './output',
  mjmlOptions: {
    beautify: true,
    validationLevel: 'soft'
  }
});

// Initialize and translate all templates
await translator.initialize();
const translatedMails = await translator.translateAllTemplatesAllLanguages({
  VerificationURL: 'https://example.com/verify',
  VerificationCode: '123456',
  storage: 'https://cdn.example.com'
});

// Save translated mails
await translator.saveTranslatedMails(translatedMails);
```

### Directory Structure

```
your-project/
├── src/
│   ├── translations/
│   │   ├── en.json
│   │   ├── pl.json
│   │   └── ...
│   └── mails/
│       ├── email_verification_code.mjml
│       └── ...
└── output/
    ├── en/
    │   └── email_verification_code.html
    └── pl/
        └── email_verification_code.html
```

### Translation Files

Translation files should be JSON files with key-value pairs:

```json
// en.json
{
  "email_verification_code_title": "One more step...",
  "email_verification_code_description": "Click the button below to confirm your email and activate your account",
  "email_verification_code_confirm_email": " Confirm email "
}
```

```json
// pl.json
{
  "email_verification_code_title": "Jeszcze jeden krok...",
  "email_verification_code_description": "Kliknij w poniższy przycisk aby potwierdzić swój adres e-mail i aktywować konto",
  "email_verification_code_confirm_email": " Potwierdź adres e-mail "
}
```

### MJML Templates

Use the `{{t 'key'}}` helper for translations in your MJML templates. All other templating (like Ory Kratos) will remain completely untouched:

```mjml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <!-- Translation calls - these will be processed -->
        <mj-text>{{t 'email_verification_code_title'}}</mj-text>
        <mj-text>{{t 'email_verification_code_description'}}</mj-text>
        
        <!-- Ory Kratos templating - completely preserved -->
        <mj-button href="{{ .VerificationURL }}">
          {{t 'email_verification_code_confirm_email'}}
        </mj-button>
        <mj-text>{{ .VerificationCode }}</mj-text>
        <mj-text>{{ .Identity.traits.email }}</mj-text>
        
        <!-- Kratos conditionals and functions - completely preserved -->
        <mj-raw>
          {{- if lower .Identity.traits.email | eq .To -}}
            {{template "link" .}}
          {{- else -}}
            {{template "code" .}}
          {{- end -}}
        </mj-raw>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

**Important:** 
- Only `{{t 'translation_key'}}` and `{{t "translation_key"}}` calls are processed
- All other `{{ }}` templating (Ory Kratos variables, conditionals, functions) remains completely untouched
- Both single and double quotes are supported for translation keys
- Missing translation keys will fallback to the key name itself

### CLI Commands

#### `mail-translation translate`

Translate mail templates based on configuration. This is the default command, so you can also run `mail-translation` without the `translate` subcommand.

**Options:**
- `-c, --config <path>`: Path to configuration file
- `-t, --translations-path <path>`: Path to translations directory
- `-m, --mails-path <path>`: Path to mail templates directory
- `-o, --output-path <path>`: Path to output directory
- `--output-mode <mode>`: Output mode (`kratos`, `razor`, default: `kratos`)
- `--default-language <lang>`: Default language for templates (default: `en`)
- `-l, --language <lang>`: Process only specific language
- `--languages <langs>`: Process specific languages (comma-separated)
- `-v, --verbose`: Enable verbose output
- `--beautify`: Beautify HTML output
- `--minify`: Minify HTML output
- `--validation-level <level>`: MJML validation level (`strict`, `soft`, `skip`)

**Examples:**
```bash
npx mail-translation
npx mail-translation translate
npx mail-translation translate --language en
npx mail-translation translate --languages en,pl --verbose
npx mail-translation translate --config ./custom-config.json
npx mail-translation translate --output-mode kratos --default-language en
npx mail-translation translate --output-mode razor --default-language en
```

### API Reference

#### MailTranslator

The main class for translating mail templates.

##### Constructor Options

- `translationsPath`: Path to the translations directory
- `mailsPath`: Path to the MJML templates directory
- `outputPath`: (optional) Path where translated files will be saved
- `mjmlOptions`: (optional) MJML compilation options

##### Methods

- `initialize()`: Load all translation files
- `loadTemplates()`: Load all MJML templates
- `translateTemplate(name, content, language, context)`: Translate a single template
- `translateAllTemplates(language, context)`: Translate all templates for one language
- `translateAllTemplatesAllLanguages(context)`: Translate all templates for all languages
- `saveTranslatedMails(translatedMails)`: Save translated mails to disk
- `getAvailableLanguages()`: Get list of available languages

#### Configuration Functions

- `loadConfig(searchFrom?)`: Load configuration from various sources
- `loadConfigFromFile(filepath)`: Load configuration from specific file
- `validateConfig(config)`: Validate configuration object
- `getDefaultConfig()`: Get default configuration
- `mergeWithDefaults(config)`: Merge configuration with defaults

### Advanced Usage

#### Single Template Translation

```typescript
const templates = await translator.loadTemplates();
const translatedMail = translator.translateTemplate(
  'email_verification_code',
  templates['email_verification_code'],
  'en',
  {
    VerificationURL: 'https://example.com/verify',
    VerificationCode: '123456'
  }
);

console.log(translatedMail.html); // Compiled HTML
console.log(translatedMail.errors); // Any compilation errors
```

#### Custom Context Data

You can pass any data to be used in your templates:

```typescript
const context = {
  userName: 'John Doe',
  companyName: 'Example Corp',
  supportEmail: 'support@example.com',
  VerificationURL: 'https://example.com/verify',
  // ... any other data
};

const translatedMails = await translator.translateAllTemplatesAllLanguages(context);
```

## Building

Run `nx build mail-translation` to build the library.

## Running unit tests

Run `nx test mail-translation` to execute the unit tests via [Jest](https://jestjs.io).

### 8. **Expected Output**

When you run the tool successfully, you should see output like:
```
Processing languages: en, pl
✓ en: 1 templates processed
✓ pl: 1 templates processed
✓ Translated mails saved to: /path/to/your/project/output
Mail translation completed successfully!
```

And your output directory will contain:
```
output/
├── en/
│   └── welcome.html
└── pl/
    └── welcome.html
```

## Project Structure

```
mail-translation/
├── src/
│   ├── lib/
│   │   ├── configLoader.ts
│   │   ├── mailTranslator.ts
│   │   ├── mjmlCompiler.ts
│   │   ├── outputProcessors.ts
│   │   ├── templateProcessor.ts
│   │   └── translationLoader.ts
│   ├── cli.ts
│   └── index.ts
├── __tests__/
│   ├── mails/
│   │   └── email_verification_code.mjml
│   └── translations/
│       ├── en.json
│       └── pl.json
├── mail-translation.config.example.js
└── README.md
```

## Quick Start

1. **Install the package** (when published):
   ```bash
   npm install @leancodepl/mail-translation
   ```

2. **Create your directory structure**:
   ```
   your-project/
   ├── translations/
   │   ├── en.json
   │   ├── pl.json
   │   └── fr.json
   ├── mails/
   │   └── email_verification_code.mjml
   └── output/
   ```

3. **Create translation files** (`translations/en.json`):
   ```json
   {
     "email_verification_title": "Email Verification",
     "email_verification_greeting": "Hello,",
     "email_verification_instructions": "Please enter the following code to verify your email address:",
     "email_verification_footer": "If you didn't request this verification, please ignore this email."
   }
   ```

4. **Create MJML templates** (`mails/email_verification_code.mjml`):
   ```xml
   <mjml>
     <mj-head>
       <mj-title>{{t "email_verification_title"}}</mj-title>
     </mj-head>
     <mj-body>
       <mj-section>
         <mj-column>
           <mj-text>
             <h1>{{t "email_verification_title"}}</h1>
             <p>{{t "email_verification_greeting"}}</p>
             <p>{{t "email_verification_instructions"}}</p>
             <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
               {{ .RecoveryCode }}
             </div>
             <p>{{t "email_verification_footer"}}</p>
           </mj-text>
         </mj-column>
       </mj-section>
     </mj-body>
   </mjml>
   ```

5. **Run the translation**:
   ```bash
   npx mail-translation
   ```

6. **Or test with provided examples**:
   ```bash
   npx mail-translation translate \
     --mails-path ./__tests__/mails \
     --translations-path ./__tests__/translations \
     --output-mode kratos
   ```
