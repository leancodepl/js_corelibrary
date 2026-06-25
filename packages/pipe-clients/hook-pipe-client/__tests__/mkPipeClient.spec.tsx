import { act, renderHook } from "@testing-library/react"
import { Subject } from "rxjs"
import { Pipe } from "@leancodepl/pipe"
import { mkPipeClient } from "../src"

// Notifications contract used across the tests. `topic` emits [type, data] tuples.
type ChatNotifications = {
    messagePosted: { id: string; text: string }
    messageDeleted: { id: string }
}

type ChatTopic = { channelId: string }

type Emission =
    | ["messageDeleted", { id: string }]
    | ["messagePosted", { id: string; text: string }]

/**
 * Builds a fake Pipe whose `topic` method returns a fresh Subject for every call,
 * letting tests drive emissions and observe (un)subscription.
 */
function arrangePipe() {
    const subjects: Subject<Emission>[] = []
    const topic = vi.fn((_topicType: string, _topic: unknown) => {
        const subject = new Subject<Emission>()
        subjects.push(subject)
        return subject
    })

    const pipe = { topic } as unknown as Pipe

    return {
        pipe,
        topic,
        // the Subject created by the most recent `topic` call (read after render)
        lastSubject: () => {
            const subject = subjects.at(-1)
            if (!subject) throw new Error("pipe.topic was never called")
            return subject
        },
        subjects,
    }
}

