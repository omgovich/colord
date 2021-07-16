import { CmykaColor } from "../types";
import { Plugin } from "../extend";
import { parseCmyka, roundCmyka, rgbaToCmyka } from "../colorModels/cmyk";
import { cmykToCmykaString } from "../colorModels/cmyk";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to CMYK color space and returns an object.
     * https://drafts.csswg.org/css-color/#cmyk-colors
     * https://lea.verou.me/2009/03/cmyk-colors-in-css-useful-or-useless/
     */
    toCmyk(): CmykaColor;
    /**
     * Converts a color to CMYK color space and returns a string.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/device-cmyk()
     */
    toCmykString(): string;
  }
}

/**
 * A plugin adding support for CMYK color space.
 * https://lea.verou.me/2009/03/cmyk-colors-in-css-useful-or-useless/
 * https://en.wikipedia.org/wiki/CMYK_color_model
 */
const cmykPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toCmyk = function () {
    return roundCmyka(rgbaToCmyka(this.rgba));
  };

  ColordClass.prototype.toCmykString = function () {
    return cmykToCmykaString(this.rgba);
  };

  parsers.object.push([parseCmyka, "cmyk"]);
};

export default cmykPlugin;
