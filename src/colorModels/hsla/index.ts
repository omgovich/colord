import { ColorModel, InputObject, HslaColor } from "../../types";
import { rgbaToHsla } from "./convert";
import { parseHsla } from "./parse";

export const HSLA: ColorModel<InputObject, HslaColor> = {
  convert: rgbaToHsla,
  parse: parseHsla,
};
