import { rgbaToHsla } from "../colorModels/hsla";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const saturate = (rgba: RgbaColor, ratio: number): HslaColor => {
  const { h, s, l, a } = rgbaToHsla(rgba);

  return {
    h,
    s: clamp(s + ratio * 100, 0, 100),
    l,
    a,
  };
};
