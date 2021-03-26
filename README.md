<div align="center">
  <a href="https://npmjs.org/package/colord">
    <img alt="npm" src="https://img.shields.io/npm/v/colord.svg?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://github.com/omgovich/colord/actions">
    <img alt="build" src="https://img.shields.io/github/workflow/status/omgovich/colord/Node.js%20CI/master.svg?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://codecov.io/gh/omgovich/colord">
    <img alt="coverage" src="https://img.shields.io/codecov/c/github/omgovich/colord.svg?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://npmjs.org/package/colord">
    <img alt="no dependencies" src="https://badgen.net/bundlephobia/dependency-count/colord?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://bundlephobia.com/result?p=colord">
    <img alt="tree-shakeable" src="https://badgen.net/bundlephobia/tree-shaking/colord?labelColor=da248d&color=6ead0a" />
  </a>
  <a href="https://npmjs.org/package/colord">
    <img alt="types included" src="https://badgen.net/npm/types/colord?labelColor=da248d&color=6ead0a" />
  </a>
</div>

<div align="center">
  <strong>colord</strong> is a tiny color manipulation and conversion tool <strong>(is not production ready yet)</strong>
</div>

## Roadmap

- [x] Parse and convert Hex, RGB(A), HSL(A), HSV(A)
- [x] Saturate, desaturate, grayscale
- [x] Trim an input value
- [x] Clamp input numbers to resolve edge cases (e.g. `rgb(256, -1, 999, 2)`)
- [x] `brightness`, `isDark`, `isLight`
- [x] Set and get `alpha`
- [ ] Plugin API
- [ ] 8-digit (RGBA) Hex
- [x] `lighten`, `darken`
- [x] `invert`
- [ ] CSS color names (via plugin)
- [ ] A11y and contrast utils (via plugin)
