import { useEffect } from "react";
import { UiNode, UiNodeScriptAttributes } from "@ory/client";
import { filterNodesByGroups } from "../utils/filterNodesByGroups";

export function useScriptNodes({ nodes, includeScripts }: { nodes: UiNode[]; includeScripts?: boolean }) {
    useEffect(() => {
        if (!includeScripts) {
            return;
        }

        const scriptNodes = filterNodesByGroups({
            nodes,
            groups: "webauthn",
            attributes: "text/javascript",
            withoutDefaultGroup: true,
            withoutDefaultAttributes: true,
        }).map(node => {
            const attr = node.attributes as UiNodeScriptAttributes;
            const script = document.createElement("script");
            script.src = attr.src;
            script.type = attr.type;
            script.async = attr.async;
            script.referrerPolicy = attr.referrerpolicy;
            script.crossOrigin = attr.crossorigin;
            script.integrity = attr.integrity;
            document.body.appendChild(script);
            return script;
        });

        return () => {
            scriptNodes.forEach(script => {
                document.body.removeChild(script);
            });
        };
    }, [includeScripts, nodes]);
}
