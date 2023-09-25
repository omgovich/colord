import { CmykaColor } from "../types";
import { Plugin } from "../extend";
import { parseCmyka, roundCmyka, rgbaToCmyka } from "../colorModels/cmyk";
import { parseCmykaString, rgbaToCmykaString } from "../colorModels/cmykString";
import { ALPHA_PRECISION } from "../constants";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CMYK color space and returns an object.
     * https://drafts.csswg.org/css-color/#cmyk-colors
     * https://lea.verou.me/2009/03/cmyk-colors-in-css-useful-or-useless/
     */
    toCmyk(): CmykaColor;
    toCmyk(round: false): CmykaColor;
    toCmyk(round: true, precision: number, alphaPrecision: number): CmykaColor;
    /**
     * Converts a color to CMYK color space and returns a string.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/device-cmyk()
     */
    toCmykString(): string;
    toCmykString(round: false): string;
    toCmykString(round: true, precision: number, alphaPrecision: number): string;
  }
}

/**
 * A plugin adding support for CMYK color space.
 * https://lea.verou.me/2009/03/cmyk-colors-in-css-useful-or-useless/
 * https://en.wikipedia.org/wiki/CMYK_color_model
 */
const cmykPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toCmyk = function (
    round = true,
    precision = 2,
    alphaPrecision = ALPHA_PRECISION
  ) {
    const cmyka = rgbaToCmyka(this.rgba);
    return round ? roundCmyka(cmyka, precision, alphaPrecision) : cmyka;
  };

  ColordClass.prototype.toCmykString = function (
    round = true,
    precision = 2,
    alphaPrecision = ALPHA_PRECISION
  ) {
    return rgbaToCmykaString(this.rgba, round, precision, alphaPrecision);
  };

  parsers.object.push([parseCmyka, "cmyk"]);
  parsers.string.push([parseCmykaString, "cmyk"]);
};

export default cmykPlugin;
