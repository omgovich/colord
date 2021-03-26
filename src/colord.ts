import { Input, AnyColor, RgbaColor, HslaColor, HsvaColor } from "./types";
import { round } from "./helpers";
import { parse } from "./parse";
import { rgbaToHex } from "./colorModels/hex";
import { roundRgba } from "./colorModels/rgba";
import { rgbaToRgbaString } from "./colorModels/rgbaString";
import { rgbaToHsla } from "./colorModels/hsla";
import { rgbaToHslaString } from "./colorModels/hslaString";
import { rgbaToHsva } from "./colorModels/hsva";
import { rgbaToHsvaString } from "./colorModels/hsvaString";
import { changeAlpha } from "./manipulate/changeAlpha";
import { saturate } from "./manipulate/saturate";
import { getBrightness } from "./get/getBrightness";
import { lighten } from "./manipulate/lighten";
import { invert } from "./manipulate/invert";

export class Colord {
  private readonly rgba: RgbaColor;

  constructor(input: AnyColor) {
    // Internal color format is RGBA object.
    // We do not round interval RGBA numbers for better conversion accuracy
    this.rgba = parse(input as Input) || { r: 0, g: 0, b: 0, a: 1 };
  }

  // Get
  /** Returns a color brightness ratio */
  public brightness = (): number => round(getBrightness(this.rgba), 2);
  public isDark = (): boolean => getBrightness(this.rgba) < 0.5;
  public isLight = (): boolean => getBrightness(this.rgba) >= 0.5;

  // Convert
  public toHex = (): string => rgbaToHex(this.rgba);
  public toRgba = (): RgbaColor => roundRgba(this.rgba);
  public toRgbaString = (): string => rgbaToRgbaString(this.rgba);
  public toHsla = (): HslaColor => rgbaToHsla(this.rgba);
  public toHslaString = (): string => rgbaToHslaString(this.rgba);
  public toHsva = (): HsvaColor => rgbaToHsva(this.rgba);
  public toHsvaString = (): string => rgbaToHsvaString(this.rgba);

  // Manipulate
  public invert = (): Colord => invert(this.rgba);
  public saturate = (ratio = 0.1): Colord => saturate(this.rgba, ratio);
  public desaturate = (ratio = 0.1): Colord => saturate(this.rgba, -ratio);
  public grayscale = (): Colord => saturate(this.rgba, -1);
  public lighten = (ratio = 0.1): Colord => lighten(this.rgba, ratio);
  public darken = (ratio = 0.1): Colord => lighten(this.rgba, -ratio);

  /** Allows to get or change an alpha channel value */
  public alpha(): number;
  public alpha(value: number): Colord;
  public alpha(value?: number): Colord | number {
    if (typeof value === "number") return changeAlpha(this.rgba, value);
    return round(this.rgba.a, 2);
  }
}

export const colord = (input: AnyColor | Colord): Colord => {
  if (input instanceof Colord) return input;
  return new Colord(input);
};
