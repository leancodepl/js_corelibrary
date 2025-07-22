# @leancodepl/mail-translation

A command-line tool for processing MJML and plaintext email templates with optional internationalization support.
Compiles MJML templates to HTML and can convert templates with translation placeholders into localized email files for
Kratos or Razor templating systems.

## Installation

```sh
npm install -D @leancodepl/mail-translation
```

## Usage

```sh
npx @leancodepl/mail-translation

# Or with custom config file
npx @leancodepl/mail-translation --config custom-config.js
```

## Configuration

Mail translation is configured using [lilconfig](https://github.com/antonk52/lilconfig). Valid configuration sources
include:

- `mail-translation` property in `package.json`
- `.mail-translationrc.json` for raw JSON
- `mail-translation.config.js`, `mail-translation.config.cjs`, `.mail-translationrc.js`, `.mail-translationrc.cjs` for
  JavaScript configuration files
- Path to JavaScript/JSON/YAML config file passed via `--config/-c` parameter

### Example Configuration

**With translations:**

```js
module.exports = {
    translationsPath: "./translations",
    mailsPath: "./templates/mjml",
    plaintextMailsPath: "./templates/plaintext",
    outputPath: "./dist/emails",
    outputMode: "kratos",
    defaultLanguage: "en",
    languages: ["en", "pl", "de"], // optional - will auto-detect from translation files
}
```

**MJML compilation only (no translations):**

```js
module.exports = {
    mailsPath: "./templates/mjml",
    outputPath: "./dist/emails",
    outputMode: "kratos",
}
```

### Configuration Options

- `mailsPath` (`string`, **required**) - Path to directory containing MJML email templates
- `outputPath` (`string`, **required**) - Directory where processed templates will be saved
- `outputMode` (`"kratos" | "razor"`, **required**) - Target templating system format
- `translationsPath` (`string`, optional) - Path to translation files directory. When omitted, templates are compiled
  without translations
- `plaintextMailsPath` (`string`, optional) - Path to plaintext templates (defaults to `mailsPath`)
- `defaultLanguage` (`string`, **required when `translationsPath` is provided**) - Default language code for templates
  with translations
- `languages` (`string[]`, optional) - Array of language codes to process. When omitted, all languages found in
  translation files are processed

## Template Structure

### MJML Templates

Place MJML files in your `mailsPath` directory:

```
templates/
├── welcome.mjml
├── password-reset.mjml
└── components/
    ├── header.mjml
    └── footer.mjml
```

### Translation Files

Create JSON translation files in your `translationsPath`:

```
translations/
├── en.json
├── pl.json
└── de.json
```

Example translation file (`en.json`):

```json
{
    "welcome_title": "Welcome to our platform!",
    "welcome_greeting": "Hello {name}!",
    "verify_button": "Verify Account",
    "footer_text": "© 2024 Company. All rights reserved."
}
```

### Template Syntax

Use `{{t "key"}}` for simple translations:

```mjml
<mj-text>{{t "welcome_title"}}</mj-text>
```

Use `{{t "key", (param: "value")}}` for single parameter translations:

```mjml
<mj-text>{{t "welcome_greeting", (name: "{{ .Identity.traits.first_name }}")}}</mj-text>
```

Use multiple parameters for complex translations:

```mjml
<mj-text>{{t "account_info", (email: "{{ .Identity.traits.email }}", plan: "{{ .Identity.traits.plan }}")}}</mj-text>
```

## Output Modes

### Kratos Mode

Generates Go template files compatible with Ory Kratos identity management system:

**File Structure:**

- **Body templates**: `template_name.gotmpl` (e.g., `welcome.gotmpl`)
- **Plaintext templates**: `template_name.plaintext.gotmpl` (e.g., `welcome.plaintext.gotmpl`)
- Single file with multiple language template definitions

**Template Syntax:**

- Uses Go template `{{define "language"}}` blocks for each language
- Template selection logic at the bottom using Kratos variables
- Kratos variables available (e.g., `{{ .Identity.traits.email }}`)
- Language detection via `{{ .Identity.traits.lang }}`

**Example Output:**

```gotmpl
{{define "en"}}
<html>
<body>
  <h1>Welcome to our platform!</h1>
  <p>Hello {{ .Identity.traits.first_name }}!</p>
  <p>Thank you for registering with us.</p>
  <p><strong>Verification Code: {{ .VerificationCode }}</strong></p>
  <p>Account: {{ .Identity.traits.email }}</p>
</body>
</html>
{{end}}

{{define "pl"}}
<html>
<body>
  <h1>Witamy na naszej platformie!</h1>
  <p>Witaj {{ .Identity.traits.first_name }}!</p>
  <p>Dziękujemy za rejestrację.</p>
  <p><strong>Kod weryfikacyjny: {{ .VerificationCode }}</strong></p>
  <p>Konto: {{ .Identity.traits.email }}</p>
</body>
</html>
{{end}}

{{- if eq .Identity.traits.lang "pl" -}}
{{ template "pl" . }}
{{- else -}}
{{ template "en" . }}
{{- end -}}
```

### Razor Mode

Generates C# Razor template files:

**File Structure:**

- **HTML templates**: `TemplateName.cshtml` (default language), `TemplateName.language.cshtml` (other languages)
- **Plain text templates**: `TemplateName.txt.cshtml` (default language), `TemplateName.language.txt.cshtml` (other
  languages)
- Separate files for each language

**Template Syntax:**

- Uses Razor syntax: `@Model.Property`
- CSS `@` symbols escaped as `@@` for media queries

**Example Output:**

Assuming english is the default language, the output will be:

English template (`notification.cshtml`):

```html
<html>
    <body>
        <h1>System Notification</h1>
        <p>Dear @Model.User.FullName,</p>
        <p>Your account status has been updated to: @Model.Status as of @Model.UpdateDate.</p>
        <p>Action required: @Model.RequiredAction</p>
        <a href="@Model.ActionUrl">Take Action Now</a>
        <p>Reference: @Model.ReferenceNumber</p>
    </body>
</html>
```

Polish template (`notification.pl.cshtml`):

```html
<html>
    <body>
        <h1>Powiadomienie systemowe</h1>
        <p>Szanowny/a @Model.User.FullName,</p>
        <p>Status Twojego konta został zaktualizowany na: @Model.Status z dniem @Model.UpdateDate.</p>
        <p>Wymagane działanie: @Model.RequiredAction</p>
        <a href="@Model.ActionUrl">Wykonaj działanie teraz</a>
        <p>Numer referencyjny: @Model.ReferenceNumber</p>
    </body>
</html>
```
