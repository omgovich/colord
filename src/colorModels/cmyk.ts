import { RgbaColor, InputObject, CmykaColor } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, isPresent, round } from "../helpers";

/**
 * Clamps the CMYK color object values.
 */
export function clampCmyka({ c, m, y, k, a = 1 }: CmykaColor): CmykaColor {
  return {
    c: clamp(c, 0, 100),
    m: clamp(m, 0, 100),
    y: clamp(y, 0, 100),
    k: clamp(k, 0, 100),
    a: clamp(a),
  };
}

/**
 * Rounds the CMYK color object values.
 */
export function roundCmyka({ c, m, y, k, a = 1 }: CmykaColor): CmykaColor {
  return {
    c: round(c, 2),
    m: round(m, 2),
    y: round(y, 2),
    k: round(k, 2),
    a: round(a, ALPHA_PRECISION),
  };
}

/**
 * Transforms the CMYK color object to RGB.
 * https://www.rapidtables.com/convert/color/cmyk-to-rgb.html
 */
export function cmykaToRgba(color: CmykaColor): RgbaColor {
  const c = color.c / 100;
  const m = color.m / 100;
  const y = color.y / 100;
  const k = color.k / 100;
  const a = color?.a ?? 1;
  return {
    r: round(255 * (1 - c) * (1 - k)),
    g: round(255 * (1 - m) * (1 - k)),
    b: round(255 * (1 - y) * (1 - k)),
    a: a ? round(a, ALPHA_PRECISION) : 1,
  };
}

/**
 * Convert RGB Color Model object to CMYK.
 * https://www.rapidtables.com/convert/color/rgb-to-cmyk.html
 */
export function rgbaToCmyka(color: RgbaColor): CmykaColor {
  const [ r, g, b, a ] = [ color.r / 255, color.g / 255, color.b / 255, color.a ?? 1 ];
  const k = 1 - Math.max(r, g, b);
  const [ c, m, y ] = [
    (1 - r - k) / (1 - k),
    (1 - g - k) / (1 - k),
    (1 - b - k) / (1 - k),
  ];
  return {
    c: Number.isNaN(c) ? 0 : round(c * 100),
    m: Number.isNaN(m) ? 0 : round(m * 100),
    y: Number.isNaN(y) ? 0 : round(y * 100),
    k: round(k * 100),
    a: round(a, 2),
  };
}

/**
 * Parses the CMYK color object into RGB.
 */
export function parseCmyka({ c, m, y, k, a = 1 }: InputObject): RgbaColor | null {
  if (isPresent(c) && isPresent(m) && isPresent(y) && isPresent(k)) {
    const cmyk = clampCmyka({
      c: Number(c),
      m: Number(m),
      y: Number(y),
      k: Number(k),
      a: Number(a),
    });
    return cmykaToRgba(cmyk);
  }
  return null;
}

export function cmykToCmykaString(rgb: RgbaColor): string {
  const { c, m, y, k, a } = roundCmyka(rgbaToCmyka(rgb));
  return a < 1
    ? `device-cmyk(${c}% ${m}% ${y}% ${k}% / ${a})`
    : `device-cmyk(${c}% ${m}% ${y}% ${k}%)`;
}
