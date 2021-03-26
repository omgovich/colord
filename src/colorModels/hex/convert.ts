import { RgbaColor } from "../../types";
import { round } from "../../helpers";
import { roundRgba } from "../rgba/convert";

const format = (number: number) => {
  const hex = number.toString(16);
  return hex.length < 2 ? "0" + hex : hex;
};

export const rgbaToHex = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  const alphaHex = a < 1 ? format(round(a * 255)) : "";
  return "#" + format(r) + format(g) + format(b) + alphaHex;
};
