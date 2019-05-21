# VS Code

Required extensions:

- "dbaeumer.vscode-eslint",
- "esbenp.prettier-vscode",
- "shinnn.stylelint" - required only if you are using css/sass/scss

You can add these as recommended extensions in VSCode's in order to make your teammates's life easier. :)
Create file  `extensions.json` under `.vscode` as follows:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "shinnn.stylelint"
  ]
}
```

vscode's `settings.json`. It's recommended to add these settings per workspace (then your settings will be consistent across entire team).
```json
{
  "prettier.eslintIntegration": true,
  "prettier.stylelintIntegration": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "eslint.enable": true
}
```

Also you need to disable `TSLint` or `TSLint (deprecated)` if you haven't already. You can disable extension per workspace.

It's recommended to enable automatic formating and organising imports on every save. It's up to you and your teammates if you want this feature enabled per person or per project. Here is configuration which you need to append to your `settings.json` in VSCode.

```json
{
  "editor.formatOnType": true,
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
}
```

# Project dependencies

Add `@leancode/linting` as dev dependency.

# Prettier

Add file `.prettierrc.js`  (where `package.json` is) with contents:

```js
module.exports = require("@leancode/prettier-config");
```

# ESLint

Add file `.eslintrc`  (where `package.json` is) with contents:

```json
{
  "extends": "@leancode"
}
```

# Stylelint

This is required only if you are using css/scss/sass.

Add file `.stylelintrc`  (where `package.json` is) with contents:

```json
{
    "extends": "@leancode/stylelint-config"
}
```

or if you use `SCSS`
```json
{
    "extends": "@leancode/stylelint-config/scss"
}
```

# Lint your codebase

After you add these settings you'd need to manually format every file. If you want to lint your entire codebase at once you can run
```sh
npx prettier-eslint-cli "src/**/*.{ts,tsx}"
```
where your `package.json` file is located considering that your project's source code is located under `src` (if not change the glob pattern accordingly).
