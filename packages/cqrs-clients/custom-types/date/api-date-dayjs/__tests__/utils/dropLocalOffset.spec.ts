import dayjs from "dayjs";
import timezoneMock from "timezone-mock";
import { dropLocalOffset } from "../../src";

describe("dropLocalOffset", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5";

        beforeAll(() => {
            timezoneMock.register(timezone);
        });

        afterAll(() => {
            timezoneMock.unregister();
        });

        it("converts dayjs object to utc dayjs object", () => {
            const date = "1990-02-24";

            const parsedDate = dropLocalOffset(dayjs(date));

            const isUTC = parsedDate.isUTC();

            expect(isUTC).toBe(true);
        });

        it("converts dayjs object to utc formatted date", async () => {
            const date = "1990-02-24";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DD");

            expect(parsedDate).toBe("1990-02-24");
        });

        it("converts datetime based dayjs object to utc formatted date", async () => {
            const date = "1990-02-24T11:30:00";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DDTHH:mm:ssZ");

            expect(parsedDate).toBe("1990-02-24T11:30:00+00:00");
        });

        it("converts datetime based dayjs object to utc unbiased formatted date", async () => {
            const date = "1990-02-24T11:30:00+02:00";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DDTHH:mm:ssZ");

            expect(parsedDate).toBe("1990-02-24T04:30:00+00:00");
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

        it("converts dayjs object to utc dayjs object", async () => {
            const date = "1990-02-24";

            const parsedDate = dropLocalOffset(dayjs(date));

            const isUTC = parsedDate.isUTC();

            expect(isUTC).toBe(true);
        });

        it("converts dayjs object to utc unbiased formatted date", async () => {
            const date = "1990-02-24";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DD");

            expect(parsedDate).toBe("1990-02-24");
        });

        it("converts datetime based dayjs object to utc unbiased formatted date", async () => {
            const date = "1990-02-24T11:30:00";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DDTHH:mm:ssZ");

            expect(parsedDate).toBe("1990-02-24T11:30:00+00:00");
        });

        it("converts datetime based dayjs object to local formatted date parsed to utc unbiased date", async () => {
            const date = "1990-02-24T11:30:00+02:00";

            const parsedDate = dropLocalOffset(dayjs(date)).format("YYYY-MM-DDTHH:mm:ssZ");

            expect(parsedDate).toBe("1990-02-24T09:30:00+00:00");
        });
    });
});
