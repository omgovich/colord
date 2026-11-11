import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const lighten = (rgba: RgbaColor, amount: number, relative?: boolean): HslaColor => {
  const hsla = rgbaToHsla(rgba);

  return {
    h: hsla.h,
    s: hsla.s,
    // Relative mode shifts by a fraction of the current lightness, like Qix's `color` library
    l: clamp(hsla.l + amount * (relative ? hsla.l : 100), 0, 100),
    a: hsla.a,
  };
};
