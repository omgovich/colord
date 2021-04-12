/* eslint-disable @typescript-eslint/ban-ts-comment */
import b from "benny";
import { colord } from "../src";
// @ts-ignore
import tinycolor2 from "tinycolor2";
// @ts-ignore
import color from "color";
// @ts-ignore
import chroma from "chroma-js";
// @ts-ignore
import AcColor from "ac-colors";

b.suite(
  "Parse HEX and convert to HSLA object/array",

  b.add("colord", () => {
    colord("#808080").toHsl();
  }),

  b.add("color", () => {
    // @ts-ignore
    color("#808080").hsl().object();
  }),

  b.add("tinycolor2", () => {
    // @ts-ignore
    tinycolor2("#808080").toHsl();
  }),

  b.add("ac-colors", () => {
    // @ts-ignore
    new AcColor({ color: "#808080", type: "hex" }).hsl;
  }),

  b.add("chroma-js", () => {
    // @ts-ignore
    chroma("#808080").hsl();
  }),

  b.cycle(),
  b.complete()
);
