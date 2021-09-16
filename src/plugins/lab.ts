import { LabaColor, AnyColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";
import { deltaE00 } from "../get/getPerceivedDifference";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELAB color space and returns an object.
     * The object always includes `alpha` value [0—1].
     */
    toLab(): LabaColor;

    /**
     * Calculates the perceived color difference for two colors according to
     * [Delta E2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
     */
    deltaE00(color: AnyColor | Colord): number;
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

  ColordClass.prototype.deltaE00 = function (color) {
    const compared = color instanceof ColordClass ? color : new ColordClass(color);
    return deltaE00(this.toLab(), compared.toLab());
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
