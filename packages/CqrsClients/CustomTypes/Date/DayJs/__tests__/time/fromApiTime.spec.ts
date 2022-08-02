import { ApiTimeOnly } from "@leancode/api-date";
import timezoneMock from "timezone-mock";
import { fromApiTime } from "../../src";

describe("fromApiTime", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts local api time to formatted time", () => {
            const apiTime = "11:30:00.000000";

            const time = fromApiTime(apiTime as unknown as ApiTimeOnly).format("HH:mm:ss");

            expect(time).toBe("11:30:00");
        });

        it("converts utc api time to local formatted time", () => {
            const apiTime = "11:30:00.0000000";

            const time = fromApiTime(apiTime as unknown as ApiTimeOnly, { isUtc: true }).format("HH:mm:ss");

            expect(time).toBe("06:30:00");
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

        it("converts local api time to formatted time", () => {
            const apiTime = "11:30:00.000000";

            const time = fromApiTime(apiTime as unknown as ApiTimeOnly).format("HH:mm:ss");

            expect(time).toBe("11:30:00");
        });

        it("converts utc api time to local formatted time", () => {
            const apiTime = "11:30:00.0000000";

            const time = fromApiTime(apiTime as unknown as ApiTimeOnly, { isUtc: true }).format("HH:mm:ss");

            expect(time).toBe("11:30:00");
        });
    });
});
