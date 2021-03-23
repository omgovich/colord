import { RgbaColor } from "../types";
import { colord, Colord } from "../colord";

export const changeAlpha = ({ r, g, b }: RgbaColor, a: number): Colord => {
  return colord({ r, g, b, a });
};
