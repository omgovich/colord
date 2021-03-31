/* eslint-disable @typescript-eslint/ban-ts-comment */
import b from "benny";
import { colord } from "../src";
// @ts-ignore
import tinycolor2 from "tinycolor2";
// @ts-ignore
import color from "color";

b.suite(
  "Parse HEX and convert to HSL object",

  b.add("colord", () => {
    colord("#808080").toHsla();
  }),

  b.add("tinycolor2", () => {
    // @ts-ignore
    tinycolor2("#808080").toHsl();
  }),

  b.add("color", () => {
    // @ts-ignore
    color("#808080").hsl().object();
  }),

  b.cycle(),
  b.complete()
);
