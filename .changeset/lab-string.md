---
"colord": minor
---

New: `lab` plugin parses `lab()` strings and adds `toLabString()` ❤️ [@bardrop](https://github.com/bardrop)

Fix: CIE Lightness above 100 is now clamped to 100 for `lab()` strings and `{ l, a, b }` objects, as CSS Color 4 requires ❤️ [@bardrop](https://github.com/bardrop)
