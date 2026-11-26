---
"colord": patch
---

Fix: `toName({ closest: true })` parses the CSS color keywords once instead of on every call, which makes it about 7 times faster ❤️ [@bardrop](https://github.com/bardrop)
