import { Pipe } from "@leancodepl/pipe"

/**
 * Creates RxJS-based topic functions for real-time data subscriptions using "@leancodepl/pipe".
 * 
 * @param pipe - Pipe instance from "@leancodepl/pipe"
 * @returns Object containing `createTopic` method for creating typed observables
 * @example
 * ```typescript
 * const pipe = createPipe({ url: 'wss://api.example.com/pipe' });
 * const pipeClient = mkPipeClient({ pipe });
 * 
 * const chatTopic = pipeClient.createTopic('chat');
 * const messages$ = chatTopic({ roomId: 'room1' });
 * ```
 */
export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            return (topic: TTopic) => pipe.topic<TNotifications>(topicType, topic)
        },
    }
}
