import { colord, getFormat, extend, Colord } from "../src/";
import a11yPlugin from "../src/plugins/a11y";
import cmykPlugin from "../src/plugins/cmyk";
import harmoniesPlugin, { HarmonyType } from "../src/plugins/harmonies";
import hwbPlugin from "../src/plugins/hwb";
import labPlugin from "../src/plugins/lab";
import lchPlugin from "../src/plugins/lch";
import minifyPlugin from "../src/plugins/minify";
import oklabPlugin from "../src/plugins/oklab";
import oklchPlugin from "../src/plugins/oklch";
import mixPlugin from "../src/plugins/mix";
import namesPlugin from "../src/plugins/names";
import xyzPlugin from "../src/plugins/xyz";

describe("a11y", () => {
  extend([a11yPlugin]);

  it("Returns the perceived luminance of a color", () => {
    expect(colord("#000000").luminance()).toBe(0);
    expect(colord("#e42189").luminance()).toBe(0.19);
    expect(colord("#ff0000").luminance()).toBe(0.21);
    expect(colord("#808080").luminance()).toBe(0.22);
    expect(colord("#aabbcc").luminance()).toBe(0.48);
    expect(colord("#ccddee").luminance()).toBe(0.71);
    expect(colord("#ffffff").luminance()).toBe(1);
  });

  it("Calculates a contrast ratio for a color pair", () => {
    // https://webaim.org/resources/contrastchecker/
    expect(colord("#000000").contrast()).toBe(21);
    expect(colord("#ffffff").contrast("#000000")).toBe(21);
    expect(colord("#777777").contrast()).toBe(4.47);
    expect(colord("#ff0000").contrast()).toBe(3.99);
    expect(colord("#00ff00").contrast()).toBe(1.37);
    expect(colord("#2e2e2e").contrast()).toBe(13.57);
    expect(colord("#0079ad").contrast()).toBe(4.84);
    expect(colord("#0079ad").contrast("#2e2e2e")).toBe(2.8);
    expect(colord("#e42189").contrast("#0d0330")).toBe(4.54);
    expect(colord("#fff4cc").contrast("#3a1209")).toBe(15);
    expect(colord("#fff4cc").contrast(colord("#3a1209"))).toBe(15);
  });

  it("Check readability", () => {
    // https://webaim.org/resources/contrastchecker/
    expect(colord("#000").isReadable()).toBe(true);
    expect(colord("#777777").isReadable()).toBe(false);
    expect(colord("#e60000").isReadable("#ffff47")).toBe(true);
    expect(colord("#af085c").isReadable("#000000")).toBe(false);
    expect(colord("#af085c").isReadable("#000000", { size: "large" })).toBe(true);
    expect(colord("#d53987").isReadable("#000000")).toBe(true);
    expect(colord("#d53987").isReadable("#000000", { level: "AAA" })).toBe(false);
    expect(colord("#e9dddd").isReadable("#864b7c", { level: "AA" })).toBe(true);
    expect(colord("#e9dddd").isReadable("#864b7c", { level: "AAA" })).toBe(false);
    expect(colord("#e9dddd").isReadable("#864b7c", { level: "AAA", size: "large" })).toBe(true);
    expect(colord("#e9dddd").isReadable("#67325e", { level: "AAA" })).toBe(true);
    expect(colord("#e9dddd").isReadable(colord("#67325e"), { level: "AAA" })).toBe(true);
  });
});

describe("cmyk", () => {
  extend([cmykPlugin]);

  it("Parses CMYK color object", () => {
    expect(colord({ c: 0, m: 0, y: 0, k: 100 }).toHex()).toBe("#000000");
    expect(colord({ c: 16, m: 8, y: 0, k: 20, a: 1 }).toHex()).toBe("#abbccc");
    expect(colord({ c: 51, m: 47, y: 0, k: 33, a: 0.5 }).toHex()).toBe("#545bab80");
    expect(colord({ c: 0, m: 0, y: 0, k: 0, a: 1 }).toHex()).toBe("#ffffff");
  });

  it("Parses CMYK color string", () => {
    expect(colord("device-cmyk(0% 0% 0% 100%)").toHex()).toBe("#000000");
    expect(colord("device-cmyk(0% 61% 72% 0% / 50%)").toHex()).toBe("#ff634780");
    expect(colord("device-cmyk(0 0.61 0.72 0 / 0.5)").toHex()).toBe("#ff634780");
  });

  it("Converts a color to CMYK object", () => {
    // https://htmlcolors.com/color-converter
    expect(colord("#000000").toCmyk()).toMatchObject({ c: 0, m: 0, y: 0, k: 100, a: 1 });
    expect(colord("#ff0000").toCmyk()).toMatchObject({ c: 0, m: 100, y: 100, k: 0, a: 1 });
    expect(colord("#00ffff").toCmyk()).toMatchObject({ c: 100, m: 0, y: 0, k: 0, a: 1 });
    expect(colord("#665533").toCmyk()).toMatchObject({ c: 0, m: 17, y: 50, k: 60, a: 1 });
    expect(colord("#feacfa").toCmyk()).toMatchObject({ c: 0, m: 32, y: 2, k: 0, a: 1 });
    expect(colord("#ffffff").toCmyk()).toMatchObject({ c: 0, m: 0, y: 0, k: 0, a: 1 });
  });

  it("Converts a color to CMYK string", () => {
    // https://en.wikipedia.org/wiki/CMYK_color_model
    expect(colord("#999966").toCmykString()).toBe("device-cmyk(0% 0% 33% 40%)");
    expect(colord("#99ffff").toCmykString()).toBe("device-cmyk(40% 0% 0% 0%)");
    expect(colord("#00336680").toCmykString()).toBe("device-cmyk(100% 50% 0% 60% / 0.5)");
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat({ c: 0, m: 0, y: 0, k: 100 })).toBe("cmyk");
  });
});

