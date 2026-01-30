import { FunctionComponent, ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
// eslint-disable-next-line import/no-extraneous-dependencies
import { vi } from "vitest"
import { mkCqrsClient } from "../src"
import { mockApi, mockCommand, mockQuery } from "./_utils"

vi.mock("rxjs/ajax")

describe("mkCqrsClient", () => {
  it("optimistically updates queries value", async () => {
    // arrange
    const { useTestCommand, useTestQuery, wrapper } = arrangeClient()

    mockApi(mockCommand(useTestCommand, 200), mockQuery(useTestQuery, { value: "abc", hasMore: false }))

    const { result: commandResult } = renderHook(
      () =>
        useTestCommand({
          optimisticUpdate: ({ Value }) => [
            useTestQuery.optimisticUpdate(() => ({ value: Value, hasMore: false }), {}),
          ],
        }),
      { wrapper },
    )

    const { result: queryResult1 } = renderHook(() => useTestQuery({ Page: 0 }), { wrapper })
    const { result: queryResult2 } = renderHook(() => useTestQuery({ Page: 1 }), { wrapper })

    // act
    act(() => void commandResult.current.mutateAsync({ Value: "optimistic-update" }))

    // assert
    await waitFor(() => {
      expect(queryResult1.current.data?.value).toBe("optimistic-update")
      expect(queryResult2.current.data?.value).toBe("optimistic-update")
    })
  })

  it("correctly reverts to previous value on command fail", async () => {
    // arrange
    const { useTestCommand, useTestQuery, wrapper } = arrangeClient()

    mockApi(mockCommand(useTestCommand, 500), mockQuery(useTestQuery, { value: "test", hasMore: false }))

    const { result: commandResult } = renderHook(
      () =>
        useTestCommand({
          optimisticUpdate: ({ Value }) => [
            useTestQuery.optimisticUpdate(() => ({ value: Value, hasMore: false }), {}),
          ],
        }),
      { wrapper },
    )

    const { result: queryResult } = renderHook(
      () => useTestQuery({ Page: 0 }, { initialData: () => ({ value: "initial", hasMore: false }) }),
      { wrapper },
    )

    // act
    act(() => void commandResult.current.mutate({ Value: "optimistic-update" }))

    // assert
    await waitFor(() => expect(queryResult.current.data?.value).toEqual("optimistic-update"))
    await waitFor(() => expect(queryResult.current.data?.value).toEqual("initial"))
  })

  it("correctly fetches infinite queries", async () => {
    // arrange
    const { useTestQuery, wrapper } = arrangeClient()

    mockApi(mockQuery(useTestQuery, ({ Page }) => ({ value: `page-${Page}`, hasMore: Page < 2 })))

    // act
    const { result: queryResult } = renderHook(
      () =>
        useTestQuery.infinite(
          { Page: 0 },
          {
            getNextPageParam: (lastPage, pages, lastPageParam) =>
              lastPage.hasMore ? { Page: lastPageParam.Page + 1 } : undefined,
          },
        ),
      { wrapper },
    )

    await waitFor(() => expect(queryResult.current.data?.pages.length).toEqual(1))
    await waitFor(() => expect(queryResult.current.data?.pages.at(0)?.value).toEqual("page-0"))

    act(() => void queryResult.current.fetchNextPage())

    // assert
    await waitFor(() => expect(queryResult.current.data?.pages.length).toEqual(2))
    await waitFor(() => expect(queryResult.current.data?.pages.at(1)?.value).toEqual("page-1"))
  })
})

function arrangeClient() {
  const queryClient = new QueryClient()

  const client = mkCqrsClient({
    cqrsEndpoint: "http://test.endpoint",
    queryClient,
  })

  const wrapper: FunctionComponent<{ children: ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  const useTestCommand = client.createCommand<{ Value: string }, { Value: 1 }>("TestCommand", { Value: 1 })
  const useTestQuery = client.createQuery<{ Page: number }, { Value: string; HasMore: boolean }>("TestQuery")

  return { useTestCommand, useTestQuery, wrapper }
}
