import path from "path";
import glob from "glob";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

const getRollupPluginsConfig = (compilerOptions) => {
  return [
    typescript({
      tsconfigOverride: { compilerOptions },
    }),
    terser({
      ecma: 5,
      module: true,
      toplevel: true,
      compress: { pure_getters: true },
      format: { wrap_func_args: false },
    }),
  ];
};

// Find available plugins
const colordPluginPaths = glob.sync("./src/plugins/*.ts");

// Bundle both formats according to NodeJS guide
// https://nodejs.org/api/packages.html#packages_approach_2_isolate_state
export default [
  // Build the main bundle in both ESM and CJS modules
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.mjs",
      format: "es",
    },
    plugins: getRollupPluginsConfig({ declaration: true }),
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs",
      format: "cjs",
    },
    plugins: getRollupPluginsConfig({ declaration: false }),
  },

  // Bundle all library plugins as ESM modules
  ...colordPluginPaths.map((input) => ({
    input,
    output: {
      file: `dist/plugins/${path.parse(input).name}.mjs`,
      format: "es",
    },
    plugins: getRollupPluginsConfig({ declaration: false }),
  })),

  // Bundle all library plugins as CommonJS modules
  ...colordPluginPaths.map((input) => ({
    input,
    output: {
      file: `dist/plugins/${path.parse(input).name}.cjs`,
      format: "cjs",
      exports: "default",
    },
    plugins: getRollupPluginsConfig({ declaration: false }),
  })),
];
