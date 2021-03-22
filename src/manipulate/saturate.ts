import { HSLA } from "../colorModels/hsla";
import { RgbaColor } from "../types";
import { clamp } from "../helpers";
import { colord, Colord } from "../colord";

export const saturate = (rgba: RgbaColor, amount: number): Colord => {
  const { h, s, l, a } = HSLA.convert(rgba);

  return colord({
    h,
    s: clamp(s + amount, 0, 100),
    l,
    a,
  });
};
