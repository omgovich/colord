import { OklchaColor } from "../types";
import { Plugin } from "../extend";
import { parseOklcha, rgbaToOklcha, roundOklcha } from "../colorModels/oklch";
import { parseOklchaString, rgbaToOklchaString } from "../colorModels/oklchString";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to OKLCH (OKLab in polar form) color space and returns an object.
     * The object carries an `ok: true` marker that distinguishes it
     * from a CIE LCH object (both use the same `l`/`c`/`h` channel keys).
     * https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
     */
    toOklch(): OklchaColor;
    /**
     * Converts a color to OKLCH color space and returns a string.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
     */
    toOklchString(): string;
  }
}

/**
 * A plugin adding support for OKLCH color space.
 * https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
 */
const oklchPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toOklch = function () {
    return roundOklcha(rgbaToOklcha(this.rgba));
  };

  ColordClass.prototype.toOklchString = function () {
    return rgbaToOklchaString(this.rgba);
  };

  parsers.string.push([parseOklchaString, "oklch"]);
  parsers.object.push([parseOklcha, "oklch"]);
};

export default oklchPlugin;
