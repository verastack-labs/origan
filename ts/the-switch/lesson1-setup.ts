// Lesson 1: Setting up. The page text is
// src/content/learn/js-to-ts/setting-up.mdx.
//
// The TypeScript side. This file is also run by Node's built-in type stripping
// (`node lesson1-setup.ts`), which scripts/check-ts-snippets.mjs does, so it
// sticks to the syntax that stripping understands.

// region: hello
function shout(message: string): string {
  return message.toUpperCase() + "!";
}

console.log(shout("hello, typescript"));
// endregion

// region: describe
function describe(name: string, age: number): string {
  return name + " is " + age + " years old";
}

describe("Asha", 21); // "Asha is 21 years old"
// endregion

// region: average
function average(a: number, b: number): number {
  return (a + b) / 2;
}

average(4, 6); // 5
// endregion

// region: is-even
function isEven(n: number): boolean {
  return n % 2 === 0;
}

isEven(4); // true
// endregion

export { shout, describe, average, isEven };
