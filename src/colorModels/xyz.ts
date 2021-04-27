import { InputObject, RgbaColor, XyzaColor } from "../types";
import { clamp, isPresent, round } from "../helpers";
import { clampRgba, linearizeRgbChannel, unlinearizeRgbChannel } from "./rgb";

/**
 * Limits XYZ axis values assuming XYZ is relative to D50.
 * https://www.sttmedia.com/colormodel-xyz
 */
export const clampXyza = (xyza: XyzaColor): XyzaColor => ({
  x: clamp(xyza.x, 0, 96.42),
  y: clamp(xyza.y, 0, 100),
  z: clamp(xyza.z, 0, 82.52),
  a: clamp(xyza.a),
});

export const roundXyza = (xyza: XyzaColor): XyzaColor => ({
  x: round(xyza.x, 2),
  y: round(xyza.y, 2),
  z: round(xyza.z, 2),
  a: round(xyza.a, 2),
});

export const parseXyza = ({ x, y, z, a = 1 }: InputObject): RgbaColor | null => {
  if (!isPresent(x) || !isPresent(y) || !isPresent(z)) return null;

  const xyza = clampXyza({
    x: Number(x),
    y: Number(y),
    z: Number(z),
    a: Number(a),
  });

  return xyzaToRgba(xyza);
};

/**
 * Performs Bradford chromatic adaptation from D65 to D50
 */
export const adaptXyzaToD50 = (xyza: XyzaColor): XyzaColor => ({
  x: xyza.x * 1.0478112 + xyza.y * 0.0228866 + xyza.z * -0.050127,
  y: xyza.x * 0.0295424 + xyza.y * 0.9904844 + xyza.z * -0.0170491,
  z: xyza.x * -0.0092345 + xyza.y * 0.0150436 + xyza.z * 0.7521316,
  a: xyza.a,
});

/**
 * Performs Bradford chromatic adaptation from D50 to D65
 */
export const adaptXyzaToD65 = (xyza: XyzaColor): XyzaColor => ({
  x: xyza.x * 0.9555766 + xyza.y * -0.0230393 + xyza.z * 0.0631636,
  y: xyza.x * -0.0282895 + xyza.y * 1.0099416 + xyza.z * 0.0210077,
  z: xyza.x * 0.0122982 + xyza.y * -0.020483 + xyza.z * 1.3299098,
  a: xyza.a,
});

/**
 * Converts an CIE XYZ color (D50) to RGBA color space (D65)
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const xyzaToRgba = (sourceXyza: XyzaColor): RgbaColor => {
  const xyza = adaptXyzaToD65(sourceXyza);
  const x = xyza.x / 100;
  const y = xyza.y / 100;
  const z = xyza.z / 100;

  return clampRgba({
    r: unlinearizeRgbChannel(3.2404542 * x - 1.5371385 * y - 0.4985314 * z),
    g: unlinearizeRgbChannel(-0.969266 * x + 1.8760108 * y + 0.041556 * z),
    b: unlinearizeRgbChannel(0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
    a: xyza.a,
  });
};

/**
 * Converts an RGB color (D65) to CIE XYZ (D50)
 * https://image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 */
export const rgbaToXyza = (rgba: RgbaColor): XyzaColor => {
  const sRed = linearizeRgbChannel(rgba.r);
  const sGreen = linearizeRgbChannel(rgba.g);
  const sBlue = linearizeRgbChannel(rgba.b);

  // Convert an array of linear-light sRGB values to CIE XYZ
  // using sRGB own white (D65 no chromatic adaptation)
  const xyza: XyzaColor = {
    x: (sRed * 0.4124564 + sGreen * 0.3575761 + sBlue * 0.1804375) * 100,
    y: (sRed * 0.2126729 + sGreen * 0.7151522 + sBlue * 0.072175) * 100,
    z: (sRed * 0.0193339 + sGreen * 0.119192 + sBlue * 0.9503041) * 100,
    a: rgba.a,
  };

  return clampXyza(adaptXyzaToD50(xyza));
};
