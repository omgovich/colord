import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { mix } from "../manipulate/mix";
import { Colord } from "../colord";
import { IlluminantName } from "../colorModels/xyz";

declare module "../colord" {
  interface Colord {
    /**
     * Produces a mixture of two colors through CIE LAB color space and returns a new Colord instance.
     */
    mix(color2: AnyColor | Colord, ratio?: number, illuminantName?: IlluminantName): Colord;

    /**
     * Generates a tints palette based on original color.
     */
    tints(count?: number, illuminantName?: IlluminantName): Colord[];

    /**
     * Generates a shades palette based on original color.
     */
    shades(count?: number, illuminantName?: IlluminantName): Colord[];

    /**
     * Generates a tones palette based on original color.
     */
    tones(count?: number, illuminantName?: IlluminantName): Colord[];
  }
}

/**
 * A plugin adding a color mixing utilities.
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (
    color2: AnyColor | Colord,
    ratio = 0.5,
    illuminantName: IlluminantName = "D50"
  ) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const mixture = mix(this.toRgb(), instance2.toRgb(), ratio, illuminantName);
    return new ColordClass(mixture);
  };

  /**
   * Generate a palette from mixing a source color with another.
   */
  function mixPalette(
    source: Colord,
    hex: string,
    count = 5,
    illuminantName: IlluminantName = "D50"
  ): Colord[] {
    const palette = [];
    const step = 1 / (count - 1);
    for (let i = 0; i <= count - 1; i++) {
      palette.push(source.mix(hex, step * i, illuminantName));
    }
    return palette;
  }

  ColordClass.prototype.tints = function (count: number, illuminantName: IlluminantName = "D50") {
    return mixPalette(this, "#fff", count, illuminantName);
  };

  ColordClass.prototype.shades = function (count: number, illuminantName: IlluminantName = "D50") {
    return mixPalette(this, "#000", count, illuminantName);
  };

  ColordClass.prototype.tones = function (count: number, illuminantName: IlluminantName = "D50") {
    return mixPalette(this, "#808080", count, illuminantName);
  };
};

export default mixPlugin;
