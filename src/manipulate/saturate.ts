import { rgbaToHsla } from "../colorModels/hsl";
import { HslaColor, RgbaColor } from "../types";
import { clamp } from "../helpers";

export const saturate = (rgba: RgbaColor, amount: number, relative?: boolean): HslaColor => {
  const hsla = rgbaToHsla(rgba);

  return {
    h: hsla.h,
    // Relative mode shifts by a fraction of the current saturation, like Qix's `color` library
    s: clamp(hsla.s + amount * (relative ? hsla.s : 100), 0, 100),
    l: hsla.l,
    a: hsla.a,
  };
};
