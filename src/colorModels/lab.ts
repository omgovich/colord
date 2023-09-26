import { RgbaColor, LabaColor, InputObject } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, isPresent, round } from "../helpers";
import { IlluminantName, Illuminants, rgbaToXyza, xyzaToRgba } from "./xyz";

// Conversion factors from https://en.wikipedia.org/wiki/CIELAB_color_space
const e = 216 / 24389;
const k = 24389 / 27;

/**
 * Clamps LAB axis values as defined in CSS Color Level 4 specs.
 * https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 */
export const clampLaba = (laba: LabaColor): LabaColor => ({
  // CIE Lightness values less than 0% must be clamped to 0%.
  // Values greater than 100% are permitted for forwards compatibility with HDR.
  l: clamp(laba.l, 0, 400),
  // A and B axis values are signed (allow both positive and negative values)
  // and theoretically unbounded (but in practice do not exceed ±160).
  a: laba.a,
  b: laba.b,
  alpha: clamp(laba.alpha),
});

export const roundLaba = (laba: LabaColor): LabaColor => ({
  l: round(laba.l, 2),
  a: round(laba.a, 2),
  b: round(laba.b, 2),
  alpha: round(laba.alpha, ALPHA_PRECISION),
});

export const parseLaba = ({ l, a, b, alpha = 1, isD65 = false }: InputObject): RgbaColor | null => {
  if (!isPresent(l) || !isPresent(a) || !isPresent(b)) {
    return null;
  }

  const laba = clampLaba({
    l: Number(l),
    a: Number(a),
    b: Number(b),
    alpha: Number(alpha),
  });

  return labaToRgba(laba, isD65 ? "D65" : "D50");
};

/**
 * Performs RGB → CIEXYZ → LAB color conversion
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const rgbaToLaba = (rgba: RgbaColor, illuminantName: IlluminantName = "D50"): LabaColor => {
  const illuminant = Illuminants[illuminantName];

  // Compute XYZ scaled relative to the illuminant reference white
  const xyza = rgbaToXyza(rgba, illuminantName);
  let x = xyza.x / illuminant.x;
  let y = xyza.y / illuminant.y;
  let z = xyza.z / illuminant.z;

  x = x > e ? Math.cbrt(x) : (k * x + 16) / 116;
  y = y > e ? Math.cbrt(y) : (k * y + 16) / 116;
  z = z > e ? Math.cbrt(z) : (k * z + 16) / 116;

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
export const labaToRgba = (laba: LabaColor, illuminantName: IlluminantName = "D50"): RgbaColor => {
  const y = (laba.l + 16) / 116;
  const x = laba.a / 500 + y;
  const z = y - laba.b / 200;

  const illuminant = Illuminants[illuminantName];

  return xyzaToRgba({
    x: (Math.pow(x, 3) > e ? Math.pow(x, 3) : (116 * x - 16) / k) * illuminant.x,
    y: (laba.l > k * e ? Math.pow((laba.l + 16) / 116, 3) : laba.l / k) * illuminant.y,
    z: (Math.pow(z, 3) > e ? Math.pow(z, 3) : (116 * z - 16) / k) * illuminant.z,
    a: laba.alpha,
  });
};
