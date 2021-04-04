import { linearizeRgbChannel } from "../colorModels/rgba";
import { RgbaColor } from "../types";

/**
 * Returns the perceived luminance of a color [0-1] according to WCAG 2.0.
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export const getLuminance = ({ r, g, b }: RgbaColor): number => {
  const sRed = linearizeRgbChannel(r);
  const sGreen = linearizeRgbChannel(g);
  const sBlue = linearizeRgbChannel(b);

  return 0.2126 * sRed + 0.7152 * sGreen + 0.0722 * sBlue;
};
