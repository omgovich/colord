/* eslint-disable @typescript-eslint/ban-ts-comment */
import { colord, random, getFormat, Colord, AnyColor } from "../src/";
import { fixtures, lime, saturationLevels } from "./fixtures";

it("Converts between HEX, RGB, HSL and HSV color models properly", () => {
  for (const fixture of fixtures) {
    expect(colord(fixture.rgb).toHex()).toBe(fixture.hex);
    expect(colord(fixture.hsl).toHex()).toBe(fixture.hex);
    expect(colord(fixture.hsv).toHex()).toBe(fixture.hex);

    expect(colord(fixture.hex).toRgb()).toMatchObject({ ...fixture.rgb, a: 1 });
    expect(colord(fixture.hsl).toRgb()).toMatchObject({ ...fixture.rgb, a: 1 });
    expect(colord(fixture.hsv).toRgb()).toMatchObject({ ...fixture.rgb, a: 1 });

    expect(colord(fixture.hex).toHsl()).toMatchObject({ ...fixture.hsl, a: 1 });
    expect(colord(fixture.rgb).toHsl()).toMatchObject({ ...fixture.hsl, a: 1 });
    expect(colord(fixture.hsv).toHsl()).toMatchObject({ ...fixture.hsl, a: 1 });

    expect(colord(fixture.hex).toHsv()).toMatchObject({ ...fixture.hsv, a: 1 });
    expect(colord(fixture.rgb).toHsv()).toMatchObject({ ...fixture.hsv, a: 1 });
    expect(colord(fixture.hsl).toHsv()).toMatchObject({ ...fixture.hsv, a: 1 });
  }
});

it("Parses and converts a color", () => {
  for (const format in lime) {
    const instance = colord(lime[format] as AnyColor);
    expect(instance.toHex()).toBe(lime.hex);
    expect(instance.toRgb()).toMatchObject(lime.rgba);
    expect(instance.toRgbString()).toBe(lime.rgbString);
    expect(instance.toHsl()).toMatchObject(lime.hsla);
    expect(instance.toHslString()).toBe(lime.hslString);
    expect(instance.toHsv()).toMatchObject(lime.hsva);
  }
});

it("Adds alpha number to RGB and HSL strings only if the color has an opacity", () => {
  expect(colord("rgb(0, 0, 0)").toRgbString()).toBe("rgb(0, 0, 0)");
  expect(colord("hsl(0, 0%, 0%)").toHslString()).toBe("hsl(0, 0%, 0%)");
  expect(colord("rgb(0, 0, 0)").alpha(0.5).toRgbString()).toBe("rgba(0, 0, 0, 0.5)");
  expect(colord("hsl(0, 0%, 0%)").alpha(0.5).toHslString()).toBe("hsla(0, 0%, 0%, 0.5)");
});

it("Parses modern RGB functional notations", () => {
  expect(colord("rgb(0% 50% 100%)").toRgb()).toMatchObject({ r: 0, g: 128, b: 255, a: 1 });
  expect(colord("rgb(10% 20% 30% / 33%)").toRgb()).toMatchObject({ r: 26, g: 51, b: 77, a: 0.33 });
  expect(colord("rgba(10% 20% 30% / 0.5)").toRgb()).toMatchObject({ r: 26, g: 51, b: 77, a: 0.5 });
});

it("Parses modern HSL functional notations", () => {
  expect(colord("hsl(120deg 100% 50%)").toHsl()).toMatchObject({ h: 120, s: 100, l: 50, a: 1 });
  expect(colord("hsl(10deg 20% 30% / 0.1)").toHsl()).toMatchObject({ h: 10, s: 20, l: 30, a: 0.1 });
  expect(colord("hsl(10deg 20% 30% / 90%)").toHsl()).toMatchObject({ h: 10, s: 20, l: 30, a: 0.9 });
  expect(colord("hsl(90deg 50% 50%/50%)").toHsl()).toMatchObject({ h: 90, s: 50, l: 50, a: 0.5 });
});

it("Supports HEX4 and HEX8 color models", () => {
  expect(colord("#ffffffff").toRgb()).toMatchObject({ r: 255, g: 255, b: 255, a: 1 });
  expect(colord("#80808080").toRgb()).toMatchObject({ r: 128, g: 128, b: 128, a: 0.5 });
  expect(colord("#AAAF").toRgb()).toMatchObject({ r: 170, g: 170, b: 170, a: 1 });
  expect(colord("#5550").toRgb()).toMatchObject({ r: 85, g: 85, b: 85, a: 0 });
  expect(colord({ r: 255, g: 255, b: 255, a: 1 }).toHex()).toBe("#ffffff");
  expect(colord({ r: 170, g: 170, b: 170, a: 0.5 }).toHex()).toBe("#aaaaaa80");
  expect(colord({ r: 128, g: 128, b: 128, a: 0 }).toHex()).toBe("#80808000");
});

