import { round } from "../helpers";
import { RgbaColor, HslaColor, HsvaColor } from "../types";
import { hsvaToRgba, rgbaToHsva } from "./hsva";

export const hslaToHsva = ({ h, s, l, a }: HslaColor): HsvaColor => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
    a,
  };
};

export const hsvaToHsla = ({ h, s, v, a }: HsvaColor): HslaColor => {
  const hh = ((200 - s) * v) / 100;

  return {
    h: round(h),
    s: round(hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0),
    l: round(hh / 2),
    a: round(a, 2),
  };
};

export const hslaToRgba = (hsla: HslaColor): RgbaColor => {
  return hsvaToRgba(hslaToHsva(hsla));
};

export const rgbaToHsla = (rgba: RgbaColor): HslaColor => {
  return hsvaToHsla(rgbaToHsva(rgba));
};
