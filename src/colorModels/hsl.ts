import { InputObject, RgbaColor, HslaColor, HsvaColor } from "../types";
import { round } from "../helpers";
import { hsvaToRgba, rgbaToHsva } from "./hsv";
import { clamp, isPresent } from "../helpers";

export const clampHsla = (hsla: HslaColor): HslaColor => ({
  h: clamp(hsla.h, 0, 360),
  s: clamp(hsla.s, 0, 100),
  l: clamp(hsla.l, 0, 100),
  a: clamp(hsla.a),
});

export const roundHsla = (hsla: HslaColor): HslaColor => ({
  h: round(hsla.h),
  s: round(hsla.s),
  l: round(hsla.l),
  a: round(hsla.a, 2),
});

export const parseHsla = ({ h, s, l, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(s) || !isPresent(l)) return null;

  const hsla = clampHsla({
    h: Number(h),
    s: Number(s),
    l: Number(l),
    a: Number(a),
  });

  return hslaToRgba(hsla);
};

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
    h,
    s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
    l: hh / 2,
    a,
  };
};

export const hslaToRgba = (hsla: HslaColor): RgbaColor => {
  return hsvaToRgba(hslaToHsva(hsla));
};

export const rgbaToHsla = (rgba: RgbaColor): HslaColor => {
  return hsvaToHsla(rgbaToHsva(rgba));
};
