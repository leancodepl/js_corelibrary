import { TraitsConfig } from "../flows/registration/types"
import { Identity, Session } from "../kratos"

export type IdentityWithTypedTraits<TTraitsConfig extends TraitsConfig> = Omit<Identity, "traits"> & {
    traits: {
        [TC in keyof TTraitsConfig as TTraitsConfig[TC]["trait"]]: TTraitsConfig[TC]["type"] extends "string"
            ? string
            : TTraitsConfig[TC]["type"] extends "boolean"
              ? boolean
              : unknown
    }
}

export type SessionWithTypedUserTraits<TTraitsConfig extends TraitsConfig> = Omit<Session, "identity"> & {
    identity?: IdentityWithTypedTraits<TTraitsConfig>
}
