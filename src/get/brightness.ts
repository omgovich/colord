import { RgbaColor } from "../types";

export const getBrightness = ({ r, g, b }: RgbaColor): number => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};
