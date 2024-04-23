"use client";

import { useCallback, useState } from "react";

export function useRunInTask() {
    const [runningTasks, setRunningTasks] = useState(0);

    const runInTask = useCallback(async <T>(task: () => Promise<T> | T) => {
        setRunningTasks(runningTasks => runningTasks + 1);
        try {
            return await task();
        } finally {
            setRunningTasks(runningTasks => runningTasks - 1);
        }
    }, []);
    return [runningTasks > 0, runInTask] as const;
}
