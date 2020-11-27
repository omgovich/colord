import { RgbaColor, HslaColor, HsvaColor } from "../types";
import { hsvaToRgba } from "./hsva";

export const hslaToHsva = ({ h, s, l, a }: HslaColor): HsvaColor => {
  s *= (l < 50 ? l : 100 - l) / 100;

  return {
    h: h,
    s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
    v: l + s,
    a,
  };
};

export const hslaToRgba = (hsla: HslaColor): RgbaColor => {
  return hsvaToRgba(hslaToHsva(hsla));
};
