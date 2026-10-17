// expect-error: TS2345
// expect-message: Argument of type '"medium"' is not assignable to parameter of type 'Strength'.
// region: code
type Strength = "mild" | "strong";

function brew(strength: Strength): string {
  return strength === "strong" ? "Two shots" : "One shot";
}

console.log(brew("strong"));
console.log(brew("medium")); // @error
// endregion
export {};
