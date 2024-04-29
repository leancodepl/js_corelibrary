import { ApiBinary, toRaw } from "@leancodepl/api-binary";
import { base64toBlob } from "./base64ToBlob";

export function toBlob(apiBinary: ApiBinary, contentType?: string): Blob;
export function toBlob(apiBinary?: ApiBinary | null, contentType?: string): Blob | undefined;
export function toBlob(apiBinary?: ApiBinary | null, contentType?: string) {
    if (apiBinary === undefined || apiBinary === null) {
        return undefined;
    }

    return base64toBlob(toRaw(apiBinary), contentType);
}
