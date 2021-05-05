import { RgbaColor } from "../types";
import { roundRgba, clampRgba } from "./rgb";

const rgbaMatcher = /rgba?\(?\s*(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?[,\s]+(-?\d*\.?\d+)(%)?,?\s*[/\s]*(-?\d*\.?\d+)?(%)?\s*\)?/i;

export const parseRgbaString = (input: string): RgbaColor | null => {
  const match = rgbaMatcher.exec(input);

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
