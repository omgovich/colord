import { RgbaColor } from "../../types";
import { rgbaToHsla } from "../hsla/convert";

export const rgbaToHslaString = (rgba: RgbaColor): string => {
  const { h, s, l, a } = rgbaToHsla(rgba);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};
