import { LabaColor, AnyColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";
import { getDeltaE00 } from "../get/getPerceivedDifference";
import { clamp, round as roundNumber } from "../helpers";
import { ALPHA_PRECISION } from "../constants";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELAB color space and returns an object.
     * The object always includes `alpha` value [0, 1].
     */
    toLab(): LabaColor;
    toLab(round: false): LabaColor;
    toLab(round: true, precision: number, alphaPrecision: number): LabaColor;

    /**
     * Calculates the perceived color difference for two colors according to
     * [Delta E2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
     * Returns a value in [0, 1] range.
     */
    delta(color?: AnyColor | Colord): number;
    delta(color: AnyColor | Colord, round: false): number;
    delta(color: AnyColor | Colord, round: true, precision: number): number;
  }
}

/**
 * A plugin adding support for CIELAB color space.
 * https://en.wikipedia.org/wiki/CIELAB_color_space
 */
const labPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toLab = function (
    round = true,
    precision = 2,
    alphaPrecision = ALPHA_PRECISION
  ) {
    const laba = rgbaToLaba(this.rgba);
    return round ? roundLaba(laba, precision, alphaPrecision) : laba;
  };

  ColordClass.prototype.delta = function (
    color: AnyColor | InstanceType<typeof ColordClass> = "#FFF",
    round = true,
    precision = 3
  ) {
    const compared = color instanceof ColordClass ? color : new ColordClass(color);
    const delta = getDeltaE00(this.toLab(false), compared.toLab(false)) / 100;
    const clampedDelta = clamp(delta);
    return round ? roundNumber(clampedDelta, precision) : clampedDelta;
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
