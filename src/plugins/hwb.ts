import { HwbaColor } from "../types";
import { Plugin } from "../extend";
import { parseHwba, rgbaToHwba, roundHwba } from "../colorModels/hwb";
import { parseHwbaString, rgbaToHwbaString } from "../colorModels/hwbString";
import { ALPHA_PRECISION } from "../constants";

declare module "../colord" {
  interface Colord {
    /**
     * Converts a color to HWB (Hue-Whiteness-Blackness) color space and returns an object.
     * https://en.wikipedia.org/wiki/HWB_color_model
     */
    toHwb(): HwbaColor;
    toHwb(round: false): HwbaColor;
    toHwb(round: true, precision: number, alphaPrecision: number): HwbaColor;
    /**
     * Converts a color to HWB (Hue-Whiteness-Blackness) color space and returns a string.
     * https://www.w3.org/TR/css-color-4/#the-hwb-notation
     */
    toHwbString(): string;
    toHwbString(round: false): string;
    toHwbString(round: true, precision: number, alphaPrecision: number): string;
  }
}

/**
 * A plugin adding support for HWB (Hue-Whiteness-Blackness) color model.
 * https://en.wikipedia.org/wiki/HWB_color_model
 * https://www.w3.org/TR/css-color-4/#the-hwb-notation
 */
const hwbPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toHwb = function (
    round = true,
    precision = 0,
    alphaPrecision = ALPHA_PRECISION
  ) {
    const hwba = rgbaToHwba(this.rgba);
    return round ? roundHwba(hwba, precision, alphaPrecision) : hwba;
  };

  ColordClass.prototype.toHwbString = function (
    round = true,
    precision = 0,
    alphaPrecision = ALPHA_PRECISION
  ) {
    return rgbaToHwbaString(this.rgba, round, precision, alphaPrecision);
  };

  parsers.string.push([parseHwbaString, "hwb"]);
  parsers.object.push([parseHwba, "hwb"]);
};

export default hwbPlugin;
