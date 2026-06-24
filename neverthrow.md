# Try/Catch → neverthrow Feasibility Analysis

## Context

You asked how many of the repo's `try/catch` blocks could realistically be simplified by adopting
[`neverthrow`](https://github.com/supermacro/neverthrow). This is a scoping report, not an execution plan — it should
let you decide whether/where adopting neverthrow is worth the dependency and refactor cost before committing to any code
changes.

## Headline numbers

- **63 try/catch blocks** across **838 TS/JS source files** (~7.5% file prevalence)
- **`neverthrow` is not a current dependency** anywhere in the monorepo
- **No existing custom Result/Either utility** — each package defines its own ad-hoc shapes (`ApiResponse<T>`,
  `CommandResult`, …)
- TS posture is friendly to it: TS 5.9, `strict: true`, library-style packaging with declaration files

## Categorization

| Category | Description                                                                         |   Count | Good fit for neverthrow?                                     |
| -------- | ----------------------------------------------------------------------------------- | ------: | ------------------------------------------------------------ |
| A        | Single fallible call wrapped to transform/handle error                              | **~28** | ✅ Best candidates — `ResultAsync.fromPromise` one-liners    |
| B        | Multiple chained fallible operations in one `try`                                   |  **~8** | ✅ Idiomatic `andThen` chains                                |
| C        | Boundary / framework integration (CLI entry, React Query `queryFn`, OAuth boundary) | **~15** | ⚠️ Usually must stay — these are where Results get unwrapped |
| D        | Resource cleanup (`finally`) or intentional silent-swallow                          |  **~8** | ⚠️ Convertible but loses ergonomics; case-by-case            |
| E        | Tests / ambiguous                                                                   |  **~4** | n/a                                                          |

**Convertible without changing public API**: ~30–36 blocks (A + most of B). **Convertible only as part of a major
version bump**: most of category C if you also redesign CQRS client return types.

## Per-package hotspots

| Package                                                | try/catch | Notes                                                                       |
| ------------------------------------------------------ | --------: | --------------------------------------------------------------------------- |
| [packages/intl](packages/intl)                         |        20 | POEditor client + CLI commands — densest, most uniform Category A wrappers  |
| [packages/kratos](packages/kratos)                     |        18 | Mostly Category C (React Query `queryFn`s) + 4 silent-swallow Passkey calls |
| [packages/mail-translation](packages/mail-translation) |         7 | Mostly Category A — error-message-rewriting wrappers                        |
| [packages/login-manager](packages/login-manager)       |         4 | OAuth boundary — Category C                                                 |
| Other                                                  |        14 | Scattered single-use                                                        |

## Highest-leverage targets (start here if you proceed)

These are the cleanest Category A blocks — converting them gives the most "look at the diff" payoff for the least risk,
because they're internal to their packages and don't change cross-package surfaces:

1. [packages/intl/src/poeditor/POEditorClient.ts:43-59](packages/intl/src/poeditor/POEditorClient.ts#L43) — 5 methods,
   each wraps a single API call to rethrow with context. Textbook `ResultAsync.fromPromise(call, mapErr)`.
2. [packages/mail-translation/src/compileMjml.ts:18](packages/mail-translation/src/compileMjml.ts#L18) and
   [packages/mail-translation/src/loadConfig.ts:36](packages/mail-translation/src/loadConfig.ts#L36) — single-call
   wrappers that enhance error messages.
3. [packages/intl/src/formatjs.ts:17](packages/intl/src/formatjs.ts#L17) — two CLI command wrappers.
4. [packages/image-uploader/src/lib/\_utils/tryUploadWithUploadParams.ts:37-55](packages/image-uploader/src/lib/_utils/tryUploadWithUploadParams.ts#L37)
   — currently swallows original error; Result preserves it without uglifying control flow.
5. [packages/intl/src/commands/download.ts:17-49](packages/intl/src/commands/download.ts#L17) and
   [packages/intl/src/commands/local.ts:30-89](packages/intl/src/commands/local.ts#L30) — Category B chains that would
   read well as `.andThen(...).andThen(...)`.

## What should _not_ move

- **CQRS client return types** ([fetch-client](packages/cqrs-clients/fetch-client),
  [axios-cqrs-client](packages/cqrs-clients/axios-cqrs-client), [rx-cqrs-client](packages/cqrs-clients/rx-cqrs-client),
  [react-query-cqrs-client](packages/cqrs-clients/react-query-cqrs-client)) — these are public APIs of 6 published
  packages; changing them is a major version bump and overlaps the existing `ApiResponse<T>` / `CommandResult` design
  from [cqrs-client-base](packages/cqrs-clients/cqrs-client-base).
- **rx-cqrs-client** — RxJS has its own error channel; mixing `Result` inside Observables adds cognitive overhead with
  little gain.
- **React Query `queryFn` handlers in kratos**
  ([packages/kratos/src/lib/flows/login/hooks/useGetLoginFlow.ts:22-30](packages/kratos/src/lib/flows/login/hooks/useGetLoginFlow.ts#L22)
  and ~9 siblings) — React Query _expects_ throws to drive its error state, so converting these gains nothing.
- **Silent-swallow passkey calls**
  ([packages/kratos/src/lib/utils/passkeys/index.ts:22-37](packages/kratos/src/lib/utils/passkeys/index.ts#L22)) — these
  are _intentionally_ returning `undefined` on error. Convertible to `Result`, but only if you actually want callers to
  handle the absence explicitly.
- **CLI top-level entry points** in [packages/intl/src/commands/](packages/intl/src/commands/) — these are where Results
  get unwrapped to exit codes; they should remain try/catch (or `.match()`).

## Honest assessment

**~36 of 63 blocks (≈57%) are technically convertible** without touching public APIs. Of those, **~10–12 would
meaningfully improve readability or correctness** (the Category A wrappers in `intl/poeditor` and `mail-translation`,
plus the swallow-bug in `image-uploader`). The rest are short single-use blocks where neverthrow adds a dependency for
marginal stylistic win.

**Recommendation**: this isn't a "rip out all try/catch" situation. If you want to adopt neverthrow:

- Pilot it in **`packages/intl`** only (densest cluster, no external API breakage), specifically
  `poeditor/POEditorClient.ts` + the two CLI command files. ~15 blocks converted, 1 package gets the dep, you can
  reverse course cheaply if the team dislikes it.
- Re-evaluate after that pilot before touching `mail-translation`, `image-uploader`, or any CQRS client.

## What I would not recommend

- Adding neverthrow as a peer dep of `cqrs-client-base` or any of the CQRS clients in this pass — that's a multi-package
  coordinated breaking change masquerading as a refactor.
- Converting the kratos React Query `queryFn`s — net negative.

## Verification of this report

Findings are derived from a ripgrep + read sweep over the repo. To spot-check:

```
rg -n --type ts --type tsx -g '!**/node_modules' -g '!**/dist' -g '!**/coverage' '\bcatch\s*\(' packages | wc -l
rg -n --type ts --type tsx -g '!**/node_modules' '"neverthrow"' .
```

The first should land near 63; the second should return nothing (confirming it isn't currently a dep).
