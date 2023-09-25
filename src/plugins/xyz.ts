import { XyzaColor } from "../types";
import { Plugin } from "../extend";
import { IlluminantName, parseXyza, rgbaToXyza, roundXyza } from "../colorModels/xyz";
import { ALPHA_PRECISION } from "../constants";

declare module "../colord" {
  interface Colord {
    toXyz(options?: {
      round?: boolean;
      precision?: number;
      alphaPrecision?: number;
      illuminantName?: IlluminantName;
    }): XyzaColor;
  }
}

/**
 * A plugin adding support for CIE XYZ colorspace.
 * Wikipedia: https://en.wikipedia.org/wiki/CIE_1931_color_space
 * Helpful article: https://www.sttmedia.com/colormodel-xyz
 */
const xyzPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toXyz = function ({
    round = true,
    precision = 2,
    alphaPrecision = ALPHA_PRECISION,
    illuminantName = "D50",
  }: {
    round?: boolean;
    precision?: number;
    alphaPrecision?: number;
    illuminantName?: IlluminantName;
  }) {
    const xyza = rgbaToXyza(this.rgba, illuminantName);
    return round ? roundXyza(xyza, precision, alphaPrecision) : xyza;
  };

  parsers.object.push([parseXyza, "xyz"]);
};

export default xyzPlugin;
