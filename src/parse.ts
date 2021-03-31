import { Parser, Parsers, Input, InputObject, RgbaColor } from "./types";
import { parseHex } from "./colorModels/hex";
import { parseRgba } from "./colorModels/rgba";
import { parseHsla } from "./colorModels/hsla";
import { parseHslaString } from "./colorModels/hslaString";
import { parseHsva } from "./colorModels/hsva";
import { parseRgbaString } from "./colorModels/rgbaString";

export const parsers: Parsers = {
  string: [parseHex, parseRgbaString, parseHslaString],
  object: [parseRgba, parseHsla, parseHsva],
};

const findValidColor = <I extends Input>(input: I, parsers: Parser<I>[]): RgbaColor | null => {
  for (let index = 0; index < parsers.length; index++) {
    const result = parsers[index](input);
    if (result) return result;
  }

  return null;
};

/** Tries to convert an incoming value into RGBA color by going through all color model parsers */
export const parse = (input: Input): RgbaColor | null => {
  if (typeof input === "string") return findValidColor<string>(input, parsers.string);
  if (typeof input === "object") return findValidColor<InputObject>(input, parsers.object);

  return null;
};
