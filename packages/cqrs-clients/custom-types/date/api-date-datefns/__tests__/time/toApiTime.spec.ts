import { parse } from "date-fns"
import * as timezoneMock from "timezone-mock"
import { toApiTime } from "../../src"

const dateTimeFormat = "yyyy-MM-dd, HH:mm"

describe("toApiTime", () => {
  it("handles undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
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

    it("converts date-fns object to local api time", () => {
      const dateTime = parse("1990-02-24, 11:30", dateTimeFormat, new Date())
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

    it("converts local date-fns object to api time", () => {
      const dateTime = parse("1990-02-24, 11:30", dateTimeFormat, new Date())
      const apiTime = toApiTime(dateTime)

      expect(apiTime).toBe("11:30:00.000")
    })
  })
})
