import * as timezoneMock from "timezone-mock";
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

        it("converts difference in milliseconds to api time span", () => {
            const differenceInMilliseconds = 98210599;

            const apiTimeSpan = toApiTimeSpan(differenceInMilliseconds);

            expect(apiTimeSpan).toBe("1.03:16:50.599");
        });

        it("converts negative difference in milliseconds to api time span", () => {
            const differenceInMilliseconds = -98210599;

            const apiTimeSpan = toApiTimeSpan(differenceInMilliseconds);

            expect(apiTimeSpan).toBe("-1.03:16:50.599");
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

        it("converts difference in milliseconds to api time span", () => {
            const differenceInMilliseconds = 98210599;

            const apiTimeSpan = toApiTimeSpan(differenceInMilliseconds);

            expect(apiTimeSpan).toBe("1.03:16:50.599");
        });

        it("converts negative difference in milliseconds to api time span", () => {
            const differenceInMilliseconds = -98210599;

            const apiTimeSpan = toApiTimeSpan(differenceInMilliseconds);

            expect(apiTimeSpan).toBe("-1.03:16:50.599");
        });
    });
});
