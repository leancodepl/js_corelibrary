import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import { fromApiDate } from "../../src";

describe("fromApiDate", () => {
    const apiDate = "1990-02-24";

    it("handles undefined", () => {
        const date = fromApiDate(undefined);

        const isEqual = date.isSame(dayjs(), "date");

        expect(isEqual).toBe(true);
    });

    describe("run in GMT+5", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts api date to local timezone dayjs object", () => {
            const date = fromApiDate(apiDate);

            expect(date).toStrictEqual(dayjs(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = fromApiDate(apiDate).format();

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
            const date = fromApiDate(apiDate);

            expect(date).toStrictEqual(dayjs(apiDate));
        });

        it("converts api date to formatted local timezone date", () => {
            const date = fromApiDate(apiDate).format();

            expect(date).toBe("1990-02-24T00:00:00+00:00");
        });
    });
});
