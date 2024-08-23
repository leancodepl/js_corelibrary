import { useEffect } from "react"
import { UiNode, UiNodeScriptAttributes } from "@ory/client"
import { filterNodesByGroups } from "../utils/filterNodesByGroups"

export function useScriptNodes({ nodes, excludeScripts }: { nodes: UiNode[]; excludeScripts?: boolean }) {
    useEffect(() => {
        if (excludeScripts) {
            return
        }

        const scriptNodes = filterNodesByGroups({
            nodes,
            groups: "webauthn",
            attributes: "text/javascript",
            withoutDefaultGroup: true,
            withoutDefaultAttributes: true,
        }).reduce((accumulator, node) => {
            const attr = node.attributes as UiNodeScriptAttributes

            if (document.querySelector(`script[src="${attr.src}"]`)) {
                return accumulator
            }

            const script = document.createElement("script")
            script.src = attr.src
            script.type = attr.type
            script.async = attr.async
            script.referrerPolicy = attr.referrerpolicy
            script.crossOrigin = attr.crossorigin
            script.integrity = attr.integrity
            document.body.appendChild(script)

            return [...accumulator, script]
        }, [] as HTMLScriptElement[])

        return () => {
            scriptNodes.forEach(script => {
                document.body.removeChild(script)
            })
        }
    }, [excludeScripts, nodes])
}
