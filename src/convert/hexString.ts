import { RgbaColor } from "../types";
import { rgbaToHex } from "./hex";

export const rgbaToHexString = (rgba: RgbaColor): string => {
  return "#" + rgbaToHex(rgba);
};
