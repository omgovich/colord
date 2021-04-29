import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { mix } from "../manipulate/mix";

declare module "../colord" {
  interface Colord {
    /**
     * Produces a mixture of two colors through CIE LAB color space and returns a new Colord instance.
     */
    mix(color2: AnyColor | Colord, ratio?: number): Colord;
  }
}

/**
 * A plugin adding a color mixing utility.
 */
const mixPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.mix = function (color2, ratio = 0.5) {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);

    const mixture = mix(this.toRgb(), instance2.toRgb(), ratio);
    return new ColordClass(mixture);
  };
};

export default mixPlugin;
