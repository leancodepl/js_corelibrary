import timezoneMock from "timezone-mock";
import { toApiTimeSpan } from "../../src";

describe("toApiTimeSpan", () => {
    it("handles undefined", () => {
        const apiTimeSpan = toApiTimeSpan(undefined);

        expect(apiTimeSpan).toBeUndefined();
    });

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts date-fns duration object to api time span", () => {
            const duration: Duration = {
                years: 0,
                months: 0,
                days: 1,
                hours: 3,
                minutes: 16,
                seconds: 50,
            };

            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("1.03:16:50");
        });

        it("converts date-fns negative duration object to api time span", () => {
            const duration = { days: -1, hours: -3, minutes: -16, seconds: -50 };
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("-1.03:16:50");
        });

        it("converts date-fns duration with years object to api time span", () => {
            const duration = { years: 1, months: 2, days: 1 };
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("426.00:00:00");
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

        it("converts date-fns duration object to api time span", () => {
            const duration = { days: 1, hours: 3, minutes: 16, seconds: 50 };
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("1.03:16:50");
        });

        it("converts date-fns negative duration object to api time span", () => {
            const duration = { days: -1, hours: -3, minutes: -16, seconds: -50 };
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("-1.03:16:50");
        });

        it("converts date-fns duration with years object to api time span", () => {
            const duration = { years: 1, months: 2, days: 1 };
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("426.00:00:00");
        });
    });
});
