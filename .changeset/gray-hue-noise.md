---
"colord": patch
---

Fix: a gray from LAB, LCH, OKLab, OKLCH or `mix()` comes out exactly gray, so `lch(50% 0 0)` is `hsl(0, 0%, 47%)`, not `hsl(152, 0%, 47%)`, and `colord("#000").mix("#070707")` is `#040404`, not `#030403` ❤️ [@anubhavlal07](https://github.com/anubhavlal07)
