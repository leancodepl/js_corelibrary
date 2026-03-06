import { z } from "zod"

export function methodDef(): z.ZodObject<Record<string, never>>
export function methodDef<R extends z.ZodTypeAny>(def: { returns: R }): z.ZodObject<{ returns: R }>
export function methodDef<P extends z.ZodRawShape>(def: {
  params: z.ZodObject<P>
}): z.ZodObject<{ params: z.ZodObject<P> }>
export function methodDef<P extends z.ZodRawShape, R extends z.ZodTypeAny>(def: {
  params: z.ZodObject<P>
  returns: R
}): z.ZodObject<{ params: z.ZodObject<P>; returns: R }>
export function methodDef<P extends z.ZodRawShape, R extends z.ZodTypeAny>(def?: {
  params?: z.ZodObject<P>
  returns?: R
}):
  | z.ZodObject<Record<string, never>>
  | z.ZodObject<{ params: z.ZodObject<P>; returns: R }>
  | z.ZodObject<{ params: z.ZodObject<P> }>
  | z.ZodObject<{ returns: R }> {
  if (!def || (def.params === undefined && def.returns === undefined)) return z.object({})
  if (def.params === undefined && def.returns !== undefined) return z.object({ returns: def.returns })
  if (def.returns === undefined && def.params !== undefined) return z.object({ params: def.params })
  if (def.params !== undefined && def.returns !== undefined)
    return z.object({ params: def.params, returns: def.returns })
  return z.object({})
}

export type MethodDefInferred = { params?: unknown; returns?: unknown }

export type MethodDefOutput<S extends z.ZodTypeAny> = z.infer<S>

export type MethodParamsType<S extends z.ZodTypeAny> = MethodDefOutput<S> extends { params: infer P } ? P : never

export type MethodReturnType<S extends z.ZodTypeAny> =
  MethodDefOutput<S> extends { returns: infer R } ? Promise<R> : Promise<void>

export type MethodType<S extends z.ZodTypeAny> =
  MethodParamsType<S> extends never ? () => MethodReturnType<S> : (params: MethodParamsType<S>) => MethodReturnType<S>

export type InferMethodsFromSchema<T extends Record<string, z.ZodTypeAny>> = {
  [K in keyof T]: MethodType<T[K]>
}

export type InferParamsFromSchema<T extends Record<string, z.ZodType<string>>> = {
  [K in keyof T]: z.infer<T[K]>
}

export type HostMethodsSchemaBase = Record<string, z.ZodType<MethodDefInferred>>
export type RemoteMethodsSchemaBase = Record<string, z.ZodType<MethodDefInferred>>
export type RemoteParamsSchemaBase = Record<string, z.ZodType<string>>

export function mkZodContractSchema({
  hostMethods,
  remoteMethods,
  remoteParams,
}: {
  hostMethods: HostMethodsSchemaBase
  remoteMethods: RemoteMethodsSchemaBase
  remoteParams: RemoteParamsSchemaBase
}) {
  return z.object({
    hostMethods: z.object(hostMethods),
    remoteMethods: z.object(remoteMethods),
    remoteParams: z.object(remoteParams),
  })
}
