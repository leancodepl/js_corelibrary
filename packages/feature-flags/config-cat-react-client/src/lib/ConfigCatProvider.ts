// based on:
// https://github.com/open-feature/js-sdk-contrib/tree/main/libs/shared/config-cat-core
// https://github.com/open-feature/js-sdk-contrib/tree/main/libs/providers/config-cat-web

import { EvaluationContextValue, ResolutionReason, StandardResolutionReasons } from "@openfeature/core"
import {
    EvaluationContext,
    FlagNotFoundError,
    JsonValue,
    OpenFeatureEventEmitter,
    Paradigm,
    ParseError,
    Provider,
    ProviderEvents,
    ProviderNotReadyError,
    ResolutionDetails,
    TypeMismatchError,
} from "@openfeature/web-sdk"
import {
    User as ConfigCatUser,
    IConfig,
    IConfigCatClient,
    IEvaluationDetails,
    OptionsForPollingMode,
    PollingMode,
    UserAttributeValue,
    getClient,
} from "configcat-js"

function toUserAttributeValue(value: EvaluationContextValue): UserAttributeValue {
    if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
        return value
    } else if (Array.isArray(value) && value.every(item => typeof item === "string")) {
        return value as ReadonlyArray<string>
    }
    return JSON.stringify(value)
}

function transformCustomContextValues(contextValue: EvaluationContextValue): ConfigCatUser["custom"] {
    if (typeof contextValue !== "object" || contextValue === null) {
        return {}
    }

    return Object.entries(contextValue).reduce<ConfigCatUser["custom"]>(
        (context, [key, value]) => {
            const transformedValue = toUserAttributeValue(value)
            return transformedValue ? { ...context, [key]: transformedValue } : context
        },
        {} as ConfigCatUser["custom"],
    )
}

function stringOrUndefined(param?: unknown): string | undefined {
    if (typeof param === "string") {
        return param
    }

    return undefined
}

function transformContext(context: EvaluationContext): ConfigCatUser | undefined {
    const { targetingKey, email, country, ...attributes } = context

    if (!targetingKey) {
        return undefined
    }

    return {
        identifier: targetingKey,
        email: stringOrUndefined(email),
        country: stringOrUndefined(country),
        custom: transformCustomContextValues(attributes),
    }
}

function toResolutionDetails<T extends PrimitiveTypeName>(
    type: T,
    value: unknown,
    data: Omit<IEvaluationDetails, "value">,
    reason?: ResolutionReason,
): ResolutionDetails<PrimitiveType<T>> {
    if (!isType(type, value)) {
        throw new TypeMismatchError(`Requested ${type} flag but the actual value is ${typeof value}`)
    }

    const matchedTargeting = data.matchedTargetingRule
    const matchedPercentage = data.matchedPercentageOption

    const matchedRule = Boolean(matchedTargeting || matchedPercentage)
    const evaluatedReason = matchedRule ? StandardResolutionReasons.TARGETING_MATCH : StandardResolutionReasons.STATIC

    return {
        value,
        reason: reason ?? evaluatedReason,
        errorMessage: data.errorMessage,
        variant: data.variationId ?? undefined,
    }
}

type PrimitiveTypeName = "boolean" | "number" | "object" | "string" | "undefined"
type PrimitiveType<T> = T extends "string"
    ? string
    : T extends "boolean"
      ? boolean
      : T extends "number"
        ? number
        : T extends "object"
          ? object
          : T extends "undefined"
            ? undefined
            : unknown

function isType<T extends PrimitiveTypeName>(type: T, value: unknown): value is PrimitiveType<T> {
    return typeof value !== "undefined" && typeof value === type
}

export class ConfigCatProvider implements Provider {
    public readonly events = new OpenFeatureEventEmitter()
    private readonly _clientFactory: (provider: ConfigCatProvider) => IConfigCatClient
    private _hasError = false
    private _client?: IConfigCatClient

    public runsOn: Paradigm = "client"

    public metadata = {
        name: ConfigCatProvider.name,
    }

    protected constructor(clientFactory: (provider: ConfigCatProvider) => IConfigCatClient) {
        this._clientFactory = clientFactory
    }

    public static create(sdkKey: string, options?: OptionsForPollingMode<PollingMode.AutoPoll>) {
        // Let's create a shallow copy to not mess up caller's options object.
        options = options ? { ...options } : {}

        return new ConfigCatProvider(provider => {
            const oldSetupHooks = options?.setupHooks

            options.setupHooks = hooks => {
                oldSetupHooks?.(hooks)

                hooks.on("configChanged", (projectConfig: IConfig | undefined) =>
                    provider.events.emit(ProviderEvents.ConfigurationChanged, {
                        flagsChanged: projectConfig ? Object.keys(projectConfig.settings) : undefined,
                    }),
                )

                hooks.on("clientError", (message: string, error) => {
                    provider._hasError = true
                    provider.events.emit(ProviderEvents.Error, {
                        message: message,
                        metadata: error,
                    })
                })
            }

            return getClient(sdkKey, PollingMode.AutoPoll, options)
        })
    }

    public async initialize(): Promise<void> {
        const client = this._clientFactory(this)
        await client.waitForReady()
        this._client = client
    }

    public get configCatClient() {
        return this._client
    }

    public async onClose(): Promise<void> {
        this._client?.dispose()
    }

    public resolveBooleanEvaluation(
        flagKey: string,
        defaultValue: boolean,
        context: EvaluationContext,
    ): ResolutionDetails<boolean> {
        return this.evaluate(flagKey, "boolean", context)
    }

    public resolveStringEvaluation(
        flagKey: string,
        defaultValue: string,
        context: EvaluationContext,
    ): ResolutionDetails<string> {
        return this.evaluate(flagKey, "string", context)
    }

    public resolveNumberEvaluation(
        flagKey: string,
        defaultValue: number,
        context: EvaluationContext,
    ): ResolutionDetails<number> {
        return this.evaluate(flagKey, "number", context)
    }

    public resolveObjectEvaluation<U extends JsonValue>(
        flagKey: string,
        defaultValue: U,
        context: EvaluationContext,
    ): ResolutionDetails<U> {
        const objectValue = this.evaluate(flagKey, "object", context)
        return objectValue as ResolutionDetails<U>
    }

    protected evaluate<T extends PrimitiveTypeName>(
        flagKey: string,
        flagType: T,
        context: EvaluationContext,
    ): ResolutionDetails<PrimitiveType<T>> {
        if (!this._client) {
            throw new ProviderNotReadyError("Provider is not initialized")
        }

        const { value, ...evaluationData } = this._client
            .snapshot()
            .getValueDetails(flagKey, undefined, transformContext(context))

        if (this._hasError && !evaluationData.errorMessage && !evaluationData.errorException) {
            this._hasError = false
            this.events.emit(ProviderEvents.Ready)
        }

        if (typeof value === "undefined") {
            throw new FlagNotFoundError()
        }

        if (flagType !== "object") {
            return toResolutionDetails(flagType, value, evaluationData)
        }

        if (!isType("string", value)) {
            throw new TypeMismatchError()
        }

        let json: JsonValue
        try {
            json = JSON.parse(value)
        } catch (e) {
            throw new ParseError(`Unable to parse "${value}" as JSON`)
        }

        return toResolutionDetails(flagType, json, evaluationData)
    }
}
