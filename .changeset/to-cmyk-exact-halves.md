---
"colord": patch
---

Fix: `toCmyk()` and `toCmykString()` round a percent that is exactly half up, so `#050808` is `c: 38`, not `c: 37`
