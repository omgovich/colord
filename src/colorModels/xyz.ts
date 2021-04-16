import { InputObject, RgbaColor, XyzaColor } from "../types";
import { clamp, isPresent, round } from "../helpers";
import { clampRgba, linearizeRgbChannel, unlinearizeRgbChannel } from "./rgb";

/**
 * Limits XYZ axis values.
 * https://www.sttmedia.com/colormodel-xyz
 */
export const clampXyza = (xyza: XyzaColor): XyzaColor => ({
  x: clamp(xyza.x, 0, 95.047),
  y: clamp(xyza.y, 0, 100),
  z: clamp(xyza.z, 0, 108.883),
  a: clamp(xyza.a),
});

export const roundXyza = (xyza: XyzaColor): XyzaColor => ({
  x: round(xyza.x, 3),
  y: round(xyza.y, 3),
  z: round(xyza.z, 3),
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
 * Converts an CIE XYZ color to RGBA color space
 * https://www.w3.org/TR/css-color-4/#color-conversion-code
 */
export const xyzaToRgba = (xyza: XyzaColor): RgbaColor => {
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
 * Converts an RGBA color to CIE XYZ
 * https://image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 */
export const rgbaToXyza = (rgba: RgbaColor): XyzaColor => {
  const sRed = linearizeRgbChannel(rgba.r);
  const sGreen = linearizeRgbChannel(rgba.g);
  const sBlue = linearizeRgbChannel(rgba.b);

  return clampXyza({
    x: (sRed * 0.4124564 + sGreen * 0.3575761 + sBlue * 0.1804375) * 100,
    y: (sRed * 0.2126729 + sGreen * 0.7151522 + sBlue * 0.072175) * 100,
    z: (sRed * 0.0193339 + sGreen * 0.119192 + sBlue * 0.9503041) * 100,
    a: rgba.a,
  });
};
