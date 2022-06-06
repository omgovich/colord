import { RgbaColor, LabaColor, InputObject } from "../types";
import { clamp, isPresent, round } from "../helpers";
import { clampRgba, linearizeRgbChannel, unlinearizeRgbChannel } from "./rgb";
import { ALPHA_PRECISION } from "../constants";

// https://bottosson.github.io/posts/oklab/
// https://ajalt.github.io/colormath/api/colormath/com.github.ajalt.colormath.model/-oklab/index.html

export const clampOklaba = (oklaba: LabaColor): LabaColor => ({
  l: clamp(oklaba.l, 0, 1),
  a: clamp(oklaba.a, -1, 1),
  b: clamp(oklaba.b, -1, 1),
  alpha: clamp(oklaba.alpha),
});

export const roundOklaba = (oklaba: LabaColor): LabaColor => ({
  l: round(oklaba.l, 4),
  a: round(oklaba.a, 4),
  b: round(oklaba.b, 4),
  alpha: round(oklaba.alpha, ALPHA_PRECISION),
});

export const parseOklaba = ({ l, a, b, ok, alpha = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(l) || !isPresent(a) || !isPresent(b) || !ok) return null;

  const oklaba = clampOklaba({
    l: Number(l),
    a: Number(a),
    b: Number(b),
    alpha: Number(alpha),
  });

  return oklabaToRgba(oklaba);
};

export const rgbaToOklaba = (rgba: RgbaColor): LabaColor => {
  const sRed = linearizeRgbChannel(rgba.r);
  const sGreen = linearizeRgbChannel(rgba.g);
  const sBlue = linearizeRgbChannel(rgba.b);

  const l = Math.cbrt(0.4122214708 * sRed + 0.5363325363 * sGreen + 0.0514459929 * sBlue);
  const m = Math.cbrt(0.2119034982 * sRed + 0.6806995451 * sGreen + 0.1073969566 * sBlue);
  const s = Math.cbrt(0.0883024619 * sRed + 0.2817188376 * sGreen + 0.6299787005 * sBlue);

  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    alpha: rgba.a,
  };
};

export const oklabaToRgba = (oklaba: LabaColor): RgbaColor => {
  const l = (oklaba.l + 0.3963377774 * oklaba.a + 0.2158037573 * oklaba.b) ** 3;
  const m = (oklaba.l - 0.1055613458 * oklaba.a - 0.0638541728 * oklaba.b) ** 3;
  const s = (oklaba.l - 0.0894841775 * oklaba.a - 1.291485548 * oklaba.b) ** 3;

  const sRed = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const sGreen = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const sBlue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return clampRgba({
    r: unlinearizeRgbChannel(sRed),
    g: unlinearizeRgbChannel(sGreen),
    b: unlinearizeRgbChannel(sBlue),
    a: oklaba.alpha,
  });
};