describe("harmonies", () => {
  extend([harmoniesPlugin]);

  const check = (type: HarmonyType | undefined, input: string, expected: string[]) => {
    const harmonies = colord(input).harmonies(type);
    const hexes = harmonies.map((value) => value.toHex());
    return expect(hexes).toEqual(expected);
  };

  it("Generates harmony colors", () => {
    check(undefined, "#ff0000", ["#ff0000", "#00ffff"]); // "complementary"
    check("analogous", "#ff0000", ["#ff0080", "#ff0000", "#ff8000"]);
    check("complementary", "#ff0000", ["#ff0000", "#00ffff"]);
    check("double-split-complementary", "#ff0000", [
      "#ff0080",
      "#ff0000",
      "#ff8000",
      "#00ff80",
      "#0080ff",
    ]);
    check("rectangle", "#ff0000", ["#ff0000", "#ffff00", "#00ffff", "#0000ff"]);
    check("tetradic", "#ff0000", ["#ff0000", "#80ff00", "#00ffff", "#8000ff"]);
    check("triadic", "#ff0000", ["#ff0000", "#00ff00", "#0000ff"]);
    check("split-complementary", "#ff0000", ["#ff0000", "#00ff80", "#0080ff"]);
  });

  it("Preserves an input color with a non-integer hue", () => {
    // https://github.com/omgovich/colord/issues/123 — hue rounding used to mutate the input color
    check("analogous", "#03ff84", ["#03ff06", "#03ff84", "#03fcff"]);
    check("complementary", "#03ff84", ["#03ff84", "#ff037e"]);
    check("double-split-complementary", "#03ff84", [
      "#03ff06",
      "#03ff84",
      "#03fcff",
      "#ff03fc",
      "#ff0603",
    ]);
    check("rectangle", "#03ff84", ["#03ff84", "#037eff", "#ff037e", "#ff8403"]);
    check("tetradic", "#03ff84", ["#03ff84", "#0603ff", "#ff037e", "#fcff03"]);
    check("triadic", "#03ff84", ["#03ff84", "#8403ff", "#ff8403"]);
    check("split-complementary", "#03ff84", ["#03ff84", "#ff03fc", "#ff0603"]);
  });
});

describe("hwb", () => {
  extend([hwbPlugin]);

  it("Parses HWB color object", () => {
    expect(colord({ h: 0, w: 0, b: 100 }).toHex()).toBe("#000000");
    expect(colord({ h: 210, w: 67, b: 20, a: 1 }).toHex()).toBe("#abbbcc");
    expect(colord({ h: 236, w: 33, b: 33, a: 0.5 }).toHex()).toBe("#545aab80");
    expect(colord({ h: 0, w: 100, b: 0, a: 1 }).toHex()).toBe("#ffffff");
  });

  it("Normalizes whiteness + blackness over 100% to an achromatic gray", () => {
    // https://www.w3.org/TR/css-color-4/#hwb-to-rgb
    // When w + b >= 100% the color is gray with value w / (w + b).
    expect(colord({ h: 120, w: 70, b: 70 }).toHex()).toBe("#808080");
    expect(colord({ h: 200, w: 100, b: 100 }).toHex()).toBe("#808080");
    expect(colord({ h: 0, w: 50, b: 60 }).toHex()).toBe("#747474");
    // Blackness of exactly 100% is gray too when whiteness is non-zero, not black
    expect(colord({ h: 0, w: 50, b: 100 }).toHex()).toBe("#555555");
    // The string parser goes through the same normalization and keeps the alpha
    expect(colord("hwb(120 70% 70% / 50%)").toRgbString()).toBe("rgba(128, 128, 128, 0.5)");
  });

  it("Converts a color to HWB object", () => {
    // https://htmlcolors.com/color-converter
    expect(colord("#000000").toHwb()).toMatchObject({ h: 0, w: 0, b: 100, a: 1 });
    expect(colord("#ff0000").toHwb()).toMatchObject({ h: 0, w: 0, b: 0, a: 1 });
    expect(colord("#00ffff").toHwb()).toMatchObject({ h: 180, w: 0, b: 0, a: 1 });
    expect(colord("#665533").toHwb()).toMatchObject({ h: 40, w: 20, b: 60, a: 1 });
    expect(colord("#feacfa").toHwb()).toMatchObject({ h: 303, w: 67, b: 0, a: 1 });
    expect(colord("#ffffff").toHwb()).toMatchObject({ h: 0, w: 100, b: 0, a: 1 });
    // A hue that rounds up to 360 must wrap to 0 like everywhere else, and must
    // agree with the other models — HWB reads the very same hue as HSL.
    const red = colord({ r: 120, g: 0, b: 1 });
    expect(red.toHwb()).toMatchObject({ h: 0 });
    expect(red.toHwb().h).toBe(red.toHsl().h);
    expect(red.toHwbString()).toBe("hwb(0 0% 53%)");
    expect(colord({ h: 360, w: 0, b: 0 }).toHwb()).toMatchObject({ h: 0 });
    expect(colord("hwb(360 0% 0%)").toHwbString()).toBe("hwb(0 0% 0%)");
  });

  it("Parses HWB color string", () => {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hwb()
    // https://en.wikipedia.org/wiki/HWB_color_model
    expect(colord("hwb(194 0% 0%)").toHex()).toBe("#00c3ff");
    expect(colord("hwb(194 0% 0% / .5)").toHex()).toBe("#00c3ff80");
    expect(colord("hwb(-90deg 40% 40% / 50%)").toHex()).toBe("#7f669980");
  });

  it("Ignores invalid syntax", () => {
    // comma syntax is not documented
    expect(colord("hwb(194, 0%, 0%, .5)").isValid()).toBe(false);
    // missing percents
    expect(colord("hwb(-90deg 40 40)").isValid()).toBe(false);
  });

  it("Converts a color to HWB string", () => {
    // https://en.wikipedia.org/wiki/HWB_color_model
    expect(colord("#999966").toHwbString()).toBe("hwb(60 40% 40%)");
    expect(colord("#99ffff").toHwbString()).toBe("hwb(180 60% 0%)");
    expect(colord("#00336680").toHwbString()).toBe("hwb(210 0% 60% / 0.5)");
  });

  it("Supports all valid CSS angle units", () => {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/angle
    expect(colord("hwb(90deg 20% 20%)").toHwb().h).toBe(90);
    expect(colord("hwb(100grad 20% 20%)").toHwb().h).toBe(90);
    expect(colord("hwb(1.25turn 20% 20%)").toHwb().h).toBe(90);
    expect(colord("hwb(1.5708rad 20% 20%)").toHwb().h).toBe(90);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat("hwb(180deg 50% 50%)")).toBe("hwb");
    expect(getFormat({ h: 0, w: 0, b: 100 })).toBe("hwb");
  });
});

