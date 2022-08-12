import { ApiTimeSpan } from "@leancode/api-date";
import { parseApiTimeSpan } from "../../src";

describe("parseApiTimeSpan", () => {
    it("converts apiTimeSpan to object", () => {
        const timeSpan = "1.03:16:50.599" as unknown as ApiTimeSpan;

        const parsedTimeSpan = parseApiTimeSpan(timeSpan);

        const expectedParsedTimeSpan = {
            sign: undefined,
            values: {
                days: 1,
                hours: 3,
                milliseconds: 599,
                minutes: 16,
                seconds: 50,
            },
        };

        expect(parsedTimeSpan).toStrictEqual(expectedParsedTimeSpan);
    });
});
