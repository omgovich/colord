import { colord, AnyColor } from "../src/";
import { basicColors, lime, saturationLevels } from "./fixtures";

it("Converts basic web colors", () => {
  for (const i in basicColors) {
    const color = basicColors[i];
    const instance = colord(color.hex);
    expect(instance.toRgba().r).toBe(color.r);
    expect(instance.toRgba().g).toBe(color.g);
    expect(instance.toRgba().b).toBe(color.b);
    expect(instance.toHsla().h).toBe(color.h);
    expect(instance.toHsla().s).toBe(color.s);
    expect(instance.toHsla().l).toBe(color.l);
    expect(instance.toHsva().v).toBe(color.v);
  }
});

it("Parses and converts a color", () => {
  for (const format in lime) {
    const instance = colord(lime[format] as AnyColor);
    expect(instance.toHex()).toBe(lime.hex);
    expect(instance.toRgba()).toMatchObject(lime.rgba);
    expect(instance.toRgbaString()).toBe(lime.rgbaString);
    expect(instance.toHsla()).toMatchObject(lime.hsla);
    expect(instance.toHslaString()).toBe(lime.hslaString);
    expect(instance.toHsva()).toMatchObject(lime.hsva);
    expect(instance.toHsvaString()).toBe(lime.hsvaString);
  }
});

it("Ignores a case and extra whitespace", () => {
  expect(colord("RGB(10, 10, 10)").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("  Rgb(10, 10, 10)").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("HsLa(10, 10, 10, 1)  ").toHsla()).toMatchObject({ h: 10, s: 10, l: 10, a: 1 });
  expect(colord(" hSvA(10, 10, 10, 1) ").toHsva()).toMatchObject({ h: 10, s: 10, v: 10, a: 1 });
});

it("Accepts a colord instance as an input", () => {
  const instance = colord(lime.hex as string);
  expect(colord(instance).toRgba()).toMatchObject(lime.rgba);
  expect(colord(colord(instance)).toHsla()).toMatchObject(lime.hsla);
});

it("Saturates/desaturates a color", () => {
  const instance = colord(saturationLevels[5]);
  expect(instance.saturate(20).toHex()).toBe(saturationLevels[7]);
  expect(instance.desaturate(20).toHex()).toBe(saturationLevels[3]);
  expect(instance.saturate(50).toHex()).toBe(saturationLevels[10]);
  expect(instance.desaturate(50).toHex()).toBe(saturationLevels[0]);
  expect(instance.saturate(100).toHex()).toBe(saturationLevels[10]);
  expect(instance.desaturate(100).toHex()).toBe(saturationLevels[0]);
  expect(instance.grayscale().toHex()).toBe(saturationLevels[0]);
});

it("Gets color brightness", () => {
  expect(colord("#000").brightness()).toBe(0);
  expect(colord("#000").isDark()).toBe(true);
  expect(colord("#665544").isDark()).toBe(true);
  expect(colord("#888").isDark()).toBe(false);
  expect(colord("#FFF").brightness()).toBe(255);
  expect(colord("#FFF").isLight()).toBe(true);
  expect(colord("#aabbcc").isLight()).toBe(true);
  expect(colord("#777").isLight()).toBe(false);
});

it("Gets an alpha channel value", () => {
  expect(colord("#000").alpha()).toBe(1);
  expect(colord("rgba(50, 100, 150, 0.5)").alpha()).toBe(0.5);
});

it("Changes an alpha channel value", () => {
  expect(colord("#000").alpha(0.25).alpha()).toBe(0.25);
  expect(colord("#FFF").alpha(0).toRgba().a).toBe(0);
});
