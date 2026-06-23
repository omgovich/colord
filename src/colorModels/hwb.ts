import { RgbaColor, HwbaColor, InputObject } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, clampHue, round, roundHue, isPresent } from "../helpers";
import { hsvaToRgba, rgbaToHsva } from "./hsv";

export const clampHwba = (hwba: HwbaColor): HwbaColor => ({
  h: clampHue(hwba.h),
  w: clamp(hwba.w, 0, 100),
  b: clamp(hwba.b, 0, 100),
  a: clamp(hwba.a),
});

export const roundHwba = (hwba: HwbaColor): HwbaColor => ({
  h: roundHue(hwba.h),
  w: round(hwba.w),
  b: round(hwba.b),
  a: round(hwba.a, ALPHA_PRECISION),
});

export const rgbaToHwba = (rgba: RgbaColor): HwbaColor => {
  const { h } = rgbaToHsva(rgba);
  const w = (Math.min(rgba.r, rgba.g, rgba.b) / 255) * 100;
  const b = 100 - (Math.max(rgba.r, rgba.g, rgba.b) / 255) * 100;
  return { h, w, b, a: rgba.a };
};

export const hwbaToRgba = (hwba: HwbaColor): RgbaColor => {
  // When the sum of whiteness and blackness reaches 100% the color is an
  // achromatic gray with value white / (white + black).
  // https://www.w3.org/TR/css-color-4/#hwb-to-rgb
  if (hwba.w + hwba.b >= 100) {
    const gray = (hwba.w / (hwba.w + hwba.b)) * 255;
    return { r: gray, g: gray, b: gray, a: hwba.a };
  }

  return hsvaToRgba({
    h: hwba.h,
    s: 100 - (hwba.w / (100 - hwba.b)) * 100,
    v: 100 - hwba.b,
    a: hwba.a,
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
