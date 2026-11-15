import { RgbaColor } from "../types";
import { clampLaba, labaToRgba, rgbaToLaba, roundLaba } from "./lab";

// The only valid LAB syntax
// lab() = lab( [<percentage> | <number>]{3} [ / <alpha-value> ]? )
// 100% equals 100 for lightness and 125 for both axes
const labaMatcher = /^lab\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i;

/**
 * Parses a valid LAB CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
export const parseLabaString = (input: string): RgbaColor | null => {
  const match = labaMatcher.exec(input);

  if (!match) return null;

  const laba = clampLaba({
    l: Number(match[1]),
    a: Number(match[2]) * (match[3] ? 1.25 : 1),
    b: Number(match[4]) * (match[5] ? 1.25 : 1),
    alpha: match[6] === undefined ? 1 : Number(match[6]) / (match[7] ? 100 : 1),
  });

  return labaToRgba(laba);
};

export const rgbaToLabaString = (rgba: RgbaColor): string => {
  const { l, a, b, alpha } = roundLaba(rgbaToLaba(rgba));
  return alpha < 1 ? `lab(${l}% ${a} ${b} / ${alpha})` : `lab(${l}% ${a} ${b})`;
};
