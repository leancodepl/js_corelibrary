import { z } from "zod"
import {
  HostMethodsSchemaBase,
  InferMethodsFromSchema,
  InferParamsFromSchema,
  methodDef,
  MethodParamsType,
  MethodReturnType,
  MethodType,
  mkZodContractSchema as mkZodSchemaContract,
  RemoteMethodsSchemaBase,
  RemoteParamsSchemaBase,
} from "../src/lib/zod"

const NotificationTypeSchema = z.enum(["error", "info", "success", "warning"]).meta({ id: "NotificationType" })
const ThemeValueSchema = z.enum(["dark", "light"]).meta({ id: "ThemeValue" })

/**
 * Methods exposed by the host (parent) window to the remote (child iframe).
 * Remote calls these to request actions from host.
 */

const HostOnRouteChange = methodDef({
  params: z.object({
    path: z.string(),
  }),
})

const HostNavigateTo = methodDef({
  params: z.object({
    path: z.string(),
  }),
})

const HostInvalidateToken = methodDef({
  returns: z.boolean(),
})

const HostShowNotification = methodDef({
  params: z.object({
    message: z.string(),
    type: NotificationTypeSchema,
  }),
})

const HostGetCurrentUserId = methodDef({
  returns: z.string().nullable(),
})

const HostMethods = {
  // Routing
  onRouteChange: HostOnRouteChange,
  navigateTo: HostNavigateTo,

  // Authentication
  invalidateToken: HostInvalidateToken,

  // Other
  showNotification: HostShowNotification,
  getCurrentUserId: HostGetCurrentUserId,
} satisfies HostMethodsSchemaBase

export type HostOnRouteChange = MethodType<typeof HostOnRouteChange>
export type HostNavigateTo = MethodType<typeof HostNavigateTo>
export type HostInvalidateToken = MethodType<typeof HostInvalidateToken>
export type HostShowNotification = MethodType<typeof HostShowNotification>
export type HostGetCurrentUserId = MethodType<typeof HostGetCurrentUserId>

export type HostOnRouteChangeParams = MethodParamsType<typeof HostOnRouteChange>
export type HostNavigateToParams = MethodParamsType<typeof HostNavigateTo>
export type HostInvalidateTokenParams = MethodParamsType<typeof HostInvalidateToken>
export type HostShowNotificationParams = MethodParamsType<typeof HostShowNotification>
export type HostGetCurrentUserIdParams = MethodParamsType<typeof HostGetCurrentUserId>

export type HostOnRouteChangeResult = MethodReturnType<typeof HostOnRouteChange>
export type HostNavigateToResult = MethodReturnType<typeof HostNavigateTo>
export type HostInvalidateTokenResult = MethodReturnType<typeof HostInvalidateToken>
export type HostShowNotificationResult = MethodReturnType<typeof HostShowNotification>
export type HostGetCurrentUserIdResult = MethodReturnType<typeof HostGetCurrentUserId>

/**
 * Methods exposed by the remote (child iframe) to the host (parent) window.
 * Host calls these to control or query the remote.
 */

const RemoteOnRouteChange = methodDef({
  params: z.object({
    path: z.string(),
  }),
})

const RemoteNavigateTo = methodDef({
  params: z.object({
    path: z.string(),
  }),
})

const RemoteGetCurrentPath = methodDef({
  returns: z.string(),
})

const RemoteRefresh = methodDef({
  returns: z.void(),
})

const RemoteOnThemeChange = methodDef({
  params: z.object({
    theme: ThemeValueSchema,
  }),
})

const RemoteMethods = {
  // Routing
  onRouteChange: RemoteOnRouteChange,
  navigateTo: RemoteNavigateTo,

  // Other
  getCurrentPath: RemoteGetCurrentPath,
  refresh: RemoteRefresh,
  onThemeChange: RemoteOnThemeChange,
} satisfies RemoteMethodsSchemaBase

export type RemoteOnRouteChange = MethodType<typeof RemoteOnRouteChange>
export type RemoteNavigateTo = MethodType<typeof RemoteNavigateTo>
export type RemoteGetCurrentPath = MethodType<typeof RemoteGetCurrentPath>
export type RemoteRefresh = MethodType<typeof RemoteRefresh>
export type RemoteOnThemeChange = MethodType<typeof RemoteOnThemeChange>

export type RemoteOnRouteChangeParams = MethodParamsType<typeof RemoteOnRouteChange>
export type RemoteNavigateToParams = MethodParamsType<typeof RemoteNavigateTo>
export type RemoteGetCurrentPathParams = MethodParamsType<typeof RemoteGetCurrentPath>
export type RemoteRefreshParams = MethodParamsType<typeof RemoteRefresh>
export type RemoteOnThemeChangeParams = MethodParamsType<typeof RemoteOnThemeChange>

export type RemoteOnRouteChangeResult = MethodReturnType<typeof RemoteOnRouteChange>
export type RemoteNavigateToResult = MethodReturnType<typeof RemoteNavigateTo>
export type RemoteGetCurrentPathResult = MethodReturnType<typeof RemoteGetCurrentPath>
export type RemoteRefreshResult = MethodReturnType<typeof RemoteRefresh>
export type RemoteOnThemeChangeResult = MethodReturnType<typeof RemoteOnThemeChange>

/**
 * Parameters passed to the remote (child iframe) from the host (parent) window.
 * Host passes these to the remote to configure its behavior.
 */

const RemoteParams = {
  userId: z.string(),
  theme: ThemeValueSchema,
} satisfies RemoteParamsSchemaBase

/**
 * Types inferred from the schemas
 */

export type NotificationType = z.infer<typeof NotificationTypeSchema>
export type ThemeValue = z.infer<typeof ThemeValueSchema>

export type HostMethods = InferMethodsFromSchema<typeof HostMethods>
export type RemoteMethods = InferMethodsFromSchema<typeof RemoteMethods>
export type RemoteParams = InferParamsFromSchema<typeof RemoteParams>

export const contract = mkZodSchemaContract({
  hostMethods: HostMethods,
  remoteMethods: RemoteMethods,
  remoteParams: RemoteParams,
})
