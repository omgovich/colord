import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const saturate = (rgba: RgbaColor, amount: number): HslaColor => {
  const hsla = rgbaToHsla(rgba);

  return {
    h: hsla.h,
    s: clamp(hsla.s + amount * 100, 0, 100),
    l: hsla.l,
    a: hsla.a,
  };
};
