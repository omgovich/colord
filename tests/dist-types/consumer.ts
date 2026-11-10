// An app that uses the published package. `check.mjs` compiles it with every
// module resolution mode we support, so a broken declaration fails CI.
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import cmykPlugin from "colord/plugins/cmyk";
import harmoniesPlugin from "colord/plugins/harmonies";
import type { HarmonyType } from "colord/plugins/harmonies";
import hwbPlugin from "colord/plugins/hwb";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";
import minifyPlugin from "colord/plugins/minify";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";
import oklabPlugin from "colord/plugins/oklab";
import oklchPlugin from "colord/plugins/oklch";
import xyzPlugin from "colord/plugins/xyz";

extend([
  a11yPlugin,
  cmykPlugin,
  harmoniesPlugin,
  hwbPlugin,
  labPlugin,
  lchPlugin,
  minifyPlugin,
  mixPlugin,
  namesPlugin,
  oklabPlugin,
  oklchPlugin,
  xyzPlugin,
]);

const red = colord("#ff0000");
const harmony: HarmonyType = "triadic";

// A method from each plugin, to check that its types extend `Colord`
export const results = [
  red.isReadable("#fff"),
  red.toCmyk(),
  red.harmonies(harmony),
  red.toHwb(),
  red.toLab(),
  red.toLch(),
  red.minify(),
  red.mix("#fff"),
  red.toName(),
  red.toOklab(),
  red.toOklch(),
  red.toXyz(),
];

console.log(red.toName());
