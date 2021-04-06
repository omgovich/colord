import { colord, extend } from "../src/";
import a11yPlugin from "../src/plugins/a11y";
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
});

describe("xyz", () => {
  extend([xyzPlugin]);

  it("Parses XYZ color object", () => {
    // https://www.nixsensor.com/free-color-converter/
    expect(colord({ x: 0, y: 0, z: 0 }).toHex()).toBe("#000000");
    expect(colord({ x: 50, y: 50, z: 50 }).toHex()).toBe("#ccb7b4");
    expect(colord({ x: 95.047, y: 100, z: 108.883, a: 1 }).toHex()).toBe("#ffffff");
  });

  it("Converts a color to CIE XYZ name", () => {
    // https://www.easyrgb.com/en/convert.php
    expect(colord("#ffffff").toXyz()).toMatchObject({ x: 95.047, y: 100, z: 108.883, a: 1 });
    expect(colord("#5cbf54").toXyz()).toMatchObject({ x: 24.643, y: 40.175, z: 14.842, a: 1 });
    expect(colord("#00000000").toXyz()).toMatchObject({ x: 0, y: 0, z: 0, a: 0 });
  });
});
