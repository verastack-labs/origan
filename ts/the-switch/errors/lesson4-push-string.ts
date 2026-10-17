// expect-error: TS2345
// expect-message: Argument of type 'string' is not assignable to parameter of type 'number'.
// region: code
const scores: number[] = [90, 85, 72];
scores.push("77"); // @error

let total = 0;
for (const score of scores) {
  total += score;
}
console.log(total);
// endregion
export {};
