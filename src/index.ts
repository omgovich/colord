import { Input, AnyColor } from "./types";
import { parse } from "./parse";
import { rgbaToHex } from "./convert/hex";

interface Colord {
  toHex: () => string;
}

const colord = (input: AnyColor): Colord => {
  // Internal color format is RGBA object
  const rgba = parse(input as Input) || { r: 0, g: 0, b: 0, a: 1 };

  return {
    toHex: () => rgbaToHex(rgba),
  };
};

export default colord;
