import { useEffect, useRef, useState } from "react"
import deepEqual from "deep-equal"
import { share } from "rxjs"
import { NotificationsUnion, Pipe } from "@leancodepl/pipe"

/**
 * Creates React hooks for real-time data subscriptions using "@leancodepl/pipe".
 * 
 * @param pipe - Pipe instance from "@leancodepl/pipe"
 * @returns Object containing `createTopic` method for creating typed hooks
 * @example
 * ```typescript
 * const pipe = createPipe({ url: 'wss://api.example.com/pipe' });
 * const pipeClient = mkPipeClient({ pipe });
 * 
 * const useChatTopic = pipeClient.createTopic('chat');
 * ```
 */
export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            function useTopic(topic: TTopic, { onData }: UseSubscriptionOptions<TNotifications>) {
                const [data, setData] = useState<NotificationsUnion<TNotifications>>()

                const onDataRef = useRef(onData)
                onDataRef.current = onData

                const memoizedTopic = useRef<TTopic>()
                if (memoizedTopic.current === undefined || !deepEqual(memoizedTopic.current, topic)) {
                    memoizedTopic.current = topic
                }

                useEffect(() => {
                    const topic$ = pipe.topic<TNotifications>(topicType, memoizedTopic.current).pipe(share())

                    const subscription = topic$.subscribe(data => {
                        setData(data)
                        onDataRef.current?.(data)
                    })

                    return () => subscription.unsubscribe()
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [memoizedTopic.current])

                return { data }
            }

            useTopic.topic = (topic: TTopic) => pipe.topic<TNotifications>(topicType, topic)

            return useTopic
        },
    }
}

export type UseSubscriptionOptions<TNotifications extends Record<string, unknown>> = {
    onData?: (data: NotificationsUnion<TNotifications>) => void
}
