---
"colord": patch
---

Fix: HSL, HSV and HWB conversions round a channel that is exactly half up, so `hwb(0 10% 0%)` is `#ff1a1a` as in browsers, not `#ff1919`; `grayscale()`, `rotate()`, `saturate()`, `lighten()` and `harmonies()` may shift such channels one step too ❤️ [@simonkundrik](https://github.com/simonkundrik)
