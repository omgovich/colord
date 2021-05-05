import { RgbaColor } from "../types";

/**
 * Returns the brightness of a color [0-1].
 * https://www.w3.org/TR/AERT/#color-contrast
 * https://en.wikipedia.org/wiki/YIQ
 */
export const getBrightness = (rgba: RgbaColor): number => {
  return (rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000 / 255;
};
