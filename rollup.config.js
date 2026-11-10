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

// The package has no `"type": "module"`, so TypeScript reads `plugins/<name>.d.ts` as CommonJS,
// and under `node16`/`nodenext` an ES module's default import of a plugin gets the module
// namespace instead of the plugin (#101). This emits `plugins/<name>.d.mts` with a real default
// export for the `import` condition. It re-exports `<name>.d.ts`, which keeps the `Colord`
// augmentation and named types like `HarmonyType` in one place.
const emitEsmTypes = (name) => ({
  name: "emit-esm-types",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: `${name}.d.mts`,
      source: `export * from "./${name}.js";
import type { Plugin } from "../extend.js";
declare const plugin: Plugin;
export default plugin;
`,
    });
  },
});

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
      file: "dist/index.js",
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
    plugins: [
      ...getRollupPluginsConfig({ declaration: false }),
      emitEsmTypes(path.parse(input).name),
    ],
  })),

  // Bundle all library plugins as CommonJS modules
  ...colordPluginPaths.map((input) => ({
    input,
    output: {
      file: `dist/plugins/${path.parse(input).name}.js`,
      format: "cjs",
      exports: "default",
    },
    plugins: getRollupPluginsConfig({ declaration: false }),
  })),
];
