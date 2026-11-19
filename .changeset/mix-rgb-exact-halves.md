---
"colord": patch
---

Fix: `mix()` and the palettes in RGB space round a channel that is exactly half up, so black mixed 58% of the way to `#191919` is `#0f0f0f`, not `#0e0e0e` ❤️ [@simonkundrik](https://github.com/simonkundrik)
