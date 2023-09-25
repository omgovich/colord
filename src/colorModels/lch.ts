import { RgbaColor, InputObject, LchaColor } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, clampHue, isPresent, round } from "../helpers";
import { labaToRgba, rgbaToLaba } from "./lab";

/**
 * Limits LCH axis values.
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 * https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/#how-does-lch-work
 */
export const clampLcha = (laba: LchaColor): LchaColor => ({
  l: clamp(laba.l, 0, 100),
  c: laba.c, // chroma is theoretically unbounded in LCH
  h: clampHue(laba.h),
  a: laba.a,
});

export const roundLcha = (
  laba: LchaColor,
  precision = 2,
  alphaPrecision = ALPHA_PRECISION
): LchaColor => ({
  l: round(laba.l, precision),
  c: round(laba.c, precision),
  h: round(laba.h, precision),
  a: round(laba.a, alphaPrecision),
});

export const parseLcha = ({ l, c, h, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(l) || !isPresent(c) || !isPresent(h)) return null;

  const lcha = clampLcha({
    l: Number(l),
    c: Number(c),
    h: Number(h),
    a: Number(a),
  });

  return lchaToRgba(lcha);
};

/**
 * Performs RGB → CIEXYZ → CIELAB → CIELCH color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const rgbaToLcha = (rgba: RgbaColor): LchaColor => {
  const laba = rgbaToLaba(rgba);

  // Round axis values to get proper values for grayscale colors
  const a = laba.a;
  const b = laba.b;

  const hue = 180 * (Math.atan2(b, a) / Math.PI);

  return {
    l: laba.l,
    c: Math.sqrt(a * a + b * b),
    h: hue < 0 ? hue + 360 : hue,
    a: laba.alpha,
  };
};

/**
 * Performs CIELCH → CIELAB → CIEXYZ → RGB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const lchaToRgba = (lcha: LchaColor): RgbaColor => {
  return labaToRgba({
    l: lcha.l,
    a: lcha.c * Math.cos((lcha.h * Math.PI) / 180),
    b: lcha.c * Math.sin((lcha.h * Math.PI) / 180),
    alpha: lcha.a,
  });
};