it("Ignores a case and extra whitespace", () => {
  expect(colord(" #0a0a0a ").toRgb()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("RGB( 10, 10, 10 )").toRgb()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord(" rGb(10,10,10 )").toRgb()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("  Rgb(10, 10, 10) ").toRgb()).toMatchObject({ r: 10, g: 10, b: 10, a: 1 });
  expect(colord("  hSl(10,20%,30%,0.1)").toHsl()).toMatchObject({ h: 10, s: 20, l: 30, a: 0.1 });
  expect(colord("HsLa( 10, 20%, 30%, 1)  ").toHsl()).toMatchObject({ h: 10, s: 20, l: 30, a: 1 });
});

it("Parses shorthand alpha values", () => {
  expect(colord("rgba(0, 0, 0, .5)").alpha()).toBe(0.5);
  expect(colord("rgba(50% 50% 50% / .999%)").alpha()).toBe(0.01);
  expect(colord("hsla(0, 0%, 0%, .25)").alpha()).toBe(0.25);
});

it("Ignores invalid color formats", () => {
  // mixing prefix
  expect(colord("AbC").isValid()).toBe(false);
  expect(colord("111").isValid()).toBe(false);
  expect(colord("999999").isValid()).toBe(false);
  // no bracket
  expect(colord("rgb 10 10 10)").isValid()).toBe(false);
  expect(colord("rgb(10 10 10").isValid()).toBe(false);
  // missing commas
  expect(colord("rgb( 10 10 10 0.1 )").isValid()).toBe(false);
  expect(colord("hsl(10, 20 30)").isValid()).toBe(false);
  // mixing numbers and percentage
  expect(colord("rgb(100, 100%, 20)").isValid()).toBe(false);
  // mixing commas and slash
  expect(colord("rgba(10, 50, 30 / .5").isValid()).toBe(false);
  expect(colord("hsla(10, 20, 30/50%)").isValid()).toBe(false);
  // missing percent
  expect(colord("hsl(10deg, 50, 50)").isValid()).toBe(false);
  // wrong content
  expect(colord("rgb(10, 10, 10, var(--alpha))").isValid()).toBe(false);
  expect(colord("hsl(var(--h) 10% 10%)").isValid()).toBe(false);
});

it("Clamps input numbers", () => {
  expect(colord("rgba(256, 999, -200, 2)").toRgb()).toMatchObject({ r: 255, g: 255, b: 0, a: 1 });
  expect(
    colord({
      r: NaN,
      g: -Infinity,
      b: +Infinity,
      a: 100500,
    }).toRgb()
  ).toMatchObject({ r: 0, g: 0, b: 255, a: 1 });
  expect(
    colord({
      h: NaN,
      s: -Infinity,
      l: +Infinity,
      a: 100500,
    }).toHsl()
  ).toMatchObject({ h: 0, s: 0, l: 100, a: 1 });
});

it("Clamps hue (angle) value properly", () => {
  expect(colord("hsl(361, 50%, 50%)").toHsl().h).toBe(1);
  expect(colord("hsl(-1, 50%, 50%)").toHsl().h).toBe(359);
  expect(colord({ h: 999, s: 50, l: 50 }).toHsl().h).toBe(279);
  expect(colord({ h: -999, s: 50, l: 50 }).toHsl().h).toBe(81);
  expect(colord({ h: 400, s: 50, v: 50 }).toHsv().h).toBe(40);
  expect(colord({ h: -400, s: 50, v: 50 }).toHsv().h).toBe(320);
});

it("Supports all valid CSS angle units", () => {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/angle#examples
  expect(colord("hsl(90deg, 50%, 50%)").toHsl().h).toBe(90);
  expect(colord("hsl(100grad, 50%, 50%)").toHsl().h).toBe(90);
  expect(colord("hsl(.25turn, 50%, 50%)").toHsl().h).toBe(90);
  expect(colord("hsl(1.5708rad, 50%, 50%)").toHsl().h).toBe(90);
  expect(colord("hsl(-180deg, 50%, 50%)").toHsl().h).toBe(180);
  expect(colord("hsl(-200grad, 50%, 50%)").toHsl().h).toBe(180);
  expect(colord("hsl(-.5turn, 50%, 50%)").toHsl().h).toBe(180);
  expect(colord("hsl(-3.1416rad, 50%, 50%)").toHsl().h).toBe(180);
});

it("Accepts a colord instance as an input", () => {
  const instance = colord(lime.hex as string);
  expect(colord(instance).toRgb()).toMatchObject(lime.rgba);
  expect(colord(colord(instance)).toHsl()).toMatchObject(lime.hsla);
});

it("Does not crash when input has an invalid type", () => {
  const fallbackRgba = { r: 0, g: 0, b: 0, a: 1 };
  // @ts-ignore
  expect(colord().toRgb()).toMatchObject(fallbackRgba);
  // @ts-ignore
  expect(colord(null).toRgb()).toMatchObject(fallbackRgba);
  // @ts-ignore
  expect(colord(undefined).toRgb()).toMatchObject(fallbackRgba);
  // @ts-ignore
  expect(colord([1, 2, 3]).toRgb()).toMatchObject(fallbackRgba);
});

