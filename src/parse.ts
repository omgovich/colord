import { Parser, Parsers, Input, InputObject, RgbaColor } from "./types";
import { parseHex } from "./colorModels/hex";
import { parseRgba } from "./colorModels/rgb";
import { parseHsla } from "./colorModels/hsl";
import { parseHslaString } from "./colorModels/hslString";
import { parseHsva } from "./colorModels/hsv";
import { parseRgbaString } from "./colorModels/rgbString";

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
  if (typeof input === "string") {
    return findValidColor<string>(input, parsers.string);
  }

  // Don't forget that the type of `null` is "object" in JavaScript
  // https://bitsofco.de/javascript-typeof/
  if (typeof input === "object" && input !== null) {
    return findValidColor<InputObject>(input, parsers.object);
  }

  return null;
};
