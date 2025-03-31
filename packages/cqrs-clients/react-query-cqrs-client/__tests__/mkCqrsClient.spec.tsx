/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import React, { FunctionComponent, ReactNode } from "react"
import { mkCqrsClient } from "../src"
import { mockApi, mockCommand, mockQuery } from "./_utils"

jest.mock("rxjs/internal/ajax/ajax")

describe("mkCqrsClient", () => {
    it("optimistically updates queries value", async () => {
        // arrange
        const { useTestCommand, useTestQuery, wrapper } = arrangeClient()

        mockApi(mockCommand(useTestCommand, 200), mockQuery(useTestQuery, { value: "abc" }))

        const { result: commandResult } = renderHook(
            () =>
                useTestCommand({
                    optimisticUpdate: ({ Value }) => [useTestQuery.optimisticUpdate(() => ({ value: Value }), {})],
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

        mockApi(mockCommand(useTestCommand, 500), mockQuery(useTestQuery, { value: "test" }))

        const { result: commandResult } = renderHook(
            () =>
                useTestCommand({
                    optimisticUpdate: ({ Value }) => [useTestQuery.optimisticUpdate(() => ({ value: Value }), {})],
                }),
            { wrapper },
        )

        const { result: queryResult } = renderHook(
            () => useTestQuery({ Page: 0 }, { initialData: () => ({ value: "initial" }) }),
            { wrapper },
        )

        // act
        act(() => void commandResult.current.mutate({ Value: "optimistic-update" }))

        // assert
        await waitFor(() => expect(queryResult.current.data?.value).toEqual("optimistic-update"))
        await waitFor(() => expect(queryResult.current.data?.value).toEqual("initial"))
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
    const useTestQuery = client.createQuery<{ Page: number }, { Value: string }>("TestQuery")

    return { useTestCommand, useTestQuery, wrapper }
}
