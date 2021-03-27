import { RgbaColor } from "../types";
import { roundRgba, clampRgba } from "./rgba";

const rgbaMatcher = /rgba?\((-?\d+),\s*(-?\d+),\s*(-?\d+),?\s*(-?\d+\.?\d*)?\)/i;

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
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
