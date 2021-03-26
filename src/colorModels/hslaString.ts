import { ColorModel, RgbaColor } from "../types";
import { clampHsla, rgbaToHsla, hslaToRgba } from "./hsla";

const hslaMatcher = /hsla?\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)%?,\s*(-?\d+\.?\d*)%?,?\s*(-?\d+\.?\d*)?\)/i;

export const parseHslaString = (input: string): RgbaColor | null => {
  const match = hslaMatcher.exec(input);

  if (!match) return null;

  const hsla = clampHsla({
    h: Number(match[1]),
    s: Number(match[2]),
    l: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  });

  return hslaToRgba(hsla);
};

export const rgbaToHslaString = (rgba: RgbaColor): string => {
  const { h, s, l, a } = rgbaToHsla(rgba);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

export const HSLA_STRING: ColorModel<string, string> = {
  convert: rgbaToHslaString,
  parse: parseHslaString,
};
