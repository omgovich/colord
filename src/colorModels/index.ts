import { HEX } from "./hex";
import { RGBA } from "./rgba";
import { HSLA } from "./hsla";
import { HSLA_STRING } from "./hslaString";
import { HSVA } from "./hsva";
import { HSVA_STRING } from "./hsvaString";
import { RGBA_STRING } from "./rgbaString";

export const colorModels = {
  string: [HEX, RGBA_STRING, HSVA_STRING, HSLA_STRING],
  object: [RGBA, HSLA, HSVA],
};
