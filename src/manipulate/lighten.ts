import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const lighten = (rgba: RgbaColor, amount: number): HslaColor => {
  const { h, s, l, a } = rgbaToHsla(rgba);

  return {
    h,
    s,
    l: clamp(l + amount * 100, 0, 100),
    a,
  };
};
