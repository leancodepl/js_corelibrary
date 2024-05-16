import { format } from "date-fns"
import * as timezoneMock from "timezone-mock"
import { ApiTimeOnly, fromApiTime } from "../../src"

describe("fromApiTime", () => {
    it("handles undefined", () => {
        const time = fromApiTime(undefined)

        expect(time).toBeUndefined()
    })

    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts local api time to formatted time", () => {
            const apiTime = "11:30:00.000"

            const time = format(fromApiTime(apiTime as unknown as ApiTimeOnly), "HH:mm:ss")

            expect(time).toBe("11:30:00")
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

        it("converts local api time to formatted time", () => {
            const apiTime = "11:30:00.000"

            const time = format(fromApiTime(apiTime as unknown as ApiTimeOnly), "HH:mm:ss")

            expect(time).toBe("11:30:00")
        })
    })
})
