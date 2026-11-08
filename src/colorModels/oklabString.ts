import { RgbaColor } from "../types";
import { clampOklaba, oklabaToRgba, rgbaToOklaba, roundOklaba } from "./oklab";

// The only valid OKLab syntax (modern space-separated form; no legacy comma form exists)
// oklab() = oklab( [<percentage> | <number>]{3} [ / <alpha-value> ]? )
// 100% equals 1 for lightness and 0.4 for both axes
const oklabaMatcher = /^oklab\(\s*([+-]?(?:\d*\.\d+|\d+))(%)?\s+([+-]?(?:\d*\.\d+|\d+))(%)?\s+([+-]?(?:\d*\.\d+|\d+))(%)?\s*(?:\/\s*([+-]?(?:\d*\.\d+|\d+))(%)?\s*)?\)$/i;

/**
 * Parses a valid OKLab CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
 */
export const parseOklabaString = (input: string): RgbaColor | null => {
  const match = oklabaMatcher.exec(input);

  if (!match) return null;

  const laba = clampOklaba({
    l: Number(match[1]) / (match[2] ? 100 : 1),
    a: Number(match[3]) * (match[4] ? 0.004 : 1),
    b: Number(match[5]) * (match[6] ? 0.004 : 1),
    alpha: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
    ok: true,
  });

  return oklabaToRgba(laba);
};

export const rgbaToOklabaString = (rgba: RgbaColor): string => {
  const { l, a, b, alpha } = roundOklaba(rgbaToOklaba(rgba));
  return alpha < 1 ? `oklab(${l} ${a} ${b} / ${alpha})` : `oklab(${l} ${a} ${b})`;
};
