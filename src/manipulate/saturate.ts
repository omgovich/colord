import { rgbaToHsla } from "../colorModels/hsla";
import { RgbaColor } from "../types";
import { clamp } from "../helpers";
import { colord, Colord } from "../colord";

export const saturate = (rgba: RgbaColor, ratio: number): Colord => {
  const { h, s, l, a } = rgbaToHsla(rgba);

  return colord({
    h,
    s: clamp(s + ratio * 100, 0, 100),
    l,
    a,
  });
};
