import { RgbaColor, ColorModel } from "../types";
import { round } from "../helpers";
import { roundRgba } from "./rgba";

const hexMatcher = /^\s*#?([0-9A-F]{3,4}){1,2}\s*$/i;

/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
export const parseHex = (hex: string): RgbaColor | null => {
  if (!hexMatcher.test(hex)) return null;

  hex = hex.replace("#", "").trim();

  if (hex.length <= 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16),
      g: parseInt(hex[1] + hex[1], 16),
      b: parseInt(hex[2] + hex[2], 16),
      a: hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1,
    };
  }

  return {
    r: parseInt(hex.substr(0, 2), 16),
    g: parseInt(hex.substr(2, 2), 16),
    b: parseInt(hex.substr(4, 2), 16),
    a: hex.length === 8 ? parseInt(hex.substr(6, 2), 16) / 255 : 1,
  };
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

export const HEX: ColorModel<string, string> = {
  convert: rgbaToHex,
  parse: parseHex,
};
