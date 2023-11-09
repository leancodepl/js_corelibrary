import { assertNotNull } from "../src/lib/assertNotNull";

describe("assertNotNull", () => {
    it("doesn't throw when value is not null", () => {
        expect(() => assertNotNull("value")).not.toThrow();
    });

    it("throws error when value is null", () => {
        expect(() => assertNotNull(null)).toThrow();
    });
});