describe("lab", () => {
  extend([labPlugin]);

  it("Parses CIE LAB color object", () => {
    // https://cielab.xyz/colorconv/
    expect(colord({ l: 100, a: 0, b: 0 }).toHex()).toBe("#ffffff");
    expect(colord({ l: 0, a: 0, b: 0 }).toHex()).toBe("#000000");
    expect(colord({ l: 54.29, a: 80.81, b: 69.89 }).toHex()).toBe("#ff0000");
    expect(colord({ l: 15.05, a: 6.68, b: 14.59, alpha: 0.5 }).toHex()).toBe("#33221180");
    expect(colord({ l: 50.93, a: 64.96, b: -6.38, alpha: 1 }).toHex()).toBe("#d53987");
  });

  it("Converts a color to CIE LAB object", () => {
    // https://cielab.xyz/colorconv/
    expect(colord("#ffffff").toLab()).toMatchObject({ l: 100, a: 0, b: 0, alpha: 1 });
    expect(colord("#00000000").toLab()).toMatchObject({ l: 0, a: 0, b: 0, alpha: 0 });
    expect(colord("#ff0000").toLab()).toMatchObject({ l: 54.29, a: 80.81, b: 69.89, alpha: 1 });
    expect(colord("#00ff00").toLab()).toMatchObject({ l: 87.82, a: -79.29, b: 80.99, alpha: 1 });
    expect(colord("#ffff00").toLab()).toMatchObject({ l: 97.61, a: -15.75, b: 93.39, alpha: 1 });
    expect(colord("#aabbcc").toLab()).toMatchObject({ l: 74.97, a: -3.4, b: -10.7, alpha: 1 });
    expect(colord("#33221180").toLab()).toMatchObject({ l: 15.05, a: 6.68, b: 14.59, alpha: 0.5 });
    expect(colord("#d53987").toLab()).toMatchObject({ l: 50.93, a: 64.96, b: -6.38, alpha: 1 });
  });

  it("Calculates the the perceived color difference", () => {
    /**
     * Test results: https://cielab.xyz/colordiff.php
     *
     * All tests done using RGB.
     * Inner state is RGB, it is discrete thus all model transformations become discrete
     * and some accuracy is lost.
     *
     * After migrating the state to XYZ or handling the rounding problem, tests using other color models should be added.
     */
    expect(colord("#3296fa").delta("#197dc8")).toBe(0.099);
    expect(colord("#faf0c8").delta("#fff")).toBe(0.145);
    expect(colord("#afafaf").delta("#b4b4b4")).toBe(0.014);
    expect(colord("#000").delta("#fff")).toBe(1);
    expect(colord("#000").delta("#c8cdd7")).toBe(0.737);
    expect(colord("#c8cdd7").delta("#000")).toBe(0.737);
    expect(colord("#f4f4f4").delta("#fafafa")).toBe(0.012);
    expect(colord("#f4f4f4").delta("#f4f4f4")).toBe(0);
    // A pair whose mean hue lands in the blue region (~275°), where the CIEDE2000
    // rotation term is the only thing separating a correct implementation from a
    // wrong one. See `delta-e00.test.ts` for the reference data behind the formula.
    expect(colord("#e0ffff").delta("#ffc0e0")).toBe(0.312);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat({ l: 50, a: 0, b: 0, alpha: 1 })).toBe("lab");
  });
});

