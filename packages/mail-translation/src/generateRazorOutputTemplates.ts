import { TranslatedTemplate } from "./processTemplate"

export function generateRazorOutputTemplates({
  translatedTemplates,
  defaultLanguage,
}: {
  translatedTemplates: TranslatedTemplate[]
  defaultLanguage?: string
}) {
  return translatedTemplates.map(template => ({
    filename: getFilename({ template, defaultLanguage }),
    content: escapeRazorConflicts(template.content),
  }))
}

function escapeRazorConflicts(templateContent: string): string {
  const cssAtRules = [
    "annotation",
    "character-variant",
    "charset",
    "color-profile",
    "container",
    "counter-style",
    "font-face",
    "font-feature-values",
    "font-palette-values",
    "import",
    "keyframes",
    "-webkit-keyframes",
    "layer",
    "media",
    "namespace",
    "ornaments",
    "page",
    "position-try",
    "property",
    "scope",
    "starting-style",
    "styleset",
    "stylistic",
    "supports",
    "swash",
    "view-transition",
  ].join("|")

  return templateContent.replace(new RegExp(`(?<!@)@(${cssAtRules})`, "g"), "@@$1")
}

function getFilename({
  template,
  defaultLanguage,
}: {
  template: TranslatedTemplate
  defaultLanguage?: string
}): string {
  const includeLanguage = !!defaultLanguage && !!template.language && template.language !== defaultLanguage

  return [
    template.name,
    ...(includeLanguage ? [template.language] : []),
    ...(template.isPlaintext ? ["txt"] : []),
    "cshtml",
  ].join(".")
}
