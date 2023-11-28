import { useEffect, useState } from "react";
import { NotificationsUnion, Pipe } from "@leancodepl/pipe";

export function mkPipeClient({ pipe }: { pipe: Pipe }) {
    return {
        createTopic<TTopic, TNotifications extends Record<string, unknown>>(topicType: string) {
            return (topic: TTopic, { onData }: UseSubscriptionOptions<TNotifications>) => {
                const [data, setData] = useState<NotificationsUnion<TNotifications>>();

                useEffect(() => {
                    const subscription = pipe.topic<TNotifications>(topicType, topic).subscribe(notification => {
                        onData?.(notification);
                        setData(notification);
                    });

                    return () => subscription.unsubscribe();
                }, [onData, topic]);

                return { data };
            };
        },
    };
}

type UseSubscriptionOptions<TNotifications extends Record<string, unknown>> = {
    onData?: (data: NotificationsUnion<TNotifications>) => void;
};
