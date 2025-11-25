For eslint-config to be used inside this repository, it has to be built to js, and that build has to be targeted by the
top level eslint config.

The whole process is handled by `nx run eslint-config:build`:

- The package is built normally (and placed in the `dist` directory)
- The build is copied to the `build` directory inside the package source.
- The `replace-eslint-plugin-import.js` script is run to replace the `@leancodepl/eslint-plugin` import with the
  `./../../../../eslint-plugin/build` path. This is done because eslint-plugin takes the same approach to local config,
  and @leancodepl/eslint-plugin would resolve to root package, not the build.
