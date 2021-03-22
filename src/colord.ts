import { Input, AnyColor, RgbaColor, HslaColor, HsvaColor } from "./types";
import { parse } from "./parse";
import { rgbaToHex } from "./colorModels/hex/convert";
import { roundRgba } from "./colorModels/rgba/convert";
import { rgbaToRgbaString } from "./colorModels/rgbaString/convert";
import { rgbaToHsla } from "./colorModels/hsla/convert";
import { rgbaToHslaString } from "./colorModels/hslaString/convert";
import { rgbaToHsva } from "./colorModels/hsva/convert";
import { rgbaToHsvaString } from "./colorModels/hsvaString/convert";
import { saturate } from "./manipulate/saturate";
import { getBrightness } from "./get/brightness";

export class Colord {
  private rgba: RgbaColor;

  constructor(input: AnyColor) {
    // Internal color format is RGBA object.
    // We do not round interval RGBA numbers for better conversion accuracy
    this.rgba = parse(input as Input) || { r: 0, g: 0, b: 0, a: 1 };
  }

  // Get
  public isDark = (): boolean => getBrightness(this.rgba) < 128;
  public isLight = (): boolean => getBrightness(this.rgba) >= 128;
  /** Returns a color brightness [0, 255] determined by the formula from https://www.w3.org/TR/AERT/#color-contrast */
  public getBrightness = (): number => getBrightness(this.rgba);

  // Convert
  public toHex = (): string => rgbaToHex(this.rgba);
  public toRgba = (): RgbaColor => roundRgba(this.rgba);
  public toRgbaString = (): string => rgbaToRgbaString(this.rgba);
  public toHsla = (): HslaColor => rgbaToHsla(this.rgba);
  public toHslaString = (): string => rgbaToHslaString(this.rgba);
  public toHsva = (): HsvaColor => rgbaToHsva(this.rgba);
  public toHsvaString = (): string => rgbaToHsvaString(this.rgba);

  // Manipulate
  public saturate = (amount: number): Colord => saturate(this.rgba, amount);
  public desaturate = (amount: number): Colord => saturate(this.rgba, -amount);
  public grayscale = (): Colord => saturate(this.rgba, -100);
}

export const colord = (input: AnyColor | Colord): Colord => {
  if (input instanceof Colord) return input;
  return new Colord(input);
};
