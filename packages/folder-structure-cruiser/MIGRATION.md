---
name: folder-structure-cruiser-migration
description: >
  Migrate a project from a dependency-cruiser config to the built-in
  @leancodepl/folder-structure-cruiser config (versions ≤ 10.3 → ≥ 10.4). Use when a repo still has
  `.dependency-cruiser*.json` files, an `extends` on `@leancodepl/folder-structure-cruiser/.dependency-cruiser.json`,
  or `--tsConfig`/`--webpackConfig` flags passed to the folder-structure-cruiser CLI.
---

# Migrating off dependency-cruiser configs (≤ 10.3 → ≥ 10.4)

Up to 10.3, this package was configured through dependency-cruiser config files plus the
`@leancodepl/folder-structure-cruiser/.dependency-cruiser.json` base config and `--tsConfig`/`--webpackConfig` CLI
flags. From 10.4 it has its own [config file](./README.md#configuration) and the base options are built in.

Follow these steps for each project (e.g. each package with its own dependency-cruiser config). Work through them in
order and skip any that don't apply.

## 1. Locate the old config

Find the dependency-cruiser config and any folder-structure-cruiser CLI invocations:

- `.dependency-cruiser.json`, `.dependency-cruiser.js`, `.dependency-cruiser.cjs` (or `.mjs`) in the project root.
- Scripts in `package.json` / `project.json` / CI that call `folder-structure-cruiser` or `npx depcruise`, noting any
  `--tsConfig` / `--webpackConfig` flags.

If there is no dependency-cruiser config and no such flags, the project is already on the new system — stop.

## 2. Create the new config

Create `folder-structure-cruiser.config.json` in the project root. Translate the old settings using the table below.
Only carry over what was actually customized — everything in the base config is now built in.

| Old (dependency-cruiser)                                              | New (`folder-structure-cruiser.config.json`)                                              |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `"extends": ["@leancodepl/folder-structure-cruiser/.dependency-cruiser.json"]` | Drop it — the base options are built in, no replacement needed.                  |
| `--tsConfig ./tsconfig.json` flag                                     | `"tsConfig": "./tsconfig.json"`                                                           |
| `--webpackConfig ./webpack.config.js` flag                            | `"webpackConfig": "./webpack.config.js"`                                                  |
| extra `options.doNotFollow` / `options.exclude` **paths**             | `"ignore": [...]` (global), or a per-command `ignore` list — built-in ignores no longer need repeating |
| `options.includeOnly`                                                 | `"scope": [...]`                                                                          |
| `options.builtInModules`, `options.doNotFollow.dependencyTypes` and similar Node-builtin / npm tweaks | Usually droppable — such imports are never reported. If still needed, `"dependencyCruiserOptions": { ... }` |

`ignore` and `scope` entries are **regular expressions** matched against module paths relative to the working
directory, same as the dependency-cruiser path patterns they replace.

A typical result:

```json
{
  "tsConfig": "./tsconfig.json",
  "ignore": ["^src/generated/"],
  "crossFeatureImports": {
    "ignore": ["^src/routes/", "^src/main[.]tsx$"]
  }
}
```

If the old config had per-rule path exclusions (e.g. route entry points exempt from the cross-feature rule only), put
those under the matching per-command key: `crossFeatureImports.ignore`, `sharedComponents.ignore`, or
`noOrphans.ignore`. Anything that should apply to all three goes in the top-level `ignore`.

## 3. Update invocations

- Replace `npx depcruise ...` calls used for the no-orphans rule with
  `npx @leancodepl/folder-structure-cruiser validate-no-orphans`.
- Remove `--tsConfig` / `--webpackConfig` flags from all `folder-structure-cruiser` invocations (now config keys).
- Confirm the commands in use are the current ones: `validate-cross-feature-imports`, `validate-shared-components`,
  `validate-no-orphans`. With the config file in the project root, no `-c`/`--config` flag is needed.

## 4. Clean up

- Delete the `.dependency-cruiser*.json` / `.dependency-cruiser.*` files.
- Remove the standalone `dependency-cruiser` dev dependency **unless** the project still uses `depcruise` directly for
  something other than these rules.

## 5. Verify

Run each command and confirm it behaves as before:

```sh
npx @leancodepl/folder-structure-cruiser validate-cross-feature-imports --directory "src"
npx @leancodepl/folder-structure-cruiser validate-shared-components --directory "src"
npx @leancodepl/folder-structure-cruiser validate-no-orphans --directory "src"
```

Each exits `1` on violations and `0` when clean. If a previously-passing command now reports violations, an `ignore` /
`scope` pattern was likely missed in step 2 — compare against the old `doNotFollow`/`exclude`/`includeOnly` entries. If
`ignore`/`scope` genuinely can't express a needed exclusion, fall back to `dependencyCruiserOptions` (see the
[escape hatch](./README.md#escape-hatch-raw-dependency-cruiser-options)).
