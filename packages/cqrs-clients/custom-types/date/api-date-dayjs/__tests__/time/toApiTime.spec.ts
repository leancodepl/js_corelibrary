import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezoneMock from "timezone-mock"
import { toApiTime } from "../../src"

dayjs.extend(customParseFormat)

describe("toApiTime", () => {
    it("handles undefined", () => {
        const apiTime = toApiTime(undefined)

        expect(apiTime).toBeUndefined()
    })

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts dayjs object to local api time", () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = toApiTime(dateTime)

            expect(apiTime).toBe("11:30:00.000")
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

        it("converts local dayjs object to api time", () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = toApiTime(dateTime)

            expect(apiTime).toBe("11:30:00.000")
        })
    })
})
