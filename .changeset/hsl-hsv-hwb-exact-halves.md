---
"colord": patch
---

Fix: `toHsl()`, `toHsv()`, `toHwb()` and `hue()` round a hue or saturation that is exactly half up, so `#007805` has the hue 123, not 122 ❤️ [@simonkundrik](https://github.com/simonkundrik)
