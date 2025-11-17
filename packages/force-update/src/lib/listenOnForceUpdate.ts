import { interval, of } from "rxjs"
import { ajax } from "rxjs/ajax"
import { catchError, first, map, mergeMap, pairwise, scan } from "rxjs/operators"

const defaultVersionCheckIntervalPeriod = 3 * 60 * 1000

export type ForceUpdateParams = {
  versionCheckIntervalPeriod?: number
  onNewVersionAvailable: () => void
}

/**
 * Listens for force updates by periodically checking the `/version` endpoint.
 * When a new version is detected, it calls the provided callback function.
 *
 * @param params - Configuration object for force update listening
 * @param params.versionCheckIntervalPeriod - The interval period in milliseconds to check for version updates (default: 180000 - 3 minutes)
 * @param params.onNewVersionAvailable - Callback function that is called when a new version is available
 * @returns A cleanup function that unsubscribes from the version checking
 */
export const listenOnForceUpdate = ({
  versionCheckIntervalPeriod = defaultVersionCheckIntervalPeriod,
  onNewVersionAvailable,
}: ForceUpdateParams) => {
  const versionUrl = () =>
    ajax({
      url: "/version",
      responseType: "text",
      headers: {
        "Cache-Control": "no-store",
      },
    }).pipe(
      map(response => {
        const version = response.response

        return typeof version === "string" ? version.trim() : null
      }),
      catchError(() => of(null)),
    )

  const subscription = interval(versionCheckIntervalPeriod)
    .pipe(
      mergeMap(versionUrl),
      scan((lastVersion, version) => version ?? lastVersion),
      pairwise(),
      first(([previousVersion, currentVersion]) => !!previousVersion && previousVersion !== currentVersion),
    )
    .subscribe(() => {
      onNewVersionAvailable()

      subscription.unsubscribe()
    })

  return () => subscription.unsubscribe()
}
