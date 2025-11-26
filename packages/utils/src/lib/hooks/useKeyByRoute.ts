/**
 * React hook for generating keys based on current route matches.
 *
 * @template TKey - The type of the route keys
 * @param routeMatches - Record of route keys to match objects or arrays
 * @returns Array of active route keys
 * @example
 * ```typescript
 * function NavigationComponent() {
 *   const routeMatches = {
 *     home: useRouteMatch('/'),
 *     about: useRouteMatch('/about'),
 *     contact: useRouteMatch('/contact')
 *   };
 *
 *   const activeRoutes = useKeyByRoute(routeMatches);
 *   // Returns ['home'] if on home page, ['about'] if on about page, etc.
 *
 *   return (
 *     <nav>
 *       {activeRoutes.map(route => (
 *         <span key={route}>Active: {route}</span>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useKeyByRoute<TKey extends string>(
  routeMatches: Record<TKey, (null | object)[] | never | null | object>,
) {
  const keys: TKey[] = []
  for (const key in routeMatches) {
    const matches = routeMatches[key]

    if (Array.isArray(matches) ? matches.some(match => match !== null) : matches !== null) {
      keys.push(key)
    }
  }
  return keys
}
