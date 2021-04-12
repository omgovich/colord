import { RgbaColor, HwbaColor, InputObject } from "../types";
import { clamp, round, isPresent } from "../helpers";
import { hsvaToRgba, rgbaToHsva } from "./hsva";

export const clampHwba = ({ h, w, b, a }: HwbaColor): HwbaColor => ({
  h: clamp(h, 0, 360),
  w: clamp(w, 0, 100),
  b: clamp(b, 0, 100),
  a: clamp(a),
});

export const roundHwba = (hwba: HwbaColor): HwbaColor => ({
  h: round(hwba.h),
  w: round(hwba.w),
  b: round(hwba.b),
  a: round(hwba.a, 2),
});

export const rgbaToHwba = (rgba: RgbaColor): HwbaColor => {
  const { h } = rgbaToHsva(rgba);
  const w = (Math.min(rgba.r, rgba.g, rgba.b) / 255) * 100;
  const b = 100 - (Math.max(rgba.r, rgba.g, rgba.b) / 255) * 100;
  return { h, w, b, a: rgba.a };
};

export const hwbaToRgba = ({ h, w, b, a }: HwbaColor): RgbaColor => {
  return hsvaToRgba({
    h,
    s: b === 100 ? 0 : 100 - (w / (100 - b)) * 100,
    v: 100 - b,
    a,
  });
};

export const parseHwba = ({ h, w, b, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(h) || !isPresent(w) || !isPresent(b)) return null;

  const hwba = clampHwba({
    h: Number(h),
    w: Number(w),
    b: Number(b),
    a: Number(a),
  });

  return hwbaToRgba(hwba);
};
