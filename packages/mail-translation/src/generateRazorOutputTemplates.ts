import { TranslatedTemplate } from "./processTemplate"

export function generateRazorOutputTemplates({
    translatedTemplates,
    defaultLanguage,
}: {
    translatedTemplates: TranslatedTemplate[]
    defaultLanguage?: string
}) {
    return translatedTemplates.map(template => ({
        filename: getFilename(template, defaultLanguage),
        content: escapeRazorConflicts(template.content),
    }))
}

function escapeRazorConflicts(templateContent: string): string {
    return templateContent.replace(/(?<!@)@media/g, "@@media").replace(/(?<!@)@import/g, "@@import")
}

function getFilename(template: TranslatedTemplate, defaultLanguage?: string): string {
    if (template.language === defaultLanguage || !defaultLanguage) {
        return template.isPlaintext ? `${template.name}.txt.cshtml` : `${template.name}.cshtml`
    } else {
        return template.isPlaintext
            ? `${template.name}.${template.language}.txt.cshtml`
            : `${template.name}.${template.language}.cshtml`
    }
}
