import { XyzaColor } from "../types";
import { Plugin } from "../extend";
import { IlluminantName, parseXyza, rgbaToXyza, roundXyza } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    toXyz(illuminantName?: IlluminantName): XyzaColor;
  }
}

/**
 * A plugin adding support for CIE XYZ colorspace.
 * Wikipedia: https://en.wikipedia.org/wiki/CIE_1931_color_space
 * Helpful article: https://www.sttmedia.com/colormodel-xyz
 */
const xyzPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toXyz = function (illuminantName: IlluminantName = "D50") {
    return roundXyza(rgbaToXyza(this.rgba, illuminantName));
  };

  parsers.object.push([parseXyza, "xyz"]);
};

export default xyzPlugin;
