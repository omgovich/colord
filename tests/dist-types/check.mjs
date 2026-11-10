// Checks the built package's types the way users get them: packs `dist/`, installs it into
// a temporary app and compiles `consumer.ts` with each module resolution mode. Some modes
// also run the compiled file, so types that compile but crash at runtime fail too.
//
// Run with `npm run check-dist-types` (it builds first).
import { execFileSync } from "child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";

const tsc5 = path.resolve("node_modules/typescript-5/bin/tsc");
const tsc4 = path.resolve("node_modules/typescript/bin/tsc");
const commonFlags = "--strict --skipLibCheck false --target es2019";

// [name, compiler, file, flags, run the output?]
// prettier-ignore
const modes = [
  ["node16, ES module", tsc5, "consumer.mts", "--module node16 --moduleResolution node16", true],
  ["node16, CommonJS", tsc5, "consumer.cts", "--module node16 --moduleResolution node16 --esModuleInterop", true],
  ["nodenext, ES module", tsc5, "consumer.mts", "--module nodenext --moduleResolution nodenext"],
  ["bundler", tsc5, "consumer.ts", "--module esnext --moduleResolution bundler"],
  ["node, CommonJS", tsc5, "consumer.ts", "--module commonjs --moduleResolution node --esModuleInterop"],
  ["node, ES module", tsc5, "consumer.mts", "--module esnext --moduleResolution node"],
  ["node, TypeScript 4.2", tsc4, "consumer.ts", "--module commonjs --moduleResolution node --esModuleInterop"],
];

const exec = (command, args, cwd) => execFileSync(command, args, { cwd, encoding: "utf8" });

const consumer = readFileSync("tests/dist-types/consumer.ts", "utf8");
for (const file of readdirSync("src/plugins")) {
  const plugin = path.basename(file, ".ts");
  if (!consumer.includes(`"colord/plugins/${plugin}"`)) {
    console.error(`Add the ${plugin} plugin to tests/dist-types/consumer.ts`);
    process.exit(1);
  }
}

const temp = mkdtempSync(path.join(tmpdir(), "colord-"));
const app = path.join(temp, "app");
let failed = false;

try {
  // `npm run release` publishes `dist/` with the root package.json copied in
  const pkg = path.join(temp, "package");
  cpSync("dist", pkg, { recursive: true });
  cpSync("package.json", path.join(pkg, "package.json"));
  const [{ filename }] = JSON.parse(exec("npm", ["pack", "--json"], pkg));

  const installed = path.join(app, "node_modules/colord");
  mkdirSync(installed, { recursive: true });
  exec("tar", ["-xzf", path.join(pkg, filename), "-C", installed, "--strip-components=1"]);

  for (const ext of ["ts", "mts", "cts"]) {
    cpSync("tests/dist-types/consumer.ts", path.join(app, `consumer.${ext}`));
  }

  for (const [name, tsc, file, flags, run] of modes) {
    const args = [file, ...`${commonFlags} ${flags}`.split(" ")];
    if (!run) args.push("--noEmit");

    try {
      exec("node", [tsc, ...args], app);
      if (run) {
        const output = file.replace(/ts$/, "js");
        const printed = exec("node", [output], app).trim();
        if (printed !== "red") throw new Error(`${output} printed "${printed}" instead of "red"`);
      }
      console.log(`✓ ${name}`);
    } catch (error) {
      failed = true;
      console.error(`✗ ${name}\n${error.stdout || error.message}`);
    }
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

if (failed) process.exit(1);
