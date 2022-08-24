import { ApiDateOnly } from "@leancode/api-date";
import { format, parseISO } from "date-fns";
import timezoneMock from "timezone-mock";
import { fromApiDate } from "../../src";

describe("fromApiDate", () => {
    const apiDate = "1990-02-24";

    describe("run in GMT+5", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api date to local timezone date-fns object", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly);

            expect(date).toStrictEqual(parseISO(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = format(fromApiDate(apiDate as unknown as ApiDateOnly), "yyyy-MM-dd'T'HH:mm:ssXXX");

            expect(date).toBe("1990-02-24T00:00:00-05:00");
        });
    });

    describe("run in UTC timezone", () => {
        const timezone = "UTC";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api date to local timezone date-fns object", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly);

            expect(date).toStrictEqual(parseISO(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = format(fromApiDate(apiDate as unknown as ApiDateOnly), "yyyy-MM-dd'T'HH:mm:ssXXX");

            expect(date).toBe("1990-02-24T00:00:00Z");
        });
    });
});
