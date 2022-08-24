import { parseISO } from "date-fns";
import timezoneMock from "timezone-mock";
import { toApiDate } from "../../src";

describe("toApiDate", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts utc date-fns object to local api date", () => {
            const date = toApiDate(parseISO("1990-02-24"));

            expect(date).toBe("1990-02-24");
        });

        it("converts utc date-fns datetime based object to api date", () => {
            const datetime = toApiDate(parseISO("1990-02-24T00:00:00.000+01:00"));

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
            const date = toApiDate(parseISO("1990-02-24"));

            expect(date).toBe("1990-02-24");
        });

        it("converts utc date-fns datetime based object to api date", () => {
            const datetime = toApiDate(parseISO("1990-02-24T00:00:00.000+01:00"));

            expect(datetime).toBe("1990-02-23");
        });
    });
});
