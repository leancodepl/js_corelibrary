import { ComponentType, ReactNode } from "react"
import * as Slot from "@radix-ui/react-slot"
import { CommonButtonProps } from "packages/kratos/src/lib/utils"

type SubmitProps = {
  children: ReactNode
}

export function Submit({ children }: SubmitProps) {
  const Comp: ComponentType<CommonButtonProps> = Slot.Root

  return <Comp type="submit">{children}</Comp>
}
