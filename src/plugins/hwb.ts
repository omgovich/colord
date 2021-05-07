import { HwbaColor } from "../types";
import { Plugin } from "../extend";
import { parseHwba, rgbaToHwba, roundHwba } from "../colorModels/hwb";
import { parseHwbaString, rgbaToHwbaString } from "../colorModels/hwbString";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to HWB (Hue-Whiteness-Blackness) color space and returns an object.
     * https://en.wikipedia.org/wiki/HWB_color_model
     */
    toHwb(): HwbaColor;
    /**
     * Converts a color to HWB (Hue-Whiteness-Blackness) color space and returns a string.
     * https://www.w3.org/TR/css-color-4/#the-hwb-notation
     */
    toHwbString(): string;
  }
}

/**
 * A plugin adding support for HWB (Hue-Whiteness-Blackness) color model.
 * https://en.wikipedia.org/wiki/HWB_color_model
 * https://www.w3.org/TR/css-color-4/#the-hwb-notation
 */
const hwbPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toHwb = function () {
    return roundHwba(rgbaToHwba(this.rgba));
  };

  ColordClass.prototype.toHwbString = function () {
    return rgbaToHwbaString(this.rgba);
  };

  parsers.string.push(parseHwbaString);
  parsers.object.push(parseHwba);
};

export default hwbPlugin;
