/* eslint-disable @typescript-eslint/ban-ts-comment */
import { colord, AnyColor } from "../src/";
import { fixtures, lime, saturationLevels } from "./fixtures";

it("Converts between HEX, RGB, HSL and HSV color models properly", () => {
  for (const fixture of fixtures) {
    expect(colord(fixture.rgb).toHex()).toBe(fixture.hex);
    expect(colord(fixture.hsl).toHex()).toBe(fixture.hex);
    expect(colord(fixture.hsv).toHex()).toBe(fixture.hex);

    expect(colord(fixture.hex).toRgba()).toMatchObject({ ...fixture.rgb, a: 1 });
    expect(colord(fixture.hsl).toRgba()).toMatchObject({ ...fixture.rgb, a: 1 });
    expect(colord(fixture.hsv).toRgba()).toMatchObject({ ...fixture.rgb, a: 1 });

    expect(colord(fixture.hex).toHsla()).toMatchObject({ ...fixture.hsl, a: 1 });
    expect(colord(fixture.rgb).toHsla()).toMatchObject({ ...fixture.hsl, a: 1 });
    expect(colord(fixture.hsv).toHsla()).toMatchObject({ ...fixture.hsl, a: 1 });

    expect(colord(fixture.hex).toHsva()).toMatchObject({ ...fixture.hsv, a: 1 });
    expect(colord(fixture.rgb).toHsva()).toMatchObject({ ...fixture.hsv, a: 1 });
    expect(colord(fixture.hsl).toHsva()).toMatchObject({ ...fixture.hsv, a: 1 });
  }
});

it("Parses and converts a color", () => {
  for (const format in lime) {
    const instance = colord(lime[format] as AnyColor);
    expect(instance.toHex()).toBe(lime.hex);
    expect(instance.toRgba()).toMatchObject(lime.rgba);
    expect(instance.toRgbaString()).toBe(lime.rgbString);
    expect(instance.toHsla()).toMatchObject(lime.hsla);
    expect(instance.toHslaString()).toBe(lime.hslString);
    expect(instance.toHsva()).toMatchObject(lime.hsva);
  }
});

it("Adds alpha number to RGB and HSL strings only if the color has an opacity", () => {
  expect(colord("rgb(0, 0, 0)").toRgbaString()).toBe("rgb(0, 0, 0)");
  expect(colord("hsl(0, 0%, 0%)").toHslaString()).toBe("hsl(0, 0%, 0%)");
  expect(colord("rgb(0, 0, 0)").alpha(0.5).toRgbaString()).toBe("rgba(0, 0, 0, 0.5)");
  expect(colord("hsl(0, 0%, 0%)").alpha(0.5).toHslaString()).toBe("hsla(0, 0%, 0%, 0.5)");
});

it("Supports HEX4 and HEX8 color models", () => {
  expect(colord("#ffffffff").toRgba()).toMatchObject({ r: 255, g: 255, b: 255, a: 1 });
  expect(colord("#80808080").toRgba()).toMatchObject({ r: 128, g: 128, b: 128, a: 0.5 });
  expect(colord("#AAAF").toRgba()).toMatchObject({ r: 170, g: 170, b: 170, a: 1 });
  expect(colord("#5550").toRgba()).toMatchObject({ r: 85, g: 85, b: 85, a: 0 });
  expect(colord({ r: 255, g: 255, b: 255, a: 1 }).toHex()).toBe("#ffffff");
  expect(colord({ r: 170, g: 170, b: 170, a: 0.5 }).toHex()).toBe("#aaaaaa80");
  expect(colord({ r: 128, g: 128, b: 128, a: 0 }).toHex()).toBe("#80808000");
});

it("Ignores a case and extra whitespace", () => {
  expect(colord(" #0a0a0a ").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("RGB(10, 10, 10)").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("  Rgb(10, 10, 10)").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("HsLa(10, 10, 10, 1)  ").toHsla()).toMatchObject({ h: 10, s: 10, l: 10, a: 1 });
});

it("Parses shorthand alpha values", () => {
  expect(colord("rgba(0, 0, 0, .1)").alpha()).toBe(0.1);
  expect(colord("hsla(0, 0%, 0%, .25)").alpha()).toBe(0.25);
});

