# Changesets

Every PR that changes the published package adds a changeset:

```sh
npx changeset
```

Pick `patch`, `minor` or `major` and write one CHANGELOG line, crediting the code contributor:

```md
Fix: Keep the hue within `[0, 360)` in every color model ❤️ [@user](https://github.com/user)
```

On merge to `master`, a "Version Packages" PR collects pending changesets, bumps the version and updates CHANGELOG.md. Merging that PR publishes to npm and creates the git tag and GitHub Release.
