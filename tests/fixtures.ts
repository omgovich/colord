import { Input } from "../src/types";

interface BasicColor {
  name: string;
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  v: number;
}

// https://en.wikipedia.org/wiki/Web_colors#Basic_colors
export const basicColors: BasicColor[] = [
  { name: "white", hex: "#ffffff", r: 255, g: 255, b: 255, h: 0, s: 0, l: 100, v: 100 },
  { name: "silver", hex: "#c0c0c0", r: 192, g: 192, b: 192, h: 0, s: 0, l: 75, v: 75 },
  { name: "gray", hex: "#808080", r: 128, g: 128, b: 128, h: 0, s: 0, l: 50, v: 50 },
  { name: "black", hex: "#000000", r: 0, g: 0, b: 0, h: 0, s: 0, l: 0, v: 0 },
  { name: "red", hex: "#ff0000", r: 255, g: 0, b: 0, h: 0, s: 100, l: 50, v: 100 },
  { name: "maroon", hex: "#800000", r: 128, g: 0, b: 0, h: 0, s: 100, l: 25, v: 50 },
  { name: "yellow", hex: "#ffff00", r: 255, g: 255, b: 0, h: 60, s: 100, l: 50, v: 100 },
  { name: "olive", hex: "#808000", r: 128, g: 128, b: 0, h: 60, s: 100, l: 25, v: 50 },
  { name: "lime", hex: "#00ff00", r: 0, g: 255, b: 0, h: 120, s: 100, l: 50, v: 100 },
  { name: "green", hex: "#008000", r: 0, g: 128, b: 0, h: 120, s: 100, l: 25, v: 50 },
  { name: "aqua", hex: "#00ffff", r: 0, g: 255, b: 255, h: 180, s: 100, l: 50, v: 100 },
  { name: "teal", hex: "#008080", r: 0, g: 128, b: 128, h: 180, s: 100, l: 25, v: 50 },
  { name: "blue", hex: "#0000ff", r: 0, g: 0, b: 255, h: 240, s: 100, l: 50, v: 100 },
  { name: "navy", hex: "#000080", r: 0, g: 0, b: 128, h: 240, s: 100, l: 25, v: 50 },
  { name: "fuchsia", hex: "#ff00ff", r: 255, g: 0, b: 255, h: 300, s: 100, l: 50, v: 100 },
  { name: "purple", hex: "#800080", r: 128, g: 0, b: 128, h: 300, s: 100, l: 25, v: 50 },
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
  hsvString: "hsv(120, 100%, 100%)",
  hsvStringNoSpacesAndPercent: "hsv(120,100,100)",
  hsva: { h: 120, s: 100, v: 100, a: 1 },
  hsvaString: "hsva(120, 100%, 100%, 1)",
};

// https://hslpicker.com/#6040bf
export const saturationLevels = [
  "#808080",
  "#79738c",
  "#736699",
  "#6c59a6",
  "#664db3",
  "#6040bf",
  "#5933cc",
  "#5326d9",
  "#4d19e6",
  "#460df2",
  "#4000ff",
];