it("Parses invalid color string", () => {
  expect(colord(" AbC ").toHex()).toBe("#aabbcc");
  expect(colord("RGB 10 10 10 ").toRgba()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord(" hsL(10 20%, 1 .5!").toHsla()).toMatchObject({ h: 10, s: 20, l: 1, a: 0.5 });
});

it("Clamps input numbers", () => {
  expect(colord("rgba(256, 999, -200, 2)").toRgba()).toMatchObject({ r: 255, g: 255, b: 0, a: 1 });
  expect(colord("hsla(-999, 200, 50, 2)").toHsla()).toMatchObject({ h: 0, s: 100, l: 50, a: 1 });
});

it("Accepts a colord instance as an input", () => {
  const instance = colord(lime.hex as string);
  expect(colord(instance).toRgba()).toMatchObject(lime.rgba);
  expect(colord(colord(instance)).toHsla()).toMatchObject(lime.hsla);
});

it("Does not crash when input has an invalid format", () => {
  const fallbackRgba = { r: 0, g: 0, b: 0, a: 1 };
  // @ts-ignore
  expect(colord().toRgba()).toMatchObject(fallbackRgba);
  // @ts-ignore
  expect(colord({ w: 1, u: 2, t: 3 }).toRgba()).toMatchObject(fallbackRgba);
  expect(colord("WUT?").toRgba()).toMatchObject(fallbackRgba);
});

it("Saturates and desaturates a color", () => {
  const instance = colord(saturationLevels[5]);
  expect(instance.saturate(0.2).toHex()).toBe(saturationLevels[7]);
  expect(instance.desaturate(0.2).toHex()).toBe(saturationLevels[3]);
  expect(instance.saturate(0.5).toHex()).toBe(saturationLevels[10]);
  expect(instance.desaturate(0.5).toHex()).toBe(saturationLevels[0]);
  expect(instance.saturate(1).toHex()).toBe(saturationLevels[10]);
  expect(instance.desaturate(1).toHex()).toBe(saturationLevels[0]);
  expect(instance.grayscale().toHex()).toBe(saturationLevels[0]);
});

it("Makes a color lighter and darker", () => {
  expect(colord("hsl(100, 50%, 50%)").lighten().toHslaString()).toBe("hsl(100, 50%, 60%)");
  expect(colord("hsl(100, 50%, 50%)").lighten(0.25).toHsla().l).toBe(75);
  expect(colord("hsl(100, 50%, 50%)").darken().toHslaString()).toBe("hsl(100, 50%, 40%)");
  expect(colord("hsl(100, 50%, 50%)").darken(0.25).toHsla().l).toBe(25);

  expect(colord("#000").lighten(1).toHex()).toBe("#ffffff");
  expect(colord("#000").lighten(0.5).toHex()).toBe("#808080");
  expect(colord("#FFF").darken(1).toHex()).toBe("#000000");
  expect(colord("#FFF").darken(0.5).toHex()).toBe("#808080");
});

it("Inverts a color", () => {
  expect(colord("#000").invert().toHex()).toBe("#ffffff");
  expect(colord("#FFF").invert().toHex()).toBe("#000000");
  expect(colord("#123").invert().toHex()).toBe("#eeddcc");
});

it("Gets color brightness", () => {
  expect(colord("#000").brightness()).toBe(0);
  expect(colord("#808080").brightness()).toBe(0.5);
  expect(colord("#FFF").brightness()).toBe(1);
  expect(colord("#000").isDark()).toBe(true);
  expect(colord("#665544").isDark()).toBe(true);
  expect(colord("#888").isDark()).toBe(false);
  expect(colord("#777").isLight()).toBe(false);
  expect(colord("#aabbcc").isLight()).toBe(true);
  expect(colord("#FFF").isLight()).toBe(true);
});

it("Gets an alpha channel value", () => {
  expect(colord("#000").alpha()).toBe(1);
  expect(colord("rgba(50, 100, 150, 0.5)").alpha()).toBe(0.5);
});

it("Changes an alpha channel value", () => {
  expect(colord("#000").alpha(0.25).alpha()).toBe(0.25);
  expect(colord("#FFF").alpha(0).toRgba().a).toBe(0);
});
