// expect-error: TS2339
// expect-message: Property 'toUpperCase' does not exist on type 'number'.
// region: code
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstScore = first([90, 85, 72]);
const firstName = first(["Asha", "Ravi"]);

console.log(firstScore);
console.log(firstScore?.toUpperCase()); // @error
// endregion
export {};
