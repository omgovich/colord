import { ColorModel, InputObject, RgbaColor } from "../../types";
import { roundRgba } from "./convert";
import { parseRgbaObject } from "./parse";

export const RGBA: ColorModel<InputObject, RgbaColor> = {
  convert: roundRgba,
  parse: parseRgbaObject,
};
