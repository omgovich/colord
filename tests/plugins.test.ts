import { colord, extend } from "../src/";
import a11yPlugin from "../src/plugins/a11y";
import hwbPlugin from "../src/plugins/hwb";
import labPlugin from "../src/plugins/lab";
import lchPlugin from "../src/plugins/lch";
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
    // https://www.easyrgb.com/en/convert.php
    expect(colord({ l: 100, a: 0, b: 0 }).toHex()).toBe("#ffffff");
    expect(colord({ l: 0, a: 0, b: 0 }).toHex()).toBe("#000000");
    expect(colord({ l: 53.24, a: 80.09, b: 67.2 }).toHex()).toBe("#ff0000");
    expect(colord({ l: 14.89, a: 5.77, b: 14.41, alpha: 0.5 }).toHex()).toBe("#33221180");
    expect(colord({ l: 50.48, a: 65.85, b: -7.51, alpha: 1 }).toHex()).toBe("#d53987");
  });

  it("Converts a color to CIE LAB object", () => {
    // https://www.easyrgb.com/en/convert.php
    expect(colord("#ffffff").toLab()).toMatchObject({ l: 100, a: 0, b: 0, alpha: 1 });
    expect(colord("#00000000").toLab()).toMatchObject({ l: 0, a: 0, b: 0, alpha: 0 });
    expect(colord("#ff0000").toLab()).toMatchObject({ l: 53.24, a: 80.09, b: 67.2, alpha: 1 });
    expect(colord("#00ff00").toLab()).toMatchObject({ l: 87.73, a: -86.18, b: 83.18, alpha: 1 });
    expect(colord("#ffff00").toLab()).toMatchObject({ l: 97.14, a: -21.55, b: 94.48, alpha: 1 });
    expect(colord("#aabbcc").toLab()).toMatchObject({ l: 75.1, a: -2.29, b: -10.53, alpha: 1 });
    expect(colord("#33221180").toLab()).toMatchObject({ l: 14.89, a: 5.77, b: 14.41, alpha: 0.5 });
    expect(colord("#d53987").toLab()).toMatchObject({ l: 50.48, a: 65.85, b: -7.51, alpha: 1 });
  });
});

describe("lch", () => {
  extend([lchPlugin]);

  it("Parses CIE LCH color object", () => {
    // http://colormine.org/convert/rgb-to-lch
    // https://css.land/lch/
    // https://drafts.csswg.org/css-color-5/#relative-LCH
    expect(colord({ l: 0, c: 0, h: 0, a: 0 }).toHex()).toBe("#00000000");
    expect(colord({ l: 100, c: 0, h: 0 }).toHex()).toBe("#ffffff");
    expect(colord({ l: 42.37, c: 0, h: 0 }).toHex()).toBe("#646464");
    expect(colord({ l: 48.25, c: 30.07, h: 196.38 }).toHex()).toBe("#008080");
    expect(colord({ l: 51.87, c: 58.13, h: 102.85 }).toHex()).toBe("#808000");
    expect(colord({ l: 21.85, c: 31.95, h: 127.77 }).toHex()).toBe("#213b0b");
  });

  it("Parses CIE LCH color string", () => {
    expect(colord("lch(0% 0 0 / 0)").toHex()).toBe("#00000000");
    expect(colord("lch(100% 0 0)").toHex()).toBe("#ffffff");
    expect(colord("lch(42.37, 0, 0, 0.5").toHex()).toBe("#64646480");
    expect(colord("lch(51.87% 58.13 102.85 / 50%").toHex()).toBe("#80800080");
    expect(colord("  lch(   48.25   30.07,196.38   /    0.5000").toHex()).toBe("#00808080");
  });

  it("Converts a color to CIE LCH object", () => {
    // http://colormine.org/convert/rgb-to-lch
    expect(colord("#00000080").toLch()).toMatchObject({ l: 0, c: 0, h: 0, a: 0.5 });
    expect(colord("#ffffff").toLch()).toMatchObject({ l: 100, c: 0, h: 0 });
    expect(colord("#008080").toLch()).toMatchObject({ l: 48.25, c: 30.07, h: 196.38 });
    expect(colord("#808000").toLch()).toMatchObject({ l: 51.87, c: 58.13, h: 102.85 });
    expect(colord("#213b0b").toLch()).toMatchObject({ l: 21.85, c: 31.95, h: 127.77 });
    expect(colord("#646464").toLch()).toMatchObject({ l: 42.37, c: 0, h: 158.2 });
  });

  it("Converts a color to CIE LCH string (CSS functional notation)", () => {
    expect(colord("#00000080").toLchString()).toBe("lch(0% 0 0 / 0.5)");
    expect(colord("#ffffff").toLchString()).toBe("lch(100% 0 0)");
    expect(colord("#00808000").toLchString()).toBe("lch(48.25% 30.07 196.38 / 0)");
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
    expect(colord({ x: 50, y: 50, z: 50 }).toHex()).toBe("#ccb7b4");
    expect(colord({ x: 95.047, y: 100, z: 108.883, a: 1 }).toHex()).toBe("#ffffff");
  });

  it("Converts a color to CIE XYZ object", () => {
    // https://www.easyrgb.com/en/convert.php
    expect(colord("#ffffff").toXyz()).toMatchObject({ x: 95.047, y: 100, z: 108.883, a: 1 });
    expect(colord("#5cbf54").toXyz()).toMatchObject({ x: 24.643, y: 40.175, z: 14.842, a: 1 });
    expect(colord("#00000000").toXyz()).toMatchObject({ x: 0, y: 0, z: 0, a: 0 });
  });
});
