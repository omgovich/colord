import { parseHue } from "../helpers";
import { RgbaColor } from "../types";
import { clampHsla, rgbaToHsla, hslaToRgba, roundHsla } from "./hsl";

const hslaMatcher = /hsla?\(?\s*(-?\d*\.?\d+)(deg|rad|grad|turn)?[,\s]+(-?\d*\.?\d+)%?[,\s]+(-?\d*\.?\d+)%?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export const parseHslaString = (input: string): RgbaColor | null => {
  const match = hslaMatcher.exec(input);

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
