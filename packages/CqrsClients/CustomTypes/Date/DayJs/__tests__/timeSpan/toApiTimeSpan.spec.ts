import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import timezoneMock from "timezone-mock";
import { toApiTimeSpan } from "../../src";

dayjs.extend(duration);

describe("toApiTimeSpan", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts dayjs duration object to api time span", () => {
            const duration = dayjs.duration({ days: 1, hours: 3, minutes: 16, seconds: 50, milliseconds: 599 });
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("1.03:16:50.5990000");
        });

        it("converts dayjs negative duration object to api time span", () => {
            const duration = dayjs.duration({ days: -1, hours: -3, minutes: -16, seconds: -50, milliseconds: -599 });
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("-1.03:16:50.5990000");
        });

        it("converts dayjs duration with years object to api time span", () => {
            const duration = dayjs.duration({ years: 1, months: 2, days: 1 });
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

        it("converts dayjs duration object to api time span", () => {
            const duration = dayjs.duration({ days: 1, hours: 3, minutes: 16, seconds: 50, milliseconds: 599 });
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("1.03:16:50.5990000");
        });

        it("converts dayjs negative duration object to api time span", () => {
            const duration = dayjs.duration({ days: -1, hours: -3, minutes: -16, seconds: -50, milliseconds: -599 });
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("-1.03:16:50.5990000");
        });

        it("converts dayjs duration with years object to api time span", () => {
            const duration = dayjs.duration({ years: 1, months: 2, days: 1 });
            const apiTimeSpan = toApiTimeSpan(duration);

            expect(apiTimeSpan).toBe("426.00:00:00");
        });
    });
});
