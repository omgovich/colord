import { RgbaColor, OklchaColor, InputObject } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, clampHue, isPresent, round, roundHue } from "../helpers";
import { oklabaToRgba, rgbaToOklaba } from "./oklab";

/**
 * Clamps OKLCH axis values as defined in CSS Color Level 4 specs.
 * https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
 */
export const clampOklcha = (lcha: OklchaColor): OklchaColor => ({
  l: clamp(lcha.l),
  // Negative chroma is clamped to 0; it is theoretically unbounded above
  // (but in practice does not exceed 0.4)
  c: lcha.c < 0 ? 0 : lcha.c,
  h: clampHue(lcha.h),
  a: clamp(lcha.a),
  ok: true,
});

export const roundOklcha = (lcha: OklchaColor): OklchaColor => ({
  // See the note in `roundOklaba`: OKLab scales require finer rounding than CIE's
  l: round(lcha.l, 4),
  c: round(lcha.c, 4),
  h: roundHue(lcha.h, 2),
  a: round(lcha.a, ALPHA_PRECISION),
  ok: true,
});

export const parseOklcha = ({ l, c, h, a = 1, ok }: InputObject): RgbaColor | null => {
  // Bare { l, c, h } objects belong to the CIE LCH plugin;
  // the `ok` marker is what distinguishes an OKLCH object (see the oklch plugin docs)
  if (ok !== true || !isPresent(l) || !isPresent(c) || !isPresent(h)) return null;

  const lcha = clampOklcha({
    l: Number(l),
    c: Number(c),
    h: Number(h),
    a: Number(a),
    ok: true,
  });

  return oklchaToRgba(lcha);
};

/**
 * Performs RGB → OKLab → OKLCH color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const rgbaToOklcha = (rgba: RgbaColor): OklchaColor => {
  const laba = rgbaToOklaba(rgba);

  // Round axis values to get proper values for grayscale colors.
  // OKLab axes are ~100 times smaller than CIE LAB's, hence 6 decimals instead of 3.
  const a = round(laba.a, 6);
  const b = round(laba.b, 6);

  const hue = 180 * (Math.atan2(b, a) / Math.PI);

  return {
    l: laba.l,
    c: Math.sqrt(a * a + b * b),
    h: hue < 0 ? hue + 360 : hue,
    a: laba.alpha,
    ok: true,
  };
};

/**
 * Performs OKLCH → OKLab → RGB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const oklchaToRgba = (lcha: OklchaColor): RgbaColor => {
  return oklabaToRgba({
    l: lcha.l,
    a: lcha.c * Math.cos((lcha.h * Math.PI) / 180),
    b: lcha.c * Math.sin((lcha.h * Math.PI) / 180),
    alpha: lcha.a,
    ok: true,
  });
};