describe("lch", () => {
  extend([lchPlugin]);

  it("Parses CIE LCH color object", () => {
    // https://www.w3.org/TR/css-color-4/#specifying-lab-lch
    expect(colord({ l: 0, c: 0, h: 0, a: 0 }).toHex()).toBe("#00000000");
    expect(colord({ l: 100, c: 0, h: 0 }).toHex()).toBe("#ffffff");
    expect(colord({ l: 29.2345, c: 44.2, h: 27 }).toHex()).toBe("#7d2329");
    expect(colord({ l: 52.2345, c: 72.2, h: 56.2 }).toHex()).toBe("#c65d06");
    expect(colord({ l: 60.2345, c: 59.2, h: 95.2 }).toHex()).toBe("#9d9318");
    expect(colord({ l: 62.2345, c: 59.2, h: 126.2 }).toHex()).toBe("#68a639");
    expect(colord({ l: 67.5345, c: 42.5, h: 258.2, a: 0.5 }).toHex()).toBe("#62acef80");
  });

  it("Parses CIE LCH color string", () => {
    // https://cielab.xyz/colorconv/
    // https://www.w3.org/TR/css-color-4/
    expect(colord("lch(0% 0 0 / 0)").toHex()).toBe("#00000000");
    expect(colord("lch(100% 0 0)").toHex()).toBe("#ffffff");
    expect(colord("lch(52.2345% 72.2 56.2 / 1)").toHex()).toBe("#c65d06");
    expect(colord("lch(37% 105 305)").toHex()).toBe("#6a27e7");
    expect(colord("lch(56.2% 83.6 357.4 / 93%)").toHex()).toBe("#fe1091ed");
  });

  it("Converts a color to CIE LCH object", () => {
    // https://cielab.xyz/colorconv/
    expect(colord("#00000000").toLch()).toMatchObject({ l: 0, c: 0, h: 0, a: 0 });
    expect(colord("#ffffff").toLch()).toMatchObject({ l: 100, c: 0, h: 0, a: 1 });
    expect(colord("#7d2329").toLch()).toMatchObject({ l: 29.16, c: 44.14, h: 26.48, a: 1 });
    expect(colord("#c65d06").toLch()).toMatchObject({ l: 52.31, c: 72.21, h: 56.33, a: 1 });
    expect(colord("#9d9318").toLch()).toMatchObject({ l: 60.31, c: 59.2, h: 95.46, a: 1 });
    expect(colord("#68a639").toLch()).toMatchObject({ l: 62.22, c: 59.15, h: 126.15, a: 1 });
    expect(colord("#62acef80").toLch()).toMatchObject({ l: 67.67, c: 42.18, h: 257.79, a: 0.5 });
  });

  it("Keeps the LCH hue within [0, 360)", () => {
    // The Lab-derived hue can round up to exactly 360; it must wrap to 0.
    expect(colord({ r: 48, g: 7, b: 24 }).toLch().h).toBe(0);
    expect(colord({ r: 48, g: 7, b: 24 }).toLchString()).toBe("lch(7.82% 22.2 0)");
    expect(colord({ l: 50, c: 50, h: 360 }).toLch()).toMatchObject({ h: 0 });
    expect(colord("lch(50% 50 360)").toLchString()).toBe("lch(50% 50 0)");
  });

  it("Converts a color to CIE LCH string (CSS functional notation)", () => {
    // https://cielab.xyz/colorconv/
    expect(colord("#00000080").toLchString()).toBe("lch(0% 0 0 / 0.5)");
    expect(colord("#ffffff").toLchString()).toBe("lch(100% 0 0)");
    expect(colord("#c65d06ed").toLchString()).toBe("lch(52.31% 72.21 56.33 / 0.93)");
    expect(colord("#aabbcc").toLchString()).toBe("lch(74.97% 11.22 252.37)");
  });

  it("Supports all valid CSS angle units", () => {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/angle
    expect(colord("lch(50% 50 90deg)").toLch().h).toBe(90);
    expect(colord("lch(50% 50 100grad)").toLch().h).toBe(90);
    expect(colord("lch(50% 50 0.25turn)").toLch().h).toBe(90);
    expect(colord("lch(50% 50 1.5708rad)").toLch().h).toBe(90);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat("lch(50% 50 180deg)")).toBe("lch");
    expect(getFormat({ l: 50, c: 50, h: 180 })).toBe("lch");
  });
});

