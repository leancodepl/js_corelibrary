"use client"

import { useMemo } from "react"
import { Unpromisify } from "../types"
import { useRunInTask } from "./useRunInTask"

type AnyFunction = (...args: any[]) => any

export function useBoundRunInTask<T extends AnyFunction>(block: T): [boolean, T]
export function useBoundRunInTask<T extends AnyFunction>(block: T | undefined): [boolean, T | undefined]
export function useBoundRunInTask<T extends AnyFunction>(block: T | undefined) {
    const [isRunning, runInTask] = useRunInTask()

    const runBlockInTask = useMemo(
        () =>
            block ? (...args: Parameters<T>) => runInTask<Unpromisify<ReturnType<T>>>(() => block(...args)) : undefined,
        [block, runInTask],
    )

    return [isRunning, runBlockInTask] as const
}
