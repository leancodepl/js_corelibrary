import dayjs from "dayjs";
import { dropLocalOffset } from "../../src";

describe("dropLocalOffset", () => {
    it("converts dayjs object to utc dayjs object", async () => {
        const date = "1990-24-02";

        const parsedDate = await dropLocalOffset(dayjs(date));

        const isUTC = parsedDate.isUTC();

        expect(isUTC).toBe(true);
    });
});
