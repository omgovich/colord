// Writes an ESM type entry (`dist/plugins/<name>.d.mts`) next to every plugin declaration.
//
// The package has no `"type": "module"`, so TypeScript reads `plugins/<name>.d.ts` as a
// CommonJS declaration. Under `moduleResolution: node16`/`nodenext`, a default import of a
// plugin from an ES module then resolves to the module namespace instead of the plugin, and
// `extend([plugin])` fails to type-check (#101). The `.d.mts` wrapper gives ES modules a
// declaration with a real default export, while reusing `<name>.d.ts` so the `Colord` module
// augmentation stays in one place. `package.json` routes the `import` condition to it.
import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "src", "plugins");
const distDir = path.join(root, "dist", "plugins");

const fail = (message) => {
  console.error(`plugin-esm-types: ${message}`);
  process.exit(1);
};

const plugins = readdirSync(srcDir)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => path.basename(file, ".ts"));

if (!plugins.length) fail(`no plugins found in ${srcDir}`);

for (const name of plugins) {
  const dtsPath = path.join(distDir, `${name}.d.ts`);
  let dts;
  try {
    dts = readFileSync(dtsPath, "utf8");
  } catch {
    fail(`missing ${path.relative(root, dtsPath)}, run the build first`);
  }

  // Expect exactly the shape every plugin has today: `declare const x: Plugin; export default x;`
  const defaultExports = [...dts.matchAll(/^export default (\w+);$/gm)];
  if (defaultExports.length !== 1) fail(`${name}.d.ts: expected one \`export default <name>;\``);
  const pluginName = defaultExports[0][1];
  if (!new RegExp(`^declare const ${pluginName}: Plugin;$`, "m").test(dts)) {
    fail(`${name}.d.ts: expected \`declare const ${pluginName}: Plugin;\``);
  }

  // Forward the named types a plugin exports (e.g. `HarmonyType`)
  const namedTypes = [...dts.matchAll(/^export (?:declare )?(?:type|interface) (\w+)/gm)].map(
    (match) => match[1]
  );
  const otherExports = dts
    .split("\n")
    .filter(
      (line) =>
        line.startsWith("export ") && !/^export (default |(declare )?(type|interface) )/.test(line)
    );
  if (otherExports.length) fail(`${name}.d.ts: unexpected export \`${otherExports[0]}\``);

  const lines = [
    `import "./${name}.js";`,
    `import type { Plugin } from "../extend.js";`,
    namedTypes.length ? `export type { ${namedTypes.join(", ")} } from "./${name}.js";` : "",
    `declare const ${pluginName}: Plugin;`,
    `export default ${pluginName};`,
    "",
  ].filter((line, index, all) => line !== "" || index === all.length - 1);

  writeFileSync(path.join(distDir, `${name}.d.mts`), lines.join("\n"));
}

console.log(`plugin-esm-types: wrote ${plugins.length} ESM type entries`);
