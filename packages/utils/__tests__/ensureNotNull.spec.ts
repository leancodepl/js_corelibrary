import { ensureNotNull } from "../src/lib/ensureNotNull";

describe("ensureNotNull", () => {
    it("returns the same value when it is not null", () => {
        expect(ensureNotNull("value")).toBe("value");
    });

    it("throws error when value is null", () => {
        expect(() => ensureNotNull(null)).toThrow();
    });
});
