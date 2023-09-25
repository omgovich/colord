import { XyzaColor } from "../types";
import { Plugin } from "../extend";
import { parseXyza, rgbaToXyza, roundXyza } from "../colorModels/xyz";
import { ALPHA_PRECISION } from "../constants";

declare module "../colord" {
  interface Colord {
    toXyz(): XyzaColor;
    toXyz(round: false): XyzaColor;
    toXyz(round: true, precision: number, alphaPrecision: number): XyzaColor;
  }
}

/**
 * A plugin adding support for CIE XYZ colorspace.
 * Wikipedia: https://en.wikipedia.org/wiki/CIE_1931_color_space
 * Helpful article: https://www.sttmedia.com/colormodel-xyz
 */
const xyzPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toXyz = function (
    round = true,
    precision = 2,
    alphaPrecision = ALPHA_PRECISION
  ) {
    const xyza = rgbaToXyza(this.rgba);
    return round ? roundXyza(xyza, precision, alphaPrecision) : xyza;
  };

  parsers.object.push([parseXyza, "xyz"]);
};

export default xyzPlugin;
