import { BaseSessionManager } from "@leancodepl/kratos"
import { AuthTraitsConfig } from "./traits"

export class SessionManager extends BaseSessionManager<AuthTraitsConfig> {
    getTraits = async () => {
        const identity = await this.getIdentity()

        return identity?.traits
    }

    getEmail = async () => {
        const traits = await this.getTraits()

        return traits?.email
    }

    getFirstName = async () => {
        const traits = await this.getTraits()

        return traits?.given_name
    }

    getMetadata = async () => {
        const identity = await this.getIdentity()
        const metadata = identity?.metadata_public

        return metadata && typeof metadata === "object" ? metadata : undefined
    }

    getRegulationsAccepted = async () => {
        const traits = await this.getTraits()

        return !!traits?.regulations_accepted
    }

    // Hooks for React components

    useTraits = () => {
        const { identity, isLoading, error } = this.useIdentity()

        return {
            traits: identity?.traits,
            isLoading,
            error,
        }
    }

    useEmail = () => {
        const { traits, isLoading, error } = this.useTraits()

        return {
            email: traits?.email,
            isLoading,
            error,
        }
    }

    useFirstName = () => {
        const { traits, isLoading, error } = this.useTraits()

        return {
            firstName: traits?.given_name,
            isLoading,
            error,
        }
    }

    useMetadata = () => {
        const { identity, isLoading, error } = this.useIdentity()

        return {
            metadata: identity?.metadata_public,
            isLoading,
            error,
        }
    }

    useRegulationsAccepted = () => {
        const { traits, isLoading, error } = this.useTraits()

        return {
            regulationsAccepted: !!traits?.regulations_accepted,
            isLoading,
            error,
        }
    }
}
