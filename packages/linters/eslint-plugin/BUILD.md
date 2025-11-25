For eslint-plugin to be used inside this repository, it has to be built to js, and has to be imported by eslint-config
package build.

The whole process is handled by `nx run eslint-plugin:build`:

- The package is built normally (and placed in the `dist` directory)
- The build is copied to the `build` directory inside the package source.
