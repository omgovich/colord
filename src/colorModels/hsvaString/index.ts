import { ColorModel } from "../../types";
import { rgbaToHsvaString } from "./convert";
import { parseHsvaString } from "./parse";

export const HSVA_STRING: ColorModel<string, string> = {
  convert: rgbaToHsvaString,
  parse: parseHsvaString,
};
