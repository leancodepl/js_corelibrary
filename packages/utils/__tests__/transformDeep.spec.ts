import { capitalizeDeep, uncapitalizeDeep } from "../src";

describe("uncapitalizeDeep", () => {
    it("handles primitive types", async () => {
        expect(uncapitalizeDeep(null)).toBeUndefined();
        expect(uncapitalizeDeep(undefined)).toBeUndefined();

        const stringValue = "string";
        expect(uncapitalizeDeep(stringValue)).toBe(stringValue);

        const numberValue = Math.random();
        expect(uncapitalizeDeep(numberValue)).toBe(numberValue);

        expect(uncapitalizeDeep(true)).toBe(true);
        expect(uncapitalizeDeep(false)).toBe(false);
    });

    it("handles simple arrays", async () => {
        expect(uncapitalizeDeep(simpleArray)).toEqual(transformedSimpleArray);
    });

    it("handles objects and complex arrays", async () => {
        expect(uncapitalizeDeep(capitalizedSimpleObject)).toEqual(uncapitalizedSimpleObject);
        expect(uncapitalizeDeep(capitalizedArrayWithObject)).toEqual(uncapitalizedArrayWithObject);
        expect(uncapitalizeDeep(capitalizedComplexObject)).toEqual(uncapitalizedComplexObject);
    });
});

describe("capitalizeDeep", () => {
    it("handles primitive types", async () => {
        expect(capitalizeDeep(null)).toBeUndefined();
        expect(capitalizeDeep(undefined)).toBeUndefined();

        const stringValue = "string";
        expect(capitalizeDeep(stringValue)).toBe(stringValue);

        const numberValue = Math.random();
        expect(capitalizeDeep(numberValue)).toBe(numberValue);

        expect(capitalizeDeep(true)).toBe(true);
        expect(capitalizeDeep(false)).toBe(false);
    });

    it("handles simple arrays", async () => {
        expect(capitalizeDeep(simpleArray)).toEqual(transformedSimpleArray);
    });

    it("handles objects and complex arrays", async () => {
        expect(capitalizeDeep(uncapitalizedSimpleObject)).toEqual(capitalizedSimpleObject);
        expect(capitalizeDeep(uncapitalizedArrayWithObject)).toEqual(capitalizedArrayWithObject);
        expect(capitalizeDeep(uncapitalizedComplexObject)).toEqual(capitalizedComplexObject);
    });
});

const simpleArray = ["a", 0, true, null, undefined];
const transformedSimpleArray = simpleArray.map(value => value ?? undefined);

const capitalizedArrayWithObject = [
    "aaa",
    12,
    { NestedKey3: false, NestedKey4: { NestedKey5: { NestedKey6: "w" } } },
] as const;

const uncapitalizedArrayWithObject = [
    "aaa",
    12,
    { nestedKey3: false, nestedKey4: { nestedKey5: { nestedKey6: "w" } } },
] as const;

const capitalizedSimpleObject = {
    Key1: { NestedKey1: "value", NestedKey2: 12 },
} as const;

const uncapitalizedSimpleObject = {
    key1: { nestedKey1: "value", nestedKey2: 12 },
} as const;

const capitalizedComplexObject = {
    ...capitalizedSimpleObject,
    Key2: capitalizedArrayWithObject,
} as const;

const uncapitalizedComplexObject = {
    ...uncapitalizedSimpleObject,
    key2: uncapitalizedArrayWithObject,
} as const;
