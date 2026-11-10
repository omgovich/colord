# Contributing to colord

Thanks for helping out! Colord is a small library, but millions of projects depend on it, so we care a lot about correctness, backward compatibility and bundle size.

## Reporting bugs and ideas

- Bugs and feature requests go to [GitHub issues](https://github.com/omgovich/colord/issues). For a bug, include the input color, the output you got and the output you expected.
- Security vulnerabilities should be reported privately, see [SECURITY.md](SECURITY.md).

## Development

```sh
npm install
npm run lint         # ESLint
npm run check-types  # TypeScript
npm run test         # Jest with coverage
npm run size         # build + bundle size budgets
```

CI runs all four on every pull request, so please run them before pushing.

## Pull requests

- **Follow the CSS Color specs.** Conversions should match the spec and reference converters. When fixing a conversion bug, add the failing color to `tests/fixtures.ts` or the relevant test.
- **Keep coverage at 100%.** Every new branch needs a test.
- **Don't break existing behavior.** Changes to output rounding, parsing or defaults can break someone's build. If a behavior change is the point of your PR, say so in the description.
- **Watch the bundle size.** Every entry point has a budget in `package.json`, and colord has no runtime dependencies. Please don't add any.
- **Add a changeset** if your PR changes the published package: run `npx changeset` and write a one-line summary that credits you, e.g. `Fix: ... ❤️ [@user](https://github.com/user)` (see [.changeset/README.md](.changeset/README.md)). Docs, tests and CI changes don't need one.
- **Update README.md** when the public API changes. It's the only API documentation.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
