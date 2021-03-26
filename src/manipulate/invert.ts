import { RgbaColor } from "../types";
import { colord, Colord } from "../colord";

export const invert = ({ r, g, b, a }: RgbaColor): Colord => {
  return colord({
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
    a,
  });
};
