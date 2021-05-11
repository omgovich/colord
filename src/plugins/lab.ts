import { LabaColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELAB color space and returns an object.
     * The object always includes `alpha` value [0—1].
     */
    toLab(): LabaColor;
  }
}

/**
 * A plugin adding support for CIELAB color space.
 * https://en.wikipedia.org/wiki/CIELAB_color_space
 */
const labPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toLab = function () {
    return roundLaba(rgbaToLaba(this.rgba));
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
