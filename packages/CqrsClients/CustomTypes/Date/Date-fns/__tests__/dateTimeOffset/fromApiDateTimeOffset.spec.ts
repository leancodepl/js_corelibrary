import { ApiDateTimeOffset } from "@leancode/api-date";
import { format } from "date-fns";
import timezoneMock from "timezone-mock";
import { fromApiDateTimeOffset } from "../../src";

const dateTimeOffsetFormat = "yyyy-MM-dd'T'HH:mm:ssXXX";

describe("fromApiDateTimeOffset", () => {
    it("handles undefined", () => {
        const dateTimeOffset = fromApiDateTimeOffset(undefined);

        expect(dateTimeOffset).toBeUndefined();
    });

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api dateTimeOffset to formatted local date", () => {
            const apiDatetimeOffset = "1990-02-24 11:30:00.000 -08:00";

            const datetimeOffset = format(
                fromApiDateTimeOffset(apiDatetimeOffset as unknown as ApiDateTimeOffset),
                dateTimeOffsetFormat,
            );

            expect(datetimeOffset).toBe("1990-02-24T14:30:00-05:00");
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

        it("converts api dateTimeOffset to formatted local date", () => {
            const apiDatetimeOffset = "1990-02-24 11:30:00.000 -08:00";

            const datetimeOffset = format(
                fromApiDateTimeOffset(apiDatetimeOffset as unknown as ApiDateTimeOffset),
                dateTimeOffsetFormat,
            );

            expect(datetimeOffset).toBe("1990-02-24T19:30:00Z");
        });
    });
});
