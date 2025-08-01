export const baseConfigOptions = {
  doNotFollow: {
    path: ["node_modules"],
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
}
