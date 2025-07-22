import { TranslatedTemplate } from "./processTemplate"

export function generateKratosOutputTemplates({
  translatedTemplates,
  defaultLanguage,
  kratosLanguageVariable,
}: {
  translatedTemplates: TranslatedTemplate[]
  defaultLanguage?: string
  kratosLanguageVariable?: string
}) {
  const plainTextTemplates = translatedTemplates.filter(template => template.isPlaintext)
  const htmlTemplates = translatedTemplates.filter(template => !template.isPlaintext)

  const htmlOutputTemplates = htmlTemplates.map(template => ({
    filename: `${template.name}.gotmpl`,
    content: generateKratosOutputTemplate({
      templates: htmlTemplates,
      defaultLanguage,
      kratosLanguageVariable,
    }),
  }))

  const plainTextOutputTemplates = plainTextTemplates.map(template => ({
    filename: `${template.name}.plaintext.gotmpl`,
    content: generateKratosOutputTemplate({
      templates: plainTextTemplates,
      defaultLanguage,
      kratosLanguageVariable,
    }),
  }))

  return [...htmlOutputTemplates, ...plainTextOutputTemplates]
}

function generateKratosOutputTemplate({
  templates,
  defaultLanguage,
  kratosLanguageVariable = ".Identity.traits.lang",
}: {
  templates: TranslatedTemplate[]
  defaultLanguage?: string
  kratosLanguageVariable?: string
}): string {
  if (templates.length === 1 || !defaultLanguage) {
    return templates[0].content
  }

  let outputTemplate = ""

  templates.forEach(template => {
    outputTemplate += `{{define "${template.language}"}}\n`
    outputTemplate += template.content
    outputTemplate += "\n{{end}}\n\n"
  })

  const nonDefaultLanguages = templates
    .filter(template => template.language !== defaultLanguage)
    .map(template => template.language)

  nonDefaultLanguages.forEach((language, index) => {
    const condition = index === 0 ? "if" : "else if"

    outputTemplate += `{{- ${condition} eq ${kratosLanguageVariable} "${language}" -}}\n`
    outputTemplate += `{{ template "${language}" . }}\n`
  })

  outputTemplate += "{{- else -}}\n"
  outputTemplate += `{{ template "${defaultLanguage}" . }}\n`
  outputTemplate += "{{- end -}}\n"

  return outputTemplate
}
