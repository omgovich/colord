import { Colord, Input, AnyColor } from "./types";
import { parse } from "./parse";
import { rgbaToHex } from "./convert/hex";
import { rgbaToHexString } from "./convert/hexString";
import { rgbaToRgbaString } from "./convert/rgbaString";
import { rgbaToHsla } from "./convert/hsla";
import { rgbaToHslaString } from "./convert/hslaString";
import { rgbaToHsva } from "./convert/hsva";
import { rgbaToHsvaString } from "./convert/hsvaString";
import { saturate } from "./manipulate/saturate";

export const colord = (input: AnyColor | Colord): Colord => {
  // Internal color format is RGBA object
  const parseResult = parse(input as Input);
  const rgba = parseResult || { r: 0, g: 0, b: 0, a: 1 };

  return {
    isValid: () => parseResult !== null,
    // Convert
    toHex: () => rgbaToHex(rgba),
    toHexString: () => rgbaToHexString(rgba),
    toRgba: () => rgba,
    toRgbaString: () => rgbaToRgbaString(rgba),
    toHsla: () => rgbaToHsla(rgba),
    toHslaString: () => rgbaToHslaString(rgba),
    toHsva: () => rgbaToHsva(rgba),
    toHsvaString: () => rgbaToHsvaString(rgba),
    // Manipulate
    saturate: (amount) => saturate(rgba, amount),
    desaturate: (amount) => saturate(rgba, -amount),
    grayscale: () => saturate(rgba, -100),
  };
};
