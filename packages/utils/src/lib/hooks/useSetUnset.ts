"use client";

import { Dispatch, SetStateAction, useCallback } from "react";

export function useSetUnset(set: Dispatch<SetStateAction<boolean>>) {
    return [useCallback(() => set(true), [set]), useCallback(() => set(false), [set])] as const;
}
