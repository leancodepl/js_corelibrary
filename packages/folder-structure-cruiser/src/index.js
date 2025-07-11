/**
 * @fileoverview Dependency-cruiser configuration for enforcing strict feature boundaries
 *
 * - Allow imports from direct sibling index files (depth 1)
 * - Forbid imports from nested sibling children (depth 2+)
 * - Allow imports from your own children and direct siblings (same feature, any depth)
 */

module.exports = {
    forbidden: [
        {
            name: "no-cross-feature-nested-imports",
            comment: "Cannot import from a feature to a nested child of a different feature.",
            severity: "error",
            from: {
                path: ".*/([^/]+)/([^/]+)/.*",
            },
            to: {
                path: ".*/([^/]+)/[^/]+/[^/]+/.*",
                pathNot: [".*/$1/[^/]+/[a-zA-Z]+\\.[^/]+$", ".*/$1/$2/.*"],
            },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
            dependencyTypes: ["npm-no-pkg", "npm-unknown"],
        },
        tsPreCompilationDeps: true,
        enhancedResolveOptions: {
            exportsFields: ["exports"],
            conditionNames: ["import", "require", "node", "default"],
        },
        reporterOptions: {
            dot: {
                collapsePattern: "node_modules/[^/]+",
            },
        },
    },
}
