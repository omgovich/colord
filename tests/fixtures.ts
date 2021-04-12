import { HslColor, HsvColor, Input, RgbColor } from "../src/types";

interface Fixture {
  hex: string;
  rgb: RgbColor;
  hsl: HslColor;
  hsv: HsvColor;
}

// https://www.w3schools.com/colors/colors_converter.asp
// https://www.rapidtables.com/convert/color/rgb-to-hsv.html
export const fixtures: Fixture[] = [
  {
    hex: "#000000",
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 },
    hsv: { h: 0, s: 0, v: 0 },
  },
  {
    hex: "#ffffff",
    rgb: { r: 255, g: 255, b: 255 },
    hsl: { h: 0, s: 0, l: 100 },
    hsv: { h: 0, s: 0, v: 100 },
  },
  {
    hex: "#ff0000",
    rgb: { r: 255, g: 0, b: 0 },
    hsl: { h: 0, s: 100, l: 50 },
    hsv: { h: 0, s: 100, v: 100 },
  },
  {
    hex: "#ff00ff",
    rgb: { r: 255, g: 0, b: 255 },
    hsl: { h: 300, s: 100, l: 50 },
    hsv: { h: 300, s: 100, v: 100 },
  },
  {
    hex: "#808080",
    rgb: { r: 128, g: 128, b: 128 },
    hsl: { h: 0, s: 0, l: 50 },
    hsv: { h: 0, s: 0, v: 50 },
  },
  {
    hex: "#76a800",
    rgb: { r: 118, g: 168, b: 0 },
    hsl: { h: 78, s: 100, l: 33 },
    hsv: { h: 78, s: 100, v: 66 },
  },
  {
    hex: "#6699cc",
    rgb: { r: 102, g: 153, b: 204 },
    hsl: { h: 210, s: 50, l: 60 },
    hsv: { h: 210, s: 50, v: 80 },
  },
];

interface TestColor {
  [key: string]: Input;
}

export const lime: TestColor = {
  shorthandHex: "#0F0",
  hex: "#00ff00",
  hex4: "#0F0F",
  hex8: "#00ff00ff",
  rgb: { r: 0, g: 255, b: 0 },
  rgbString: "rgb(0, 255, 0)",
  rgbStringNoSpaces: "rgb(0,255,0)",
  rgba: { r: 0, g: 255, b: 0, a: 1 },
  rgbaString: "rgba(0, 255, 0, 1)",
  hsl: { h: 120, s: 100, l: 50 },
  hslString: "hsl(120, 100%, 50%)",
  hslStringNoSpacesAndPercent: "hsl(120,100,50)",
  hsla: { h: 120, s: 100, l: 50, a: 1 },
  hslaString: "hsla(120, 100%, 50%, 1)",
  hsv: { h: 120, s: 100, v: 100 },
  hsva: { h: 120, s: 100, v: 100, a: 1 },
};

export const saturationLevels = [
  "#808080",
  "#79738c",
  "#736699",
  "#6d5aa6",
  "#664db3",
  "#6040bf",
  "#5933cc",
  "#5327d9",
  "#4d19e6",
  "#460df2",
  "#4000ff",
];
