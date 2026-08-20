import { RgbaColor, OklabaColor, InputObject } from "../types";
import { ALPHA_PRECISION } from "../constants";
import { clamp, isPresent, round } from "../helpers";
import { clampRgba, linearizeRgbChannel, unlinearizeRgbChannel } from "./rgb";

/**
 * Clamps OKLab axis values as defined in CSS Color Level 4 specs.
 * https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
 */
export const clampOklaba = (laba: OklabaColor): OklabaColor => ({
  // Lightness is defined in [0, 1] (unlike CIE LAB's [0, 100])
  l: clamp(laba.l),
  // A and B axis values are signed (allow both positive and negative values)
  // and theoretically unbounded (but in practice do not exceed ±0.4)
  a: laba.a,
  b: laba.b,
  alpha: clamp(laba.alpha),
  ok: true,
});

export const roundOklaba = (laba: OklabaColor): OklabaColor => ({
  // OKLab scales are ~100 times smaller than CIE LAB's ([0, 1] vs [0, 100]),
  // so the 2 decimal places used by the CIE models would be too coarse
  l: round(laba.l, 4),
  a: round(laba.a, 4),
  b: round(laba.b, 4),
  alpha: round(laba.alpha, ALPHA_PRECISION),
  ok: true,
});

export const parseOklaba = ({ l, a, b, alpha = 1, ok }: InputObject): RgbaColor | null => {
  // Bare { l, a, b } objects belong to the CIE LAB plugin;
  // the `ok` marker is what distinguishes an OKLab object (see the oklab plugin docs)
  if (ok !== true || !isPresent(l) || !isPresent(a) || !isPresent(b)) return null;

  const laba = clampOklaba({
    l: Number(l),
    a: Number(a),
    b: Number(b),
    alpha: Number(alpha),
    ok: true,
  });

  return oklabaToRgba(laba);
};

/**
 * Performs linear RGB → OKLab color conversion. The math is ported from the
 * CSS Color Module Level 4 Specification sample code, which recalculated
 * Björn Ottosson's original matrices to 64-bit precision with a consistent
 * D65 reference white (so pure white maps to exactly { l: 1, a: 0, b: 0 }).
 * The linear-sRGB → LMS matrix below is the spec's XYZ→LMS × linear-sRGB→XYZ
 * product, composed in double precision to skip the intermediate XYZ step.
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 * https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
 */
export const rgbaToOklaba = (rgba: RgbaColor): OklabaColor => {
  const red = linearizeRgbChannel(rgba.r);
  const green = linearizeRgbChannel(rgba.g);
  const blue = linearizeRgbChannel(rgba.b);

  const l = Math.cbrt(
    0.412221469470763 * red + 0.5363325372617348 * green + 0.0514459932675022 * blue
  );
  const m = Math.cbrt(
    0.2119034958178252 * red + 0.6806995506452344 * green + 0.1073969535369406 * blue
  );
  const s = Math.cbrt(
    0.0883024591900564 * red + 0.2817188391361215 * green + 0.6299787016738222 * blue
  );

  return {
    l: 0.210454268309314 * l + 0.7936177747023054 * m - 0.0040720430116193 * s,
    a: 1.9779985324311684 * l - 2.42859224204858 * m + 0.450593709617411 * s,
    b: 0.0259040424655478 * l + 0.7827717124575296 * m - 0.8086757549230774 * s,
    alpha: rgba.a,
    ok: true,
  };
};

/**
 * Performs OKLab → linear RGB color conversion (the inverse of the matrices above,
 * from the same CSS Color 4 sample code). Round-trips a color to the exact same
 * byte values, unlike the lower-precision matrices in Ottosson's original post.
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const oklabaToRgba = (laba: OklabaColor): RgbaColor => {
  const l = laba.l + 0.3963377773761749 * laba.a + 0.2158037573099136 * laba.b;
  const m = laba.l - 0.1055613458156586 * laba.a - 0.0638541728258133 * laba.b;
  const s = laba.l - 0.0894841775298119 * laba.a - 1.2914855480194092 * laba.b;

  const l3 = l * l * l;
  const m3 = m * m * m;
  const s3 = s * s * s;

  return clampRgba({
    r: unlinearizeRgbChannel(
      4.0767416360759583 * l3 - 3.3077115392580616 * m3 + 0.2309699031821043 * s3
    ),
    g: unlinearizeRgbChannel(
      -1.2684379732850317 * l3 + 2.6097573492876887 * m3 - 0.3413193760026573 * s3
    ),
    b: unlinearizeRgbChannel(
      -0.0041960761386756 * l3 - 0.7034186179359363 * m3 + 1.7076146940746117 * s3
    ),
    a: laba.alpha,
  });
};
