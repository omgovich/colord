import { XyzaColor, Parsers } from "../types";
import { Colord } from "../colord";
import { parseXyza, rgbaToXyza, roundXyza } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    toXyz(): XyzaColor;
  }
}

/**
 * A plugin adding support for CIE XYZ colorspace.
 * Wikipedia: https://en.wikipedia.org/wiki/CIE_1931_color_space
 * Helpful article: https://www.sttmedia.com/colormodel-xyz
 */
export default function xyzPlugin(ColordClass: typeof Colord, parsers: Parsers): void {
  ColordClass.prototype.toXyz = function () {
    return roundXyza(rgbaToXyza(this.rgba));
  };

  parsers.object.push([parseXyza, "xyz"]);
}
