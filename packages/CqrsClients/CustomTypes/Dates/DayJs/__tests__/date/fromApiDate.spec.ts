import dayjs from "dayjs"
import timezoneMock from "timezone-mock"
import { fromApiDate } from "../../src"

describe("fromApiDate", () => {
    const apiDate = "1990-02-24"

    it("handles undefined", async () => {
        const date = await fromApiDate(undefined)

        const isEqual = date.isSame(dayjs(), "date")

        expect(isEqual).toBe(true)
    })

    describe("run in GMT+5", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts api date to local timezone dayjs object", async () => {
            const date = await fromApiDate(apiDate)

            expect(date).toStrictEqual(dayjs(apiDate, timezone))
        })

        it("converts api date to formatted local timezone date", async () => {
            const date = await fromApiDate(apiDate).format()

            expect(date).toBe("1990-02-24T00:00:00-05:00")
        })
    })

    describe("run in UTC timezone", () => {
        const timezone = "UTC"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts api date to local timezone dayjs object", async () => {
            const date = await fromApiDate(apiDate)

            expect(date).toStrictEqual(dayjs(apiDate, timezone))
        })

        it("converts api date to formatted local timezone date", async () => {
            const date = await fromApiDate(apiDate).format()

            expect(date).toBe("1990-02-24T00:00:00+00:00")
        })
    })
})
