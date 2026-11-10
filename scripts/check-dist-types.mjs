// Type-checks a consumer project against the packed `dist/`, the way users install colord.
//
// `tsc --noEmit` on the repo only checks our sources. This script packs `dist/` with the
// published `package.json`, installs the tarball into a throwaway project and compiles code
// that imports the core and every plugin under each module resolution mode TypeScript users
// run. `skipLibCheck` is off, so broken declarations fail here too. ES module and CommonJS
// builds are also run with Node to catch types that compile but crash.
import { execFileSync } from "child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tsc5 = path.join(root, "node_modules", "typescript-5", "bin", "tsc");
const tsc4 = path.join(root, "node_modules", "typescript", "bin", "tsc");

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: "pipe" });

const work = mkdtempSync(path.join(tmpdir(), "colord-dist-types-"));
let failed = false;

try {
  // Pack exactly what `npm run release` publishes: `dist/` plus the root `package.json`
  const stage = path.join(work, "stage");
  cpSync(path.join(root, "dist"), stage, { recursive: true });
  cpSync(path.join(root, "package.json"), path.join(stage, "package.json"));
  const [{ filename }] = JSON.parse(
    run("npm", ["pack", "--json", "--pack-destination", work], stage)
  );

  const app = path.join(work, "app");
  const installed = path.join(app, "node_modules", "colord");
  mkdirSync(installed, { recursive: true });
  run("tar", ["-xzf", path.join(work, filename), "-C", installed, "--strip-components=1"], app);

  // One call per plugin method proves the `Colord` augmentation is visible
  const methods = {
    a11y: `c.isReadable("#fff")`,
    cmyk: `c.toCmyk()`,
    harmonies: `c.harmonies(harmony)`,
    hwb: `c.toHwb()`,
    lab: `c.toLab()`,
    lch: `c.toLch()`,
    minify: `c.minify()`,
    mix: `c.mix("#fff")`,
    names: `c.toName()`,
    oklab: `c.toOklab()`,
    oklch: `c.toOklch()`,
    xyz: `c.toXyz()`,
  };
  const plugins = readdirSync(path.join(root, "src", "plugins")).map((f) =>
    path.basename(f, ".ts")
  );
  const untested = plugins.filter((name) => !methods[name]);
  if (untested.length) throw new Error(`add a method call for: ${untested.join(", ")}`);

  const source = [
    `import { colord, extend } from "colord";`,
    `import type { HarmonyType } from "colord/plugins/harmonies";`,
    ...plugins.map((name) => `import ${name}Plugin from "colord/plugins/${name}";`),
    `extend([${plugins.map((name) => `${name}Plugin`).join(", ")}]);`,
    `const c = colord("#ff0000");`,
    `const harmony: HarmonyType = "triadic";`,
    `export const results = [${plugins.map((name) => methods[name]).join(", ")}];`,
    `console.log(c.toName(), results.length);`,
    "",
  ].join("\n");
  for (const ext of ["ts", "mts", "cts"]) writeFileSync(path.join(app, `use.${ext}`), source);

  const base = ["--strict", "--skipLibCheck", "false", "--target", "es2019"];
  const cases = [
    {
      name: "node16, ES module",
      tsc: tsc5,
      file: "use.mts",
      args: ["--module", "node16", "--moduleResolution", "node16"],
      run: "use.mjs",
    },
    {
      name: "nodenext, ES module",
      tsc: tsc5,
      file: "use.mts",
      args: ["--module", "nodenext", "--moduleResolution", "nodenext"],
    },
    {
      name: "node16, CommonJS",
      tsc: tsc5,
      file: "use.cts",
      args: ["--module", "node16", "--moduleResolution", "node16", "--esModuleInterop"],
      run: "use.cjs",
    },
    {
      name: "bundler",
      tsc: tsc5,
      file: "use.ts",
      args: ["--module", "esnext", "--moduleResolution", "bundler"],
    },
    {
      name: "node10, CommonJS",
      tsc: tsc5,
      file: "use.ts",
      args: ["--module", "commonjs", "--moduleResolution", "node", "--esModuleInterop"],
    },
    {
      name: "node10, ES module",
      tsc: tsc5,
      file: "use.mts",
      args: ["--module", "esnext", "--moduleResolution", "node"],
    },
    {
      name: "TypeScript 4.2, node",
      tsc: tsc4,
      file: "use.ts",
      args: ["--module", "commonjs", "--moduleResolution", "node", "--esModuleInterop"],
    },
  ];

  for (const testCase of cases) {
    const outDir = path.join(app, "out", testCase.name.replace(/\W+/g, "-"));
    const args = [
      ...base,
      ...testCase.args,
      ...(testCase.run ? ["--outDir", outDir] : ["--noEmit"]),
      testCase.file,
    ];
    try {
      run(process.execPath, [testCase.tsc, ...args], app);
      if (testCase.run) {
        // Emitted files sit next to the installed package, so Node resolves `colord` normally
        const target = path.join(app, testCase.run);
        cpSync(path.join(outDir, testCase.run), target);
        const output = run(process.execPath, [target], app).trim();
        if (output !== `red ${plugins.length}`) throw new Error(`unexpected output: ${output}`);
      }
      console.log(`✓ ${testCase.name}`);
    } catch (error) {
      failed = true;
      console.error(`✗ ${testCase.name}\n${error.stdout || ""}${error.stderr || error.message}`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failed) process.exit(1);
