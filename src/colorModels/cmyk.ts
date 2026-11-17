import { RgbaColor, InputObject, CmykaColor } from "../types";
import { clamp, isPresent, round, roundAlpha } from "../helpers";

/**
 * Clamps the CMYK color object values.
 */
export const clampCmyka = (cmyka: CmykaColor): CmykaColor => ({
  c: clamp(cmyka.c, 0, 100),
  m: clamp(cmyka.m, 0, 100),
  y: clamp(cmyka.y, 0, 100),
  k: clamp(cmyka.k, 0, 100),
  a: clamp(cmyka.a),
});

/**
 * Rounds the CMYK color object values.
 */
export const roundCmyka = (cmyka: CmykaColor): CmykaColor => ({
  c: round(cmyka.c, 2),
  m: round(cmyka.m, 2),
  y: round(cmyka.y, 2),
  k: round(cmyka.k, 2),
  a: roundAlpha(cmyka.a),
});

/**
 * Transforms the CMYK color object to RGB.
 * https://www.rapidtables.com/convert/color/cmyk-to-rgb.html
 */
export function cmykaToRgba(cmyka: CmykaColor): RgbaColor {
  // Nine decimals clear the float noise that makes an exact half such as 25.5 come out as
  // 25.499999999999993, which would round down.
  const channel = (percent: number) =>
    round(round(255 * (1 - percent / 100) * (1 - cmyka.k / 100), 9));

  return {
    r: channel(cmyka.c),
    g: channel(cmyka.m),
    b: channel(cmyka.y),
    a: cmyka.a,
  };
}

/**
 * Convert RGB Color Model object to CMYK.
 * https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
 */
export function rgbaToCmyka(rgba: RgbaColor): CmykaColor {
  const max = Math.max(rgba.r, rgba.g, rgba.b);
  // (max - r) / max equals (1 - r / 255 - k) / (1 - k) with less float noise, and nine decimals
  // clear what is left: without them r 3.4 and max 8 give 57.49999999999999 instead of 57.5.
  const channel = (value: number) => (max ? round(round((100 * (max - value)) / max, 9)) : 0);

  return {
    c: channel(rgba.r),
    m: channel(rgba.g),
    y: channel(rgba.b),
    k: round((1 - max / 255) * 100),
    a: rgba.a,
  };
}

/**
 * Parses the CMYK color object into RGB.
 */
export function parseCmyka({ c, m, y, k, a = 1 }: InputObject): RgbaColor | null {
  if (!isPresent(c) || !isPresent(m) || !isPresent(y) || !isPresent(k)) return null;

  const cmyk = clampCmyka({
    c: Number(c),
    m: Number(m),
    y: Number(y),
    k: Number(k),
    a: Number(a),
  });

  return cmykaToRgba(cmyk);
}
