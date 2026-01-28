import { format, parse } from "date-fns"
import * as timezoneMock from "timezone-mock"
import { ApiDateOnly, fromApiDate } from "../../src"

describe("fromApiDate", () => {
  it("handles undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const date = fromApiDate(undefined)

    expect(date).toBeUndefined()
  })

  const apiDate = "1990-02-24"
  const dateFormat = "yyyy-MM-dd"
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm:ssXXX"

  describe("run in GMT+5", () => {
    const timezone = "Etc/GMT+5"

    beforeAll(() => {
      timezoneMock.register(timezone)
    })

    afterAll(() => {
      timezoneMock.unregister()
    })

    it("converts api date to local timezone date-fns object", () => {
      const date = fromApiDate(apiDate as unknown as ApiDateOnly)

      expect(date).toStrictEqual(parse(apiDate, dateFormat, new Date()))
    })

    it("converts api date to formatted local timezone date", () => {
      const date = format(fromApiDate(apiDate as unknown as ApiDateOnly), dateTimeFormat)

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

    it("converts api date to local timezone date-fns object", () => {
      const date = fromApiDate(apiDate as unknown as ApiDateOnly)

      expect(date).toStrictEqual(parse(apiDate, dateFormat, new Date()))
    })

    it("converts api date to formatted local timezone date", () => {
      const date = format(fromApiDate(apiDate as unknown as ApiDateOnly), dateTimeFormat)

      expect(date).toBe("1990-02-24T00:00:00Z")
    })
  })
})
