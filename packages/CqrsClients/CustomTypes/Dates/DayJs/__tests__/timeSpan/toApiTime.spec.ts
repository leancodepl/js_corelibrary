import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezoneMock from "timezone-mock"
import { toApiTime } from "../../src"

dayjs.extend(customParseFormat)

describe("toApiTime", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts local dayjs object to api time", async () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = await toApiTime(dateTime)

            expect(apiTime).toBe("16:30:00.000000")
        })

        it("converts utc dayjs object to api time", async () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = await toApiTime(dateTime, { isUtc: true })

            expect(apiTime).toBe("11:30:00.000000")
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

        it("converts local dayjs object to api time", async () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = await toApiTime(dateTime)

            expect(apiTime).toBe("11:30:00.000000")
        })

        it("converts utc dayjs object to api time", async () => {
            const dateTime = dayjs("1990-02-24, 11:30", "YYYY-MM-DD, HH:mm")
            const apiTime = await toApiTime(dateTime, { isUtc: true })

            expect(apiTime).toBe("11:30:00.000000")
        })
    })
})

