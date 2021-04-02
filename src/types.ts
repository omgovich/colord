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

/** CIE XYZ color space https://www.sttmedia.com/colormodel-xyz */
export interface XyzColor {
  x: number;
  y: number;
  z: number;
}

/** CIE XYZ with and an alpha channel. Naming is the hardest part: https://stackoverflow.com/a/2464027 */
export interface XyzaColor extends XyzColor {
  a: number;
}

export type ObjectColor =
  | RgbColor
  | RgbaColor
  | HslColor
  | HslaColor
  | HsvColor
  | HsvaColor
  | XyzColor
  | XyzaColor;

export type AnyColor = string | ObjectColor;

export type InputObject = Record<string, unknown>;

export type Input = string | InputObject;

export type Parser<I extends Input> = (input: I) => RgbaColor | null;

export type Parsers = {
  string: Array<Parser<string>>;
  object: Array<Parser<InputObject>>;
};
