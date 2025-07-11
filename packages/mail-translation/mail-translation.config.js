module.exports = {
    translationsPath: "./__tests__/translations",
    mailsPath: "./__tests__/mails",
    outputPath: "./dist/output",
    outputMode: "razor",
    defaultLanguage: "en",
    languages: ["en", "pl"],
    verbose: false,
    watch: false,
    mjmlOptions: {
        beautify: false,
        minify: false,
        validationLevel: "soft",
        keepComments: false,
    },
}
