import { colord, extend } from "../src/";
import namesPlugin from "../src/plugins/names";
import xyzPlugin from "../src/plugins/xyz";

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
