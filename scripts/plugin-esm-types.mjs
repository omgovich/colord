// Writes an ESM type entry (`dist/plugins/<name>.d.mts`) next to every plugin declaration.
//
// The package has no `"type": "module"`, so TypeScript reads `plugins/<name>.d.ts` as CommonJS.
// Under `node16`/`nodenext`, a default import of a plugin from an ES module then gets the module
// namespace instead of the plugin, and `extend([plugin])` fails to type-check (#101). The wrapper
// gives ES modules a real default export and re-exports `<name>.d.ts`, which keeps the `Colord`
// augmentation and named types like `HarmonyType` in one place.
import { readdirSync, writeFileSync } from "fs";
import path from "path";

for (const file of readdirSync("src/plugins")) {
  const name = path.basename(file, ".ts");
  writeFileSync(
    `dist/plugins/${name}.d.mts`,
    `export * from "./${name}.js";\n` +
      `import type { Plugin } from "../extend.js";\n` +
      `declare const plugin: Plugin;\n` +
      `export default plugin;\n`
  );
}
