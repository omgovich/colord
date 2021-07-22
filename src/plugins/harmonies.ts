import { Plugin } from "../extend";

export type Harmony =
  | "analogous"
  | "complimentary"
  | "rectangle"
  | "tetradic"
  | "triadic"
  | "splitcomplimentary";

declare module "../colord" {
  interface Colord {
    /**
     * Returns an array of harmony colors as `blossom` instances.
     */
    harmonies(type: Harmony): Colord[];
  }
}

/**
 * A plugin adding functionality to generate harmony colors.
 * https://en.wikipedia.org/wiki/Harmony_(color)
 */
const harmoniesPlugin: Plugin = (ColordClass): void => {
  /**
   * Harmony colors are colors with particular hue shift of the original color.
   */
  const hueShifts: Record<Harmony, number[]> = {
    analogous: [-30, 0, 30],
    complimentary: [0, 180],
    rectangle: [0, 60, 180, 240],
    tetradic: [0, 90, 180, 270],
    triadic: [0, 120, 240],
    splitcomplimentary: [0, 150, 210],
  };

  ColordClass.prototype.harmonies = function (type = "complimentary") {
    return hueShifts[type].map((shift) => this.rotate(shift));
  };
};

export default harmoniesPlugin;
