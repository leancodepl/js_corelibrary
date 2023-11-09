import { ensureDefined } from "../src/lib/ensureDefined";

describe("ensureDefined", () => {
    it("returns the same value when it is not defined", () => {
        expect(ensureDefined("value")).toBe("value");
    });

    it("throws error when value is undefined", () => {
        expect(() => ensureDefined(undefined)).toThrow();
    });
});
