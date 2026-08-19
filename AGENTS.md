# AGENTS.md

Guidance for AI agents working in this repository.

## Commands

- **Lint:** `npm run lint`
- **Type check:** `npm run check-types`
- **Test (with coverage):** `npm run test`
- **Test single file:** `npx jest tests/colord.test.ts`
- **Test single case:** `npx jest tests/plugins.test.ts -t "lab"`
- **Bundle size check:** `npm run size` (runs a full build first, then `size-limit`)
- **Build:** `npm run build` (rollup → `dist/`)
- **Benchmark:** `npm run benchmark` (compares against tinycolor2, chroma-js, etc.)
- **Release dry run:** `npm run check-release`

CI (`.github/workflows/node.yml`) runs `lint`, `check-types`, `test`, and `size` on Node 18/20/22. Run all four before declaring work done.

## Key constraint: bundle size

Size budgets are enforced by `size-limit` in package.json: the main bundle (`{ colord }` import) must stay under **2 KB** gzipped, and every plugin has its own budget (0.5–1.5 KB). Zero runtime dependencies.

This shapes the code style: ternary chains instead of `Math.min/Math.max` (see `clamp` in `src/helpers.ts`), arrays of tuples instead of objects for parser lists, no classes outside `Colord` itself. When adding code, run `npm run size` and keep the terser-minified output in mind.

## Architecture

A tiny immutable color manipulation/conversion library. No DOM, no dependencies.

### Internal color model: unrounded RGBA

`Colord` stores one thing: `this.rgba`, an RGBA object kept **unrounded** for conversion accuracy. Rounding happens only at output time via `roundRgba`/`roundHsla`/`roundHsva` etc. Every manipulation method returns a *new* `Colord` instance.

### Parsing never throws

Invalid input silently produces black (`{r:0, g:0, b:0, a:1}`) with `isValid() === false`. `parse()` in `src/parse.ts` walks ordered parser lists (`parsers.string` / `parsers.object`) and returns `[RgbaColor | null, format]`.

### Regex safety (ReDoS)

CSS function matchers must spell numbers as `(?:\d*\.\d+|\d+)`, never `\d*\.?\d+` — the shorter form causes O(n²) backtracking on malformed input. `tests/parse-complexity.test.ts` enforces linear-time rejection; keep it passing when touching any parsing regex.

### Core vs plugins

The core (`src/index.ts`: `colord`, `Colord`, `extend`, `getFormat`, `random`) supports only hex/rgb/hsl/hsv. Everything else (lab, lch, hwb, xyz, cmyk, a11y, mix, names, harmonies, minify) is an opt-in plugin.

A plugin is `(ColordClass, parsers) => void`: it mutates `Colord.prototype`, pushes new parsers, and augments types via `declare module "../colord"`. See `src/plugins/hwb.ts` for the canonical shape. To add a plugin:

1. Create `src/plugins/<name>.ts` with a default export — rollup auto-discovers `src/plugins/*.ts` and builds each as its own entry point.
2. Add an `exports` entry for `./plugins/<name>` in package.json.
3. Add a size budget for `dist/plugins/<name>.mjs` in the `size-limit` array.
4. Document it in README.md (the README is the only API documentation).

### Color models

Each format lives in `src/colorModels/<format>.ts` with `parseX`, `rgbaToX`, `xToRgba`, `clampX`, `roundX` functions (hex only needs the first two); CSS-string parsing/serialization is split into sibling `<format>String.ts` files so object-only plugins don't pay for regex code.

### Publishing layout

`npm run release` builds and publishes **`./dist`** (with package.json and .md files copied in), so the npm package root is `dist/`: users import `colord` and `colord/plugins/lch`, while paths in this repo are `src/...`. The `files`/`exports` fields in package.json describe the dist layout, not the repo layout.

## Testing

- `tests/colord.test.ts` — core; `tests/plugins.test.ts` — all plugins; conversion fixtures in `tests/fixtures.ts` are cross-checked against reference converters (links at the top of the file).
- Tests import from `../src/` directly (ts-jest), not from a build — no build step needed to run tests.
- When fixing a conversion bug, add the failing color to the fixtures or the relevant test rather than a one-off assertion.

## Code style

- Prettier with 100 char line width; strict TypeScript, no `any`.
- Comments in the source often justify size or precision tricks — keep them when refactoring.
- Do not add "Co-Authored-By" lines to commits or "Generated with Claude Code" to PR descriptions.
- Update README.md when the public API changes (new methods, plugins, parsing behavior).
