import dayjs from "dayjs"
import timezoneMock from "timezone-mock"
import { toApiDateTimeOffset } from "../../src"

describe("toApiDateTimeOffset", () => {
    it("handles undefined", () => {
        const apiDateTimeOffset = toApiDateTimeOffset(undefined)

        expect(apiDateTimeOffset).toBeUndefined()
    })

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts local dayjs object to apiDateTimeOffset", () => {
            const date = dayjs("1990-02-24")
            const dateTimeOffset = toApiDateTimeOffset(date)

            expect(dateTimeOffset).toBe("1990-02-24T00:00:00.000-05:00")
        })

        it("converts dayjs datetime based object to apiDateTimeOffset", () => {
            const dateTimeOffset = toApiDateTimeOffset(dayjs("1990-02-24T10:30:00+02:00"))

            expect(dateTimeOffset).toBe("1990-02-24T03:30:00.000-05:00")
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

        it("converts local dayjs object to apiDateTimeOffset", () => {
            const date = dayjs("1990-02-24")
            const dateTimeOffset = toApiDateTimeOffset(date)

            expect(dateTimeOffset).toBe("1990-02-24T00:00:00.000+00:00")
        })

        it("converts dayjs datetime based object to apiDateTimeOffset", () => {
            const dateTimeOffset = toApiDateTimeOffset(dayjs("1990-02-24T10:30:00+02:00"))

            expect(dateTimeOffset).toBe("1990-02-24T08:30:00.000+00:00")
        })
    })
})
