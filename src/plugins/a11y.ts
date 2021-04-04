import { AnyColor } from "../types";
import { Plugin } from "../extend";
import { getContrast } from "../get/getContrast";
import { getLuminance } from "../get/getLuminance";
import { round, floor } from "../helpers";

declare module "../colord" {
  interface Colord {
    /**
     * Returns the relative luminance of a color,
     * normalized to 0 for darkest black and 1 for lightest white.
     * https://www.w3.org/TR/WCAG20/#relativeluminancedef
     */
    luminance(): number;
    /**
     * Calculates a contrast ratio for a color pair.
     * This luminance difference is expressed as a ratio ranging
     * from 1 (e.g. white on white) to 21 (e.g., black on a white).
     * WCAG requires a ratio of at least 4.5 for normal text and 3 for large text.
     * https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html
     * https://webaim.org/articles/contrast/
     */
    contrast(color2?: AnyColor | Colord): number;
  }
}

/**
 * A plugin adding accessibility and color contrast utilities.
 * Follows Web Content Accessibility Guidelines 2.0.
 * https://www.w3.org/TR/WCAG20/
 */
const a11yPlugin: Plugin = (ColordClass): void => {
  ColordClass.prototype.luminance = function () {
    return round(getLuminance(this.rgba), 2);
  };

  ColordClass.prototype.contrast = function (color2 = "#ffffff") {
    const instance2 = color2 instanceof ColordClass ? color2 : new ColordClass(color2);
    return floor(getContrast(this.rgba, instance2.toRgba()), 2);
  };
};

export default a11yPlugin;
