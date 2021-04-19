import { RgbaColor } from "../types";
import { round } from "../helpers";
import { roundRgba } from "./rgb";

const hexMatcher = /^\s*#?([0-9a-f]{3,8})\s*$/i;

/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
export const parseHex = (hex: string): RgbaColor | null => {
  const hexMatch = hexMatcher.exec(hex);

  if (!hexMatch) return null;

  hex = hexMatch[1];

  if (hex.length <= 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1,
    };
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
      a: hex.length === 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1,
    };
  }

  return null;
};

/** Formats any decimal number (e.g. 128) as a hexadecimal string (e.g. "08") */
const format = (number: number): string => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

/** Converts RGBA object to Hex6 or (if it has alpha channel) Hex8 string */
export const rgbaToHex = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  const alphaHex = a < 1 ? format(round(a * 255)) : "";
  return "#" + format(r) + format(g) + format(b) + alphaHex;
};
