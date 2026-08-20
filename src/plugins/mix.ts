import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { mix, MixingColorSpace } from "../manipulate/mix";
import { Colord } from "../colord";

declare module "../colord" {
  interface Colord {
    /**
     * Produces a mixture of two colors and returns a new Colord instance.
     * Mixes through CIE LAB color space by default;
     * pass "rgb" to interpolate RGB channels instead
     * (the way browsers and design tools composite translucent layers).
     */
    mix(color2: AnyColor | Colord, ratio?: number, space?: MixingColorSpace): Colord;

    /**
     * Generates a tints palette based on original color.
     */
    tints(count?: number, space?: MixingColorSpace): Colord[];

    /**
     * Generates a shades palette based on original color.
     */
    shades(count?: number, space?: MixingColorSpace): Colord[];

    /**
     * Generates a tones palette based on original color.
     */
    tones(count?: number, space?: MixingColorSpace): Colord[];
  }
}

/**
 * A plugin adding a color mixing utilities.
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (color2, ratio = 0.5, space) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const mixture = mix(this.toRgb(), instance2.toRgb(), ratio, space);
    return new ColordClass(mixture);
  };

  /**
   * Generate a palette from mixing a source color with another.
   */
  function mixPalette(source: Colord, hex: string, count = 5, space?: MixingColorSpace): Colord[] {
    const palette = [];
    const step = 1 / (count - 1);
    for (let i = 0; i <= count - 1; i++) {
      palette.push(source.mix(hex, step * i, space));
    }
    return palette;
  }

  ColordClass.prototype.tints = function (count, space) {
    return mixPalette(this, "#fff", count, space);
  };

  ColordClass.prototype.shades = function (count, space) {
    return mixPalette(this, "#000", count, space);
  };

  ColordClass.prototype.tones = function (count, space) {
    return mixPalette(this, "#808080", count, space);
  };
};

export default mixPlugin;
