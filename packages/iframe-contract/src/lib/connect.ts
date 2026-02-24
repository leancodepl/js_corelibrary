import { connect, WindowMessenger } from "penpal"
import { HostMethodsBase, RemoteMethodsBase } from "./types"

export type ConnectToRemoteOptions<THost extends HostMethodsBase> = {
  /** Methods the host exposes to the remote */
  methods: THost
  /** Allowed origins for the remote iframe (defaults to iframe src origin) */
  allowedOrigins?: string[]
}

export type ConnectToHostOptions<TRemote extends RemoteMethodsBase> = {
  /** Methods the remote exposes to the host */
  methods: TRemote
  /** Allowed origins for the parent window (defaults to document.referrer origin) */
  allowedOrigins?: string[]
}

/**
 * Connect host (parent) to remote (child iframe).
 * Call this from the host app with the iframe element.
 *
 * @example
 * const connection = connectToRemote<RemoteMethods, HostMethods>(iframeRef.current, {
 *   methods: {
 *     navigateTo: (path) => { router.navigate(path) },
 *     showNotification: (msg, type) => { messageApi[type](msg) },
 *     getCurrentUserId: () => Promise.resolve(userId),
 *   },
 * })
 * const remote = await connection.promise
 * await remote.navigateTo("/settings")
 */
export function connectToRemote<TRemote extends RemoteMethodsBase, THost extends HostMethodsBase>(
  iframe: HTMLIFrameElement,
  options: ConnectToRemoteOptions<THost>,
) {
  const { methods, allowedOrigins } = options
  const iframeOrigin = new URL(iframe.src).origin

  const iframeWindow = iframe.contentWindow
  if (!iframeWindow) {
    throw new Error("Iframe content window is not available")
  }

  const messenger = new WindowMessenger({
    remoteWindow: iframeWindow,
    allowedOrigins: allowedOrigins ?? [iframeOrigin],
  })

  return connect<TRemote>({
    messenger,
    methods,
  })
}

/**
 * Connect remote (child iframe) to host (parent window).
 * Call this from the remote app.
 *
 * @example
 * const connection = connectToHost<HostMethods, RemoteMethods>({
 *   methods: {
 *     navigateTo: (path) => { navigate(path) },
 *     getCurrentPath: () => Promise.resolve(location.pathname),
 *     refresh: () => refetch(),
 *   },
 * })
 * const host = await connection.promise
 * await host.showNotification("Settings saved", "success")
 */
export function connectToHost<THost extends HostMethodsBase, TRemote extends RemoteMethodsBase>(
  options: ConnectToHostOptions<TRemote>,
) {
  const { methods, allowedOrigins } = options
  const parentOrigin =
    document.referrer && document.referrer !== "" ? new URL(document.referrer).origin : globalThis.location.origin

  const messenger = new WindowMessenger({
    remoteWindow: globalThis.window.parent,
    allowedOrigins: allowedOrigins ?? [parentOrigin],
  })

  return connect<THost>({
    messenger,
    methods,
  })
}
