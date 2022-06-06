import { LchaColor, RgbaColor, InputObject } from "../types";
import { oklabaToRgba, rgbaToOklaba, roundOklaba } from "./oklab";
import { clamp, isPresent, round } from "../helpers";
import { ALPHA_PRECISION } from "../constants";

// https://ajalt.github.io/colormath/api/colormath/com.github.ajalt.colormath.model/-oklch/index.html

export const clampOklcha = (oklcha: LchaColor): LchaColor => ({
  l: clamp(oklcha.l, 0, 1),
  c: clamp(oklcha.c, 0, 1),
  h: clamp(oklcha.h, 0, 360),
  a: clamp(oklcha.a),
});

export const roundOklcha = (oklcha: LchaColor): LchaColor => ({
  l: round(oklcha.l, 4),
  c: round(oklcha.c, 4),
  h: round(oklcha.h, 2),
  a: round(oklcha.a, ALPHA_PRECISION),
});

export const parseOklcha = ({ l, c, h, ok, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(l) || !isPresent(c) || !isPresent(h) || !ok) return null;

  const oklcha = clampOklcha({
    l: Number(l),
    c: Number(c),
    h: Number(h),
    a: Number(a),
  });

  return oklchaToRgba(oklcha);
};

export const rgbaToOklcha = (rgba: RgbaColor): LchaColor => {
  const laba = roundOklaba(rgbaToOklaba(rgba));

  const hue = 180 * (Math.atan2(laba.b, laba.a) / Math.PI);

  return {
    l: laba.l,
    c: Math.sqrt(laba.a * laba.a + laba.b * laba.b),
    h: hue < 0 ? hue + 360 : hue,
    a: laba.alpha,
  };
};

export const oklchaToRgba = (oklcha: LchaColor): RgbaColor => {
  return oklabaToRgba({
    l: oklcha.l,
    a: oklcha.c * Math.cos((oklcha.h * Math.PI) / 180),
    b: oklcha.c * Math.sin((oklcha.h * Math.PI) / 180),
    alpha: oklcha.a,
  });
};
