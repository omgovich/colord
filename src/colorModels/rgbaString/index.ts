import { ColorModel } from "../../types";
import { rgbaToRgbaString } from "./convert";
import { parseRgbaString } from "./parse";

export const RGBA_STRING: ColorModel<string, string> = {
  convert: rgbaToRgbaString,
  parse: parseRgbaString,
};
