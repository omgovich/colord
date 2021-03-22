import { ColorModel, InputObject, HsvaColor } from "../../types";
import { rgbaToHsva } from "./convert";
import { parseHsva } from "./parse";

export const HSVA: ColorModel<InputObject, HsvaColor> = {
  convert: rgbaToHsva,
  parse: parseHsva,
};
