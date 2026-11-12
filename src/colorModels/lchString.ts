import { RgbaColor } from "../types";
import { parseHue } from "../helpers";
import { clampLcha, rgbaToLcha, lchaToRgba, roundLcha } from "./lch";

// The only valid LCH syntax
// lch() = lch( [<percentage> | <number>] [<percentage> | <number>] <hue> [ / <alpha-value> ]? )
// 100% equals 100 for lightness and 150 for chroma
const lchaMatcher = /^lch\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)%?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(deg|rad|grad|turn)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i;

/**
 * Parses a valid LCH CSS color function/string
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
export const parseLchaString = (input: string): RgbaColor | null => {
  const match = lchaMatcher.exec(input);

  if (!match) return null;

  const lcha = clampLcha({
    l: Number(match[1]),
    c: Number(match[2]) * (match[3] ? 1.5 : 1),
    h: parseHue(match[4], match[5]),
    a: match[6] === undefined ? 1 : Number(match[6]) / (match[7] ? 100 : 1),
  });

  return lchaToRgba(lcha);
};

export const rgbaToLchaString = (rgba: RgbaColor): string => {
  const { l, c, h, a } = roundLcha(rgbaToLcha(rgba));
  return a < 1 ? `lch(${l}% ${c} ${h} / ${a})` : `lch(${l}% ${c} ${h})`;
};
