import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import timezoneMock from "timezone-mock"
import { fromApiTimeSpan } from "../../src"

dayjs.extend(duration)

describe("fromApiTimeSpan", () => {
    it("handles undefined", async () => {
        const timeSpan = await fromApiTimeSpan(undefined)

        const timeSpanInMilliseconds = timeSpan.asMilliseconds()

        expect(timeSpanInMilliseconds).toBe(0)
    })

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts api time span to dayjs duration", async () => {
            const apiTimeSpan = "1.03:16:50.599"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const dayjsDuration = dayjs.duration({ days: 1, hours: 3, minutes: 16, seconds: 50, milliseconds: 599 })

            expect(timeSpan).toStrictEqual(dayjsDuration)
        })

        it("converts api time span to formatted duration in months", async () => {
            const apiTimeSpan = "30.00:00:00"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const timeSpanInMonths = timeSpan.asMonths()

            expect(timeSpanInMonths).toBe(1)
        })

        it("converts negative api time span to formatted duration in milliseconds", async () => {
            const apiTimeSpan = "-1.03:16:50.599"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const timeSpanInMilliseconds = timeSpan.asMilliseconds()

            expect(timeSpanInMilliseconds).toBe(-98210599)
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

        it("converts api time span to dayjs duration", async () => {
            const apiTimeSpan = "1.03:16:50.599"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const dayjsDuration = dayjs.duration({ days: 1, hours: 3, minutes: 16, seconds: 50, milliseconds: 599 })

            expect(timeSpan).toStrictEqual(dayjsDuration)
        })

        it("converts api time span to formatted duration in months", async () => {
            const apiTimeSpan = "30.00:00:00"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const timeSpanInMonths = timeSpan.asMonths()

            expect(timeSpanInMonths).toBe(1)
        })

        it("converts negative api time span to formatted duration in milliseconds", async () => {
            const apiTimeSpan = "-1.03:16:50.599"

            const timeSpan = await fromApiTimeSpan(apiTimeSpan)

            const timeSpanInMilliseconds = timeSpan.asMilliseconds()

            expect(timeSpanInMilliseconds).toBe(-98210599)
        })
    })
})