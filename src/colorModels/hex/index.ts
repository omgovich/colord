import { ColorModel } from "../../types";
import { rgbaToHex } from "./convert";
import { parseHex } from "./parse";

export const HEX: ColorModel<string, string> = {
  convert: rgbaToHex,
  parse: parseHex,
};