describe("minify", () => {
  extend([minifyPlugin, namesPlugin]);

  it("Minifies a color", () => {
    expect(colord("#000000").minify()).toBe("#000");
    expect(colord("black").minify()).toBe("#000");
    expect(colord("#112233").minify()).toBe("#123");
    expect(colord("darkgray").minify()).toBe("#a9a9a9");
    expect(colord("rgba(200,200,200,0.55)").minify()).toBe("hsla(0,0%,78%,.55)");
    expect(colord("rgba(200,200,200,0.55)").minify({ hsl: false })).toBe("rgba(200,200,200,.55)");
  });

  it("Supports alpha hexes", () => {
    expect(colord("hsla(0, 100%, 50%, .5)").minify()).toBe("rgba(255,0,0,.5)");
    expect(colord("hsla(0, 100%, 50%, .5)").minify({ alphaHex: true })).toBe("#ff000080");
    expect(colord("rgba(0, 0, 255, 0.4)").minify({ alphaHex: true })).toBe("#00f6");
  });

  it("Performs lossless minification (handles alpha hex issues)", () => {
    expect(colord("rgba(0,0,0,.4)").minify({ alphaHex: true })).toBe("#0006");
    expect(colord("rgba(0,0,0,.075)").minify({ alphaHex: true })).toBe("rgba(0,0,0,.075)");
    expect(colord("hsla(0,0%,50%,.515)").minify({ alphaHex: true })).toBe("hsla(0,0%,50%,.515)");
  });

  it("Supports names", () => {
    expect(colord("#f00").minify({ name: true })).toBe("red");
    expect(colord("#000080").minify({ name: true })).toBe("navy");
    expect(colord("rgb(255,0,0)").minify({ name: true })).toBe("red");
    expect(colord("hsl(0, 100%, 50%)").minify({ name: true })).toBe("red");
  });

  it("Supports `transparent` keyword", () => {
    expect(colord("rgba(0,0,0,0)").minify()).toBe("rgba(0,0,0,0)");
    expect(colord("rgba(0,0,0,0.0)").minify({ name: true })).toBe("rgba(0,0,0,0)");
    expect(colord("hsla(0,0%,0%,0)").minify({ transparent: true })).toBe("transparent");
    expect(colord("rgba(0,0,0,0)").minify({ transparent: true })).toBe("transparent");
    expect(colord("rgba(0,0,0,0)").minify({ transparent: true, alphaHex: true })).toBe("#0000");
  });
});

describe("mix", () => {
  extend([mixPlugin]);

  it("Mixes two colors", () => {
    expect(colord("#000000").mix("#ffffff").toHex()).toBe("#777777");
    expect(colord("#dc143c").mix("#000000").toHex()).toBe("#6a1b21");
    expect(colord("#800080").mix("#dda0dd").toHex()).toBe("#af5cae");
    expect(colord("#228b22").mix("#87cefa").toHex()).toBe("#60ac8f");
    expect(colord("#cd853f").mix("#eee8aa", 0.6).toHex()).toBe("#e3c07e");
    expect(colord("#483d8b").mix("#00bfff", 0.35).toHex()).toBe("#4969b2");
  });

  it("Returns the same color if ratio is 0 or 1", () => {
    expect(colord("#cd853f").mix("#ffffff", 0).toHex()).toBe("#cd853f");
    expect(colord("#ffffff").mix("#cd853f", 1).toHex()).toBe("#cd853f");
  });

  it("Return the color if both values are equal", () => {
    expect(colord("#ffffff").mix("#ffffff").toHex()).toBe("#ffffff");
    expect(colord("#000000").mix("#000000").toHex()).toBe("#000000");
  });

  const check = (colors: Colord[], expected: string[]) => {
    const hexes = colors.map((value) => value.toHex());
    return expect(hexes).toEqual(expected);
  };

  it("Generates a tints palette", () => {
    check(colord("#ff0000").tints(2), ["#ff0000", "#ffffff"]);
    check(colord("#ff0000").tints(3), ["#ff0000", "#ff9f80", "#ffffff"]);
    check(colord("#ff0000").tints(), ["#ff0000", "#ff6945", "#ff9f80", "#ffd0be", "#ffffff"]);
    expect(colord("#aabbcc").tints(499)).toHaveLength(499);
  });

  it("Generates a shades palette", () => {
    check(colord("#ff0000").shades(2), ["#ff0000", "#000000"]);
    check(colord("#ff0000").shades(3), ["#ff0000", "#7a1b0b", "#000000"]);
    check(colord("#ff0000").shades(), ["#ff0000", "#ba1908", "#7a1b0b", "#3f1508", "#000000"]);
    expect(colord("#aabbcc").shades(333)).toHaveLength(333);
  });

  it("Generates a tones palette", () => {
    check(colord("#ff0000").tones(2), ["#ff0000", "#808080"]);
    check(colord("#ff0000").tones(3), ["#ff0000", "#c86147", "#808080"]);
    check(colord("#ff0000").tones(), ["#ff0000", "#e54729", "#c86147", "#a87363", "#808080"]);
    expect(colord("#aabbcc").tones(987)).toHaveLength(987);
  });
});

