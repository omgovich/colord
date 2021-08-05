import { RgbaColor } from "../types";
import { round } from "../helpers";
import { roundRgba } from "./rgb";

const hexMatcher = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
export const parseHex = (hex: string): RgbaColor | null => {
  const hexMatch = hexMatcher.exec(hex);
  if (!hexMatch) return null;

  hex = hex.slice(1); // remove the '#' from the front

  const hexParts =
    hex.length > 5
      ? hex.match(/[0-9a-f]{2}/gi)
      : hex.match(/[0-9a-f]/gi)?.map((item) => item.repeat(2));

  const [r, g, b, a] = hexParts?.map((elem) => parseInt(elem, 16)) ?? [0, 0, 0, 255]; // default values

  return { r, g, b, a: hex.length % 4 === 0 ? round(a / 255, 2) : 1 };
};

/** Formats any decimal number (e.g. 128) as a hexadecimal string (e.g. "08") */
const format = (number: number): string => {
  return number.toString(16).padStart(2, "0");
};

/** Converts RGBA object to Hex6 or (if it has alpha channel) Hex8 string */
export const rgbaToHex = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  const alphaHex = a < 1 ? format(round(a * 255)) : "";
  return "#" + format(r) + format(g) + format(b) + alphaHex;
};
