import colord, { AnyColor } from "../src/";
import { HslaColor, RgbaColor } from "../src/types";
import { lime } from "./fixtures";

it("Parses and converts a color", () => {
  for (const format in lime) {
    const instance = colord(lime[format] as AnyColor);
    expect(instance.toHex()).toBe(lime.hex);
    expect(instance.toHexString()).toBe(lime.hexString);
    expect(instance.toRgba()).toMatchObject(lime.rgba);
    expect(instance.toRgbaString()).toBe(lime.rgbaString);
    expect(instance.toHsla()).toMatchObject(lime.hsla);
    expect(instance.toHslaString()).toBe(lime.hslaString);
    expect(instance.toHsva()).toMatchObject(lime.hsva);
    expect(instance.toHsvaString()).toBe(lime.hsvaString);
    expect(instance.isValid()).toBe(true);
  }
});

it("Validates a color", () => {
  expect(colord("#FFF").isValid()).toBe(true);
  expect(colord({ r: 255, g: 255, b: 255 }).isValid()).toBe(true);
  expect(colord({ h: 360, s: 100, l: 100 }).isValid()).toBe(true);
  expect(colord({ h: 360, s: 100, v: 100, a: 1 }).isValid()).toBe(true);
  expect(colord((undefined as unknown) as AnyColor).isValid()).toBe(false);
  expect(colord("").isValid()).toBe(false);
  expect(colord("#0").isValid()).toBe(false);
  expect(colord("#FF").isValid()).toBe(false);
  expect(colord({} as RgbaColor).isValid()).toBe(false);
  expect(colord({ r: 255, g: 255 } as RgbaColor).isValid()).toBe(false);
  expect(colord({ h: 255, s: 255 } as HslaColor).isValid()).toBe(false);
});

it("Accepts a colord instance as an input", () => {
  const instance = colord(lime.hex as string);
  expect(colord(instance).toRgba()).toMatchObject(lime.rgba);
  expect(colord(colord(instance)).toHsla()).toMatchObject(lime.hsla);
});

it("Makes a color grayscale", () => {
  expect(colord("#F00").grayscale().toHexString()).toBe("#808080");
  expect(colord(colord("#F00").grayscale()).toHexString()).toBe("#808080");
});
