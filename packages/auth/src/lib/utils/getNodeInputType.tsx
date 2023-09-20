/* eslint-disable @typescript-eslint/no-explicit-any */

import { isNil } from "lodash";

export function getNodeInputType(attr: unknown): string {
    if (typeof attr === "object" && !isNil(attr) && "type" in attr) {
        const type = (attr as { type: unknown })["type"];
        if (typeof type === "string") {
            return type;
        }
    }
    return "";
}
