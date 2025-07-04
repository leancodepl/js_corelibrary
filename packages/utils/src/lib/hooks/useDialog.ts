"use client"

import { useCallback, useState } from "react"
import { useSetUnset } from "./useSetUnset"

/**
 * React hook for managing dialog state with optional callback after closing.
 * Provides convenient open/close functions and tracks the dialog's open state.
 * 
 * @param onAfterClose - Optional callback function to execute after the dialog closes
 * @returns Object containing dialog state and control functions
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { isDialogOpen, openDialog, closeDialog } = useDialog(() => {
 *     console.log('Dialog closed');
 *   });
 *   
 *   return (
 *     <div>
 *       <button onClick={openDialog}>Open Dialog</button>
 *       {isDialogOpen && <Dialog onClose={closeDialog} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDialog(onAfterClose?: () => void) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [openDialog, closeDialog] = useSetUnset(setIsDialogOpen)

    const close = useCallback(() => {
        closeDialog()

        if (onAfterClose) setTimeout(onAfterClose)
    }, [closeDialog, onAfterClose])

    return { isDialogOpen, openDialog, closeDialog: close }
}
