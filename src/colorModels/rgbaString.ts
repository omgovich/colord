import { RgbaColor } from "../types";
import { roundRgba, clampRgba } from "./rgba";

const rgbaMatcher = /rgba?\(?\s*(-?\d+),?\s*(-?\d+),?\s*(-?\d+),?\s*(-?\d*\.?\d+)?\s*\)?/i;

export const parseRgbaString = (input: string): RgbaColor | null => {
  const match = rgbaMatcher.exec(input);

  if (!match) return null;

  return clampRgba({
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  });
};

export const rgbaToRgbaString = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
};
