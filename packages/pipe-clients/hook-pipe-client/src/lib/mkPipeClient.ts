import { useEffect, useRef, useState } from "react"
import deepEqual from "deep-equal"
import { Observable, share } from "rxjs"
import { NotificationsUnion, Pipe } from "@leancodepl/pipe"

export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            return (topic: TTopic, { onData }: UseSubscriptionOptions<TNotifications>) => {
                const [data, setData] = useState<NotificationsUnion<TNotifications>>()
                const [topic$, setTopic] = useState<Observable<NotificationsUnion<TNotifications>>>()

                const memoizedTopic = useRef<TTopic>()

                if (memoizedTopic.current === undefined || !deepEqual(memoizedTopic.current, topic)) {
                    memoizedTopic.current = topic
                }

                useEffect(() => {
                    const topic$ = pipe.topic<TNotifications>(topicType, memoizedTopic.current).pipe(share())
                    setTopic(topic$)

                    const subscription = topic$.subscribe(setData)

                    return () => subscription.unsubscribe()
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [memoizedTopic.current])

                useEffect(() => {
                    if (!topic$ || !onData) return

                    const subscription = topic$.subscribe(onData)

                    return () => subscription.unsubscribe()
                }, [onData, topic$])

                return { data }
            }
        },
    }
}

type UseSubscriptionOptions<TNotifications extends Record<string, unknown>> = {
    onData?: (data: NotificationsUnion<TNotifications>) => void
}
