import { LabaColor, AnyColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";
import { getDeltaE00 } from "../get/getPerceivedDifference";
import { clamp, round } from "../helpers";
import { IlluminantName } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELAB color space and returns an object.
     * The object always includes `alpha` value [0, 1].
     */
    toLab(illuminantName?: IlluminantName): LabaColor;

    /**
     * Calculates the perceived color difference for two colors according to
     * [Delta E2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
     * Returns a value in [0, 1] range.
     */
    delta(color?: AnyColor | Colord, illuminantName?: IlluminantName): number;
  }
}

/**
 * A plugin adding support for CIELAB color space.
 * https://en.wikipedia.org/wiki/CIELAB_color_space
 */
const labPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toLab = function (illuminantName: IlluminantName = "D50") {
    return roundLaba(rgbaToLaba(this.rgba, illuminantName));
  };

  ColordClass.prototype.delta = function (color = "#FFF", illuminantName: IlluminantName = "D50") {
    const compared = color instanceof ColordClass ? color : new ColordClass(color);
    const delta = getDeltaE00(this.toLab(illuminantName), compared.toLab(illuminantName)) / 100;
    return clamp(round(delta, 3));
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
