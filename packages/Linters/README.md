# VS Code

Required extensions:

    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "shinnn.stylelint"

`settings.json`:
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

# Project dependencies

Add `@leancode/linting` as dev dependency.

# Prettier

Add file `.prettierrc.js`  (where `package.json` is) with contents:

```js
module.exports = require("@leancode/linters/prettier");
```

# ESLint

Add file `.eslintrc`  (where `package.json` is) with contents:

```json
{
  "extends": "@leancode"
}
```

# Stylelint

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
