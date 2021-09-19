import { LabaColor, AnyColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";
import { deltaE00, DeltaE00Options } from "../get/getPerceivedDifference";
import { clamp } from "../helpers";

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
    delta(color: AnyColor | Colord, options?: Partial<DeltaE00Options>): number;
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

  ColordClass.prototype.delta = function (color, options) {
    const compared = color instanceof ColordClass ? color : new ColordClass(color);
    return clamp(deltaE00(this.toLab(), compared.toLab(), options) / 100);
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
