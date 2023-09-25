import { LchaColor } from "../types";
import { Plugin } from "../extend";
import { parseLcha, roundLcha, rgbaToLcha } from "../colorModels/lch";
import { parseLchaString, rgbaToLchaString } from "../colorModels/lchString";
import { ALPHA_PRECISION } from "../constants";
import { IlluminantName } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CIELCH (Lightness-Chroma-Hue) color space and returns an object.
     * https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/
     * https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model
     */
    toLch(options?: {
      round?: boolean;
      precision?: number;
      alphaPrecision?: number;
      illuminantName?: IlluminantName;
    }): LchaColor;
    /**
     * Converts a color to CIELCH (Lightness-Chroma-Hue) color space and returns a string.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch()
     */
    toLchString(options?: {
      round?: boolean;
      precision?: number;
      alphaPrecision?: number;
      illuminantName?: IlluminantName;
    }): string;
  }
}

/**
 * A plugin adding support for CIELCH color space.
 * https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/
 * https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model
 */
const lchPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toLch = function ({
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
    const lcha = rgbaToLcha(this.rgba, illuminantName);
    return round ? roundLcha(lcha, precision, alphaPrecision) : lcha;
  };

  ColordClass.prototype.toLchString = function ({
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
    return rgbaToLchaString(this.rgba, { round, precision, alphaPrecision, illuminantName });
  };

  parsers.string.push([parseLchaString, "lch"]);
  parsers.object.push([parseLcha, "lch"]);
};

export default lchPlugin;
