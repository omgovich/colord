import { LabaColor } from "../types";
import { Plugin } from "../extend";
import { parseOklaba, rgbaToOklaba, roundOklaba } from "../colorModels/oklab";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to OKLAB color space and returns an object.
     * The object always includes `alpha` value [0, 1].
     */
    toOklab(): LabaColor;
  }
}

/**
 * A plugin adding support for OKLAB color space.
 * https://bottosson.github.io/posts/oklab/
 */
const oklabPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toOklab = function () {
    return roundOklaba(rgbaToOklaba(this.rgba));
  };

  parsers.object.push([parseOklaba, "oklab"]);
};

export default oklabPlugin;