describe("names", () => {
  extend([namesPlugin]);

  it("Parses valid CSS color names", () => {
    expect(colord("white").toHex()).toBe("#ffffff");
    expect(colord("red").toHex()).toBe("#ff0000");
    expect(colord("rebeccapurple").toHex()).toBe("#663399");
  });

  it("Ignores the case and extra whitespaces", () => {
    expect(colord("White ").toHex()).toBe("#ffffff");
    expect(colord(" YELLOW").toHex()).toBe("#ffff00");
    expect(colord("  REbeccapurpLE ").toHex()).toBe("#663399");
  });

  it("Converts a color to CSS name", () => {
    expect(colord("#F00").toName()).toBe("red");
    expect(colord("#663399").toName()).toBe("rebeccapurple");
  });

  it("Gets the closest CSS color keyword", () => {
    expect(colord("#AAA").toName({ closest: true })).toBe("darkgray");
    expect(colord("#fd0202").toName({ closest: true })).toBe("red");
    expect(colord("#00008d").toName({ closest: true })).toBe("darkblue");
    expect(colord("#fe0000").toName({ closest: true })).toBe("red");
    expect(colord("#FFF").toName({ closest: true })).toBe("white");
  });

  it("Does not crash when name is not found", () => {
    expect(colord("#123456").toName()).toBe(undefined);
    expect(colord("myownpurple").toHex()).toBe("#000000");
  });

  it("Processes 'transparent' color properly", () => {
    expect(colord("transparent").alpha()).toBe(0);
    expect(colord("transparent").toHex()).toBe("#00000000");
    expect(colord("rgba(0, 0, 0, 0)").toName()).toBe("transparent");
    expect(colord("rgba(255, 255, 255, 0)").toName()).toBeUndefined();
  });

  it("Works properly in pair with the built-in validation", () => {
    expect(colord("transparent").isValid()).toBe(true);
    expect(colord("red").isValid()).toBe(true);
    expect(colord("yellow").isValid()).toBe(true);
    expect(colord("sunyellow").isValid()).toBe(false);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat("transparent")).toBe("name");
    expect(getFormat("yellow")).toBe("name");
  });
});

describe("xyz", () => {
  extend([xyzPlugin]);

  it("Parses XYZ color object", () => {
    // https://www.nixsensor.com/free-color-converter/
    expect(colord({ x: 0, y: 0, z: 0 }).toHex()).toBe("#000000");
    expect(colord({ x: 50, y: 50, z: 50 }).toHex()).toBe("#beb9cf");
    expect(colord({ x: 96.42, y: 100, z: 82.52, a: 1 }).toHex()).toBe("#ffffff");
  });

  it("Converts a color to CIE XYZ object", () => {
    // https://www.easyrgb.com/en/convert.php
    // https://cielab.xyz/colorconv/
    expect(colord("#ffffff").toXyz()).toMatchObject({ x: 96.42, y: 100, z: 82.52, a: 1 });
    expect(colord("#5cbf54").toXyz()).toMatchObject({ x: 26, y: 40.27, z: 11.54, a: 1 });
    expect(colord("#00000000").toXyz()).toMatchObject({ x: 0, y: 0, z: 0, a: 0 });
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat({ x: 50, y: 50, z: 50 })).toBe("xyz");
  });
});

