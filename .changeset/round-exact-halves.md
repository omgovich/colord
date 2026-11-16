---
"colord": patch
---

Fix: `hsl()`, `hsv()` and `hwb()` colors round a channel that is exactly half up, so `hwb(0 10% 0%)` is `#ff1a1a` as in browsers, not `#ff1919` ❤️ [@simonkundrik](https://github.com/simonkundrik)
