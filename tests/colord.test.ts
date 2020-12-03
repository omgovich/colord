import { colord, AnyColor } from "../src/";
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
  }
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
