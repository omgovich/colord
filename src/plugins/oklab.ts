import { OklabaColor } from "../types";
import { Plugin } from "../extend";
import { parseOklaba, rgbaToOklaba, roundOklaba } from "../colorModels/oklab";
import { parseOklabaString, rgbaToOklabaString } from "../colorModels/oklabString";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to OKLab color space and returns an object.
     * The object carries an `ok: true` marker that distinguishes it
     * from a CIE LAB object (both use the same `l`/`a`/`b` channel keys).
     * https://bottosson.github.io/posts/oklab/
     */
    toOklab(): OklabaColor;
    /**
     * Converts a color to OKLab color space and returns a string.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklab
     */
    toOklabString(): string;
  }
}

/**
 * A plugin adding support for OKLab color space.
 * https://bottosson.github.io/posts/oklab/
 */
const oklabPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toOklab = function () {
    return roundOklaba(rgbaToOklaba(this.rgba));
  };

  ColordClass.prototype.toOklabString = function () {
    return rgbaToOklabaString(this.rgba);
  };

  parsers.string.push([parseOklabaString, "oklab"]);
  parsers.object.push([parseOklaba, "oklab"]);
};

export default oklabPlugin;
