import { HwbaColor } from "../types";
import { Plugin } from "../extend";
import { parseHwba, rgbaToHwba, roundHwba } from "../colorModels/hwb";

declare module "../colord" {
  interface Colord {
    toHwb(): HwbaColor;
  }
}

/**
 * A plugin adding support for HWB (Hue-Whiteness-Blackness) color model.
 * https://en.wikipedia.org/wiki/HWB_color_model
 */
const hwbPlugin: Plugin = (ColordClass, parsers): void => {
  ColordClass.prototype.toHwb = function () {
    return roundHwba(rgbaToHwba(this.rgba));
  };

  parsers.object.push(parseHwba);
};

export default hwbPlugin;
