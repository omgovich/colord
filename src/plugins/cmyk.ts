import { CmykaColor, Parsers } from "../types";
import { Colord } from "../colord";
import { parseCmyka, roundCmyka, rgbaToCmyka } from "../colorModels/cmyk";
import { parseCmykaString, rgbaToCmykaString } from "../colorModels/cmykString";

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
export default function cmykPlugin(ColordClass: typeof Colord, parsers: Parsers): void {
  ColordClass.prototype.toCmyk = function () {
    return roundCmyka(rgbaToCmyka(this.rgba));
  };

  ColordClass.prototype.toCmykString = function () {
    return rgbaToCmykaString(this.rgba);
  };

  parsers.object.push([parseCmyka, "cmyk"]);
  parsers.string.push([parseCmykaString, "cmyk"]);
}
