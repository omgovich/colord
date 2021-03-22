import { RgbaColor } from "../../types";
import { roundRgba } from "../rgba/convert";

export const rgbaToRgbaString = (rgba: RgbaColor): string => {
  const { r, g, b, a } = roundRgba(rgba);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
