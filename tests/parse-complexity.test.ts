import { colord, extend } from "../src/";
import cmykPlugin from "../src/plugins/cmyk";
import hwbPlugin from "../src/plugins/hwb";
import lchPlugin from "../src/plugins/lch";
import oklabPlugin from "../src/plugins/oklab";
import oklchPlugin from "../src/plugins/oklch";

extend([cmykPlugin, hwbPlugin, lchPlugin, oklabPlugin, oklchPlugin]);

/**
 * Every CSS function matcher spells a number as `(?:\d*\.\d+|\d+)` instead of the
 * shorter `\d*\.?\d+`. The shorter form lets two quantifiers match the same digits,
 * so a long malformed color can be divided between them in O(n²) ways, and a
 * rejection retries every division. Parsing is synchronous and uninterruptible,
 * so that time is taken from everything else sharing the thread.
 *
 * The two forms accept exactly the same strings, which means no assertion about
 * parsing results can tell them apart — only running time can. The budget below is
 * deliberately loose: these inputs need well under a millisecond with an
 * unambiguous number and several seconds without one, so a slow or noisy machine
 * cannot turn this into a flaky test.
 */
const LENGTH = 64000;
const BUDGET_MS = 500;

// A number long enough to be expensive, followed by a character that cannot appear
// in any color function, forcing the matcher to reject the input.
const digits = "1".repeat(LENGTH);

const parseDuration = (input: string): number => {
  const start = Date.now();
  expect(colord(input).isValid()).toBe(false);
  return Date.now() - start;
};

describe("Rejects oversized malformed colors in linear time", () => {
  it.each([
    ["rgb", `rgb(${digits}!`],
    ["rgb, alpha position", `rgba(1, 2, 3, ${digits}!`],
    ["hsl", `hsl(${digits}!`],
    ["hsl, alpha position", `hsl(1deg 2% 3% / ${digits}!`],
    ["hwb", `hwb(${digits}!`],
    ["lch", `lch(${digits}!`],
    ["oklab", `oklab(${digits}!`],
    ["oklch", `oklch(${digits}!`],
    ["device-cmyk", `device-cmyk(${digits}!`],
  ])(
    "%s",
    (_name, input) => {
      expect(parseDuration(input)).toBeLessThan(BUDGET_MS);
    },
    30000
  );
});
