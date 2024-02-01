import { addPrefix } from "../src/lib/addPrefix";

describe("addPrefix", () => {
    it("should add prefix to each key", () => {
        const obj = { name: "John", age: 30 };
        const result = addPrefix(obj, "prefix_");
        expect(result).toEqual({ prefix_name: "John", prefix_age: 30 });
    });

    it("should handle empty prefix", () => {
        const obj = { name: "John", age: 30 };
        const result = addPrefix(obj, "");
        expect(result).toEqual(obj);
    });

    it("should handle empty object", () => {
        const obj = {};
        const result = addPrefix(obj, "prefix_");
        expect(result).toEqual({});
    });

    it("should handle empty prefix and object", () => {
        const obj = {};
        const result = addPrefix(obj, "");
        expect(result).toEqual({});
    });
});
