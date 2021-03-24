import { ColorModel, InputObject, RgbaColor } from "../../types";
import { roundRgba } from "./convert";
import { parseRgba } from "./parse";

export const RGBA: ColorModel<InputObject, RgbaColor> = {
  convert: roundRgba,
  parse: parseRgba,
};
