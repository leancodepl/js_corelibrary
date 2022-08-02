import { ApiDateTimeOffset } from "@leancode/api-date";
import timezoneMock from "timezone-mock";
import { fromApiDateTimeOffset } from "../../src";

describe("fromApiDateTimeOffset", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api dateTimeOffset to formatted local date", () => {
            const apiDatetimeOffset = "1990-02-24 11:30:00.0000000 -08:00";

            const datetimeOffset = fromApiDateTimeOffset(apiDatetimeOffset as unknown as ApiDateTimeOffset).format();

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
            const apiDatetimeOffset = "1990-02-24 11:30:00.0000000 -08:00";

            const datetimeOffset = fromApiDateTimeOffset(apiDatetimeOffset as unknown as ApiDateTimeOffset).format();

            expect(datetimeOffset).toBe("1990-02-24T19:30:00+00:00");
        });
    });
});
