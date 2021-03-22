import { ColorModel } from "../../types";
import { rgbaToHslaString } from "./convert";
import { parseHslaString } from "./parse";

export const HSLA_STRING: ColorModel<string, string> = {
  convert: rgbaToHslaString,
  parse: parseHslaString,
};
