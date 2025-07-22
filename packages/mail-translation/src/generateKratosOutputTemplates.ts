import { TranslatedTemplate } from "./processTemplate"

export function generateKratosOutputTemplates({
  translatedTemplates,
  defaultLanguage,
}: {
  translatedTemplates: TranslatedTemplate[]
  defaultLanguage?: string
}) {
  const plainTextTemplates = translatedTemplates.filter(template => template.isPlaintext)
  const htmlTemplates = translatedTemplates.filter(template => !template.isPlaintext)

  const htmlOutputTemplates = htmlTemplates.map(template => ({
    filename: `${template.name}.gotmpl`,
    content: generateKratosOutputTemplate({ templates: htmlTemplates, defaultLanguage }),
  }))

  const plainTextOutputTemplates = plainTextTemplates.map(template => ({
    filename: `${template.name}.plaintext.gotmpl`,
    content: generateKratosOutputTemplate({ templates: plainTextTemplates, defaultLanguage }),
  }))

  return [...htmlOutputTemplates, ...plainTextOutputTemplates]
}

function generateKratosOutputTemplate({
  templates,
  defaultLanguage,
}: {
  templates: TranslatedTemplate[]
  defaultLanguage?: string
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

    outputTemplate += `{{- ${condition} eq .Identity.traits.lang "${language}" -}}\n`
    outputTemplate += `{{ template "${language}" . }}\n`
  })

  outputTemplate += "{{- else -}}\n"
  outputTemplate += `{{ template "${defaultLanguage}" . }}\n`
  outputTemplate += "{{- end -}}\n"

  return outputTemplate
}
