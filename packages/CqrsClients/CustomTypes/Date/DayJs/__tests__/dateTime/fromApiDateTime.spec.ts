import { ApiDateTime } from "@leancode/api-date";
import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import { fromApiDateTime } from "../../src";

describe("fromApiDateTime", () => {
    it("handles undefined", () => {
        const datetime = fromApiDateTime(undefined);

        expect(datetime).toBeUndefined();
    });

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts local api datetime to dayjs object", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const datetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime);

            expect(datetime).toStrictEqual(dayjs(apiDatetime));
        });

        it("converts local api datetime to ISO 8601 string", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const datetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime).toISOString();

            expect(datetime).toBe("1990-02-24T16:30:00.000Z");
        });

        it("converts utc api datetime to ISO 8601 string", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const utcDatetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime, { isUtc: true }).toISOString();

            expect(utcDatetime).toBe("1990-02-24T11:30:00.000Z");
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

        it("converts local api datetime to dayjs object", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const datetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime);

            expect(datetime).toStrictEqual(dayjs(apiDatetime));
        });

        it("converts local api datetime to ISO 8601 string", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const datetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime).toISOString();

            expect(datetime).toBe("1990-02-24T11:30:00.000Z");
        });

        it("converts utc api datetime to ISO 8601 string", () => {
            const apiDatetime = "1990-02-24T11:30:00.0000000";

            const utcDatetime = fromApiDateTime(apiDatetime as unknown as ApiDateTime, { isUtc: true }).toISOString();

            expect(utcDatetime).toBe("1990-02-24T11:30:00.000Z");
        });
    });
});
