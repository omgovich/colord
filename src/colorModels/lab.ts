import { RgbaColor, LabaColor, InputObject } from "../types";
import { clamp, isPresent, round } from "../helpers";
import { rgbaToXyza, xyzaToRgba } from "./xyz";

// Conversion factors from https://en.wikipedia.org/wiki/CIELAB_color_space
const e = 0.0088564517;
const k = 7.787037037;

/**
 * Limits LAB axis values.
 * http://colorizer.org/
 * https://www.nixsensor.com/free-color-converter/
 */
export const clampLaba = (laba: LabaColor): LabaColor => ({
  l: clamp(laba.l, 0, 100),
  a: clamp(laba.a, -128, 128),
  b: clamp(laba.b, -128, 128),
  alpha: clamp(laba.alpha),
});

export const roundLaba = (laba: LabaColor): LabaColor => ({
  l: round(laba.l, 2),
  a: round(laba.a, 2),
  b: round(laba.b, 2),
  alpha: round(laba.alpha, 2),
});

export const parseLaba = ({ l, a, b, alpha = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(l) || !isPresent(a) || !isPresent(b)) return null;

  const laba = clampLaba({
    l: Number(l),
    a: Number(a),
    b: Number(b),
    alpha: Number(alpha),
  });

  return labaToRgba(laba);
};

/**
 * Performs RGB → CIEXYZ → LAB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const rgbaToLaba = (rgba: RgbaColor): LabaColor => {
  // Compute XYZ scaled relative to D65 reference white
  const xyza = rgbaToXyza(rgba);
  let x = xyza.x / 95.047;
  let y = xyza.y / 100;
  let z = xyza.z / 108.883;

  x = x > e ? Math.cbrt(x) : k * x + 16 / 116;
  y = y > e ? Math.cbrt(y) : k * y + 16 / 116;
  z = z > e ? Math.cbrt(z) : k * z + 16 / 116;

  return {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
    alpha: xyza.a,
  };
};

/**
 * Performs LAB → CIEXYZ → RGB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const labaToRgba = (laba: LabaColor): RgbaColor => {
  const y = (laba.l + 16) / 116;
  const x = laba.a / 500 + y;
  const z = y - laba.b / 200;

  return xyzaToRgba({
    x: (x ** 3 > e ? x ** 3 : (x - 16 / 116) / k) * 95.047,
    y: (y ** 3 > e ? y ** 3 : (y - 16 / 116) / k) * 100,
    z: (z ** 3 > e ? z ** 3 : (z - 16 / 116) / k) * 108.883,
    a: laba.alpha,
  });
};
