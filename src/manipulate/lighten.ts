import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const lighten = (rgba: RgbaColor, amount: number, relative = false): HslaColor => {
  const hsla = rgbaToHsla(rgba);
  const l = relative ? hsla.l * (1 + amount) : hsla.l + amount * 100;

  return {
    h: hsla.h,
    s: hsla.s,
    l: clamp(l, 0, 100),
    a: hsla.a,
  };
};
