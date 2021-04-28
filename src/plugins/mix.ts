import { AnyColor, LchaColor } from "../types";
import { Plugin } from "../extend";
import { rgbaToLcha } from "../colorModels/lch";

declare module "../colord" {
  interface Colord {
    /**
     * Produces a mixture of two colors through LCH color space.
     * Returns the result (a new Colord instance) of mixing them.
     * The logic is ported from new `color-mix` function in CSS.
     * https://drafts.csswg.org/css-color-5/#funcdef-color-mix
     */
    mix(color2: AnyColor | Colord, ratio?: number): Colord;
  }
}

/**
 * A plugin adding color a mixing utility.
 * The logic is ported from new `color-mix` function in CSS.
 * https://www.w3.org/TR/css-color-5/#colormix
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (color2, ratio = 0.5) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const lcha1 = rgbaToLcha(this.toRgb());
    const lcha2 = rgbaToLcha(instance2.toRgb());

    const mixture: LchaColor = {
      l: lcha1.l * (1 - ratio) + lcha2.l * ratio,
      c: lcha1.c * (1 - ratio) + lcha2.c * ratio,
      h: lcha1.h * (1 - ratio) + lcha2.h * ratio,
      a: lcha1.a * (1 - ratio) + lcha2.a * ratio,
    };

    return new ColordClass(mixture);
  };
};

export default mixPlugin;