it("Does not crash when input has an invalid format", () => {
  const fallbackRgba = { r: 0, g: 0, b: 0, a: 1 };
  // @ts-ignore
  expect(colord({ w: 1, u: 2, t: 3 }).toRgb()).toMatchObject(fallbackRgba);
  expect(colord("WUT?").toRgb()).toMatchObject(fallbackRgba);
});

it("Validates an input value", () => {
  expect(colord("#ffffff").isValid()).toBe(true);
  expect(colord("#0011gg").isValid()).toBe(false);
  expect(colord("#12345").isValid()).toBe(false);
  expect(colord("#1234567").isValid()).toBe(false);
  expect(colord("abracadabra").isValid()).toBe(false);
  expect(colord("rgba(0,0,0,1)").isValid()).toBe(true);
  expect(colord("hsla(100,50%,50%,1)").isValid()).toBe(true);
  expect(colord({ r: 255, g: 255, b: 255 }).isValid()).toBe(true);
  // @ts-ignore
  expect(colord({ r: 255, g: 255, v: 255 }).isValid()).toBe(false);
  // @ts-ignore
  expect(colord({ h: 0, w: 0, l: 0 }).isValid()).toBe(false);
  // @ts-ignore
  expect(colord({ w: 1, u: 2, t: 3 }).isValid()).toBe(false);
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
  expect(colord("hsl(100, 50%, 50%)").lighten().toHslString()).toBe("hsl(100, 50%, 60%)");
  expect(colord("hsl(100, 50%, 50%)").lighten(0.25).toHsl().l).toBe(75);
  expect(colord("hsl(100, 50%, 50%)").darken().toHslString()).toBe("hsl(100, 50%, 40%)");
  expect(colord("hsl(100, 50%, 50%)").darken(0.25).toHsl().l).toBe(25);

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
  expect(colord("#FFF").alpha(0).toRgb().a).toBe(0);
});

it("Produces alpha values with up to 3 digits after the decimal point", () => {
  expect(colord("#000").alpha(0.9).alpha()).toBe(0.9);
  expect(colord("#000").alpha(0.01).alpha()).toBe(0.01);
  expect(colord("#000").alpha(0.33333333).alpha()).toBe(0.333);
  expect(colord("rgba(0, 0, 0, 0.075)").toRgbString()).toBe("rgba(0, 0, 0, 0.075)");
  expect(colord("hsla(0, 0%, 0%, 0.789)").toHslString()).toBe("hsla(0, 0%, 0%, 0.789)");
  expect(colord("hsla(0, 0%, 0%, 0.999)").toRgbString()).toBe("rgba(0, 0, 0, 0.999)");
});

it("Gets a hue value", () => {
  expect(colord("#000").hue()).toBe(0);
  expect(colord("hsl(90, 50%, 50%)").hue()).toBe(90);
  expect(colord("hsl(-10, 50%, 50%)").hue()).toBe(350);
});

it("Changes a hue value", () => {
  expect(colord("hsl(90, 50%, 50%)").hue(0).toHslString()).toBe("hsl(0, 50%, 50%)");
  expect(colord("hsl(90, 50%, 50%)").hue(180).toHslString()).toBe("hsl(180, 50%, 50%)");
  expect(colord("hsl(90, 50%, 50%)").hue(370).toHslString()).toBe("hsl(10, 50%, 50%)");
});

it("Rotates a hue circle", () => {
  expect(colord("hsl(90, 50%, 50%)").rotate(0).toHslString()).toBe("hsl(90, 50%, 50%)");
  expect(colord("hsl(90, 50%, 50%)").rotate(360).toHslString()).toBe("hsl(90, 50%, 50%)");
  expect(colord("hsl(90, 50%, 50%)").rotate(90).toHslString()).toBe("hsl(180, 50%, 50%)");
  expect(colord("hsl(90, 50%, 50%)").rotate(-180).toHslString()).toBe("hsl(270, 50%, 50%)");
});

it("Generates a random color", () => {
  expect(random()).toBeInstanceOf(Colord);
  expect(random().toHex()).not.toBe(random().toHex());
});

it("Gets an input color format", () => {
  expect(getFormat("#000")).toBe("hex");
  expect(getFormat("rgb(128, 128, 128)")).toBe("rgb");
  expect(getFormat("rgba(50% 50% 50% / 50%)")).toBe("rgb");
  expect(getFormat("hsl(180, 50%, 50%)")).toBe("hsl");
  expect(getFormat({ r: 128, g: 128, b: 128, a: 0.5 })).toBe("rgb");
  expect(getFormat({ h: 180, s: 50, l: 50, a: 0.5 })).toBe("hsl");
  expect(getFormat({ h: 180, s: 50, v: 50, a: 0.5 })).toBe("hsv");
  expect(getFormat("disco-dancing")).toBeUndefined();
  // @ts-ignore
  expect(getFormat({ w: 1, u: 2, t: 3 })).toBeUndefined();
});
