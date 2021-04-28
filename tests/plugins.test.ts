import { colord, extend } from "../src/";
import a11yPlugin from "../src/plugins/a11y";
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

describe("hwb", () => {
  extend([hwbPlugin]);

  it("Parses HWB color object", () => {
    expect(colord({ h: 0, w: 0, b: 100 }).toHex()).toBe("#000000");
    expect(colord({ h: 210, w: 67, b: 20, a: 1 }).toHex()).toBe("#abbbcc");
    expect(colord({ h: 236, w: 33, b: 33 }).toHex()).toBe("#545aab");
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
});

describe("mix", () => {
  extend([mixPlugin]);

  it("Mixes two colors", () => {
    // https://drafts.csswg.org/css-color-5/#funcdef-color-mix
    expect(colord("#800080").mix("#dda0dd").toHex()).toBe("#af5cae");
    expect(colord("#cd853f").mix("#eee8aa", 0.6).toHex()).toBe("#dfc279");
    expect(colord("#008080").mix("#808000", 0.35).toHex()).toBe("#14865f");
  });

  it("Return the color if both values are equal", () => {
    // https://drafts.csswg.org/css-color-5/#funcdef-color-mix
    expect(colord("#ffffff").mix("#ffffff").toHex()).toBe("#ffffff");
    expect(colord("#000000").mix("#000000").toHex()).toBe("#000000");
  });
});

describe("names", () => {
  extend([namesPlugin]);

  it("Parses valid CSS color names", () => {
    expect(colord("white").toHex()).toBe("#ffffff");
    expect(colord("red").toHex()).toBe("#ff0000");
    expect(colord("rebeccapurple").toHex()).toBe("#663399");
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
  });

  it("Works properly in pair with the built-in validation", () => {
    expect(colord("transparent").isValid()).toBe(true);
    expect(colord("red").isValid()).toBe(true);
    expect(colord("yellow").isValid()).toBe(true);
    expect(colord("sunyellow").isValid()).toBe(false);
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
});
