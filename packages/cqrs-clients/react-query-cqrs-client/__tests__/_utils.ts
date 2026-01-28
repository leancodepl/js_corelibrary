import { delay, mergeMap, Observable, of, throwError } from "rxjs"
import { AjaxConfig, AjaxError, AjaxResponse } from "rxjs/ajax"
import { ajax } from "rxjs/internal/ajax/ajax"
import { ApiResponse, CommandResult, ValidationError } from "@leancodepl/cqrs-client-base"

type MockableFunction = (...args: any[]) => any

function asMock<Func extends MockableFunction>(mockedFunc: Func) {
  return mockedFunc as jest.MockedFunction<typeof mockedFunc>
}

interface CommandLike<TCommand, TErrorCodes extends Record<string, number>> {
  type: string
  (command: TCommand): any
  mapError: (e: unknown) => ApiResponse<CommandResult<TErrorCodes>>
}

type CommandResponse<TErrorCodes extends Record<string, number>> =
  | 200
  | 401
  | 403
  | 500
  | ValidationError<TErrorCodes>[]

export function mockCommand<TCommand, TErrorCodes extends Record<string, number>>(
  command: CommandLike<TCommand, TErrorCodes>,
  resultOrResultMap: ((params: TCommand) => CommandResponse<TErrorCodes>) | CommandResponse<TErrorCodes>,
) {
  return (config: AjaxConfig) => {
    if (!config.url.endsWith(`command/${command.type}`)) return

    const result = typeof resultOrResultMap === "function" ? resultOrResultMap(config.body) : resultOrResultMap

    if (result === 401 || result === 403 || result === 500) {
      return cqrsError(result, {})
    }

    if (result === 200) {
      return cqrsResponse<CommandResult<TErrorCodes>>({ WasSuccessful: true })
    }

    return cqrsError(422, result)
  }
}

interface QueryLike<TQuery, TResult> {
  type: string
  (query: TQuery): any
  fetcher: (...params: any[]) => Observable<TResult>
}

type QueryResponse<TResult> = 401 | 403 | 500 | TResult

export function mockQuery<TQuery, TResult extends object>(
  query: QueryLike<TQuery, TResult>,
  resultOrResultMap: ((params: TQuery) => QueryResponse<TResult>) | QueryResponse<TResult>,
) {
  return (config: AjaxConfig) => {
    if (!config.url.endsWith(`query/${query.type}`)) return

    const result = typeof resultOrResultMap === "function" ? resultOrResultMap(config.body) : resultOrResultMap

    if (result === 401 || result === 403 || result === 500) {
      return cqrsError(result, {})
    }

    return cqrsResponse(JSON.stringify(result))
  }
}

function cqrsError(status: number, response: object) {
  return of().pipe(
    delay(100),
    mergeMap(() =>
      throwError(
        () =>
          new AjaxError(
            "message",
            {
              status,
              responseType: "json",
              response,
            } as any,
            null as any,
          ),
      ),
    ),
  )
}

function cqrsResponse<TResponse>(response: TResponse) {
  return of({ status: 200, response } as AjaxResponse<TResponse>).pipe(delay(100))
}

export function mockApi(...mocks: Array<(config: AjaxConfig) => Observable<AjaxResponse<unknown>> | undefined>) {
  asMock(ajax).mockImplementation((config: AjaxConfig | string) => {
    if (typeof config === "string") throw new Error("Mock can't be used with url only")

    for (const mock of mocks) {
      const result = mock(config)

      if (result) return result
    }

    throw new Error(`${config.url} is not mocked`)
  })
}
