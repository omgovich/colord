import { RgbaColor } from "../types";
import { parseHue } from "../helpers";
import { clampOklcha, oklchaToRgba, rgbaToOklcha, roundOklcha } from "./oklch";

// The only valid OKLCH syntax (modern space-separated form; no legacy comma form exists)
// oklch() = oklch( [<percentage> | <number>] [<percentage> | <number>] <hue> [ / <alpha-value> ]? )
// 100% equals 1 for lightness and 0.4 for chroma
const oklchaMatcher = /^oklch\(\s*([+-]?(?:\d*\.\d+|\d+))(%)?\s+([+-]?(?:\d*\.\d+|\d+))(%)?\s+([+-]?(?:\d*\.\d+|\d+))(deg|rad|grad|turn)?\s*(?:\/\s*([+-]?(?:\d*\.\d+|\d+))(%)?\s*)?\)$/i;

/**
 * Parses a valid OKLCH CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
 */
export const parseOklchaString = (input: string): RgbaColor | null => {
  const match = oklchaMatcher.exec(input);

  if (!match) return null;

  const lcha = clampOklcha({
    l: Number(match[1]) / (match[2] ? 100 : 1),
    c: Number(match[3]) * (match[4] ? 0.004 : 1),
    h: parseHue(match[5], match[6]),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
    ok: true,
  });

  return oklchaToRgba(lcha);
};

export const rgbaToOklchaString = (rgba: RgbaColor): string => {
  const { l, c, h, a } = roundOklcha(rgbaToOklcha(rgba));
  return a < 1 ? `oklch(${l} ${c} ${h} / ${a})` : `oklch(${l} ${c} ${h})`;
};
