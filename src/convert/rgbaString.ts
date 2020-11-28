import { RgbaColor } from "../types";

export const rgbaToRgbaString = ({ r, g, b, a }: RgbaColor): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
