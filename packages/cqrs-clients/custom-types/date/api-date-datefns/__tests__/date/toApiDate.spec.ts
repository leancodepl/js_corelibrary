import { parse } from "date-fns";
import * as timezoneMock from "timezone-mock";
import { toApiDate } from "../../src";

describe("toApiDate", () => {
    const dateFormat = "yyyy-MM-dd";
    const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts utc date-fns object to local api date", () => {
            const date = toApiDate(parse("1990-02-24", dateFormat, new Date()));

            expect(date).toBe("1990-02-24");
        });

        it("converts utc date-fns datetime based object to api date", () => {
            const datetime = toApiDate(parse("1990-02-24T00:00:00.000+01:00", dateTimeFormat, new Date()));

            expect(datetime).toBe("1990-02-23");
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

        it("converts utc date-fns object to local api date", () => {
            const date = toApiDate(parse("1990-02-24", dateFormat, new Date()));

            expect(date).toBe("1990-02-24");
        });

        it("converts utc date-fns datetime based object to api date", () => {
            const datetime = toApiDate(parse("1990-02-24T00:00:00.000+01:00", dateTimeFormat, new Date()));

            expect(datetime).toBe("1990-02-23");
        });
    });
});
