/**
 * @jest-environment jsdom
 */
import { getDefaultLocale } from "../src";

function mockLanguage(language: string) {
    Object.defineProperty(navigator, "language", { value: language, writable: true });
}

describe("i18n", () => {
    describe("getDefaultLocale", () => {
        it("returns navigator locale when no data is provided", async () => {
            mockLanguage("en-US");

            const defaultLocale = getDefaultLocale();

            expect(defaultLocale).toBe("en");
        });

        it("returns supported locale when one is present", async () => {
            mockLanguage("en-US");

            const defaultLocale = getDefaultLocale(["pl", "en", "fr"]);

            expect(defaultLocale).toBe("en");
        });

        it("throws when default locale is not supported and there is no fallback", async () => {
            mockLanguage("en-US");

            expect(() => {
                getDefaultLocale(["pl", "fr"]);
            }).toThrow();
        });

        it("returns fallback locale when default is not supported", async () => {
            mockLanguage("en-US");

            const defaultLocale = getDefaultLocale(["pl", "fr"], "pl");

            expect(defaultLocale).toBe("pl");
        });

        it("returns correct locale when its more than two letters", async () => {
            mockLanguage("mas");

            const defaultLocale = getDefaultLocale();

            expect(defaultLocale).toBe("mas");
        });
    });
});
