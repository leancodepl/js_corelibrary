import { BaseSessionManager } from "@leancodepl/kratos"
import { map } from "rxjs/operators"
import { AuthTraitsConfig } from "./traits"

export class SessionManager extends BaseSessionManager<AuthTraitsConfig> {
    metadata$ = this.identity$.pipe(
        map(identity => {
            const metadata: unknown = identity?.metadata_public

            return metadata && typeof metadata === "object" ? metadata : undefined
        }),
    )

    wasLoginSet$ = this.metadata$.pipe(
        map(metadata =>
            metadata && "was_login_set" in metadata && typeof metadata.was_login_set === "boolean"
                ? metadata.was_login_set
                : undefined,
        ),
    )

    regulationsAcceptedAt$ = this.metadata$.pipe(
        map(metadata =>
            metadata && "regulations_accepted_at" in metadata && typeof metadata.regulations_accepted_at === "string"
                ? new Date(metadata.regulations_accepted_at)
                : undefined,
        ),
    )

    regulationsAccepted$ = this.regulationsAcceptedAt$.pipe(map(regulationsAcceptedAt => !!regulationsAcceptedAt))

    traits$ = this.identity$.pipe(
        map(identity => {
            const traits = identity?.traits

            return traits && typeof traits === "object" ? traits : undefined
        }),
    )

    email$ = this.traits$.pipe(
        map(traits => {
            return traits && "email" in traits && typeof traits.email === "string" ? traits.email : undefined
        }),
    )

    firstName$ = this.traits$.pipe(
        map(traits => {
            return traits && "given_name" in traits && typeof traits.given_name === "string"
                ? traits.given_name
                : undefined
        }),
    )

    lastName$ = this.traits$.pipe(
        map(traits => {
            return traits && "last_name" in traits && typeof traits.last_name === "string"
                ? traits.last_name
                : undefined
        }),
    )
}
