import * as dayjs from "dayjs";
import * as timezoneMock from "timezone-mock";
import { fromApiDate, ApiDateOnly } from "../../src";

describe("fromApiDate", () => {
    const apiDate = "1990-02-24";

    describe("run in GMT+5", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api date to local timezone dayjs object", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly);

            expect(date).toStrictEqual(dayjs(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly).format();

            expect(date).toBe("1990-02-24T00:00:00-05:00");
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

        it("converts api date to local timezone dayjs object", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly);

            expect(date).toStrictEqual(dayjs(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = fromApiDate(apiDate as unknown as ApiDateOnly).format();

            expect(date).toBe("1990-02-24T00:00:00+00:00");
        });
    });
});
