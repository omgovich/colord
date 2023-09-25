import { RgbaColor } from "../types";
import { parseHue } from "../helpers";
import { clampLcha, rgbaToLcha, lchaToRgba, roundLcha } from "./lch";
import { ALPHA_PRECISION } from "../constants";

// The only valid LCH syntax
// lch() = lch( <percentage> <number> <hue> [ / <alpha-value> ]? )
const lchaMatcher = /^lch\(\s*([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;

/**
 * Parses a valid LCH CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
export const parseLchaString = (input: string): RgbaColor | null => {
  const match = lchaMatcher.exec(input);

  if (!match) return null;

  const lcha = clampLcha({
    l: Number(match[1]),
    c: Number(match[2]),
    h: parseHue(match[3], match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  });

  return lchaToRgba(lcha);
};

export const rgbaToLchaString = (
  rgba: RgbaColor,
  round = true,
  precision = 2,
  alphaPrecision = ALPHA_PRECISION
): string => {
  const lcha = rgbaToLcha(rgba);
  const { l, c, h, a } = round ? roundLcha(lcha, precision, alphaPrecision) : lcha;
  return a < 1 ? `lch(${l}% ${c} ${h} / ${a})` : `lch(${l}% ${c} ${h})`;
};
