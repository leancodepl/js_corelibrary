import { Observable, of, Subject, throwError } from "rxjs"
import { Pipe } from "@leancodepl/pipe"
import { mkPipeClient } from "../src"

type TestNotifications = {
  UserUpdated: { id: string; name: string }
  UserDeleted: { id: string }
}

type Notification = [string, unknown]

function createMockPipe() {
  const topic = vi.fn()
  return { pipe: { topic } as unknown as Pipe, topic }
}

describe("mkPipeClient", () => {
  it("should return an object exposing createTopic", () => {
    const { pipe } = createMockPipe()

    const client = mkPipeClient({ pipe })

    expect(client.createTopic).toBeDefined()
    expect(typeof client.createTopic).toBe("function")
  })

  describe("createTopic", () => {
    it("should return a topic factory function without calling pipe.topic", () => {
      const { pipe, topic } = createMockPipe()
      const client = mkPipeClient({ pipe })

      const chatTopic = client.createTopic<{ roomId: string }, TestNotifications>("chat")

      expect(typeof chatTopic).toBe("function")
      // Creating the factory must not subscribe/call into the pipe yet (lazy).
      expect(topic).not.toHaveBeenCalled()
    })

    it("should call pipe.topic with the topic type and arguments when the factory is invoked", () => {
      const { pipe, topic } = createMockPipe()
      const observable = of<Notification>(["UserUpdated", { id: "1", name: "Ada" }])
      topic.mockReturnValue(observable)

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      const result = userTopic({ userId: "123" })

      expect(topic).toHaveBeenCalledTimes(1)
      expect(topic).toHaveBeenCalledWith("User", { userId: "123" })
      expect(result).toBe(observable)
    })

    it("should forward the exact topic object reference to pipe.topic", () => {
      const { pipe, topic } = createMockPipe()
      topic.mockReturnValue(of())

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      const topicArgs = { userId: "abc" }
      userTopic(topicArgs)

      expect(topic.mock.calls[0]?.[1]).toBe(topicArgs)
    })

    it("should emit the notifications produced by the underlying pipe observable", () => {
      const { pipe, topic } = createMockPipe()
      const emitted: Notification[] = []
      const updated: Notification = ["UserUpdated", { id: "1", name: "Ada" }]
      const deleted: Notification = ["UserDeleted", { id: "1" }]
      topic.mockReturnValue(of(updated, deleted))

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      userTopic({ userId: "1" }).subscribe(value => emitted.push(value as Notification))

      expect(emitted).toEqual([
        ["UserUpdated", { id: "1", name: "Ada" }],
        ["UserDeleted", { id: "1" }],
      ])
    })

    it("should stream live notifications pushed through a subject", () => {
      const { pipe, topic } = createMockPipe()
      const subject = new Subject<Notification>()
      topic.mockReturnValue(subject.asObservable())

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      const received: Notification[] = []
      userTopic({ userId: "1" }).subscribe(value => received.push(value as Notification))

      expect(received).toEqual([])

      subject.next(["UserUpdated", { id: "1", name: "Ada" }])
      subject.next(["UserDeleted", { id: "1" }])

      expect(received).toEqual([
        ["UserUpdated", { id: "1", name: "Ada" }],
        ["UserDeleted", { id: "1" }],
      ])
    })

    it("should propagate errors from the underlying observable", () => {
      const { pipe, topic } = createMockPipe()
      const error = new Error("subscription failed")
      topic.mockReturnValue(throwError(() => error))

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      let captured: unknown
      userTopic({ userId: "1" }).subscribe({ error: e => (captured = e) })

      expect(captured).toBe(error)
    })

    it("should support unsubscribing from the returned observable", () => {
      const { pipe, topic } = createMockPipe()
      const teardown = vi.fn()
      topic.mockReturnValue(new Observable(() => teardown))

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      const subscription = userTopic({ userId: "1" }).subscribe()
      expect(teardown).not.toHaveBeenCalled()

      subscription.unsubscribe()
      expect(teardown).toHaveBeenCalledTimes(1)
    })

    it("should call pipe.topic once per factory invocation", () => {
      const { pipe, topic } = createMockPipe()
      topic.mockReturnValue(of())

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")

      userTopic({ userId: "1" })
      userTopic({ userId: "2" })

      expect(topic).toHaveBeenCalledTimes(2)
      expect(topic).toHaveBeenNthCalledWith(1, "User", { userId: "1" })
      expect(topic).toHaveBeenNthCalledWith(2, "User", { userId: "2" })
    })

    it("should keep distinct topic types isolated", () => {
      const { pipe, topic } = createMockPipe()
      const userObs = of()
      const chatObs = of()
      topic.mockImplementation((type: string) => (type === "User" ? userObs : chatObs))

      const client = mkPipeClient({ pipe })
      const userTopic = client.createTopic<{ userId: string }, TestNotifications>("User")
      const chatTopic = client.createTopic<{ roomId: string }, TestNotifications>("chat")

      const userResult = userTopic({ userId: "1" })
      const chatResult = chatTopic({ roomId: "r1" })

      expect(topic).toHaveBeenNthCalledWith(1, "User", { userId: "1" })
      expect(topic).toHaveBeenNthCalledWith(2, "chat", { roomId: "r1" })
      expect(userResult).toBe(userObs)
      expect(chatResult).toBe(chatObs)
    })

    it("should forward empty topic arguments unchanged", () => {
      const { pipe, topic } = createMockPipe()
      topic.mockReturnValue(of())

      const client = mkPipeClient({ pipe })
      const emptyTopic = client.createTopic<Record<string, never>, TestNotifications>("Empty")

      emptyTopic({})

      expect(topic).toHaveBeenCalledWith("Empty", {})
    })
  })

  it("should bind each client to its own pipe instance", () => {
    const first = createMockPipe()
    const second = createMockPipe()
    first.topic.mockReturnValue(of())
    second.topic.mockReturnValue(of())

    const clientA = mkPipeClient({ pipe: first.pipe })
    const clientB = mkPipeClient({ pipe: second.pipe })

    clientA.createTopic<{ userId: string }, TestNotifications>("User")({ userId: "1" })

    expect(first.topic).toHaveBeenCalledTimes(1)
    expect(second.topic).not.toHaveBeenCalled()

    clientB.createTopic<{ roomId: string }, TestNotifications>("chat")({ roomId: "r1" })

    expect(first.topic).toHaveBeenCalledTimes(1)
    expect(second.topic).toHaveBeenCalledTimes(1)
  })
})
