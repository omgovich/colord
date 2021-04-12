import { RgbaColor } from "../types";
import { clampHsla, rgbaToHsla, hslaToRgba, roundHsla } from "./hsla";

const hslaMatcher = /hsla?\(?s*(-?\d+\.?\d*),?\s*(-?\d+\.?\d*)%?,?\s*(-?\d+\.?\d*)%?,?\s*(-?\d*\.?\d+)?s*\)?/i;

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
  const { h, s, l, a } = roundHsla(rgbaToHsla(rgba));
  return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};
