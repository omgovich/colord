import { RgbaColor } from "../types";
import { roundRgba, clampRgba } from "./rgb";

// Functional syntax
// rgb( <percentage>#{3} , <alpha-value>? )
// rgb( <number>#{3} , <alpha-value>? )
const commaRgbaMatcher = /^rgba?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*(?:,\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i;

// Whitespace syntax
// rgb( [ <number> | <percentage> ]{3} [ / <alpha-value> ]? )
const spaceRgbaMatcher = /^rgba?\(\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s+([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*(?:\/\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?)(%)?\s*)?\)$/i;

/**
 * Parses a valid RGB[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#rgb-functions
 */
export const parseRgbaString = (input: string): RgbaColor | null => {
  const commaMatch = commaRgbaMatcher.exec(input);

  // Only the legacy comma syntax forbids mixing numbers and percentages
  // https://www.w3.org/TR/css-color-4/#rgb-functions
  if (commaMatch && (commaMatch[2] !== commaMatch[4] || commaMatch[4] !== commaMatch[6]))
    return null;

  const match = commaMatch || spaceRgbaMatcher.exec(input);

  if (!match) return null;

  return clampRgba({
    r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
    g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
    b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
    a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
  });
};

export const rgbaToRgbaString = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
};