describe("oklab", () => {
  extend([oklabPlugin]);

  it("Parses OKLab color object", () => {
    // Reference values are cross-checked against culori
    // https://culorijs.org/color-spaces/#oklab
    expect(colord({ l: 1, a: 0, b: 0, ok: true }).toHex()).toBe("#ffffff");
    expect(colord({ l: 0, a: 0, b: 0, ok: true }).toHex()).toBe("#000000");
    expect(colord({ l: 0.628, a: 0.2249, b: 0.1258, ok: true }).toHex()).toBe("#ff0000");
    expect(colord({ l: 0.8664, a: -0.2339, b: 0.1795, ok: true }).toHex()).toBe("#00ff00");
    expect(colord({ l: 0.7844, a: -0.0114, b: -0.0285, ok: true }).toHex()).toBe("#aabbcc");
    expect(colord({ l: 0.2684, a: 0.0162, b: 0.0347, alpha: 0.5, ok: true }).toHex()).toBe(
      "#33221180"
    );
  });

  it("Treats objects without the `ok` marker as CIE LAB", () => {
    expect(getFormat({ l: 0.628, a: 0.2249, b: 0.1258 })).toBe("lab");
  });

  it("Parses marked objects regardless of plugin registration order", () => {
    // The lab plugin is registered before oklab in this suite;
    // its parser must not swallow objects carrying the `ok` marker
    expect(getFormat({ l: 0.628, a: 0.2249, b: 0.1258, ok: true })).toBe("oklab");
    expect(colord({ l: 0.628, a: 0.2249, b: 0.1258, ok: true }).toHex()).toBe("#ff0000");
  });

  it("Parses OKLab color string", () => {
    // https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
    expect(colord("oklab(1 0 0)").toHex()).toBe("#ffffff");
    expect(colord("oklab(0.628 0.2249 0.1258)").toHex()).toBe("#ff0000");
    expect(colord("oklab(0.8664 -0.2339 0.1795)").toHex()).toBe("#00ff00");
    // Percentage form: 100% = 1 for lightness, 100% = 0.4 for the axes
    expect(colord("oklab(62.8% 56.225% 31.45%)").toHex()).toBe("#ff0000");
    expect(colord("oklab(0.2684 0.0162 0.0347 / 0.5)").toHex()).toBe("#33221180");
    expect(colord("oklab(0.2684 0.0162 0.0347 / 50%)").toHex()).toBe("#33221180");
  });

  it("Matches the web-platform-tests conformance values", () => {
    // The reference pairs browsers are tested against
    // https://github.com/web-platform-tests/wpt/tree/master/css/css-color (oklab-001, 004, 005)
    expect(colord("oklab(51.975% -0.1403 0.10768)").toHex()).toBe("#008000");
    expect(colord("oklab(50% 0.05 0)").toHex()).toBe("#7c5762"); // rgb(48.477% 34.29% 38.412%)
    expect(colord("oklab(70% -0.1 0)").toHex()).toBe("#4bb3a1"); // rgb(29.264% 70.096% 63.017%)
    expect(colord("#008000").toOklab()).toMatchObject({ l: 0.5198, a: -0.1403, b: 0.1077 });
  });

  it("Converts a color to OKLab object", () => {
    expect(colord("#ffffff").toOklab()).toMatchObject({ l: 1, a: 0, b: 0, alpha: 1, ok: true });
    expect(colord("#000000").toOklab()).toMatchObject({ l: 0, a: 0, b: 0, alpha: 1 });
    expect(colord("#ff0000").toOklab()).toMatchObject({ l: 0.628, a: 0.2249, b: 0.1258 });
    expect(colord("#00ff00").toOklab()).toMatchObject({ l: 0.8664, a: -0.2339, b: 0.1795 });
    expect(colord("#0000ff").toOklab()).toMatchObject({ l: 0.452, a: -0.0325, b: -0.3115 });
    expect(colord("#aabbcc").toOklab()).toMatchObject({ l: 0.7844, a: -0.0114, b: -0.0285 });
    expect(colord("#33221180").toOklab()).toMatchObject({
      l: 0.2684,
      a: 0.0162,
      b: 0.0347,
      alpha: 0.5,
    });
  });

  it("Converts a color to OKLab string (CSS functional notation)", () => {
    expect(colord("#ffffff").toOklabString()).toBe("oklab(1 0 0)");
    expect(colord("#ff0000").toOklabString()).toBe("oklab(0.628 0.2249 0.1258)");
    expect(colord("#33221180").toOklabString()).toBe("oklab(0.2684 0.0162 0.0347 / 0.5)");
  });

  it("Round-trips through the object form with the CIE plugins loaded", () => {
    expect(colord(colord("#d53987").toOklab()).toHex()).toBe("#d53987");
  });

  it("Clamps invalid channel values", () => {
    expect(colord({ l: 1.5, a: 0, b: 0, ok: true }).toHex()).toBe("#ffffff");
    expect(colord({ l: -1, a: 0, b: 0, ok: true }).toHex()).toBe("#000000");
    expect(colord({ l: 1, a: 0, b: 0, alpha: 2, ok: true }).toHex()).toBe("#ffffff");
  });

  it("Ignores invalid input", () => {
    expect(colord("oklab(1 0)").isValid()).toBe(false);
    expect(colord("oklab(1 0 0 0)").isValid()).toBe(false);
    // @ts-ignore
    expect(colord({ l: 0.5, a: 0.1, ok: true }).isValid()).toBe(false);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat("oklab(0.628 0.2249 0.1258)")).toBe("oklab");
    expect(getFormat({ l: 0.628, a: 0.2249, b: 0.1258, ok: true })).toBe("oklab");
  });
});

