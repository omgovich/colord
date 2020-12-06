import { RgbaColor } from "../types";
import { roundRgba } from "./rgba";

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbaToHex = (rgba: RgbaColor): string => {
  const { r, g, b } = roundRgba(rgba);
  return "#" + format(r) + format(g) + format(b);
};
