import { clampLaba, labaToRgba, rgbaToLaba } from "../colorModels/lab";
import { RgbaColor } from "../types";

export type MixingColorSpace = "lab" | "rgb";

export const mix = (
  rgba1: RgbaColor,
  rgba2: RgbaColor,
  ratio: number,
  space?: MixingColorSpace
): RgbaColor => {
  const interpolate = (start: number, end: number): number => start + (end - start) * ratio;

  // RGB interpolation matches the alpha compositing of browsers and design tools.
  // No clamping needed: the plugin passes the result through the RGB parser, which clamps
  if (space === "rgb") {
    return {
      r: interpolate(rgba1.r, rgba2.r),
      g: interpolate(rgba1.g, rgba2.g),
      b: interpolate(rgba1.b, rgba2.b),
      a: interpolate(rgba1.a, rgba2.a),
    };
  }

  const laba1 = rgbaToLaba(rgba1);
  const laba2 = rgbaToLaba(rgba2);

  const mixture = clampLaba({
    l: interpolate(laba1.l, laba2.l),
    a: interpolate(laba1.a, laba2.a),
    b: interpolate(laba1.b, laba2.b),
    alpha: interpolate(laba1.alpha, laba2.alpha),
  });

  return labaToRgba(mixture);
};
