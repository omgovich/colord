import { RgbaColor } from "../types";
import { rgbaToHsla } from "./hsla";

export const rgbaToHslaString = (rgba: RgbaColor): string => {
  const { h, s, l, a } = rgbaToHsla(rgba);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};
