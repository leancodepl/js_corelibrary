import { Pipe } from "@leancodepl/pipe"

export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            return (topic: TTopic) => pipe.topic<TNotifications>(topicType, topic)
        },
    }
}
