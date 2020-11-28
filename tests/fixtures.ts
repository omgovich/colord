import { Input } from "../src/types";

interface TestColor {
  [key: string]: Input;
}

export const lime: TestColor = {
  shorthandHex: "0F0",
  hex: "00ff00",
  hexString: "#00ff00",
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
