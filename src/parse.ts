import { Input, InputObject, RgbaColor, ColorModel, AnyColor } from "./types";
import { colorModels } from "./colorModels";

const iterateColorParsers = <I extends Input>(input: I, models: ColorModel<I, AnyColor>[]) => {
  for (let index = 0; index < models.length; index++) {
    const result = models[index].parse(input as I);
    if (result) return result;
  }

  return null;
};

/** Tries to convert an incoming value into RGBA color by going through all color model parsers */
export const parse = (input: Input): RgbaColor | null => {
  if (typeof input === "string") return iterateColorParsers<string>(input, colorModels.string);
  if (typeof input === "object") return iterateColorParsers<InputObject>(input, colorModels.object);

  return null;
};
