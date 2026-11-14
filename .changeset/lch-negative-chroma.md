---
"colord": patch
---

Fix: `lch` plugin clamps a negative chroma to 0 instead of flipping the hue, such as `lch(50% -20 30)` ❤️ [@bardrop](https://github.com/bardrop)
