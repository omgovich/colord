import { Input, AnyColor, RgbaColor, HslaColor, HsvaColor, ObjectColorIlluminant } from "./types";
import { round as roundNumber } from "./helpers";
import { ALPHA_PRECISION } from "./constants";
import { parse } from "./parse";
import { rgbaToHex } from "./colorModels/hex";
import { roundRgba } from "./colorModels/rgb";
import { rgbaToRgbaString } from "./colorModels/rgbString";
import { rgbaToHsla, roundHsla } from "./colorModels/hsl";
import { rgbaToHslaString } from "./colorModels/hslString";
import { rgbaToHsva, roundHsva } from "./colorModels/hsv";
import { changeAlpha } from "./manipulate/changeAlpha";
import { saturate } from "./manipulate/saturate";
import { getBrightness } from "./get/getBrightness";
import { lighten } from "./manipulate/lighten";
import { invert } from "./manipulate/invert";

export class Colord {
  private readonly parsed: RgbaColor | null;
  readonly rgba: RgbaColor;

  constructor(input: AnyColor) {
    // Internal color format is RGBA object.
    // We do not round the internal RGBA numbers for better conversion accuracy.
    this.parsed = parse(input as Input)[0];
    this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }

  /**
   * Returns a boolean indicating whether or not an input has been parsed successfully.
   * Note: If parsing is unsuccessful, Colord defaults to black (does not throws an error).
   */
  public isValid(): boolean {
    return this.parsed !== null;
  }

  /**
   * Returns the brightness of a color (from 0 to 1).
   * The calculation logic is modified from WCAG.
   * https://www.w3.org/TR/AERT/#color-contrast
   */
  public brightness(): number;
  public brightness(round: false): number;
  public brightness(round: true, precision?: number): number;
  public brightness(round = true, precision = 2): number {
    const b = getBrightness(this.rgba);
    return round ? roundNumber(b, precision) : b;
  }

  /**
   * Same as calling `brightness() < 0.5`.
   */
  public isDark(): boolean {
    return getBrightness(this.rgba) < 0.5;
  }

  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  public isLight(): boolean {
    return getBrightness(this.rgba) >= 0.5;
  }

  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  public toHex(): string {
    return rgbaToHex(this.rgba);
  }

  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toRgb(): RgbaColor;
  public toRgb(round: false): RgbaColor;
  public toRgb(round: true, precision?: number, alphaPrecision?: number): RgbaColor;
  public toRgb(round = true, precision = 0, alphaPrecision = ALPHA_PRECISION): RgbaColor {
    return round ? roundRgba(this.rgba, precision, alphaPrecision) : this.rgba;
  }

  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  public toRgbString(): string;
  public toRgbString(round: false): string;
  public toRgbString(round: true, precision?: number, alphaPrecision?: number): string;
  public toRgbString(round = true, precision = 0, alphaPrecision = ALPHA_PRECISION): string {
    return rgbaToRgbaString(this.rgba, round, precision, alphaPrecision);
  }

  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toHsl(): HslaColor;
  public toHsl(round: false): HslaColor;
  public toHsl(round: true, precision?: number, alphaPrecision?: number): HslaColor;
  public toHsl(round = true, precision = 0, alphaPrecision = ALPHA_PRECISION): HslaColor {
    const hsla = rgbaToHsla(this.rgba);
    return round ? roundHsla(hsla, precision, alphaPrecision) : hsla;
  }

  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  public toHslString(): string;
  public toHslString(round: false): string;
  public toHslString(round: true, precision?: number, alphaPrecision?: number): string;
  public toHslString(round = true, precision = 0, alphaPrecision = ALPHA_PRECISION): string {
    return rgbaToHslaString(this.rgba, round, precision, alphaPrecision);
  }

  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  public toHsv(): HsvaColor;
  public toHsv(round: false): HsvaColor;
  public toHsv(round: true, precision?: number, alphaPrecision?: number): HsvaColor;
  public toHsv(round = true, precision = 0, alphaPrecision = ALPHA_PRECISION): HsvaColor {
    const hsva = rgbaToHsva(this.rgba);
    return round ? roundHsva(hsva, precision, alphaPrecision) : hsva;
  }

  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  public invert(): Colord {
    return colord(invert(this.rgba));
  }

  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  public saturate(amount = 0.1): Colord {
    return colord(saturate(this.rgba, amount));
  }

  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  public desaturate(amount = 0.1): Colord {
    return colord(saturate(this.rgba, -amount));
  }

  /**
   * Makes a gray color with the same lightness as a source color.
   */
  public grayscale(): Colord {
    return colord(saturate(this.rgba, -1));
  }

  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  public lighten(amount = 0.1): Colord {
    return colord(lighten(this.rgba, amount));
  }

  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  public darken(amount = 0.1): Colord {
    return colord(lighten(this.rgba, -amount));
  }

  /**
   * Changes the HSL hue of a color by the given amount.
   */
  public rotate(amount = 15): Colord {
    return this.hue(this.hue() + amount);
  }

  /**
   * Allows to get or change an alpha channel value.
   */
  public alpha(): number;
  public alpha(value: number): Colord;
  public alpha(value: undefined, round: false): number;
  public alpha(value: undefined, round: true, precision?: number): number;
  public alpha(value?: number, round = true, precision = ALPHA_PRECISION): Colord | number {
    if (typeof value === "number") return colord(changeAlpha(this.rgba, value));
    const { a } = this.rgba;
    return round ? roundNumber(a, precision) : a;
  }

  /**
   * Allows to get or change a hue value.
   */
  public hue(): number;
  public hue(value: number): Colord;
  public hue(value: undefined, round: false): number;
  public hue(value: undefined, round: true, precision?: number): number;
  public hue(value?: number, round = true, precision = 0): Colord | number {
    const hsla = rgbaToHsla(this.rgba);
    if (typeof value === "number") return colord({ h: value, s: hsla.s, l: hsla.l, a: hsla.a });
    const { h } = hsla;
    return round ? roundNumber(h, precision) : h;
  }

  /**
   * Determines whether two values are the same color.
   */
  public isEqual(color: AnyColor | Colord): boolean {
    return this.toHex() === colord(color).toHex();
  }
}

/**
 * Parses the given input color and creates a new `Colord` instance.
 * See accepted input formats: https://github.com/omgovich/colord#color-parsing
 */
export const colord = (input: AnyColor | ObjectColorIlluminant | Colord): Colord => {
  if (input instanceof Colord) return input;
  return new Colord(input);
};
