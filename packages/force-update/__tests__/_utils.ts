import { delay, of, throwError } from "rxjs"
import { AjaxConfig, AjaxResponse } from "rxjs/ajax"
import { ajax } from "rxjs/internal/ajax/ajax"

function asMock<Func extends (...args: any[]) => any>(mockedFunc: Func) {
  return mockedFunc as jest.MockedFunction<typeof mockedFunc>
}

// version endpoint is mocked to return next version from the array in each call
// if all versions were used, the last version is returned indefinitely
// if the version is null, it means that the network error occurred
export function mockVersionEndpoint(versions: (string | null)[]) {
  let currentVersionIndex = 0

  asMock(ajax).mockImplementation((config: AjaxConfig | string) => {
    if (typeof config === "string") throw new Error("Mock can't be used with url only")

    if (config.url !== "/version") throw new Error(`${config.url} is not mocked`)

    const version = versions.at(currentVersionIndex)
    currentVersionIndex = Math.min(currentVersionIndex + 1, versions.length - 1)

    if (!version) {
      return throwError(() => new Error("Network error"))
    }

    return of({ status: 200, response: version } as AjaxResponse<string>).pipe(delay(100))
  })
}
