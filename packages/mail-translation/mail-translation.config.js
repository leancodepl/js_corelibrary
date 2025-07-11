module.exports = {
    translationsPath: "./__tests__/translations",
    mailsPath: "./__tests__/mails",
    outputPath: "./dist/output",
    outputMode: "kratos",
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
