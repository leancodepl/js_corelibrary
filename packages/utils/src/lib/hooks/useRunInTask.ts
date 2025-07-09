"use client"

import { useCallback, useState } from "react"

/**
 * React hook for tracking async task execution with loading state.
 * Automatically manages a loading counter and provides a wrapper function for tasks.
 * 
 * @returns A tuple containing [isLoading: boolean, runInTask: function]
 * @example
 * ```typescript
 * function MyComponent() {
 *   const [isLoading, runInTask] = useRunInTask();
 *   
 *   const handleSave = async () => {
 *     await runInTask(async () => {
 *       await saveData();
 *     });
 *   };
 *   
 *   return (
 *     <button onClick={handleSave} disabled={isLoading}>
 *       {isLoading ? 'Saving...' : 'Save'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useRunInTask() {
    const [runningTasks, setRunningTasks] = useState(0)

    const runInTask = useCallback(async <T>(task: () => Promise<T> | T) => {
        setRunningTasks(runningTasks => runningTasks + 1)
        try {
            return await task()
        } finally {
            setRunningTasks(runningTasks => runningTasks - 1)
        }
    }, [])
    return [runningTasks > 0, runInTask] as const
}