describe("mkPipeClient", () => {
    describe("createTopic / useTopic static topic()", () => {
        it("exposes a static topic() that delegates to pipe.topic with the topic type and params", () => {
            // arrange
            const { pipe, topic, lastSubject } = arrangePipe()
            const client = mkPipeClient({ pipe })
            const useChat = client.createTopic<ChatTopic, ChatNotifications>("chat")

            // act
            const observable = useChat.topic({ channelId: "general" })

            // assert
            expect(topic).toHaveBeenCalledTimes(1)
            expect(topic).toHaveBeenCalledWith("chat", { channelId: "general" })
            expect(observable).toBe(lastSubject())
        })
    })

    describe("useTopic subscription lifecycle", () => {
        it("subscribes to pipe.topic with the topic type and params on mount", () => {
            // arrange
            const { pipe, topic } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")

            // act
            renderHook(() => useChat({ channelId: "general" }, {}))

            // assert
            expect(topic).toHaveBeenCalledTimes(1)
            expect(topic).toHaveBeenCalledWith("chat", { channelId: "general" })
        })

        it("updates returned data on each emission", () => {
            // arrange
            const { pipe, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const { result } = renderHook(() => useChat({ channelId: "general" }, {}))
            const subject = lastSubject()

            // assert initial state is empty before any emission
            expect(result.current.data).toBeUndefined()

            // act
            act(() => subject.next(["messagePosted", { id: "1", text: "hi" }]))

            // assert
            expect(result.current.data).toEqual(["messagePosted", { id: "1", text: "hi" }])

            // act again with a different notification
            act(() => subject.next(["messageDeleted", { id: "1" }]))

            // assert latest emission wins
            expect(result.current.data).toEqual(["messageDeleted", { id: "1" }])
        })

        it("unsubscribes when the component unmounts", () => {
            // arrange
            const { pipe, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const { unmount } = renderHook(() => useChat({ channelId: "general" }, {}))
            const subject = lastSubject()

            expect(subject.observed).toBe(true)

            // act
            unmount()

            // assert
            expect(subject.observed).toBe(false)
        })
    })

    describe("callbacks", () => {
        it("invokes onData for every emission with the full tuple", () => {
            // arrange
            const { pipe, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const onData = vi.fn()
            renderHook(() => useChat({ channelId: "general" }, { onData }))
            const subject = lastSubject()

            // act
            act(() => subject.next(["messagePosted", { id: "1", text: "hi" }]))
            act(() => subject.next(["messageDeleted", { id: "2" }]))

            // assert
            expect(onData).toHaveBeenCalledTimes(2)
            expect(onData).toHaveBeenNthCalledWith(1, ["messagePosted", { id: "1", text: "hi" }])
            expect(onData).toHaveBeenNthCalledWith(2, ["messageDeleted", { id: "2" }])
        })

        it("invokes only the per-type callback matching the emitted notification, passing the raw payload", () => {
            // arrange
            const { pipe, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const messagePosted = vi.fn()
            const messageDeleted = vi.fn()
            renderHook(() => useChat({ channelId: "general" }, { messagePosted, messageDeleted }))
            const subject = lastSubject()

            // act
            act(() => subject.next(["messagePosted", { id: "1", text: "hi" }]))

            // assert: only the matching type handler fired, with the unwrapped payload
            expect(messagePosted).toHaveBeenCalledTimes(1)
            expect(messagePosted).toHaveBeenCalledWith({ id: "1", text: "hi" })
            expect(messageDeleted).not.toHaveBeenCalled()

            // act: a different type
            act(() => subject.next(["messageDeleted", { id: "1" }]))

            // assert
            expect(messageDeleted).toHaveBeenCalledTimes(1)
            expect(messageDeleted).toHaveBeenCalledWith({ id: "1" })
            expect(messagePosted).toHaveBeenCalledTimes(1)
        })

        it("does not throw when no callback is registered for the emitted type", () => {
            // arrange
            const { pipe, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const { result } = renderHook(() => useChat({ channelId: "general" }, {}))
            const subject = lastSubject()

            // act / assert: no onData and no per-type handler registered
            expect(() => act(() => subject.next(["messagePosted", { id: "1", text: "hi" }]))).not.toThrow()
            expect(result.current.data).toEqual(["messagePosted", { id: "1", text: "hi" }])
        })

        it("uses the latest onData callback without re-subscribing (no stale closure)", () => {
            // arrange
            const { pipe, topic, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const first = vi.fn()
            const second = vi.fn()
            const { rerender } = renderHook(({ onData }) => useChat({ channelId: "general" }, { onData }), {
                initialProps: { onData: first },
            })
            const subject = lastSubject()

            // act: swap the callback, then emit
            rerender({ onData: second })
            act(() => subject.next(["messagePosted", { id: "1", text: "hi" }]))

            // assert: latest callback fires, stale one does not, and no re-subscription happened
            expect(second).toHaveBeenCalledTimes(1)
            expect(first).not.toHaveBeenCalled()
            expect(topic).toHaveBeenCalledTimes(1)
        })
    })

    describe("topic memoization (deepEqual)", () => {
        it("does not re-subscribe when a structurally-equal topic object is passed on rerender", () => {
            // arrange
            const { pipe, topic } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const { rerender } = renderHook(({ channelId }) => useChat({ channelId }, {}), {
                initialProps: { channelId: "general" },
            })

            expect(topic).toHaveBeenCalledTimes(1)

            // act: new object reference, same shape
            rerender({ channelId: "general" })

            // assert: deepEqual prevents a new subscription
            expect(topic).toHaveBeenCalledTimes(1)
        })

        it("re-subscribes and tears down the old subscription when the topic changes", () => {
            // arrange
            const { pipe, topic, lastSubject } = arrangePipe()
            const useChat = mkPipeClient({ pipe }).createTopic<ChatTopic, ChatNotifications>("chat")
            const { rerender } = renderHook(({ channelId }) => useChat({ channelId }, {}), {
                initialProps: { channelId: "general" },
            })

            const firstSubject = lastSubject()
            expect(topic).toHaveBeenCalledTimes(1)
            expect(firstSubject.observed).toBe(true)

            // act: change the topic params
            rerender({ channelId: "random" })

            // assert: a fresh subscription is created with the new params, old one is torn down
            const secondSubject = lastSubject()
            expect(topic).toHaveBeenCalledTimes(2)
            expect(topic).toHaveBeenLastCalledWith("chat", { channelId: "random" })
            expect(firstSubject.observed).toBe(false)
            expect(secondSubject.observed).toBe(true)
        })

        it("treats deeply-nested equal topics as unchanged", () => {
            // arrange
            const { pipe, topic } = arrangePipe()
            const useNested = mkPipeClient({ pipe }).createTopic<{ filter: { tags: string[] } }, ChatNotifications>(
                "nested",
            )
            const { rerender } = renderHook(({ tags }) => useNested({ filter: { tags } }, {}), {
                initialProps: { tags: ["a", "b"] },
            })

            expect(topic).toHaveBeenCalledTimes(1)

            // act: new array/object references but identical contents
            rerender({ tags: ["a", "b"] })

            // assert
            expect(topic).toHaveBeenCalledTimes(1)

            // act: actually change nested contents
            rerender({ tags: ["a", "c"] })

            // assert
            expect(topic).toHaveBeenCalledTimes(2)
        })
    })

    describe("multiple topics from the same client", () => {
        it("creates independent hooks that subscribe with their own topic types", () => {
            // arrange
            const { pipe, topic } = arrangePipe()
            const client = mkPipeClient({ pipe })
            const useChat = client.createTopic<ChatTopic, ChatNotifications>("chat")
            const usePresence = client.createTopic<{ userId: string }, ChatNotifications>("presence")

            // act
            renderHook(() => useChat({ channelId: "general" }, {}))
            renderHook(() => usePresence({ userId: "u1" }, {}))

            // assert
            expect(topic).toHaveBeenNthCalledWith(1, "chat", { channelId: "general" })
            expect(topic).toHaveBeenNthCalledWith(2, "presence", { userId: "u1" })
        })
    })
})
