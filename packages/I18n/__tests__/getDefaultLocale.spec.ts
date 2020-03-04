import "@testing-library/jest-dom";
import { getDefaultLocale } from "../src";

describe("i18n", () => {
    describe("getDefaultLocale", () => {
        it("returns string locale when no data is provided", async () => {
            const defaultLocale = getDefaultLocale();

            expect(typeof defaultLocale).toBe("string");
        });

        it("returns supported locale when one is present", async () => {
            const defaultLocale = getDefaultLocale(["pl", "en", "fr"]);

            expect(typeof defaultLocale).toBe("string");
        });

        it("throws when default locale is not supported and there is no fallback", async () => {
            expect(() => {
                getDefaultLocale(["pl", "fr"]);
            }).toThrow();
        });

        it("returns fallback locale when default is not supported", async () => {
            const defaultLocale = getDefaultLocale(["pl", "fr"], "pl");

            expect(defaultLocale).toBe("pl");
        });
    });
});
