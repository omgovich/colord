export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor extends RgbColor {
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HslaColor extends HslColor {
  a: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface HsvaColor extends HsvColor {
  a: number;
}

export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;

export type AnyColor = string | ObjectColor;

export interface InputObject {
  [key: string]: unknown;
}

export type Input = string | InputObject;

export interface Colord {
  isValid: () => boolean;
  // Convert
  toHex: () => string;
  toHexString: () => string;
  toRgba: () => RgbaColor;
  toRgbaString: () => string;
  toHsla: () => HslaColor;
  toHslaString: () => string;
  toHsva: () => HsvaColor;
  toHsvaString: () => string;
  // Manipulate
  saturate: (amount: number) => Colord;
  desaturate: (amount: number) => Colord;
  grayscale: () => Colord;
}
