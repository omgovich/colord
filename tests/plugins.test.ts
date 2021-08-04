import { colord, getFormat, extend } from "../src/";
import a11yPlugin from "../src/plugins/a11y";
import cmykPlugin from "../src/plugins/cmyk";
import harmoniesPlugin, { HarmonyType } from "../src/plugins/harmonies";
import hwbPlugin from "../src/plugins/hwb";
import labPlugin from "../src/plugins/lab";
import lchPlugin from "../src/plugins/lch";
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
    check("rectangle", "#ff0000", ["#ff0000", "#ffff00", "#00ffff", "#0000ff"]);
    check("tetradic", "#ff0000", ["#ff0000", "#80ff00", "#00ffff", "#8000ff"]);
    check("triadic", "#ff0000", ["#ff0000", "#00ff00", "#0000ff"]);
    check("split-complementary", "#ff0000", ["#ff0000", "#00ff80", "#0080ff"]);
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

  it("Converts a color to HWB object", () => {
    // https://htmlcolors.com/color-converter
    expect(colord("#000000").toHwb()).toMatchObject({ h: 0, w: 0, b: 100, a: 1 });
    expect(colord("#ff0000").toHwb()).toMatchObject({ h: 0, w: 0, b: 0, a: 1 });
    expect(colord("#00ffff").toHwb()).toMatchObject({ h: 180, w: 0, b: 0, a: 1 });
    expect(colord("#665533").toHwb()).toMatchObject({ h: 40, w: 20, b: 60, a: 1 });
    expect(colord("#feacfa").toHwb()).toMatchObject({ h: 303, w: 67, b: 0, a: 1 });
    expect(colord("#ffffff").toHwb()).toMatchObject({ h: 0, w: 100, b: 0, a: 1 });
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

  it("Generates a tints palette", () => {
    expect(colord("#ff0000").tints(-5).map(color => color.toHex())).toEqual(["#ff0000", "#ffffff"]);
    expect(colord("#ff0000").tints(1).map(color => color.toHex())).toEqual(["#ff0000", "#ffffff"]);
    expect(colord("#ff0000").tints(2).map(color => color.toHex())).toEqual(["#ff0000", "#ff9f80", "#ffffff"]);
    expect(colord("#ff0000").tints(3).map(color => color.toHex())).toEqual(["#ff0000", "#ff7c59", "#ffc0a9", "#ffffff"]);
    expect(colord("#ff0000").tints().map(color => color.toHex())).toEqual(["#ff0000", "#ff5c39", "#ff8b68", "#ffb399", "#ffd9cb", "#ffffff"]);
    expect(colord("#ff0000").tints(10).map(color => color.toHex())).toEqual(["#ff0000", "#ff3f20", "#ff5c39", "#ff7551", "#ff8b68", "#ff9f80", "#ffb399", "#ffc6b2", "#ffd9cb", "#ffece5", "#ffffff"]);
  });

  it("Generates a shades palette", () => {
    expect(colord("#ff0000").shades(-5).map(color => color.toHex())).toEqual(["#ff0000", "#000000"]);
    expect(colord("#ff0000").shades(1).map(color => color.toHex())).toEqual(["#ff0000", "#000000"]);
    expect(colord("#ff0000").shades(2).map(color => color.toHex())).toEqual(["#ff0000", "#7a1b0b", "#000000"]);
    expect(colord("#ff0000").shades(3).map(color => color.toHex())).toEqual(["#ff0000", "#a41b0a", "#52180a", "#000000"]);
    expect(colord("#ff0000").shades().map(color => color.toHex())).toEqual(["#ff0000", "#c81707", "#931c0b", "#621a0b", "#341306", "#000000"]);
    expect(colord("#ff0000").shades(10).map(color => color.toHex())).toEqual(["#ff0000", "#e31004", "#c81707", "#ad1b09", "#931c0b", "#7a1b0b", "#621a0b", "#4a1709", "#341306", "#200d03", "#000000"]);
  });

  it("Generates a tones palette", () => {
    expect(colord("#ff0000").tones(-5).map(color => color.toHex())).toEqual(["#ff0000", "#808080"]);
    expect(colord("#ff0000").tones(1).map(color => color.toHex())).toEqual(["#ff0000", "#808080"]);
    expect(colord("#ff0000").tones(2).map(color => color.toHex())).toEqual(["#ff0000", "#c86147", "#808080"]);
    expect(colord("#ff0000").tones(3).map(color => color.toHex())).toEqual(["#ff0000", "#dc5134", "#b36e5a", "#808080"]);
    expect(colord("#ff0000").tones().map(color => color.toHex())).toEqual(["#ff0000", "#ea4023", "#d4583b", "#bc6952", "#a17669", "#808080"]);
    expect(colord("#ff0000").tones(10).map(color => color.toHex())).toEqual(["#ff0000", "#f52d14", "#ea4023", "#df4e30", "#d4583b", "#c86147", "#bc6952", "#af705e", "#a17669", "#917b75", "#808080"]);
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
