import { LabaColor, AnyColor } from "../types";
import { Plugin } from "../extend";
import { parseLaba, roundLaba, rgbaToLaba } from "../colorModels/lab";
import { getDeltaE00 } from "../get/getPerceivedDifference";
import { clamp, round as roundNumber } from "../helpers";
import { ALPHA_PRECISION } from "../constants";
import { IlluminantName } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELAB color space and returns an object.
     * The object always includes `alpha` value [0, 1].
     */
    toLab(options?: {
      round?: boolean;
      precision?: number;
      alphaPrecision?: number;
      illuminantName?: IlluminantName;
    }): LabaColor;

    /**
     * Calculates the perceived color difference for two colors according to
     * [Delta E2000](https://en.wikipedia.org/wiki/Color_difference#CIEDE2000).
     * Returns a value in [0, 1] range.
     */
    delta(
      color?: AnyColor | Colord,
      options?: {
        round?: boolean;
        precision?: number;
        illuminantName?: IlluminantName;
      }
    ): number;
  }
}

/**
 * A plugin adding support for CIELAB color space.
 * https://en.wikipedia.org/wiki/CIELAB_color_space
 */
const labPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toLab = function ({
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
    const laba = rgbaToLaba(this.rgba, illuminantName);
    return round ? roundLaba(laba, precision, alphaPrecision) : laba;
  };

  ColordClass.prototype.delta = function (
    color = "#FFF",
    {
      round = true,
      precision = 3,
      illuminantName = "D50",
    }: {
      round?: boolean;
      precision?: number;
      alphaPrecision?: number;
      illuminantName?: IlluminantName;
    }
  ) {
    const compared = color instanceof ColordClass ? color : new ColordClass(color);
    const delta =
      getDeltaE00(
        this.toLab({ round: false, illuminantName }),
        compared.toLab({ round: false, illuminantName })
      ) / 100;
    const clampedDelta = clamp(delta);
    return round ? roundNumber(clampedDelta, precision) : clampedDelta;
  };

  parsers.object.push([parseLaba, "lab"]);
};

export default labPlugin;
