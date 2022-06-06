import { LchaColor } from "../types";
import { Plugin } from "../extend";
import { parseOklcha, rgbaToOklcha, roundOklcha } from "../colorModels/oklch";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to OKLCH color space and returns an object.
     * The object always includes `alpha` value [0, 1].
     */
    toOklch(): LchaColor;
  }
}

/**
 * A plugin adding support for OKLCH color space.
 */
const oklchPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toOklch = function () {
    return roundOklcha(rgbaToOklcha(this.rgba));
  };

  parsers.object.push([parseOklcha, "oklch"]);
};

export default oklchPlugin;
