// expect-error: TS2554
// expect-message: Expected 1-2 arguments, but got 3.
// region: code
function greet(name: string, greeting = "Hello"): string {
  return greeting + ", " + name;
}

console.log(greet("Asha", "Namaste", "!")); // @error
// endregion
export {};
