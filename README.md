# js_corelibrary

## Development

### Testing

Run tests for a specific package:
```bash
nx test [package-name]
```

### Building

Build a specific package:
```bash
nx build [package-name]
```

### Linting

Run linting for a specific package:
```bash
nx lint [package-name]
```

## Publishing

1. Create a new branch, name it `release/[version]` e.g. `release/1.2.3`
2. Push that empty branch to the remote (required for the next step to work).
3. Run `npx lerna version [version]` e.g. `npx lerna version 1.2.3`. This command will automatically bump versions
   across all files and push the changes.
4. Create a new pull request for this branch.
5. Go to the `Actions` tab, and then `Release` workflow. Expand the `Run workflow` menu, from the `Tags` tab choose your
   new version and run the workflow.
6. After refreshing the page you should be able to see the workflow running. After it finishes successfully, go back to
   the previously created PR and merge it.
