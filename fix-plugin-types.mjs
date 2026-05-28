#!/usr/bin/env node
/* eslint-env node */
/**
 * Post-build script to fix plugin .d.ts files for Node16/NodeNext module resolution.
 * Converts `export default function` to `declare function` + `export =`
 */

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginsDir = join(__dirname, "dist", "plugins");
const pluginFiles = readdirSync(pluginsDir).filter((f) => f.endsWith(".d.ts"));

for (const file of pluginFiles) {
  const filePath = join(pluginsDir, file);
  let content = readFileSync(filePath, "utf-8");

  // Normalize line endings to LF
  content = content.replace(/\r\n/g, "\n");

  // Replace "export default function name" with "declare function name" + "export ="
  content = content.replace(
    /export default function (\w+)(\([^)]*\):\s*void);/g,
    "declare function $1$2;\nexport = $1;"
  );

  // Remove empty export statements
  content = content.replace(/\nexport \{\};\n/g, "\n");
  content = content.replace(/\nexport \{\};$/g, "");
  content = content.replace(/^export \{\};\n/g, "");

  // Remove trailing blank lines and ensure single newline at end
  content = content.replace(/\n+$/g, "\n");

  writeFileSync(filePath, content);
  console.log("Fixed " + file);
}

console.log("All plugin types fixed for Node16/NodeNext module resolution.");
