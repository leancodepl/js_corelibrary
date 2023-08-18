import { parse } from "date-fns";
import * as timezoneMock from "timezone-mock";
import { toApiDateTimeOffset } from "../../src";

describe("toApiDateTimeOffset", () => {
    const dateFormat = "yyyy-MM-dd";
    const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssXXX";

    it("handles undefined", () => {
        const apiDateTimeOffset = toApiDateTimeOffset(undefined);

        expect(apiDateTimeOffset).toBeUndefined();
    });

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts local date-fns object to apiDateTimeOffset", () => {
            const date = parse("1990-02-24", dateFormat, new Date());
            const dateTimeOffset = toApiDateTimeOffset(date);

            expect(dateTimeOffset).toBe("1990-02-24T00:00:00.000-05:00");
        });

        it("converts date-fns datetime based object to apiDateTimeOffset", () => {
            const dateTimeOffset = toApiDateTimeOffset(parse("1990-02-24T10:30:00+02:00", dateTimeFormat, new Date()));

            expect(dateTimeOffset).toBe("1990-02-24T03:30:00.000-05:00");
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

        it("converts local date-fns object to apiDateTimeOffset", () => {
            const date = parse("1990-02-24", dateFormat, new Date());
            const dateTimeOffset = toApiDateTimeOffset(date);

            expect(dateTimeOffset).toBe("1990-02-24T00:00:00.000Z");
        });

        it("converts date-fns datetime based object to apiDateTimeOffset", () => {
            const dateTimeOffset = toApiDateTimeOffset(parse("1990-02-24T10:30:00+02:00", dateTimeFormat, new Date()));

            expect(dateTimeOffset).toBe("1990-02-24T08:30:00.000Z");
        });
    });
});
