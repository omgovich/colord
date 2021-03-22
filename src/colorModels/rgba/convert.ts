import { RgbaColor } from "../../types";
import { round } from "../../helpers";

export const roundRgba = (rgba: RgbaColor): RgbaColor => ({
  r: round(rgba.r),
  g: round(rgba.g),
  b: round(rgba.b),
  a: round(rgba.a, 2),
});
