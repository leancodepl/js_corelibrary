import dayjs from "dayjs"
import timezoneMock from "timezone-mock"
import { toApiDateTime } from "../../src"

describe("toApiDateTime", () => {
    describe("run in GMT+5 timezone", () => {
        const timezone = "Etc/GMT+5"

        beforeAll(() => {
            timezoneMock.register(timezone)
        })

        afterAll(() => {
            timezoneMock.unregister()
        })

        it("converts local dayjs object to utc api datetime", () => {
            const date = dayjs("1990-02-24")
            const dateTime = toApiDateTime(date)

            expect(dateTime).toBe("1990-02-24T05:00:00.000Z")
        })

        it("converts local dayjs datetime based object to utc api datetime", () => {
            const date = toApiDateTime(dayjs("1990-02-24T10:30:00.000Z"))

            expect(date).toBe("1990-02-24T10:30:00.000Z")
        })

        it("converts utc dayjs datetime based object to utc api datetime", () => {
            const date = toApiDateTime(dayjs("1990-02-24"))

            expect(date).toBe("1990-02-24T05:00:00.000Z")
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

        it("converts local dayjs object to utc api datetime", () => {
            const date = dayjs("1990-02-24")
            const dateTime = toApiDateTime(date)

            expect(dateTime).toBe("1990-02-24T00:00:00.000Z")
        })

        it("converts local dayjs datetime based object to utc api datetime", () => {
            const date = toApiDateTime(dayjs("1990-02-24T10:30:00.000Z"))

            expect(date).toBe("1990-02-24T10:30:00.000Z")
        })

        it("converts utc dayjs datetime based object to utc api datetime", () => {
            const date = toApiDateTime(dayjs("1990-02-24"))

            expect(date).toBe("1990-02-24T00:00:00.000Z")
        })
    })
})
