---
"colord": patch
---

Fix: CMYK colors round a channel that is exactly half up, so `device-cmyk(0% 0% 0% 90%)` is `#1a1a1a` and not `#191919` ❤️ [@simonkundrik](https://github.com/simonkundrik)
