import { RgbaColor } from "../types";

/**
 * Returns the brightness of a color [0-1].
 * https://www.w3.org/TR/AERT/#color-contrast
 */
export const getBrightness = ({ r, g, b }: RgbaColor): number => {
  return (r * 299 + g * 587 + b * 114) / 1000 / 255;
};
