import { useEffect, useState } from "react"
import { NotificationsUnion, Pipe } from "@leancodepl/pipe"

export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            return (topic: TTopic) => {
                const [data, setData] = useState<NotificationsUnion<TNotifications>>()

                const [internalTopic, setInternalTopic] = useState<TTopic>(topic)
                if (JSON.stringify(internalTopic) !== JSON.stringify(topic)) {
                    setInternalTopic(topic)
                }

                useEffect(() => {
                    const subscription = pipe
                        .topic<TNotifications>(topicType, internalTopic)
                        .subscribe(notification => {
                            setData(notification)
                        })

                    return () => subscription.unsubscribe()
                }, [internalTopic])

                return { data }
            }
        },
    }
}
