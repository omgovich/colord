import { RgbaColor } from "../types";

export const invert = ({ r, g, b, a }: RgbaColor): RgbaColor => {
  return {
    r: 255 - r,
    g: 255 - g,
    b: 255 - b,
    a,
  };
};
