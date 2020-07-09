# LeanCode CoreJs Library

```sh
$ npm config set @leancode:registry=https://f.feedz.io/leancode/corelibrary/npm/
$ npm login --registry https://f.feedz.io/leancode/corelibrary/npm/ --scope=@leancode
# username - [firstname]-[lastname]
# password - your feedz.io personal access token https://feedz.io/account/personal-access-tokens
# email - [firstname].[lastname]@leancode.pl
$ npm config set always-auth true
```

## Contributing

### Setup

1. Clone the repo
2. `cd` into repo root
3. `npx lerna bootstrap`

### Modifying existing packages

1. Setup the repository
2. Create a new branch for your work, preferably starting with `feature/` for new features or `fix/` for bugfixes
3. Code and commit your changes
4. Create a pull request. Please remember to rebase your branch onto `master` before the next step
5. Once your CI build succeeds, the PR gets enough approvals and is overall ready to be merged, version the changes running `yarn lerna version`. See `yarn lerna version --help` for what kind of version bump suits your changes best. Lerna will version the packages, add a git tag and generate changelogs, and then push them to remote.
6. The PR can be merged now (--no-ff)
7. Once the PR is merged, build the packages before publishing `yarn lerna run build`
8. Publish the packages `yarn lerna publish`
