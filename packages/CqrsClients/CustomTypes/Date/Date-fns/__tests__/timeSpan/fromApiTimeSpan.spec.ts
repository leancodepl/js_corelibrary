import { ApiTimeSpan } from "@leancode/api-date";
import timezoneMock from "timezone-mock";
import { fromApiTimeSpan } from "../../src";

const expectedNegativeDuration = { days: -1, hours: -3, minutes: -16, seconds: -50 };

describe("fromApiTimeSpan", () => {
    it("handles undefined", () => {
        const timeSpan = fromApiTimeSpan(undefined);

        expect(timeSpan).toBeUndefined();
    });

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api timespan to date-fns duration", () => {
            const apiTimeSpan = "1.03:16:50.599";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            const dateFnsDuration: Duration = { days: 1, hours: 3, minutes: 16, seconds: 50 };

            expect(timeSpan).toStrictEqual(dateFnsDuration);
        });

        it("converts api timespan to duration in hours", () => {
            const apiTimeSpan = "05:00:00";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            const timeSpanInMonths = timeSpan.hours;

            expect(timeSpanInMonths).toBe(5);
        });

        it("converts negative api timespan to duration", () => {
            const apiTimeSpan = "-1.03:16:50.599";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            expect(timeSpan).toStrictEqual(expectedNegativeDuration);
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

        it("converts api timespan to date-fns duration", () => {
            const apiTimeSpan = "1.03:16:50.599";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            const dateFnsDuration: Duration = { days: 1, hours: 3, minutes: 16, seconds: 50 };

            expect(timeSpan).toStrictEqual(dateFnsDuration);
        });

        it("converts api timespan to duration in hours", () => {
            const apiTimeSpan = "05:00:00";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            const timeSpanInMonths = timeSpan.hours;

            expect(timeSpanInMonths).toBe(5);
        });

        it("converts negative api timespan to duration", () => {
            const apiTimeSpan = "-1.03:16:50.599";

            const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan);

            expect(timeSpan).toStrictEqual(expectedNegativeDuration);
        });
    });
});
