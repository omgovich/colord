import { RgbaColor } from "../../types";
import { clampHsla } from "../hsla/parse";
import { hslaToRgba } from "../hsla/convert";

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
