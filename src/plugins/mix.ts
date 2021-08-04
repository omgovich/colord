import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { mix } from "../manipulate/mix";

declare module "../colord" {
  interface Colord {
    /**
     * Produces a mixture of two colors through CIE LAB color space and returns a new Colord instance.
     */
    mix(color2: AnyColor | Colord, ratio?: number): Colord;

    /**
     * Generates a tints palette based on original color.
     */
    tints(colors: number): Colord[];

    /**
     * Generates a shades palette based on original color.
     */
    shades(colors: number): Colord[];

    /**
     * Generates a tones palette based on original color.
     */
    tones(colors: number): Colord[];

    _mixPalette(color: AnyColor | Colord, colors: number): Colord[];
  }
}

/**
 * A plugin adding a color mixing utilities.
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (color2, ratio = 0.5) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const mixture = mix(this.toRgb(), instance2.toRgb(), ratio);
    return new ColordClass(mixture);
  };

  ColordClass.prototype._mixPalette = function (color, colors = 5) {
    const palette = [];
    for (let ratio = 0; ratio <= 1; ratio += 1 / colors) {
      palette.push(this.mix(color, ratio));
    }
    return palette;
  };

  ColordClass.prototype.tints = function (colors) {
    return this._mixPalette("#ffffff", colors);
  };

  ColordClass.prototype.shades = function (colors) {
    return this._mixPalette("#000000", colors);
  };

  ColordClass.prototype.tones = function (colors) {
    return this._mixPalette("#808080", colors);
  };
};

export default mixPlugin;
