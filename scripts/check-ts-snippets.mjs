#!/usr/bin/env node
/**
 * The checks behind The Switch's snippets (ts/the-switch/).
 *
 * 1. Every TypeScript lesson file and test is type-checked with the options in
 *    ts/the-switch/tsconfig.json, and `strict` must be on. No errors allowed.
 * 2. Every file in ts/the-switch/errors/ is meant to FAIL. It names the error
 *    code it expects, the compiler's message, and the line that fails (the one
 *    ending in `// @error`). Each is compiled on its own, and the compiler must
 *    report exactly that code, on exactly that line, with exactly that message.
 *    If a TypeScript upgrade changes any of them, a lesson that says "this
 *    line is an error" would be saying something false, so this fails.
 * 3. Every JavaScript file parses and runs. A file that is meant to crash says
 *    which error it ends with, in a `// expect-throw: TypeError` line.
 * 4. A .ts file runs under Node's built-in type stripping, which lesson 1
 *    teaches.
 * 5. Every file in ts/the-switch/jsdoc/ is JavaScript with JSDoc types, checked
 *    as JavaScript (allowJs and checkJs, with strict on), which lesson 10
 *    teaches. A file with the expect-error headers must fail exactly as it
 *    says. Every other file must be clean, and must also run.
 *
 * It uses the TypeScript compiler's own API rather than the `tsc` command, so
 * one run checks every file and reports error codes as data.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "ts", "the-switch");
const rel = (file) => relative(root, file).replaceAll("\\", "/");

const failures = [];
const fail = (where, what) => failures.push(`  ${where}\n      ${what}`);
const flat = (message) => ts.flattenDiagnosticMessageText(message, " ").replace(/\s+/g, " ");

// --- the options -------------------------------------------------------------

const configPath = join(dir, "tsconfig.json");
const read = ts.readConfigFile(configPath, ts.sys.readFile);
if (read.error) {
  console.error(flat(read.error.messageText));
  process.exit(1);
}
const converted = ts.convertCompilerOptionsFromJson(read.config.compilerOptions, dir);
if (converted.errors.length) {
  console.error(converted.errors.map((d) => flat(d.messageText)).join("\n"));
  process.exit(1);
}
// skipLibCheck keeps the check about our files, not the typings of Vitest.
const options = { ...converted.options, skipLibCheck: true };
if (options.strict !== true) fail(rel(configPath), "compilerOptions.strict must be true");

const lineOf = (d) => (d.file ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : 0);
const describe = (d) => `${rel(d.file?.fileName ?? "(no file)")}:${lineOf(d)}  TS${d.code}: ${flat(d.messageText)}`;

function diagnose(files) {
  const program = ts.createProgram(files, options);
  return ts.getPreEmitDiagnostics(program);
}

// --- 1. the lesson files and their tests --------------------------------------

const lessonFiles = readdirSync(dir)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(dir, f));

const lessonDiagnostics = diagnose(lessonFiles);
for (const d of lessonDiagnostics) fail("type error in a lesson file", describe(d));

// --- 2. the snippets that must fail --------------------------------------------

const errorsDir = join(dir, "errors");
const errorFiles = readdirSync(errorsDir)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => join(errorsDir, f));

for (const file of errorFiles) {
  const where = rel(file);
  const source = readFileSync(file, "utf8");
  const code = /^\/\/ expect-error: TS(\d+)\s*$/m.exec(source)?.[1];
  const message = /^\/\/ expect-message: (.+?)\s*$/m.exec(source)?.[1];
  const marked = source
    .split(/\r?\n/)
    .map((line, i) => (/\/\/ @error\s*$/.test(line) ? i + 1 : 0))
    .filter(Boolean);

  if (!code) fail(where, 'missing the header "// expect-error: TSxxxx"');
  if (!message) fail(where, 'missing the header "// expect-message: ..."');
  if (marked.length !== 1) fail(where, `needs exactly one line ending in "// @error", has ${marked.length}`);
  if (!code) continue;

  const found = diagnose([file]);
  const codes = [...new Set(found.map((d) => d.code))];

  if (found.length === 0) {
    fail(where, `expected TS${code}, but the file compiles cleanly`);
    continue;
  }
  if (codes.length !== 1 || codes[0] !== Number(code)) {
    fail(where, `expected exactly TS${code}, got ${codes.map((c) => `TS${c}`).join(", ")}\n      ${found.map(describe).join("\n      ")}`);
    continue;
  }
  if (message && flat(found[0].messageText) !== message) {
    fail(where, `the message changed.\n      expected: ${message}\n      got:      ${flat(found[0].messageText)}`);
  }
  if (marked.length === 1 && found.some((d) => lineOf(d) !== marked[0])) {
    fail(where, `the error is on line ${found.map(lineOf).join(", ")}, but the "// @error" mark is on line ${marked[0]}`);
  }
}

// --- 3. the JavaScript files ----------------------------------------------------

const jsDir = join(dir, "js");
const jsFiles = readdirSync(jsDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => join(jsDir, f));

for (const file of jsFiles) {
  const where = rel(file);
  const syntax = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  if (syntax.status !== 0) {
    fail(where, `does not parse:\n${syntax.stderr}`);
    continue;
  }

  const expected = /^\/\/ expect-throw: (\w+)\s*$/m.exec(readFileSync(file, "utf8"))?.[1];
  const run = spawnSync(process.execPath, [file], { encoding: "utf8", cwd: jsDir });
  if (expected) {
    if (run.status === 0) fail(where, `expected it to end with a ${expected}, but it ran cleanly`);
    else if (!run.stderr.includes(expected)) fail(where, `expected a ${expected}, got:\n${run.stderr}`);
  } else if (run.status !== 0) {
    fail(where, `crashed:\n${run.stderr}`);
  }
}

// --- 4. Node's type stripping ----------------------------------------------------

const strip = join(dir, "lesson1-setup.ts");
const stripped = spawnSync(process.execPath, ["--experimental-strip-types", "--no-warnings", strip], {
  encoding: "utf8",
  cwd: dir,
});
if (stripped.status !== 0) fail(rel(strip), `does not run under Node's type stripping:\n${stripped.stderr}`);
else if (stripped.stdout.trim() !== "HELLO, TYPESCRIPT!") {
  fail(rel(strip), `printed ${JSON.stringify(stripped.stdout.trim())} under type stripping`);
}

// --- 5. JavaScript with JSDoc types ----------------------------------------------

const jsdocDir = join(dir, "jsdoc");
const jsdocFiles = readdirSync(jsdocDir)
  .filter((f) => f.endsWith(".js"))
  .map((f) => join(jsdocDir, f));
const jsdocOptions = { ...options, allowJs: true, checkJs: true };

for (const file of jsdocFiles) {
  const where = rel(file);
  const source = readFileSync(file, "utf8");
  const code = /^\/\/ expect-error: TS(\d+)\s*$/m.exec(source)?.[1];
  const message = /^\/\/ expect-message: (.+?)\s*$/m.exec(source)?.[1];
  const found = ts.getPreEmitDiagnostics(ts.createProgram([file], jsdocOptions));

  if (!code) {
    for (const d of found) fail(where, `JSDoc file has a type error: ${describe(d)}`);
    const run = spawnSync(process.execPath, [file], { encoding: "utf8", cwd: jsdocDir });
    if (run.status !== 0) fail(where, `crashed:
${run.stderr}`);
    continue;
  }

  const marked = source
    .split(/\r?\n/)
    .map((line, i) => (/\/\/ @error\s*$/.test(line) ? i + 1 : 0))
    .filter(Boolean);
  const codes = [...new Set(found.map((d) => d.code))];
  if (found.length === 0) fail(where, `expected TS${code}, but the file checks cleanly`);
  else if (codes.length !== 1 || codes[0] !== Number(code)) {
    fail(where, `expected exactly TS${code}, got ${codes.map((c) => `TS${c}`).join(", ")}`);
  } else {
    if (message && flat(found[0].messageText) !== message) {
      fail(where, `the message changed.
      expected: ${message}
      got:      ${flat(found[0].messageText)}`);
    }
    if (marked.length !== 1 || found.some((d) => lineOf(d) !== marked[0])) {
      fail(where, `the error must be on the one line ending in "// @error"`);
    }
  }
}

// --- report -------------------------------------------------------------------------

if (failures.length) {
  console.error(`The Switch snippets: ${failures.length} problem(s).\n\n${failures.join("\n\n")}`);
  process.exit(1);
}

console.log(
  `The Switch snippets: ${lessonFiles.length} TypeScript files strict-clean, ` +
    `${errorFiles.length} expected errors confirmed (code, line and message), ` +
    `${jsFiles.length} JavaScript files parse and run, ${jsdocFiles.length} JSDoc files checked as JavaScript, type stripping runs.`,
);
