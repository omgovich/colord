import { rgbaToHsla } from "../convert/hsla";
import { Colord, RgbaColor } from "../types";
import { clamp } from "../helpers";
import { colord } from "../colord";

export const saturate = (rgba: RgbaColor, amount: number): Colord => {
  const { h, s, l, a } = rgbaToHsla(rgba);

  return colord({
    h,
    s: clamp(s + amount, 0, 100),
    l,
    a,
  });
};
