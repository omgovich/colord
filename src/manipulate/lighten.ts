import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const lighten = (rgba: RgbaColor, amount: number): HslaColor => {
  const hsla = rgbaToHsla(rgba);

  return {
    h: hsla.h,
    s: hsla.s,
    l: clamp(hsla.l + amount * 100, 0, 100),
    a: hsla.a,
  };
};
