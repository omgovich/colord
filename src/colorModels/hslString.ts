import { parseHue } from "../helpers";
import { RgbaColor } from "../types";
import { clampHsla, rgbaToHsla, hslaToRgba, roundHsla } from "./hsl";

// Functional syntax
// hsl( <hue>, <percentage>, <percentage>, <alpha-value>? )
const commaHslaMatcher = /^hsla?\(\s*([+-]?\d{1,3})(deg|rad|grad|turn)?\s*,\s*([+-]?\d{1,3})%\s*,\s*([+-]?\d{1,3})%\s*(?:,\s*([+-]?\d*\.?\d{1,3})(%)?\s*)?\)$/i;

// Whitespace syntax
// hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? )
const spaceHslaMatcher = /^hsla?\(\s*([+-]?\d{1,3}(?:\.\d+)?)\s*(deg|rad|grad|turn)?\s+([+-]?\d{1,3}(?:\.\d+)?)%\s+([+-]?\d{1,3}(?:\.\d+)?)%\s*(?:\/\s*([+-]?\d{1,3}(?:\.\d+)?)%)?\)$/i;

/**
 * Parses a valid HSL[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#the-hsl-notation
 */
export const parseHslaString = (input: string): RgbaColor | null => {
  const match = commaHslaMatcher.exec(input) || spaceHslaMatcher.exec(input);

  if (!match) return null;

  const hsla = clampHsla({
    h: parseHue(match[1], match[2]),
    s: Number(match[3]),
    l: Number(match[4]),
    a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
  });

  return hslaToRgba(hsla);
};

export const rgbaToHslaString = (rgba: RgbaColor): string => {
  const { h, s, l, a } = roundHsla(rgbaToHsla(rgba));
  return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};
