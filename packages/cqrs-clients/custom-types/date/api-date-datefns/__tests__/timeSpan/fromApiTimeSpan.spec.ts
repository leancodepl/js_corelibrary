import * as timezoneMock from "timezone-mock"
import { ApiTimeSpan, fromApiTimeSpan } from "../../src"

describe("fromApiTimeSpan", () => {
  it("handles undefined", () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const timeSpan = fromApiTimeSpan(undefined)

    expect(timeSpan).toBeUndefined()
  })

  describe("run in GMT+5 timezone", () => {
    const timezone = "Etc/GMT+5"

    beforeAll(() => {
      timezoneMock.register(timezone)
    })

    afterAll(() => {
      timezoneMock.unregister()
    })

    it("converts api timespan to difference in milliseconds", () => {
      const apiTimeSpan = "1.03:16:50.599"

      const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan)

      expect(timeSpan).toBe(98_210_599)
    })

    it("converts negative api timespan to difference in milliseconds", () => {
      const apiTimeSpan = "-1.03:16:50.599"

      const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan)

      expect(timeSpan).toBe(-98_210_599)
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

    it("converts api timespan to difference in milliseconds", () => {
      const apiTimeSpan = "1.03:16:50.599"

      const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan)

      expect(timeSpan).toBe(98_210_599)
    })

    it("converts negative api timespan to difference in milliseconds", () => {
      const apiTimeSpan = "-1.03:16:50.599"

      const timeSpan = fromApiTimeSpan(apiTimeSpan as unknown as ApiTimeSpan)

      expect(timeSpan).toBe(-98_210_599)
    })
  })
})
