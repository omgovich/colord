import fs from "fs";
import path from "path";
import glob from "glob";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

// NodeNext needs declarations matching the module format of each export condition.
const toEsmDeclaration = (source) =>
  source.replace(/(from\s+|declare module\s+)(["'])(\.{1,2}\/[^"']+)(["'])/g, "$1$2$3.mjs$4");

const toCjsDeclaration = (source, declaration) => {
  if (path.basename(path.dirname(declaration)) !== "plugins") return source;

  let cjsSource = source.replace("export default", "export =");
  const harmonyType = cjsSource.match(/export declare type HarmonyType = ([^;]+);/);
  if (harmonyType) {
    // An export assignment cannot coexist with HarmonyType's named export.
    cjsSource = cjsSource
      .replace(harmonyType[0], "")
      .replace("type?: HarmonyType", "type?: harmoniesPlugin.HarmonyType")
      .replace(
        "declare const harmoniesPlugin: Plugin;",
        `declare const harmoniesPlugin: Plugin;\ndeclare namespace harmoniesPlugin {\n    type HarmonyType = ${harmonyType[1]};\n}`,
      );
  }
  return cjsSource;
};

const copyDeclarations = () => ({
  name: "format-specific-declarations",
  closeBundle() {
    for (const declaration of glob.sync("./dist/**/*.d.ts")) {
      const source = fs.readFileSync(declaration, "utf8");
      const cjsSource = toCjsDeclaration(source, declaration);
      fs.writeFileSync(declaration.replace(/\.d\.ts$/, ".d.mts"), toEsmDeclaration(source));
      fs.writeFileSync(declaration.replace(/\.d\.ts$/, ".d.cts"), cjsSource);
    }
  },
});

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
    ...(compilerOptions.declaration ? [copyDeclarations()] : []),
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
    plugins: getRollupPluginsConfig({ declaration: false }),
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
