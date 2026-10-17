// Lesson 0: Why switch? The page text is
// src/content/learn/js-to-ts/why-switch.mdx.
//
// The TypeScript side of lesson 0. The snippets that are meant to fail are in
// errors/. What is here compiles under `strict`, and lesson0-why.test.ts runs it.

function demoRuntime() {
  // region: runtime
  type User = { name: string };

  function shout(user: User): string {
    return user.name.toUpperCase();
  }

  // JSON.parse returns `any`, so TypeScript takes our word for the shape.
  const fromServer: User = JSON.parse('{"nam": "Asha"}');
  console.log(shout(fromServer));
  // endregion
}

// region: double
function double(n: number): number {
  return n + n;
}

double(21); // 42
// endregion

// region: area
function area(width: number, height: number): number {
  return width * height;
}

area(5, 4); // 20
// endregion

// region: greet
function greet(name: string): string {
  return "Hello, " + name;
}

greet("Asha"); // "Hello, Asha"
// endregion

export { demoRuntime, double, area, greet };
