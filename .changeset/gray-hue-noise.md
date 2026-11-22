---
"colord": patch
---

Fix: `toHsl()`, `toHsv()`, `toHwb()` and `hue()` give a gray from LAB, LCH, OKLab, OKLCH or `mix()` the hue 0, so `lch(50% 0 0)` is `hsl(0, 0%, 47%)`, not `hsl(152, 0%, 47%)` ❤️ [@anubhavlal07](https://github.com/anubhavlal07)
