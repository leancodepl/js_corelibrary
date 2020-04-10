# VS Code

Required extensions:

-   "dbaeumer.vscode-eslint",
-   "esbenp.prettier-vscode",
-   "shinnn.stylelint" - required only if you are using css/sass/scss

You can add these as recommended extensions in VSCode's in order to make your teammates's life easier. :) Create file
`extensions.json` under `.vscode` as follows:

```json
{
    "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode", "stylelint.vscode-stylelint"]
}
```

vscode's `settings.json`. It's recommended to add these settings per workspace (then your settings will be consistent
across entire team).

```json
{
    "[typescript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    },

    "eslint.enable": true,
    "eslint.format.enable": true,
    "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],

    // If you have multiple packages in one repository
    "eslint.workingDirectories": ["Workspace1", "Workspace2"]
}
```

Also you need to disable `TSLint` or `TSLint (deprecated)` if you haven't already. You can disable extension per
workspace.

It's recommended to enable automatic formating and organising imports on every save. It's up to you and your teammates
if you want this feature enabled per person or per project. Here is configuration which you need to append to your
`settings.json` in VSCode.

```json
{
    "editor.formatOnType": true,
    "[typescript]": {
        "editor.codeActionsOnSave": {
            "source.organizeImports": true
        }
    },
    "[typescriptreact]": {
        "editor.codeActionsOnSave": {
            "source.organizeImports": true
        }
    }
}
```

# Project dependencies

Add `@leancode/linting` as dev dependency.

You can run `npm view @leancode/linting` in order to see latest version of the package.

# Prettier

Add file `.prettierrc.js` (where `package.json` is) with contents:

```js
module.exports = require("@leancode/prettier-config");
```

# ESLint

Add file `.eslintrc` (where `package.json` is) with contents:

```json
{
    "extends": "@leancode"
}
```

# Stylelint

This is required only if you are using css/scss/sass.

## CSS

Add file `.stylelintrc` (where `package.json` is) with contents:

```json
{
    "extends": "@leancode/stylelint-config"
}
```

Configure stylelint in `settings.json`:

```json
{
    "css.validate": false,

    "[css]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.stylelint": true
        }
    }
}
```

## SCSS

`.stylelintrc`

```json
{
    "extends": "@leancode/stylelint-config/scss"
}
```

`settings.json`:

```json
{
    "scss.validate": false,

    "[scss]": {
        "editor.codeActionsOnSave": {
            "source.fixAll.stylelint": true
        }
    }
}
```

# Lint your codebase

After you add these settings you'd need to manually format every file. If you want to lint your entire codebase at once
you can run

```sh
npx eslint --fix src/**/*.{js,jsx,ts,tsx}
npx stylelint --fix src/**/*.{scss,css}
```

where your `package.json` file is located considering that your project's source code is located under `src` (if not
change the glob pattern accordingly).
