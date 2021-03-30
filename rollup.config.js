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

export default [
  // Build the main bundle
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: getRollupPluginsConfig({ declaration: true }),
  },

  // Bundle all colord plugins
  ...glob.sync("./src/plugins/*.ts").map((input) => ({
    input,
    output: {
      dir: "dist/plugins",
      format: "es",
    },
    plugins: getRollupPluginsConfig({ declaration: false }),
  })),
];
