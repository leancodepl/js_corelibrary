"use client"

import { useCallback, useState } from "react"
import { useSetUnset } from "./useSetUnset"

export function useDialog(onAfterClose?: () => void) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openDialog, closeDialog] = useSetUnset(setIsDialogOpen)

    const close = useCallback(() => {
        closeDialog()

        if (onAfterClose) setTimeout(onAfterClose)
    }, [closeDialog, onAfterClose])

    return { isDialogOpen, openDialog, closeDialog: close }
}