describe("oklch", () => {
  extend([oklchPlugin]);

  it("Parses OKLCH color object", () => {
    // Reference values are cross-checked against culori
    // https://culorijs.org/color-spaces/#oklch
    expect(colord({ l: 1, c: 0, h: 0, ok: true }).toHex()).toBe("#ffffff");
    expect(colord({ l: 0, c: 0, h: 0, ok: true }).toHex()).toBe("#000000");
    expect(colord({ l: 0.628, c: 0.2577, h: 29.23, ok: true }).toHex()).toBe("#ff0000");
    expect(colord({ l: 0.5, c: 0.2, h: 240, ok: true }).toHex()).toBe("#0069c7");
    expect(colord({ l: 0.2684, c: 0.0383, h: 64.93, a: 0.5, ok: true }).toHex()).toBe(
      "#33221180"
    );
  });

  it("Treats objects without the `ok` marker as CIE LCH", () => {
    expect(getFormat({ l: 0.5, c: 0.1, h: 20 })).toBe("lch");
  });

  it("Parses marked objects regardless of plugin registration order", () => {
    // The lch plugin is registered before oklch in this suite;
    // its parser must not swallow objects carrying the `ok` marker
    expect(getFormat({ l: 0.628, c: 0.2577, h: 29.23, ok: true })).toBe("oklch");
    expect(colord({ l: 0.628, c: 0.2577, h: 29.23, ok: true }).toHex()).toBe("#ff0000");
  });

  it("Parses OKLCH color string", () => {
    // https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
    expect(colord("oklch(1 0 0)").toHex()).toBe("#ffffff");
    expect(colord("oklch(0.628 0.2577 29.23)").toHex()).toBe("#ff0000");
    expect(colord("oklch(0.5 0.2 240)").toHex()).toBe("#0069c7");
    // Percentage form: 100% = 1 for lightness, 100% = 0.4 for chroma
    expect(colord("oklch(62.8% 64.425% 29.23)").toHex()).toBe("#ff0000");
    expect(colord("oklch(0.2684 0.0383 64.93 / 0.5)").toHex()).toBe("#33221180");
    expect(colord("oklch(0.2684 0.0383 64.93 / 50%)").toHex()).toBe("#33221180");
  });

  it("Matches the web-platform-tests conformance values", () => {
    // The reference pairs browsers are tested against
    // https://github.com/web-platform-tests/wpt/tree/master/css/css-color (oklch-001, 004, 005)
    expect(colord("oklch(51.975% 0.17686 142.495)").toHex()).toBe("#008000");
    expect(colord("oklch(50% 0.2 0)").toHex()).toBe("#b4065f"); // rgb(70.492% 2.351% 37.073%)
    expect(colord("oklch(50% 0.2 270)").toHex()).toBe("#3b51d3"); // rgb(23.056% 31.73% 82.628%)
  });

  it("Serializes the CSS Color 4 specification examples", () => {
    // https://www.w3.org/TR/css-color-4/#serializing-oklab-oklch
    expect(colord("oklch(56.43% 0.0900 123.40)").toOklchString()).toBe("oklch(0.5643 0.09 123.4)");
    expect(colord("oklch(53.85% 0.1725 320.67 / 70%)").toOklchString()).toBe(
      "oklch(0.5385 0.1725 320.67 / 0.7)"
    );
  });

  it("Supports all valid CSS angle units", () => {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/angle
    const reference = colord("oklch(0.8 0.1 90)").toHex();
    expect(colord("oklch(0.8 0.1 90deg)").toHex()).toBe(reference);
    expect(colord("oklch(0.8 0.1 100grad)").toHex()).toBe(reference);
    expect(colord("oklch(0.8 0.1 0.25turn)").toHex()).toBe(reference);
    expect(colord("oklch(0.8 0.1 1.5708rad)").toHex()).toBe(reference);
  });

  it("Converts a color to OKLCH object", () => {
    expect(colord("#ffffff").toOklch()).toMatchObject({ l: 1, c: 0, h: 0, a: 1, ok: true });
    expect(colord("#000000").toOklch()).toMatchObject({ l: 0, c: 0, h: 0, a: 1 });
    // The CSS Color 4 specification says "sRGB blue is oklch(0.452 0.313 264.1)"
    // (rounded to their precision). https://www.w3.org/TR/css-color-4/#ok-lab
    expect(colord("#0000ff").toOklch()).toMatchObject({ l: 0.452, c: 0.3132, h: 264.05 });
    expect(colord("#808080").toOklch()).toMatchObject({ l: 0.5999, c: 0, h: 0 });
    expect(colord("#ff0000").toOklch()).toMatchObject({ l: 0.628, c: 0.2577, h: 29.23 });
    expect(colord("#00ffff").toOklch()).toMatchObject({ l: 0.9054, c: 0.1546, h: 194.77 });
    expect(colord("#d53987").toOklch()).toMatchObject({ l: 0.5999, c: 0.2029, h: 354.63 });
    expect(colord("#33221180").toOklch()).toMatchObject({
      l: 0.2684,
      c: 0.0383,
      h: 64.93,
      a: 0.5,
    });
  });

  it("Converts a color to OKLCH string (CSS functional notation)", () => {
    expect(colord("#ffffff").toOklchString()).toBe("oklch(1 0 0)");
    expect(colord("#808080").toOklchString()).toBe("oklch(0.5999 0 0)");
    expect(colord("#ff0000").toOklchString()).toBe("oklch(0.628 0.2577 29.23)");
    expect(colord("#33221180").toOklchString()).toBe("oklch(0.2684 0.0383 64.93 / 0.5)");
  });

  it("Keeps the hue within [0, 360)", () => {
    expect(colord({ l: 0.5, c: 0.2, h: 360, ok: true }).toOklch().h).toBe(0);
    expect(colord({ l: 0.5, c: 0.2, h: -120, ok: true }).toHex()).toBe(
      colord({ l: 0.5, c: 0.2, h: 240, ok: true }).toHex()
    );
  });

  it("Clips out-of-sRGB-gamut colors the way browsers render them", () => {
    // oklch(0.8 0.29 145) is a Display-P3 green; each sRGB channel is clamped independently
    expect(colord("oklch(0.8 0.29 145)").toHex()).toBe("#00e900");
    expect(colord("oklch(0.8 0.29 145)").isValid()).toBe(true);
  });

  it("Round-trips through the object form with the CIE plugins loaded", () => {
    expect(colord(colord("#d53987").toOklch()).toHex()).toBe("#d53987");
  });

  it("Clamps invalid channel values", () => {
    expect(colord({ l: 1.5, c: 0, h: 0, ok: true }).toHex()).toBe("#ffffff");
    expect(colord({ l: 0.5, c: -0.1, h: 20, ok: true }).toHex()).toBe(
      colord({ l: 0.5, c: 0, h: 20, ok: true }).toHex()
    );
  });

  it("Ignores invalid input", () => {
    expect(colord("oklch(1 0)").isValid()).toBe(false);
    expect(colord("oklch(1 0 0 0)").isValid()).toBe(false);
    // @ts-ignore
    expect(colord({ l: 0.5, c: 0.1, ok: true }).isValid()).toBe(false);
  });

  it("Supported by `getFormat`", () => {
    expect(getFormat("oklch(0.628 0.2577 29.23)")).toBe("oklch");
    expect(getFormat({ l: 0.628, c: 0.2577, h: 29.23, ok: true })).toBe("oklch");
  });
});
