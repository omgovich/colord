/* eslint-disable @typescript-eslint/ban-ts-comment */
import b from "benny";
import { appendFileSync } from "fs";
import { colord } from "../src";
// @ts-ignore
import tinycolor2 from "tinycolor2";
// @ts-ignore
import color from "color";
// @ts-ignore
import chroma from "chroma-js";
// @ts-ignore
import AcColor from "ac-colors";

// benny only exposes its Summary type through `lib/internal`, which is not public API and
// is free to move between versions. Reading it off `suite()` keeps us on the public
// surface. (`Awaited` would say this in one line, but the repo is on TypeScript 4.2.)
type Resolved<T> = T extends Promise<infer U> ? U : never;
type Summary = Resolved<ReturnType<typeof b.suite>>;

/**
 * How much faster colord must stay than its fastest rival in each suite.
 *
 * Absolute ops/sec are useless as a baseline on shared CI runners (±10-30% between
 * runs), so we watch the ratio instead: every library is measured on the same machine
 * in the same run, which cancels most of the noise out. The ratio still drifts with
 * hardware and V8 version, so these floors are calibrated on the pinned runner from
 * .github/workflows/benchmark.yml with generous headroom — they exist to catch a real
 * regression, not to police single-digit percentages.
 */
const MIN_SPEEDUP: Record<string, number> = {
  "Parse HEX and convert to HSLA object/array": 2.2,
  "Lighten, saturate, set alpha and convert to RGBA object": 1.9,
  "Parse RGBA object and convert to HEX string": 1.7,
};

const suites = [
  () =>
    b.suite(
      "Parse HEX and convert to HSLA object/array",

      b.add("colord", () => {
        colord("#808080").toHsl();
      }),

      b.add("color", () => {
        // @ts-ignore
        color("#808080").hsl().object();
      }),

      b.add("tinycolor2", () => {
        // @ts-ignore
        tinycolor2("#808080").toHsl();
      }),

      b.add("ac-colors", () => {
        // @ts-ignore
        new AcColor({ color: "#808080", type: "hex" }).hsl;
      }),

      b.add("chroma-js", () => {
        // @ts-ignore
        chroma("#808080").hsl();
      }),

      b.cycle(),
      b.complete()
    ),

  // ac-colors is a pure converter — it ships no manipulation methods at all, so it
  // cannot take part in this suite.
  // The libraries disagree on what the arguments mean (tinycolor2 takes percents,
  // chroma-js brightens in Lab), so the outputs differ. That is fine here: the suite
  // exists to give colord's manipulation math a stable denominator to be measured
  // against, not to claim the operations are equivalent.
  () =>
    b.suite(
      "Lighten, saturate, set alpha and convert to RGBA object",

      b.add("colord", () => {
        colord("#808080").lighten(0.1).saturate(0.1).alpha(0.5).toRgb();
      }),

      b.add("color", () => {
        // @ts-ignore
        color("#808080").lighten(0.1).saturate(0.1).alpha(0.5).rgb().object();
      }),

      b.add("tinycolor2", () => {
        // @ts-ignore
        tinycolor2("#808080").lighten(10).saturate(10).setAlpha(0.5).toRgb();
      }),

      b.add("chroma-js", () => {
        // @ts-ignore
        chroma("#808080").brighten(0.1).saturate(0.1).alpha(0.5).rgb();
      }),

      b.cycle(),
      b.complete()
    ),

  () =>
    b.suite(
      "Parse RGBA object and convert to HEX string",

      b.add("colord", () => {
        colord({ r: 128, g: 128, b: 128 }).toHex();
      }),

      b.add("color", () => {
        // @ts-ignore
        color({ r: 128, g: 128, b: 128 }).hex();
      }),

      b.add("tinycolor2", () => {
        // @ts-ignore
        tinycolor2({ r: 128, g: 128, b: 128 }).toHexString();
      }),

      b.add("ac-colors", () => {
        // @ts-ignore
        new AcColor({ color: [128, 128, 128], type: "rgb" }).hex;
      }),

      b.add("chroma-js", () => {
        // @ts-ignore
        chroma({ r: 128, g: 128, b: 128 }).hex();
      }),

      b.cycle(),
      b.complete()
    ),
];

type Verdict = {
  suite: string;
  colordOps: number;
  speedup: number;
  floor: number;
  rival: string;
  passed: boolean;
};

const format = (ops: number) => ops.toLocaleString("en-US");

const verdictOf = (summary: Summary): Verdict => {
  const colordResult = summary.results.find((result) => result.name === "colord");
  if (!colordResult) throw new Error(`No "colord" case in the "${summary.name}" suite`);

  const rivals = summary.results.filter((result) => result.name !== "colord");
  const rival = rivals.reduce((best, result) => (result.ops > best.ops ? result : best));

  const floor = MIN_SPEEDUP[summary.name];
  if (floor === undefined) throw new Error(`No MIN_SPEEDUP entry for the "${summary.name}" suite`);

  const speedup = colordResult.ops / rival.ops;
  return {
    suite: summary.name,
    colordOps: colordResult.ops,
    speedup,
    floor,
    rival: rival.name,
    passed: speedup >= floor,
  };
};

// Both the column and the headline have to name the direction, not assume it: the run
// that matters most is the one where a rival has overtaken colord.
const relativeTo = (ratio: number) =>
  ratio >= 1 ? `${ratio.toFixed(2)}x slower` : `${(1 / ratio).toFixed(2)}x faster`;

const report = (summary: Summary, verdict: Verdict) => {
  const sorted = [...summary.results].sort((a, b) => b.ops - a.ops);
  const rows = sorted.map((result) => {
    const isColord = result.name === "colord";
    const name = isColord ? "**colord 👑**" : result.name;
    const ops = isColord ? `**${format(result.ops)}**` : format(result.ops);
    const relative = isColord ? "—" : relativeTo(verdict.colordOps / result.ops);
    return `| ${name} | ${ops} | ±${result.margin.toFixed(2)}% | ${relative} |`;
  });

  const headline =
    verdict.speedup >= 1
      ? `**${verdict.speedup.toFixed(2)}x** faster than the fastest rival (${verdict.rival})`
      : `**${(1 / verdict.speedup).toFixed(2)}x** slower than ${verdict.rival}`;

  return [
    `### ${summary.name}`,
    "",
    "| Library | Operations/sec | Margin | vs colord |",
    "| ------- | -------------- | ------ | --------- |",
    ...rows,
    "",
    `${verdict.passed ? "✅" : "❌"} ${headline}; floor is **${verdict.floor.toFixed(2)}x**.`,
    "",
  ].join("\n");
};

const main = async () => {
  const summaries: Summary[] = [];
  for (const suite of suites) summaries.push(await suite());

  const verdicts = summaries.map(verdictOf);
  const markdown = summaries.map((summary, i) => report(summary, verdicts[i])).join("\n");

  console.log(`\n${markdown}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }

  const failed = verdicts.filter((verdict) => !verdict.passed);
  if (failed.length > 0) {
    for (const verdict of failed) {
      console.error(
        `Performance regression in "${verdict.suite}": colord runs at ` +
          `${verdict.speedup.toFixed(2)}x the speed of ${verdict.rival}, ` +
          `expected at least ${verdict.floor.toFixed(2)}x.`
      );
    }
    process.exitCode = 1;
  }
};

main();
