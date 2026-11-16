---
"colord": patch
---

Fix: `lab` plugin clamps a lightness above 100 to 100, as CSS Color 4 requires, such as `{ l: 130, a: -60, b: 60 }` ❤️ [@bardrop](https://github.com/bardrop)
